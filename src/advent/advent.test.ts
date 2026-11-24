import { webcrypto } from "node:crypto";
import { beforeAll, describe, expect, it } from "vitest";
import { cleanText, daysUntil, isUnlocked, isWritingOpen, seasonYear, unlockTime } from "./lib/rules";
import type { CalendarView, CreatedCalendar } from "./lib/types";
import { createCalendar, getCalendar, writeLetter } from "./server/handlers";
import { memoryStore } from "./server/store";

beforeAll(() => {
  // jsdom 환경에는 crypto.subtle 이 없다
  if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
});

/** 한국 시간으로 y년 m월 d일 h시 */
const kst = (y: number, m: number, d: number, h = 0, min = 0) => Date.UTC(y, m - 1, d, h - 9, min);

describe("날짜 규칙 (KST)", () => {
  it("12월 1일 0시(KST)에 1일 칸이 열린다", () => {
    expect(unlockTime(2026, 1)).toBe(kst(2026, 12, 1));
    expect(isUnlocked(2026, 1, kst(2026, 11, 30, 23, 59))).toBe(false);
    expect(isUnlocked(2026, 1, kst(2026, 12, 1))).toBe(true);
  });
  it("UTC로는 아직 전날이어도 한국이 그날이면 열린다", () => {
    expect(isUnlocked(2026, 25, Date.UTC(2026, 11, 24, 15, 0))).toBe(true);
  });
  it("편지는 크리스마스 당일까지만 받는다", () => {
    expect(isWritingOpen(2026, kst(2026, 12, 25, 23, 59))).toBe(true);
    expect(isWritingOpen(2026, kst(2026, 12, 26))).toBe(false);
  });
  it("12/26 이후에 만들면 다음 해 크리스마스용", () => {
    expect(seasonYear(kst(2026, 11, 24))).toBe(2026);
    expect(seasonYear(kst(2026, 12, 25, 23))).toBe(2026);
    expect(seasonYear(kst(2026, 12, 26))).toBe(2027);
    expect(seasonYear(kst(2027, 1, 3))).toBe(2027);
  });
  it("남은 날 수", () => {
    expect(daysUntil(2026, 25, kst(2026, 12, 24, 12))).toBe(1);
    expect(daysUntil(2026, 25, kst(2026, 12, 20))).toBe(5);
    expect(daysUntil(2026, 25, kst(2026, 12, 25, 1))).toBe(0);
  });
});

describe("cleanText", () => {
  it("공백 정리와 길이 제한 (한글·이모지는 글자 단위)", () => {
    expect(cleanText("  산타  ", 12)).toBe("산타");
    expect(cleanText("🎄🎄🎄", 2)).toBe("🎄🎄");
    expect(cleanText(42, 10)).toBe("");
  });
  it("줄바꿈은 편지에서만 남기고, 3줄 넘게 비우지 않는다", () => {
    expect(cleanText("a\nb", 10)).toBe("a b");
    expect(cleanText("a\r\n\n\n\nb", 10, true)).toBe("a\n\nb");
  });
});

