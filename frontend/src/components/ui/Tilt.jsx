import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Subtle 3D mouse-tilt wrapper for cards (with optional motion-tracked glare)
export default function Tilt({ children, className = "", max = 6, glare = true }) {
    const ref = useRef(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 250, damping: 22, mass: 0.4 });
    const sy = useSpring(my, { stiffness: 250, damping: 22, mass: 0.4 });
    const rotX = useTransform(sy, [-0.5, 0.5], [max, -max]);
    const rotY = useTransform(sx, [-0.5, 0.5], [-max, max]);
    // glare position
    const gx = useTransform(sx, [-0.5, 0.5], [10, 90]);
    const gy = useTransform(sy, [-0.5, 0.5], [10, 90]);
    const glareBg = useTransform([gx, gy], ([x, y]) =>
        `radial-gradient(380px circle at ${x}% ${y}%, rgba(255,255,255,0.16), transparent 50%)`,
    );

    const onMove = (e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
        mx.set(0);
        my.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
                rotateX: rotX,
                rotateY: rotY,
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
            }}
            className={`relative ${className}`}
        >
            {children}
            {glare && (
                <motion.div
                    aria-hidden
                    style={{ background: glareBg }}
                    className="pointer-events-none absolute inset-0 mix-blend-overlay"
                />
            )}
        </motion.div>
    );
}
