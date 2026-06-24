import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-6 text-center text-cream">
      <p className="text-sm uppercase tracking-[0.4em] text-lime">404</p>
      <h1 className="mt-4 text-4xl font-black">Page not found</h1>
      <Link className="mt-8 rounded-full bg-lime px-5 py-3 font-bold text-ink" href="/">
        Back to simulator
      </Link>
    </main>
  )
}
