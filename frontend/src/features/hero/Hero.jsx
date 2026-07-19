import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LANDING } from "@shared/constants/testIds";
import HeroCanvas from "./HeroCanvas";

// One letter per word is rendered in Gridular (pixel font),
// the rest in Aeonik — mirroring the "Frontend" reference.
const words = [
  { text: "BUILD.", gridularIndex: 1 }, // U
  { text: "HACK.", gridularIndex: 1 }, // A
  { text: "SCALE.", gridularIndex: 4 }, // E
];

const AEONIK = '"Aeonik", sans-serif';
const GRIDULAR = '"Gridular", sans-serif';

function MaskWord({ word, gridularIndex, delay }) {
  return (
    <span className="inline-block overflow-hidden align-top mr-3 pb-2">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {word.split("").map((letter, i) => (
          <span
            key={i}
            style={{
              fontFamily: i === gridularIndex ? GRIDULAR : AEONIK,
              verticalAlign: "baseline",
            }}
          >
            {letter}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const [showModel, setShowModel] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const updateModelVisibility = () => setShowModel(mediaQuery.matches);

    updateModelVisibility();
    mediaQuery.addEventListener("change", updateModelVisibility);
    return () =>
      mediaQuery.removeEventListener("change", updateModelVisibility);
  }, []);

  // minimal parallax — quiet, restrained
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset: -60, duration: 1.6 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-[var(--app-height)] flex items-start md:items-end overflow-hidden pt-40 sm:pt-44 md:pt-[160px] bg-transparent"
    >
      {/* grid over the faceted gradient */}
      <motion.div
        style={{ y: gridY }}
        aria-hidden
        className="absolute inset-0 z-[0] opacity-[0.22] hero-grid"
      />

      {/* 3D Model Canvas */}
      {showModel && <HeroCanvas />}

      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 md:px-10 pb-10 md:pb-24 mt-2 md:mt-10">
        <motion.h1
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-[1] md:-translate-y-24 font-display leading-[0.88] md:leading-[0.86] tracking-[0.005em] text-[var(--heading)] text-[17vw] sm:text-[15vw] md:text-[13vw] lg:text-[190px] w-full"
        >
          {words.map((w, i) => {
            let className = "block";
            if (i === 0) className = "block md:-translate-x-[200px]";
            if (i === 1) {
              className = "block text-right md:translate-x-[240px]";
            }
            if (i === 2) className = "block md:-translate-x-[200px]";
            return (
              <span key={w.text} className={className}>
                <MaskWord
                  word={w.text}
                  gridularIndex={w.gridularIndex}
                  delay={0.4 + i * 0.18}
                />
              </span>
            );
          })}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-[10] md:-translate-y-24 mt-8 md:mt-12 grid md:grid-cols-12 gap-7 md:gap-10 items-end"
        >
          <p className="md:col-span-6 md:-translate-x-[120px] text-base sm:text-lg md:text-xl text-[var(--text-dim)] max-w-[52ch] leading-relaxed">
            Empowering the next generation of builders through hackathons,
            speaker sessions, hands-on workshops, and community-driven
            experiences across India.
          </p>

          <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 md:justify-end md:translate-x-[120px]">
            <button
              data-testid={LANDING.heroCtaPrimary}
              data-cursor
              data-cursor-label="RSVP"
              onClick={() => scrollTo("upcoming")}
              className="btn-cinema"
            >
              Explore upcoming event
              <span aria-hidden>â†’</span>
            </button>
            <button
              data-testid={LANDING.heroCtaSecondary}
              data-cursor
              data-cursor-label="Read"
              onClick={() => scrollTo("about")}
              className="btn-ghost"
            >
              How Genesis works
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
