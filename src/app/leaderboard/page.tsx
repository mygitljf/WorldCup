import { LeaderboardTable } from "@/components/leaderboard-table"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { getAppStore } from "@/server/app-store"

export default function LeaderboardPage() {
  const leaderboard = getAppStore().getLeaderboard(15)
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Current profit</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Top 15 virtual traders</h1>
        <p className="mt-4 max-w-2xl text-cream/75">Ranking excludes initial grants and star bonus principal, so the table reflects simulated betting performance.</p>
        <section className="mt-8">
          <LeaderboardTable entries={leaderboard} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
