import { GITHUB_STAR_BONUS_CENTS, INITIAL_GRANT_CENTS, potentialPayoutCents } from "@/domain/money"
import {
  BetStatus,
  LedgerEntryType,
  MarketStatus,
  MatchStatus,
  OutcomeType,
  type Bet,
  type LedgerEntry,
  type Market,
  type Match,
  type OddsSnapshot,
  type Outcome,
  type StarBonusClaim,
  type Team,
  type User,
} from "@/domain/types"
import type { StoreState } from "@/server/in-memory-game-store"

const createdAt = "2026-06-01T12:00:00.000Z"

const users: readonly User[] = [
  { id: "user_demo", publicHandle: "demo-manager", displayName: "Demo Manager", githubLogin: "demo" },
  { id: "user_01", publicHandle: "sharp-kick", displayName: "Sharp Kick", githubLogin: "sharpkick" },
  { id: "user_02", publicHandle: "north-goal", displayName: "North Goal" },
  { id: "user_03", publicHandle: "odds-runner", displayName: "Odds Runner" },
  { id: "user_04", publicHandle: "late-equalizer", displayName: "Late Equalizer" },
  { id: "user_05", publicHandle: "clean-sheet", displayName: "Clean Sheet" },
  { id: "user_06", publicHandle: "corner-flag", displayName: "Corner Flag" },
  { id: "user_07", publicHandle: "tactical-nine", displayName: "Tactical Nine" },
  { id: "user_08", publicHandle: "golden-boot", displayName: "Golden Boot" },
  { id: "user_09", publicHandle: "box-to-box", displayName: "Box To Box" },
  { id: "user_10", publicHandle: "group-winner", displayName: "Group Winner" },
  { id: "user_11", publicHandle: "xg-oracle", displayName: "xG Oracle" },
  { id: "user_12", publicHandle: "penalty-spot", displayName: "Penalty Spot" },
  { id: "user_13", publicHandle: "press-trap", displayName: "Press Trap" },
  { id: "user_14", publicHandle: "wide-overload", displayName: "Wide Overload" },
  { id: "user_15", publicHandle: "keeper-sweep", displayName: "Keeper Sweep" },
  { id: "user_16", publicHandle: "final-third", displayName: "Final Third" },
  { id: "user_17", publicHandle: "high-line", displayName: "High Line" },
  { id: "user_18", publicHandle: "low-block", displayName: "Low Block" },
]

const teams: readonly Team[] = [
  { id: "team_mex", name: "Mexico", code: "MEX", group: "A" },
  { id: "team_zaf", name: "South Africa", code: "RSA", group: "A" },
  { id: "team_can", name: "Canada", code: "CAN", group: "B" },
  { id: "team_jpn", name: "Japan", code: "JPN", group: "B" },
  { id: "team_usa", name: "United States", code: "USA", group: "C" },
  { id: "team_mar", name: "Morocco", code: "MAR", group: "C" },
  { id: "team_bra", name: "Brazil", code: "BRA", group: "D" },
  { id: "team_ger", name: "Germany", code: "GER", group: "D" },
]

const matches: readonly Match[] = [
  {
    id: "match_1",
    homeTeamId: "team_mex",
    awayTeamId: "team_zaf",
    kickoffAt: "2026-06-11T19:00:00.000Z",
    stage: "Group A",
    venue: "Estadio Azteca",
    status: MatchStatus.Scheduled,
  },
  {
    id: "match_2",
    homeTeamId: "team_can",
    awayTeamId: "team_jpn",
    kickoffAt: "2026-06-12T01:00:00.000Z",
    stage: "Group B",
    venue: "BC Place",
    status: MatchStatus.Scheduled,
  },
  {
    id: "match_3",
    homeTeamId: "team_usa",
    awayTeamId: "team_mar",
    kickoffAt: "2026-06-13T00:00:00.000Z",
    stage: "Group C",
    venue: "SoFi Stadium",
    status: MatchStatus.Scheduled,
  },
  {
    id: "match_4",
    homeTeamId: "team_bra",
    awayTeamId: "team_ger",
    kickoffAt: "2026-06-14T20:00:00.000Z",
    stage: "Group D",
    venue: "MetLife Stadium",
    status: MatchStatus.Final,
    resultOutcomeType: OutcomeType.Home,
    score: "2-1",
  },
]

