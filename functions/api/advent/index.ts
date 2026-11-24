// POST /api/advent — 어드벤트 만들기. 공유용 id와 주인 비밀 키를 돌려준다.
import { createCalendar } from "../../../src/advent/server/handlers";
import {
  badRequest,
  clientIp,
  failed,
  notConfigured,
  readJson,
  storeFrom,
  toResponse,
  type AdventCtx,
} from "../../../src/advent/server/http";

export async function onRequestPost({ request, env }: AdventCtx): Promise<Response> {
  const store = storeFrom(env);
  if (!store) return notConfigured();
  const input = await readJson(request);
  if (!input) return badRequest();
  try {
    return toResponse(await createCalendar(store, input, clientIp(request), Date.now()));
  } catch {
    return failed();
  }
}
