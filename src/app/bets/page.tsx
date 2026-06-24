import { MoneyAmount } from "@/components/money-amount"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { StatusPill } from "@/components/ui/status-pill"
import { getAppStore } from "@/server/app-store"

export default function BetsPage() {
  const store = getAppStore()
  const bets = store.listUserBets(store.demoUserId)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Bet history</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Your virtual operations</h1>
        <section className="mt-8 grid gap-4">
          {bets.map((bet) => (
            <article className="rounded-[2rem] bg-cream p-5 text-ink shadow-panel" key={bet.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black">{bet.matchLabel}</h2>
                <StatusPill label={bet.status} />
              </div>
              <p className="mt-2 text-ink/65">{bet.marketLabel} · {bet.outcomeLabel}</p>
              <p className="mt-3 font-bold tabular">
                Stake <MoneyAmount cents={bet.stakeCents} /> · Odds {bet.decimalOdds.toFixed(2)} · Potential <MoneyAmount cents={bet.potentialPayoutCents} />
              </p>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
