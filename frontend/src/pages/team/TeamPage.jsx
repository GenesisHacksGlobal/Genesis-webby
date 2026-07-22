import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Footer } from '@widgets/layout';
import { TEAM_MEMBERS } from '@shared/data/teamMembers';
import { TeamHero } from './components/TeamHero';
import { TeamSpotlightReel } from './components/TeamSpotlightReel';
import { TeamKineticMarquee } from './components/TeamKineticMarquee';
import { TeamDepartmentChapters } from './components/TeamDepartmentChapters';
import { TeamMemberDirectory, MemberModal } from './components/TeamMemberDirectory';

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--brand)] z-[60] origin-left"
    />
  );
}

export default function TeamPage() {
  const [dept, setDept] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = TEAM_MEMBERS.filter((m) => dept === 'All' || m.dept === dept);

  return (
    <div className="relative min-h-screen bg-[#0c0c0f] text-white overflow-x-hidden selection:bg-[var(--brand)] selection:text-black">
      <style>{TEAM_CSS}</style>

      <ScrollProgressBar />

      <Link
        to="/"
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md rounded-full transition-all"
      >
        ← Genesis
      </Link>

      <TeamHero />
      <TeamSpotlightReel onSelect={setSelected} />
      <TeamKineticMarquee />
      <TeamDepartmentChapters onSelect={setSelected} />
      <TeamMemberDirectory
        dept={dept}
        setDept={setDept}
        filtered={filtered}
        onSelect={setSelected}
      />

      <section className="max-w-[1300px] mx-auto px-4 sm:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 sm:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(196,181,253,0.06),transparent)] pointer-events-none" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">Join the Team</span>
          <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-3 mb-4">
            We&apos;re Always
            <br />
            Looking for Builders
          </h2>
          <p className="font-sans text-base text-white/50 max-w-md mx-auto leading-relaxed mb-8">
            If you&apos;re passionate about developer communities and want to help shape the future of Genesis, we&apos;d love to hear from you.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(196,181,253,0.3)]"
          >
            View Open Roles ↗
          </Link>
        </motion.div>
      </section>

      <AnimatePresence>
        {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

const TEAM_CSS = `
  .team-grid-bg {
    background-image:
      linear-gradient(rgba(196,181,253,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(196,181,253,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
`;
