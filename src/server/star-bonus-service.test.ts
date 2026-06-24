import { createSeedState } from "@/data/mock-seed"
import { GITHUB_STAR_BONUS_CENTS, INITIAL_GRANT_CENTS } from "@/domain/money"
import { InMemoryGameStore } from "./in-memory-game-store"
import { describe, expect, it } from "vitest"

describe("GitHub star bonus", () => {
  it("grants a one-time virtual bonus", async () => {
    const store = new InMemoryGameStore(createSeedState())

    const result = await store.claimStarBonus(store.demoUserId)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.bonusCents).toBe(GITHUB_STAR_BONUS_CENTS)
      expect(result.value.summary.balanceCents).toBe(INITIAL_GRANT_CENTS + GITHUB_STAR_BONUS_CENTS)
    }
  })

  it("rejects duplicate claims", async () => {
    const store = new InMemoryGameStore(createSeedState())

    await store.claimStarBonus(store.demoUserId)
    const duplicate = await store.claimStarBonus(store.demoUserId)

    expect(duplicate.ok).toBe(false)
    if (!duplicate.ok) {
      expect(duplicate.error.kind).toBe("already_claimed")
    }
  })
})
