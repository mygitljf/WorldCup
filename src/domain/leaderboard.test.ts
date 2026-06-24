import { createSeedState } from "@/data/mock-seed"
import { InMemoryGameStore } from "@/server/in-memory-game-store"
import { describe, expect, it } from "vitest"

describe("leaderboard", () => {
  it("returns the current Top 15 by virtual profit", () => {
    const store = new InMemoryGameStore(createSeedState())
    const leaderboard = store.getLeaderboard(15)

    expect(leaderboard).toHaveLength(15)
    expect(leaderboard[0]?.profitCents).toBeGreaterThanOrEqual(leaderboard[1]?.profitCents ?? 0)
  })

  it("exposes only public history fields", () => {
    const store = new InMemoryGameStore(createSeedState())
    const history = store.getPublicHistory("sharp-kick")

    expect(history?.user.publicHandle).toBe("sharp-kick")
    expect(history?.history[0]).toEqual(
      expect.objectContaining({
        decimalOdds: expect.any(Number),
        matchLabel: expect.any(String),
        outcomeLabel: expect.any(String),
        stakeCents: expect.any(Number),
      }),
    )
  })
})
