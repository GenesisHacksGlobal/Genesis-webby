import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO_URL = "/images/logo.png";

export default function Intro({ onDone }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const seen = sessionStorage.getItem("dezhub_intro_seen");
        if (seen) {
            setShow(false);
            onDone?.();
            return;
        }
        // total duration ~3.4s
        sessionStorage.setItem("dezhub_intro_seen", "1");
        const t = setTimeout(() => {
            setShow(false);
            onDone?.();
        }, 3400);
        // lock scroll while intro plays
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            clearTimeout(t);
        };
    }, [onDone]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[2000] bg-[var(--bg)] flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4 } }}
                >
                    {/* grain inside intro */}
                    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                        style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
                    />

                    {/* progress/overline at top */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="absolute top-10 left-1/2 -translate-x-1/2 overline text-[var(--text)]"
                    >
                        Genesis Cinematic Universe · Reel 01
                    </motion.div>

                    {/* logo reveal */}
                    <motion.div
                        initial={{ scale: 0.6, opacity: 0, filter: "blur(20px)" }}
                        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                        exit={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <img src={LOGO_URL} alt="Genesis" className="w-28 h-28 md:w-36 md:h-36" />
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="mt-6 font-display text-4xl md:text-5xl text-[var(--heading)] tracking-tight"
                        >
                            Genesis
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                            className="overline mt-3"
                        >
                            Learn · Earn · Grow
                        </motion.div>
                    </motion.div>

                    {/* progress line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 2.8, ease: "linear" }}
                        style={{ transformOrigin: "left center" }}
                        className="absolute bottom-10 left-10 right-10 h-px bg-[var(--text)]"
                    />

                    {/* curtain split */}
                    <motion.div
                        className="absolute inset-y-0 left-0 w-1/2 bg-[var(--bg)] origin-left z-20"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0, transition: { duration: 1.0, ease: [0.7, 0, 0.3, 1] } }}
                        style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }}
                    />
                    <motion.div
                        className="absolute inset-y-0 right-0 w-1/2 bg-[var(--bg)] origin-right z-20"
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0, transition: { duration: 1.0, ease: [0.7, 0, 0.3, 1] } }}
                        style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
