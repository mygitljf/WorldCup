export type BetFailure =
  | { readonly kind: "inactive_odds" }
  | { readonly kind: "insufficient_balance"; readonly balanceCents: number }
  | { readonly kind: "invalid_stake" }
  | { readonly kind: "market_locked" }
  | { readonly kind: "not_found" }

export type StarBonusFailure =
  | { readonly kind: "already_claimed" }
  | { readonly kind: "github_unavailable" }
  | { readonly kind: "not_starred" }
  | { readonly kind: "user_not_found" }

export function betFailureMessage(failure: BetFailure): string {
  switch (failure.kind) {
    case "inactive_odds":
      return "These odds are no longer available."
    case "insufficient_balance":
      return "Your virtual bankroll is not high enough for this stake."
    case "invalid_stake":
      return "Stake must be at least $1.00 of virtual bankroll."
    case "market_locked":
      return "This market is locked for virtual betting."
    case "not_found":
      return "The selected market could not be found."
  }
}

export function starBonusFailureMessage(failure: StarBonusFailure): string {
  switch (failure.kind) {
    case "already_claimed":
      return "This GitHub star bonus was already claimed."
    case "github_unavailable":
      return "GitHub verification is temporarily unavailable."
    case "not_starred":
      return "Star the repository first, then try again."
    case "user_not_found":
      return "Demo user could not be found."
  }
}
