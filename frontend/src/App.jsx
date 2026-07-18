import React, { Suspense, lazy, useEffect } from "react";
import "@/styles/shell.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Toaster } from "sonner";

import {
    Intro,
    Cursor,
    ChapterRail,
    Navbar,
    Marquee,
    ScribbleDivider,
    Footer,
} from "@/components/layout";

import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { TheLoop } from "@/components/sections/TheLoop";
import { Events } from "@/components/sections/Events";
import { Contact } from "@/components/sections/Contact";
import useLenis from "@/hooks/useLenis";

const GalleryPage = lazy(() => import("@/pages/GalleryPage"));
const EventPage = lazy(() => import("@/pages/EventPage"));

function RouteFallback() {
    return (
        <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--bg)] text-[var(--text-faint)]"
            role="status"
            aria-live="polite"
        >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em]">
                Loading…
            </p>
        </div>
    );
}

const Landing = () => {
    useLenis();
    const location = useLocation();

    useEffect(() => {
        const id = location.hash.slice(1);
        if (!id) {
            window.scrollTo(0, 0);
            return;
        }

        const timeout = window.setTimeout(() => {
            const target = document.getElementById(id);
            if (!target) return;

            if (window.__lenis) {
                window.__lenis.scrollTo(target, { offset: -60, duration: 1.6 });
            } else {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 50);

        return () => window.clearTimeout(timeout);
    }, [location.hash]);

    return (
        <div className="App grain dark">
            <Intro />
            <Cursor />
            <ChapterRail />
            <Navbar />
            <main className="relative">
                <Hero />
                <Marquee />
                <About />
                <ScribbleDivider variant="wave" />
                <TheLoop />
                <ScribbleDivider variant="arrow" />
                <Events />
                <Contact />
            </main>
            <Footer />
            <Toaster theme="dark" position="bottom-right" />
        </div>
    );
};

function App() {
    return (
        <MotionConfig reducedMotion="user">
            <BrowserRouter>
                <Suspense fallback={<RouteFallback />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/events" element={<EventPage />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </MotionConfig>
    );
}

export default App;
