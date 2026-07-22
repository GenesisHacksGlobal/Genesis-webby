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

  const titleScale = useTransform(scrollYProgress, [0, 0.4, 0.7], [1.3, 1, 0.95]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0, 1, 1, 0.3]);
  const washOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.12, 0]);
  const cardsX = useTransform(scrollYProgress, [0.1, 0.8], ['8%', '-12%']);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] py-24 sm:py-32 overflow-hidden"
    >
      <motion.div
        style={{ opacity: washOpacity }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 20% 50%, ${color}40, transparent 70%)`,
          }}
        />
      </motion.div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center">
        <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="lg:sticky lg:top-32">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            Chapter {String(index + 1).padStart(2, '0')}
          </span>
          <h2
            className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase tracking-tighter leading-[0.9] mt-2"
            style={{ color }}
          >
            {dept}
          </h2>
          <p className="mt-4 font-sans text-sm text-white/45 max-w-xs leading-relaxed">
            {members.length} builder{members.length !== 1 ? 's' : ''} shaping Genesis from the {dept.toLowerCase()} lane.
          </p>
          <div className="mt-6 h-px w-24" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
        </motion.div>

        <motion.div style={{ x: cardsX }} className="flex flex-col gap-4">
          {members.map((member, i) => (
            <motion.button
              type="button"
              key={member.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelect?.(member)}
              className="group flex items-center gap-5 p-4 sm:p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 text-left w-full"
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500"
                style={{ boxShadow: `0 0 30px ${color}20` }}
              >
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white group-hover:text-[var(--heading)] transition-colors truncate">
                    {member.name}
                  </h3>
                  <span className="font-mono text-[9px] text-white/25 shrink-0">#{member.id}</span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider mt-0.5" style={{ color }}>
                  {member.role}
                </p>
                <p className="font-sans text-xs text-white/45 mt-1 line-clamp-1 hidden sm:block">{member.bio}</p>
              </div>
              <span className="font-mono text-[10px] text-white/25 group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all shrink-0 hidden sm:block">
                →
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function TeamDepartmentChapters({ onSelect }) {
  return (
    <div className="relative border-t border-white/10">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-20 pb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
          Department Chapters
        </span>
        <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-2">
          Seven Lanes,<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
            One Mission
          </span>
        </h2>
      </div>

      {DEPARTMENTS.map((dept, index) => (
        <DepartmentChapter key={dept} dept={dept} index={index} onSelect={onSelect} />
      ))}
    </div>
  );
}
