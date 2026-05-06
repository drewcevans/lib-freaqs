import { useEffect, useRef } from 'react';

const STAR_COUNT = 180;
const NEBULA_COUNT = 5;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: randomBetween(0.4, 2.2),
      phase: Math.random() * Math.PI * 2,
      speed: randomBetween(0.3, 1.5),
      color: ['#c800ff', '#ff00c8', '#00f5ff', '#f0f0ff', '#00ff88'][Math.floor(Math.random() * 5)],
    }));

    const nebulae = Array.from({ length: NEBULA_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      rx: randomBetween(80, 300),
      ry: randomBetween(60, 200),
      color: ['rgba(200,0,255,', 'rgba(255,0,200,', 'rgba(0,245,255,', 'rgba(0,255,136,'][Math.floor(Math.random() * 4)],
      phase: Math.random() * Math.PI * 2,
      speed: randomBetween(0.2, 0.6),
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      t += 0.008;
      const { width: w, height: h } = canvas;

      ctx.clearRect(0, 0, w, h);

      // Nebula blobs
      nebulae.forEach((n) => {
        const alpha = 0.018 + 0.012 * Math.sin(t * n.speed + n.phase);
        const grd = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, Math.max(n.rx, n.ry));
        grd.addColorStop(0, `${n.color}${alpha})`);
        grd.addColorStop(1, `${n.color}0)`);
        ctx.save();
        ctx.scale(1, n.ry / n.rx);
        ctx.beginPath();
        ctx.arc(n.x * w, (n.y * h * n.rx) / n.ry, n.rx, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      });

      // Stars
      stars.forEach((s) => {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Tiny glow on bigger stars
        if (s.r > 1.6) {
          const glow = ctx.createRadialGradient(s.x * w, s.y * h, 0, s.x * w, s.y * h, s.r * 5);
          glow.addColorStop(0, s.color.replace(')', `, ${alpha * 0.4})`).replace('#', 'rgba(').replace(/([0-9a-f]{2})/gi, (m) => parseInt(m, 16) + ',').slice(0, -1) + ')');
          glow.addColorStop(1, 'transparent');
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.85,
      }}
    />
  );
}
