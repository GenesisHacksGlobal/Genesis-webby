import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import Tilt from "./Tilt";
import { SAMVEDNA_HERO, NO_AGENDA_1_HERO, POSTER_2 } from "@/data/photos";

const pastEvents = [
    {
        slug: "samvedna",
        title: "Samvedna",
        subtitle: "A hands-on UX research workshop",
        kicker: "Edition · Sep 2025",
        date: "Sep 27, 2025",
        city: "Microsoft IDC · Noida, UP",
        blurb:
            "A hands-on UX research workshop with the Genesis community. A full day of methods, real-world exercises and frameworks — from problem framing to synthesis — with Umesh and Sachin Verma.",
        hosts: "Genesis · Umesh & Sachin Verma",
        time: "9:30 AM – 4:00 PM",
        image: SAMVEDNA_HERO,
        luma: "https://luma.com/8dqnhrif?tk=94waKT",
        testid: LANDING.eventCardSamvedna,
    },
    {
        slug: "no-agenda-1",
        title: "No Agenda Meetup",
        subtitle: "Genesis × Genesis",
        kicker: "Edition I · Aug 2025",
        date: "Aug 22, 2025",
        city: "Microsoft · Gurugram, HR",
        blurb:
            "Genesis. No slides. No boring talks. Just honest conversations, collabs and ideas — five hours of live teardown sessions, gig swaps and impromptu collabs.",
        hosts: "Genesis · Sachin Verma & Umesh",
        time: "10:00 AM – 3:00 PM IST",
        image: NO_AGENDA_1_HERO,
        luma: "https://luma.com/fvn3pg6m?tk=QxoVik",
        testid: LANDING.eventCardNoAgenda1,
    },
];

const UPCOMING_LUMA_URL = "https://luma.com/6nxec8uw?tk=Cw5Fsi";

function PastEventCard({ event, index }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start 90%", "end 20%"],
    });
    // scroll-scrubbed reveal of image (clip-path) and parallax
    const clip = useTransform(
        scrollYProgress,
        [0, 0.35],
        ["inset(0 0 100% 0)", "inset(0 0 0% 0)"],
    );
    const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
    const titleX = useTransform(scrollYProgress, [0, 0.6], [40, 0]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

    return (
        <Tilt className="relative" max={4} glare>
            <motion.article
                ref={cardRef}
                data-testid={event.testid}
                data-cursor
                data-cursor-label="View"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border border-[var(--border)] bg-[var(--surface)] lift overflow-hidden"
            >
            <div className="frame aspect-[16/10] overflow-hidden relative">
                <motion.div style={{ clipPath: clip, WebkitClipPath: clip }} className="absolute inset-0">
                    <motion.img
                        src={event.image}
                        alt={event.title}
                        style={{ y: imgY }}
                        className="w-full h-[120%] object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] bg-background/70 backdrop-blur border border-border text-[var(--text)]">
                        Past · Archived
                    </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="overline text-[var(--text)]">{event.kicker}</span>
                    <span className="font-mono text-xs text-[var(--text-dim)]">{event.date}</span>
                </div>
            </div>

            <div className="p-7 md:p-10">
                <motion.h3
                    style={{ x: titleX, opacity: titleOpacity }}
                    className="font-display text-3xl md:text-4xl tracking-tight text-[var(--text)]"
                >
                    {event.title}
                </motion.h3>
                {event.subtitle && (
                    <p className="mt-2 text-sm text-[var(--text-dim)] italic">{event.subtitle}</p>
                )}
                <p className="overline mt-3">{event.city}</p>
                <p className="mt-6 text-[var(--text-dim)] leading-relaxed max-w-[52ch]">{event.blurb}</p>

                <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                        <div className="overline">Date · Time</div>
                        <div className="mt-1.5 text-sm text-[var(--text)] font-mono">{event.date}</div>
                        <div className="text-xs text-[var(--text-dim)] font-mono">{event.time}</div>
                    </div>
                    <div>
                        <div className="overline">Hosts</div>
                        <div className="mt-1.5 text-sm text-[var(--text)] leading-tight">{event.hosts}</div>
                    </div>
                </div>

                {event.luma && (
                    <a
                        href={event.luma}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`${event.testid}-luma`}
                        data-cursor
                        data-cursor-label="Luma"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-draw"
                    >
                        View on Luma
                        <span aria-hidden>↗</span>
                    </a>
                )}
            </div>
            </motion.article>
        </Tilt>
    );
}

