import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMVEDNA_PHOTOS, NO_AGENDA_1_PHOTOS, GALLERY_PHOTOS } from "@shared/data/mediaAssets";
import { eventDatabase } from "@shared/data/eventDatabase";
import { createPlayGate } from "@infra/performance/utils/createPlayGate";
import { SpiralImages } from "@shared/ui";
import { Footer } from "@widgets/layout";

gsap.registerPlugin(ScrollTrigger);

const defaultCards = [
  { id: "01", title: "Samvedna: On Stage", img: SAMVEDNA_PHOTOS[0].src },
  { id: "02", title: "Samvedna: The Room", img: SAMVEDNA_PHOTOS[1].src },
  { id: "03", title: "Samvedna: Workshop", img: SAMVEDNA_PHOTOS[2].src },
  { id: "04", title: "Samvedna: Panel", img: SAMVEDNA_PHOTOS[3].src },
  { id: "05", title: "Samvedna: Closing", img: SAMVEDNA_PHOTOS[4].src },
  { id: "06", title: "No Agenda 1.0: Talk", img: NO_AGENDA_1_PHOTOS[0].src },
  { id: "07", title: "No Agenda 1.0: Crowd", img: NO_AGENDA_1_PHOTOS[1].src },
  { id: "08", title: "No Agenda 1.0: Q&A", img: NO_AGENDA_1_PHOTOS[2].src },
  { id: "09", title: "No Agenda 1.0: Collab", img: NO_AGENDA_1_PHOTOS[3].src },
];

const getCategoryImageUrl = (category, index) => {
  const hackathonImages = [
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
  ];
  const workshopImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop"
  ];
  const meetupImages = [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop"
  ];
  
  const cat = (category || "").toLowerCase();
  let pool = meetupImages;
  if (cat.includes("hack") || cat.includes("clash") || cat.includes("code")) {
    pool = hackathonImages;
  } else if (cat.includes("work") || cat.includes("boot") || cat.includes("teach") || cat.includes("idea")) {
    pool = workshopImages;
  }
      
  return pool[index % pool.length];
};

const isUrl = (str) => str && (str.startsWith("http://") || str.startsWith("https://"));

const cleanEvents = eventDatabase
  .filter(e => e.title && e.date && e.location && !e.title.startsWith("http"))
  .map((e, index) => {
    // Extract year from date string (e.g. "18 September 2024" -> "2024")
    const matchYear = e.date ? e.date.match(/20\d\d/) : null;
    const year = matchYear ? matchYear[0] : (index % 2 === 0 ? "2024" : "2023");
    // Extract city from location (e.g. "SRM IST, Delhi NCR" -> "Delhi NCR")
    const parts = (e.location || "").split(",");
    const city = parts.length > 1 ? parts[parts.length - 1].trim() : (e.location || "India");

    return {
      ...e,
      year,
      city,
      img: getCategoryImageUrl(e.category, index)
    };
  });

