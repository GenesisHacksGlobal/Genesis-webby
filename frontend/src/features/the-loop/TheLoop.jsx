import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const LOOP_PILLARS = [
  {
    id: "forge",
    number: "01",
    phase: "PHASE 01 // ARCHITECT & CODE",
    title: "FORGE",
    subtitle: "Ideate & Construct",
    description:
      "Transform ambitious concepts into functional high-performance code. Access edge tooling, hardware crates, and 1-on-1 mentor guidance.",
    tags: ["36H Hackathon", "Hardware Crates", "Mentor Support"],
    accentColor: "from-cyan-500/20 via-blue-500/10 to-transparent",
    borderGlow: "group-hover:border-cyan-400/40 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    iconColor: "text-cyan-400",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    details: [
      "24/7 dedicated engineering mentors from top tech leaders",
      "Free cloud compute credits, hardware sensors & dev boards",
      "Rapid prototyping workshops & production template boilerplates"
    ]
  },
  {
    id: "launch",
    number: "02",
    phase: "PHASE 02 // DEMO & DEPLOY",
    title: "LAUNCH",
    subtitle: "Ship to Production",
    description:
      "Deploy live applications directly in front of thousands of peers, industry leaders, and venture capitalists under real pressure.",
    tags: ["Live Stage Pitch", "VC Judging Panel", "Public Showcase"],
    accentColor: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderGlow: "group-hover:border-purple-400/40 group-hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    iconColor: "text-purple-400",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    details: [
      "Direct 5-minute mainstage pitch for top finalist projects",
      "Instant deployment pipelines & custom staging environment allocation",
      "Real-time feedback from accredited seed investors & tech founders"
    ]
  },
  {
    id: "scale",
    number: "03",
    phase: "PHASE 03 // FUND & ELEVATE",
    title: "SCALE",
    subtitle: "Accelerate & Monetize",
    description:
      "Turn hackathon prototypes into funded startups. Secure equity-free grant funding, accelerator admission, and high-tier engineering roles.",
    tags: ["$50,000+ Prizes", "VC Incubation", "Career Pathways"],
    accentColor: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderGlow: "group-hover:border-emerald-400/40 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    iconColor: "text-emerald-400",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    details: [
      "Fast-tracked admission into premier incubator & accelerator cohorts",
      "Non-dilutive cash grants and sponsor bounty prize distributions",
      "Direct recruiter matching with top AI, Web3 & cloud engineering firms"
    ]
  }
];

/**
 * Modernized Genesis Builder Loop — Replaces generic Learn/Earn/Grow
 * with an interactive 3-pillar engineering architecture (FORGE / LAUNCH / SCALE).
 */
