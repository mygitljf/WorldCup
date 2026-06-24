import { DisclaimerBanner } from "@/components/disclaimer-banner"
import { RewardClaimCard } from "@/components/reward-claim-card"
import { SiteFooter } from "@/components/shell/site-footer"
import { SiteHeader } from "@/components/shell/site-header"

export default function GithubStarRewardPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 text-cream lg:grid-cols-[1fr_430px]">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-lime">Open-source reward</p>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Star the repo, get more virtual bankroll.</h1>
          <p className="mt-4 max-w-2xl text-cream/75">
            This bonus is a one-time game credit. It is not money, not a prize, and not required to play the demo.
          </p>
          <div className="mt-8">
            <DisclaimerBanner />
          </div>
        </section>
        <RewardClaimCard />
      </main>
      <SiteFooter />
    </>
  )
}
