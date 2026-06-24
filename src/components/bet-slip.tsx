"use client"

import { useState, useTransition } from "react"
import type { MatchCard } from "@/domain/types"
import { formatMoney } from "@/lib/format-money"
import { Button } from "./ui/button"

export function BetSlip({ card }: Readonly<{ card: MatchCard }>) {
  const [selectedOddsId, setSelectedOddsId] = useState(card.outcomes[0]?.odds.id ?? "")
  const [stakeCents, setStakeCents] = useState(10_000)
  const [message, setMessage] = useState("Choose an outcome and stake virtual credits.")
  const [isPending, startTransition] = useTransition()
  const selected = card.outcomes.find((item) => item.odds.id === selectedOddsId)
  const potential = selected ? Math.round(stakeCents * selected.odds.decimalOdds) : 0

  function placeBet() {
    startTransition(async () => {
      const response = await fetch("/api/bets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ oddsSnapshotId: selectedOddsId, stakeCents, idempotencyKey: crypto.randomUUID() }),
      })
      const body = (await response.json()) as { readonly error?: string }
      setMessage(response.ok ? "Virtual bet placed. Check dashboard or settle the demo match." : (body.error ?? "Bet failed."))
    })
  }

  function settleMatch() {
    startTransition(async () => {
      const response = await fetch("/api/demo/settle", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ matchId: card.match.id }),
      })
      setMessage(response.ok ? "Demo settlement complete. Leaderboard updated." : "Settlement failed.")
    })
  }

  return (
    <section className="rounded-[2rem] bg-cream p-5 shadow-panel">
      <h2 className="text-2xl font-black text-ink">Virtual bet slip</h2>
      <div className="mt-5 grid gap-3">
        {card.outcomes.map((item) => (
          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-turf/15 p-4 text-ink" key={item.odds.id}>
            <span>
              <span className="block font-black">{item.outcome.label}</span>
              <span className="text-sm text-ink/60">MockBook odds</span>
            </span>
            <span className="flex items-center gap-3 font-black tabular">
              {item.odds.decimalOdds.toFixed(2)}
              <input checked={selectedOddsId === item.odds.id} name="outcome" onChange={() => setSelectedOddsId(item.odds.id)} type="radio" />
            </span>
          </label>
        ))}
      </div>
      <label className="mt-5 block text-sm font-black uppercase tracking-[0.2em] text-ink/60" htmlFor="stake">
        Stake cents
      </label>
      <input className="mt-2 w-full rounded-2xl border border-turf/20 bg-white px-4 py-3 text-ink" id="stake" min="100" onChange={(event) => setStakeCents(Number(event.target.value))} type="number" value={stakeCents} />
      <p className="mt-4 font-black text-ink">Potential virtual payout: {formatMoney(potential)}</p>
      <p className="mt-2 text-sm text-ink/65">{message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={isPending || !selected} onClick={placeBet} type="button">
          Place virtual bet
        </Button>
        <Button disabled={isPending} onClick={settleMatch} tone="secondary" type="button">
          Settle demo match
        </Button>
      </div>
    </section>
  )
}
