import { getAppStore } from "@/server/app-store"
import { jsonOk } from "@/server/api-response"

export function GET(): Response {
  return jsonOk({ matches: getAppStore().listMatches() })
}
