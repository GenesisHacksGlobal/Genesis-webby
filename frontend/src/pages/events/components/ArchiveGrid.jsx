import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt } from '@shared/ui';
import { GalleryGridBlock } from '@/components/ui/gallery-grid-block-shadcnui';

// Category color accents
const CAT_COLOR = {
  Hackathon: '#c4b5fd',
  Workshop:  '#86efac',
  Meetup:    '#fbbf24',
  Summit:    '#f9a8d4',
};
function catColor(c) { return CAT_COLOR[c] || '#c4b5fd'; }

// ─── Grid View Card (uniform) ─────────────────────────────────────────────────
function GridCard({ event, idx, onSelect }) {
  const accent = catColor(event.category);
  const col = 'col-span-1';
  const minH = 'min-h-[300px]';

  return (
    <motion.div
      layout
      key={event.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: Math.min(idx * 0.035, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className={`${col} ${minH} flex`}
    >
      <Tilt glare max={7} className="flex-1">
        <div
          onClick={() => onSelect(event)}
          className="relative w-full h-full rounded-2xl border border-white/8 bg-white/[0.015] hover:bg-white/[0.035] cursor-pointer overflow-hidden flex flex-col justify-between p-6 transition-all duration-500 hover:border-white/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] group"
          style={{ '--accent': accent }}
        >
          {/* Image bg */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={event.img}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover opacity-[0.12] group-hover:opacity-[0.28] group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-[#0c0c0f]/85 to-transparent" />
          </div>

          {/* Glow from accent on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 80% 60% at 10% 90%, ${accent}18, transparent 70%)` }}
          />

          {/* Top: category + year */}
          <div className="relative z-10 flex items-center justify-between">
            <span
              className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest border"
              style={{ borderColor: `${accent}40`, color: accent, background: `${accent}12` }}
            >
              {event.category}
            </span>
            <span className="font-mono text-[10px] text-white/30">{event.year}</span>
          </div>

          {/* Title */}
          <div className="relative z-10 mt-auto space-y-2">
            <h3 className="font-display text-xl uppercase tracking-tight text-white group-hover:text-[var(--heading)] leading-tight transition-colors">
              {event.title}
            </h3>
            <p className="font-sans text-xs text-white/45 leading-snug line-clamp-2">{event.location}</p>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/8 flex items-center justify-between font-mono text-[10px] text-white/35">
            <span>{event.date || 'RECORD'}</span>
            <span
              className="group-hover:translate-x-1 transition-transform"
              style={{ color: accent }}
            >
              VIEW →
            </span>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
}

// ─── Table Row ────────────────────────────────────────────────────────────────
function TableRow({ event, idx, onSelect }) {
  const accent = catColor(event.category);
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: Math.min(idx * 0.02, 0.3) }}
      onClick={() => onSelect(event)}
      className="group cursor-pointer hover:bg-white/[0.035] transition-colors border-b border-white/5 last:border-0"
    >
      <td className="py-4 px-5 font-mono text-[10px] text-white/25 w-12">{event.id}</td>
      <td className="py-4 px-5">
        <span className="font-sans text-sm text-white group-hover:text-[var(--heading)] transition-colors font-medium">
          {event.title}
        </span>
      </td>
      <td className="py-4 px-5 hidden sm:table-cell">
        <span
          className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border"
          style={{ borderColor: `${accent}40`, color: accent, background: `${accent}12` }}
        >
          {event.category}
        </span>
      </td>
      <td className="py-4 px-5 hidden md:table-cell font-mono text-[11px] text-white/45">{event.city}</td>
      <td className="py-4 px-5 hidden lg:table-cell font-mono text-[11px] text-white/35">{event.date || event.year}</td>
      <td className="py-4 px-5 text-right">
        <span className="font-mono text-[10px] text-white/30 group-hover:text-[var(--brand)] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1">
          VIEW ↗
        </span>
      </td>
    </motion.tr>
  );
}

// ─── Main Archive Grid ────────────────────────────────────────────────────────
export function ArchiveGrid({ events, viewMode, onSelect }) {
  return (
    <section className="mt-12 max-w-[1400px] mx-auto px-4 sm:px-8 pb-32">

      {/* Section label */}
      <div className="mb-8 flex items-end justify-between border-b border-white/8 pb-5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
            ARCHIVE // EXPLORER
          </span>
          <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
            Event Archive Wall
          </h2>
        </div>
        <span className="font-mono text-xs text-white/25 tabular-nums">{events.length} records</span>
      </div>

      {viewMode === 'grid' ? (
        <GalleryGridBlock
          images={events.map((e) => ({
            id: e.id,
            url: e.img,
            title: e.title,
            category: e.category,
            rawEvent: e,
          }))}
          onSelectEvent={(imgObj) => {
            if (imgObj && imgObj.rawEvent) {
              onSelect(imgObj.rawEvent);
            }
          }}
        />
      ) : (
        <div className="border border-white/8 rounded-2xl overflow-hidden bg-white/[0.01]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8 bg-white/[0.025] text-white/35 text-[9px] font-mono uppercase tracking-widest">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5 hidden sm:table-cell">Category</th>
                <th className="py-3 px-5 hidden md:table-cell">City</th>
                <th className="py-3 px-5 hidden lg:table-cell">Date</th>
                <th className="py-3 px-5 text-right">Record</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {events.map((e, i) => (
                  <TableRow key={e.id} event={e} idx={i} onSelect={onSelect} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {events.length === 0 && <EmptyState />}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-2xl">
      <p className="font-mono text-xs uppercase tracking-widest text-white/30">No records match your filters</p>
    </div>
  );
}
