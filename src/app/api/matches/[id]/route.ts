import { getAppStore } from "@/server/app-store"
import { jsonNotFound, jsonOk } from "@/server/api-response"

export async function GET(_request: Request, context: { readonly params: Promise<{ readonly id: string }> }): Promise<Response> {
  const { id } = await context.params
  const match = getAppStore().getMatch(id)
  return match ? jsonOk(match) : jsonNotFound("Match not found")
}
