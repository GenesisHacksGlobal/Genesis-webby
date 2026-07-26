import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryGridBlock } from '@/components/ui/gallery-grid-block-shadcnui';

// Category color accents
const CAT_COLOR = {
  Hackathon: '#c4b5fd',
  Workshop:  '#86efac',
  Meetup:    '#fbbf24',
  Summit:    '#f9a8d4',
};
function catColor(c) { return CAT_COLOR[c] || '#c4b5fd'; }



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
