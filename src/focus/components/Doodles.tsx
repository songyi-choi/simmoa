// 손그림 공통: 크레파스·종이 질감 필터. 오븐·쿠키·바구니는 이미지(Art.tsx)를 쓴다
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
