import Link from "next/link"
import { MoneyAmount } from "@/components/money-amount"
import { PublicHistoryList } from "@/components/public-history-list"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"
import { getAppStore } from "@/server/app-store"

type UserPageProps = {
  readonly params: Promise<{ readonly publicHandle: string }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { publicHandle } = await params
  const history = getAppStore().getPublicHistory(publicHandle)
  if (!history) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-16 text-cream">
          <h1 className="text-4xl font-black">Public profile not found</h1>
          <Link className="mt-6 inline-block rounded-full bg-lime px-5 py-3 font-black text-ink" href="/leaderboard">
            Back to Top 15
          </Link>
        </main>
      </>
    )
  }
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10 text-cream">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Public history</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">{history.user.displayName}</h1>
        {history.leaderboard ? (
          <p className="mt-4 text-lg text-cream/75">
            Rank #{history.leaderboard.rank} · Profit <MoneyAmount cents={history.leaderboard.profitCents} /> · @{history.user.publicHandle}
          </p>
        ) : null}
        <section className="mt-8">
          <PublicHistoryList history={history.history} />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
