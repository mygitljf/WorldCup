import { getAppStore } from "@/server/app-store"
import { jsonOk } from "@/server/api-response"

export function GET(request: Request): Response {
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get("limit") ?? "15")
  return jsonOk({ leaderboard: getAppStore().getLeaderboard(Number.isFinite(limit) ? limit : 15) })
}
