// 이 기기에서 만든 어드벤트(주인 키)와 열어 본 칸을 기억한다.
// 주인 키는 서버에서 다시 받을 수 없으므로, 기기를 바꿀 땐 "주인 링크"가 필요하다.

const KEY = "simmoa.advent.v1";

export interface SavedCalendar {
  id: string;
  key: string;
  title: string;
  /** 이미 열어 본 칸 (새 편지 반짝임 표시용) */
  opened: number[];
}

interface Saved {
  calendars: SavedCalendar[];
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    const v = raw ? JSON.parse(raw) : null;
    return v && Array.isArray(v.calendars) ? v : { calendars: [] };
  } catch {
    return { calendars: [] };
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // 저장이 막힌 환경에서는 주인 링크로만 들어올 수 있다
  }
}

export const savedCalendars = () => load().calendars;

export const savedCalendar = (id: string) => load().calendars.find((c) => c.id === id) ?? null;

export function rememberCalendar(id: string, key: string, title = "") {
  const s = load();
  const existing = s.calendars.find((c) => c.id === id);
  if (existing) {
    existing.key = key;
    if (title) existing.title = title;
  } else {
    s.calendars.unshift({ id, key, title, opened: [] });
  }
  save(s);
}

export function markOpened(id: string, day: number) {
  const s = load();
  const c = s.calendars.find((x) => x.id === id);
  if (!c || c.opened.includes(day)) return;
  c.opened.push(day);
  save(s);
}

/** 친구에게 보낼 링크 (Cloudflare Pages는 /advent.html 을 /advent 로 돌려보낸다) */
export const shareUrl = (id: string) => `${location.origin}/advent?id=${id}`;

/** 주인 링크. 키는 #(해시)에 두어 서버 로그에 남지 않게 한다 */
export const ownerUrl = (id: string, key: string) => `${shareUrl(id)}#key=${key}`;