export default function TheLoop({
  heading = "BUILD / SHIP / SCALE.",
  subtitle = "The continuous execution loop for builders who turn code into reality.",
}) {
  const headingRef = useRef(null);
  const bodyRef = useRef(null);
  const [selectedPillar, setSelectedPillar] = useState(null);

  useEffect(() => {
    const hEl = headingRef.current;
    const bEl = bodyRef.current;
    if (hEl) gsap.set(hEl, { opacity: 0, y: "50%", scale: 0.7 });
    if (bEl) gsap.set(bEl, { opacity: 0, y: "20%" });
  }, []);

  return (
    <section
      id="loop"
      data-seq-reveal
      className="relative z-[45] min-h-[100vh] w-full bg-[#121214] text-white overflow-hidden"
      aria-label="The Loop"
    >
      {/* Background Ambient Glow Nodes */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-purple-900/15 via-blue-900/10 to-emerald-900/15 blur-[120px] opacity-70" />
        <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/5 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-[90px]" />
      </div>

      {/* Cybernetic Technical Grid Accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 md:px-10 py-24">
        {/* Top Status Badge */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md text-xs font-mono tracking-widest text-white/70 uppercase">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>GENESIS // RECURSIVE BUILDER LOOP</span>
        </div>

        {/* Main Header Container */}
        <div className="flex max-w-[32ch] flex-col items-center text-center">
          <h2
            ref={headingRef}
            data-seq-reveal-heading
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[85px] tracking-tight leading-[0.96] text-white will-change-transform uppercase"
          >
            {heading === "Learn / Earn / Grow." || heading === "BUILD / SHIP / SCALE." ? (
              <>
                BUILD <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2efba] to-[#c4b5fd]">/</span> SHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c4b5fd] to-[#4DA2FF]">/</span> SCALE.
              </>
            ) : (
              heading
            )}
          </h2>

          <div
            ref={bodyRef}
            data-seq-reveal-body
            className="mt-6 flex flex-col items-center gap-5 max-w-[44ch] will-change-transform"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/65 leading-relaxed font-sans font-light">
              {subtitle}
            </p>

            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/40">
              <span className="text-cyan-300/80">01. FORGE</span>
              <span className="h-[1px] w-6 bg-white/20" />
              <span className="text-purple-300/80">02. LAUNCH</span>
              <span className="h-[1px] w-6 bg-white/20" />
              <span className="text-emerald-300/80">03. SCALE</span>
            </div>
          </div>
        </div>

        {/* 3 Pillar Builder Cards Grid */}
        <div className="mt-16 grid w-full max-w-[1240px] gap-6 md:grid-cols-3">
          {LOOP_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => setSelectedPillar(pillar)}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.06] ${pillar.borderGlow} cursor-pointer`}
            >
              {/* Card Gradient Flash on Hover */}
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${pillar.accentColor} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              {/* Technical Corner Crosshairs */}
              <span className="absolute top-3 left-3 text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors">+</span>
              <span className="absolute top-3 right-3 text-[10px] font-mono text-white/20 group-hover:text-white/40 transition-colors">+</span>

              <div>
                {/* Header Row: Phase Badge & Icon */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider font-medium ${pillar.badgeColor}`}
                  >
                    {pillar.phase}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-white/[0.05] border border-white/10 ${pillar.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {pillar.icon}
                  </div>
                </div>

                {/* Pillar Title */}
                <div className="mb-2">
                  <span className="font-mono text-xs text-white/35 uppercase tracking-widest">{pillar.number} // {pillar.subtitle}</span>
                  <h3 className="font-display text-3xl md:text-4xl tracking-tight text-white mt-1 group-hover:text-white transition-colors">
                    {pillar.title}.
                  </h3>
                </div>

                {/* Pillar Description */}
                <p className="text-sm md:text-base text-white/60 leading-relaxed font-sans font-light mt-3">
                  {pillar.description}
                </p>
              </div>

              {/* Footer Row: Tags & Action Arrow */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {pillar.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-mono text-white/50 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                  <span>EXPAND</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Pillar Detail Modal */}
      <AnimatePresence>
        {selectedPillar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPillar(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/15 bg-[#18181c] p-7 sm:p-10 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPillar(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.12] transition-colors"
                aria-label="Close detail modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs uppercase tracking-wider font-medium ${selectedPillar.badgeColor}`}>
                  {selectedPillar.phase}
                </span>
                <span className="font-mono text-xs text-white/40">{selectedPillar.subtitle}</span>
              </div>

              <h3 className="font-display text-4xl sm:text-5xl text-white tracking-tight">
                {selectedPillar.title}.
              </h3>

              <p className="mt-4 text-base text-white/70 leading-relaxed font-sans font-light">
                {selectedPillar.description}
              </p>

              {/* Detail Items List */}
              <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                <div className="font-mono text-xs uppercase tracking-widest text-white/40 mb-2">Key Execution Highlights</div>
                {selectedPillar.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${selectedPillar.iconColor.replace('text-', 'bg-')}`} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {selectedPillar.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-xs text-white/80 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="btn-cinema btn-cinema--nav"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
