"use client"

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 text-center text-cream">
      <p className="text-sm uppercase tracking-[0.4em] text-lime">Simulator error</p>
      <h1 className="mt-4 text-4xl font-black">The demo hit a recoverable issue.</h1>
      <button
        className="mt-8 rounded-full bg-lime px-5 py-3 font-bold text-ink"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </main>
  )
}
