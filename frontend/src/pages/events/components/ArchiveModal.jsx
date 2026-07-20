import React from 'react';
import { motion } from 'framer-motion';

const CAT_COLOR = {
  Hackathon: '#c4b5fd',
  Workshop:  '#86efac',
  Meetup:    '#fbbf24',
  Summit:    '#f9a8d4',
};
function catColor(c) { return CAT_COLOR[c] || '#c4b5fd'; }

export function ArchiveModal({ event, onClose, isUrl }) {
  const accent = catColor(event.category);
  const link = isUrl(event.media) ? event.media : isUrl(event.attendees) ? event.attendees : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-2xl overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 24 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.08 }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col archive-scrollbar"
      >
        {/* Hero banner */}
        <div className="relative h-64 sm:h-80 shrink-0 overflow-hidden">
          <img
            src={event.img}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-[#111116]/60 to-transparent" />
          {/* Accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}80, transparent)` }} />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 border border-white/20 text-white hover:bg-white/15 transition-all backdrop-blur-md text-sm"
          >
            ✕
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-16 space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest rounded-full border font-bold"
                style={{ borderColor: `${accent}50`, color: accent, background: `${accent}20` }}
              >
                {event.category}
              </span>
              <span className="font-mono text-[10px] text-white/40">{event.year}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight leading-none">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 archive-scrollbar">
          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Location', value: event.location },
              { label: 'Date', value: event.date || '—' },
              { label: 'Attendance', value: isUrl(event.attendees) ? 'See record →' : (event.attendees || '500+ est.') },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-4 border border-white/8 bg-white/[0.025] space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider block" style={{ color: accent }}>
                  {label}
                </span>
                <p className="font-sans text-sm text-white font-medium leading-snug">{value}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          <div className="space-y-2 pt-2">
            <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/30">Archive Overview</h5>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              {event.title} brought together developers, innovators, and mentors for an immersive experience focused on coding, technical workshops, and collaborative problem-solving. This record is part of the Genesis digital archive spanning 2022–2026.
            </p>
          </div>

          {/* Sponsors */}
          {event.sponsors && event.sponsors !== '-' && event.sponsors.trim() !== '' && (
            <div className="space-y-2 pt-2 border-t border-white/8">
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-white/30">Supporting Partners</h5>
              <div className="font-mono text-xs text-white/60 bg-white/[0.02] border border-white/8 rounded-xl px-4 py-3">
                {event.sponsors}
              </div>
            </div>
          )}

          {/* CTA row */}
          <div className="pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[11px] uppercase font-bold tracking-wider text-black transition-all"
                style={{ background: accent, boxShadow: `0 0 30px ${accent}40` }}
              >
                View Record ↗
              </a>
            ) : (
              <span className="font-mono text-[10px] text-white/25">
                GENESIS ARCHIVE RECORD #{event.id}
              </span>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-mono text-[11px] uppercase tracking-wider transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
