import React from 'react';
import { motion } from 'framer-motion';

export function ArchiveCommandBar({
  query, setQuery,
  category, setCategory,
  year, setYear,
  city, setCity,
  categories, years, cities,
  count, viewMode, setViewMode,
  onCmdOpen, hasFilters, resetFilters,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="sticky top-4 z-50 px-4 sm:px-8 max-w-[1400px] mx-auto"
    >
      <div className="bg-[#0e0e12]/90 backdrop-blur-2xl border border-white/12 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row items-center gap-3">
        
        {/* Search */}
        <div className="relative flex-1 w-full flex items-center gap-2 min-w-0">
          <svg className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search records, cities, partners…"
            className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none font-sans"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/40 hover:text-white text-xs shrink-0">✕</button>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {[
            { val: category, set: setCategory, opts: categories, label: 'Cat' },
            { val: year, set: setYear, opts: years, label: 'Year' },
            { val: city, set: setCity, opts: cities, label: 'City' },
          ].map(({ val, set, opts, label }) => (
            <select
              key={label}
              value={val}
              onChange={e => set(e.target.value)}
              className="bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--brand)] cursor-pointer"
            >
              {opts.map(o => (
                <option key={o} value={o} className="bg-[#121215]">
                  {o === 'All' ? `${label}: All` : o}
                </option>
              ))}
            </select>
          ))}

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-white/10 shrink-0" />

        {/* View toggle + count + cmd */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
            {[
              { id: 'grid', icon: <GridIcon /> },
              { id: 'table', icon: <ListIcon /> },
            ].map(({ id, icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id)}
                className={`p-1.5 rounded-lg transition-all ${viewMode === id ? 'bg-[var(--brand)] text-black' : 'text-white/50 hover:text-white'}`}
              >
                {icon}
              </button>
            ))}
          </div>

          <span className="font-mono text-[10px] text-white/30 tabular-nums">{count}</span>

          <button
            onClick={onCmdOpen}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 border border-white/12 hover:border-[var(--brand)]/60 bg-white/4 hover:bg-white/8 rounded-lg text-[10px] font-mono text-white/50 hover:text-white transition-all"
            title="Open Spotlight (Cmd+K)"
          >
            <span>⌘K</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function GridIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}
