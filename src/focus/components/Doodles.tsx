// 손그림 공통: 크레파스·종이 질감 필터, 빈 바구니 그림. 오븐·쿠키는 이미지(Art.tsx)를 쓴다
import rough from "roughjs";

const INK = "#2b2622";
const BLUSH = "#f29a86";

const ORANGE = "#f08a3c";

/** 크레파스 결·잉크 떨림 필터. 페이지에 한 번만 넣는다. */
export function SketchDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
      <defs>
        {/* 크레파스: 결 방향으로 긁힌 듯 군데군데 비고, 가장자리가 울퉁불퉁 */}
        <filter id="crayon" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.9" numOctaves="2" seed="7" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.9" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="grainy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="2" result="warp" />
          <feDisplacementMap in="grainy" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 크레파스 글씨: 결이 살짝 비고 획 가장자리가 거칠게 */}
        <filter id="crayon-text" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.12 0.7" numOctaves="2" seed="4" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.55" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="grainy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="8" result="warp" />
          <feDisplacementMap in="grainy" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 잉크: 아주 살짝 떨리는 선 */}
        <filter id="ink" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.8" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * 흰 도화지 질감 — 오돌토돌한 종이 결에 빛을 비춰 음영을 만든다.
 * 타일로 반복하면 이음새가 보여서 화면 전체에 한 장으로 깐다.
 */
export function PaperTexture() {
  return (
    <svg className="paper-texture" aria-hidden>
      <filter id="paper-tooth" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="5" seed="11" result="bumps" />
        <feDiffuseLighting in="bumps" lighting-color="#ffffff" surfaceScale="1.8" result="lit">
          <feDistantLight azimuth="235" elevation="62" />
        </feDiffuseLighting>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="fine" />
        <feColorMatrix in="fine" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.7 1.25" result="speck" />
        <feComposite in="lit" in2="speck" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paper-tooth)" />
    </svg>
  );
}

const gen = rough.generator();
const sketchCache = new Map<string, { fill: string[]; line: string[] }>();

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return Math.abs(h) % 2 ** 30;
}

interface SketchyProps {
  d: string;
  /** 진한 크레파스 외곽선 색 */
  line: string;
  /** 빗금 칠 색 — 없으면 선만 */
  fill?: string;
  w?: number;
  /** 빗금 간격: 넓을수록 종이가 많이 비친다 */
  gap?: number;
  weight?: number;
  angle?: number;
  zigzag?: boolean;
}

/**
 * 손으로 슥슥 그린 도형: 살짝 비뚤고 두 번 겹친 크레파스 선 + 빗금 칠.
 * 같은 모양은 같은 모양으로 그려지게 시드를 d에서 만든다 (타이머가 돌 때 흔들리지 않게 캐시).
 */
function Sketchy({ d, line, fill, w = 2.2, gap = 3.4, weight = 2.6, angle = -41, zigzag = false }: SketchyProps) {
  const key = [d, line, fill, w, gap, weight, angle, zigzag].join("|");
  let shape = sketchCache.get(key);
  if (!shape) {
    const seed = hash(d) + 1;
    shape = {
      fill: fill
        ? gen
            .toPaths(gen.path(d, { seed, stroke: "none", fill, fillStyle: zigzag ? "zigzag" : "hachure", hachureGap: gap, fillWeight: weight, hachureAngle: angle, roughness: 1.4 }))
            .map((x) => x.d)
        : [],
      line: gen.toPaths(gen.path(d, { seed: seed + 1, stroke: line, strokeWidth: w, roughness: 0.9, bowing: 1 })).map((x) => x.d),
    };
    if (sketchCache.size > 600) sketchCache.clear();
    sketchCache.set(key, shape);
  }
  return (
    <g filter="url(#crayon)" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {shape.fill.map((pd, i) => (
        <path key={`f${i}`} d={pd} stroke={fill} strokeWidth={weight} />
      ))}
      {shape.line.map((pd, i) => (
        <path key={`l${i}`} d={pd} stroke={line} strokeWidth={w} />
      ))}
    </g>
  );
}

type Mood = "idle" | "focus" | "happy" | "sleepy";

/** 점 눈, 작은 미소, 볼터치. (cx, cy)가 두 눈 사이 중심 */
function Face({ cx, cy, size = 1, mood = "idle" }: { cx: number; cy: number; size?: number; mood?: Mood }) {
  const gap = 11 * size;
  const s = size;
  const eye = (x: number) => {
    if (mood === "happy") return <path d={`M${x - 4 * s},${cy + 2 * s} q${4 * s},${-6 * s} ${8 * s},0`} fill="none" />;
    if (mood === "focus" || mood === "sleepy") return <path d={`M${x - 4 * s},${cy} h${8 * s}`} fill="none" />;
    return <ellipse cx={x} cy={cy} rx={2.4 * s} ry={3 * s} fill={INK} stroke="none" />;
  };
  const my = cy + 7 * s;
  const mouth =
    mood === "happy" ? (
      <path d={`M${cx - 5 * s},${my - 2 * s} q${5 * s},${8 * s} ${10 * s},0 Z`} fill="#e8553a" />
    ) : mood === "sleepy" ? (
      <ellipse cx={cx} cy={my + s} rx={2 * s} ry={2.6 * s} fill="none" />
    ) : (
      <path d={`M${cx - 4 * s},${my} q${4 * s},${4 * s} ${8 * s},0`} fill="none" />
    );
  return (
    <g stroke={INK} strokeWidth={2 * s} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={cx - gap - 6 * s} cy={cy + 7 * s} rx={5.5 * s} ry={3.5 * s} fill={BLUSH} stroke="none" opacity={0.85} filter="url(#crayon)" />
      <ellipse cx={cx + gap + 6 * s} cy={cy + 7 * s} rx={5.5 * s} ry={3.5 * s} fill={BLUSH} stroke="none" opacity={0.85} filter="url(#crayon)" />
      {eye(cx - gap)}
      {eye(cx + gap)}
      {mouth}
    </g>
  );
}

/** 바구니 (빈 바구니 안내용) */
export function BasketDoodle() {
  return (
    <svg viewBox="0 0 120 84" className="basket-svg" aria-hidden>
      <Sketchy d="M30,36 C30,6 90,6 90,36" line="#9c4a1e" w={2.6} />
      <Sketchy d="M14,36 h92 l-10,38 h-72 Z" fill={ORANGE} line="#9c4a1e" gap={3.4} weight={3} />
      <Sketchy d="M24,48 h72 M28,60 h64" line="#c0602a" w={1.6} />
      <Face cx={60} cy={52} size={0.7} mood="sleepy" />
    </svg>
  );
}
