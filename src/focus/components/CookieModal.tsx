import { useEffect, useRef, useState } from "react";
import { getFortune, type FortuneResult } from "../lib/api";
import { RARITY_LABEL, currentStreak, rollRarity, timeOfDay } from "../lib/rarity";
import type { Cookie, OpenedFortune, Rarity } from "../lib/types";
import { RarityBadge } from "./Sketch";
import { shortDate } from "../lib/date";
import { Btn } from "./Rough";
import { CookieArt } from "./Art";

interface Props {
  cookie: Cookie;
  achievedDays: string[];
  collection: OpenedFortune[];
  onDone: (fortune: OpenedFortune) => void;
  onClose: () => void;
}

type Phase = "ready" | "cracking" | "revealed";

export function CookieModal({ cookie, achievedDays, collection, onDone, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [rarity, setRarity] = useState<Rarity | null>(null);
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const saved = useRef(false);

  const crack = async () => {
    if (phase !== "ready") return;
    setPhase("cracking");
    const now = Date.now();
    // 희귀도는 앱이 정한다 (AI가 정하지 않음 — 확률을 공정하게 유지)
    const r = rollRarity(currentStreak(achievedDays, now), cookie.focusMinutes);
    setRarity(r);
    const seen = new Set(collection.map((c) => c.id));
    // 애니메이션 최소 시간과 운세 요청을 함께 기다린다
    const [result] = await Promise.all([
      getFortune(cookie.goalTitle, r, timeOfDay(now), seen),
      new Promise((res) => setTimeout(res, 1400)),
    ]);
    setFortune(result);
    setPhase("revealed");
  };

  // 운세가 나오면 바로 도감에 저장 (모달을 그냥 닫아도 쿠키를 잃지 않게)
  useEffect(() => {
    if (phase !== "revealed" || !fortune || !rarity || saved.current) return;
    saved.current = true;
    onDone({
      id: fortune.listId ?? `ai-${cookie.id}`,
      title: fortune.title,
      message: fortune.message,
      luckyItem: fortune.luckyItem,
      rarity,
      goalTitle: cookie.goalTitle,
      openedAt: Date.now(),
      source: fortune.source,
    });
  }, [phase, fortune, rarity, cookie, onDone]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && phase !== "cracking" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  return (
    <div className="modal-backdrop" onClick={() => phase !== "cracking" && onClose()}>
      <div
        className={`modal ${rarity ? `rarity-${rarity}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="포춘쿠키 열기"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="today">{shortDate(cookie.earnedAt)}</p>
        <p className="modal-goal">‘{cookie.goalTitle}’ 달성 쿠키</p>

        <div className="modal-drawing">
          <button
            className={`fortune-cookie ${phase}`}
            onClick={crack}
            disabled={phase !== "ready"}
            aria-label="쿠키 깨기"
          >
            <CookieArt rarity={phase === "revealed" && rarity ? rarity : "common"} cracked={phase === "revealed"} />
          </button>
        </div>

        {phase === "ready" && <p className="modal-hint">쿠키를 톡 눌러서 깨 보세요</p>}
        {phase === "cracking" && <p className="modal-hint">바사삭…</p>}

        {phase === "revealed" && fortune && rarity && (
          <div className="fortune-entry" aria-live="polite">
            <RarityBadge rarity={rarity}>{RARITY_LABEL[rarity]}</RarityBadge>
            <h3 className="fortune-title">{fortune.title}</h3>
            <p className="fortune-message">{fortune.message}</p>
            <p className="slip-lucky">행운의 아이템: {fortune.luckyItem}</p>
            <Btn variant="primary" onClick={onClose}>
              액자에 걸어 둘게요
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
