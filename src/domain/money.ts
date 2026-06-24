export const INITIAL_GRANT_CENTS = 100_000
export const GITHUB_STAR_BONUS_CENTS = 100_000
export const MIN_STAKE_CENTS = 100

export function potentialPayoutCents(stakeCents: number, decimalOdds: number): number {
  return Math.round(stakeCents * decimalOdds)
}
