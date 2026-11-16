export type Rarity = "common" | "rare" | "legend";
export type TimeOfDay = "morning" | "afternoon" | "night";

export interface Goal {
  id: string;
  title: string;
  /** 목표 달성에 필요한 집중 세션 수 */
  targetSessions: number;
  /** 세션 하나의 길이(분) */
  sessionMinutes: number;
  doneSessions: number;
  createdAt: number;
  achievedAt?: number;
}

/** 목표를 달성해서 받은, 아직 열지 않은 쿠키 */
export interface Cookie {
  id: string;
  goalTitle: string;
  /** 해당 목표에 쓴 총 집중 시간(분) — 희귀도 보너스에 사용 */
  focusMinutes: number;
  earnedAt: number;
}

export interface Fortune {
  title: string;
  message: string;
  luckyItem: string;
}

/** 도감에 남는, 연 쿠키 기록 */
export interface OpenedFortune extends Fortune {
  id: string;
  rarity: Rarity;
  goalTitle: string;
  openedAt: number;
  source: "ai" | "list";
}

export interface FocusState {
  goals: Goal[];
  activeGoalId: string | null;
  cookies: Cookie[];
  collection: OpenedFortune[];
  /** 목표를 달성한 날짜들 (YYYY-MM-DD, 로컬 기준) — 연속 달성 계산용 */
  achievedDays: string[];
}
