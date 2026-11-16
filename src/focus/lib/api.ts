import { pickListFortune } from "./fortunes";
import type { Fortune, Rarity, TimeOfDay } from "./types";

export interface FortuneResult extends Fortune {
  source: "ai" | "list";
  /** 목록 운세일 때만 — 도감 중복 방지용 */
  listId?: string;
}

const TIMEOUT_MS = 15000;

/**
 * AI 운세를 요청하고, 실패하면(오프라인·키 없음·시간 초과·거절) 목록 운세로 대신한다.
 * 쿠키가 안 열리는 일은 없어야 하므로 이 함수는 절대 throw하지 않는다.
 */
export async function getFortune(
  goalTitle: string,
  rarity: Rarity,
  time: TimeOfDay,
  seenIds: Set<string>,
): Promise<FortuneResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch("/api/fortune", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: goalTitle, rarity, timeOfDay: time }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (isFortune(data)) return { ...data, source: "ai" };
    }
  } catch {
    // 아래 목록 운세로 대체
  }
  const f = pickListFortune(rarity, time, seenIds);
  return { title: f.title, message: f.message, luckyItem: f.luckyItem, source: "list", listId: f.id };
}

function isFortune(v: unknown): v is Fortune {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return [o.title, o.message, o.luckyItem].every((x) => typeof x === "string" && x.length > 0);
}
