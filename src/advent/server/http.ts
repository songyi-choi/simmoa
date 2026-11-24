// Cloudflare Pages Function 공통 처리 (요청 파싱, 응답, D1 바인딩)

import type { Result } from "./handlers";
import { d1Store, type AdventStore, type D1Database } from "./store";

export interface AdventEnv {
  /** Cloudflare Pages 설정 → Bindings 에서 D1 데이터베이스를 DB 라는 이름으로 연결한다 */
  DB?: D1Database;
}

export interface AdventCtx {
  request: Request;
  env: AdventEnv;
  params: Record<string, string | string[]>;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export const toResponse = (r: Result<unknown>) => json(r.body, r.status);

export function storeFrom(env: AdventEnv): AdventStore | null {
  return env.DB ? d1Store(env.DB) : null;
}

export const notConfigured = () => json({ error: "not_configured" }, 503);
export const badRequest = () => json({ error: "bad_request" }, 400);
export const failed = () => json({ error: "failed" }, 500);

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const v = await request.json();
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const clientIp = (request: Request) => request.headers.get("CF-Connecting-IP") ?? "unknown";

export const param = (params: AdventCtx["params"], name: string) => {
  const v = params[name];
  return Array.isArray(v) ? v[0] ?? "" : v ?? "";
};
