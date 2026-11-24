import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { BIG_BOX_DAY } from "../lib/rules";
import type { DoorView } from "../lib/types";
import { Star } from "./Motifs";

const fmt = (t: number) => {
  const d = new Date(t);
  return `${d.getMonth() + 1}월 ${d.getDate()}일에 넣은 편지`;
};

export function LetterModal({ door, onClose }: { door: DoorView; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const big = door.day === BIG_BOX_DAY;
  const letters = door.letters ?? [];

  // 집(위쪽 장면)보다 위에 뜨도록 body 바로 아래에 그린다
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="letter-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="닫기">
          ×
        </button>
        <p className="card-en">{big ? "Merry Christmas" : `December ${door.day}`}</p>
        <h2 id="letter-title">{big ? "크리스마스 선물 상자" : `12월 ${door.day}일의 편지`}</h2>
        {big && <p className="modal-sub">편지 {letters.length}통이 들어 있었어요</p>}
        <div className="letters">
          {letters.map((l, i) => (
            <article key={i} className="letter" style={{ animationDelay: `${Math.min(i, 8) * 90}ms` }}>
              <span className="seal" aria-hidden="true">
                <Star />
              </span>
              <p className="letter-body">{l.message}</p>
              <p className="letter-from">
                <span>{fmt(l.createdAt)}</span>
                <b>
                  <em>from.</em> {l.nickname}
                </b>
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
