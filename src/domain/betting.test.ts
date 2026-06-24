import { createSeedState } from "@/data/mock-seed"
import { INITIAL_GRANT_CENTS } from "./money"
import { InMemoryGameStore } from "@/server/in-memory-game-store"
import { describe, expect, it } from "vitest"

describe("virtual betting", () => {
  it("deducts stake and binds odds when placing a virtual bet", () => {
    const store = new InMemoryGameStore(createSeedState())
    const match = store.listMatches()[0]
    const odds = match?.outcomes[0]?.odds

    const result = store.placeBet({
      userId: store.demoUserId,
      oddsSnapshotId: odds?.id ?? "missing",
      stakeCents: 10_000,
      idempotencyKey: "bet-once",
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.summary.balanceCents).toBe(INITIAL_GRANT_CENTS - 10_000)
      expect(result.value.bet.decimalOdds).toBe(2.08)
    }
  })

  it("does not double deduct when idempotency key is reused", () => {
    const store = new InMemoryGameStore(createSeedState())
    const odds = store.listMatches()[0]?.outcomes[0]?.odds
    const input = {
      userId: store.demoUserId,
      oddsSnapshotId: odds?.id ?? "missing",
      stakeCents: 10_000,
      idempotencyKey: "same-click",
    }

    const first = store.placeBet(input)
    const second = store.placeBet(input)

    expect(first.ok).toBe(true)
    expect(second.ok).toBe(true)
    expect(store.getUserSummary(store.demoUserId).balanceCents).toBe(INITIAL_GRANT_CENTS - 10_000)
  })

  it("rejects stakes above the virtual bankroll", () => {
    const store = new InMemoryGameStore(createSeedState())
    const odds = store.listMatches()[0]?.outcomes[0]?.odds

    const result = store.placeBet({
      userId: store.demoUserId,
      oddsSnapshotId: odds?.id ?? "missing",
      stakeCents: 200_000,
      idempotencyKey: "too-much",
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe("insufficient_balance")
    }
  })
})
