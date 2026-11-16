// 손으로 그린 테두리·칠하기·줄 — roughjs로 실제 크기에 맞춰 그린다.
// 가는 검은 잉크 선 + 선 옆을 따라 칠한 크레파스 색 테두리(액자 느낌).
import { useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import rough from "roughjs";
import type { Options } from "roughjs/bin/core";

const gen = rough.generator();
const INK = "#2b2622";

type Shape = "rect" | "pill" | "ellipse" | "underline" | "highlight";

function useSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function pillPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(h / 2, w / 2);
  return `M${x + r},${y} L${x + w - r},${y} A${r},${r} 0 0 1 ${x + w - r},${y + h} L${x + r},${y + h} A${r},${r} 0 0 1 ${x + r},${y} Z`;
}

function draw(shape: Shape, w: number, h: number, inset: number, o: Options) {
  const x = inset;
  const y = inset;
  const iw = Math.max(0, w - inset * 2);
  const ih = Math.max(0, h - inset * 2);
  switch (shape) {
    case "ellipse":
      return gen.ellipse(w / 2, h / 2, iw, ih, o);
    case "pill":
      return gen.path(pillPath(x, y, iw, ih), o);
    case "underline":
      return gen.line(x, h - inset, w - inset, h - inset, o);
    case "highlight":
      // 크레파스로 글자 아랫부분을 한 번 슥 문지른다
      return gen.rectangle(x, h * 0.62, iw, h * 0.3, { ...o, stroke: "none" });
    default:
      return gen.rectangle(x, y, iw, ih, o);
  }
}

function seedOf(seed?: number) {
  return seed ?? Math.floor(Math.random() * 2 ** 31);
}

interface RoughProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  shape?: Shape;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  fillStyle?: "solid" | "hachure" | "zigzag" | "cross-hatch";
  fillWeight?: number;
  hachureGap?: number;
  roughness?: number;
  /** 크레파스로 그은 색 테두리 */
  accent?: string;
  /** 검은 잉크 테두리를 그릴지 — 크레파스 테두리(accent)가 있으면 기본으로 생략 */
  ink?: boolean;
  /** 바깥 가장자리에서 얼마나 안쪽에 그릴지(px) — 흔들린 선이 잘리지 않게 */
  inset?: number;
  seed?: number;
  [key: string]: unknown;
}

/**
 * 손그림 상자. 원래 요소(as) 안에 SVG를 깔고 그 위에 내용을 둔다.
 * 요소의 실제 크기에 맞춰 다시 그리므로 늘어나도 선 굵기·흔들림이 그대로다.
 */
export function RoughBox({
  as: Tag = "div",
  className,
  style,
  children,
  shape = "rect",
  stroke = INK,
  strokeWidth = 1.8,
  fill,
  fillStyle = "solid",
  fillWeight = 2.4,
  hachureGap = 3,
  roughness = 1.3,
  accent,
  ink = !accent,
  inset = 3,
  seed,
  ...rest
}: RoughProps) {
  const [ref, { w, h }] = useSize<HTMLElement>();
  const [s] = useState(() => seedOf(seed));
  const ready = w > 0 && h > 0;
  const paths = ready
    ? gen.toPaths(
        draw(shape, w, h, inset, {
          seed: s,
          stroke,
          strokeWidth,
          fill,
          fillStyle,
          fillWeight,
          hachureGap,
          hachureAngle: -50,
          roughness,
          bowing: 1.4,
          preserveVertices: false,
        }),
      )
    : [];
  // 크레파스 테두리: 굵고 거칠게. 잉크 선과 함께면 살짝 비껴서, 혼자면 두 번 덧그어서
  const accentPaths =
    ready && accent
      ? gen.toPaths(
          draw(shape, w, h, inset + 2, {
            seed: s + 7,
            stroke: accent,
            strokeWidth: ink ? 5 : 3.2,
            roughness: 2,
            bowing: 2,
            disableMultiStroke: ink,
          }),
        )
      : [];
  const dx = ink ? 3 + (s % 3) : 0;
  const dy = ink ? 3 + ((s >> 3) % 3) : 0;
  const accentLayer = accentPaths.length > 0 && (
    <g filter="url(#crayon)" transform={`translate(${dx},${dy})`} opacity={0.92}>
      {accentPaths.map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
  // 빗금 칠하기(크레파스)만 결을 입히고, 바탕색·잉크 선은 깨끗하게 둔다
  const isCrayon = (p: { stroke: string; fill?: string }) => (!p.fill || p.fill === "none") && p.stroke === fill;
  return (
    <Tag ref={ref} className={`rough ${className ?? ""}`} style={style} {...rest}>
      <svg className="rough-svg" width={w} height={h} aria-hidden>
        {ink && accentLayer}
        <g filter="url(#crayon)">
          {paths.filter(isCrayon).map((p, i) => (
            <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill="none" strokeLinecap="round" />
          ))}
        </g>
        {paths
          .filter((p) => !isCrayon(p) && (ink || (p.fill && p.fill !== "none")))
          .map((p, i) => (
            <path
              key={i}
              d={p.d}
              stroke={p.stroke}
              strokeWidth={p.strokeWidth}
              fill={p.fill ?? "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        {/* 잉크 선이 없으면 크레파스 테두리를 바탕색 위에 그린다 */}
        {!ink && accentLayer}
      </svg>
      {children}
    </Tag>
  );
}

/** 손으로 그은 가로줄 */
export function RoughLine({ stroke = INK, strokeWidth = 1.8, className }: { stroke?: string; strokeWidth?: number; className?: string }) {
  return <RoughBox className={`rough-line ${className ?? ""}`} shape="underline" stroke={stroke} strokeWidth={strokeWidth} inset={2} roughness={1.4} />;
}

type BtnVariant = "primary" | "secondary" | "ghost";
const BTN_FILL: Record<Exclude<BtnVariant, "ghost">, string> = { primary: "#f08a3c", secondary: "#f7c948" };
const BTN_LINE: Record<Exclude<BtnVariant, "ghost">, string> = { primary: "#c8622a", secondary: "#c99300" };

/** 크레파스로 칠한 손그림 버튼 */
export function Btn({
  variant = "primary",
  className,
  children,
  ...rest
}: {
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  if (variant === "ghost")
    return (
      <button className={`btn ghost ${className ?? ""}`} {...rest}>
        {children}
      </button>
    );
  return (
    <RoughBox
      as="button"
      shape="pill"
      className={`btn ${variant} ${className ?? ""}`}
      fill={rest.disabled ? "#ebe5dc" : BTN_FILL[variant]}
      fillStyle="hachure"
      hachureGap={2.2}
      fillWeight={3.2}
      strokeWidth={2}
      stroke={rest.disabled ? "#d6ccbf" : BTN_LINE[variant]}
      {...rest}
    >
      {children}
    </RoughBox>
  );
}
