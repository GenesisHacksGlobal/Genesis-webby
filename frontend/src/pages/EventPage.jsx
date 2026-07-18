import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { SAMVEDNA_PHOTOS, NO_AGENDA_1_PHOTOS } from "@/data/mediaAssets";

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

export default function WorkSection({ cards = defaultCards }) {
  const workSectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const letterRefs = useRef([]);

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
      const dpr = window.devicePixelRatio || 1;
      gridCanvas.width = window.innerWidth * dpr;
      gridCanvas.height = window.innerHeight * dpr;
      gridCanvas.style.width = `${window.innerWidth}px`;
      gridCanvas.style.height = `${window.innerHeight}px`;
      gridCtx.scale(dpr, dpr);
    };

    const drawGrid = (scrollProgress = 0) => {
      gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      gridCtx.fillStyle = "#080212"; // Match deep theme color
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

    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    lettersRenderer.setClearColor(0x000000, 0);
    lettersRenderer.setPixelRatio(window.devicePixelRatio);
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

        // Snap instantly if transitioning across wrap-around boundaries
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

    let animationFrameId;
    const animate = () => {
      updateLetterPositions();
      updateCardsPosition();
      lettersRenderer.render(lettersScene, lettersCamera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // Initial setup
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
        drawGrid(self.progress);
      },
    });

    updateTargetPositions(0);
    animate();

    const handleResize = () => {
      const progress = workTrigger ? workTrigger.progress : 0;
      resizeGridCanvas();
      drawGrid(progress);
      
      lettersCamera.aspect = window.innerWidth / window.innerHeight;
      lettersCamera.updateProjectionMatrix();
      lettersRenderer.setSize(window.innerWidth, window.innerHeight);
      
      updateTargetPositions(progress);
    };

    window.addEventListener("resize", handleResize);

    // Garbage Collection / Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      workTrigger.kill();
      lenis.destroy();
      gsap.ticker.remove(tickerHandler);
      
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

  return (
    <div className="work-section-wrapper">
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      
      <section className="intro flex flex-col items-center justify-center relative min-h-screen text-center px-4">
        {/* Floating Back to Home button */}
        <div className="absolute top-8 left-8 z-50">
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/10 bg-black/40 hover:bg-white/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text)] transition-all rounded hover:border-white/20 backdrop-blur-md"
          >
            ← Home
          </Link>
        </div>
        
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <span className="overline tracking-[0.3em] text-[var(--brand)]">Genesis Community</span>
          <h1 className="font-display text-6xl md:text-8xl tracking-tighter text-[var(--heading)]">
            EVENTS
          </h1>
          <p className="font-sans text-[var(--text-dim)] max-w-lg mt-4 leading-relaxed">
            Scroll down to explore our interactive chronological line-up, guest panels, and community workshops.
          </p>
          <div className="mt-8 animate-bounce font-mono text-xs text-[var(--text-faint)] uppercase tracking-widest">
            Scroll to explore ↓
          </div>
        </div>
      </section>
      
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
                <img src={card.img} alt={card.title} />
              </div>
              <div className="card-copy">
                <p>{card.title}</p>
                <p>{card.id}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="outro flex flex-col items-center justify-center relative min-h-screen text-center px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <h2 className="font-display text-5xl md:text-7xl tracking-tighter text-[var(--heading)] uppercase">
            Be part of the next chapter.
          </h2>
          <p className="font-sans text-[var(--text-dim)] max-w-md mt-4 leading-relaxed">
            Whether you want to speak, host, or sponsor, there's always space for you.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              to="/"
              className="btn-cinema"
            >
              Back to Home
            </Link>
            <a
              href="https://luma.com/6nxec8uw?tk=Cw5Fsi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Join Next Meetup
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const cssContent = `
.work-section-wrapper {
  background-color: var(--bg);
  overflow-x: hidden;
  width: 100vw;
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

.work-section-wrapper section {
  position: relative;
  width: 100vw;
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

.work-section-wrapper .intro h1,
.work-section-wrapper .outro h1 {
  font-family: var(--font-display), sans-serif;
  font-size: 5vw;
  font-weight: 800;
  text-transform: uppercase;
}

.work-section-wrapper .work {
  background-color: #080212;
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
`;
