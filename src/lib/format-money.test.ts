import { describe, expect, it } from "vitest"
import { formatMoney } from "./format-money"

describe("formatMoney", () => {
  it("formats cents as dollars when rendering virtual bankroll", () => {
    const amount = formatMoney(100000)

    expect(amount).toBe("$1,000.00")
  })
})
