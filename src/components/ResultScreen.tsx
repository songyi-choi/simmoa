import { useMemo } from 'react';
import {
  MAJOR_ARCANA, CARD_TRANSLATIONS, CARD_IMAGES, TOPIC_LABELS,
  CARD_ORDER_LABELS, generateReading, type DrawnCard
} from '@/data/tarotData';

interface ResultScreenProps {
  drawnCards: DrawnCard[];
  topicKey: string;
  onReset: () => void;
}

const ResultScreen = ({ drawnCards, topicKey, onReset }: ResultScreenProps) => {
  const topicLabel = TOPIC_LABELS[topicKey] || TOPIC_LABELS['general'];
  const reading = useMemo(() => generateReading(drawnCards, topicKey), [drawnCards, topicKey]);

  const positiveIds = [0,1,3,6,10,17,19,21];
  const luckScore = drawnCards.filter(dc => positiveIds.includes(dc.id) && !dc.reversed).length;
  const energyScore = Math.floor(40 + Math.random() * 60);
  const godLifeScore = Math.floor(30 + luckScore * 20 + Math.random() * 10);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => alert('링크가 복사되었습니다!'));
  };

  const shareTwitter = () => {
    const cardNames = drawnCards.map(c => MAJOR_ARCANA[c.id].nameKo).join(', ');
    const text = `🔮 나의 ${topicLabel} 타로 리딩: ${cardNames}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const stickerDecos = ['💫', '🌙', '⭐', '✨', '🔮', '💎'];

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-title text-2xl md:text-3xl font-black shimmer-text mb-2">
          운명의 리딩
        </h2>
        <p className="font-dot text-xs text-muted-foreground tracking-wider">{topicLabel}</p>
      </div>

      {/* Cards Row - diary style */}
      <div className="flex justify-center gap-3 md:gap-5 mb-8 flex-wrap">
        {drawnCards.map((dc, i) => {
          const card = MAJOR_ARCANA[dc.id];
          const tr = CARD_TRANSLATIONS[dc.id];
          const dirLabel = dc.reversed ? '역방향' : '정방향';
          const isPositive = !dc.reversed;
          const keywords = tr ? (dc.reversed ? tr.meaning_rev : tr.meaning_up) : '';

          return (
            <div key={i} className="result-box p-3 md:p-4 text-center min-w-[120px] max-w-[170px] flex-1 relative">
              {/* Floating sticker decos */}
              <span className="absolute -top-3 -left-2 text-base animate-float opacity-70" style={{ animationDelay: `${i * 0.3}s` }}>
                {stickerDecos[i * 2]}
              </span>
              <span className="absolute -bottom-2 -right-2 text-sm animate-float opacity-50" style={{ animationDelay: `${i * 0.3 + 0.5}s` }}>
                {stickerDecos[i * 2 + 1]}
              </span>

              <div className="w-[90px] md:w-[100px] h-[150px] md:h-[166px] mx-auto mb-3 border-2 border-mystic-purple/50 overflow-hidden bg-card"
                style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.4)' }}>
                <img src={CARD_IMAGES[dc.id]} alt={card.nameKo} className={`w-full h-full object-cover ${dc.reversed ? 'rotate-180' : ''}`} />
              </div>
              <div className="font-dot text-xs text-foreground font-bold mb-0.5">{card.nameKo}</div>
              <div className="text-[10px] text-muted-foreground mb-1">{card.name}</div>
              <div className={`font-dot text-[10px] font-bold mb-2 ${isPositive ? 'text-cyber-mint' : 'text-neon-pink'}`}>{dirLabel}</div>
              {keywords && <div className="text-[10px] text-mystic-purple leading-relaxed">{keywords}</div>}
            </div>
          );
        })}
      </div>

      {/* Score Bars - window frame */}
      <div className="window-frame mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-deep-violet/50 border-b-2 border-deep-violet">
          <span className="w-2.5 h-2.5 bg-neon-pink inline-block" />
          <span className="w-2.5 h-2.5 bg-cyber-mint inline-block" />
          <span className="font-dot text-[9px] text-muted-foreground ml-2">status.dat</span>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: '오늘의 갓생 지수', value: godLifeScore },
            { label: '럭키 에너지', value: energyScore },
            { label: '운명력', value: Math.floor(50 + luckScore * 15) },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <span className="font-dot text-[10px] text-neon-pink">{item.label}</span>
                <span className="font-dot text-[10px] text-cyber-mint">{item.value}%</span>
              </div>
              <div className="score-bar">
                <div className="score-bar-fill" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading */}
      <div className="window-frame mb-6 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-deep-violet/50 border-b-2 border-deep-violet">
          <span className="w-2.5 h-2.5 bg-gold-star inline-block" />
          <span className="font-dot text-[9px] text-muted-foreground ml-2">reading.txt</span>
        </div>
        <div className="p-5">
          <h3 className="font-title text-lg font-bold text-neon-pink glow-pink mb-4">종합 리딩</h3>
          <div className="text-sm text-foreground/80 leading-[2]" dangerouslySetInnerHTML={{ __html: reading }} />
        </div>
      </div>

      {/* Individual cards */}
      {drawnCards.map((dc, i) => {
        const card = MAJOR_ARCANA[dc.id];
        const tr = CARD_TRANSLATIONS[dc.id];
        const dirLabel = dc.reversed ? '역방향' : '정방향';
        const isPositive = !dc.reversed;
        const interp = card.interpretations[topicKey] || card.interpretations.general;
        const cardReading = dc.reversed ? interp.rev : interp.up;

        return (
          <div key={i} className="result-box mb-4 overflow-hidden">
            <div className="flex gap-4 p-4 items-start">
              <div className="w-[70px] min-w-[70px] border-2 border-mystic-purple/40 overflow-hidden bg-card" style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                <img src={CARD_IMAGES[dc.id]} alt={card.nameKo} className={`w-full block ${dc.reversed ? 'rotate-180' : ''}`} loading="lazy" />
              </div>
              <div className="flex-1">
                <div className="font-dot text-[9px] text-cyber-mint mb-1 uppercase tracking-wider">{CARD_ORDER_LABELS[i]} 카드</div>
                <div className="font-title text-base font-bold text-foreground mb-1">
                  {card.nameKo} <span className="text-muted-foreground text-xs font-normal">{card.name}</span>
                </div>
                <div className={`font-dot text-[10px] font-bold mb-2 ${isPositive ? 'text-cyber-mint' : 'text-neon-pink'}`}>{dirLabel}</div>
                {tr && <div className="text-xs text-mystic-purple">{dc.reversed ? tr.meaning_rev : tr.meaning_up}</div>}
              </div>
            </div>
            <div className="px-4 pb-4">
              <p className="text-sm text-foreground/75 leading-[1.9] mb-3">{cardReading}</p>
              {tr && (
                <p className="text-xs text-muted-foreground italic leading-relaxed pt-3 border-t border-border/30">{tr.desc}</p>
              )}
            </div>
          </div>
        );
      })}

      {/* Share */}
      <div className="flex gap-3 justify-center flex-wrap mt-8 mb-4">
        <button onClick={copyLink} className="btn-main !text-sm !px-6 !py-3">📋 Flex 하기</button>
        <button onClick={shareTwitter} className="btn-main !text-sm !px-6 !py-3 !bg-[hsl(200,85%,50%)] !border-[hsl(200,85%,40%)]">🐦 운명 공유</button>
      </div>

      <button
        onClick={onReset}
        className="block w-full max-w-md mx-auto mt-4 p-4 bg-muted/30 border-2 border-border text-muted-foreground font-dot text-sm tracking-wider cursor-pointer transition-all hover:bg-muted/50 hover:text-foreground"
        style={{ boxShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}
      >
        🔄 다시 뽑기
      </button>
    </div>
  );
};

export default ResultScreen;
