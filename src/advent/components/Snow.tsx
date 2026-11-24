import { useMemo } from "react";

/** 화면 전체에 천천히 내리는 눈. 움직임 줄이기 설정이면 CSS에서 멈춘다 */
export function Snow({ count = 26 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 3 + Math.random() * 5,
        duration: 9 + Math.random() * 12,
        delay: -Math.random() * 20,
        drift: (Math.random() - 0.5) * 60,
        key: i,
      })),
    [count],
  );
  return (
    <div className="snow" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.key}
          style={
            {
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              "--drift": `${f.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
