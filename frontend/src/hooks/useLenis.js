import { useEffect } from "react";
import Lenis from "lenis";

// Lenis smooth-scroll. Disabled on touch / coarse-pointer devices so that
// native mobile scrolling works correctly.
export default function useLenis() {
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Detect touch / mobile environments — skip Lenis on those entirely.
        const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
        const isTouch =
            "ontouchstart" in window ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
        const isNarrow = window.innerWidth < 1024;
        if (isCoarse || isTouch || isNarrow) {
            // Fallback: smooth in-page anchor clicks via native scrollIntoView.
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
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        const id = requestAnimationFrame(raf);

        window.__lenis = lenis;

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
            cancelAnimationFrame(id);
            document.removeEventListener("click", onClick);
            lenis.destroy();
            delete window.__lenis;
        };
    }, []);
}
