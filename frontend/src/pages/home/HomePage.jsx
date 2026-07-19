import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "@shared/styles/shell.css";

import {
  Intro,
  Cursor,
  ChapterRail,
  Navbar,
  Marquee,
  ScribbleDivider,
  Footer,
} from "@widgets/layout";

import { Hero } from "@features/hero";
import { About } from "@features/about";
import { TheLoop } from "@features/the-loop";
import { Events } from "@features/events-showcase";
import { Contact } from "@features/contact";
import useLenis from "@shared/hooks/useLenis";

/**
 * Marketing landing — chrome + feature sections.
 * Smooth scroll (Lenis) and hash deep-links live here.
 */
export default function HomePage() {
  useLenis();
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) {
      window.scrollTo(0, 0);
      return undefined;
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
    </div>
  );
}
