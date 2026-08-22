import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '@widgets/layout';
import HackersOccupiedPuneSchedule from '@features/events-showcase/HackersOccupiedPuneSchedule';
import { EVENT_DETAILS } from '@shared/data/puneEventScheduleData';

export default function HackersOccupiedPunePage() {
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // Ignore scroll error if any
    }
  }, []);

  const eventMeta = EVENT_DETAILS || {
    lumaUrl: "https://hackculture.io/hackathons/hackers-occupied-pune",
    venueShort: "MIT-WPU, Pune",
    prizePool: "₹1,50,000+",
  };

  return (
    <div className="relative min-h-screen bg-[#0c0c0f] text-white selection:bg-[var(--brand)] selection:text-black font-sans">
      {/* Top Header Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            ← Back to Events Archive
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-xs font-mono text-[var(--brand)] font-bold">
            Flagship Hackathon 2026
          </span>
        </div>
        <a
          href={eventMeta.lumaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] text-black text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[0_0_20px_rgba(196,181,253,0.3)]"
        >
          Register on HackCulture ↗
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[11px] font-mono uppercase tracking-widest text-[var(--brand)] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Official Event Schedule & Live Tracker
              </div>
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.95] text-white">
                Hackers Occupied <span className="text-[var(--brand)]">Pune</span>
              </h1>
              <p className="font-mono text-sm text-white/60">
                sudo takeover --city pune · 22–23 August 2026
              </p>
              <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
                Genesis flagship 24-hour creator-first hackathon hosted at VIT Pune, Maharashtra. Featuring Agentic AI & Web3 tracks, 3 intensive mentoring rounds, 3 Logitech sponsor challenges, and the signature Creator Challenge.
              </p>
            </motion.div>

            {/* Quick Meta Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
            >
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Venue</span>
                <p className="font-mono text-xs text-white font-bold">{eventMeta.venueShort}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Dates</span>
                <p className="font-mono text-xs text-white font-bold">22–23 August 2026</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">Prize Pool</span>
                <p className="font-mono text-xs text-[var(--brand)] font-bold">{eventMeta.prizePool}</p>
              </div>
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href={eventMeta.lumaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cinema flex items-center gap-2 group"
              >
                <span>Register Team on HackCulture</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
              <a
                href="#schedule-section"
                className="px-5 py-3 rounded-xl border border-white/20 text-xs font-mono uppercase tracking-wider hover:bg-white/10 transition-all text-white/80"
              >
                Jump to Live Schedule ↓
              </a>
            </motion.div>
          </div>

          {/* Hero Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
              <img
                src="/assets/BrandImg/1.png"
                alt="Hackers Occupied Pune Poster"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/30">
                  Shortlisting In Progress · Free Entry
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Schedule & Timer Section */}
      <section id="schedule-section" className="py-12 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--brand)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand)] font-bold">
              Official Master Agenda
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-tight text-white">
            Detailed Event Schedule & Timeline
          </h2>
          <p className="text-sm text-white/60 max-w-2xl">
            Browse all 43 scheduled activities for Hackers Occupied Pune. Use the filters to view specific days, hacking periods, mentoring rounds, Logitech sponsor activities, and meal breaks.
          </p>
        </div>

        {/* Schedule Component */}
        <HackersOccupiedPuneSchedule showHeader={true} />
      </section>

      {/* Tracks & Special Activities Grid */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10 space-y-10">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--brand)] font-bold">
            Hackathon Highlights
          </span>
          <h3 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-white">
            What to Expect During the 24 Hours
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Agentic AI & Web3 Tracks",
              desc: "Build autonomous AI agents, multi-agent workflows, cross-chain protocols, or decentralized infrastructure. Compete for flagship track prizes.",
              badge: "Problem Statements at 14:00 (Aug 22)",
              color: "#34d399",
            },
            {
              title: "3 Mentoring Rounds",
              desc: "Round 1 (18:00 Aug 22), Round 2 (23:00 Aug 22), and Round 3 (07:00 Aug 23). Top industry mentors evaluate progress directly at team tables.",
              badge: "5 Mins Per Team",
              color: "#818cf8",
            },
            {
              title: "Logitech Activities (1, 2, 3)",
              desc: "Three high-octane sponsor mini-challenges held overnight (01:15, 02:45, 04:15 AM). 1 member per team competes for Logitech tech gear prizes.",
              badge: "Gear & Prize Pool",
              color: "#f472b6",
            },
            {
              title: "Creator Challenge (30 Marks)",
              desc: "10-15 creator challenges released right at hacking start (14:00 Aug 22). Complete side-quests throughout the 24 hours to earn points.",
              badge: "Creator Track",
              color: "#a855f7",
            },
            {
              title: "SalesForce Speaker Session",
              desc: "Exclusive session on Aug 23 from 13:00 to 15:00 featuring SalesForce engineers and leaders. All 25 finalists receive e-certificates.",
              badge: "E-Certificates Provided",
              color: "#2dd4bf",
            },
            {
              title: "Meals & Fuel Station",
              desc: "Cornitos Snacks + Red Bull (17:00), Dinner (20:00), Midnight Snacks (00:00), and Morning Tea + Breakfast (08:00) delivered straight to team tables.",
              badge: "Free Food & Drinks",
              color: "#f97316",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-[#121218] p-6 space-y-4 hover:border-white/25 transition-all"
            >
              <span
                className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full border"
                style={{ color: card.color, borderColor: card.color + '40', backgroundColor: card.color + '15' }}
              >
                {card.badge}
              </span>
              <h4 className="font-sans font-bold text-xl text-white">{card.title}</h4>
              <p className="text-xs text-white/70 leading-relaxed font-sans">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
