// POST /api/advent/:id/letters — 친구가 고른 칸에 편지(방명록)를 넣는다.
import { writeLetter } from "../../../../src/advent/server/handlers";
import {
  badRequest,
  clientIp,
  failed,
  notConfigured,
  param,
  readJson,
  storeFrom,
  toResponse,
  type AdventCtx,
} from "../../../../src/advent/server/http";

export async function onRequestPost({ request, env, params }: AdventCtx): Promise<Response> {
  const store = storeFrom(env);
  if (!store) return notConfigured();
  const input = await readJson(request);
  if (!input) return badRequest();
  try {
    return toResponse(await writeLetter(store, param(params, "id"), input, clientIp(request), Date.now()));
  } catch {
    return failed();
  }
}
