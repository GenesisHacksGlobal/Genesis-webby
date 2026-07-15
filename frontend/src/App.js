import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Intro from "@/components/landing/Intro";
import Cursor from "@/components/landing/Cursor";
import ChapterRail from "@/components/landing/ChapterRail";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import About from "@/components/landing/About";
import LearnEarnGrow from "@/components/landing/LearnEarnGrow";
import Events from "@/components/landing/Events";
import Gallery from "@/components/landing/Gallery";
import Contact from "@/components/landing/Contact";
import ScribbleDivider from "@/components/landing/ScribbleDivider";
import HugeWordmark from "@/components/landing/HugeWordmark";
import Footer from "@/components/landing/Footer";
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
                <LearnEarnGrow />
                <ScribbleDivider variant="arrow" />
                <Events />
                <Gallery />
                <Contact />
                <HugeWordmark />
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
