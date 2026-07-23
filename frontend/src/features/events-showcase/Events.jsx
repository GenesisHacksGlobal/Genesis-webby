import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useTransform } from "framer-motion";
import { LANDING } from "@shared/constants/testIds";
import { useSectionScroll } from "@shared/hooks/useSectionScroll";
import Tilt from "@shared/ui/Tilt";
import { POSTER_2 } from "@shared/data/mediaAssets";
import { eventService } from "@shared/services/eventService";
import EventMap from "./EventMap";

function PastEventCard({ event, index }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useSectionScroll({ target: cardRef, offset: ["start 90%", "end 20%"] });
    const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
    const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
    const titleX = useTransform(scrollYProgress, [0, 0.6], [40, 0]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

    return (
        <Tilt className="relative" max={4} glare>
            <motion.article
                ref={cardRef}
                data-testid={event.testid || `evt-card-${event.id}`}
                data-cursor
                data-cursor-label="View"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-[var(--border)] bg-[var(--surface)] lift overflow-hidden h-full flex flex-col justify-between"
            >
            <div className="frame aspect-[16/10] overflow-hidden relative bg-black/40">
                <motion.div style={{ clipPath: clip, WebkitClipPath: clip }} className="absolute inset-0">
                    <motion.img src={event.image} alt={event.title} loading="lazy" decoding="async" style={{ y: imgY }} className="w-full h-[120%] object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] bg-black/60 backdrop-blur border border-white/20 text-white font-bold">
                        {event.status === 'upcoming' ? '● Upcoming' : 'Past · Archived'}
                    </span>
                    {event.category && (
                        <span className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider bg-white/10 backdrop-blur border border-white/15 text-white/80">
                            {event.category}
                        </span>
                    )}
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="overline text-white">{event.kicker || `Edition · ${event.date}`}</span>
                    <span className="font-mono text-xs text-white/70">{event.date}</span>
                </div>
            </div>

            <div className="p-7 md:p-10 flex-1 flex flex-col justify-between">
                <div>
                    <motion.h3 style={{ x: titleX, opacity: titleOpacity }} className="font-display text-3xl md:text-4xl tracking-tight text-[var(--heading)]">{event.title}</motion.h3>
                    {event.subtitle && (<p className="mt-2 text-sm text-[var(--text-dim)] italic">{event.subtitle}</p>)}
                    <p className="overline mt-3">{event.city || event.location}</p>
                    <p className="mt-5 text-[var(--text-dim)] leading-relaxed max-w-[52ch] text-sm">{event.blurb}</p>
                </div>

                <div>
                    <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <div className="overline">Date · Time</div>
                            <div className="mt-1.5 text-sm text-[var(--text)] font-mono">{event.date}</div>
                            <div className="text-xs text-[var(--text-dim)] font-mono">{event.time || '10:00 AM – 5:00 PM'}</div>
                        </div>
                        <div>
                            <div className="overline">Hosts</div>
                            <div className="mt-1.5 text-sm text-[var(--text)] leading-tight">{event.hosts || 'Genesis Team'}</div>
                        </div>
                    </div>

                    {event.luma && (
                        <a href={event.luma} target="_blank" rel="noopener noreferrer" data-testid={`${event.id}-luma`} data-cursor data-cursor-label="Luma" className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-draw">
                            Reserve / View Details <span aria-hidden>↗</span>
                        </a>
                    )}
                </div>
            </div>
            </motion.article>
        </Tilt>
    );
}

function UpcomingPanel({ upcomingEvent }) {
    const panelRef = useRef(null);
    const { scrollYProgress: panelProgress } = useSectionScroll({ target: panelRef, offset: ["start end", "end start"] });
    const posterScale = useTransform(panelProgress, [0, 1], [0.98, 1.06]);
    const posterY = useTransform(panelProgress, [0, 1], ["2%", "-2%"]);
    const titleY = useTransform(panelProgress, [0, 1], [30, -30]);

    const activeEvent = upcomingEvent || {
        title: "No Agenda Meetup 2.0",
        subtitle: "Hosted by Genesis Community",
        blurb: "Opportunities don't come to the best. They come to those who stand out. Six hours, one room, real briefs — no slides.",
        date: "Jul 25, 2026",
        time: "10 AM – 4 PM",
        city: "Gurugram · Offline",
        image: POSTER_2,
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
    };

    return (
        <motion.div
            ref={panelRef}
            data-testid={LANDING.upcomingPanel}
            id="upcoming"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-20 md:mt-28 border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-5 sm:px-6 md:px-10 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-3">
                    <span className="block w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <span className="overline text-[var(--text)] font-bold">Registrations open // Featured Upcoming</span>
                </div>
                <span className="overline text-left sm:text-right">Upcoming Headline Event</span>
            </div>

            <div className="grid md:grid-cols-12">
                <div className="md:col-span-5 relative bg-[var(--bg-2)] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--border)]">
                    <motion.div style={{ scale: posterScale, y: posterY }} className="relative w-full max-w-[440px] aspect-[4/5] overflow-hidden frame shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] rounded-xl">
                        <img src={activeEvent.image || POSTER_2} alt={activeEvent.title} className="absolute inset-0 w-full h-full object-cover" />
                    </motion.div>
                </div>

                <div className="md:col-span-7 p-6 sm:p-8 md:p-12 bg-[var(--bg)] flex flex-col justify-between">
                    <motion.div style={{ y: titleY }}>
                        <h3 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[0.92] tracking-tight text-[var(--heading)]">
                            {activeEvent.title}
                        </h3>
                        <p className="mt-3 text-sm text-[var(--text-dim)] italic">{activeEvent.subtitle || 'Hosted by Genesis'}</p>
                        <p className="mt-5 text-[var(--text-dim)] max-w-[52ch] leading-relaxed">
                            {activeEvent.blurb}
                        </p>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-lg border-t border-b border-[var(--border)] py-6">
                            <div><div className="overline">Date</div><div className="mt-2 font-display text-2xl text-[var(--heading)] leading-none">{activeEvent.date}</div></div>
                            <div><div className="overline">Time</div><div className="mt-2 font-display text-2xl text-[var(--heading)] leading-none">{activeEvent.time || '10 AM – 5 PM'}</div></div>
                            <div><div className="overline">Location</div><div className="mt-2 font-display text-2xl text-[var(--heading)] leading-none">{activeEvent.city || activeEvent.location || 'India'}</div></div>
                        </div>
                    </motion.div>

                    <div className="mt-10 flex flex-col gap-5">
                        <a href={activeEvent.luma || "https://luma.com/6nxec8uw?tk=Cw5Fsi"} target="_blank" rel="noopener noreferrer" data-testid={LANDING.rsvpSubmit} data-cursor data-cursor-label="Luma" className="btn-cinema self-start group">
                            <span>Reserve spot on Luma</span>
                            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                        </a>
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-faint)] max-w-[36ch]">
                            Registrations are handled via official event portal. You'll be redirected to confirm your seat.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Events() {
    const [eventsList, setEventsList] = useState(() => eventService.getEvents());
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const unsubscribe = eventService.subscribe((updated) => {
            setEventsList(updated);
        });
        return () => unsubscribe();
    }, []);

    const upcomingEvents = eventsList.filter((e) => e.status === 'upcoming');
    const pastEvents = eventsList.filter((e) => e.status === 'past');
    const featuredUpcoming = upcomingEvents[0];

    const visibleEvents = showAll ? pastEvents : pastEvents.slice(0, 4);

    return (
        <section id="events" className="relative py-28 md:py-40 z-[3] border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[var(--text-dim)]" />
                            <span className="overline">Chapter 03 · Programme</span>
                        </div>
                        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-[var(--heading)] max-w-[20ch]">
                            Events / Crafting high-octane gatherings.
                        </h2>
                    </div>
                    <div className="md:max-w-md space-y-4">
                        <p className="text-[var(--text-dim)] leading-relaxed">
                            Two flagship formats, dozens of editions. Each event is staged like a chapter — moody, intimate, and built to spark real collaboration.
                        </p>
                        <Link to="/admin-events" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--brand)] hover:underline">
                          ⚙ Admin Event Portal →
                        </Link>
                    </div>
                </div>

                {/* Upcoming Headline Event Panel */}
                <UpcomingPanel upcomingEvent={featuredUpcoming} />

                {/* Past Events Grid */}
                <div className="mt-24">
                    <div className="mb-10 flex items-center justify-between border-b border-[var(--border)] pb-4">
                        <div>
                            <span className="overline text-[var(--brand)]">Past Editions Archive</span>
                            <h3 className="font-display text-3xl md:text-4xl text-[var(--heading)] uppercase tracking-tight mt-1">
                                Past Events
                            </h3>
                        </div>
                        <span className="font-mono text-xs text-[var(--text-dim)]">{pastEvents.length} ARCHIVED EDITIONS</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                        {visibleEvents.map((e, i) => (<PastEventCard key={e.id} event={e} index={i} />))}
                    </div>

                    {pastEvents.length > 4 && (
                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="btn-cinema"
                                data-cursor
                                data-cursor-label={showAll ? "Collapse" : "Expand"}
                            >
                                {showAll ? "Show Less" : `Show More Events (${pastEvents.length - 4} More)`}
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Show More Events CTA */}
                <div className="mt-20 flex flex-col items-center justify-center text-center border border-dashed border-[var(--border)] p-12 bg-white/[0.01] backdrop-blur-md rounded-lg">
                    <p className="overline text-[var(--brand)] mb-3">Archive & Gallery</p>
                    <h3 className="font-display text-3xl md:text-5xl text-[var(--heading)] tracking-tight mb-4">
                        Want to see the full list of events?
                    </h3>
                    <p className="text-[var(--text-dim)] max-w-md mb-8 leading-relaxed">
                        Step into our interactive Event Page to search, filter, and explore all past workshops, meetups, and creative hackathons with high-fidelity media.
                    </p>
                    <Link to="/events" className="btn-cinema flex items-center gap-2 group">
                        <span>Explore Full Events Gallery</span>
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                <EventMap />
            </div>
        </section>
    );
}
