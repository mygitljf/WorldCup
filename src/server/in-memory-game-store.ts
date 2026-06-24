import type { BetFailure, StarBonusFailure } from "@/domain/errors"
import type {
  GameStore,
  PlaceBetInput,
  PlaceBetSuccess,
  SettlementSummary,
  StarBonusSuccess,
} from "@/domain/game-store"
import { GITHUB_STAR_BONUS_CENTS, MIN_STAKE_CENTS, potentialPayoutCents } from "@/domain/money"
import {
  BetStatus,
  LedgerEntryType,
  MarketStatus,
  MatchStatus,
  OutcomeType,
  type Bet,
  type LeaderboardEntry,
  type LedgerEntry,
  type Market,
  type Match,
  type MatchCard,
  type OddsSnapshot,
  type Outcome,
  type PublicHistoryItem,
  type PublicUserHistory,
  type StarBonusClaim,
  type Team,
  type User,
  type UserSummary,
} from "@/domain/types"
import { type Result, err, ok } from "@/lib/result"
import { findBetParts, toBetHistoryItem, toMatchCard } from "./store-lookups"
import { balanceFor, profitFor, toLeaderboardEntry } from "./store-projections"

export type StoreState = {
  readonly users: User[]
  readonly teams: Team[]
  readonly matches: Match[]
  readonly markets: Market[]
  readonly outcomes: Outcome[]
  readonly odds: OddsSnapshot[]
  readonly bets: Bet[]
  readonly ledgerEntries: LedgerEntry[]
  readonly claims: StarBonusClaim[]
}

export class InMemoryGameStore implements GameStore {
  readonly demoUserId = "user_demo"
  private readonly state: StoreState

  constructor(state: StoreState) {
    this.state = state
  }

  getUserSummary(userId: string): UserSummary {
    const user = this.state.users.find((candidate) => candidate.id === userId) ?? this.state.users[0]
    if (!user) throw new Error("Seed data must include a demo user")
    const unsettledStakeCents = this.state.bets
      .filter((bet) => bet.userId === user.id && bet.status === BetStatus.Placed)
      .reduce((total, bet) => total + bet.stakeCents, 0)
    return {
      user,
      balanceCents: balanceFor(this.state, user.id),
      profitCents: profitFor(this.state, user.id),
      unsettledStakeCents,
      starBonusClaimed: this.state.claims.some((claim) => claim.userId === user.id),
    }
  }

  listMatches(): readonly MatchCard[] {
    return this.state.matches.map((match) => toMatchCard(this.state, match)).filter((card) => card !== undefined)
  }

  getMatch(matchId: string): MatchCard | undefined {
    const match = this.state.matches.find((candidate) => candidate.id === matchId)
    return match ? toMatchCard(this.state, match) : undefined
  }

  listUserBets(userId: string) {
    return this.state.bets
      .filter((bet) => bet.userId === userId)
      .map((bet) => toBetHistoryItem(this.state, bet))
      .filter((item) => item !== undefined)
      .slice()
      .sort((left, right) => right.placedAt.localeCompare(left.placedAt))
  }

  placeBet(input: PlaceBetInput): Result<PlaceBetSuccess, BetFailure> {
    const existing = this.state.bets.find(
      (bet) => bet.userId === input.userId && bet.idempotencyKey === input.idempotencyKey,
    )
    if (existing) return this.existingBetResult(input.userId, existing)
    const parts = findBetParts(this.state, input.oddsSnapshotId)
    if (!parts) return err({ kind: "not_found" })
    if (input.stakeCents < MIN_STAKE_CENTS) return err({ kind: "invalid_stake" })
    if (!parts.odds.isActive) return err({ kind: "inactive_odds" })
    if (parts.match.status !== MatchStatus.Scheduled) return err({ kind: "market_locked" })
    const market = this.state.markets.find((candidate) => candidate.matchId === parts.match.id)
    if (!market || market.status !== MarketStatus.Open) return err({ kind: "market_locked" })
    const balanceCents = balanceFor(this.state, input.userId)
    if (input.stakeCents > balanceCents) return err({ kind: "insufficient_balance", balanceCents })
    const bet = this.createBet(input, parts.odds.decimalOdds)
    this.state.bets.push(bet)
    this.state.ledgerEntries.push(this.ledgerFor(bet.userId, LedgerEntryType.BetStake, -bet.stakeCents, bet.id))
    return this.existingBetResult(input.userId, bet)
  }

  settleDemoMatch(matchId: string): SettlementSummary {
    const matchIndex = this.state.matches.findIndex((candidate) => candidate.id === matchId)
    const match = this.state.matches[matchIndex]
    if (!match) return { matchId, settledBets: 0, winningOutcome: OutcomeType.Home }
    this.state.matches[matchIndex] = this.finalMatch(match)
    this.lockMarkets(matchId)
    return this.settlePlacedBets(matchId)
  }

  getLeaderboard(limit: number): readonly LeaderboardEntry[] {
    return this.state.users
      .map((user) => toLeaderboardEntry(this.state, user))
      .slice()
      .sort((left, right) => this.compareLeaderboard(left, right))
      .slice(0, limit)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  }

