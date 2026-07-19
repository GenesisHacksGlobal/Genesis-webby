import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANDING } from "@shared/constants/testIds";
import Tilt from "@shared/ui/Tilt";
import { SAMVEDNA_HERO, NO_AGENDA_1_HERO, POSTER_2 } from "@shared/data/mediaAssets";
import EventMap from "./EventMap";


const pastEvents = [
    {
        slug: "beyond-the-code",
        title: "Beyond the Code",
        subtitle: "Genesis Chennai Meetup",
        kicker: "Edition Â· Sep 2024",
        date: "Sep 19, 2024",
        city: "SRM-IST Â· Chennai, TN",
        blurb: "A massive design & developer meetup at SRM-IST. Over 700 creators came together for panels on freelancing, tech stacks, and building in public.",
        hosts: "Genesis Community",
        time: "10:00 AM – 5:00 PM IST",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: LANDING.eventCardSamvedna,
    },
    {
        slug: "supernova",
        title: "Supernova",
        subtitle: "36-Hour National Hackathon",
        kicker: "Edition Â· May 2025",
        date: "May 2-3, 2025",
        city: "GL Bajaj Â· Greater Noida, UP",
        blurb: "A 36-hour hackathon challenging developers to build production-grade projects. Staged with high-energy workshops and mentorship loops.",
        hosts: "Genesis Community",
        time: "9:00 AM – 9:00 PM IST",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: LANDING.eventCardNoAgenda1,
    },
    {
        slug: "hackamania",
        title: "Hackamania",
        subtitle: "Cross-Chain Web3 Hackathon",
        kicker: "Edition Â· May 2025",
        date: "May 23, 2025",
        city: "Microsoft Office Â· Gurugram, HR",
        blurb: "An intense builder marathon hosted at the Microsoft office. Focused on web3 scalability, cross-chain applications, and decentralized networks.",
        hosts: "Genesis Community",
        time: "10:00 AM – 8:00 PM IST",
        image: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardHackamania",
    },
    {
        slug: "escape-da-vinci",
        title: "escape da vinci",
        subtitle: "Design-Tech Collaboration Meetup",
        kicker: "Edition Â· Feb 2026",
        date: "Feb 10-27, 2026",
        city: "Chandigarh University Â· Punjab",
        blurb: "An interactive design-tech meetup hosted at Chandigarh University, encouraging students to bridge design, code, and creative logic.",
        hosts: "Genesis Community",
        time: "11:00 AM – 4:00 PM IST",
        image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardEscapeDaVinci",
    },
    {
        slug: "hackarena-2025",
        title: "HackArena 2025",
        subtitle: "Cloud Architecture Sprint",
        kicker: "Edition Â· Jun 2025",
        date: "Jun 28-29, 2025",
        city: "IIIT Delhi Â· New Delhi",
        blurb: "A flagship hackathon hosted at IIIT Delhi. Students built cloud-native tools using Microsoft Azure and modern web technologies under expert mentorship.",
        hosts: "Genesis Community",
        time: "9:00 AM – 6:00 PM IST",
        image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardHackArena",
    },
    {
        slug: "0xgenignite-mumbai",
        title: "0xgenignite Bootcamp",
        subtitle: "Stellar Dev Bootcamp Mumbai",
        kicker: "Edition Â· Sep 2025",
        date: "Sep 13, 2025",
        city: "Microsoft Office Â· Mumbai, MH",
        blurb: "An intensive builder bootcamp in Mumbai focused on smart contracts, asset tokenization, and integrating payment systems using Stellar.",
        hosts: "Stellar Foundation & Genesis",
        time: "10:00 AM – 6:00 PM IST",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardStellarMumbai",
    },
    {
        slug: "0xgenignite-bangalore",
        title: "0xgenignite Bootcamp",
        subtitle: "Stellar Dev Bootcamp Bangalore",
        kicker: "Edition Â· Oct 2025",
        date: "Oct 5, 2025",
        city: "Polaris School Â· Bangalore, KA",
        blurb: "The Bangalore chapter of the developer bootcamp series. Focused on building high-performance dApps and decentralized finance applications.",
        hosts: "Stellar Foundation & Genesis",
        time: "10:00 AM – 6:00 PM IST",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardStellarBangalore",
    },
    {
        slug: "0xgenignite-goa",
        title: "0xgenignite NIT Goa",
        subtitle: "Stellar Goa Hackathon",
        kicker: "Edition Â· Oct 2025",
        date: "Oct 11-12, 2025",
        city: "NIT Goa Â· Goa",
        blurb: "A coastal builder hackathon inside NIT Goa. Developers worked round-the-clock on consumer products and web3 payment channels.",
        hosts: "Stellar Foundation & Genesis",
        time: "10:00 AM – 5:00 PM IST",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardStellarGoa",
    },
    {
        slug: "design-a-thon",
        title: "Design-A-Thon",
        subtitle: "Jaipur Design Marathon",
        kicker: "Edition Â· Oct 2025",
        date: "Oct 27 – Nov 1, 2025",
        city: "Manipal University Â· Jaipur, RJ",
        blurb: "A premium design marathon. Focused on brand identity, interaction design systems, and rapid prototyping for early stage startups.",
        hosts: "Genesis Community",
        time: "9:00 AM – 6:00 PM IST",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardDesignathon",
    },
    {
        slug: "ranchi-hacks",
        title: "Ranchi Hacks",
        subtitle: "Jharkhand Developer Hackathon",
        kicker: "Edition Â· Jan 2026",
        date: "Jan 17, 2026",
        city: "Sarla Birla University Â· Ranchi, JH",
        blurb: "A regional hackathon in Ranchi focused on localized problem solving. Empowering students in Jharkhand to solve local challenges via tech.",
        hosts: "Genesis Community",
        time: "9:30 AM – 7:30 PM IST",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
        luma: "https://luma.com/6nxec8uw?tk=Cw5Fsi",
        testid: "LANDING.eventCardRanchiHacks",
    }
];