describe("어드벤트 API", () => {
  const NOW = kst(2026, 11, 24, 15);

  async function setup() {
    const store = memoryStore();
    const created = await createCalendar(store, { ownerName: "세레네" }, "1.1.1.1", NOW);
    expect(created.status).toBe(201);
    const { id, key } = created.body as CreatedCalendar;
    return { store, id, key };
  }

  const view = async (...args: Parameters<typeof getCalendar>) => (await getCalendar(...args)).body as CalendarView;

  it("만들면 공유 id와 주인 키가 나오고, 키는 해시로만 저장된다", async () => {
    const { store, id, key } = await setup();
    expect(id).toMatch(/^[a-zA-Z0-9]{10}$/);
    expect(key).toHaveLength(32);
    expect(store.calendars[0].keyHash).not.toContain(key);
    expect(store.calendars[0].title).toBe("세레네의 크리스마스 어드벤트");
    expect(store.calendars[0].year).toBe(2026);
  });

  it("이름이 없으면 만들 수 없다", async () => {
    const r = await createCalendar(memoryStore(), { ownerName: "   " }, "ip", NOW);
    expect(r.status).toBe(400);
  });

  it("친구가 편지를 넣으면 칸이 찬다. 친구는 내용을 못 본다", async () => {
    const { store, id } = await setup();
    const r = await writeLetter(store, id, { day: 3, nickname: "루돌프", message: "메리 크리스마스!" }, "2.2.2.2", NOW);
    expect(r.status).toBe(201);

    const guest = await view(store, id, null, kst(2026, 12, 25));
    expect(guest.isOwner).toBe(false);
    expect(guest.doors[2]).toEqual({ day: 3, count: 1, unlocked: true });
  });

  it("주인도 그날이 되기 전에는 못 열고, 그날이 되면 열린다", async () => {
    const { store, id, key } = await setup();
    await writeLetter(store, id, { day: 3, nickname: "루돌프", message: "안녕" }, "2.2.2.2", NOW);

    const before = await view(store, id, key, kst(2026, 12, 2, 23, 59));
    expect(before.isOwner).toBe(true);
    expect(before.doors[2].letters).toBeUndefined();
    expect(before.doors[2].count).toBe(1);

    const after = await view(store, id, key, kst(2026, 12, 3));
    expect(after.doors[2].letters).toEqual([{ nickname: "루돌프", message: "안녕", createdAt: NOW }]);
  });

  it("틀린 키로는 주인이 아니다", async () => {
    const { store, id } = await setup();
    const v = await view(store, id, "x".repeat(32), kst(2026, 12, 25));
    expect(v.isOwner).toBe(false);
  });

  it("1~24일 칸은 한 통만, 25일 상자는 여러 통", async () => {
    const { store, id } = await setup();
    const letter = (day: number, ip: string) => writeLetter(store, id, { day, nickname: "a", message: "b" }, ip, NOW);
    expect((await letter(5, "a")).status).toBe(201);
    expect((await letter(5, "b")).body).toEqual({ error: "door_taken" });
    expect((await letter(25, "c")).status).toBe(201);
    expect((await letter(25, "d")).status).toBe(201);

    const v = await view(store, id, null, NOW);
    expect(v.doors[24].count).toBe(2);
  });

  it("잘못된 칸·빈 편지는 거절", async () => {
    const { store, id } = await setup();
    for (const input of [
      { day: 0, nickname: "a", message: "b" },
      { day: 26, nickname: "a", message: "b" },
      { day: "3", nickname: "a", message: "b" },
      { day: 3, nickname: "", message: "b" },
      { day: 3, nickname: "a", message: "  " },
    ]) {
      expect((await writeLetter(store, id, input, "ip", NOW)).status).toBe(400);
    }
  });

  it("크리스마스가 지나면 편지를 받지 않는다", async () => {
    const { store, id } = await setup();
    const r = await writeLetter(store, id, { day: 25, nickname: "a", message: "b" }, "ip", kst(2026, 12, 26));
    expect(r.body).toEqual({ error: "writing_closed" });
  });

  it("같은 사람이 10분에 5통 넘게 쓰면 잠깐 막는다", async () => {
    const { store, id } = await setup();
    for (let i = 0; i < 5; i++) {
      expect((await writeLetter(store, id, { day: 25, nickname: "a", message: "b" }, "spam", NOW)).status).toBe(201);
    }
    expect((await writeLetter(store, id, { day: 25, nickname: "a", message: "b" }, "spam", NOW)).status).toBe(429);
    expect((await writeLetter(store, id, { day: 25, nickname: "a", message: "b" }, "other", NOW)).status).toBe(201);
    const later = NOW + 11 * 60 * 1000;
    expect((await writeLetter(store, id, { day: 25, nickname: "a", message: "b" }, "spam", later)).status).toBe(201);
  });

  it("없는 어드벤트", async () => {
    const store = memoryStore();
    expect((await getCalendar(store, "abcdefghij", null, NOW)).status).toBe(404);
    expect((await getCalendar(store, "../etc", null, NOW)).status).toBe(404);
  });
});
