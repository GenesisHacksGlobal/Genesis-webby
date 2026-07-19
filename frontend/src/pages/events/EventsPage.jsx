import React, { useEffect, useRef, useState } from 'react';
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
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop"
  ];
  const workshopImages = [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop"
  ];
  const meetupImages = [
    "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop"
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
  .map((e, index) => ({
    ...e,
    img: getCategoryImageUrl(e.category, index)
  }));

export default function WorkSection({ cards = defaultCards }) {
  const workSectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const letterRefs = useRef([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Selected event for the detail modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Visualizer expand state
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

  // Reset refs on each render to avoid stale references
  letterRefs.current = [];

  useEffect(() => {
    const workSection = workSectionRef.current;
    const textContainer = textContainerRef.current;
    const cardsContainer = cardsContainerRef.current;
    if (!workSection || !textContainer || !cardsContainer) return;

    // Initialize Lenis scroll smoothing
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

    const moveDistance = window.innerWidth * 5;
    let currentXPosition = 0;
    let targetXPosition = 0;

    const lerp = (start, end, t) => start * (1 - t) + end * t;

    // ----- Canvas Grid -----
    const gridCanvas = document.createElement("canvas");
    gridCanvas.id = "grid-canvas";
    workSection.appendChild(gridCanvas);
    const gridCtx = gridCanvas.getContext("2d");

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
      gridCtx.fillStyle = "#131313"; // Match deep theme color
      gridCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      gridCtx.fillStyle = "rgba(196, 181, 253, 0.35)"; // Accent/brand color dots

      const dotSize = 1;
      const spacing = 30;
      const rows = Math.ceil(window.innerHeight / spacing);
      const cols = Math.ceil(window.innerWidth / spacing) + 15;

      const offset = (scrollProgress * spacing * 10) % spacing;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath();
          gridCtx.arc(
            x * spacing - offset,
            y * spacing,
            dotSize,
            0,
            Math.PI * 2
          );
          gridCtx.fill();
        }
      }
    };

    // ----- THREE.JS Setup -----
    const lettersScene = new THREE.Scene();
    const lettersCamera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    lettersCamera.position.z = 20;

    const isCoarse = window.matchMedia?.("(pointer: coarse)")?.matches;
    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: !isCoarse,
      alpha: true,
      powerPreference: isCoarse ? "default" : "high-performance",
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    lettersRenderer.domElement.id = "letters-canvas";
    workSection.appendChild(lettersRenderer.domElement);

    // ----- Animated Text Paths -----
    const createTextAnimationPath = (yPos, amplitude) => {
      const points = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
          )
        );
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 })
      );
      line.curve = curve;
      return line;
    };

    const paths = [
      createTextAnimationPath(7.5, 1.5),
      createTextAnimationPath(2.5, 0.8),
      createTextAnimationPath(-2.5, 0.8),
      createTextAnimationPath(-7.5, 1.5),
    ];

    paths.forEach(line => lettersScene.add(line));

    const lettersPositions = new Map();
    const lettersList = ["E", "V", "E", "N", "T", "S"];
    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9];

    // Map DOM elements to paths & initialize positions
    paths.forEach((line, pathIndex) => {
      line.letterElements = [];
      lettersList.forEach((char, letterIndex) => {
        const elIdx = pathIndex * lettersList.length + letterIndex;
        const el = letterRefs.current[elIdx];
        if (el) {
          line.letterElements.push(el);
          lettersPositions.set(el, {
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 }
          });
        }
      });
    });

    const updateTargetPositions = (scrollProgress) => {
      paths.forEach((line, index) => {
        line.letterElements.forEach((el, i) => {
          const point = line.curve.getPoint(
            (i / 14 + scrollProgress * lineSpeedMultipliers[index]) % 1
          );
          const vector = point.clone().project(lettersCamera);
          const position = lettersPositions.get(el);
          if (position) {
            position.target = {
              x: (vector.x * 0.5 + 0.5) * window.innerWidth,
              y: (vector.y * -0.5 + 0.5) * window.innerHeight
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
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeGridCanvas();
    drawGrid(0);

    const workTrigger = ScrollTrigger.create({
      trigger: workSection,
      start: "top top",
      end: "+=700%",
      pin: true,
      scrub: 1,
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
      resizeGridCanvas();
      drawGrid(progress);
      
      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      lettersRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      
      updateTargetPositions(progress);
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
      
      if (gridCanvas.parentNode) {
        gridCanvas.parentNode.removeChild(gridCanvas);
      }
      if (lettersRenderer.domElement.parentNode) {
        lettersRenderer.domElement.parentNode.removeChild(lettersRenderer.domElement);
      }
      
      lettersRenderer.dispose();
      paths.forEach(line => {
        line.geometry.dispose();
        line.material.dispose();
      });
    };
  }, [cards]);

  const pathsCount = 4;
  const lettersList = ["E", "V", "E", "N", "T", "S"];
  const categories = ["All", ...new Set(cleanEvents.map(e => e.category))];

  // Filtering Logic
  const filteredEvents = cleanEvents.filter(event => {
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.sponsors && event.sponsors.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const bentoLimit = 8;
  const bentoEvents = filteredEvents.slice(0, bentoLimit);
  const timelineEvents = filteredEvents.slice(bentoLimit);

  return (
    <div className="work-section-wrapper">
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      
      {/* Intro Header */}
      <section className="intro flex flex-col items-center justify-center relative min-h-screen text-center px-4 overflow-hidden">
        <div className="intro-spiral-container">
          <SpiralImages images={GALLERY_PHOTOS} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/30 via-transparent to-[#131313] pointer-events-none z-[1]" />
        
        <div className="absolute top-8 left-8 z-50">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/10 bg-black/40 hover:bg-white/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text)] transition-all rounded hover:border-white/20 backdrop-blur-md"
          >
            â† Home
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <span className="overline tracking-[0.3em] text-[var(--brand)]">Genesis Community</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-[var(--heading)] animate-pulse">
            EVENTS
          </h1>
          <p className="font-sans text-[var(--text-dim)] max-w-lg mt-4 leading-relaxed">
            Scroll down to explore our interactive chronological line-up, guest panels, and community workshops.
          </p>
          <div className="mt-8 animate-bounce font-mono text-xs text-[var(--text-faint)] uppercase tracking-widest">
            Scroll to explore â†“
          </div>
        </div>
      </section>
      
      {/* 3D Scroll Gallery */}
      <section className="work" ref={workSectionRef}>
        <div className="text-container" ref={textContainerRef}>
          {Array.from({ length: pathsCount }).map((_, pathIndex) => (
            <React.Fragment key={pathIndex}>
              {lettersList.map((char, letterIndex) => (
                <div
                  key={letterIndex}
                  className="letter"
                  ref={(el) => {
                    if (el) {
                      letterRefs.current.push(el);
                    }
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
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="card-copy">
                <p>{card.title}</p>
                <p>{card.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Event Gallery Section */}
      <section className="bento-section relative z-20 w-full border-t border-white/10 py-12 sm:py-16 md:py-20">
        <div className="bento-container max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 w-full">
          <div className="mb-8 flex flex-col justify-between gap-6 sm:mb-12 md:mb-16 md:flex-row md:items-end md:gap-8">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <span className="block h-px w-6 bg-[var(--brand)] animate-pulse" />
                <span className="overline text-[var(--brand)]">Curated Bento Layout</span>
              </div>
              <h2 className="font-display text-[clamp(1.75rem,6vw,3.75rem)] leading-[1.05] tracking-tight text-[var(--heading)]">
                THE BENTO GALLERY
              </h2>
            </div>
            
            {/* Bento Search HUD */}
            <div className="relative w-full shrink-0 md:max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-widest text-[var(--text-faint)] sm:left-4 sm:text-[10px]">
                [ FIND ]
              </span>
              <input
                type="search"
                placeholder="Search title, venue, sponsors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded border border-white/10 bg-black/45 py-3 pl-[4.5rem] pr-14 font-sans text-xs tracking-wide text-[var(--text)] outline-none transition-all duration-300 placeholder:text-white/20 focus:border-[var(--brand)] sm:py-3.5 sm:pl-24 sm:pr-12 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 min-h-9 min-w-9 -translate-y-1/2 font-mono text-[10px] text-[var(--brand)] transition-colors hover:text-white sm:right-4"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Bento Category HUD — scrollable on small screens */}
          <div className="bento-category-hud mb-8 sm:mb-10 md:mb-12">
            <div className="bento-category-track">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`shrink-0 rounded border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 sm:px-5 ${
                      isActive 
                        ? "border-[var(--brand)] bg-[var(--brand)] font-bold text-[#181818] shadow-[0_0_20px_rgba(196,181,253,0.35)]" 
                        : "border-white/10 bg-transparent text-[var(--text-dim)] hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {cat}s
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bento Grid */}
          <motion.div 
            layout
            className="bento-grid"
          >
            {/* Static Stats Bento Block */}
            <motion.div
              layout
              className="bento-cell bento-small bento-stats flex flex-col justify-between border border-dashed border-white/20 bg-white/[0.01] p-4 sm:p-5 md:p-6 rounded"
            >
              <div className="font-mono text-[9px] tracking-widest text-[var(--text-faint)]">[ COMMUNITY SCOPE ]</div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-0 md:contents">
                <div>
                  <div className="mb-1 font-display text-3xl leading-none text-[var(--brand)] sm:text-4xl">50+</div>
                  <div className="font-sans text-[10px] uppercase tracking-wider text-[var(--text-dim)]">Total Hosted Events</div>
                </div>
                <div>
                  <div className="mb-1 font-display text-3xl leading-none text-[var(--heading)] sm:text-4xl">10k+</div>
                  <div className="font-sans text-[10px] uppercase tracking-wider text-[var(--text-dim)]">Attendees Connected</div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="popLayout">
              {bentoEvents.map((event, idx) => {
                // Assign layout spans: index 0 featured, 3/8 wide, 2/7 tall
                let bentoClass = "bento-small";
                if (idx === 0) {
                  bentoClass = "bento-featured";
                } else if (idx === 3 || idx === 8) {
                  bentoClass = "bento-wide";
                } else if (idx === 2 || idx === 7) {
                  bentoClass = "bento-tall";
                }
                
                const isFeatured = bentoClass === "bento-featured";
                const isWide = bentoClass === "bento-wide";
                const isTall = bentoClass === "bento-tall";

                return (
                  <motion.div
                    layout
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setSelectedEvent(event)}
                    className={`bento-cell ${bentoClass} group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded border border-white/10 bg-white/[0.01] p-4 backdrop-blur-md transition-all duration-300 hover:border-[var(--brand)] hover:bg-white/[0.02] sm:p-5 md:p-6`}
                  >
                    {/* Scanner line animation overlay */}
                    <div className="scanner-line" />
                    
                    {/* Background Image for Tall / Featured / Wide cards */}
                    {(isFeatured || isTall || isWide) && (
                      <div className="absolute inset-0 z-0 overflow-hidden opacity-15 transition-opacity duration-500 group-hover:opacity-25">
                        <img
                          src={event.img}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/50 to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 min-w-0">
                      <div className="mb-2 flex items-center justify-between gap-2 sm:mb-3">
                        <span className="shrink-0 font-mono text-[9px] text-[var(--text-faint)]">#{event.id}</span>
                        <span className="max-w-[60%] truncate text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border border-white/10 rounded text-[var(--brand)] bg-black/40">
                          {event.category}
                        </span>
                      </div>

                      <h3 className={`mb-2 font-display uppercase leading-tight tracking-tight text-white ${
                        isFeatured
                          ? "text-[clamp(1.35rem,4vw,2.25rem)] text-[var(--heading)]"
                          : "text-base transition-colors group-hover:text-[var(--heading)] sm:text-lg md:text-xl"
                      }`}>
                        {event.title}
                      </h3>

                      {/* Description: featured always; wide from sm up */}
                      {isFeatured && (
                        <p className="mb-3 line-clamp-2 max-w-xl font-sans text-xs leading-relaxed text-[var(--text-dim)] sm:mb-4 md:line-clamp-3">
                          A dynamic gathering focusing on collaboration, code, and design innovation. Explore the next-generation developer sandbox.
                        </p>
                      )}
                      {isWide && (
                        <p className="mb-3 hidden max-w-xl font-sans text-xs leading-relaxed text-[var(--text-dim)] line-clamp-2 sm:mb-4 sm:block md:line-clamp-3">
                          A dynamic gathering focusing on collaboration, code, and design innovation. Explore the next-generation developer sandbox.
                        </p>
                      )}
                    </div>

                    <div className="relative z-10 flex items-end justify-between gap-3 border-t border-white/5 pt-3 font-mono text-[9px] text-[var(--text-faint)] sm:pt-4">
                      <div className="min-w-0">
                        <span className="block uppercase tracking-wider">{event.date}</span>
                        <span className="block truncate font-sans text-[10px] text-[var(--text-dim)]">{event.location}</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-[var(--brand)] transition-transform group-hover:translate-x-1">
                        DETAILS â†’
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {bentoEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full rounded border border-dashed border-white/10 bg-white/[0.01] px-4 py-14 text-center sm:py-20"
              >
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-faint)]">
                  No records found matching query.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* View More Option */}
          {!isVisualizerOpen && filteredEvents.length > bentoLimit && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setIsVisualizerOpen(true)}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 font-mono text-xs uppercase tracking-widest text-white border border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-[var(--brand)] transition-all duration-300 rounded shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(196,181,253,0.15)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  EXPLORE ALL EVENTS (CHRONOLOGICAL FEED)
                  <span className="inline-block transition-transform duration-300 group-hover:translate-y-1">â†“</span>
                </span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--brand)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded" />
              </button>
            </div>
          )}

          {/* Timeline Visualizer */}
          {isVisualizerOpen && timelineEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="timeline-visualizer-container mt-16 pt-16 border-t border-white/5"
            >
              <div className="text-center mb-12">
                <span className="overline text-[var(--brand)] tracking-[0.2em] font-mono text-[9px]">[ CHRONOLOGICAL FEED ]</span>
                <h3 className="font-display text-3xl sm:text-4xl text-white mt-2 uppercase tracking-tight">
                  Event Timeline Flow
                </h3>
                <p className="font-sans text-[var(--text-dim)] text-xs max-w-md mx-auto mt-2">
                  Easily browse through the chronological timeline of workshops, meetups, and hackathons.
                </p>
              </div>

              {/* Vertical Timeline Track */}
              <div className="relative border-l border-white/10 pl-6 ml-4 sm:ml-8 md:pl-10 md:ml-12 space-y-12 py-4">
                {timelineEvents.map((event, idx) => {
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.3) }}
                      className="relative group cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      {/* Timeline Dot/Node */}
                      <span className="absolute -left-[31px] md:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#181818] border border-white/20 transition-all duration-300 group-hover:border-[var(--brand)] group-hover:scale-125 z-10">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-[var(--brand)] group-hover:animate-pulse" />
                      </span>
                      
                      {/* Timeline Card */}
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 sm:p-6 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/15 rounded-lg transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.2)] group-hover:shadow-[0_4px_30px_rgba(196,181,253,0.05)]">
                        <div className="flex-1 min-w-0">
                          {/* Top row: ID, Date, Category */}
                          <div className="flex flex-wrap items-center gap-3 mb-2.5">
                            <span className="font-mono text-[9px] text-[var(--text-faint)]">#{event.id}</span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--brand)]">{event.category}</span>
                            <span className="inline-block h-1 w-1 rounded-full bg-white/10" />
                            <span className="font-sans text-[10px] text-[var(--text-dim)] uppercase tracking-wide">{event.date || "COMMUNITY TIMELINE"}</span>
                          </div>

                          {/* Event Title */}
                          <h4 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white group-hover:text-[var(--heading)] transition-colors duration-300 mb-2">
                            {event.title}
                          </h4>

                          {/* Venue info */}
                          <div className="flex items-center gap-2 font-sans text-xs text-[var(--text-dim)]">
                            <svg className="w-3.5 h-3.5 shrink-0 text-[var(--text-faint)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        {/* Image Preview & details button */}
                        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-white/5 pt-4 md:border-none md:pt-0">
                          {event.sponsors && event.sponsors !== "-" && (
                            <div className="hidden lg:flex flex-col items-end gap-1 mr-4 max-w-[150px]">
                              <span className="font-mono text-[8px] text-[var(--text-faint)] uppercase">[ PARTNERS ]</span>
                              <span className="font-sans text-[10px] text-[var(--text-dim)] truncate text-right w-full">{event.sponsors}</span>
                            </div>
                          )}

                          <div className="aspect-[4/3] w-16 sm:w-20 overflow-hidden border border-white/10 rounded bg-black/40 relative">
                            <img src={event.img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                          </div>

                          <span className="font-mono text-[10px] text-[var(--brand)] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                            DETAILS <span aria-hidden>â†’</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Collapse Button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => {
                    setIsVisualizerOpen(false);
                    const bentoHeader = document.querySelector('.bento-section');
                    if (bentoHeader) {
                      bentoHeader.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--text-dim)] hover:text-white border border-white/10 hover:border-white/30 bg-transparent transition-all rounded"
                >
                  Collapse Timeline â†‘
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Details Modal Overlay */}
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
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl bg-[#1c1c1c] border border-white/15 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_80px_rgba(139,92,246,0.25)] flex flex-col gap-5"
              >
                {/* Header Top Bar */}
                <div className="flex items-start justify-between gap-4 w-full pt-2">
                  <div className="flex flex-col gap-2 min-w-0 pr-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-[var(--brand)] text-[#040114] font-bold rounded">
                        {selectedEvent.category}
                      </span>
                      <span className="font-mono text-xs text-white/50">{selectedEvent.date || "COMMUNITY EVENT"}</span>
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl text-white tracking-tight uppercase leading-tight mt-1">
                      {selectedEvent.title}
                    </h3>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute right-5 top-5 shrink-0 text-white/60 hover:text-white font-mono text-xs tracking-wider px-3 py-1.5 border border-white/15 hover:border-white/40 rounded-lg bg-white/5 transition-all hover:scale-105"
                  >
                    âœ• CLOSE
                  </button>
                </div>

                {/* Event Image Banner */}
                <div className="relative w-full max-h-56 sm:max-h-64 overflow-hidden rounded-xl border border-white/10 shadow-lg shrink-0">
                  <img 
                    src={selectedEvent.img} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/80 via-transparent to-transparent" />
                </div>

                {/* Metadata HUD Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] text-[var(--brand)] uppercase tracking-wider block mb-1">[ VENUE / LOCATION ]</span>
                    <p className="font-sans text-xs sm:text-sm text-white font-medium">{selectedEvent.location}</p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] text-[var(--brand)] uppercase tracking-wider block mb-1">[ ATTENDANCE RECORD ]</span>
                    <p className="font-sans text-xs sm:text-sm text-white font-medium">
                      {isUrl(selectedEvent.attendees) ? (
                        <a href={selectedEvent.attendees} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline">
                          VIEW ATTENDEES â†—
                        </a>
                      ) : (selectedEvent.attendees || "COMMUNITY OPEN")}
                    </p>
                  </div>
                </div>

                {/* Partners / Sponsors */}
                {selectedEvent.sponsors && selectedEvent.sponsors !== "-" && (
                  <div className="bg-white/[0.03] border border-white/10 p-3.5 rounded-xl">
                    <span className="font-mono text-[9px] text-[var(--brand)] uppercase tracking-wider block mb-2">[ SPONSORS & PARTNERS ]</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEvent.sponsors.split(",").map((s, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-white/90 rounded-md"
                        >
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto">
                  {externalLink ? (
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 text-center font-mono text-xs uppercase tracking-wider text-[#040114] bg-[var(--brand)] hover:bg-white font-bold rounded-xl shadow-lg transition-all text-center"
                    >
                      OPEN LINK â†—
                    </a>
                  ) : (
                    <button className="flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider text-white/40 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed text-center">
                      NO RECORD LINK
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 py-3 px-4 font-mono text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-all text-center"
                  >
                    BACK TO GALLERY
                  </button>
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

const cssContent = `
.work-section-wrapper {
  background-color: var(--bg);
  overflow-x: hidden;
  width: 100%;
}

.work-section-wrapper * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.work-section-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-section-wrapper section.intro,
.work-section-wrapper section.work {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.work-section-wrapper .intro,
.work-section-wrapper .outro {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--bg);
  color: var(--text);
}

.work-section-wrapper .intro-spiral-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.55;
  pointer-events: none;
}

.work-section-wrapper .intro h1,
.work-section-wrapper .outro h1 {
  font-family: var(--font-display), sans-serif;
  font-size: 5vw;
  font-weight: 800;
  text-transform: uppercase;
}

.work-section-wrapper .work {
  background-color: #131313;
  overflow: hidden;
  position: relative;
}

.work-section-wrapper canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.work-section-wrapper #letters-canvas {
  z-index: 1;
}

.work-section-wrapper .text-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
  perspective: 2500px;
  perspective-origin: center;
}

.work-section-wrapper .letter {
  position: absolute;
  font-family: var(--font-display), sans-serif;
  font-size: 14rem;
  font-weight: 800;
  color: var(--heading);
  z-index: 2;
  transform-origin: center;
  transform-style: preserve-3d;
  will-change: transform;
}

.work-section-wrapper .cards {
  position: relative;
  width: 500vw;
  height: 100vh;
  padding-left: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 10;
}

.work-section-wrapper .card {
  width: 10%;
  height: 50%;
  padding: 8px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.work-section-wrapper .card-img {
  flex: 1;
  overflow: hidden;
}

.work-section-wrapper .card-copy {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  text-transform: uppercase;
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  color: var(--brand);
}

.work-section-wrapper section.bento-section {
  width: 100% !important;
  max-width: none !important;
  min-height: auto;
  height: auto !important;
  position: relative;
  z-index: 20;
  overflow: visible !important;
  box-sizing: border-box;
  margin: 0 !important;
}

/* Category chips: clean HUD layout */
.bento-category-hud {
  width: 100%;
}

@media (min-width: 640px) {
  .bento-category-hud {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
}

.bento-category-track {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.5rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 0.25rem;
}

.bento-category-track::-webkit-scrollbar {
  display: none;
}

@media (min-width: 768px) {
  .bento-category-track {
    flex-wrap: wrap;
    overflow: visible;
    padding-bottom: 0;
  }
}

/* Bento Grid System — mobile first */
.bento-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.875rem;
  width: 100%;
  min-width: 0;
}

.bento-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  min-width: 0;
  width: 100%;
  min-height: 11.5rem;
  height: auto;
  grid-column: span 1;
  grid-row: span 1;
}

.bento-featured {
  min-height: 16.5rem;
}

.bento-wide,
.bento-tall {
  min-height: 13rem;
}

.bento-stats {
  min-height: 10.5rem;
}

/* Small tablets: 2 equal columns, no multi-span (avoids broken layouts) */
@media (min-width: 640px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .bento-cell {
    min-height: 12.5rem;
  }

  .bento-featured {
    grid-column: span 2;
    min-height: 18rem;
  }

  .bento-wide {
    grid-column: span 2;
    min-height: 13.5rem;
  }
}

/* Tablets+: true bento spans + fixed row rhythm */
@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: minmax(220px, auto);
    grid-auto-flow: dense;
    gap: 1.25rem;
  }

  .bento-cell {
    min-height: 0;
    height: auto;
  }

  .bento-small,
  .bento-stats {
    grid-column: span 1;
    grid-row: span 1;
  }

  .bento-featured {
    grid-column: span 2;
    grid-row: span 2;
    min-height: 0;
  }

  .bento-wide {
    grid-column: span 2;
    grid-row: span 1;
    min-height: 0;
  }

  .bento-tall {
    grid-column: span 1;
    grid-row: span 2;
    min-height: 0;
  }
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: minmax(230px, auto);
    gap: 1.35rem;
  }

  .bento-featured {
    grid-column: span 2;
    grid-row: span 2;
  }

  .bento-wide {
    grid-column: span 2;
    grid-row: span 1;
  }

  .bento-tall {
    grid-column: span 1;
    grid-row: span 2;
  }
}

@media (min-width: 1280px) {
  .bento-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: minmax(240px, auto);
    gap: 1.5rem;
  }
}

/* Very narrow phones */
@media (max-width: 379px) {
  .bento-cell {
    min-height: 10.5rem;
  }

  .bento-featured {
    min-height: 14.5rem;
  }
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--brand), transparent);
  opacity: 0;
  pointer-events: none;
  z-index: 5;
}

.bento-cell:hover .scanner-line {
  opacity: 0.5;
  animation: scan-vertical 2s linear infinite;
}

@keyframes scan-vertical {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
`;
