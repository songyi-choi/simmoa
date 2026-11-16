import type { FocusState } from "./types";

const KEY = "simmoa.focus.v1";

export const EMPTY_STATE: FocusState = {
  goals: [],
  activeGoalId: null,
  cookies: [],
  collection: [],
  achievedDays: [],
};

export function loadState(): FocusState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: FocusState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 시크릿 모드 등 저장이 막힌 환경에서는 이번 방문 동안만 유지
  }
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
