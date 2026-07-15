import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANDING } from "@/constants/testIds";

const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_31a4271f-8bfb-44ef-a6c3-4b205b8fb50d/artifacts/iud9zkn6_logo.png";

const links = [
    { id: "about", label: "About", testid: LANDING.navAbout },
    { id: "loop", label: "The Loop", testid: LANDING.navLoop },
    { id: "events", label: "Events", testid: LANDING.navEvents },
    { id: "gallery", label: "Gallery", testid: LANDING.navGallery },
    { id: "contact", label: "Contact", testid: LANDING.navContact },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { scrollYProgress } = useScroll();
    const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        setOpen(false);
        const el = document.getElementById(id);
        if (!el) return;
        if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -60, duration: 1.6 });
        } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
                scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border" : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-[72px] flex items-center justify-between">
                <button
                    data-testid={LANDING.navLogo}
                    onClick={() => scrollTo("hero")}
                    className="flex items-center gap-3 group"
                    aria-label="DezHub India"
                >
                    <span className="block w-9 h-9 border border-border bg-card overflow-hidden">
                        <img src={LOGO_URL} alt="DezHub" className="w-full h-full object-cover" />
                    </span>
                    <span className="hidden sm:flex flex-col leading-none">
                        <span className="font-display text-[19px] tracking-tight text-[var(--text)]">DezHub</span>
                        <span className="overline mt-1">India</span>
                    </span>
                </button>

                <nav className="hidden md:flex items-center gap-9">
                    {links.map((l) => (
                        <button
                            key={l.id}
                            data-testid={l.testid}
                            onClick={() => scrollTo(l.id)}
                            className="text-[13px] tracking-wide text-[var(--text-dim)] hover:text-[var(--text)] link-draw transition-colors"
                        >
                            {l.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden md:block">
                    <button
                        data-testid={LANDING.navRsvpBtn}
                        data-cursor
                        data-cursor-label="RSVP"
                        onClick={() => scrollTo("upcoming")}
                        className="btn-cinema"
                    >
                        Reserve seat
                        <span aria-hidden>→</span>
                    </button>
                </div>

                <button
                    onClick={() => setOpen((s) => !s)}
                    className="md:hidden w-10 h-10 flex items-center justify-center text-[var(--text)]"
                    aria-label="Menu"
                    data-testid="nav-mobile-toggle"
                >
                    <span className="block w-5 h-px bg-current relative before:content-[''] before:absolute before:left-0 before:right-0 before:-top-2 before:h-px before:bg-current after:content-[''] after:absolute after:left-0 after:right-0 after:top-2 after:h-px after:bg-current" />
                </button>
            </div>

            {/* progress bar */}
            <motion.div
                style={{ width: barWidth }}
                className="h-px bg-[var(--text)] origin-left"
            />

            {open && (
                <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
                    <div className="px-6 py-6 flex flex-col gap-5">
                        {links.map((l) => (
                            <button
                                key={l.id}
                                data-testid={`mobile-${l.testid}`}
                                onClick={() => scrollTo(l.id)}
                                className="text-left font-display text-2xl text-[var(--text)]"
                            >
                                {l.label}
                            </button>
                        ))}
                        <button
                            data-testid="mobile-nav-rsvp-btn"
                            onClick={() => scrollTo("upcoming")}
                            className="btn-cinema mt-3"
                        >
                            Reserve seat →
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
