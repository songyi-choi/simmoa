import { useEffect, useRef } from 'react';

const PixelStars = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    c.innerHTML = '';
    const colors = ['330,100%,68%', '280,80%,60%', '160,100%,45%', '42,100%,65%', '0,0%,100%'];
    for (let i = 0; i < 150; i++) {
      const s = document.createElement('div');
      const size = (1 + Math.floor(Math.random() * 3)) + 'px';
      const color = colors[Math.floor(Math.random() * colors.length)];
      s.style.cssText = `
        position:absolute;
        background:hsl(${color});
        width:${size};height:${size};
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation:twinkle ${2+Math.random()*5}s infinite;
        animation-delay:${Math.random()*4}s;
        opacity:0.3;
      `;
      c.appendChild(s);
    }
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default PixelStars;