function buildMarkets(): readonly Market[] {
  return matches.map((match) => ({
    id: `market_${match.id}`,
    matchId: match.id,
    type: "1x2",
    label: "Match result",
    status: match.status === MatchStatus.Final ? MarketStatus.Settled : MarketStatus.Open,
    lockAt: match.kickoffAt,
  }))
}

function buildOutcomes(markets: readonly Market[]): readonly Outcome[] {
  return markets.flatMap((market) => [
    { id: `outcome_${market.matchId}_home`, marketId: market.id, type: OutcomeType.Home, label: "Home win" },
    { id: `outcome_${market.matchId}_draw`, marketId: market.id, type: OutcomeType.Draw, label: "Draw" },
    { id: `outcome_${market.matchId}_away`, marketId: market.id, type: OutcomeType.Away, label: "Away win" },
  ])
}

function buildOdds(outcomes: readonly Outcome[]): readonly OddsSnapshot[] {
  const prices: Record<OutcomeType, number> = { away: 3.2, draw: 3.45, home: 2.08 }
  return outcomes.map((outcome) => ({
    id: `odds_${outcome.id}`,
    outcomeId: outcome.id,
    bookmaker: "MockBook",
    decimalOdds: prices[outcome.type],
    capturedAt: createdAt,
    isActive: true,
  }))
}

function buildLedgerAndBets(odds: readonly OddsSnapshot[]): {
  readonly bets: readonly Bet[]
  readonly ledgerEntries: readonly LedgerEntry[]
  readonly claims: readonly StarBonusClaim[]
} {
  const ledgers: LedgerEntry[] = []
  const bets: Bet[] = []
  const claims: StarBonusClaim[] = []
  const settledOdds = odds.find((oddsSnapshot) => oddsSnapshot.outcomeId === "outcome_match_4_home")
  if (!settledOdds) {
    return { bets, ledgerEntries: ledgers, claims }
  }
  users.forEach((user, index) => {
    ledgers.push({
      id: `ledger_${user.id}_initial`,
      userId: user.id,
      type: LedgerEntryType.InitialGrant,
      amountCents: INITIAL_GRANT_CENTS,
      refId: user.id,
      createdAt,
    })
    if (index > 0 && index % 5 === 0) {
      ledgers.push({
        id: `ledger_${user.id}_star`,
        userId: user.id,
        type: LedgerEntryType.GithubStarBonus,
        amountCents: GITHUB_STAR_BONUS_CENTS,
        refId: user.id,
        createdAt,
      })
      claims.push({
        id: `claim_${user.id}`,
        userId: user.id,
        githubUserId: `github_${user.id}`,
        repo: "WorldCup",
        verifiedAt: createdAt,
      })
    }
    if (index === 0) {
      return
    }
    const stakeCents = 4_000 + index * 300
    const won = index % 4 !== 0
    const betId = `bet_seed_${index}`
    const status = won ? BetStatus.SettledWin : BetStatus.SettledLoss
    bets.push({
      id: betId,
      userId: user.id,
      oddsSnapshotId: settledOdds.id,
      stakeCents,
      potentialPayoutCents: potentialPayoutCents(stakeCents, settledOdds.decimalOdds),
      status,
      placedAt: `2026-06-${String(10 + index).padStart(2, "0")}T12:00:00.000Z`,
      settledAt: "2026-06-14T22:00:00.000Z",
      idempotencyKey: `seed_${index}`,
    })
    ledgers.push({
      id: `ledger_${betId}_stake`,
      userId: user.id,
      type: LedgerEntryType.BetStake,
      amountCents: -stakeCents,
      refId: betId,
      createdAt,
    })
    if (won) {
      ledgers.push({
        id: `ledger_${betId}_payout`,
        userId: user.id,
        type: LedgerEntryType.BetPayout,
        amountCents: potentialPayoutCents(stakeCents, settledOdds.decimalOdds),
        refId: betId,
        createdAt,
      })
    }
  })
  return { bets, ledgerEntries: ledgers, claims }
}

export function createSeedState(): StoreState {
  const markets = buildMarkets()
  const outcomes = buildOutcomes(markets)
  const odds = buildOdds(outcomes)
  const built = buildLedgerAndBets(odds)
  return {
    bets: [...built.bets],
    claims: [...built.claims],
    ledgerEntries: [...built.ledgerEntries],
    markets: [...markets],
    matches: [...matches],
    odds: [...odds],
    outcomes: [...outcomes],
    teams: [...teams],
    users: [...users],
  }
}
