import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp",
  "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight",
  "ArrowLeft", "ArrowRight",
  "b", "a"
];

const LEET_CODE = ["1", "3", "3", "7"];

// Web Audio API Retro Sound Effects Generator
function playRetroFanfare() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? "square" : "triangle";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.1, ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 0.3);
    });
  } catch {
    // Ignore audio context errors if browser blocks autoplay
  }
}

export default function EasterEggs() {
  const [activeEgg, setActiveEgg] = useState(null); // 'konami' | 'leet' | 'console'
  const [konamiProgress, setKonamiProgress] = useState([]);
  const [leetProgress, setLeetProgress] = useState([]);
  const canvasRef = useRef(null);

  // 1. Listen for Keyboard Easter Eggs (Konami & 1337)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering when user is typing inside an input or textarea
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;

      const key = e.key;

      // Konami Code Tracker
      setKonamiProgress((prev) => {
        const next = [...prev, key.length === 1 ? key.toLowerCase() : key];
        const target = KONAMI_CODE.map(k => k.length === 1 ? k.toLowerCase() : k);

        // Check matching sequence
        const currentMatch = next.slice(-target.length);
        if (currentMatch.join(",") === target.join(",")) {
          setActiveEgg("konami");
          playRetroFanfare();
          return [];
        }
        return next.slice(-12);
      });

      // 1337 Code Tracker
      setLeetProgress((prev) => {
        const next = [...prev, key];
        const currentMatch = next.slice(-LEET_CODE.length);
        if (currentMatch.join("") === LEET_CODE.join("")) {
          setActiveEgg("leet");
          playRetroFanfare();
          return [];
        }
        return next.slice(-6);
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Console DevTools Secret Registration
  useEffect(() => {
    window.genesisSecret = () => {
      setActiveEgg("console");
      playRetroFanfare();
      return "👾 UNLOCKED: Genesis Secret DevTools Vault Activated! Hack the Future! 🚀";
    };

    window.genesis = {
      matrix: () => setActiveEgg("konami"),
      leet: () => setActiveEgg("leet"),
      overclock: () => {
        document.body.classList.add("rgb-overclock");
        setTimeout(() => document.body.classList.remove("rgb-overclock"), 15000);
        return "⚡ RGB Overclock Mode active for 15 seconds!";
      }
    };

    console.log(
      "%c 👾 HEY DEVELOPER! You found the Genesis Secret Console! %c Run window.genesisSecret() or window.genesis.matrix() in console to unlock secret easter eggs! ",
      "background: #c4b5fd; color: #000; font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 4px;",
      "background: #181818; color: #e2efba; font-size: 12px; padding: 4px 8px;"
    );
  }, []);

  // 3. Matrix Digital Rain Canvas Effect
  useEffect(() => {
    if (activeEgg !== "konami" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "GENESIS01010101HACKATHON1337<>{}[]=/+*";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [activeEgg]);

  if (!activeEgg) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
        {/* Matrix Rain Canvas Background */}
        {activeEgg === "konami" && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none opacity-40"
          />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          className="relative max-w-lg w-full bg-[#0a0a0d] border border-[#00ff66]/30 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,255,102,0.2)] text-white text-center space-y-6 overflow-hidden"
        >
          {/* Neon Glow Header */}
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#00ff66] animate-pulse block">
              {activeEgg === "konami" && "🎮 Konami Code Unlocked!"}
              {activeEgg === "leet" && "👾 1337 Elite Hacker Mode!"}
              {activeEgg === "console" && "💻 DevTools Secret Triggered!"}
            </span>

            <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {activeEgg === "konami" && "Genesis Matrix Rain"}
              {activeEgg === "leet" && "Access Granted to Vault"}
              {activeEgg === "console" && "Console Master Found!"}
            </h2>
          </div>

          {/* ASCII Banner Box */}
          <div className="p-4 bg-black/80 border border-white/10 rounded-xl font-mono text-[10px] sm:text-xs text-[#00ff66] text-left overflow-x-auto leading-none">
            <pre>
{`   _____ ______ _  ██████ █ ███████ █  ██████ 
  / ____|  ____| | ██     █ ██      █ ██      
 | |  __| |__  | | ██████ █ ███████ █  ██████ 
 | | |_ |  __| | | ██     █      ██ █      ██ 
 | |__| | |____| | ██████ █ ███████ █ ██████  
  \\_____|______|_|                            `}
            </pre>
          </div>

          <p className="text-xs sm:text-sm text-white/70 font-mono leading-relaxed">
            {activeEgg === "konami" && (
              "You typed ↑ ↑ ↓ ↓ ← → ← → B A! You've unlocked the secret Genesis Matrix Rain overlay & developer status."
            )}
            {activeEgg === "leet" && (
              "You entered 1337! Welcome to the elite hackathon organizers circle. Explore our tools, templates & guides."
            )}
            {activeEgg === "console" && (
              "You executed window.genesisSecret()! You're a true developer who inspects source code. You rock!"
            )}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                document.body.classList.add("rgb-overclock");
                setTimeout(() => document.body.classList.remove("rgb-overclock"), 15000);
                setActiveEgg(null);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase font-bold text-black bg-[#00ff66] hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] cursor-pointer"
            >
              ⚡ Overclock RGB Theme (15s)
            </button>

            <button
              type="button"
              onClick={() => setActiveEgg(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Close Secret
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
