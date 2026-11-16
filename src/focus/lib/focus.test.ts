import { describe, expect, it } from "vitest";
import { FORTUNES, pickListFortune } from "./fortunes";
import { currentStreak, dayKey, rarityOdds, rollRarity } from "./rarity";

const day = (y: number, m: number, d: number, h = 12) => new Date(y, m - 1, d, h).getTime();

describe("rarityOdds", () => {
  it("기본 확률은 70/25/5", () => {
    expect(rarityOdds(0, 25)).toEqual({ legend: 5, rare: 25, common: 70 });
  });
  it("연속 달성 보너스는 5일까지만", () => {
    expect(rarityOdds(5, 25)).toEqual(rarityOdds(30, 25));
    expect(rarityOdds(5, 25)).toEqual({ legend: 10, rare: 35, common: 55 });
  });
  it("100분 이상 집중하면 전설 +5%", () => {
    expect(rarityOdds(0, 100).legend).toBe(10);
  });
});

describe("rollRarity", () => {
  it("난수 구간에 따라 등급이 정해진다", () => {
    expect(rollRarity(0, 25, 0.0)).toBe("legend");
    expect(rollRarity(0, 25, 0.049)).toBe("legend");
    expect(rollRarity(0, 25, 0.05)).toBe("rare");
    expect(rollRarity(0, 25, 0.299)).toBe("rare");
    expect(rollRarity(0, 25, 0.3)).toBe("common");
    expect(rollRarity(0, 25, 0.999)).toBe("common");
  });
});

describe("currentStreak", () => {
  const now = day(2026, 11, 16);
  it("오늘까지 이어진 연속 일수", () => {
    const days = [dayKey(day(2026, 11, 14)), dayKey(day(2026, 11, 15)), dayKey(now)];
    expect(currentStreak(days, now)).toBe(3);
  });
  it("오늘 아직 안 했어도 어제까지 이어졌으면 유지", () => {
    expect(currentStreak([dayKey(day(2026, 11, 15))], now)).toBe(1);
  });
  it("하루라도 비면 끊긴다", () => {
    expect(currentStreak([dayKey(day(2026, 11, 13)), dayKey(now)], now)).toBe(1);
    expect(currentStreak([dayKey(day(2026, 11, 14))], now)).toBe(0);
  });
  it("월이 바뀌어도 이어진다", () => {
    const dec1 = day(2026, 12, 1);
    expect(currentStreak([dayKey(day(2026, 11, 30)), dayKey(dec1)], dec1)).toBe(2);
  });
});

describe("pickListFortune", () => {
  it("요청한 등급과 시간대에 맞는 운세만 고른다", () => {
    for (let i = 0; i < 20; i++) {
      const f = pickListFortune("common", "morning", new Set(), i / 20);
      expect(f.rarity).toBe("common");
      expect(f.time === undefined || f.time === "morning").toBe(true);
    }
  });
  it("이미 본 운세는 피한다", () => {
    const legends = FORTUNES.filter((f) => f.rarity === "legend");
    const seen = new Set(legends.slice(0, -1).map((f) => f.id));
    expect(pickListFortune("legend", "night", seen, 0).id).toBe(legends[legends.length - 1].id);
  });
  it("다 봤으면 다시 나온다", () => {
    const seen = new Set(FORTUNES.map((f) => f.id));
    expect(pickListFortune("rare", "night", seen, 0.5).rarity).toBe("rare");
  });
  it("운세 id는 겹치지 않는다", () => {
    expect(new Set(FORTUNES.map((f) => f.id)).size).toBe(FORTUNES.length);
  });
});
