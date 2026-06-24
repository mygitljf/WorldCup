import { getAppStore } from "@/server/app-store"
import { jsonOk, jsonStarFailure } from "@/server/api-response"

export async function POST(): Promise<Response> {
  const store = getAppStore()
  const result = await store.claimStarBonus(store.demoUserId)
  return result.ok ? jsonOk(result.value) : jsonStarFailure(result.error)
}
