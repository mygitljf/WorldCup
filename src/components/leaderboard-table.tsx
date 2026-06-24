import Link from "next/link"
import type { LeaderboardEntry } from "@/domain/types"
import { MoneyAmount } from "./money-amount"

export function LeaderboardTable({ entries }: Readonly<{ entries: readonly LeaderboardEntry[] }>) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-cream shadow-panel">
      {entries.map((entry) => (
        <Link className="grid gap-3 border-ink/10 border-b p-5 text-ink transition hover:bg-lime/20 md:grid-cols-[60px_1fr_160px_120px]" href={`/users/${entry.publicHandle}`} key={entry.publicHandle}>
          <span className="text-2xl font-black tabular">#{entry.rank}</span>
          <span>
            <strong className="block text-lg">{entry.displayName}</strong>
            <span className="text-sm text-ink/60">@{entry.publicHandle}</span>
          </span>
          <span className="font-black tabular text-turf">
            <MoneyAmount cents={entry.profitCents} />
          </span>
          <span className="text-sm font-bold text-ink/60">{Math.round(entry.winRate * 100)}% win rate</span>
        </Link>
      ))}
    </div>
  )
}
