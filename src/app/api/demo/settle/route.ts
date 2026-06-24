import { z } from "zod"
import { getAppStore } from "@/server/app-store"
import { jsonBadRequest, jsonOk } from "@/server/api-response"

const SettleSchema = z.object({ matchId: z.string().min(1) })

export async function POST(request: Request): Promise<Response> {
  const parsed = SettleSchema.safeParse(await request.json())
  if (!parsed.success) return jsonBadRequest("Invalid settlement request")
  return jsonOk(getAppStore().settleDemoMatch(parsed.data.matchId))
}
