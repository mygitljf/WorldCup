import { BetStatus, LedgerEntryType, type LeaderboardEntry, type User } from "@/domain/types"
import type { StoreState } from "./in-memory-game-store"

export function balanceFor(state: StoreState, userId: string): number {
  return state.ledgerEntries
    .filter((entry) => entry.userId === userId)
    .reduce((total, entry) => total + entry.amountCents, 0)
}

export function profitFor(state: StoreState, userId: string): number {
  return state.ledgerEntries
    .filter((entry) => entry.userId === userId)
    .filter(
      (entry) =>
        entry.type !== LedgerEntryType.InitialGrant && entry.type !== LedgerEntryType.GithubStarBonus,
    )
    .reduce((total, entry) => total + entry.amountCents, 0)
}

export function toLeaderboardEntry(state: StoreState, user: User): LeaderboardEntry {
  const settled = state.bets.filter(
    (bet) => bet.userId === user.id && bet.status !== BetStatus.Placed && bet.status !== BetStatus.Voided,
  )
  const wins = settled.filter((bet) => bet.status === BetStatus.SettledWin).length
  return {
    rank: 0,
    publicHandle: user.publicHandle,
    displayName: user.displayName,
    profitCents: profitFor(state, user.id),
    balanceCents: balanceFor(state, user.id),
    winRate: settled.length === 0 ? 0 : wins / settled.length,
    settledBets: settled.length,
  }
}
