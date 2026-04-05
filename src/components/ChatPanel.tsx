import { useState, useEffect, useRef, useCallback } from 'react';
import fortuneTeller from '@/assets/fortune-teller.png';

interface ChatMessage {
  type: 'npc' | 'user';
  text: string;
}

interface ChatOption {
  label: string;
  action: () => void;
}

interface ChatPanelProps {
  isActive: boolean;
  onTopicSelected: (topic: string, subtopic: string) => void;
}

const ChatPanel = ({ isActive, onTopicSelected }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [options, setOptions] = useState<ChatOption[]>([]);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const currentTopic = useRef('');

  const scrollToBottom = useCallback(() => {
    if (panelRef.current) panelRef.current.scrollTop = panelRef.current.scrollHeight;
  }, []);

  const typeMessage = useCallback((text: string, callback?: () => void) => {
    setIsTyping(true);
    setTypingText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setTypingText(prev => prev + text[i]);
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessages(prev => [...prev, { type: 'npc', text }]);
        setTypingText('');
        if (callback) setTimeout(callback, 200);
      }
    }, 30);
  }, [scrollToBottom]);

  const addUserMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, { type: 'user', text }]);
    setOptions([]);
  }, []);

  const showSubtopicOptions = useCallback((topic: string) => {
    if (topic === 'love') {
      typeMessage("사랑의 별이 반짝이는군... 좀 더 자세히 알려줘.", () => {
        setOptions([
          { label: '💕 솔로 (새 만남)', action: () => { addUserMessage('솔로'); onTopicSelected(topic, 'love_solo'); } },
          { label: '💑 커플 (현재 관계)', action: () => { addUserMessage('커플'); onTopicSelected(topic, 'love_couple'); } }
        ]);
      });
    } else if (topic === 'business') {
      typeMessage("야망의 불꽃이 타오르고 있어... 어떤 방향이야?", () => {
        setOptions([
          { label: '🚀 이직', action: () => { addUserMessage('이직'); onTopicSelected(topic, 'business_change'); } },
          { label: '📈 승진', action: () => { addUserMessage('승진'); onTopicSelected(topic, 'business_promotion'); } },
          { label: '🏪 개업·창업', action: () => { addUserMessage('개업'); onTopicSelected(topic, 'business_start'); } }
        ]);
      });
    } else {
      typeMessage("좋아... 운명의 카드를 준비할게.", () => {
        setOptions([
          { label: '🃏 카드 뽑기', action: () => { addUserMessage('카드 뽑기'); onTopicSelected(topic, topic); } }
        ]);
      });
    }
  }, [typeMessage, addUserMessage, onTopicSelected]);

  useEffect(() => {
    if (isActive && messages.length === 0) {
      setTimeout(() => {
        typeMessage("별들이 오늘 네 이야기를 기다리고 있었어... 어떤 운명을 들여다볼까?", () => {
          setOptions([
            { label: '✨ 제너럴', action: () => { addUserMessage('제너럴'); currentTopic.current = 'general'; showSubtopicOptions('general'); } },
            { label: '💕 연애', action: () => { addUserMessage('연애'); currentTopic.current = 'love'; showSubtopicOptions('love'); } },
            { label: '💼 사업', action: () => { addUserMessage('사업'); currentTopic.current = 'business'; showSubtopicOptions('business'); } },
            { label: '💰 재물', action: () => { addUserMessage('재물'); currentTopic.current = 'wealth'; showSubtopicOptions('wealth'); } }
          ]);
        });
      }, 300);
    }
  }, [isActive, messages.length, typeMessage, addUserMessage, showSubtopicOptions]);

  useEffect(() => { scrollToBottom(); }, [messages, typingText, scrollToBottom]);

  if (!isActive) return null;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-0 right-0 z-40 max-h-[45vh] overflow-y-auto transition-transform duration-400"
      style={{
        background: 'linear-gradient(0deg, hsl(265 55% 5%) 0%, hsl(265 55% 5% / 0.95) 80%, transparent 100%)',
        padding: '20px 20px 28px',
        borderTop: '2px solid hsl(270 30% 20%)'
      }}
    >
      <div className="max-w-[580px] mx-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 items-start mb-3 animate-slide-up ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.type === 'npc' && (
              <img src={fortuneTeller} alt="" width={36} height={36} className="flex-shrink-0 rounded-sm border border-mystic-purple/40" />
            )}
            <div className={`px-4 py-3 max-w-[80%] text-sm ${msg.type === 'npc' ? 'bubble-npc' : 'bubble-user'}`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 items-start mb-3 animate-slide-up">
            <img src={fortuneTeller} alt="" width={36} height={36} className="flex-shrink-0 rounded-sm border border-mystic-purple/40" />
            <div className="bubble-npc px-4 py-3 max-w-[80%] text-sm">
              {typingText}<span className="animate-blink text-mystic-purple">▌</span>
            </div>
          </div>
        )}

        {options.length > 0 && (
          <div className="flex gap-3 justify-center flex-wrap mt-4">
            {options.map((opt, i) => (
              <button key={i} onClick={opt.action} className="option-btn">{opt.label}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