function UpcomingPanel() {
    const panelRef = useRef(null);
    const { scrollYProgress: panelProgress } = useScroll({
        target: panelRef,
        offset: ["start end", "end start"],
    });
    const posterScale = useTransform(panelProgress, [0, 1], [0.98, 1.06]);
    const posterY = useTransform(panelProgress, [0, 1], ["2%", "-2%"]);
    const titleY = useTransform(panelProgress, [0, 1], [30, -30]);

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
            {/* status strip across top */}
            <div className="flex items-center justify-between gap-3 px-6 md:px-10 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-3">
                    <span className="block w-2 h-2 bg-[var(--text)] rounded-full animate-pulse" />
                    <span className="overline text-[var(--text)]">Registrations open</span>
                </div>
                <span className="overline">Upcoming · Headline event · 02</span>
            </div>

            <div className="grid md:grid-cols-12">
                {/* poster side — real artwork shown properly, portrait */}
                <div className="md:col-span-5 relative bg-[#070707] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--border)]">
                    <motion.div
                        style={{ scale: posterScale, y: posterY }}
                        className="relative w-full max-w-[440px] aspect-[4/5] overflow-hidden frame shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
                    >
                        <img
                            src={POSTER_2}
                            alt="No Agenda Meetup 2.0 — official poster"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </motion.div>
                </div>

                {/* details + form */}
                <div className="md:col-span-7 p-8 md:p-12 bg-[var(--bg)] flex flex-col">
                    <motion.div style={{ y: titleY }}>
                        <h3 className="font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl leading-[0.88] tracking-tight text-[var(--text)]">
                            No Agenda <br />
                            Meetup <span className="text-[var(--text-dim)]">2.0</span>
                        </h3>
                        <p className="mt-3 text-sm text-[var(--text-dim)] italic">
                            Hosted by Genesis Community
                        </p>
                        <p className="mt-5 text-[var(--text-dim)] max-w-[52ch] leading-relaxed">
                            <span className="text-[var(--text)]">Opportunities don't come to the best. They come to those who stand out.</span> Six hours, one room, real briefs — no slides.
                        </p>

                        <div className="mt-8 grid grid-cols-3 gap-6 max-w-lg border-t border-b border-[var(--border)] py-6">
                            <div>
                                <div className="overline">Date</div>
                                <div className="mt-2 font-display text-3xl text-[var(--text)] leading-none">Jul 25</div>
                                <div className="text-xs text-[var(--text-dim)] font-mono mt-1">Saturday · 2026</div>
                            </div>
                            <div>
                                <div className="overline">Time</div>
                                <div className="mt-2 font-display text-3xl text-[var(--text)] leading-none">10–4</div>
                                <div className="text-xs text-[var(--text-dim)] font-mono mt-1">10 AM – 4 PM</div>
                            </div>
                            <div>
                                <div className="overline">Venue</div>
                                <div className="mt-2 font-display text-3xl text-[var(--text)] leading-none">TBA</div>
                                <div className="text-xs text-[var(--text-dim)] font-mono mt-1">India · Offline</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Luma CTA */}
                    <div className="mt-10 flex flex-col gap-5">
                        <a
                            href={UPCOMING_LUMA_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={LANDING.rsvpSubmit}
                            data-cursor
                            data-cursor-label="Luma"
                            className="btn-cinema self-start group"
                        >
                            <span>Reserve spot on Luma</span>
                            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                        </a>
                        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-faint)] max-w-[36ch]">
                            Registrations are handled via Luma. You'll be redirected to confirm your seat.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Events() {
    return (
        <section id="events" className="relative py-28 md:py-40 z-[3] border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[var(--text-dim)]" />
                            <span className="overline">Chapter 03 · Programme</span>
                        </div>
                        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-[var(--text)] max-w-[20ch]">
                            Events / A film festival for freelancers.
                        </h2>
                    </div>
                    <p className="md:max-w-md text-[var(--text-dim)] leading-relaxed">
                        Two flagship formats, dozens of editions. Each event is staged like a chapter
                        — moody, intimate, and built to spark real collaboration.
                    </p>
                </div>

                {/* past events */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                    {pastEvents.map((e, i) => (
                        <PastEventCard key={e.slug} event={e} index={i} />
                    ))}
                </div>

                {/* upcoming hero panel */}
                <UpcomingPanel />
            </div>
        </section>
    );
}
