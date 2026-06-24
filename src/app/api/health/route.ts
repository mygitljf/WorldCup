import { jsonOk } from "@/server/api-response"

export function GET(): Response {
  return jsonOk({ status: "ok" })
}
