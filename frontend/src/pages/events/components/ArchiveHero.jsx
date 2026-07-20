import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedCounter({ target = 110, duration = 2500 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return <>{val}</>;
}

// Dot‑matrix canvas that reacts to the mouse
function DotCanvas() {
  const ref = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      const sp = 34;
      const cols = Math.ceil(W / sp) + 1;
      const rows = Math.ceil(H / sp) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * sp;
          const y = r * sp;
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const glow = Math.max(0, 1 - dist / 180);
          const alpha = 0.12 + glow * 0.65;
          const size = 1 + glow * 2.5;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196,181,253,${alpha})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

export function ArchiveHero({ total, photos }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Dot grid bg */}
      <div className="absolute inset-0 opacity-60">
        <DotCanvas />
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,transparent_0%,#0c0c0f_75%)] pointer-events-none" />

      {/* Subtle scan lines */}
      <div className="scan-line absolute inset-0 pointer-events-none opacity-40" />

      {/* Noise grain */}
      <div className="noise absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto">
        {/* Live pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
            Digital Event Archive · Est. 2022
          </span>
        </motion.div>

        {/* Giant title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3.5rem,13vw,11rem)] leading-none tracking-tighter uppercase text-white"
        >
          GENESIS
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
            ARCHIVE
          </span>
        </motion.h1>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center gap-10 font-mono text-xs text-white/50 tracking-wider"
        >
          <div className="text-center">
            <span className="block text-3xl font-bold text-white tabular-nums">
              <AnimatedCounter target={total} />+
            </span>
            <span className="text-[10px] mt-1 block">EVENT RECORDS</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-white">5+</span>
            <span className="text-[10px] mt-1 block">YEARS</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-white">10K+</span>
            <span className="text-[10px] mt-1 block">ATTENDEES</span>
          </div>
        </motion.div>

        {/* Desc */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-8 max-w-md font-sans text-base text-white/50 font-light leading-relaxed"
        >
          Five years of hackathons, workshops, AI summits and community developer gatherings — all in one place.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/25">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* Floating photo strip at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 left-0 flex gap-3 opacity-20"
          style={{ animation: 'scrollStrip 30s linear infinite', width: 'max-content' }}
        >
          {[...photos.slice(0,8), ...photos.slice(0,8)].map((p, i) => (
            <img
              key={i}
              src={p.src || p}
              alt=""
              className="h-28 w-44 object-cover rounded-lg grayscale"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollStrip {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
        .scan-line {
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(196,181,253,0.018) 2px,rgba(196,181,253,0.018) 4px);
        }
      `}</style>
    </section>
  );
}
