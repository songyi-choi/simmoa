import type { ApiError, CalendarView, CreatedCalendar } from "./types";

export class ApiFailure extends Error {
  constructor(public code: ApiError | "network") {
    super(code);
  }
}

const MESSAGES: Record<ApiFailure["code"], string> = {
  bad_request: "입력한 내용을 다시 확인해 주세요.",
  not_found: "어드벤트를 찾을 수 없어요. 링크를 다시 확인해 주세요.",
  door_taken: "앗, 방금 다른 친구가 이 칸에 선물을 넣었어요. 다른 칸을 골라 주세요.",
  calendar_full: "선물이 가득 차서 더 넣을 수 없어요.",
  writing_closed: "올해 크리스마스가 지나서 더 이상 선물을 받지 않아요.",
  rate_limited: "조금만 쉬었다가 다시 해 주세요.",
  not_configured: "아직 준비 중이에요. 잠시 후 다시 와 주세요.",
  failed: "잠깐 문제가 생겼어요. 다시 시도해 주세요.",
  network: "인터넷 연결을 확인하고 다시 시도해 주세요.",
};

export const errorMessage = (e: unknown) =>
  e instanceof ApiFailure ? MESSAGES[e.code] ?? MESSAGES.failed : MESSAGES.failed;

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    throw new ApiFailure("network");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const code = data && typeof data.error === "string" ? (data.error as ApiError) : "failed";
    throw new ApiFailure(code in MESSAGES ? code : "failed");
  }
  return data as T;
}

const post = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const createCalendar = (ownerName: string, title: string) =>
  call<CreatedCalendar>("/api/advent", post({ ownerName, title }));

export const fetchCalendar = (id: string, key: string | null) =>
  call<CalendarView>(`/api/advent/${encodeURIComponent(id)}`, {
    headers: key ? { "X-Owner-Key": key } : {},
  });

export const sendLetter = (id: string, day: number, nickname: string, message: string) =>
  call<{ ok: true; day: number }>(`/api/advent/${encodeURIComponent(id)}/letters`, post({ day, nickname, message }));
