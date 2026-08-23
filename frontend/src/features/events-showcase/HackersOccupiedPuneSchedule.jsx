import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_DETAILS, ACTIVITY_CATEGORIES, PUNE_SCHEDULE_DATA } from '@shared/data/puneEventScheduleData';

// ─── Live Countdown Timer Component ───────────────────────────────────────────
function LiveCountdownTimer({ targetDateStr, endDateStr }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'upcoming' });

  useEffect(() => {
    const calculateTime = () => {
      try {
        const now = new Date().getTime();
        const startTarget = targetDateStr ? new Date(targetDateStr).getTime() : new Date("2026-08-22T11:00:00+05:30").getTime();
        const endTarget = endDateStr ? new Date(endDateStr).getTime() : new Date("2026-08-23T15:00:00+05:30").getTime();

        if (isNaN(startTarget) || isNaN(endTarget)) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'upcoming' });
          return;
        }

        if (now < startTarget) {
          const diff = startTarget - now;
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            status: 'upcoming',
          });
        } else if (now >= startTarget && now <= endTarget) {
          const diff = endTarget - now;
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            status: 'live',
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, status: 'ended' });
        }
      } catch (err) {
        console.error("Timer calculation error:", err);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr, endDateStr]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#13131c] via-[#0d0d14] to-[#181224] p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Background glow orb */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--brand)]/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-[90px]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {timeLeft.status === 'upcoming' && 'Event Starts In (22 Aug 2026, 11:00 AM IST)'}
            {timeLeft.status === 'live' && '🔴 Hackathon Live Now — Time Remaining'}
            {timeLeft.status === 'ended' && 'Event Concluded — VIT, Pune'}
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-white uppercase tracking-tight mt-3">
            Hackers Occupied Pune Timer
          </h3>
          <p className="text-xs text-white/50 font-mono mt-1">
            Vishwakarma Institute of Technology (VIT), Pune · 24-Hour Hybrid Creator Sprint
          </p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINS', val: timeLeft.minutes },
            { label: 'SECS', val: timeLeft.seconds },
          ].map(({ label, val }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className="text-xl sm:text-3xl font-bold text-white/20 -mt-4">:</span>}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center min-w-[56px] sm:min-w-[70px] h-14 sm:h-18 rounded-xl bg-black/60 border border-white/10 text-xl sm:text-3xl font-extrabold text-white shadow-inner font-mono tracking-wider">
                  {String(val || 0).padStart(2, '0')}
                </div>
                <span className="text-[9px] uppercase tracking-widest text-white/40 mt-1.5 font-bold">
                  {label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Schedule Component ──────────────────────────────────────────────────
export default function HackersOccupiedPuneSchedule({ showHeader = true }) {
  const [dayFilter, setDayFilter] = useState('all'); // 'all', 1, 2
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'table'

  const categoriesList = useMemo(() => {
    const cats = ACTIVITY_CATEGORIES ? Object.keys(ACTIVITY_CATEGORIES) : [];
    return ['All', ...cats];
  }, []);

  const filteredSchedule = useMemo(() => {
    const scheduleData = PUNE_SCHEDULE_DATA || [];
    return scheduleData.filter((item) => {
      if (!item) return false;
      const matchDay = dayFilter === 'all' || item.dayNum === Number(dayFilter);
      const matchCat = categoryFilter === 'All' || item.type === categoryFilter;
      const q = (searchQuery || '').toLowerCase().trim();
      const matchQuery =
        !q ||
        (item.activity || '').toLowerCase().includes(q) ||
        (item.type || '').toLowerCase().includes(q) ||
        (item.notes || '').toLowerCase().includes(q) ||
        (item.participantImpact || '').toLowerCase().includes(q) ||
        (item.startTime || '').includes(q);
      return matchDay && matchCat && matchQuery;
    });
  }, [dayFilter, categoryFilter, searchQuery]);

  const targetDate = EVENT_DETAILS?.startDate || "2026-08-22T11:00:00+05:30";
  const endDate = EVENT_DETAILS?.endDate || "2026-08-23T15:00:00+05:30";

  return (
    <div className="w-full space-y-8 text-white">
      {showHeader && (
        <LiveCountdownTimer
          targetDateStr={targetDate}
          endDateStr={endDate}
        />
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Schedule Slots', val: `${PUNE_SCHEDULE_DATA?.length || 44} Items` },
          { label: 'Hacking Duration', val: '24 Hours' },
          { label: 'Mentoring Rounds', val: '3 Rounds' },
          { label: 'Logitech Challenges', val: '3 Activities' },
          { label: 'Special Session', val: 'SalesForce + Cert' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-center">
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block">{s.label}</span>
            <span className="font-sans font-bold text-sm text-[var(--brand)] mt-0.5 block">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Filter & Controls Panel */}
      <div className="rounded-2xl border border-white/10 bg-[#121218] p-4 sm:p-6 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Day Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
            {[
              { id: 'all', label: 'All Agenda (Aug 22–23)' },
              { id: 1, label: 'Day 1 (22 Aug)' },
              { id: 2, label: 'Day 2 (23 Aug)' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDayFilter(t.id)}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  dayFilter === t.id
                    ? 'bg-[var(--brand)] text-black font-bold shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schedule (e.g. Hacking, Mentoring, Logitech, Snacks)..."
              className="w-full bg-black/50 border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-[var(--brand)] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              Grid Table
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/8">
          {categoriesList.map((cat) => {
            const meta = ACTIVITY_CATEGORIES ? ACTIVITY_CATEGORIES[cat] : null;
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="px-2.5 py-1 text-[10px] font-mono rounded-full border transition-all"
                style={{
                  borderColor: isSelected ? meta?.color || '#c4b5fd' : 'rgba(255, 255, 255, 0.1)',
                  backgroundColor: isSelected ? meta?.bg || 'rgba(196,181,253,0.2)' : 'transparent',
                  color: isSelected ? meta?.color || '#c4b5fd' : 'rgba(255, 255, 255, 0.6)',
                  fontWeight: isSelected ? '700' : '400',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Schedule Items Counter */}
      <div className="flex items-center justify-between text-xs font-mono text-white/50 px-1">
        <span>SHOWING {filteredSchedule.length} OF {(PUNE_SCHEDULE_DATA || []).length} SCHEDULE EVENTS</span>
        {(categoryFilter !== 'All' || searchQuery || dayFilter !== 'all') && (
          <button
            onClick={() => { setDayFilter('all'); setCategoryFilter('All'); setSearchQuery(''); }}
            className="text-[var(--brand)] hover:underline"
          >
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="relative pl-4 sm:pl-8 space-y-4 before:absolute before:left-2 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[var(--brand)] before:via-white/20 before:to-purple-500/40">
          <AnimatePresence mode="popLayout">
            {filteredSchedule.map((item, idx) => {
              const catMeta = (ACTIVITY_CATEGORIES && ACTIVITY_CATEGORIES[item.type]) || {
                color: '#c4b5fd',
                bg: 'rgba(196,181,253,0.1)',
                border: 'rgba(196,181,253,0.3)',
              };

              return (
                <motion.div
                  key={`timeline-item-${item.id || idx}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.015, 0.2) }}
                  className={`relative group rounded-2xl border bg-gradient-to-r p-4 sm:p-5 transition-all hover:border-white/30 ${
                    item.milestone
                      ? 'border-white/20 bg-white/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
                      : 'border-white/10 bg-white/[0.015]'
                  }`}
                  style={{
                    borderColor: item.milestone ? (catMeta.color || '#c4b5fd') + '60' : undefined,
                  }}
                >
                  {/* Timeline node dot */}
                  <div
                    className="absolute -left-4 sm:-left-8 top-6 w-3 h-3 rounded-full border-2 bg-black transition-all group-hover:scale-125"
                    style={{ borderColor: catMeta.color || '#c4b5fd' }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      {/* Badge row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-white/50 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          {item.date}
                        </span>
                        <span
                          className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border"
                          style={{
                            color: catMeta.color,
                            backgroundColor: catMeta.bg,
                            borderColor: catMeta.border,
                          }}
                        >
                          {item.type}
                        </span>
                        {item.milestone && (
                          <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            ★ Key Milestone
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-white/40 ml-auto sm:ml-0">
                          Target: <strong className="text-white/80">{item.participantImpact}</strong>
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-sans font-bold text-base sm:text-lg text-white group-hover:text-[var(--brand)] transition-colors">
                        {item.activity}
                      </h4>

                      {/* Notes */}
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                        {item.notes}
                      </p>
                    </div>

                    {/* Time & Duration badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0 shrink-0 font-mono">
                      <div className="text-sm font-extrabold text-white">
                        {item.startTime} {item.endTime !== item.startTime ? `– ${item.endTime}` : ''}
                      </div>
                      <div className="text-[11px] text-[var(--brand)] font-semibold mt-0.5">
                        ⏳ {item.duration}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSchedule.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/15 rounded-2xl bg-white/[0.01]">
              <p className="font-mono text-sm text-white/50">No schedule items match your search/filter criteria.</p>
              <button
                onClick={() => { setDayFilter('all'); setCategoryFilter('All'); setSearchQuery(''); }}
                className="mt-3 text-xs font-mono text-[var(--brand)] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-white/15 bg-[#101016] shadow-xl">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/15 bg-white/5 text-[10px] uppercase tracking-wider text-white/50">
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Time Window</th>
                <th className="py-3.5 px-4 font-bold">Duration</th>
                <th className="py-3.5 px-4 font-bold">Activity / Event</th>
                <th className="py-3.5 px-4 font-bold">Type</th>
                <th className="py-3.5 px-4 font-bold">Participants</th>
                <th className="py-3.5 px-4 font-bold">Notes / Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8 font-sans">
              {filteredSchedule.map((item, idx) => {
                const catMeta = (ACTIVITY_CATEGORIES && ACTIVITY_CATEGORIES[item.type]) || { color: '#c4b5fd' };
                return (
                  <tr key={`table-item-${item.id || idx}`} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-white/60 whitespace-nowrap">{item.date}</td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-white whitespace-nowrap">
                      {item.startTime} {item.endTime !== item.startTime ? `– ${item.endTime}` : ''}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[var(--brand)] font-semibold whitespace-nowrap">{item.duration}</td>
                    <td className="py-3 px-4 font-bold text-white text-sm">
                      {item.activity}
                      {item.milestone && <span className="ml-2 text-amber-300">★</span>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full border"
                        style={{ color: catMeta.color || '#c4b5fd', borderColor: (catMeta.color || '#c4b5fd') + '50', backgroundColor: (catMeta.color || '#c4b5fd') + '15' }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-white/80 font-mono whitespace-nowrap">{item.participantImpact}</td>
                    <td className="py-3 px-4 text-xs text-white/70 max-w-xs">{item.notes}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
