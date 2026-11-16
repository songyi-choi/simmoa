// 작은 손그림 부품: 크레파스 형광 제목, 등급 딱지, 진행 동그라미
import type { ReactNode } from "react";
import type { Rarity } from "../lib/types";
import { RoughBox } from "./Rough";

/** 크레파스로 밑을 문지른 제목 */
export function Heading({ children, color = "#f7c948" }: { children: ReactNode; color?: string }) {
  return (
    <h2>
      <RoughBox as="span" shape="highlight" className="highlight" fill={color} fillStyle="hachure" hachureGap={2.2} fillWeight={3.4} inset={0} roughness={2}>
        {children}
      </RoughBox>
    </h2>
  );
}

const BADGE_FILL: Record<Rarity, string> = { common: "#f2c48a", rare: "#f7c948", legend: "#ef7b5c" };
const BADGE_LINE: Record<Rarity, string> = { common: "#c0803a", rare: "#c99300", legend: "#b8381f" };

/** 등급 딱지 */
export function RarityBadge({ rarity, children }: { rarity: Rarity; children: ReactNode }) {
  return (
    <RoughBox as="span" className={`rarity-badge ${rarity}`} fill={BADGE_FILL[rarity]} stroke={BADGE_LINE[rarity]} fillStyle="hachure" hachureGap={2.2} fillWeight={2.6} strokeWidth={1.6} inset={2}>
      {children}
    </RoughBox>
  );
}

/** 목표 진행 동그라미 */
export function Pips({ done, total }: { done: number; total: number }) {
  return (
    <span className="sessions" aria-label={`${total}번 중 ${done}번 완료`}>
      {Array.from({ length: total }, (_, i) => (
        <RoughBox
          key={`${i}-${i < done}`}
          as="span"
          shape="ellipse"
          className="pip"
          inset={2}
          strokeWidth={1.8}
          stroke="#c8622a"
          fill={i < done ? "#f08a3c" : undefined}
          fillStyle="hachure"
          hachureGap={2}
          fillWeight={2.4}
        />
      ))}
    </span>
  );
}
