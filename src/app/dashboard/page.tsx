import Link from "next/link"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { MoneyAmount } from "@/components/money-amount"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { getAppStore } from "@/server/app-store"

export default function DashboardPage() {
  const store = getAppStore()
  const summary = store.getUserSummary(store.demoUserId)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Demo user</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Virtual bankroll dashboard</h1>
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <MetricCard label="Current balance" value={<MoneyAmount cents={summary.balanceCents} />} />
          <MetricCard label="Net profit" value={<MoneyAmount cents={summary.profitCents} />} />
          <MetricCard label="Unsettled stake" value={<MoneyAmount cents={summary.unsettledStakeCents} />} />
        </section>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <DisclaimerBanner />
          <Link className="rounded-3xl bg-lime p-6 font-black text-ink" href="/matches">
            Place another virtual bet
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

function MetricCard({ label, value }: Readonly<{ label: string; value: React.ReactNode }>) {
  return (
    <article className="rounded-[2rem] bg-cream p-6 text-ink shadow-panel">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-ink/55">{label}</p>
      <p className="mt-3 text-4xl font-black tabular">{value}</p>
    </article>
  )
}
