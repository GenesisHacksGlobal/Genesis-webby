import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// helper: split a sentence into words for scroll-scrubbed reveal
function ScrubLines({ lines, progress }) {
    const totalWords = lines.reduce((a, l) => a + l.split(" ").length, 0);
    let k = 0;
    return (
        <>
            {lines.map((line, li) => (
                <span key={li} className="block">
                    {line.split(" ").map((w, i) => {
                        const idx = k++;
                        const start = idx / totalWords;
                        const end = (idx + 1) / totalWords;
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(progress, [start * 0.7, end * 0.7 + 0.05], [0.15, 1]);
                        return (
                            <motion.span
                                key={`${li}-${i}`}
                                style={{ opacity }}
                                className="inline-block mr-[0.22em]"
                            >
                                {w}
                            </motion.span>
                        );
                    })}
                </span>
            ))}
        </>
    );
}

export default function About() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "end 30%"],
    });

    const lines = [
        "Genesis bridges the gap between “I'm learning a skill”",
        "and “I'm earning from it.” Students, early freelancers",
        "and industry mentors — under one roof.",
    ];

    return (
        <section
            id="about"
            ref={ref}
            className="relative py-28 md:py-44 z-[3] bg-white text-black"
            style={{ position: "relative" }}
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="flex items-center gap-3 mb-12">
                    <span className="block w-10 h-px bg-black/40" />
                    <span className="overline !text-black/50">Chapter 01 · About</span>
                </div>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.92] !text-black max-w-[20ch]"
                >
                    A hybrid space to start, ship and scale.
                </motion.h2>

                <div className="mt-16 grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-7 md:col-start-2 font-sans text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tight !text-black">
                        <ScrubLines lines={lines} progress={scrollYProgress} />
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="md:col-span-4 md:col-start-9 text-base text-black/55 leading-relaxed border-l border-black/15 pl-6 self-end"
                    >
                        A community-led initiative building a structured freelance ecosystem.
                        From design and dev to content, marketing and ops — we connect skilled
                        people with real opportunities through events, cohorts and collabs.
                    </motion.p>
                </div>

                <div className="mt-20 flex flex-wrap gap-3">
                    {[
                        "Hybrid · online + offline",
                        "Freelance-first",
                        "Execution over theory",
                        "Community-led",
                        "Real gigs",
                    ].map((chip, i) => (
                        <motion.span
                            key={chip}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: i * 0.08 }}
                            className="px-4 py-2 border border-black/20 text-xs uppercase tracking-[0.18em] text-black/60 font-mono"
                        >
                            {chip}
                        </motion.span>
                    ))}
                </div>
            </div>
        </section>
    );
}
