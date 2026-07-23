import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAuthService } from '@shared/services/adminAuthService';
import { eventService } from '@shared/services/eventService';
import { AdminEventModal } from './components/AdminEventModal';

export default function AdminEventsPage() {
  const [authed, setAuthed] = useState(adminAuthService.isAuthenticated());
  const [events, setEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'upcoming' | 'past'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sync events on mount and on storage signal
  useEffect(() => {
    if (authed) {
      setEvents(eventService.getEvents());
      const unsubscribe = eventService.subscribe((updated) => setEvents(updated));
      return () => unsubscribe();
    }
  }, [authed]);

  // Handle Login Submission
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = adminAuthService.login(username, password, rememberMe);
    if (res.success) {
      setAuthed(true);
    } else {
      setLoginError(res.error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminAuthService.logout();
    setAuthed(false);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (e.title || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q) ||
        (e.location || '').toLowerCase().includes(q) ||
        (e.city || '').toLowerCase().includes(q) ||
        (e.sponsors || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [events, statusFilter, searchQuery]);

  // Upcoming vs Past Counts
  const upcomingCount = useMemo(() => events.filter((e) => e.status === 'upcoming').length, [events]);
  const pastCount = useMemo(() => events.filter((e) => e.status === 'past').length, [events]);

  // Event Handlers
  const handleSaveEvent = (formData) => {
    if (selectedEvent && selectedEvent.id) {
      eventService.updateEvent(selectedEvent.id, formData);
    } else {
      eventService.addEvent(formData);
    }
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleToggleStatus = (id) => {
    eventService.toggleStatus(id);
  };

  const handleDeleteEvent = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      eventService.deleteEvent(id);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all events back to default database seed? Custom events will be cleared.')) {
      eventService.resetToDefaults();
    }
  };

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[var(--brand)] selection:text-black">
        {/* Background Grid & Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_40%,rgba(196,181,253,0.08),transparent_80%)] pointer-events-none" />
        <div className="absolute inset-0 team-grid-bg opacity-30 pointer-events-none" />

        <Link
          to="/"
          className="fixed top-6 left-6 inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/10 hover:border-white/30 bg-black/40 backdrop-blur-md rounded-full transition-all"
        >
          ← Back to Website
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-[#0e0e13] border border-white/15 rounded-3xl p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9)] relative z-10 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--brand)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Genesis Restricted Portal
            </span>
            <h1 className="font-display text-3xl uppercase tracking-tight text-white mt-1">
              Event Management
            </h1>
            <p className="font-sans text-xs text-white/50">
              Sign in with your authorized admin credentials to manage upcoming & past events.
            </p>
          </div>

          {/* Login Error Alert */}
          {loginError && (
            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono">
              ⚠️ {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-white/60 block mb-1.5">
                Admin Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)] font-mono"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-wider text-white/60 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/12 text-sm text-white focus:outline-none focus:border-[var(--brand)] font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 font-mono pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[var(--brand)]"
                />
                Remember 24h
              </label>
              <span className="text-white/30 text-[10px]">Default: admin / genesis2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--brand)] hover:bg-white text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_30px_rgba(196,181,253,0.35)] mt-2"
            >
              Sign In to Admin Portal →
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── AUTHENTICATED DASHBOARD ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070709] text-white selection:bg-[var(--brand)] selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#09090d]/90 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="font-display text-xl text-white tracking-tight hover:text-[var(--brand)] transition-colors">
              GENESIS <span className="text-[var(--brand)]">ADMIN</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-[9px] uppercase tracking-wider">
              ● Live Admin Mode
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-mono text-xs uppercase transition-all"
            >
              View Events Page ↗
            </Link>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-mono text-xs uppercase transition-all"
              title="Reset data back to initial seed"
            >
              Reset Seed Data
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-mono text-xs uppercase transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Metric Cards Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">Total Events</span>
            <p className="font-display text-3xl text-white mt-1">{events.length}</p>
          </div>

          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 block flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Upcoming Events
            </span>
            <p className="font-display text-3xl text-emerald-300 mt-1">{upcomingCount}</p>
          </div>

          <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-500/5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400 block">Past Events</span>
            <p className="font-display text-3xl text-purple-300 mt-1">{pastCount}</p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 block">Tracks & Categories</span>
            <p className="font-display text-3xl text-white mt-1">
              {[...new Set(events.map((e) => e.category))].length}
            </p>
          </div>
        </div>

        {/* Action Header & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Buttons */}
            {['All', 'upcoming', 'past'].map((st) => {
              const active = statusFilter === st;
              const label = st === 'All' ? 'All Events' : st === 'upcoming' ? 'Upcoming' : 'Past';
              const count = st === 'All' ? events.length : st === 'upcoming' ? upcomingCount : pastCount;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-[var(--brand)] text-black font-bold shadow-md'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box & Add Event CTA */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search event title, city, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/12 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--brand)] w-64 font-sans"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedEvent(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2 rounded-xl bg-[var(--brand)] hover:bg-white text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(196,181,253,0.3)] shrink-0"
            >
              + Create New Event
            </button>
          </div>
        </div>

        {/* Events Data List / Table */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt) => (
              <motion.div
                key={evt.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-lg"
              >
                {/* Event Left Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Image Thumbnail */}
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-black">
                    <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Title & Metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold border ${
                          evt.status === 'upcoming'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                        }`}
                      >
                        {evt.status === 'upcoming' ? '● UPCOMING' : 'PAST'}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                        {evt.category}
                      </span>
                      <span className="font-mono text-[9px] text-white/30">{evt.date}</span>
                    </div>

                    <h3 className="font-display text-lg text-white uppercase tracking-tight mt-1 group-hover:text-[var(--brand)] transition-colors truncate">
                      {evt.title}
                    </h3>
                    <p className="font-sans text-xs text-white/50 truncate">
                      {evt.location || evt.city || 'India'} {evt.sponsors ? `· Sponsors: ${evt.sponsors}` : ''}
                    </p>
                  </div>
                </div>

                {/* Quick Actions Right Column */}
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
                  {/* Status Switcher Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(evt.id)}
                    className={`px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider border transition-all ${
                      evt.status === 'upcoming'
                        ? 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                        : 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                    }`}
                    title="Click to switch status between Upcoming and Past"
                  >
                    Move to {evt.status === 'upcoming' ? 'Past' : 'Upcoming'}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEvent(evt);
                      setIsModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/30 font-mono text-xs uppercase transition-all"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(evt.id, evt.title)}
                    className="px-3 py-1.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 font-mono text-xs uppercase transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.01]">
              <p className="font-display text-xl text-white uppercase">No Events Found</p>
              <p className="font-sans text-xs text-white/40 mt-1">Try clearing your search query or filter mode.</p>
            </div>
          )}
        </div>
      </main>

      {/* Admin Event Modal (Create / Edit) */}
      <AnimatePresence>
        {isModalOpen && (
          <AdminEventModal
            event={selectedEvent}
            onSave={handleSaveEvent}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
