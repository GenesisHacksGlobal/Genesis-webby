import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GALLERY_PHOTOS } from "@shared/data/mediaAssets";
import { eventService } from "@shared/services/eventService";
import { Footer } from "@widgets/layout";
import { ArchiveHero, ArchiveGrid, ArchiveModal, ArchiveCommandBar, HorizontalScrollReel } from "./components";

const isUrl = (s) => s && (s.startsWith('http://') || s.startsWith('https://'));

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [eventsList, setEventsList] = useState(() => eventService.getEvents());
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [year, setYear] = useState('All');
  const [city, setCity] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Subscribe to real-time event database updates from Admin Panel
  useEffect(() => {
    const unsubscribe = eventService.subscribe((updated) => {
      setEventsList(updated);
    });
    return () => unsubscribe();
  }, []);

  // Format events for display
  const processedEvents = useMemo(() => {
    return eventsList.map((e, i) => {
      const yr = (e.date?.match(/20\d\d/) || [])[0] || (i % 2 === 0 ? '2025' : '2026');
      const parts = (e.location || '').split(',');
      const cityName = e.city || (parts.length > 1 ? parts[parts.length - 1].trim() : (e.location || 'India'));
      return {
        ...e,
        year: yr,
        city: cityName,
        img: e.image || e.img,
      };
    });
  }, [eventsList]);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen((v) => !v); }
      if (e.key === 'Escape') { setCmdOpen(false); setSelected(null); }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(processedEvents.map((e) => e.category).filter(Boolean))], [processedEvents]);
  const years = useMemo(() => ['All', ...new Set(processedEvents.map((e) => e.year)).add('2024').add('2025').add('2026')].sort((a, b) => b.localeCompare(a)), [processedEvents]);
  const cities = useMemo(() => ['All', ...new Set(processedEvents.map((e) => e.city).filter(Boolean))].slice(0, 20), [processedEvents]);

  const filtered = useMemo(() => {
    return processedEvents.filter((e) => {
      const q = query.toLowerCase();
      return (
        (category === 'All' || e.category === category) &&
        (year === 'All' || e.year === year) &&
        (city === 'All' || e.city === city) &&
        (!q || e.title.toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q))
      );
    });
  }, [processedEvents, query, category, year, city]);

  const resetFilters = useCallback(() => { setQuery(''); setCategory('All'); setYear('All'); setCity('All'); }, []);

  return (
    <div className="relative min-h-screen bg-[#0c0c0f] text-white overflow-x-hidden selection:bg-[var(--brand)] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Back nav */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md rounded-full transition-all"
      >
        ← Genesis
      </Link>

      {/* Admin Portal quick link */}
      <Link
        to="/admin-events"
        className="fixed top-6 right-6 z-50 inline-flex items-center gap-2 px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--brand)] border border-[var(--brand)]/30 hover:border-[var(--brand)] bg-black/60 backdrop-blur-md rounded-full transition-all"
      >
        ⚙ Admin Portal
      </Link>

      {/* Hero */}
      <ArchiveHero total={processedEvents.length} photos={GALLERY_PHOTOS} />

      {/* GSAP ScrollTrigger Pinned Horizontal Reel */}
      <HorizontalScrollReel events={processedEvents} onSelect={setSelected} />

      {/* Command Bar */}
      <ArchiveCommandBar
        query={query} setQuery={setQuery}
        category={category} setCategory={setCategory}
        year={year} setYear={setYear}
        city={city} setCity={setCity}
        categories={categories} years={years} cities={cities}
        count={filtered.length}
        viewMode={viewMode} setViewMode={setViewMode}
        onCmdOpen={() => setCmdOpen(true)}
        hasFilters={category !== 'All' || year !== 'All' || city !== 'All' || !!query}
        resetFilters={resetFilters}
      />

      {/* Archive Grid */}
      <ArchiveGrid
        events={filtered}
        viewMode={viewMode}
        onSelect={setSelected}
      />

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <ArchiveModal event={selected} onClose={() => setSelected(null)} isUrl={isUrl} />
        )}
      </AnimatePresence>

      {/* Command Palette */}
      <AnimatePresence>
        {cmdOpen && (
          <CommandPalette
            events={filtered}
            query={query}
            setQuery={setQuery}
            categories={categories}
            category={category}
            setCategory={setCategory}
            onSelect={(e) => { setSelected(e); setCmdOpen(false); }}
            onClose={() => setCmdOpen(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// ─── Command Palette ─────────────────────────────────────────────────────────
function CommandPalette({ events, query, setQuery, categories, category, setCategory, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#141418] border border-white/20 rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/10">
          <svg className="w-4 h-4 text-[var(--brand)] mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archive records…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
          />
          <kbd onClick={onClose} className="px-2 py-0.5 text-[9px] font-mono border border-white/15 text-white/40 rounded cursor-pointer hover:text-white">ESC</kbd>
        </div>
        <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-white/10">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono transition-all ${category === c ? 'bg-[var(--brand)] text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
          {events.slice(0, 8).map((e) => (
            <div key={e.id} onClick={() => onSelect(e)}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/5 cursor-pointer group transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[var(--brand)] w-5 shrink-0">{e.id}</span>
                <div>
                  <p className="text-sm text-white group-hover:text-[var(--heading)] transition-colors">{e.title}</p>
                  <p className="text-[10px] text-white/40 font-mono">{e.city} · {e.year}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/30 group-hover:text-[var(--brand)] transition-colors">↵ OPEN</span>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-center py-10 text-xs font-mono text-white/30">No records match "{query}"</p>
          )}
        </div>
        <div className="px-4 py-2 border-t border-white/10 flex justify-between text-[9px] font-mono text-white/30">
          <span>⌘K SPOTLIGHT</span>
          <span>{events.length} ARCHIVE RECORDS</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────
const STYLES = `
  @keyframes grain {
    0%,100%{transform:translate(0,0)}
    10%{transform:translate(-2%,-3%)}
    30%{transform:translate(3%,-1%)}
    50%{transform:translate(-1%,3%)}
    70%{transform:translate(2%,2%)}
    90%{transform:translate(-3%,1%)}
  }
  .noise::after{
    content:'';position:absolute;inset:-50%;width:200%;height:200%;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity:0.035;animation:grain 6s steps(1) infinite;pointer-events:none;z-index:1;
  }
  .archive-scrollbar::-webkit-scrollbar{width:4px}
  .archive-scrollbar::-webkit-scrollbar-track{background:transparent}
  .archive-scrollbar::-webkit-scrollbar-thumb{background:rgba(196,181,253,0.3);border-radius:9999px}
  .card-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:1.5rem}
  @media(max-width:768px){.card-grid{grid-template-columns:1fr}}
  .scan-line{
    background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(196,181,253,0.015) 2px,rgba(196,181,253,0.015) 4px);
    pointer-events:none;
  }
`;
