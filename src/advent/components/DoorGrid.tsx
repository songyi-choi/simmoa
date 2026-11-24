import { BIG_BOX_DAY, daysUntil } from "../lib/rules";
import type { DoorView } from "../lib/types";

/** 서랍 그림 6종 (public/advent/drawer-1~6.webp 순서와 같다) */
const VARIANTS = ["v-red", "v-green", "v-plaid-green", "v-cream", "v-plaid-red", "v-pine"];

/** 옆 칸·윗 칸(4열·6열 모두)과 무늬가 겹치지 않게 미리 정해 둔다 */
const VARIANT_OF: number[] = [];
for (let i = 0; i < 24; i++) {
  const banned = new Set([VARIANT_OF[i - 1], VARIANT_OF[i - 4], VARIANT_OF[i - 6]]);
  let v = (i * 5 + 1) % VARIANTS.length;
  while (banned.has(v)) v = (v + 1) % VARIANTS.length;
  VARIANT_OF.push(v);
}

interface Props {
  doors: DoorView[];
  year: number;
  mode: "owner" | "guest";
  now: number;
  /** 친구 화면: 고른 칸 */
  selected?: number | null;
  /** 주인 화면: 이미 열어 본 칸 */
  opened?: number[];
  writingOpen?: boolean;
  /** 만들기 화면의 미리보기 (누를 수 없음) */
  decorative?: boolean;
  onDoor?: (door: DoorView) => void;
}

export function DoorGrid({ doors, year, mode, now, selected, opened = [], writingOpen = true, decorative, onDoor }: Props) {
  return (
    <div className="doors" aria-hidden={decorative || undefined}>
      {doors.map((door) => {
        const big = door.day === BIG_BOX_DAY;
        const filled = door.count > 0;
        const left = daysUntil(year, door.day, now);
        const isOpened = mode === "owner" && filled && door.unlocked && opened.includes(door.day);
        const ready = mode === "owner" && filled && door.unlocked && !isOpened;
        const locked = mode === "owner" && filled && !door.unlocked;
        const disabled = decorative || (mode === "guest" && !writingOpen);
        // 친구 화면에서 이미 찬 서랍: 누를 수는 있지만(안내 문구) 고를 수는 없다
        const taken = mode === "guest" && !big && filled;

        let tag = "";
        if (ready) tag = "열어 보기";
        else if (locked) tag = `D-${left}`;
        else if (mode === "guest" && selected === door.day) tag = "여기에 넣기";

        const common = {
          type: "button" as const,
          disabled,
          tabIndex: decorative ? -1 : undefined,
          onClick: () => onDoor?.(door),
          "aria-pressed": mode === "guest" && !decorative && !taken ? selected === door.day : undefined,
          "aria-disabled": taken || undefined,
          "aria-label": label(door, mode, left),
        };
        const state = [
          filled && "is-filled",
          taken && "is-taken",
          ready && "is-ready",
          isOpened && "is-opened",
          selected === door.day && "is-selected",
        ];

        if (big) {
          const countText = door.count > 0 ? `편지 ${door.count}통` : "아직 비어 있어요";
          return (
            <button key={door.day} className={cls("door door--big", ...state)} {...common}>
              <span className="big-band" />
              <span className="big-ribbon" />
              <span className="big-label">
                <span className="big-num">25</span>
                <span className="big-caption">
                  <em>Christmas Day</em>
                  크리스마스 선물 상자
                  <span className="big-tag">{tag ? `${tag} · ${countText}` : countText}</span>
                </span>
              </span>
            </button>
          );
        }

        const variant = VARIANTS[VARIANT_OF[door.day - 1]];
        return (
          <button key={door.day} className={cls("door", variant, ...state)} {...common}>
            <span className="door-num">{door.day}</span>
            {filled && !isOpened && <span className="door-ribbon" />}
            {tag && <span className="door-tag">{tag}</span>}
          </button>
        );
      })}
    </div>
  );
}

const cls = (...names: (string | false | undefined | null)[]) => names.filter(Boolean).join(" ");

function label(door: DoorView, mode: Props["mode"], left: number): string {
  const name = door.day === BIG_BOX_DAY ? "크리스마스 선물 상자" : `12월 ${door.day}일 서랍`;
  if (mode === "guest") {
    if (door.day === BIG_BOX_DAY) return `${name}, 편지 ${door.count}통. 여기에 넣기`;
    return door.count ? `${name}, 이미 선물이 있어요` : `${name}, 비어 있음. 여기에 넣기`;
  }
  if (!door.count) return `${name}, 비어 있어요`;
  return door.unlocked ? `${name}, 편지 ${door.count}통, 열어 보기` : `${name}, 편지 ${door.count}통, ${left}일 뒤에 열려요`;
}
