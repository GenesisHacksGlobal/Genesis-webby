import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SAMVEDNA_PHOTOS, NO_AGENDA_1_PHOTOS } from "@/data/mediaAssets";

const loop = [
    {
        n: "01",
        title: "Learn",
        body: "Curated sprints, peer-led practice and workshops with practitioners doing the work today.",
        tags: ["Cohorts", "Sprints", "Reviews"],
        img: SAMVEDNA_PHOTOS[2].src,
    },
    {
        n: "02",
        title: "Earn",
        body: "Work on gigs & client projects sourced through the community. Ship real, get paid.",
        tags: ["Gigs", "Briefs", "Payouts"],
        img: NO_AGENDA_1_PHOTOS[1].src,
    },
    {
        n: "03",
        title: "Grow",
        body: "Feedback, mentorship and long-term collabs that compound into a serious freelance career.",
        tags: ["Mentorship", "Network", "Career"],
        img: SAMVEDNA_PHOTOS[3].src,
    },
];

function Step({ step, progress, index, total }) {
    const slot = 1 / total;
    const start = slot * index;
    const end = slot * (index + 1);
    const opacity = useTransform(
        progress,
        index === 0
            ? [0, end - 0.05, end + 0.05]
            : [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
        index === 0 ? [1, 1, 0] : [0, 1, 1, 0],
    );
    const y = useTransform(progress, [start, end], [40, -40]);
    const scale = useTransform(progress, [start, end], [1.06, 0.98]);

    return (
        <motion.div style={{ opacity }} className="absolute inset-0 flex items-center" aria-hidden={false}>
            <div className="w-full grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
                <motion.div style={{ scale, y }} className="md:col-span-6 relative aspect-[5/4] frame overflow-hidden">
                    <img src={step.img} alt={step.title} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "grayscale(20%) contrast(1.05) brightness(0.85)" }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/30" />
                    <div className="absolute top-5 left-5 overline !text-white/80">step</div>
                    <div className="absolute bottom-6 right-6 font-display text-[18vw] md:text-[14vw] lg:text-[200px] leading-none text-white/20 select-none tick">{step.n}</div>
                </motion.div>
                <motion.div style={{ y }} className="md:col-span-6 md:pl-6">
                    <div className="overline mb-4 !text-black/50">Phase {step.n}</div>
                    <h3 className="font-display text-7xl md:text-8xl lg:text-[160px] tracking-tight !text-black leading-[0.88]">{step.title}<span className="text-black/35">.</span></h3>
                    <p className="mt-8 text-lg md:text-xl text-black/60 leading-relaxed max-w-[42ch]">{step.body}</p>
                    <div className="mt-10 flex flex-wrap gap-2">
                        {step.tags.map((t) => (
                            <span key={t} className="text-[11px] font-mono uppercase tracking-[0.18em] text-black/50 border border-black/20 px-2.5 py-1">{t}</span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

function MobileStep({ step }) {
    return (
        <article className="py-10 border-t border-black/15 first:border-t-0">
            <div className="relative aspect-[4/3] overflow-hidden frame">
                <img
                    src={step.img}
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        filter: "grayscale(20%) contrast(1.05) brightness(0.85)",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/30" />
                <span className="absolute top-4 left-4 overline !text-white/80">
                    Phase {step.n}
                </span>
                <span className="absolute bottom-3 right-4 font-display text-7xl leading-none !text-white/25">
                    {step.n}
                </span>
            </div>

            <h3 className="mt-6 font-display text-6xl leading-[0.9] !text-black">
                {step.title}<span className="text-black/35">.</span>
            </h3>
            <p className="mt-4 text-base leading-relaxed text-black/60">
                {step.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-2.5 py-1 border border-black/20 text-[10px] font-mono uppercase tracking-[0.16em] text-black/50"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
}

export default function TheLoop() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
    const headlineOpacity = useTransform(scrollYProgress, [0, 0.92, 1], [1, 1, 0]);
    const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const chip0 = useTransform(scrollYProgress, [0, 0.33], [1, 0.3]);
    const chip1 = useTransform(scrollYProgress, [0.2, 0.5, 0.66], [0.3, 1, 0.3]);
    const chip2 = useTransform(scrollYProgress, [0.55, 0.85], [0.3, 1]);

    return (
        <section
            id="loop"
            ref={containerRef}
            className="relative z-[3] h-auto md:h-[320vh] border-t border-black/10 bg-white text-black"
        >
            <div className="md:hidden px-5 sm:px-6 py-20">
                <div className="flex items-center gap-3 mb-4">
                    <span className="block w-10 h-px bg-black/40" />
                    <span className="overline !text-black/50">
                        Chapter 02 · The Loop
                    </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl tracking-tighter leading-[1.02] !text-black">
                    Learn <span className="text-black/35">/</span> Earn{" "}
                    <span className="text-black/35">/</span> Grow.
                </h2>

                <div className="mt-8">
                    {loop.map((step) => (
                        <MobileStep key={step.n} step={step} />
                    ))}
                </div>
            </div>

            <div className="hidden md:flex sticky top-0 h-[var(--app-height)] flex-col overflow-hidden bg-white">
                <div className="max-w-[1400px] w-full mx-auto px-6 md:px-10 pt-24 md:pt-28 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="block w-10 h-px bg-black/40" />
                        <span className="overline !text-black/50">Chapter 02 · The Loop</span>
                    </div>
                    <motion.h2 style={{ opacity: headlineOpacity }} className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[1.02] !text-black">
                        Learn <span className="text-black/35">/</span> Earn{" "}<span className="text-black/35">/</span> Grow.
                    </motion.h2>
                    <div className="mt-4 flex items-center gap-4">
                        {[{ l: "01 · Learn", o: chip0 }, { l: "02 · Earn", o: chip1 }, { l: "03 · Grow", o: chip2 }].map((c, i) => (
                            <motion.span key={i} style={{ opacity: c.o }} className="text-[11px] font-mono uppercase tracking-[0.2em] text-black">
                                {c.l}{i < 2 && <span className="ml-4 text-black/35">/</span>}
                            </motion.span>
                        ))}
                    </div>
                </div>
                <div className="flex-1 relative min-h-0 max-w-[1400px] w-full mx-auto px-6 md:px-10 pb-6">
                    {loop.map((step, i) => (
                        <Step key={step.n} step={step} index={i} total={loop.length} progress={scrollYProgress} />
                    ))}
                </div>
                <div className="h-px bg-black/15 mx-6 md:mx-10 mb-6 shrink-0">
                    <motion.div style={{ width: barWidth }} className="h-px bg-black origin-left" />
                </div>
            </div>
        </section>
    );
}
