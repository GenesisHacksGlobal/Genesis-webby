import React, { useEffect, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LANDING } from "@shared/constants/testIds";
import { usePageScroll } from "@shared/hooks/useSectionScroll";

const LOGO_URL = "/images/logo.png";

const links = [
    { id: "about", label: "About", testid: LANDING.navAbout },
    { id: "loop", label: "The Loop", testid: LANDING.navLoop },
    { path: "/events", label: "Events", testid: LANDING.navEvents },
    { path: "/gallery", label: "Gallery", testid: LANDING.navGallery },
    { id: "contact", label: "Contact", testid: LANDING.navContact },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { scrollYProgress } = usePageScroll();
    const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const onScroll = () => {
            const currentY = Math.max(window.scrollY, 0);
            const delta = currentY - lastScrollY.current;

            setScrolled(currentY > 24);

            if (currentY < 80) {
                setNavHidden(false);
            } else if (delta > 6) {
                setNavHidden(true);
                setOpen(false);
            } else if (delta < -6) {
                setNavHidden(false);
            }

            lastScrollY.current = currentY;
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        setOpen(false);

        if (location.pathname !== "/") {
            navigate(`/#${id}`);
            return;
        }

        const el = document.getElementById(id);
        if (!el) return;
        if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -60, duration: 1.6 });
        } else {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const activateLink = (link) => {
        setOpen(false);
        if (link.path) {
            navigate(link.path);
            return;
        }
        scrollTo(link.id);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                navHidden ? "-translate-y-full" : "translate-y-0"
            } ${
                // Mobile: always solid dark bar for contrast. Desktop: translucent when scrolled.
                open || scrolled
                    ? "bg-[#111111] border-b border-white/20 md:bg-[#181818]/92 md:backdrop-blur-xl md:border-white/10"
                    : "bg-[#111111]/95 border-b border-white/15 md:bg-transparent md:border-border/20"
            }`}
        >
            <div className="w-full h-[72px] flex items-stretch justify-between">
                <button
                    data-testid={LANDING.navLogo}
                    onClick={() => {
                        if (location.pathname === "/") scrollTo("hero");
                        else navigate("/");
                    }}
                    className="flex items-center gap-3 px-6 md:px-10 border-r border-border/30 hover:bg-white/5 transition-colors group shrink-0"
                    aria-label="Genesis India"
                >
                    <span className="block w-8 h-8 border border-border/40 overflow-hidden">
                        <img src={LOGO_URL} alt="Genesis" className="w-full h-full object-cover" />
                    </span>
                    <span className="flex flex-col text-left leading-none">
                        <span className="font-display text-[17px] tracking-tight text-[var(--heading)]">Genesis</span>
                        <span className="overline mt-0.5 text-[var(--text-dim)]">India</span>
                    </span>
                </button>

                <nav className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-10 px-6">
                    {links.map((l) => (
                        <button
                            key={l.id || l.path}
                            data-testid={l.testid}
                            onClick={() => activateLink(l)}
                            className="text-[12px] uppercase tracking-[0.16em] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors relative"
                        >
                            {l.label}
                        </button>
                    ))}
                </nav>

                <div className="hidden md:flex items-center justify-center px-6 border-l border-border/30 text-[11px] font-mono tracking-widest text-[var(--text-dim)] shrink-0 select-none">
                    EN
                </div>

                <button
                    data-testid={LANDING.navRsvpBtn}
                    data-cursor
                    data-cursor-label="RSVP"
                    onClick={() => scrollTo("upcoming")}
                    className="hidden md:flex items-center justify-center px-8 border-l border-border/30 bg-[#161618] hover:bg-black text-[#fafafa] hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] shrink-0 font-sans font-medium"
                >
                    Reserve seat
                </button>

                <button
                    onClick={() => setOpen((s) => !s)}
                    className="md:hidden px-6 border-l border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                    aria-label="Menu"
                    aria-expanded={open}
                    data-testid="nav-mobile-toggle"
                >
                    <span className="block w-5 h-0.5 bg-current relative before:content-[''] before:absolute before:left-0 before:right-0 before:-top-2 before:h-0.5 before:bg-current after:content-[''] after:absolute after:left-0 after:right-0 after:top-2 after:h-0.5 after:bg-current" />
                </button>
            </div>

            {/* progress bar */}
            <motion.div
                style={{ width: barWidth }}
                className="h-px bg-[var(--text)] origin-left"
            />

            {open && (
                <div className="md:hidden border-t border-white/15 bg-[#111111] shadow-[0_24px_48px_rgba(0,0,0,0.65)]">
                    <div className="px-6 py-7 flex flex-col gap-5">
                        {links.map((l) => (
                            <button
                                key={l.id || l.path}
                                data-testid={`mobile-${l.testid}`}
                                onClick={() => activateLink(l)}
                                className="text-left font-display text-2xl text-[var(--heading)]"
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
