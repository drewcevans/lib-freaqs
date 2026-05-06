import { useEffect, useRef } from 'react';

const NEON_PALETTE = ['#ff00c8', '#c800ff', '#00f5ff', '#00ff88', '#f5ff00'];

const CENTER_BEAMS = [
  { baseAngle: -0.65, swing: 0.10, speed: 0.28, phase: 0.0, color: '#ff00c8', width: 2 },
  { baseAngle: -0.40, swing: 0.22, speed: 0.45, phase: 1.1, color: '#c800ff', width: 1.5 },
  { baseAngle: -0.18, swing: 0.35, speed: 0.60, phase: 0.6, color: '#00f5ff', width: 1.5 },
  { baseAngle:  0.05, swing: 0.28, speed: 0.38, phase: 2.2, color: '#ff00c8', width: 2.5 },
  { baseAngle:  0.22, swing: 0.32, speed: 0.52, phase: 0.9, color: '#00ff88', width: 1.5 },
  { baseAngle:  0.44, swing: 0.18, speed: 0.35, phase: 1.7, color: '#c800ff', width: 2 },
  { baseAngle:  0.68, swing: 0.12, speed: 0.30, phase: 0.4, color: '#00f5ff', width: 1.5 },
];

const LEFT_BEAMS = [
  { baseAngle: -0.5, swing: 0.55, speed: 0.50, phase: 1.0, color: '#f5ff00', width: 1.2 },
  { baseAngle:  0.2, swing: 0.60, speed: 0.62, phase: 2.4, color: '#ff6600', width: 1.0 },
];

const RIGHT_BEAMS = [
  { baseAngle:  0.5, swing: 0.55, speed: 0.50, phase: 0.5, color: '#f5ff00', width: 1.2 },
  { baseAngle: -0.2, swing: 0.60, speed: 0.62, phase: 1.5, color: '#ff00c8', width: 1.0 },
];

function buildStars(W, H) {
  const stars = [];
  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.65,
      r: 0.3 + Math.random() * 1.2,
      a: 0.05 + Math.random() * 0.25,
    });
  }
  return stars;
}

function beamEndPoint(sx, sy, angle, W, H) {
  const dx = Math.sin(angle);
  const dy = -Math.cos(angle);
  let tMin = Infinity;
  if (dy < 0) tMin = Math.min(tMin, (0 - sy) / dy);
  if (dy > 0) tMin = Math.min(tMin, (H - sy) / dy);
  if (dx < 0) tMin = Math.min(tMin, (0 - sx) / dx);
  if (dx > 0) tMin = Math.min(tMin, (W - sx) / dx);
  return [sx + dx * tMin, sy + dy * tMin];
}

function drawBeam(ctx, sx, sy, ex, ey, color, bw, t) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.globalAlpha = 0.75;
  ctx.strokeStyle = color;
  ctx.lineWidth = bw;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();

  ctx.shadowColor = '#fff';
  ctx.shadowBlur = 6;
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = bw * 0.4;
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  ctx.restore();
}

function drawGlow(ctx, x, y, color) {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, 35);
  grad.addColorStop(0, color + 'cc');
  grad.addColorStop(1, color + '00');
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function LaserShow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let animId;
    let stars = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = buildStars(canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    function frame() {
      const W = canvas.width;
      const H = canvas.height;

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = s.a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const cyclePos = (t % 20) / 20;
      const paletteIdx = cyclePos * NEON_PALETTE.length;
      const idxA = Math.floor(paletteIdx) % NEON_PALETTE.length;
      const idxB = (idxA + 1) % NEON_PALETTE.length;
      const frac = paletteIdx - Math.floor(paletteIdx);
      const neonColor = NEON_PALETTE[Math.round(frac < 0.5 ? idxA : idxB)];

      const fontSize = Math.max(48, Math.min(W * 0.11, 108));
      ctx.font = `900 ${fontSize}px Orbitron, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = W * 0.5;
      const textY = H * 0.22;

      ctx.save();
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 80;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = neonColor;
      ctx.fillText('LFGGGGG', textX, textY);

      ctx.shadowBlur = 30;
      ctx.globalAlpha = 0.8;
      ctx.fillText('LFGGGGG', textX, textY);

      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.88;
      ctx.fillText('LFGGGGG', textX, textY);
      ctx.restore();

      const srcC = [W * 0.5, H * 0.9];
      const srcL = [W * 0.12, H * 0.92];
      const srcR = [W * 0.88, H * 0.92];

      for (const b of CENTER_BEAMS) {
        const angle = b.baseAngle + b.swing * Math.sin(t * b.speed + b.phase);
        const [ex, ey] = beamEndPoint(srcC[0], srcC[1], angle, W, H);
        drawBeam(ctx, srcC[0], srcC[1], ex, ey, b.color, b.width, t);
      }

      for (const b of LEFT_BEAMS) {
        const angle = b.baseAngle + b.swing * Math.sin(t * b.speed + b.phase);
        const [ex, ey] = beamEndPoint(srcL[0], srcL[1], angle, W, H);
        drawBeam(ctx, srcL[0], srcL[1], ex, ey, b.color, b.width, t);
      }

      for (const b of RIGHT_BEAMS) {
        const angle = b.baseAngle + b.swing * Math.sin(t * b.speed + b.phase);
        const [ex, ey] = beamEndPoint(srcR[0], srcR[1], angle, W, H);
        drawBeam(ctx, srcR[0], srcR[1], ex, ey, b.color, b.width, t);
      }

      drawGlow(ctx, srcC[0], srcC[1], NEON_PALETTE[Math.floor(t * 0.5) % NEON_PALETTE.length]);
      drawGlow(ctx, srcL[0], srcL[1], NEON_PALETTE[Math.floor(t * 0.5 + 1) % NEON_PALETTE.length]);
      drawGlow(ctx, srcR[0], srcR[1], NEON_PALETTE[Math.floor(t * 0.5 + 2) % NEON_PALETTE.length]);

      t += 0.012;
      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

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
      }}
    />
  );
}
