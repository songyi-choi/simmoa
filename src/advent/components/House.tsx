import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Snow } from "./Snow";

/**
 * 화면 전체 틀: 크리스마스 저녁 영국 거리(street.webp) 한가운데 선 장난감 가게(어드벤트 상자).
 *
 * 집 그림은 네 조각으로 나눠 쓴다 (public/advent, 원본 폭 959px 기준):
 *  - house-top: 지붕~차양. 간판 안쪽 빨간 판 위에 제목을 올린다.
 *  - store-top / store-mid / store-bot: 1층 진열장. 등불이 든 위·계단이 든 아래는 그대로,
 *    기둥 몸통(store-mid)만 세로로 늘려서 서랍 칸 수에 맞게 진열장 높이가 늘어난다.
 * 위치 값은 advent.css 의 .sign / .storefront 에 있다.
 */
export function Scene({ title, sub, grid, children }: { title: string; sub?: ReactNode; grid: ReactNode; children?: ReactNode }) {
  return (
    <div className="advent">
      <section className="room">
        <Snow />
        <a className="back-link" href="/">← 심심풀이 모아</a>
        <p className="sky-title">Merry Christmas</p>
        <div className="house">
          <div className="house-top">
            <img src="/advent/house-top.webp" alt="" width={959} height={957} decoding="async" />
            <div className="sign">
              <FitTitle text={title} />
            </div>
          </div>
          <div className="storefront">{grid}</div>
        </div>
        {sub && <p className="caption">{sub}</p>}
      </section>
      <section className="ground">
        <div className="ground-inner">
          {children}
          <footer className="advent-footer">편지는 주인만, 그날이 되어야 열어 볼 수 있어요 · 한국 시간 기준</footer>
        </div>
      </section>
    </div>
  );
}

/** 간판 폭에 맞춰 한 줄로 들어가도록 글자 크기를 줄인다 */
function FitTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.clientWidth && size > 10) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement ?? el);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [text]);
  return (
    <h1 ref={ref} className="sign-title">
      {text}
    </h1>
  );
}
