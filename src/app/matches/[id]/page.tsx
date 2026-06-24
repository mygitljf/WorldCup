import Link from "next/link"
import { BetSlip } from "@/components/bet-slip"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { StatusPill } from "@/components/ui/status-pill"
import { getAppStore } from "@/server/app-store"

type MatchPageProps = {
  readonly params: Promise<{ readonly id: string }>
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params
  const card = getAppStore().getMatch(id)
  if (!card) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-16 text-cream">
          <h1 className="text-4xl font-black">Match not found</h1>
          <Link className="mt-6 inline-block rounded-full bg-lime px-5 py-3 font-black text-ink" href="/matches">
            Back to matches
          </Link>
        </main>
      </>
    )
  }
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-cream lg:grid-cols-[1fr_420px]">
        <section>
          <StatusPill label={card.match.status} />
          <h1 className="mt-5 text-4xl font-black md:text-6xl">
            {card.homeTeam.name} vs {card.awayTeam.name}
          </h1>
          <p className="mt-4 text-lg text-cream/75">
            {card.match.stage} · {card.match.venue} · {new Date(card.match.kickoffAt).toUTCString()}
          </p>
          <div className="mt-8">
            <DisclaimerBanner />
          </div>
        </section>
        <BetSlip card={card} />
      </main>
      <SiteFooter />
    </>
  )
}
