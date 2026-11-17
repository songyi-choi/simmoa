// 크레파스 일러스트(이미지) — public/focus/*.webp
import type { Rarity } from "../lib/types";

export type OvenState = "idle" | "baking" | "done";
const OVEN_STATES: OvenState[] = ["idle", "baking", "done"];

/** 오븐 세 장을 겹쳐 두고 상태에 맞는 한 장만 보이게 한다 (부드럽게 바뀜) */
export function OvenArt({ state }: { state: OvenState }) {
  return (
    <div className={`oven-art ${state}`} aria-hidden>
      {OVEN_STATES.map((s) => (
        <img key={s} src={`/focus/oven-${s}.webp`} alt="" className={s === state ? "on" : ""} width={900} height={630} decoding="async" />
      ))}
    </div>
  );
}

/** 포춘쿠키 — 등급은 은은한 빛과 반짝이로 구분한다 */
export function CookieArt({ rarity = "common", cracked = false, className }: { rarity?: Rarity; cracked?: boolean; className?: string }) {
  return (
    <span className={`cookie-art ${rarity} ${cracked ? "cracked" : ""} ${className ?? ""}`} aria-hidden>
      <img src={cracked ? "/focus/cookie-open.webp" : "/focus/cookie.webp"} alt="" width={750} height={520} decoding="async" />
    </span>
  );
}

/** 바구니 (빈 바구니 안내용) */
export function BasketArt() {
  return <img src="/focus/basket.webp" alt="" className="basket-art" width={600} height={640} decoding="async" aria-hidden />;
}
