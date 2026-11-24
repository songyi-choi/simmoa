// 어드벤트 API 로직. functions/api/advent/** 는 이 함수들을 감싸기만 한다.
// 저장소와 현재 시각을 밖에서 받아서 테스트에서 시간을 마음대로 돌릴 수 있다.

import {
  DAYS,
  LIMITS,
  cleanText,
  isUnlocked,
  isValidDay,
  isWritingOpen,
  seasonYear,
} from "../lib/rules";
import type { ApiError, CalendarView, CreatedCalendar, DoorView } from "../lib/types";
import type { AdventStore } from "./store";

export interface Result<T> {
  status: number;
  body: T | { error: ApiError };
}

const fail = (status: number, error: ApiError): Result<never> => ({ status, body: { error } });

const ID_ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 헷갈리는 l/1/O/0 제외
const ID_PATTERN = /^[a-zA-Z0-9]{10}$/;

function randomString(length: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  // 256 % 56 편향은 식별자 용도로 무시해도 되는 수준
  return Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join("");
}

export async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** IP 원문 대신 저장하는 값 (횟수 제한에만 쓴다) */
export const hashIp = (ip: string) => sha256(`simmoa-advent|${ip}`);

// ── POST /api/advent ─────────────────────────
export async function createCalendar(
  store: AdventStore,
  input: { title?: unknown; ownerName?: unknown },
  ip: string,
  now: number,
): Promise<Result<CreatedCalendar>> {
  const ownerName = cleanText(input.ownerName, LIMITS.ownerName);
  if (!ownerName) return fail(400, "bad_request");
  const title = cleanText(input.title, LIMITS.title) || `${ownerName}의 크리스마스 어드벤트`;

  const ipHash = await hashIp(ip);
  const recent = await store.countCalendarsByIpSince(ipHash, now - LIMITS.calendarWindowMs);
  if (recent >= LIMITS.calendarsPerIpWindow) return fail(429, "rate_limited");

  const id = randomString(10);
  const key = randomString(32);
  await store.createCalendar({
    id,
    title,
    ownerName,
    keyHash: await sha256(key),
    year: seasonYear(now),
    creatorIpHash: ipHash,
    createdAt: now,
  });
  return { status: 201, body: { id, key } };
}

// ── GET /api/advent/:id ──────────────────────
export async function getCalendar(
  store: AdventStore,
  id: string,
  ownerKey: string | null,
  now: number,
): Promise<Result<CalendarView>> {
  if (!ID_PATTERN.test(id)) return fail(404, "not_found");
  const cal = await store.getCalendar(id);
  if (!cal) return fail(404, "not_found");

  const isOwner = !!ownerKey && (await sha256(ownerKey)) === cal.keyHash;
  const letters = await store.listLetters(id);

  const doors: DoorView[] = DAYS.map((day) => {
    const inDoor = letters.filter((l) => l.day === day);
    const unlocked = isUnlocked(cal.year, day, now);
    const door: DoorView = { day, count: inDoor.length, unlocked };
    // 편지 내용은 주인에게, 그리고 그날이 된 칸만 보여준다
    if (isOwner && unlocked) {
      door.letters = inDoor.map((l) => ({ nickname: l.nickname, message: l.message, createdAt: l.createdAt }));
    }
    return door;
  });

  return {
    status: 200,
    body: {
      id: cal.id,
      title: cal.title,
      ownerName: cal.ownerName,
      year: cal.year,
      isOwner,
      writingOpen: isWritingOpen(cal.year, now),
      doors,
    },
  };
}

// ── POST /api/advent/:id/letters ─────────────
export async function writeLetter(
  store: AdventStore,
  id: string,
  input: { day?: unknown; nickname?: unknown; message?: unknown },
  ip: string,
  now: number,
): Promise<Result<{ ok: true; day: number }>> {
  if (!ID_PATTERN.test(id)) return fail(404, "not_found");
  const nickname = cleanText(input.nickname, LIMITS.nickname);
  const message = cleanText(input.message, LIMITS.message, true);
  if (!isValidDay(input.day) || !nickname || !message) return fail(400, "bad_request");
  const day = input.day;

  const cal = await store.getCalendar(id);
  if (!cal) return fail(404, "not_found");
  if (!isWritingOpen(cal.year, now)) return fail(409, "writing_closed");

  const ipHash = await hashIp(ip);
  const recent = await store.countLettersByIpSince(id, ipHash, now - LIMITS.letterWindowMs);
  if (recent >= LIMITS.lettersPerIpWindow) return fail(429, "rate_limited");
  if ((await store.countLetters(id)) >= LIMITS.lettersPerCalendar) return fail(409, "calendar_full");

  const result = await store.insertLetter({ calendarId: id, day, nickname, message, ipHash, createdAt: now });
  if (result === "taken") return fail(409, "door_taken");
  return { status: 201, body: { ok: true, day } };
}
