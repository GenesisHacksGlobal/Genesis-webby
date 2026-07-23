import React, { useRef, useState } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useSectionScroll } from '@shared/hooks/useSectionScroll';
import { TEAM_MEMBERS, DEPT_COLORS } from '@shared/data/teamMembers';

const ORBIT_MEMBERS = TEAM_MEMBERS.slice(0, 8);

export function TeamHero({ onSelect }) {
  const sectionRef = useRef(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const { scrollYProgress } = useSectionScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax and scroll choreography transforms
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const orbitScale = useTransform(scrollYProgress, [0, 1], [1, 2.6]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const orbitOpacity = useTransform(scrollYProgress, [0, 0.75], [0.7, 0]);
  const statsY = useTransform(scrollYProgress, [0, 0.5], ['0px', '-40px']);

  // Mouse tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.04);
      mouseY.set((e.clientY - centerY) * 0.04);
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[125vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-[#08080b]"
    >
      {/* Background kinetic grid & ambient glows */}
      <div className="absolute inset-0 team-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_45%,transparent_20%,#08080b_85%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(196,181,253,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Orbital constellation with mouse parallax and scroll scale */}
      <motion.div
        style={{ scale: orbitScale, rotate: orbitRotate, opacity: orbitOpacity, x: springX, y: springY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
      >
        {/* Orbital rings */}
        <div className="absolute w-[68vmin] h-[68vmin] rounded-full border border-white/[0.07] shadow-[0_0_80px_rgba(255,255,255,0.02)]" />
        <div className="absolute w-[48vmin] h-[48vmin] rounded-full border border-dashed border-[var(--brand)]/15 animate-[spin_60s_linear_infinite]" />
        <div className="absolute w-[28vmin] h-[28vmin] rounded-full border border-white/[0.04]" />

        {/* Orbit Member Avatars */}
        {ORBIT_MEMBERS.map((member, i) => {
          const angle = (i / ORBIT_MEMBERS.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 34; // in vmin
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hoveredMember?.id === member.id;

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute pointer-events-auto"
              style={{
                left: `calc(50% + ${x}vmin)`,
                top: `calc(50% + ${y}vmin)`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => setHoveredMember(member)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => onSelect?.(member)}
            >
              <motion.div
                whileHover={{ scale: 1.2, zIndex: 30 }}
                className="relative cursor-pointer w-13 h-13 sm:w-16 sm:h-16 rounded-2xl p-0.5 border border-white/20 bg-black/60 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-300 group overflow-hidden"
                style={{ borderColor: isHovered ? member.color : 'rgba(255,255,255,0.15)' }}
              >
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover rounded-[14px]" />
                <div
                  className="absolute inset-0 rounded-[14px] opacity-20 mix-blend-color transition-opacity group-hover:opacity-0"
                  style={{ background: member.color }}
                />

                {/* Micro department glow dot */}
                <div
                  className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black"
                  style={{ background: member.color }}
                />
              </motion.div>

              {/* Floating Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-xl bg-[#0f0f15]/95 border border-white/20 backdrop-blur-xl shadow-2xl whitespace-nowrap pointer-events-none z-40 text-left"
                >
                  <p className="font-display text-xs text-white uppercase tracking-tight">{member.name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Hero Central Text & Choreography */}
      <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/12 bg-white/[0.03] backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse shadow-[0_0_10px_var(--brand)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] font-medium">
            Genesis Collective // Scroll Choreography
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.75rem,9.5vw,7.5rem)] leading-[0.92] tracking-tighter uppercase text-white"
          >
            THE MINDS BEHIND
          </motion.h1>
        </div>

        <div className="overflow-hidden mt-1">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.32, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(2.75rem,9.5vw,7.5rem)] leading-[0.92] tracking-tighter uppercase"
          >
            <span
              className="text-transparent inline-block transition-all duration-700 hover:text-white cursor-default"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}
            >
              GENESIS HACKS
            </span>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 max-w-xl mx-auto font-sans text-sm sm:text-base text-white/55 font-light leading-relaxed tracking-wide"
        >
          {TEAM_MEMBERS.length} strategists, engineers, designers, and community catalysts — bound by a single obsession: creating high-octane developer experiences.
        </motion.p>

        {/* Action quick link */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <a
            href="#spotlight-reel"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-bold hover:bg-[var(--brand)] transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Explore Roster ↓
          </a>
        </motion.div>
      </motion.div>

      {/* Key Metric Counters */}
      <motion.div
        style={{ y: statsY, opacity: titleOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.8 }}
        className="relative z-10 mt-14 flex items-center justify-center gap-6 sm:gap-12 font-mono text-xs text-white/40"
      >
        {[
          { v: `${TEAM_MEMBERS.length}`, l: 'Core Members' },
          { v: `${Object.keys(DEPT_COLORS).length}`, l: 'Disciplines' },
          { v: '10K+', l: 'Hackers Reached' },
          { v: '60+', l: 'Events Hosted' },
        ].map(({ v, l }, i) => (
          <React.Fragment key={l}>
            {i > 0 && <div className="w-px h-8 bg-white/10" />}
            <div className="text-center group">
              <span className="block text-2xl sm:text-3xl font-bold font-display text-white group-hover:text-[var(--brand)] transition-colors">
                {v}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1 block font-mono">{l}</span>
            </div>
          </React.Fragment>
        ))}
      </motion.div>

      {/* Scroll indicator prompt */}
      <motion.div
        style={{ opacity: titleOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll to choreography</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[var(--brand)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
