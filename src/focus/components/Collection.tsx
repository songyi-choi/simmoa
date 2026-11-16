import { useState } from "react";
import { FORTUNES } from "../lib/fortunes";
import { RARITY_LABEL } from "../lib/rarity";
import type { OpenedFortune, Rarity } from "../lib/types";
import { RarityBadge } from "./Sketch";
import { shortDate } from "../lib/date";
import { RoughBox } from "./Rough";
import { CookieArt } from "./Art";

interface Props {
  items: OpenedFortune[];
}

const FILTERS: (Rarity | "all")[] = ["all", "legend", "rare", "common"];
/** 벽에 걸린 액자마다 다른 크레파스 테두리 색 */
const FRAME_COLORS = ["#f08a3c", "#f7c948", "#3f8fd2", "#6aae4c", "#e8553a"];

export function Collection({ items }: Props) {
  const [filter, setFilter] = useState<Rarity | "all">("all");
  const count = (r: Rarity) => items.filter((i) => i.rarity === r).length;
  // 미리 써둔 목록 운세 중 모은 개수 (AI 운세는 매번 새로 만들어지므로 따로 센다)
  const listTotal = FORTUNES.length;
  const listFound = new Set(items.filter((i) => i.source === "list").map((i) => i.id)).size;
  const shown = filter === "all" ? items : items.filter((i) => i.rarity === filter);

  if (items.length === 0) {
    return (
      <section className="collection empty">
        <CookieArt className="empty-cookie" />
        <p>아직 걸린 액자가 없어요.</p>
        <p>목표를 하나 끝내고 첫 운세를 걸어 보세요</p>
      </section>
    );
  }

  return (
    <section className="collection">
      <div className="collection-stats">
        {(["legend", "rare", "common"] as const).map((r) => (
          <div key={r}>
            <CookieArt rarity={r} className="stat-cookie" />
            <strong>{count(r)}</strong>
            <span>{RARITY_LABEL[r]}</span>
          </div>
        ))}
      </div>
      {listFound > 0 && (
        <p className="collection-note">
          비밀 레시피 운세 {listFound}/{listTotal}개 발견
        </p>
      )}

      <div className="filter-row" role="group" aria-label="등급 필터">
        {FILTERS.map((f) => (
          <RoughBox
            key={`${f}-${filter === f}`}
            as="button"
            shape="highlight"
            className={filter === f ? "on" : ""}
            fill={filter === f ? "#f7c948" : "transparent"}
            fillStyle="hachure"
            hachureGap={2.2}
            fillWeight={3.4}
            inset={0}
            roughness={2}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f === "all" ? "전체" : RARITY_LABEL[f]}
          </RoughBox>
        ))}
      </div>

      <ul className="frames">
        {shown.map((f, i) => (
          <RoughBox
            as="li"
            key={`${f.id}-${f.openedAt}-${i}`}
            className={`frame rarity-${f.rarity}`}
            accent={FRAME_COLORS[i % FRAME_COLORS.length]}
          >
            <div className="frame-art">
              <CookieArt rarity={f.rarity} cracked className="page-cookie" />
              <span className="badge-corner">
                <RarityBadge rarity={f.rarity}>{RARITY_LABEL[f.rarity]}</RarityBadge>
              </span>
            </div>
            <h3 className="fortune-title">{f.title}</h3>
            <p className="fortune-message">{f.message}</p>
            <p className="slip-lucky">행운의 아이템: {f.luckyItem}</p>
            <p className="slip-meta">
              {shortDate(f.openedAt)} · ‘{f.goalTitle}’
            </p>
          </RoughBox>
        ))}
      </ul>
    </section>
  );
}
