import { z } from "zod"
import { getAppStore } from "@/server/app-store"
import { jsonBadRequest, jsonBetFailure, jsonOk } from "@/server/api-response"

const PlaceBetSchema = z.object({
  oddsSnapshotId: z.string().min(1),
  stakeCents: z.number().int().positive(),
  idempotencyKey: z.string().min(1),
})

export async function POST(request: Request): Promise<Response> {
  const parsed = PlaceBetSchema.safeParse(await request.json())
  if (!parsed.success) return jsonBadRequest("Invalid virtual bet request")
  const store = getAppStore()
  const result = store.placeBet({ ...parsed.data, userId: store.demoUserId })
  return result.ok ? jsonOk(result.value, { status: 201 }) : jsonBetFailure(result.error)
}
