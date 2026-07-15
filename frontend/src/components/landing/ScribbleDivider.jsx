import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Animated SVG line that "draws" itself as the section scrolls into view
export default function ScribbleDivider({ variant = "wave" }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90%", "end 30%"],
    });
    const length = useTransform(scrollYProgress, [0, 1], [0, 1]);

    const paths = {
        wave: "M 0 50 Q 200 0, 400 50 T 800 50 T 1200 50 T 1600 50",
        arrow: "M 0 50 L 1400 50 L 1370 30 M 1400 50 L 1370 70",
        cross: "M 0 0 L 1600 100 M 1600 0 L 0 100",
    };

    return (
        <div ref={ref} className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-10">
            <svg
                viewBox="0 0 1600 100"
                preserveAspectRatio="none"
                className="w-full h-16 md:h-24"
                aria-hidden
            >
                <motion.path
                    d={paths[variant] || paths.wave}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="text-[var(--text-dim)]"
                    style={{ pathLength: length, opacity: length }}
                />
            </svg>
        </div>
    );
}
