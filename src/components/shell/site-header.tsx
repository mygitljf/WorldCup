import Link from "next/link"

const navItems = [
  { href: "/matches", label: "Matches" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leaderboard", label: "Top 15" },
  { href: "/rewards/github-star", label: "Star Bonus" },
] as const

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 text-cream md:flex-row md:items-center md:justify-between">
      <Link className="text-lg font-black tracking-tight" href="/">
        WorldCup Simulator
      </Link>
      <nav className="flex flex-wrap gap-2 text-sm font-bold text-cream/80">
        {navItems.map((item) => (
          <Link className="rounded-full border border-cream/15 px-4 py-2 hover:border-lime hover:text-lime" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
