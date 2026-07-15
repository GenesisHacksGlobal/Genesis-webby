import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Letter({ ch, i, dir, progress }) {
    const x = useTransform(progress, [0, 0.6], [dir * 240, 0]);
    const y = useTransform(progress, [0, 0.6], [i % 2 === 0 ? 90 : -90, 0]);
    const rot = useTransform(progress, [0, 0.6], [dir * 12, 0]);
    const opacity = useTransform(progress, [0, 0.5], [0, 1]);

    return (
        <motion.span
            style={{ x, y, rotate: rot, opacity }}
            className="font-display tracking-tight leading-[0.85] text-[22vw] md:text-[18vw] lg:text-[280px] text-[var(--text)] inline-block hover:text-[var(--text-dim)] transition-colors duration-700 will-change-transform"
            data-cursor
        >
            {ch}
        </motion.span>
    );
}

// Massive scroll-reactive wordmark — letters slide in from different directions
export default function HugeWordmark() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const letters = "DEZHUB".split("");
    const dirs = [-1, 1, -1, 1, -1, 1];

    return (
        <section ref={ref} className="relative py-20 md:py-32 overflow-hidden border-t border-border">
            <div className="max-w-[1600px] mx-auto px-4 md:px-10 flex flex-col items-center">
                <div className="overline mb-10">End reel · 06</div>
                <div className="flex justify-center w-full select-none">
                    {letters.map((ch, i) => (
                        <Letter key={i} ch={ch} i={i} dir={dirs[i]} progress={scrollYProgress} />
                    ))}
                </div>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    className="mt-10 overline text-center"
                >
                    Designed in the dark · shipped with the lights on
                </motion.p>
            </div>
        </section>
    );
}
