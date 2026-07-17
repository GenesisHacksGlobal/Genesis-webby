import React from "react";
import "@/styles/shell.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { Gallery } from "@/components/sections/Gallery";
import { Contact } from "@/components/sections/Contact";
import useLenis from "@/hooks/useLenis";

const Landing = () => {
    useLenis();
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
                <Gallery />
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
            </Routes>
        </BrowserRouter>
    );
}

export default App;
