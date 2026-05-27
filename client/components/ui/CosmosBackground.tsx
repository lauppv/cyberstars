import { useEffect, useRef } from 'react';

const STAR_COLORS = ['#ffffff', '#cfd9ff', '#ffd1a1', '#a8c4ff', '#e8b8ff'];

export function CosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    interface Star {
      x: number;
      y: number;
      size: number;
      baseAlpha: number;
      twPhase: number;
      twSpeed: number;
      twAmp: number;
      color: string;
    }

    let stars: Star[] = [];

    function regenStars() {
      stars = [];
      for (let i = 0; i < 260; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() < 0.85 ? 0.5 + Math.random() * 1.2 : 1.6 + Math.random() * 1.4,
          baseAlpha: 0.35 + Math.random() * 0.55,
          twPhase: Math.random() * Math.PI * 2,
          twSpeed: 0.00015 + Math.random() * 0.0004,
          twAmp: 0.15 + Math.random() * 0.35,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      regenStars();
    }

    window.addEventListener('resize', resize);
    resize();

    let rafId: number;
    function frame(now: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = Math.sin(s.twPhase + now * s.twSpeed);
        const alpha = Math.max(0.05, s.baseAlpha + tw * s.twAmp);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = s.color;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx!.fill();
        if (s.size > 1.6) {
          ctx!.globalAlpha = alpha * 0.22;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;
      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cosmos-bg">
      <canvas ref={canvasRef} />
      <div className="nebula n1" />
      <div className="nebula n2" />
      <div className="nebula n3" />
    </div>
  );
}
