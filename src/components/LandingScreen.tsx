import fortuneTeller from '@/assets/fortune-teller.png';
import shopBg from '@/assets/shop-bg.png';
import crystalBall from '@/assets/crystal-ball.png';

interface LandingScreenProps {
  onEnter: () => void;
}

const LandingScreen = ({ onEnter }: LandingScreenProps) => {
  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center -mx-5 -mt-10 animate-slide-up">
      {/* Full-screen shop interior background */}
      <div className="fixed inset-0 z-0">
        <img src={shopBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Crystal ball */}
        <img
          src={crystalBall}
          alt=""
          width={64}
          height={64}
          className="animate-float drop-shadow-[0_0_30px_hsl(280_80%_60%_/_0.6)] mb-3"
        />

        {/* Title */}
        <h1 className="font-title text-3xl md:text-4xl font-black text-foreground mb-1 tracking-tight drop-shadow-lg">
          심야의 <span className="shimmer-text">요정</span> 상점
        </h1>
        <p className="font-dot text-xs text-muted-foreground tracking-[4px] mb-6 drop-shadow-md">
          ✦ MIDNIGHT FAIRY SHOP ✦
        </p>

        {/* Fortune teller character with speech bubble */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={fortuneTeller}
            alt="Fortune Teller"
            width={160}
            height={160}
            className="drop-shadow-[0_4px_20px_hsl(280_80%_60%_/_0.4)]"
            style={{ imageRendering: 'auto' }}
          />
          <div className="window-frame max-w-[280px] -mt-2 overflow-hidden">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-deep-violet/50 border-b-2 border-deep-violet">
              <span className="w-2 h-2 bg-neon-pink inline-block" />
              <span className="w-2 h-2 bg-cyber-mint inline-block" />
              <span className="w-2 h-2 bg-gold-star inline-block" />
              <span className="font-dot text-[8px] text-muted-foreground ml-1">welcome.exe</span>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-foreground/90 leading-relaxed">
                어서 와, 여행자... ✦
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-dot">
                운명의 카드가 널 기다리고 있어
              </p>
            </div>
          </div>
        </div>

        {/* Sticker tags */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <span className="sticker-tag border-neon-pink text-neon-pink glow-pink" style={{'--rot': '-4deg'} as React.CSSProperties}>
            LUCKY ★
          </span>
          <span className="sticker-tag border-cyber-mint text-cyber-mint glow-mint" style={{'--rot': '2deg'} as React.CSSProperties}>
            DESTINY
          </span>
          <span className="sticker-tag border-gold-star text-gold-star glow-gold" style={{'--rot': '-1deg'} as React.CSSProperties}>
            ✦ FATE ✦
          </span>
          <span className="sticker-tag border-mystic-purple text-mystic-purple glow-purple" style={{'--rot': '3deg'} as React.CSSProperties}>
            Y2K
          </span>
        </div>

        {/* Enter button */}
        <button onClick={onEnter} className="btn-main group relative">
          <span className="relative z-10">▸ 상점 들어가기 ◂</span>
        </button>

        <div className="flex justify-center gap-5 text-lg opacity-40 mt-6">
          {['✦', '🌙', '✦', '⭐', '✦'].map((s, i) => (
            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