// Count animation component for archive header
function AnimatedCounter({ value = 110, duration = 2 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (start === end) return;
    const totalMiliseconds = duration * 1000;
    const incrementTime = 30;
    const steps = totalMiliseconds / incrementTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function WorkSection({ cards = defaultCards }) {
  const workSectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const letterRefs = useRef([]);

  // Search & Filter State (Linear Command Bar)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Selected event for morphing Detail Page
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Timeline zoom & hover state
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [hoveredTimelineNode, setHoveredTimelineNode] = useState(null);

  letterRefs.current = [];

  // 3D Canvas Scroll Setup
  useEffect(() => {
    const workSection = workSectionRef.current;
    const textContainer = textContainerRef.current;
    const cardsContainer = cardsContainerRef.current;
    if (!workSection || !textContainer || !cardsContainer) return;

    const lenis = new Lenis();
    const scrollHandler = () => ScrollTrigger.update();
    lenis.on("scroll", scrollHandler);

    const tickerHandler = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    const onDocVisibility = () => {
      if (document.hidden) {
        gsap.ticker.sleep();
      } else {
        gsap.ticker.wake();
      }
    };
    document.addEventListener("visibilitychange", onDocVisibility);

    let moveDistance = window.innerWidth * 2.75;
    let currentXPosition = 0;
    let targetXPosition = 0;

    const lerp = (start, end, t) => start * (1 - t) + end * t;

    const gridCanvas = document.createElement("canvas");
    gridCanvas.id = "grid-canvas";
    workSection.appendChild(gridCanvas);
    const gridCtx = gridCanvas.getContext("2d", { willReadFrequently: false });

    const resizeGridCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      gridCanvas.width = window.innerWidth * dpr;
      gridCanvas.height = window.innerHeight * dpr;
      gridCanvas.style.width = `${window.innerWidth}px`;
      gridCanvas.style.height = `${window.innerHeight}px`;
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrid = (scrollProgress = 0) => {
      gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      gridCtx.fillStyle = "#0a0a0c";
      gridCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      gridCtx.fillStyle = "rgba(196, 181, 253, 0.25)";

      const dotSize = 1;
      const spacing = 36;
      const rows = Math.ceil(window.innerHeight / spacing);
      const cols = Math.ceil(window.innerWidth / spacing) + 15;
      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath();
          gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
          gridCtx.fill();
        }
      }
    };

    // Camera-only projection math — no WebGLRenderer (DOM letters + CSS transforms).
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    lettersCamera.position.z = 20;

    const createTextAnimationPath = (yPos, amplitude) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5,
          ),
        );
      }
      return { curve: new THREE.CatmullRomCurve3(points), letterElements: [] };
    };

    const paths = [
      createTextAnimationPath(7.5, 1.5),
      createTextAnimationPath(2.5, 0.8),
      createTextAnimationPath(-2.5, 0.8),
      createTextAnimationPath(-7.5, 1.5),
    ];

    const lettersPositions = new Map();
    const lettersList = ["E", "V", "E", "N", "T", "S"];
    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];

    paths.forEach((line, pathIndex) => {
      lettersList.forEach((_char, letterIndex) => {
        const elIdx = pathIndex * lettersList.length + letterIndex;
        const el = letterRefs.current[elIdx];
        if (el) {
          line.letterElements.push(el);
          lettersPositions.set(el, {
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
          });
        }
      });
    });

    const updateTargetPositions = (scrollProgress) => {
      paths.forEach((line, index) => {
        line.letterElements.forEach((el, i) => {
          const point = line.curve.getPoint(
            (i / 14 + scrollProgress * lineSpeedMultipliers[index]) % 1,
          );
          const vector = point.clone().project(lettersCamera);
          const position = lettersPositions.get(el);
          if (position) {
            position.target = {
              x: (vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (vector.y * -0.5 + 0.5) * window.innerHeight,
            };
          }
        });
      });
    };

    const updateLetterPositions = () => {
      lettersPositions.forEach((position, element) => {
        const dx = position.target.x - position.current.x;
        const dy = position.target.y - position.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > window.innerWidth * 0.5) {
          position.current.x = position.target.x;
          position.current.y = position.target.y;
        } else {
          position.current.x = lerp(position.current.x, position.target.x, 0.07);
          position.current.y = lerp(position.current.y, position.target.y, 0.07);
        }
        element.style.transform = `translate(-50%, -50%) translate3d(${position.current.x}px, ${position.current.y}px, 0)`;
      });
    };

    const updateCardsTarget = (scrollProgress) => {
      targetXPosition = -moveDistance * scrollProgress;
    };

    const updateCardsPosition = () => {
      currentXPosition = lerp(currentXPosition, targetXPosition, 0.07);
      gsap.set(cardsContainer, { x: currentXPosition });
    };

    let animationFrameId = 0;
    let playing = true;
    let animate = () => {};
    let gridRaf = 0;
    let pendingGridProgress = 0;

    const scheduleGridDraw = (progress) => {
      pendingGridProgress = progress;
      if (gridRaf) return;
      gridRaf = requestAnimationFrame(() => {
        gridRaf = 0;
        drawGrid(pendingGridProgress);
      });
    };

    const gate = createPlayGate(workSection, { rootMargin: "120px 0px" });
    const unsubGate = gate.subscribe((active) => {
      playing = active;
      if (active && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    animate = () => {
      if (!playing || !gate.active) {
        animationFrameId = 0;
        return;
      }
      updateLetterPositions();
      updateCardsPosition();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeGridCanvas();
    drawGrid(0);

    const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    const pinDistance = () =>
      Math.round(window.innerHeight * (isCoarse ? 2.2 : 2.75));

    const workTrigger = ScrollTrigger.create({
      trigger: workSection,
      start: "top top",
      end: () => `+=${pinDistance()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      onUpdate: (self) => {
        updateTargetPositions(self.progress);
        updateCardsTarget(self.progress);
        scheduleGridDraw(self.progress);
      },
    });

    updateTargetPositions(0);
    if (gate.active) {
      animationFrameId = requestAnimationFrame(animate);
    }

    const handleResize = () => {
      const progress = workTrigger ? workTrigger.progress : 0;
      moveDistance = window.innerWidth * (isCoarse ? 2.2 : 2.75);
      resizeGridCanvas();
      drawGrid(progress);
      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      updateTargetPositions(progress);
      updateCardsTarget(progress);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      playing = false;
      unsubGate();
      gate.destroy();
      cancelAnimationFrame(animationFrameId);
      if (gridRaf) cancelAnimationFrame(gridRaf);
      document.removeEventListener("visibilitychange", onDocVisibility);
      workTrigger.kill();
      lenis.destroy();
      gsap.ticker.remove(tickerHandler);
      gsap.ticker.wake();
      if (gridCanvas.parentNode) gridCanvas.parentNode.removeChild(gridCanvas);
    };
  }, [cards]);

  const pathsCount = 4;
  const lettersList = ["E", "V", "E", "N", "T", "S"];

  // Unique categories, years, cities
  const categories = useMemo(() => ["All", ...new Set(cleanEvents.map(e => e.category))], []);
  const years = useMemo(() => ["All", ...new Set(cleanEvents.map(e => e.year).filter(Boolean))].sort().reverse(), []);
  const cities = useMemo(() => ["All", ...new Set(cleanEvents.map(e => e.city).filter(Boolean))], []);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return cleanEvents.filter(event => {
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesYear = selectedYear === "All" || event.year === selectedYear;
      const matchesCity = selectedCity === "All" || event.city === selectedCity;
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.sponsors && event.sponsors.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesYear && matchesCity && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedYear, selectedCity]);

  // Featured Events (4 to 6 large editorial items)
  const featuredEvents = useMemo(() => cleanEvents.slice(0, 5), []);

  // Timeline events sorted by date/id
  const timelineEvents = useMemo(() => cleanEvents.slice(0, 16), []);

  return (
    <div className="work-section-wrapper bg-[#0a0a0c] text-white selection:bg-[var(--brand)] selection:text-black">
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />

      {/* ──────────────────────────────────────────────────
          HERO / INTRO SECTION
      ────────────────────────────────────────────────── */}
      <section className="intro flex flex-col items-center justify-center relative min-h-screen text-center px-4 overflow-hidden">
        <div className="intro-spiral-container">
          <SpiralImages images={GALLERY_PHOTOS} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/40 via-[#0a0a0c]/60 to-[#0a0a0c] pointer-events-none z-[1]" />

        <div className="absolute top-8 left-8 z-50">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/10 bg-black/40 hover:bg-white/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-white/80 hover:text-white transition-all rounded-full hover:border-white/25 backdrop-blur-md"
          >
            ← Genesis Home
          </Link>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6 relative z-10 pt-16">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--brand)]">
              Digital Event Archive
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl md:text-9xl tracking-tight text-white uppercase leading-none">
            GENESIS ARCHIVE
          </h1>

          <p className="font-sans text-base sm:text-xl text-white/60 max-w-xl font-light leading-relaxed">
            Exploring five years of hackathons, workshops, AI summits, and community developer gatherings.
          </p>

          <div className="mt-6 flex items-center gap-8 font-mono text-xs text-white/40 tracking-wider">
            <div><span className="text-white font-bold">110+</span> RECORDS</div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div><span className="text-white font-bold">2022–2026</span> ERA</div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div><span className="text-white font-bold">10K+</span> ATTENDEES</div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          3D SCROLL GALLERY
      ────────────────────────────────────────────────── */}
      <section className="work" ref={workSectionRef}>
        <div className="text-container" ref={textContainerRef}>
          {Array.from({ length: pathsCount }).map((_, pathIndex) => (
            <React.Fragment key={pathIndex}>
              {lettersList.map((char, letterIndex) => (
                <div
                  key={letterIndex}
                  className="letter"
                  ref={(el) => {
                    if (el) letterRefs.current.push(el);
                  }}
                >
                  {char}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        <div className="cards" ref={cardsContainerRef}>
          {cards.map((card, idx) => (
            <div className="card" key={idx}>
              <div className="card-img">
                <img src={card.img} alt={card.title} loading="lazy" decoding="async" />
              </div>
              <div className="card-copy">
                <p>{card.title}</p>
                <p>{card.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          MAIN ARCHIVE CONTAINER
      ────────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-16 space-y-32">

        {/* ──────────────────────────────────────────────────
            SECTION 01: THE ARCHIVE (Hero Statement & Counter)
        ────────────────────────────────────────────────── */}
        <section className="relative border-y border-white/10 py-24 md:py-32 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[var(--brand)]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6 max-w-3xl">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--brand)]">
                SECTION 01 // OVERVIEW
              </span>
              <h2 className="font-display text-6xl sm:text-8xl md:text-9xl tracking-tight uppercase text-white leading-none">
                <AnimatedCounter value={110} duration={2.5} /> <span className="text-white/20">EVENTS</span>
              </h2>
              <p className="font-sans text-xl sm:text-2xl text-white/70 font-light leading-relaxed">
                Explore five years of hackathons, workshops, AI summits and community meetups that shaped the developer ecosystem.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 font-mono text-xs text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ARCHIVE STATUS: ACTIVE</span>
              </div>
              <div>UPDATED JULY 2026</div>
            </div>
          </div>

          {/* Animated Timeline Bar */}
          <div className="mt-16 w-full h-px bg-white/10 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent"
            />
          </div>
        </section>

        {/* ──────────────────────────────────────────────────
            SECTION 04: FILTER (Floating Linear Command Bar)
        ────────────────────────────────────────────────── */}
        <section className="sticky top-6 z-50">
          <div className="mx-auto max-w-4xl bg-black/75 backdrop-blur-2xl border border-white/15 rounded-2xl p-3 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-3 transition-all">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full flex items-center">
              <svg className="w-4 h-4 ml-3 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, cities, partners..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mr-2 text-xs text-white/40 hover:text-white">✕</button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-3">
              {/* Category */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/5 border border-white/10 text-white/80 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--brand)]"
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-[#121215]">{cat === "All" ? "Category: All" : cat}</option>)}
              </select>

              {/* Year */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-white/5 border border-white/10 text-white/80 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--brand)]"
              >
                {years.map(yr => <option key={yr} value={yr} className="bg-[#121215]">{yr === "All" ? "Year: All" : yr}</option>)}
              </select>

              {/* City */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-white/5 border border-white/10 text-white/80 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[var(--brand)]"
              >
                {cities.map(c => <option key={c} value={c} className="bg-[#121215]">{c === "All" ? "City: All" : c}</option>)}
              </select>

              {/* Reset filter button */}
              {(selectedCategory !== "All" || selectedYear !== "All" || selectedCity !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedYear("All");
                    setSelectedCity("All");
                    setSearchQuery("");
                  }}
                  className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 rounded-lg transition-colors"
                >
                  Reset
                </button>
              )}

              <span className="hidden lg:inline-flex px-2 py-1 border border-white/10 rounded text-[9px] font-mono text-white/30">⌘K</span>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────
            SECTION 02: FEATURED EVENTS (Asymmetric Magazine Hero)
        ────────────────────────────────────────────────── */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--brand)]">
                SECTION 02 // CURATED
              </span>
              <h3 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight mt-2">
                FEATURED HIGHLIGHTS
              </h3>
            </div>
            <span className="hidden sm:inline-block font-mono text-xs text-white/40">EDITORIAL PICK 01—05</span>
          </div>

          {/* Asymmetric 70% / 30% Magazine Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Main Hero Card (70% width) */}
            {featuredEvents[0] && (
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedEvent(featuredEvents[0])}
                className="lg:col-span-8 group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer min-h-[500px] flex flex-col justify-end p-8 sm:p-12 shadow-2xl"
              >
                {/* Background Image with parallax reveal */}
                <div className="absolute inset-0 overflow-hidden z-0">
                  <img
                    src={featuredEvents[0].img}
                    alt={featuredEvents[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-[var(--brand)] text-black font-bold rounded-full">
                      {featuredEvents[0].category}
                    </span>
                    <span className="font-mono text-xs text-white/70">{featuredEvents[0].city} • {featuredEvents[0].year}</span>
                    <span className="ml-auto font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      {featuredEvents[0].attendees || "500+ Attendees"}
                    </span>
                  </div>

                  <h4 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight group-hover:text-[var(--heading)] transition-colors leading-none">
                    {featuredEvents[0].title}
                  </h4>

                  <p className="font-sans text-white/70 text-base sm:text-lg max-w-xl font-light line-clamp-2">
                    A flagship developer gathering bringing together engineers, designers, and founders across India.
                  </p>

                  <div className="pt-4 flex items-center gap-3 font-mono text-xs text-[var(--brand)] group-hover:translate-x-2 transition-transform">
                    <span>EXPLORE ARCHIVE RECORD</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Supporting Editorial Cards (30% width) */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              {featuredEvents.slice(1, 3).map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedEvent(event)}
                  className="flex-1 group relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] cursor-pointer p-6 sm:p-8 flex flex-col justify-between min-h-[240px]"
                >
                  <div className="absolute inset-0 overflow-hidden z-0">
                    <img
                      src={event.img}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-25 group-hover:opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest border border-white/20 text-white/80 rounded-full backdrop-blur-md">
                      {event.category}
                    </span>
                    <span className="font-mono text-xs text-white/50">{event.year}</span>
                  </div>

                  <div className="relative z-10 mt-12 space-y-2">
                    <h5 className="font-display text-2xl text-white uppercase tracking-tight group-hover:text-[var(--heading)] transition-colors">
                      {event.title}
                    </h5>
                    <p className="font-sans text-xs text-white/60 line-clamp-1">{event.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────────────
            SECTION 03: TIMELINE (Horizontal Interactive Axis)
        ────────────────────────────────────────────────── */}
        <section className="space-y-10 border-t border-white/10 pt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--brand)]">
                SECTION 03 // CHRONOLOGY
              </span>
              <h3 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight mt-2">
                2022 — 2026 TIMELINE
              </h3>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-white/40">ZOOM:</span>
              <button
                onClick={() => setTimelineZoom(z => Math.max(0.8, z - 0.2))}
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white/40 flex items-center justify-center font-mono text-sm"
              >
                -
              </button>
              <span className="font-mono text-xs text-white/80 w-10 text-center">{Math.round(timelineZoom * 100)}%</span>
              <button
                onClick={() => setTimelineZoom(z => Math.min(1.8, z + 0.2))}
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white/40 flex items-center justify-center font-mono text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Horizontal Drag/Scroll Canvas */}
          <div className="relative overflow-x-auto custom-scrollbar pb-12 pt-8">
            <div
              className="flex items-center gap-12 min-w-max px-8 relative"
              style={{ transform: `scale(${timelineZoom})`, transformOrigin: "left center", transition: "transform 0.3s ease" }}
            >
              {/* Connecting glowing horizontal axis line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-white/10 via-[var(--brand)]/40 to-white/10 z-0" />

              {timelineEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="relative z-10 group flex flex-col items-center cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                  onMouseEnter={() => setHoveredTimelineNode(event)}
                  onMouseLeave={() => setHoveredTimelineNode(null)}
                >
                  {/* Year Tag */}
                  <span className="font-mono text-[10px] text-white/40 mb-3 uppercase tracking-wider group-hover:text-[var(--brand)] transition-colors">
                    {event.year}
                  </span>

                  {/* Glowing Node Button */}
                  <motion.div
                    whileHover={{ scale: 1.4 }}
                    className="w-6 h-6 rounded-full border-2 border-white/30 bg-[#0a0a0c] flex items-center justify-center transition-colors group-hover:border-[var(--brand)] group-hover:shadow-[0_0_20px_var(--brand)]"
                  >
                    <span className="w-2 h-2 rounded-full bg-white/50 group-hover:bg-[var(--brand)]" />
                  </motion.div>

                  {/* Label under node */}
                  <span className="font-sans text-xs font-medium text-white/70 max-w-[120px] text-center mt-3 truncate group-hover:text-white">
                    {event.title}
                  </span>

                  {/* Node Hover Tooltip Card */}
                  <AnimatePresence>
                    {hoveredTimelineNode?.id === event.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-16 z-50 w-64 bg-[#141418] border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3 pointer-events-none"
                      >
                        <img src={event.img} alt="" className="w-full h-24 object-cover rounded-xl border border-white/10" />
                        <div>
                          <span className="font-mono text-[9px] text-[var(--brand)] uppercase tracking-wider block">{event.category}</span>
                          <h6 className="font-display text-sm text-white uppercase">{event.title}</h6>
                          <p className="font-sans text-[11px] text-white/60 mt-1">{event.location}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────
            SECTION 05 & 06: ADAPTIVE EVENT WALL (Magazine Grid & Hover Parallax)
        ────────────────────────────────────────────────── */}
        <section className="space-y-12 border-t border-white/10 pt-20">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--brand)]">
                SECTION 05 // MAGAZINE GRID
              </span>
              <h3 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight mt-2">
                EVENT ARCHIVE WALL
              </h3>
            </div>
            <span className="font-mono text-xs text-white/40">{filteredEvents.length} MATCHES</span>
          </div>

          {/* Adaptive Magazine Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                // Adaptive size pattern: Every 10th item extra wide, every 3rd medium span
                const isHero10th = (idx + 1) % 10 === 0;
                const isMedium3rd = (idx + 1) % 3 === 0 && !isHero10th;

                const spanClass = isHero10th
                  ? "md:col-span-12"
                  : isMedium3rd
                  ? "md:col-span-8"
                  : "md:col-span-4";

                return (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                    onClick={() => setSelectedEvent(event)}
                    className={`${spanClass} group relative rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-8 cursor-pointer overflow-hidden transition-all duration-500 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between ${
                      isHero10th ? 'min-h-[400px]' : isMedium3rd ? 'min-h-[340px]' : 'min-h-[300px]'
                    }`}
                  >
                    {/* Hover Glow Accent */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Image Hover Parallax */}
                    <div className="absolute inset-0 overflow-hidden z-0">
                      <img
                        src={event.img}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-15 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent" />
                    </div>

                    {/* Top Row Header */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-white/15 text-white/90 rounded-full backdrop-blur-md">
                        {event.category}
                      </span>
                      <span className="font-mono text-xs text-white/40">{event.year}</span>
                    </div>

                    {/* Middle Title */}
                    <div className="relative z-10 my-8 space-y-3">
                      <h4 className={`font-display uppercase tracking-tight text-white group-hover:text-[var(--heading)] transition-colors leading-tight ${
                        isHero10th ? 'text-4xl sm:text-6xl' : isMedium3rd ? 'text-2xl sm:text-3xl' : 'text-xl'
                      }`}>
                        {event.title}
                      </h4>

                      <p className="font-sans text-xs sm:text-sm text-white/60 font-light line-clamp-2">
                        {event.location}
                      </p>
                    </div>

                    {/* Bottom Metadata & Hover Reveal */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-white/50">
                      <span>{event.date || "EVENT RECORD"}</span>
                      <span className="group-hover:text-[var(--brand)] group-hover:translate-x-1.5 transition-all">
                        DETAILS →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredEvents.length === 0 && (
              <div className="col-span-full py-24 text-center border border-dashed border-white/10 rounded-3xl">
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">No event records found matching your filters.</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* ──────────────────────────────────────────────────
          SECTION 07: MORPHING DETAIL PAGE MODAL
      ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedEvent && (() => {
          const externalLink = isUrl(selectedEvent.media)
            ? selectedEvent.media
            : (isUrl(selectedEvent.attendees) ? selectedEvent.attendees : null);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.94, opacity: 0, y: 30 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.05 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-[#121216] border border-white/20 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] max-h-[92vh] flex flex-col custom-scrollbar"
              >
                {/* Hero Header Banner */}
                <div className="relative w-full h-72 sm:h-96 shrink-0 overflow-hidden">
                  <img
                    src={selectedEvent.img}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-[#121216]/60 to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-6 right-6 z-20 px-4 py-2 bg-black/60 hover:bg-black border border-white/20 text-white font-mono text-xs rounded-full backdrop-blur-md transition-all hover:scale-105"
                  >
                    ✕ CLOSE
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 font-mono text-xs uppercase tracking-widest bg-[var(--brand)] text-black font-bold rounded-full">
                        {selectedEvent.category}
                      </span>
                      <span className="font-mono text-xs text-white/70">{selectedEvent.year}</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight leading-none">
                      {selectedEvent.title}
                    </h2>
                  </div>
                </div>

                {/* Modal Body Content */}
                <div className="p-6 sm:p-10 space-y-8 overflow-y-auto">
                  {/* Grid Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="font-mono text-[10px] text-[var(--brand)] uppercase tracking-wider block">LOCATION / CITY</span>
                      <p className="font-sans text-sm text-white font-medium">{selectedEvent.location}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="font-mono text-[10px] text-[var(--brand)] uppercase tracking-wider block">DATE RECORD</span>
                      <p className="font-sans text-sm text-white font-medium">{selectedEvent.date || "N/A"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <span className="font-mono text-[10px] text-[var(--brand)] uppercase tracking-wider block">ATTENDANCE</span>
                      <p className="font-sans text-sm text-white font-medium">{selectedEvent.attendees || "500+ Registered"}</p>
                    </div>
                  </div>

                  {/* Overview Paragraph */}
                  <div className="space-y-3">
                    <h5 className="font-mono text-xs uppercase tracking-widest text-white/40">ARCHIVE OVERVIEW</h5>
                    <p className="font-sans text-base text-white/80 font-light leading-relaxed">
                      {selectedEvent.title} brought together developers, innovators, and mentors for an immersive experience focused on coding, technical workshops, and collaborative problem-solving.
                    </p>
                  </div>

                  {/* Partners / Sponsors */}
                  {selectedEvent.sponsors && selectedEvent.sponsors !== "-" && (
                    <div className="space-y-3 pt-4 border-t border-white/10">
                      <h5 className="font-mono text-xs uppercase tracking-widest text-white/40">SUPPORTING PARTNERS</h5>
                      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs text-white/70">
                        {selectedEvent.sponsors}
                      </div>
                    </div>
                  )}

                  {/* Action CTA */}
                  <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                    {externalLink ? (
                      <a
                        href={externalLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-black font-mono text-xs uppercase font-bold tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(196,181,253,0.3)]"
                      >
                        VIEW EVENT RECORD LINK ↗
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-white/40">GENESIS DIGITAL ARCHIVE RECORD #{selectedEvent.id}</span>
                    )}

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-3 border border-white/20 hover:border-white/40 text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all"
                    >
                      CLOSE RECORD
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ──────────────────────────────────────────────────
    CSS STYLES
────────────────────────────────────────────────── */
const cssContent = `
.work-section-wrapper {
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

.intro-spiral-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.45;
  pointer-events: none;
}

/* 3D Scroll Canvas section */
.work {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #0a0a0c;
}

#grid-canvas,
#letters-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

#grid-canvas { z-index: 1; }
#letters-canvas { z-index: 3; }

.text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.letter {
  position: absolute;
  font-family: 'Gridular', var(--font-display), sans-serif;
  font-size: clamp(3rem, 8vw, 8rem);
  color: rgba(255, 255, 255, 0.08);
  font-weight: 900;
  transform: translate(-50%, -50%);
  user-select: none;
}

.cards {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  display: flex;
  gap: 2rem;
  z-index: 4;
  will-change: transform;
}

.card {
  width: 280px;
  height: 380px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(12px);
  shrink: 0;
}

.card-img {
  width: 100%;
  height: 75%;
  border-radius: 14px;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-cover: cover;
}

.card-copy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
}

/* Custom Scrollbar for horizontal timeline & modal */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(196, 181, 253, 0.3);
  border-radius: 999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(196, 181, 253, 0.6);
}
`;
