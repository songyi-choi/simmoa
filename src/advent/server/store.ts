// 어드벤트 저장소. 운영은 Cloudflare D1, 테스트는 메모리 구현을 쓴다.
// 테이블 정의: migrations/0001_advent.sql

import { BIG_BOX_DAY } from "../lib/rules";

export interface CalendarRow {
  id: string;
  title: string;
  ownerName: string;
  keyHash: string;
  year: number;
  creatorIpHash: string;
  createdAt: number;
}

export interface LetterRow {
  calendarId: string;
  day: number;
  nickname: string;
  message: string;
  ipHash: string;
  createdAt: number;
}

export interface AdventStore {
  createCalendar(row: CalendarRow): Promise<void>;
  getCalendar(id: string): Promise<CalendarRow | null>;
  countCalendarsByIpSince(ipHash: string, since: number): Promise<number>;
  listLetters(calendarId: string): Promise<LetterRow[]>;
  countLetters(calendarId: string): Promise<number>;
  countLettersByIpSince(calendarId: string, ipHash: string, since: number): Promise<number>;
  /** 1~24일 칸이 이미 차 있으면 "taken" */
  insertLetter(row: LetterRow): Promise<"ok" | "taken">;
}

// ── Cloudflare D1 ─────────────────────────────
// @cloudflare/workers-types 없이 쓰는 데 필요한 만큼만 정의한다.
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}
export interface D1Database {
  prepare(sql: string): D1Statement;
}

export function d1Store(db: D1Database): AdventStore {
  const count = async (sql: string, ...args: unknown[]) =>
    (await db.prepare(sql).bind(...args).first<{ n: number }>())?.n ?? 0;

  return {
    async createCalendar(r) {
      await db
        .prepare(
          "INSERT INTO advent_calendars (id, title, owner_name, key_hash, year, creator_ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(r.id, r.title, r.ownerName, r.keyHash, r.year, r.creatorIpHash, r.createdAt)
        .run();
    },
    async getCalendar(id) {
      const row = await db
        .prepare(
          "SELECT id, title, owner_name AS ownerName, key_hash AS keyHash, year, creator_ip_hash AS creatorIpHash, created_at AS createdAt FROM advent_calendars WHERE id = ?",
        )
        .bind(id)
        .first<CalendarRow>();
      return row ?? null;
    },
    countCalendarsByIpSince: (ipHash, since) =>
      count("SELECT COUNT(*) AS n FROM advent_calendars WHERE creator_ip_hash = ? AND created_at >= ?", ipHash, since),
    async listLetters(calendarId) {
      const { results } = await db
        .prepare(
          "SELECT calendar_id AS calendarId, day, nickname, message, ip_hash AS ipHash, created_at AS createdAt FROM advent_letters WHERE calendar_id = ? ORDER BY created_at",
        )
        .bind(calendarId)
        .all<LetterRow>();
      return results;
    },
    countLetters: (calendarId) => count("SELECT COUNT(*) AS n FROM advent_letters WHERE calendar_id = ?", calendarId),
    countLettersByIpSince: (calendarId, ipHash, since) =>
      count(
        "SELECT COUNT(*) AS n FROM advent_letters WHERE calendar_id = ? AND ip_hash = ? AND created_at >= ?",
        calendarId,
        ipHash,
        since,
      ),
    async insertLetter(r) {
      try {
        await db
          .prepare(
            "INSERT INTO advent_letters (calendar_id, day, nickname, message, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
          )
          .bind(r.calendarId, r.day, r.nickname, r.message, r.ipHash, r.createdAt)
          .run();
        return "ok";
      } catch (e) {
        // 1~24일 칸의 부분 유니크 인덱스에 걸리면 동시에 같은 칸을 고른 것
        if (String(e).includes("UNIQUE")) return "taken";
        throw e;
      }
    },
  };
}

// ── 메모리 (테스트용) ─────────────────────────
export function memoryStore(): AdventStore & { calendars: CalendarRow[]; letters: LetterRow[] } {
  const calendars: CalendarRow[] = [];
  const letters: LetterRow[] = [];
  return {
    calendars,
    letters,
    async createCalendar(r) {
      calendars.push({ ...r });
    },
    async getCalendar(id) {
      return calendars.find((c) => c.id === id) ?? null;
    },
    async countCalendarsByIpSince(ipHash, since) {
      return calendars.filter((c) => c.creatorIpHash === ipHash && c.createdAt >= since).length;
    },
    async listLetters(calendarId) {
      return letters.filter((l) => l.calendarId === calendarId).sort((a, b) => a.createdAt - b.createdAt);
    },
    async countLetters(calendarId) {
      return letters.filter((l) => l.calendarId === calendarId).length;
    },
    async countLettersByIpSince(calendarId, ipHash, since) {
      return letters.filter((l) => l.calendarId === calendarId && l.ipHash === ipHash && l.createdAt >= since).length;
    },
    async insertLetter(r) {
      if (r.day < BIG_BOX_DAY && letters.some((l) => l.calendarId === r.calendarId && l.day === r.day)) return "taken";
      letters.push({ ...r });
      return "ok";
    },
  };
}
