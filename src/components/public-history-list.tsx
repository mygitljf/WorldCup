import type { PublicHistoryItem } from "@/domain/types"
import { MoneyAmount } from "./money-amount"
import { StatusPill } from "./ui/status-pill"

export function PublicHistoryList({ history }: Readonly<{ history: readonly PublicHistoryItem[] }>) {
  return (
    <div className="grid gap-3">
      {history.map((item) => (
        <article className="rounded-3xl bg-cream p-5 text-ink shadow-panel" key={`${item.matchLabel}-${item.placedAt}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-black">{item.matchLabel}</h3>
            <StatusPill label={item.result} />
          </div>
          <p className="mt-2 text-sm text-ink/65">{item.marketLabel} · {item.outcomeLabel}</p>
          <p className="mt-3 font-bold tabular">
            Stake <MoneyAmount cents={item.stakeCents} /> at {item.decimalOdds.toFixed(2)}
          </p>
        </article>
      ))}
    </div>
  )
}
