// GET /api/advent/:id — 어드벤트 보기.
// X-Owner-Key 헤더가 맞으면 주인으로 보고, 열린 칸의 편지 내용까지 준다.
import { getCalendar } from "../../../../src/advent/server/handlers";
import { failed, notConfigured, param, storeFrom, toResponse, type AdventCtx } from "../../../../src/advent/server/http";

export async function onRequestGet({ request, env, params }: AdventCtx): Promise<Response> {
  const store = storeFrom(env);
  if (!store) return notConfigured();
  try {
    const key = request.headers.get("X-Owner-Key");
    return toResponse(await getCalendar(store, param(params, "id"), key, Date.now()));
  } catch {
    return failed();
  }
}
