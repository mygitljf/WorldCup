import type { Bet, BetHistoryItem, Match, MatchCard, OddsSnapshot, Outcome, Team } from "@/domain/types"
import type { StoreState } from "./in-memory-game-store"

export type BetParts = {
  readonly odds: OddsSnapshot
  readonly outcome: Outcome
  readonly match: Match
  readonly homeTeam: Team
  readonly awayTeam: Team
}

export function toMatchCard(state: StoreState, match: Match): MatchCard | undefined {
  const homeTeam = state.teams.find((team) => team.id === match.homeTeamId)
  const awayTeam = state.teams.find((team) => team.id === match.awayTeamId)
  const market = state.markets.find((candidate) => candidate.matchId === match.id)
  if (!homeTeam || !awayTeam || !market) return undefined
  const outcomes = state.outcomes
    .filter((outcome) => outcome.marketId === market.id)
    .map((outcome) => {
      const odds = state.odds.find((oddsSnapshot) => oddsSnapshot.outcomeId === outcome.id)
      return odds ? { outcome, odds } : undefined
    })
    .filter((item) => item !== undefined)
  return { match, homeTeam, awayTeam, market, outcomes }
}

export function findBetParts(state: StoreState, oddsSnapshotId: string): BetParts | undefined {
  const odds = state.odds.find((candidate) => candidate.id === oddsSnapshotId)
  const outcome = odds ? state.outcomes.find((candidate) => candidate.id === odds.outcomeId) : undefined
  const market = outcome ? state.markets.find((candidate) => candidate.id === outcome.marketId) : undefined
  const match = market ? state.matches.find((candidate) => candidate.id === market.matchId) : undefined
  const homeTeam = match ? state.teams.find((team) => team.id === match.homeTeamId) : undefined
  const awayTeam = match ? state.teams.find((team) => team.id === match.awayTeamId) : undefined
  return odds && outcome && match && homeTeam && awayTeam
    ? { odds, outcome, match, homeTeam, awayTeam }
    : undefined
}

export function toBetHistoryItem(state: StoreState, bet: Bet): BetHistoryItem | undefined {
  const parts = findBetParts(state, bet.oddsSnapshotId)
  if (!parts) return undefined
  return {
    id: bet.id,
    matchLabel: `${parts.homeTeam.name} vs ${parts.awayTeam.name}`,
    marketLabel: "Match result",
    outcomeLabel: parts.outcome.label,
    stakeCents: bet.stakeCents,
    decimalOdds: parts.odds.decimalOdds,
    potentialPayoutCents: bet.potentialPayoutCents,
    status: bet.status,
    placedAt: bet.placedAt,
  }
}
