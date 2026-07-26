import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@widgets/layout";

/**
 * Minimal inner page chrome for nav destinations (not home sections).
 */
export default function InnerPage({
  eyebrow = "Genesis",
  title,
  children,
  cta,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="relative min-h-[100svh] bg-[#121214] text-[var(--text)] overflow-hidden">
      {/* Background Subtle Mesh */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
      <Navbar />
      <main className="relative z-[3] mx-auto max-w-5xl px-4 sm:px-6 pb-28 pt-32 md:px-10 md:pt-36">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.24em] text-[var(--text-dim)] backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          {eyebrow}
        </div>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-[var(--heading)] sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.98]">
          {title}
        </h1>
        <div className="mt-10 w-full text-base leading-relaxed text-[var(--text-dim)] md:text-lg">
          {children}
        </div>
        <div className="mt-16 flex flex-wrap items-center gap-4 pt-8 border-t border-white/10">
          {cta}
          <Link to="/" className="btn-ghost">
            ← Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
