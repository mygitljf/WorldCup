import type { Result } from "@/lib/result"
import type { BetFailure, StarBonusFailure } from "./errors"
import type { BetHistoryItem, LeaderboardEntry, MatchCard, PublicUserHistory, UserSummary } from "./types"

export type PlaceBetInput = {
  readonly userId: string
  readonly oddsSnapshotId: string
  readonly stakeCents: number
  readonly idempotencyKey: string
}

export type PlaceBetSuccess = {
  readonly bet: BetHistoryItem
  readonly summary: UserSummary
}

export type SettlementSummary = {
  readonly matchId: string
  readonly settledBets: number
  readonly winningOutcome: string
}

export type StarBonusSuccess = {
  readonly summary: UserSummary
  readonly bonusCents: number
}

export interface GameStore {
  readonly demoUserId: string
  getUserSummary(userId: string): UserSummary
  listMatches(): readonly MatchCard[]
  getMatch(matchId: string): MatchCard | undefined
  listUserBets(userId: string): readonly BetHistoryItem[]
  placeBet(input: PlaceBetInput): Result<PlaceBetSuccess, BetFailure>
  settleDemoMatch(matchId: string): SettlementSummary
  getLeaderboard(limit: number): readonly LeaderboardEntry[]
  getPublicHistory(publicHandle: string): PublicUserHistory | undefined
  claimStarBonus(userId: string): Promise<Result<StarBonusSuccess, StarBonusFailure>>
}
