import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Custom cursor: small dot + larger ring, ring magnetically grows over interactive elements
export default function Cursor() {
    const mx = useMotionValue(-100);
    const my = useMotionValue(-100);
    const ringX = useSpring(mx, { stiffness: 350, damping: 35, mass: 0.6 });
    const ringY = useSpring(my, { stiffness: 350, damping: 35, mass: 0.6 });
    const dotX = useSpring(mx, { stiffness: 700, damping: 28, mass: 0.3 });
    const dotY = useSpring(my, { stiffness: 700, damping: 28, mass: 0.3 });
    const [hover, setHover] = useState(false);
    const [label, setLabel] = useState("");
    const [coarse, setCoarse] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const coarseMq = window.matchMedia("(pointer:coarse)");
        const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () =>
            setCoarse(coarseMq.matches || reducedMq.matches);
        update();
        coarseMq.addEventListener?.("change", update);
        reducedMq.addEventListener?.("change", update);
        return () => {
            coarseMq.removeEventListener?.("change", update);
            reducedMq.removeEventListener?.("change", update);
        };
    }, []);

    useEffect(() => {
        if (coarse) return;
        const onMove = (e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
        };
        const onOver = (e) => {
            const t = e.target.closest("a, button, [role='button'], [data-cursor], input, textarea, select");
            if (t) {
                setHover(true);
                const l = t.getAttribute("data-cursor-label");
                setLabel(l || "");
            } else {
                setHover(false);
                setLabel("");
            }
        };
        window.addEventListener("mousemove", onMove);
        document.addEventListener("mouseover", onOver);
        document.body.style.cursor = "none";
        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseover", onOver);
            document.body.style.cursor = "";
        };
    }, [coarse, mx, my]);

    if (coarse) return null;

    return (
        <>
            {/* ring */}
            <motion.div
                aria-hidden
                style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
                className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
            >
                <motion.div
                    animate={{
                        width: hover ? 88 : 36,
                        height: hover ? 88 : 36,
                        borderColor: hover ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-full border bg-transparent flex items-center justify-center"
                >
                    {label && (
                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white">
                            {label}
                        </span>
                    )}
                </motion.div>
            </motion.div>
            {/* dot */}
            <motion.div
                aria-hidden
                style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
            >
                <motion.div
                    animate={{ scale: hover ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                />
            </motion.div>
        </>
    );
}
