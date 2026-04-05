import { useState, useEffect, useCallback, useRef } from 'react';
import { CARD_IMAGES, MAJOR_ARCANA, type DrawnCard } from '@/data/tarotData';
import cardBackImg from '@/assets/card-back.png';
import fortuneTeller from '@/assets/fortune-teller.png';

interface CardSelectScreenProps {
  onCardsSelected: (cards: DrawnCard[]) => void;
}

/* tiny sparkle burst on card pick */
function spawnSparkles(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#ff69b4', '#00e5a0', '#b366ff', '#ffd700', '#ff6ac1'];
  for (let i = 0; i < 14; i++) {
    const sp = document.createElement('div');
    const angle = (Math.PI * 2 * i) / 14;
    const dist = 30 + Math.random() * 50;
    const size = 2 + Math.floor(Math.random() * 3);
    sp.style.cssText = `
      position:fixed;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};pointer-events:none;z-index:100;
      border-radius:0;
    `;
    document.body.appendChild(sp);
    sp.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0)`, opacity: 0 }
    ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(.2,1,.3,1)' })
      .onfinish = () => sp.remove();
  }
}

const CardSelectScreen = ({ onCardsSelected }: CardSelectScreenProps) => {
  const [shuffledIds, setShuffledIds] = useState<number[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [dealAnimDone, setDealAnimDone] = useState(false);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    setShuffledIds([...Array(22).keys()].sort(() => Math.random() - 0.5));
    // stagger deal animation
    const t = setTimeout(() => setDealAnimDone(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleCard = useCallback((id: number) => {
    if (selectedCards.includes(id) || selectedCards.length >= 3) return;
    const el = cardRefs.current.get(id);
    if (el) spawnSparkles(el);

    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);
    setFlippedCards(prev => new Set([...prev, id]));

    if (newSelected.length === 3) {
      setTimeout(() => {
        onCardsSelected(newSelected.map(cid => ({ id: cid, reversed: Math.random() < 0.5 })));
      }, 900);
    }
  }, [selectedCards, onCardsSelected]);

  const progressPct = (selectedCards.length / 3) * 100;

  return (
    <div className="animate-slide-up">
      {/* NPC message */}
      <div className="flex gap-3 items-start max-w-[480px] mx-auto mb-5">
        <img src={fortuneTeller} alt="" width={44} height={44} className="flex-shrink-0 rounded-sm border-2 border-mystic-purple/40" />
        <div className="bubble-npc px-4 py-3 text-sm flex-1">
          마음이 끌리는 세 장을 골라... 직감을 따라.
        </div>
      </div>

      {/* Counter + progress */}
      <div className="max-w-xs mx-auto mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="font-dot text-2xl text-neon-pink glow-pink">{selectedCards.length}</span>
            <span className="font-dot text-sm text-muted-foreground"> / 3</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={`w-8 h-1.5 transition-all duration-500 ${
                  i < selectedCards.length
                    ? 'bg-neon-pink shadow-[0_0_8px_hsl(330_100%_68%_/_0.6)]'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="score-bar !h-2 !border-deep-violet/40">
          <div
            className="score-bar-fill"
            style={{ width: `${progressPct}%`, transition: 'width 0.5s cubic-bezier(.4,0,.2,1)' }}
          />
        </div>
      </div>

      {/* Red Velvet Table */}
      <div className="velvet-table rounded-sm relative overflow-hidden">
        {/* Fabric texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }} />
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(330 100% 68% / 0.08) 0%, transparent 60%)',
        }} />

        {/* Gold trim top */}
        <div className="h-1 w-full" style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 100% 65% / 0.4) 20%, hsl(42 100% 65% / 0.6) 50%, hsl(42 100% 65% / 0.4) 80%, transparent)'
        }} />

        <div className="p-4 md:p-6">
          <div className="grid grid-cols-5 md:grid-cols-7 gap-2.5 md:gap-3 relative z-10">
            {shuffledIds.map((id, idx) => {
              const isSelected = selectedCards.includes(id);
              const selIdx = selectedCards.indexOf(id);
              const isDisabled = selectedCards.length >= 3 && !isSelected;
              const isFlipped = flippedCards.has(id);

              return (
                <div
                  key={id}
                  ref={el => { if (el) cardRefs.current.set(id, el); }}
                  onClick={() => !isDisabled && toggleCard(id)}
                  className={`aspect-[2/3] cursor-pointer select-none relative transition-all duration-300 ${
                    isSelected
                      ? '-translate-y-3 scale-110 z-20'
                      : 'hover:-translate-y-1.5 hover:scale-[1.04]'
                  } ${isDisabled ? 'opacity-15 pointer-events-none grayscale blur-[1px]' : ''}`}
                  style={{
                    perspective: '800px',
                    opacity: dealAnimDone ? 1 : 0,
                    transform: dealAnimDone ? undefined : 'translateY(30px) scale(0.8)',
                    transition: `all 0.3s ease, opacity 0.4s ease ${idx * 0.03}s, transform 0.4s ease ${idx * 0.03}s`,
                  }}
                >
                  <div
                    className="w-full h-full relative"
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.7s cubic-bezier(.4,.0,.2,1)',
                      transform: isFlipped ? 'rotateY(180deg)' : 'none'
                    }}
                  >
                    {/* Card Back */}
                    <div
                      className={`absolute inset-0 rounded-sm border-2 overflow-hidden transition-all duration-200 ${
                        isSelected
                          ? 'border-neon-pink box-glow-pink'
                          : 'border-deep-violet/50 hover:border-mystic-purple/80 hover:box-glow-purple'
                      }`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <img src={cardBackImg} alt="card back" className="w-full h-full object-cover" loading="lazy" />
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, transparent 30%, hsl(280 80% 60% / 0.15) 50%, transparent 70%)' }}
                      />
                    </div>

                    {/* Card Front */}
                    <div
                      className="absolute inset-0 rounded-sm border-2 border-neon-pink overflow-hidden box-glow-pink"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <img src={CARD_IMAGES[id]} alt={MAJOR_ARCANA[id].nameKo} className="w-full h-full object-cover" loading="lazy" />
                      {/* Glow overlay */}
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'linear-gradient(180deg, hsl(330 100% 68% / 0.1) 0%, transparent 40%, hsl(280 80% 60% / 0.15) 100%)'
                      }} />
                    </div>
                  </div>

                  {/* Selection badge */}
                  {isSelected && (
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-neon-pink text-primary-foreground font-dot text-[10px] font-bold flex items-center justify-center z-20 border-2 border-background animate-scale-in"
                      style={{ boxShadow: '0 0 10px hsl(330 100% 68% / 0.5), 2px 2px 0 rgba(0,0,0,0.4)' }}>
                      {selIdx + 1}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Gold trim bottom */}
        <div className="h-1 w-full" style={{
          background: 'linear-gradient(90deg, transparent, hsl(42 100% 65% / 0.4) 20%, hsl(42 100% 65% / 0.6) 50%, hsl(42 100% 65% / 0.4) 80%, transparent)'
        }} />
      </div>

      {/* Hint text */}
      <p className="text-center mt-4 font-dot text-[10px] text-muted-foreground tracking-wider animate-pulse-soft">
        ✦ 카드를 터치하면 운명이 드러납니다 ✦
      </p>
    </div>
  );
};

export default CardSelectScreen;
