import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { MatchCard } from "@/components/match-card"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { getAppStore } from "@/server/app-store"

export default function MatchesPage() {
  const matches = getAppStore().listMatches()
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Mock odds board</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">2026 World Cup fixtures</h1>
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {matches.map((card) => (
            <MatchCard card={card} key={card.match.id} />
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