  getPublicHistory(publicHandle: string): PublicUserHistory | undefined {
    const user = this.state.users.find((candidate) => candidate.publicHandle === publicHandle)
    if (!user) return undefined
    const leaderboard = this.getLeaderboard(this.state.users.length).find((entry) => entry.publicHandle === publicHandle)
    const history = this.publicHistoryFor(user.id)
    return leaderboard
      ? { user: this.publicUserFor(user), leaderboard, history }
      : { user: this.publicUserFor(user), history }
  }

  async claimStarBonus(userId: string): Promise<Result<StarBonusSuccess, StarBonusFailure>> {
    const user = this.state.users.find((candidate) => candidate.id === userId)
    if (!user) return err({ kind: "user_not_found" })
    if (this.state.claims.some((claim) => claim.userId === user.id)) return err({ kind: "already_claimed" })
    const claim = this.createClaim(user.id)
    this.state.claims.push(claim)
    this.state.ledgerEntries.push(
      this.ledgerFor(user.id, LedgerEntryType.GithubStarBonus, GITHUB_STAR_BONUS_CENTS, claim.id),
    )
    return ok({ summary: this.getUserSummary(user.id), bonusCents: GITHUB_STAR_BONUS_CENTS })
  }

  private existingBetResult(userId: string, bet: Bet): Result<PlaceBetSuccess, BetFailure> {
    const historyItem = toBetHistoryItem(this.state, bet)
    return historyItem ? ok({ bet: historyItem, summary: this.getUserSummary(userId) }) : err({ kind: "not_found" })
  }

  private createBet(input: PlaceBetInput, decimalOdds: number): Bet {
    return {
      id: `bet_${this.state.bets.length + 1}`,
      userId: input.userId,
      oddsSnapshotId: input.oddsSnapshotId,
      stakeCents: input.stakeCents,
      potentialPayoutCents: potentialPayoutCents(input.stakeCents, decimalOdds),
      status: BetStatus.Placed,
      placedAt: new Date().toISOString(),
      idempotencyKey: input.idempotencyKey,
    }
  }

  private settlePlacedBets(matchId: string): SettlementSummary {
    let settledBets = 0
    this.state.bets.forEach((bet, index) => {
      const parts = findBetParts(this.state, bet.oddsSnapshotId)
      if (!parts || parts.match.id !== matchId || bet.status !== BetStatus.Placed) return
      const won = parts.outcome.type === OutcomeType.Home
      this.state.bets[index] = { ...bet, status: won ? BetStatus.SettledWin : BetStatus.SettledLoss }
      if (won && !this.hasLedgerRef(LedgerEntryType.BetPayout, bet.id)) {
        this.state.ledgerEntries.push(
          this.ledgerFor(bet.userId, LedgerEntryType.BetPayout, bet.potentialPayoutCents, bet.id),
        )
      }
      settledBets += 1
    })
    return { matchId, settledBets, winningOutcome: OutcomeType.Home }
  }

  private lockMarkets(matchId: string): void {
    this.state.markets.forEach((market, index) => {
      if (market.matchId === matchId) this.state.markets[index] = { ...market, status: MarketStatus.Settled }
    })
  }

  private finalMatch(match: Match): Match {
    return { ...match, status: MatchStatus.Final, resultOutcomeType: OutcomeType.Home, score: "2-1" }
  }

  private compareLeaderboard(left: LeaderboardEntry, right: LeaderboardEntry): number {
    return (
      right.profitCents - left.profitCents ||
      right.winRate - left.winRate ||
      right.settledBets - left.settledBets ||
      left.publicHandle.localeCompare(right.publicHandle)
    )
  }

  private publicHistoryFor(userId: string): readonly PublicHistoryItem[] {
    return this.listUserBets(userId).map((bet) => ({
      matchLabel: bet.matchLabel,
      marketLabel: bet.marketLabel,
      outcomeLabel: bet.outcomeLabel,
      stakeCents: bet.stakeCents,
      decimalOdds: bet.decimalOdds,
      result: bet.status,
      placedAt: bet.placedAt,
    }))
  }

  private publicUserFor(user: User): PublicUserHistory["user"] {
    return user.githubLogin
      ? { displayName: user.displayName, publicHandle: user.publicHandle, githubLogin: user.githubLogin }
      : { displayName: user.displayName, publicHandle: user.publicHandle }
  }

  private createClaim(userId: string): StarBonusClaim {
    return {
      id: `claim_${this.state.claims.length + 1}`,
      userId,
      githubUserId: `github_${userId}`,
      repo: "WorldCup",
      verifiedAt: new Date().toISOString(),
    }
  }

  private ledgerFor(userId: string, type: LedgerEntryType, amountCents: number, refId: string): LedgerEntry {
    return { id: `ledger_${this.state.ledgerEntries.length + 1}`, userId, type, amountCents, refId, createdAt: new Date().toISOString() }
  }

  private hasLedgerRef(type: LedgerEntryType, refId: string): boolean {
    return this.state.ledgerEntries.some((entry) => entry.type === type && entry.refId === refId)
  }
}
