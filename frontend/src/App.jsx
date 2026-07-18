import React, { useEffect } from "react";
import "@/styles/shell.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import GalleryPage from "@/pages/GalleryPage";
import useLenis from "@/hooks/useLenis";

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
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/gallery" element={<GalleryPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
