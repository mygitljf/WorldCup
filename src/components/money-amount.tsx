import { formatMoney } from "@/lib/format-money"

export function MoneyAmount({ cents }: Readonly<{ cents: number }>) {
  return <span className="tabular">{formatMoney(cents)}</span>
}
