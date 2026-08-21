import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HackersOccupiedPuneSchedule from '@features/events-showcase/HackersOccupiedPuneSchedule';

const CAT_COLOR = {
  Hackathon: '#c4b5fd',
  Workshop:  '#86efac',
  Meetup:    '#fbbf24',
  Summit:    '#f9a8d4',
};
function catColor(c) { return CAT_COLOR[c] || '#c4b5fd'; }

export function ArchiveModal({ event, onClose, isUrl }) {
  if (!event) return null;

  const accent = catColor(event?.category);
  const checkUrl = typeof isUrl === 'function'
    ? isUrl
    : (s) => s && typeof s === 'string' && (s.startsWith('http://') || s.startsWith('https://'));

  const link = checkUrl(event?.media)
    ? event.media
    : checkUrl(event?.attendees)
    ? event.attendees
    : (event?.luma || null);

  const isPuneEvent = Boolean(
    event &&
    ((event.title || '').toLowerCase().includes('occupied pune') || event.id === 'evt-upcoming-01')
  );

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
        className={`relative w-full ${isPuneEvent ? 'max-w-5xl' : 'max-w-3xl'} bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-[0_60px_120px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col archive-scrollbar`}
      >
        {/* Hero banner */}
        <div className="relative h-64 sm:h-80 shrink-0 overflow-hidden">
          <img
            src={event?.img || event?.image || '/assets/BrandImg/1.png'}
            alt={event?.title || 'Event'}
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
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border"
                style={{ color: accent, borderColor: `${accent}40`, backgroundColor: `${accent}15` }}
              >
                {event?.category || 'Event'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-white/60 bg-black/40 border border-white/10">
                {event?.year || '2026'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono text-white/60 bg-black/40 border border-white/10">
                {event?.city || 'Pune'}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight">
              {event?.title}
            </h2>
            {event?.kicker && (
              <p className="font-mono text-xs text-[var(--brand)]">{event.kicker}</p>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 archive-scrollbar">
          {/* Meta bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block">Location</span>
              <span className="text-white font-bold">{event?.location || event?.city || 'Pune'}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block">Date</span>
              <span className="text-white font-bold">{event?.date || event?.year}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block">Scale</span>
              <span className="text-[var(--brand)] font-bold">{event?.attendees || '500+ Hackers'}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-white/40 block">Organizers</span>
              <span className="text-white font-bold">{event?.sponsors || 'Genesis'}</span>
            </div>
          </div>

          {/* Blurb */}
          {event?.blurb && (
            <div className="space-y-2">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-white/40">About Event</h4>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed font-sans">{event.blurb}</p>
            </div>
          )}

          {/* Hackers Occupied Pune Master Schedule Section */}
          {isPuneEvent && (
            <div className="pt-6 border-t border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Official Schedule Integrated
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-white mt-1">
                    Hackathon Agenda & Live Timeline
                  </h3>
                </div>
                <Link
                  to="/events/hackers-occupied-pune"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[var(--brand)] text-black font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all text-center shrink-0"
                >
                  Open Dedicated Page ↗
                </Link>
              </div>

              {/* Embed schedule component */}
              <HackersOccupiedPuneSchedule showHeader={false} />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="font-mono text-[10px] text-white/30">ID: {event?.id}</span>
            <div className="flex items-center gap-3">
              {isPuneEvent && (
                <Link
                  to="/events/hackers-occupied-pune"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-white/20 text-xs font-mono text-white hover:bg-white/10 transition-all"
                >
                  View Full Schedule
                </Link>
              )}
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cinema text-xs py-2 px-5"
                >
                  Official Event Link ↗
                </a>
              ) : (
                <span className="font-mono text-xs text-white/40 italic">Archived Record</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
