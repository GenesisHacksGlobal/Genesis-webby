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
    <div className="relative min-h-[100svh] bg-[#181818] text-[var(--text)]">
      <Navbar />
      <main className="relative z-[3] mx-auto max-w-4xl px-6 pb-28 pt-32 md:px-10 md:pt-36">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-faint)]">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-4xl tracking-tight text-[var(--heading)] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <div className="mt-8 max-w-[56ch] space-y-5 text-base leading-relaxed text-[var(--text-dim)] md:text-lg">
          {children}
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          {cta}
          <Link to="/" className="btn-ghost">
            ← Home
          </Link>
        </div>
      </main>
    </div>
  );
}
