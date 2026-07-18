import { useEffect } from "react";
import Lenis from "lenis";

// Lenis smooth-scroll. Disabled on touch / coarse-pointer devices so that
// native mobile scrolling works correctly.
export default function useLenis() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
        const isTouch =
            "ontouchstart" in window ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        const isNarrow = window.innerWidth < 1024;
        const prefersReduced =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (isCoarse || isTouch || isNarrow || prefersReduced) {
            const onClick = (e) => {
                const a = e.target.closest("a[href^='#']");
                if (!a) return;
                const id = a.getAttribute("href").slice(1);
                const el = document.getElementById(id);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            };
            document.addEventListener("click", onClick);
            return () => document.removeEventListener("click", onClick);
        }

        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            autoRaf: false,
        });

        let rafId = 0;
        let running = false;
        let scrollDispatchPending = false;

        const raf = (time) => {
            if (!running) return;
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        const start = () => {
            if (running || document.hidden) return;
            running = true;
            rafId = requestAnimationFrame(raf);
        };

        const stop = () => {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = 0;
        };

        const onVisibility = () => {
            if (document.hidden) stop();
            else start();
        };

        start();
        document.addEventListener("visibilitychange", onVisibility);

        window.__lenis = lenis;

        // Throttle synthetic scroll events to once per frame
        lenis.on("scroll", () => {
            if (scrollDispatchPending) return;
            scrollDispatchPending = true;
            requestAnimationFrame(() => {
                scrollDispatchPending = false;
                window.dispatchEvent(new Event("scroll"));
            });
        });

        const onClick = (e) => {
            const a = e.target.closest("a[href^='#']");
            if (!a) return;
            const targetId = a.getAttribute("href").slice(1);
            const el = document.getElementById(targetId);
            if (el) {
                e.preventDefault();
                lenis.scrollTo(el, { offset: -60, duration: 1.6 });
            }
        };
        document.addEventListener("click", onClick);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
            document.removeEventListener("click", onClick);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);
}