const UPCOMING_LUMA_URL = "https://luma.com/6nxec8uw?tk=Cw5Fsi";

function PastEventCard({ event, index }) {
    const cardRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 90%", "end 20%"] });
    const clip = useTransform(scrollYProgress, [0, 0.35], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
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
                    <motion.img src={event.image} alt={event.title} loading="lazy" decoding="async" style={{ y: imgY }} className="w-full h-[120%] object-cover" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.2em] bg-background/70 backdrop-blur border border-border text-[var(--text)]">Past Â· Archived</span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="overline text-[var(--text)]">{event.kicker}</span>
                    <span className="font-mono text-xs text-[var(--text-dim)]">{event.date}</span>
                </div>
            </div>

            <div className="p-7 md:p-10">
                <motion.h3 style={{ x: titleX, opacity: titleOpacity }} className="font-display text-3xl md:text-4xl tracking-tight text-[var(--heading)]">{event.title}</motion.h3>
                {event.subtitle && (<p className="mt-2 text-sm text-[var(--text-dim)] italic">{event.subtitle}</p>)}
                <p className="overline mt-3">{event.city}</p>
                <p className="mt-6 text-[var(--text-dim)] leading-relaxed max-w-[52ch]">{event.blurb}</p>

                <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                        <div className="overline">Date Â· Time</div>
                        <div className="mt-1.5 text-sm text-[var(--text)] font-mono">{event.date}</div>
                        <div className="text-xs text-[var(--text-dim)] font-mono">{event.time}</div>
                    </div>
                    <div>
                        <div className="overline">Hosts</div>
                        <div className="mt-1.5 text-sm text-[var(--text)] leading-tight">{event.hosts}</div>
                    </div>
                </div>

                {event.luma && (
                    <a href={event.luma} target="_blank" rel="noopener noreferrer" data-testid={`${event.testid}-luma`} data-cursor data-cursor-label="Luma" className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors link-draw">
                        View on Luma <span aria-hidden>â†—</span>
                    </a>
                )}
            </div>
            </motion.article>
        </Tilt>
    );
}

