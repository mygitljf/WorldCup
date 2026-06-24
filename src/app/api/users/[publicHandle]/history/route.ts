import { getAppStore } from "@/server/app-store"
import { jsonNotFound, jsonOk } from "@/server/api-response"

export async function GET(
  _request: Request,
  context: { readonly params: Promise<{ readonly publicHandle: string }> },
): Promise<Response> {
  const { publicHandle } = await context.params
  const history = getAppStore().getPublicHistory(publicHandle)
  return history ? jsonOk(history) : jsonNotFound("Public user not found")
}
