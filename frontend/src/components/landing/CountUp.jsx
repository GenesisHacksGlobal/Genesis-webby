import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

// Animated number counter that scrubs to target when scrolled into view
export default function CountUp({ value = 100, suffix = "", duration = 2, className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const mv = useMotionValue(0);
    const [display, setDisplay] = useState("0");

    useEffect(() => {
        if (!inView) return;
        const controls = animate(mv, value, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => {
                const n = Math.round(latest);
                setDisplay(n.toLocaleString("en-IN"));
            },
        });
        return () => controls.stop();
    }, [inView, value, duration, mv]);

    return (
        <span ref={ref} className={className}>
            {display}
            {suffix}
        </span>
    );
}
