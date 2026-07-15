import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANDING } from "@/constants/testIds";
import CountUp from "./CountUp";

const words = ["Learn.", "Earn.", "Grow."];

function MaskWord({ word, delay }) {
    return (
        <span className="inline-block overflow-hidden align-top mr-3 pb-2">
            <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {word}
            </motion.span>
        </span>
    );
}

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    // minimal parallax — quiet, restrained
    const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
    const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const ringY = useTransform(scrollYProgress, [0, 1], [0, -160]);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (window.__lenis) {
            window.__lenis.scrollTo(el, { offset: -60, duration: 1.6 });
        } else {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            id="hero"
            ref={ref}
            className="relative min-h-[100svh] flex items-end overflow-hidden pt-[72px] bg-[var(--bg)]"
        >
            {/* minimal geometric backdrop — just a faint grid + concentric ring */}
            <motion.div
                style={{ y: gridY }}
                aria-hidden
                className="absolute inset-0 z-[0] opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:120px_120px]"
            />
            <motion.svg
                aria-hidden
                style={{ y: ringY }}
                viewBox="0 0 800 800"
                className="absolute right-[-200px] top-[12%] w-[60vw] max-w-[800px] opacity-20 pointer-events-none"
            >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <circle
                        key={i}
                        cx="400"
                        cy="400"
                        r={70 * i}
                        fill="none"
                        stroke="#f5f5f5"
                        strokeWidth="0.6"
                        opacity={0.18 + i * 0.05}
                    />
                ))}
                <circle cx="400" cy="400" r="3" fill="#f5f5f5" opacity="0.5" />
            </motion.svg>

            {/* subtle fade to next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] bg-gradient-to-t from-[var(--bg)] to-transparent pointer-events-none" />

            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-10 pb-20 md:pb-28">
                {/* overline */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 mb-10"
                >
                    <motion.span
                        className="block h-px bg-[var(--text-dim)]"
                        initial={{ width: 0 }}
                        animate={{ width: 40 }}
                        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <span className="overline">Hybrid Freelance Community · India</span>
                </motion.div>

                <motion.h1
                    style={{ y: titleY, opacity: titleOpacity }}
                    className="font-display leading-[0.86] tracking-[0.005em] text-[var(--text)] max-w-[14ch] text-[18vw] sm:text-[16vw] md:text-[13vw] lg:text-[190px]"
                >
                    {words.map((w, i) => (
                        <span key={w} className="block">
                            <MaskWord word={w} delay={0.4 + i * 0.18} />
                        </span>
                    ))}
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 grid md:grid-cols-12 gap-10 items-end"
                >
                    <p className="md:col-span-6 text-lg md:text-xl text-[var(--text-dim)] max-w-[52ch] leading-relaxed">
                        A community-led initiative building a structured freelance ecosystem.
                        From design and dev to content, marketing and ops — we connect skilled
                        people with real opportunities through events, cohorts and collabs.
                    </p>

                    <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 md:justify-end">
                        <button
                            data-testid={LANDING.heroCtaPrimary}
                            data-cursor
                            data-cursor-label="RSVP"
                            onClick={() => scrollTo("upcoming")}
                            className="btn-cinema"
                        >
                            Explore upcoming event
                            <span aria-hidden>→</span>
                        </button>
                        <button
                            data-testid={LANDING.heroCtaSecondary}
                            data-cursor
                            data-cursor-label="Read"
                            onClick={() => scrollTo("about")}
                            className="btn-ghost"
                        >
                            How Genesis works
                        </button>
                    </div>
                </motion.div>

                {/* stat bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, delay: 1.4 }}
                    className="mt-20 border-t border-border pt-8 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6"
                >
                    <Stat n={1000} suffix="+" label="Community freelancers" />
                    <Stat n={12} suffix="" label="Cities reached" />
                    <Stat n={40} suffix="+" label="Live cohorts & jams" />
                    <Stat n={2026} suffix="" label="Cinematic season" />
                </motion.div>
            </div>

            {/* scroll cue */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                <span className="overline">Scroll</span>
                <span className="block w-px h-12 bg-[var(--text-dim)] relative overflow-hidden">
                    <motion.span
                        className="absolute inset-0 bg-[var(--text)]"
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                    />
                </span>
            </div>
        </section>
    );
}

function Stat({ n, suffix, label }) {
    return (
        <div>
            <div className="tick font-display text-3xl md:text-4xl text-[var(--text)]">
                <CountUp value={n} suffix={suffix} duration={2} />
            </div>
            <div className="overline mt-2">{label}</div>
        </div>
    );
}
