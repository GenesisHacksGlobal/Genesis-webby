import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Catch-all 404 — always shows chrome + a path back home.
 * Never leave unknown URLs on a blank document.
 */
export default function NotFoundPage() {
  const location = useLocation();
  const attempted = location.pathname + location.search;

  return (
    <main
      className="relative z-[3] flex min-h-[100svh] flex-col items-center justify-center bg-[#181818] px-6 py-28 text-center"
      aria-labelledby="not-found-title"
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text-faint)]">
        Error 404
      </p>
      <h1
        id="not-found-title"
        className="mt-6 font-display text-5xl tracking-tight text-[var(--heading)] sm:text-6xl md:text-7xl"
      >
        Page not found.
      </h1>
      <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-[var(--text-dim)] md:text-lg">
        The route{" "}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-sm text-[var(--heading)]">
          {attempted}
        </code>{" "}
        does not exist. It may have moved, or the link is outdated.
      </p>
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link to="/" className="btn-cinema">
          Back to home
          <span aria-hidden>→</span>
        </Link>
        <Link to="/events" className="btn-ghost">
          Browse events
        </Link>
      </div>
    </main>
  );
}
