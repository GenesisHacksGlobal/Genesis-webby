import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const loop = [
    {
        n: "01",
        title: "Learn",
        body: "Curated sprints, peer-led practice and workshops with practitioners doing the work today.",
        tags: ["Cohorts", "Sprints", "Reviews"],
        img: "/photos/Samvedna-3.jpg",
    },
    {
        n: "02",
        title: "Earn",
        body: "Work on gigs & client projects sourced through the community. Ship real, get paid.",
        tags: ["Gigs", "Briefs", "Payouts"],
        img: "/photos/NoAgendaMeetup-2.jpg",
    },
    {
        n: "03",
        title: "Grow",
        body: "Feedback, mentorship and long-term collabs that compound into a serious freelance career.",
        tags: ["Mentorship", "Network", "Career"],
        img: "/photos/Samvedna-4.jpg",
    },
];

function Step({ step, progress, index, total }) {
    // each step is active across a third of the scroll
    const slot = 1 / total;
    const start = slot * index;
    const end = slot * (index + 1);
    const opacity = useTransform(
        progress,
        [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
        [0, 1, 1, 0],
    );
    const y = useTransform(progress, [start, end], [40, -40]);
    const scale = useTransform(progress, [start, end], [1.06, 0.98]);

    return (
        <motion.div
            style={{ opacity }}
            className="absolute inset-0 flex items-center"
            aria-hidden={false}
        >
            <div className="w-full grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
                {/* image */}
                <motion.div
                    style={{ scale, y }}
                    className="md:col-span-6 relative aspect-[5/4] frame overflow-hidden"
                >
                    <img
                        src={step.img}
                        alt={step.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "grayscale(20%) contrast(1.05) brightness(0.85)" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/30" />
                    <div className="absolute top-5 left-5 overline text-[var(--text)]">step</div>
                    <div className="absolute bottom-6 right-6 font-display text-[18vw] md:text-[14vw] lg:text-[200px] leading-none text-white/15 select-none tick">
                        {step.n}
                    </div>
                </motion.div>

                {/* text */}
                <motion.div style={{ y }} className="md:col-span-6 md:pl-6">
                    <div className="overline mb-4">Phase {step.n}</div>
                    <h3 className="font-display text-7xl md:text-8xl lg:text-[160px] tracking-tight text-[var(--text)] leading-[0.88]">
                        {step.title}<span className="text-[var(--text-faint)]">.</span>
                    </h3>
                    <p className="mt-8 text-lg md:text-xl text-[var(--text-dim)] leading-relaxed max-w-[42ch]">
                        {step.body}
                    </p>
                    <div className="mt-10 flex flex-wrap gap-2">
                        {step.tags.map((t) => (
                            <span
                                key={t}
                                className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-faint)] border border-[var(--border)] px-2.5 py-1"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function LearnEarnGrow() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const headlineOpacity = useTransform(scrollYProgress, [0, 0.05, 0.92, 1], [0, 1, 1, 0]);
    const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const chip0 = useTransform(scrollYProgress, [0, 0.33], [1, 0.3]);
    const chip1 = useTransform(scrollYProgress, [0.2, 0.5, 0.66], [0.3, 1, 0.3]);
    const chip2 = useTransform(scrollYProgress, [0.55, 0.85], [0.3, 1]);

    return (
        <section
            id="loop"
            ref={containerRef}
            className="relative z-[3] border-t border-border"
            style={{ height: "320vh" }}
        >
            <div className="sticky top-0 h-[100svh] flex flex-col overflow-hidden">
                <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-28 md:pt-32">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-[var(--text-dim)]" />
                        <span className="overline">Chapter 02 · The Loop</span>
                    </div>
                    <motion.h2
                        style={{ opacity: headlineOpacity }}
                        className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[1.02] text-[var(--text)]"
                    >
                        Learn <span className="text-[var(--text-faint)]">/</span> Earn{" "}
                        <span className="text-[var(--text-faint)]">/</span> Grow.
                    </motion.h2>

                    {/* phase chips */}
                    <div className="mt-6 flex items-center gap-4">
                        {[
                            { l: "01 · Learn", o: chip0 },
                            { l: "02 · Earn", o: chip1 },
                            { l: "03 · Grow", o: chip2 },
                        ].map((c, i) => (
                            <motion.span
                                key={i}
                                style={{ opacity: c.o }}
                                className="text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--text)]"
                            >
                                {c.l}
                                {i < 2 && <span className="ml-4 text-[var(--text-faint)]">/</span>}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* stage */}
                <div className="flex-1 relative max-w-[1400px] w-full mx-auto px-6 md:px-10 pb-10">
                    {loop.map((step, i) => (
                        <Step
                            key={step.n}
                            step={step}
                            index={i}
                            total={loop.length}
                            progress={scrollYProgress}
                        />
                    ))}
                </div>

                {/* progress bar at bottom */}
                <div className="h-px bg-[#141416] mx-6 md:mx-10 mb-6">
                    <motion.div
                        style={{ width: barWidth }}
                        className="h-px bg-[var(--text)] origin-left"
                    />
                </div>
            </div>
        </section>
    );
}
