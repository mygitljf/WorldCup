import Link from "next/link"
import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[calc(100dvh-180px)] max-w-6xl flex-col justify-center px-6 py-12 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.4em] text-lime">WorldCup Simulator</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight md:text-7xl">
          Turn $1,000 of virtual bankroll into World Cup bragging rights.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/82">
          A no-real-money prediction simulator with mock 2026 fixtures, market odds, virtual betting,
          settlement, star bonus rewards, and a Top 15 public leaderboard.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link className="rounded-full bg-lime px-6 py-3 font-black text-ink" href="/matches">
            Start betting virtually
          </Link>
          <Link className="rounded-full border border-cream/30 px-6 py-3 font-bold" href="/leaderboard">
            View Top 15
          </Link>
        </div>
        <div className="mt-10 max-w-3xl">
          <DisclaimerBanner />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
