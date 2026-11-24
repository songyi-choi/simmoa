-- 크리스마스 어드벤트 (advent.html)
-- 적용: Cloudflare 대시보드 → D1 → (데이터베이스) → Console 에 이 파일 내용을 붙여넣고 실행
--   또는 npx wrangler d1 execute <데이터베이스 이름> --remote --file migrations/0001_advent.sql

CREATE TABLE IF NOT EXISTS advent_calendars (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  owner_name      TEXT NOT NULL,
  key_hash        TEXT NOT NULL,   -- 주인 비밀 키의 SHA-256. 키 원문은 저장하지 않는다
  year            INTEGER NOT NULL,
  creator_ip_hash TEXT NOT NULL,   -- 생성 횟수 제한용. IP 원문은 저장하지 않는다
  created_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_advent_calendars_ip ON advent_calendars (creator_ip_hash, created_at);

CREATE TABLE IF NOT EXISTS advent_letters (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  calendar_id TEXT NOT NULL REFERENCES advent_calendars (id),
  day         INTEGER NOT NULL CHECK (day BETWEEN 1 AND 25),
  nickname    TEXT NOT NULL,
  message     TEXT NOT NULL,
  ip_hash     TEXT NOT NULL,
  created_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_advent_letters_calendar ON advent_letters (calendar_id, created_at);

-- 1~24일 칸에는 편지가 한 통만. 25일(크리스마스 상자)은 제한 없음
CREATE UNIQUE INDEX IF NOT EXISTS uq_advent_letters_door ON advent_letters (calendar_id, day) WHERE day < 25;
