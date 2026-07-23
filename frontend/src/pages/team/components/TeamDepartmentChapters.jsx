import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { useSectionScroll } from '@shared/hooks/useSectionScroll';
import { TEAM_MEMBERS, DEPT_COLORS } from '@shared/data/teamMembers';

const DEPARTMENTS = Object.keys(DEPT_COLORS);

function DepartmentChapter({ dept, index, onSelect }) {
  const sectionRef = useRef(null);
  const members = TEAM_MEMBERS.filter((m) => m.dept === dept);
  const color = DEPT_COLORS[dept];

  const { scrollYProgress } = useSectionScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1.15, 1, 0.98]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.4]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.18, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] py-20 sm:py-28 overflow-hidden border-t border-white/8"
    >
      {/* Dynamic Department Ambient Wash */}
      <motion.div
        style={{ opacity: washOpacity }}
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 50%, ${color}35, transparent 70%)`,
          }}
        />
      </motion.div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start relative z-10">
        {/* Sticky Pinned Chapter Title */}
        <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="lg:sticky lg:top-36">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-xs font-bold px-2.5 py-1 rounded-md border"
              style={{ borderColor: `${color}40`, color, background: `${color}10` }}
            >
              CHAPTER {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
              {index + 1} OF {DEPARTMENTS.length}
            </span>
          </div>

          <h2
            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] uppercase tracking-tighter leading-[0.92] mt-3"
            style={{ color }}
          >
            {dept}
          </h2>

          <p className="mt-4 font-sans text-sm text-white/50 max-w-sm leading-relaxed">
            {members.length} builder{members.length !== 1 ? 's' : ''} advancing Genesis through specialized {dept.toLowerCase()} execution.
          </p>

          {/* Chapter indicator line */}
          <div
            className="mt-6 h-0.5 w-32 rounded-full"
            style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
          />
        </motion.div>

        {/* Department Member Cards */}
        <div className="flex flex-col gap-4">
          {members.map((member, i) => (
            <motion.button
              type="button"
              key={member.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelect?.(member)}
              className="group flex items-center gap-5 p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 transition-all duration-500 text-left w-full relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
            >
              {/* Subtle hover background accent */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(90deg, ${color}10, transparent 80%)` }}
              />

              {/* Photo Avatar */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-white/15 group-hover:scale-105 transition-transform duration-500 relative"
                style={{ boxShadow: `0 0 20px ${color}20` }}
              >
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              </div>

              {/* Member Details */}
              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white group-hover:text-[var(--brand)] transition-colors truncate">
                    {member.name}
                  </h3>
                  <span className="font-mono text-[9px] text-white/30 shrink-0">#{member.id}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider mt-0.5" style={{ color }}>
                  {member.role}
                </p>
                <p className="font-sans text-xs text-white/45 mt-1.5 line-clamp-1 hidden sm:block">
                  {member.bio}
                </p>
              </div>

              <span className="font-mono text-xs text-white/30 group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all shrink-0 hidden sm:block">
                VIEW →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamDepartmentChapters({ onSelect }) {
  return (
    <div className="relative bg-[#08080a]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-20 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
          Department Chapters
        </span>
        <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-2">
          Seven Disciplines,<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>
            One Vision
          </span>
        </h2>
      </div>

      {DEPARTMENTS.map((dept, index) => (
        <DepartmentChapter key={dept} dept={dept} index={index} onSelect={onSelect} />
      ))}
    </div>
  );
}
