import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useSectionScroll } from '@shared/hooks/useSectionScroll';
import { TEAM_MEMBERS, DEPT_COLORS } from '@shared/data/teamMembers';

const ORBIT_MEMBERS = TEAM_MEMBERS.slice(0, 8);

export function TeamHero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useSectionScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 2.4]);
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0]);
  const statsY = useTransform(scrollYProgress, [0, 0.5], ['0px', '-60px']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden"
    >
      <div className="absolute inset-0 team-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,transparent,#0c0c0f_80%)] pointer-events-none" />

      {/* Orbital constellation */}
      <motion.div
        style={{ scale: orbitScale, opacity: orbitOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        {ORBIT_MEMBERS.map((member, i) => {
          const angle = (i / ORBIT_MEMBERS.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 38;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_30px_rgba(196,181,253,0.15)]"
              style={{
                left: `calc(50% + ${x}vw)`,
                top: `calc(50% + ${y}vh)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              <div
                className="absolute inset-0 mix-blend-color opacity-30"
                style={{ background: member.color }}
              />
            </motion.div>
          );
        })}
        <div className="absolute w-[70vmin] h-[70vmin] rounded-full border border-white/[0.06]" />
        <div className="absolute w-[50vmin] h-[50vmin] rounded-full border border-dashed border-[var(--brand)]/10" />
      </motion.div>

      <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
            The Genesis Collective
          </span>
        </motion.div>

        <div className="overflow-hidden">
          {['MEET THE', 'BUILDERS'].map((line, i) => (
            <motion.h1
              key={line}
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.15 + i * 0.12,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="font-display text-[clamp(3rem,11vw,9rem)] leading-[0.92] tracking-tighter uppercase text-white"
            >
              {i === 1 ? (
                <motion.span
                  style={{ WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}
                  className="text-transparent inline-block"
                >
                  {line}
                </motion.span>
              ) : (
                line
              )}
            </motion.h1>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-8 max-w-lg mx-auto font-sans text-base text-white/50 font-light leading-relaxed"
        >
          {TEAM_MEMBERS.length} minds across engineering, design, operations, and community — unified by one obsession: building remarkable developer experiences.
        </motion.p>
      </motion.div>

      <motion.div
        style={{ y: statsY, opacity: titleOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mt-10 flex items-center gap-8 font-mono text-xs text-white/40"
      >
        {[
          { v: TEAM_MEMBERS.length, l: 'Team Members' },
          { v: Object.keys(DEPT_COLORS).length, l: 'Departments' },
          { v: '5+', l: 'Years Together' },
        ].map(({ v, l }, i) => (
          <React.Fragment key={l}>
            {i > 0 && <div className="w-px h-8 bg-white/10" />}
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">{v}</span>
              <span className="text-[10px] mt-0.5 block">{l}</span>
            </div>
          </React.Fragment>
        ))}
      </motion.div>

      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[var(--brand)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
