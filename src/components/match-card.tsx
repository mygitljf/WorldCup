import Link from "next/link"
import type { MatchCard as MatchCardData } from "@/domain/types"
import { StatusPill } from "./ui/status-pill"

export function MatchCard({ card }: Readonly<{ card: MatchCardData }>) {
  return (
    <article className="rounded-[2rem] bg-cream p-5 shadow-panel">
      <div className="flex items-center justify-between gap-4">
        <StatusPill label={card.match.status} />
        <span className="text-sm font-bold text-ink/55">{card.match.stage}</span>
      </div>
      <h2 className="mt-5 text-2xl font-black text-ink">
        {card.homeTeam.name} vs {card.awayTeam.name}
      </h2>
      <p className="mt-2 text-sm text-ink/65">{card.match.venue}</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {card.outcomes.map((item) => (
          <div className="rounded-2xl bg-turf/10 p-3 text-center" key={item.outcome.id}>
            <p className="text-xs font-bold text-ink/60">{item.outcome.label}</p>
            <p className="mt-1 text-xl font-black tabular text-ink">{item.odds.decimalOdds.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <Link className="mt-5 block rounded-full bg-turf px-5 py-3 text-center font-black text-cream" href={`/matches/${card.match.id}`}>
        Open bet slip
      </Link>
    </article>
  )
}
