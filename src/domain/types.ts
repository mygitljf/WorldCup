export const MatchStatus = {
  Final: "final",
  Live: "live",
  Scheduled: "scheduled",
} as const

export type MatchStatus = (typeof MatchStatus)[keyof typeof MatchStatus]

export const MarketStatus = {
  Locked: "locked",
  Open: "open",
  Settled: "settled",
} as const

export type MarketStatus = (typeof MarketStatus)[keyof typeof MarketStatus]

export const OutcomeType = {
  Away: "away",
  Draw: "draw",
  Home: "home",
} as const

export type OutcomeType = (typeof OutcomeType)[keyof typeof OutcomeType]

export const BetStatus = {
  Placed: "placed",
  SettledLoss: "settled_loss",
  SettledWin: "settled_win",
  Voided: "voided",
} as const

export type BetStatus = (typeof BetStatus)[keyof typeof BetStatus]

export const LedgerEntryType = {
  BetPayout: "BET_PAYOUT",
  BetRefund: "BET_REFUND",
  BetStake: "BET_STAKE",
  GithubStarBonus: "GITHUB_STAR_BONUS",
  InitialGrant: "INITIAL_GRANT",
} as const

export type LedgerEntryType = (typeof LedgerEntryType)[keyof typeof LedgerEntryType]

export type User = {
  readonly id: string
  readonly publicHandle: string
  readonly displayName: string
  readonly githubLogin?: string
}

export type Team = {
  readonly id: string
  readonly name: string
  readonly code: string
  readonly group: string
}

export type Match = {
  readonly id: string
  readonly homeTeamId: string
  readonly awayTeamId: string
  readonly kickoffAt: string
  readonly stage: string
  readonly venue: string
  readonly status: MatchStatus
  readonly resultOutcomeType?: OutcomeType
  readonly score?: string
}

export type Market = {
  readonly id: string
  readonly matchId: string
  readonly type: "1x2"
  readonly label: string
  readonly status: MarketStatus
  readonly lockAt: string
}

export type Outcome = {
  readonly id: string
  readonly marketId: string
  readonly type: OutcomeType
  readonly label: string
}

export type OddsSnapshot = {
  readonly id: string
  readonly outcomeId: string
  readonly bookmaker: string
  readonly decimalOdds: number
  readonly capturedAt: string
  readonly isActive: boolean
}

export type Bet = {
  readonly id: string
  readonly userId: string
  readonly oddsSnapshotId: string
  readonly stakeCents: number
  readonly potentialPayoutCents: number
  readonly status: BetStatus
  readonly placedAt: string
  readonly settledAt?: string
  readonly idempotencyKey: string
}

export type LedgerEntry = {
  readonly id: string
  readonly userId: string
  readonly type: LedgerEntryType
  readonly amountCents: number
  readonly refId: string
  readonly createdAt: string
}

export type StarBonusClaim = {
  readonly id: string
  readonly userId: string
  readonly githubUserId: string
  readonly repo: string
  readonly verifiedAt: string
}

export type MatchCard = {
  readonly match: Match
  readonly homeTeam: Team
  readonly awayTeam: Team
  readonly market: Market
  readonly outcomes: readonly OutcomeWithOdds[]
}

export type OutcomeWithOdds = {
  readonly outcome: Outcome
  readonly odds: OddsSnapshot
}

export type UserSummary = {
  readonly user: User
  readonly balanceCents: number
  readonly profitCents: number
  readonly unsettledStakeCents: number
  readonly starBonusClaimed: boolean
}

export type BetHistoryItem = {
  readonly id: string
  readonly matchLabel: string
  readonly marketLabel: string
  readonly outcomeLabel: string
  readonly stakeCents: number
  readonly decimalOdds: number
  readonly potentialPayoutCents: number
  readonly status: BetStatus
  readonly placedAt: string
}

export type LeaderboardEntry = {
  readonly rank: number
  readonly publicHandle: string
  readonly displayName: string
  readonly profitCents: number
  readonly balanceCents: number
  readonly winRate: number
  readonly settledBets: number
}

export type PublicHistoryItem = {
  readonly matchLabel: string
  readonly marketLabel: string
  readonly outcomeLabel: string
  readonly stakeCents: number
  readonly decimalOdds: number
  readonly result: BetStatus
  readonly placedAt: string
}

export type PublicUserHistory = {
  readonly user: Pick<User, "displayName" | "publicHandle" | "githubLogin">
  readonly leaderboard?: LeaderboardEntry
  readonly history: readonly PublicHistoryItem[]
}
