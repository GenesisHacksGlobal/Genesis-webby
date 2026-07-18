import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const chapters = [
    { id: "hero", n: "00", label: "Cold open" },
    { id: "about", n: "01", label: "About" },
    { id: "loop", n: "02", label: "The Loop" },
    { id: "events", n: "03", label: "Programme" },
    { id: "contact", n: "04", label: "Contact" },
];

// Right-edge vertical chapter rail (designer feel — like film reel timecodes)
export default function ChapterRail() {
    const [active, setActive] = useState("hero");
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        const observers = [];
        chapters.forEach((c) => {
            const el = document.getElementById(c.id);
            if (!el) return;
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) setActive(c.id);
                    });
                },
                { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
            );
            io.observe(el);
            observers.push(io);
        });
        const onScroll = () => setHidden(window.scrollY < 200);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            observers.forEach((o) => o.disconnect());
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: hidden ? 0 : 1, x: hidden ? 20 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex fixed top-1/2 right-6 -translate-y-1/2 z-30 flex-col gap-5 pointer-events-none"
            aria-hidden
        >
            {chapters.map((c) => {
                const isActive = active === c.id;
                return (
                    <a
                        key={c.id}
                        href={`#${c.id}`}
                        className="pointer-events-auto group flex items-center gap-3 justify-end"
                        data-cursor
                    >
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: isActive ? 1 : 0,
                                x: isActive ? 0 : 6,
                            }}
                            transition={{ duration: 0.4 }}
                            className="text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--text)]"
                        >
                            {c.label}
                        </motion.span>
                        <span className="font-mono text-[10px] tracking-[0.22em] text-[var(--text-faint)] group-hover:text-[var(--text)] transition-colors">
                            {c.n}
                        </span>
                        <motion.span
                            animate={{
                                width: isActive ? 28 : 14,
                                backgroundColor: isActive ? "rgb(245,245,240)" : "rgb(63,63,68)",
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="block h-px"
                        />
                    </a>
                );
            })}
        </motion.aside>
    );
}
