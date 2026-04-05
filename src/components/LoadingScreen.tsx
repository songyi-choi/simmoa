import crystalBall from '@/assets/crystal-ball.png';

const LoadingScreen = () => {
  return (
    <div className="text-center py-20 animate-slide-up">
      <img
        src={crystalBall}
        alt=""
        width={100}
        height={100}
        className="mx-auto animate-float drop-shadow-[0_0_30px_hsl(280_80%_60%_/_0.5)] mb-8"
      />
      <div className="flex justify-center gap-3 mb-6">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-3 h-3 bg-neon-pink inline-block animate-dot-bounce"
            style={{ boxShadow: '2px 2px 0 rgba(0,0,0,0.4)', animationDelay: `${-0.32 + i * 0.16}s` }}
          />
        ))}
      </div>
      <p className="font-dot text-sm text-mystic-purple glow-purple tracking-wider">
        카드의 비밀을 풀어내고 있어요...
      </p>
    </div>
  );
};

export default LoadingScreen;
