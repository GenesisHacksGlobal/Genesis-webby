import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '@widgets/layout';

// ─── Team Data ────────────────────────────────────────────────────────────────
const TEAM = [
  {
    id: '01', name: 'Aryan Sharma', role: 'Founder & CEO',
    dept: 'Leadership', avatar: 'AS',
    bio: 'Visionary behind Genesis. Building the future of developer communities across India.',
    links: { twitter: '#', linkedin: '#', github: '#' },
    color: '#c4b5fd',
  },
  {
    id: '02', name: 'Priya Nair', role: 'Chief Technology Officer',
    dept: 'Engineering', avatar: 'PN',
    bio: 'Full-stack architect obsessed with performance and developer experience.',
    links: { twitter: '#', linkedin: '#', github: '#' },
    color: '#86efac',
  },
  {
    id: '03', name: 'Rahul Verma', role: 'Head of Events',
    dept: 'Operations', avatar: 'RV',
    bio: 'Orchestrated 60+ community events from intimate meetups to 700-person hackathons.',
    links: { twitter: '#', linkedin: '#' },
    color: '#fbbf24',
  },
  {
    id: '04', name: 'Sneha Kapoor', role: 'Lead Designer',
    dept: 'Design', avatar: 'SK',
    bio: 'Crafts experiences that feel alive. Motion, space, and meaning — in everything.',
    links: { twitter: '#', linkedin: '#', github: '#' },
    color: '#f9a8d4',
  },
  {
    id: '05', name: 'Dev Malhotra', role: 'Community Lead',
    dept: 'Community', avatar: 'DM',
    bio: 'Bridges the gap between builders and opportunities. 10K+ relationships forged.',
    links: { twitter: '#', linkedin: '#' },
    color: '#7dd3fc',
  },
  {
    id: '06', name: 'Aisha Patel', role: 'Partnerships Director',
    dept: 'Growth', avatar: 'AP',
    bio: 'Secures the fuel for Genesis. From Wormhole Foundation to emerging Web3 orgs.',
    links: { linkedin: '#', twitter: '#' },
    color: '#fca5a5',
  },
  {
    id: '07', name: 'Karan Mehta', role: 'Backend Engineer',
    dept: 'Engineering', avatar: 'KM',
    bio: 'Systems thinker. Builds APIs that scale from 100 to 100,000 requests seamlessly.',
    links: { github: '#', linkedin: '#' },
    color: '#86efac',
  },
  {
    id: '08', name: 'Nisha Rao', role: 'Content & Media Lead',
    dept: 'Marketing', avatar: 'NR',
    bio: 'Turns hackathon chaos into compelling narratives. Words, reels, and moments.',
    links: { twitter: '#', linkedin: '#' },
    color: '#fde68a',
  },
  {
    id: '09', name: 'Varun Singh', role: 'Frontend Engineer',
    dept: 'Engineering', avatar: 'VS',
    bio: 'UI is his canvas. Ships pixel-perfect interfaces with obsessive attention to detail.',
    links: { github: '#', twitter: '#', linkedin: '#' },
    color: '#c4b5fd',
  },
  {
    id: '10', name: 'Meera Joshi', role: 'Workshop Coordinator',
    dept: 'Operations', avatar: 'MJ',
    bio: 'Designs curricula that actually stick. 40+ workshops, zero boring sessions.',
    links: { linkedin: '#', twitter: '#' },
    color: '#fbbf24',
  },
  {
    id: '11', name: 'Ankit Dubey', role: 'DevRel Engineer',
    dept: 'Community', avatar: 'AD',
    bio: 'Evangelises Genesis to the developer world. Talks, blogs, and live demos.',
    links: { twitter: '#', github: '#', linkedin: '#' },
    color: '#7dd3fc',
  },
  {
    id: '12', name: 'Tanya Gupta', role: 'Brand Strategist',
    dept: 'Design', avatar: 'TG',
    bio: 'Shapes how the world sees Genesis. Identity systems with lasting cultural impact.',
    links: { linkedin: '#', twitter: '#' },
    color: '#f9a8d4',
  },
  {
    id: '13', name: 'Rohan Bhat', role: 'AI & ML Lead',
    dept: 'Engineering', avatar: 'RB',
    bio: 'Leads AI-first hackathon tracks. LLMs, embeddings, and on-device inference.',
    links: { github: '#', twitter: '#', linkedin: '#' },
    color: '#a5b4fc',
  },
  {
    id: '14', name: 'Ishita Sen', role: 'Legal & Compliance',
    dept: 'Operations', avatar: 'IS',
    bio: 'Keeps Genesis clean, compliant, and conflict-free. Policy, privacy, and peace.',
    links: { linkedin: '#' },
    color: '#fca5a5',
  },
  {
    id: '15', name: 'Sahil Khanna', role: 'Growth Hacker',
    dept: 'Growth', avatar: 'SH',
    bio: 'Experiments relentlessly. A/B tests everything. Grew reach 4× in six months.',
    links: { twitter: '#', linkedin: '#', github: '#' },
    color: '#fde68a',
  },
  {
    id: '16', name: 'Pooja Iyer', role: 'Web3 Evangelist',
    dept: 'Community', avatar: 'PI',
    bio: 'Demystifies blockchain for the next generation of builders. Onboarding 500+ devs.',
    links: { twitter: '#', linkedin: '#' },
    color: '#86efac',
  },
];

