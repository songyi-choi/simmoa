import type { Rarity, TimeOfDay } from "./types";

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "갓 구운 쿠키",
  rare: "황금 쿠키",
  legend: "전설의 쿠키",
};

/** 로컬 날짜를 YYYY-MM-DD로 */
export function dayKey(time: number): string {
  const d = new Date(time);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * 오늘(또는 어제)부터 거꾸로 이어지는 연속 달성 일수.
 * 오늘 아직 달성하지 않았어도 어제까지 이어졌다면 연속으로 본다.
 */
export function currentStreak(achievedDays: string[], now: number): number {
  const days = new Set(achievedDays);
  const cursor = new Date(now);
  if (!days.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * 희귀도 확률(%). 기본 70/25/5에서
 * - 연속 달성 하루마다 황금 +2%, 전설 +1% (최대 5일)
 * - 한 목표에 100분 이상 집중했으면 전설 +5%
 */
export function rarityOdds(streak: number, focusMinutes: number) {
  const s = Math.min(streak, 5);
  const legend = 5 + s + (focusMinutes >= 100 ? 5 : 0);
  const rare = 25 + s * 2;
  return { legend, rare, common: 100 - legend - rare };
}

/** rand는 [0, 1) — 테스트에서 고정값을 넣을 수 있게 주입받는다 */
export function rollRarity(streak: number, focusMinutes: number, rand: number = Math.random()): Rarity {
  const { legend, rare } = rarityOdds(streak, focusMinutes);
  const roll = rand * 100;
  if (roll < legend) return "legend";
  if (roll < legend + rare) return "rare";
  return "common";
}

export function timeOfDay(time: number): TimeOfDay {
  const h = new Date(time).getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "night";
}
