// 어드벤트 규칙 — 브라우저와 Cloudflare Function이 함께 쓴다.
// 날짜는 모두 한국 시간(KST, UTC+9) 기준이다.

/** 1~24일 칸은 편지 한 통씩, 25일은 개수 제한 없는 크리스마스 선물 상자 */
export const BIG_BOX_DAY = 25;
export const DAYS = Array.from({ length: BIG_BOX_DAY }, (_, i) => i + 1);

export const LIMITS = {
  title: 30,
  ownerName: 12,
  nickname: 12,
  message: 500,
  /** 어드벤트 하나에 들어갈 수 있는 편지 총량 */
  lettersPerCalendar: 300,
  /** 같은 사람이 한 어드벤트에 10분 동안 남길 수 있는 편지 수 */
  lettersPerIpWindow: 5,
  letterWindowMs: 10 * 60 * 1000,
  /** 같은 사람이 1시간 동안 만들 수 있는 어드벤트 수 */
  calendarsPerIpWindow: 5,
  calendarWindowMs: 60 * 60 * 1000,
} as const;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** 12월 day일 0시(KST)의 타임스탬프. day=26이면 크리스마스가 끝나는 순간 */
export function unlockTime(year: number, day: number): number {
  return Date.UTC(year, 11, day) - KST_OFFSET_MS;
}

export function isUnlocked(year: number, day: number, now: number): boolean {
  return now >= unlockTime(year, day);
}

/** 크리스마스(25일)가 끝나면 편지를 더 받지 않는다 */
export function isWritingOpen(year: number, now: number): boolean {
  return now < unlockTime(year, BIG_BOX_DAY + 1);
}

/** 지금 만들면 어느 해 크리스마스용인지. 12/26부터는 다음 해 */
export function seasonYear(now: number): number {
  const kst = new Date(now + KST_OFFSET_MS);
  const y = kst.getUTCFullYear();
  return kst.getUTCMonth() === 11 && kst.getUTCDate() > BIG_BOX_DAY ? y + 1 : y;
}

/** 칸이 열릴 때까지 남은 날 수 (열렸으면 0). 자정 기준으로 센다 */
export function daysUntil(year: number, day: number, now: number): number {
  const diff = unlockTime(year, day) - now;
  return diff <= 0 ? 0 : Math.ceil(diff / (24 * 60 * 60 * 1000));
}

/** 제어문자 제거 + 앞뒤 공백 정리. 줄바꿈은 allowNewlines일 때만 남긴다 */
export function cleanText(v: unknown, max: number, allowNewlines = false): string {
  if (typeof v !== "string") return "";
  /* eslint-disable no-control-regex -- 제어문자를 걸러내는 게 목적 */
  const stripped = allowNewlines
    ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").replace(/\n{3,}/g, "\n\n")
    : v.replace(/[\u0000-\u001F\u007F]/g, " ");
  /* eslint-enable no-control-regex */
  return Array.from(stripped.trim()).slice(0, max).join("").trim();
}

export function isValidDay(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= BIG_BOX_DAY;
}
