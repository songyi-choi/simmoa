/** 주인에게만, 그리고 열린 칸에만 내려가는 편지 */
export interface LetterView {
  nickname: string;
  message: string;
  createdAt: number;
}

export interface DoorView {
  day: number;
  /** 들어 있는 편지 수 (1~24일은 0 또는 1) */
  count: number;
  unlocked: boolean;
  /** 주인이고 칸이 열렸을 때만 채워진다 */
  letters?: LetterView[];
}

export interface CalendarView {
  id: string;
  title: string;
  ownerName: string;
  year: number;
  isOwner: boolean;
  writingOpen: boolean;
  doors: DoorView[];
}

export interface CreatedCalendar {
  id: string;
  /** 주인 비밀 키. 서버에는 해시만 남는다 */
  key: string;
}

export type ApiError =
  | "bad_request"
  | "not_found"
  | "door_taken"
  | "calendar_full"
  | "writing_closed"
  | "rate_limited"
  | "not_configured"
  | "failed";
