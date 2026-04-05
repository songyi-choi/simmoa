import { useEffect, useRef, useCallback } from 'react';

const SparkleTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{x:number;y:number;vx:number;vy:number;life:number;color:string;size:number}>>([]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const colors = ['#ff69b4', '#00e5a0', '#b366ff', '#ffd700'];
    for (let i = 0; i < 2; i++) {
      particles.current.push({
        x: e.clientX, y: e.clientY,
        vx: (Math.random() - 0.5) * 2.5,
        vy: (Math.random() - 0.5) * 2.5 - 1,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.floor(Math.random() * 2)
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.life -= 0.025;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', handleMouseMove); };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default SparkleTrail;
