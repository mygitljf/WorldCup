"use client"

import { useState, useTransition } from "react"
import { Button } from "./ui/button"

export function RewardClaimCard() {
  const [message, setMessage] = useState("Star the repo, then claim a one-time virtual $1,000 bonus.")
  const [isPending, startTransition] = useTransition()

  function claim() {
    startTransition(async () => {
      const response = await fetch("/api/rewards/github-star/claim", { method: "POST" })
      const body = (await response.json()) as { readonly error?: string }
      setMessage(response.ok ? "Bonus granted to your virtual bankroll." : (body.error ?? "Bonus claim failed."))
    })
  }

  return (
    <section className="rounded-[2rem] bg-cream p-6 text-ink shadow-panel">
      <h2 className="text-3xl font-black">GitHub star bonus</h2>
      <p className="mt-3 text-ink/70">The demo simulates GitHub verification. Production can swap in the GitHub REST check from the design doc.</p>
      <p className="mt-5 rounded-2xl bg-turf/10 p-4 text-sm font-bold">{message}</p>
      <Button className="mt-5" disabled={isPending} onClick={claim} type="button">
        Claim virtual $1,000
      </Button>
    </section>
  )
}