const DEPTS = ['All', ...new Set(TEAM.map(m => m.dept))];

const DEPT_COLORS = {
  Leadership: '#c4b5fd',
  Engineering: '#86efac',
  Design: '#f9a8d4',
  Operations: '#fbbf24',
  Community: '#7dd3fc',
  Growth: '#fca5a5',
  Marketing: '#fde68a',
};

// ─── Avatar blob ─────────────────────────────────────────────────────────────
function Avatar({ initials, color, size = 'md' }) {
  const sz = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-14 h-14 text-base';
  return (
    <div
      className={`${sz} rounded-2xl flex items-center justify-center font-display font-bold tracking-wide shrink-0`}
      style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)`, border: `1px solid ${color}40`, color }}
    >
      {initials}
    </div>
  );
}

// ─── Social Links ─────────────────────────────────────────────────────────────
function Socials({ links, color }) {
  const icons = {
    twitter: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    github: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  };
  return (
    <div className="flex items-center gap-2">
      {Object.entries(links).map(([key, href]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
          style={{ '--c': color }}
        >
          {icons[key]}
        </a>
      ))}
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────
function MemberCard({ member, idx, onClick }) {
  const { color } = member;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.5), ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(member)}
      className="group relative rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col gap-4"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${color}60, transparent)`, opacity: 0 }}
        ref={el => { if (el) el.parentElement.addEventListener('mouseenter', () => { el.style.opacity = 1; }); if (el) el.parentElement.addEventListener('mouseleave', () => { el.style.opacity = 0; }); }}
      />

      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 10% 100%, ${color}12, transparent 70%)` }}
      />

      {/* Header row */}
      <div className="relative z-10 flex items-start gap-4">
        <Avatar initials={member.avatar} color={color} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-lg text-white uppercase tracking-tight group-hover:text-[var(--heading)] transition-colors truncate">
              {member.name}
            </h3>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest mt-0.5" style={{ color }}>
            {member.role}
          </p>
          <span className="mt-1 inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/10 text-white/40">
            {member.dept}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/20 shrink-0">{member.id}</span>
      </div>

      {/* Bio */}
      <p className="relative z-10 font-sans text-sm text-white/55 leading-relaxed line-clamp-2">
        {member.bio}
      </p>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/8">
        <Socials links={member.links} color={color} />
        <span className="font-mono text-[10px] text-white/30 group-hover:translate-x-1 group-hover:text-[var(--brand)] transition-all">
          VIEW →
        </span>
      </div>
    </motion.div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function MemberModal({ member, onClose }) {
  const { color } = member;
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.93, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 24, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.08 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)]"
      >
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />

        <div className="p-8 space-y-6">
          {/* Close */}
          <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
            ✕
          </button>

          {/* Identity */}
          <div className="flex items-center gap-5">
            <Avatar initials={member.avatar} color={color} size="lg" />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight">{member.name}</h2>
              <p className="font-mono text-[11px] uppercase tracking-widest mt-1" style={{ color }}>{member.role}</p>
              <span className="mt-2 inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/10 text-white/40">
                {member.dept}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.025] p-5">
            <p className="font-sans text-sm text-white/75 leading-relaxed">{member.bio}</p>
          </div>

          {/* Stats + record */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="font-mono text-[9px] uppercase tracking-wider block" style={{ color }}>Member ID</span>
              <p className="font-display text-xl text-white mt-1">#{member.id}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
              <span className="font-mono text-[9px] uppercase tracking-wider block" style={{ color }}>Department</span>
              <p className="font-sans text-sm text-white mt-1 font-medium">{member.dept}</p>
            </div>
          </div>

          {/* Socials */}
          <div className="pt-4 border-t border-white/8 flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-white/30 tracking-widest">Connect</span>
            <Socials links={member.links} color={color} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Team Page ────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [dept, setDept] = useState('All');
  const [selected, setSelected] = useState(null);
  const [hoveredDept, setHoveredDept] = useState(null);

  const filtered = TEAM.filter(m => dept === 'All' || m.dept === dept);

  return (
    <div className="relative min-h-screen bg-[#0c0c0f] text-white overflow-x-hidden selection:bg-[var(--brand)] selection:text-black">
      <style>{CSS}</style>

      {/* Back nav */}
      <Link to="/" className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md rounded-full transition-all">
        ← Genesis
      </Link>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Grid bg */}
        <div className="absolute inset-0 team-grid-bg opacity-40 pointer-events-none" />
        {/* Radial fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,transparent,#0c0c0f_80%)] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">The Genesis Collective</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[clamp(3rem,11vw,9rem)] leading-none tracking-tighter uppercase text-white"
        >
          MEET THE<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.18)' }}>BUILDERS</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="mt-8 max-w-lg font-sans text-base text-white/50 font-light leading-relaxed">
          {TEAM.length} minds across engineering, design, operations, and community — unified by one obsession: building remarkable developer experiences.
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="mt-10 flex items-center gap-8 font-mono text-xs text-white/40">
          {[
            { v: TEAM.length, l: 'Team Members' },
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
      </section>

      {/* ── DEPT FILTER BAR ──────────────────────────────── */}
      <div className="sticky top-4 z-40 px-4 sm:px-8 max-w-[1300px] mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mr-1">Filter</span>
          {DEPTS.map(d => {
            const dc = DEPT_COLORS[d] || 'var(--brand)';
            const active = dept === d;
            return (
              <button
                key={d}
                onClick={() => setDept(d)}
                onMouseEnter={() => setHoveredDept(d)}
                onMouseLeave={() => setHoveredDept(null)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono uppercase tracking-wider transition-all ${active ? 'text-black font-bold' : 'text-white/55 hover:text-white border border-white/10 hover:border-white/25'}`}
                style={active ? { background: dc, borderColor: dc } : {}}
              >
                {d}
                {d !== 'All' && <span className="ml-1 opacity-60">·{TEAM.filter(m => m.dept === d).length}</span>}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[10px] text-white/25 tabular-nums">{filtered.length} members</span>
        </motion.div>
      </div>

      {/* ── GRID ─────────────────────────────────────────── */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-8 pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((m, i) => (
              <MemberCard key={m.id} member={m} idx={i} onClick={setSelected} />
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <section className="max-w-[1300px] mx-auto px-4 sm:px-8 pb-24">
        <div className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(196,181,253,0.06),transparent)] pointer-events-none" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">Join the Team</span>
          <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-3 mb-4">
            We're Always<br />Looking for Builders
          </h2>
          <p className="font-sans text-base text-white/50 max-w-md mx-auto leading-relaxed mb-8">
            If you're passionate about developer communities and want to help shape the future of Genesis, we'd love to hear from you.
          </p>
          <Link to="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:opacity-90 transition-all shadow-[0_0_30px_rgba(196,181,253,0.3)]">
            View Open Roles ↗
          </Link>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  .team-grid-bg {
    background-image:
      linear-gradient(rgba(196,181,253,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(196,181,253,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
`;