function UpcomingPanel() {
    const panelRef = useRef(null);
    const { scrollYProgress: panelProgress } = useScroll({ target: panelRef, offset: ["start end", "end start"] });
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 px-5 sm:px-6 md:px-10 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
                <div className="flex items-center gap-3">
                    <span className="block w-2 h-2 bg-[var(--text)] rounded-full animate-pulse" />
                    <span className="overline text-[var(--text)]">Registrations open</span>
                </div>
                <span className="overline text-left sm:text-right">Upcoming Â· Headline event Â· 02</span>
            </div>

            <div className="grid md:grid-cols-12">
                <div className="md:col-span-5 relative bg-[rgba(8,2,18,0.55)] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-[var(--border)]">
                    <motion.div style={{ scale: posterScale, y: posterY }} className="relative w-full max-w-[440px] aspect-[4/5] overflow-hidden frame shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                        <img src={POSTER_2} alt="No Agenda Meetup 2.0 — official poster" className="absolute inset-0 w-full h-full object-cover" />
                    </motion.div>
                </div>

                <div className="md:col-span-7 p-6 sm:p-8 md:p-12 bg-[var(--bg)] flex flex-col">
                    <motion.div style={{ y: titleY }}>
                        <h3 className="font-display text-5xl sm:text-7xl md:text-7xl lg:text-8xl leading-[0.9] md:leading-[0.88] tracking-tight text-[var(--heading)]">
                            No Agenda <br />Meetup <span className="text-[var(--text-dim)]">2.0</span>
                        </h3>
                        <p className="mt-3 text-sm text-[var(--text-dim)] italic">Hosted by Genesis Community</p>
                        <p className="mt-5 text-[var(--text-dim)] max-w-[52ch] leading-relaxed">
                            <span className="text-[var(--text)]">Opportunities don't come to the best. They come to those who stand out.</span> Six hours, one room, real briefs — no slides.
                        </p>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-lg border-t border-b border-[var(--border)] py-6">
                            <div><div className="overline">Date</div><div className="mt-2 font-display text-3xl text-[var(--heading)] leading-none">Jul 25</div><div className="text-xs text-[var(--text-dim)] font-mono mt-1">Saturday Â· 2026</div></div>
                            <div><div className="overline">Time</div><div className="mt-2 font-display text-3xl text-[var(--heading)] leading-none">10–4</div><div className="text-xs text-[var(--text-dim)] font-mono mt-1">10 AM – 4 PM</div></div>
                            <div><div className="overline">Venue</div><div className="mt-2 font-display text-3xl text-[var(--heading)] leading-none">TBA</div><div className="text-xs text-[var(--text-dim)] font-mono mt-1">India Â· Offline</div></div>
                        </div>
                    </motion.div>

                    <div className="mt-10 flex flex-col gap-5">
                        <a href={UPCOMING_LUMA_URL} target="_blank" rel="noopener noreferrer" data-testid={LANDING.rsvpSubmit} data-cursor data-cursor-label="Luma" className="btn-cinema self-start group">
                            <span>Reserve spot on Luma</span>
                            <span aria-hidden className="transition-transform group-hover:translate-x-1">â†—</span>
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
    const [showAll, setShowAll] = useState(false);
    const visibleEvents = showAll ? pastEvents : pastEvents.slice(0, 4);

    return (
        <section id="events" className="relative py-28 md:py-40 z-[3] border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[var(--text-dim)]" />
                            <span className="overline">Chapter 03 Â· Programme</span>
                        </div>
                        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-[var(--heading)] max-w-[20ch]">
                            Events / A film festival for freelancers.
                        </h2>
                    </div>
                    <p className="md:max-w-md text-[var(--text-dim)] leading-relaxed">
                        Two flagship formats, dozens of editions. Each event is staged like a chapter — moody, intimate, and built to spark real collaboration.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                    {visibleEvents.map((e, i) => (<PastEventCard key={e.slug} event={e} index={i} />))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="btn-cinema"
                        data-cursor
                        data-cursor-label={showAll ? "Collapse" : "Expand"}
                    >
                        {showAll ? "Show Less" : "Show More Events"}
                    </button>
                </div>

                <UpcomingPanel />
                
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
                        <span aria-hidden className="transition-transform group-hover:translate-x-1">â†’</span>
                    </Link>
                </div>

                <EventMap />
            </div>
        </section>
    );
}
