import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEPT_COLORS, DEPTS, TEAM_MEMBERS } from '@shared/data/teamMembers';

export function Avatar({ initials, color, photo, size = 'md' }) {
  const sz = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-14 h-14 text-base';
  if (photo) {
    const imgSz = size === 'lg' ? 'w-20 h-20' : 'w-14 h-14';
    return (
      <div
        className={`${imgSz} rounded-2xl overflow-hidden shrink-0 border shadow-md transition-transform group-hover:scale-105 duration-300`}
        style={{ borderColor: `${color}40` }}
      >
        <img src={photo} alt={initials} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${sz} rounded-2xl flex items-center justify-center font-display font-bold tracking-wide shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {initials}
    </div>
  );
}

function Socials({ links }) {
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
      {Object.entries(links || {}).map(([key, href]) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all hover:bg-white/10"
        >
          {icons[key]}
        </a>
      ))}
    </div>
  );
}

function MemberCard({ member, idx, onClick, viewMode }) {
  const { color } = member;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
        onClick={() => onClick(member)}
        className="group relative rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-white/25 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <Avatar initials={member.avatar} color={color} photo={member.photo} size="sm" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base text-white uppercase tracking-tight group-hover:text-[var(--brand)] transition-colors truncate">
                {member.name}
              </h3>
              <span className="font-mono text-[9px] text-white/30 shrink-0">#{member.id}</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider mt-0.5" style={{ color }}>
              {member.role}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/10 text-white/40">
            {member.dept}
          </span>
          <Socials links={member.links} />
          <span className="font-mono text-[10px] text-white/30 group-hover:text-[var(--brand)] group-hover:translate-x-1 transition-all">
            DOSSIER →
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onClick(member)}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between gap-5"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 70% 60% at 10% 100%, ${color}15, transparent 70%)` }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <Avatar initials={member.avatar} color={color} photo={member.photo} />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg text-white uppercase tracking-tight group-hover:text-[var(--brand)] transition-colors truncate">
            {member.name}
          </h3>
          <p className="font-mono text-[10px] uppercase tracking-widest mt-0.5 truncate" style={{ color }}>
            {member.role}
          </p>
          <span className="mt-1.5 inline-flex px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/10 text-white/40">
            {member.dept}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/20 shrink-0">#{member.id}</span>
      </div>

      <p className="relative z-10 font-sans text-sm text-white/55 leading-relaxed line-clamp-2">
        {member.bio}
      </p>

      <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/8">
        <Socials links={member.links} />
        <span className="font-mono text-[10px] text-white/30 group-hover:translate-x-1 group-hover:text-[var(--brand)] transition-all">
          DOSSIER →
        </span>
      </div>
    </motion.div>
  );
}

export function MemberModal({ member, onClose }) {
  const { color } = member;

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.93, y: 24, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 24, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.08 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e0e13] border border-white/20 rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.95)]"
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />

        <div className="p-8 space-y-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm bg-white/5"
          >
            ✕
          </button>

          <div className="flex items-center gap-5">
            <Avatar initials={member.avatar} color={color} photo={member.photo} size="lg" />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight">{member.name}</h2>
              <p className="font-mono text-[11px] uppercase tracking-widest mt-1 font-bold" style={{ color }}>{member.role}</p>
              <span className="mt-2 inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border border-white/15 text-white/50">
                {member.dept}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/30 block mb-2">Biography & Mission</span>
            <p className="font-sans text-sm text-white/80 leading-relaxed">{member.bio}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <span className="font-mono text-[9px] uppercase tracking-wider block" style={{ color }}>Member ID</span>
              <p className="font-display text-xl text-white mt-1">#{member.id}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <span className="font-mono text-[9px] uppercase tracking-wider block" style={{ color }}>Department</span>
              <p className="font-sans text-sm text-white mt-1 font-medium">{member.dept}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-widest">Connect Directly</span>
            <Socials links={member.links} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function TeamMemberDirectory({ dept, setDept, onSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredMembers = TEAM_MEMBERS.filter((m) => {
    const matchesDept = dept === 'All' || m.dept === dept;
    const matchesSearch =
      searchQuery === '' ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section id="directory-roster" className="relative bg-[#08080b] pt-12 pb-24 border-t border-white/8">
      {/* Sticky Glass Filter Bar */}
      <div className="sticky top-4 z-40 px-4 sm:px-8 max-w-[1300px] mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0b0b0f]/90 backdrop-blur-2xl border border-white/12 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        >
          {/* Department Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/30 mr-1 hidden sm:inline">Filter</span>
            {DEPTS.map((d) => {
              const dc = DEPT_COLORS[d] || 'var(--brand)';
              const active = dept === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDept(d)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'text-black font-bold shadow-md'
                      : 'text-white/60 hover:text-white border border-white/10 hover:border-white/25'
                  }`}
                  style={active ? { background: dc, borderColor: dc } : {}}
                >
                  {d}
                  {d !== 'All' && (
                    <span className="ml-1 opacity-60">
                      ·{TEAM_MEMBERS.filter((m) => m.dept === d).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Box & View Mode Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                placeholder="Search member or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--brand)] transition-colors font-sans"
              />
              <svg className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Layout Mode Toggle Buttons */}
            <div className="flex items-center rounded-xl bg-white/[0.04] border border-white/12 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${viewMode === 'grid' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'}`}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${viewMode === 'list' ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white'}`}
                title="List View"
              >
                ≡
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Directory Grid Header */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-8">
        <div className="mb-10 border-b border-white/10 pb-6 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">Genesis Collective</span>
            <h2 className="text-3xl font-display uppercase tracking-tight text-white sm:text-5xl mt-1">
              Full Directory
            </h2>
          </div>
          <span className="font-mono text-xs text-white/40">
            SHOWING {filteredMembers.length} OF {TEAM_MEMBERS.length}
          </span>
        </div>

        {/* Empty Search Results State */}
        {filteredMembers.length === 0 && (
          <div className="py-20 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <p className="font-display text-2xl text-white uppercase">No Members Found</p>
            <p className="font-sans text-sm text-white/40 mt-2">Try adjusting your search criteria or filter category.</p>
            <button
              type="button"
              onClick={() => {
                setDept('All');
                setSearchQuery('');
              }}
              className="mt-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Directory Card Grid / List */}
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'flex flex-col gap-3'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <MemberCard
                key={member.id}
                member={member}
                idx={idx}
                onClick={onSelect}
                viewMode={viewMode}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </main>
    </section>
  );
}
