import { getAppStore } from "@/server/app-store"
import { jsonOk } from "@/server/api-response"

export function GET(): Response {
  const store = getAppStore()
  return jsonOk(store.getUserSummary(store.demoUserId))
}
