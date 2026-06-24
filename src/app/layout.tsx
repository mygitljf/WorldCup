import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "WorldCup Simulator",
  description: "Virtual-only 2026 World Cup bankroll simulator. No real-money gambling.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
