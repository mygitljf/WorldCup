import { betFailureMessage, starBonusFailureMessage, type BetFailure, type StarBonusFailure } from "@/domain/errors"

export function jsonOk<TBody>(body: TBody, init?: ResponseInit): Response {
  return Response.json(body, init)
}

export function jsonNotFound(message: string): Response {
  return Response.json({ error: message }, { status: 404 })
}

export function jsonBadRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 })
}

export function jsonBetFailure(error: BetFailure): Response {
  const status = error.kind === "insufficient_balance" ? 409 : 422
  return Response.json({ error: betFailureMessage(error), kind: error.kind }, { status })
}

export function jsonStarFailure(error: StarBonusFailure): Response {
  const status = error.kind === "already_claimed" ? 409 : 422
  return Response.json({ error: starBonusFailureMessage(error), kind: error.kind }, { status })
}
