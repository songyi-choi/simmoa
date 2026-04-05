import { useState, useCallback } from 'react';
import PixelStars from '@/components/PixelStars';
import SparkleTrail from '@/components/SparkleTrail';
import LandingScreen from '@/components/LandingScreen';
import ChatPanel from '@/components/ChatPanel';
import CardSelectScreen from '@/components/CardSelectScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ResultScreen from '@/components/ResultScreen';
import { type DrawnCard } from '@/data/tarotData';

type Screen = 'landing' | 'chat' | 'draw' | 'loading' | 'result';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [chatActive, setChatActive] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [topicKey, setTopicKey] = useState('general');

  const handleEnterShop = useCallback(() => {
    setChatActive(true);
    setScreen('chat');
  }, []);

  const handleTopicSelected = useCallback((_topic: string, subtopic: string) => {
    setTopicKey(subtopic);
    setChatActive(false);
    setTimeout(() => {
      setScreen('draw');
    }, 500);
  }, []);

  const handleCardsSelected = useCallback((cards: DrawnCard[]) => {
    setDrawnCards(cards);
    setScreen('loading');
    setTimeout(() => {
      setScreen('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
  }, []);

  const handleReset = useCallback(() => {
    setDrawnCards([]);
    setTopicKey('general');
    setChatActive(false);
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen relative scanlines">
      {/* Background effects */}
      <PixelStars />
      <SparkleTrail />

      {/* Gradient overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 25% 30%, hsl(300 50% 50% / 0.08) 0%, transparent 50%), radial-gradient(circle at 75% 70%, hsl(330 100% 71% / 0.1) 0%, transparent 50%)'
      }} />

      {/* Main Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-5 py-10 pb-20">
        {screen === 'landing' && <LandingScreen onEnter={handleEnterShop} />}
        {screen === 'draw' && <CardSelectScreen onCardsSelected={handleCardsSelected} />}
        {screen === 'loading' && <LoadingScreen />}
        {screen === 'result' && (
          <ResultScreen drawnCards={drawnCards} topicKey={topicKey} onReset={handleReset} />
        )}
      </div>

      {/* Chat Panel */}
      <ChatPanel isActive={chatActive} onTopicSelected={handleTopicSelected} />
    </div>
  );
};

export default Index;
