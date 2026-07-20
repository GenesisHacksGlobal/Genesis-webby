import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "@widgets/layout";

/* ─── Helpers ─────────────────────────────────────────────────── */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const ob = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      ob.observe(el);
      return ob;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);

  return active;
}

/* ─── Section component ───────────────────────────────────────── */
function Section({ id, index, title, children }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className="legal-section"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s`,
      }}
    >
      <div className="legal-section-header">
        <span className="legal-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="legal-section-title">{title}</h2>
      </div>
      <div className="legal-section-body">{children}</div>
    </section>
  );
}

/* ─── Main LegalPage ──────────────────────────────────────────── */
export default function LegalPage({ type, sections, lastUpdated }) {
  const location = useLocation();
  const isTerms = type === "terms";
  const sectionIds = sections.map((s) => s.id);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="legal-root">
      <Navbar />

      {/* ── Hero band ───────────────────────────────────────────── */}
      <header className="legal-hero">
        <div className="legal-hero-inner">
          <p className="legal-eyebrow">Genesis — Legal Documents</p>

          {/* Tab switcher */}
          <div className="legal-tabs" role="tablist">
            <Link
              to="/terms"
              role="tab"
              aria-selected={isTerms}
              className={`legal-tab ${isTerms ? "legal-tab--active" : ""}`}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              role="tab"
              aria-selected={!isTerms}
              className={`legal-tab ${!isTerms ? "legal-tab--active" : ""}`}
            >
              Privacy Policy
            </Link>
          </div>

          <h1 className="legal-title">
            {isTerms ? "Terms of Service" : "Privacy Policy"}
          </h1>
          <p className="legal-subtitle">
            {isTerms
              ? "By using Genesis services you agree to these terms. Read carefully."
              : "We respect your data. Here's exactly what we collect and why."}
          </p>
          <div className="legal-meta">
            <span>Last updated: <strong>{lastUpdated}</strong></span>
            <span className="legal-meta-sep">·</span>
            <span>Effective immediately</span>
          </div>
        </div>

        {/* decorative grid lines */}
        <div className="legal-hero-grid" aria-hidden />
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="legal-body">
        {/* Sticky TOC */}
        <aside className="legal-toc" aria-label="Table of contents">
          <p className="legal-toc-label">Contents</p>
          <nav>
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`legal-toc-item ${active === s.id ? "legal-toc-item--active" : ""}`}
              >
                <span className="legal-toc-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="legal-toc-text">{s.title}</span>
              </a>
            ))}
          </nav>

          <div className="legal-toc-footer">
            <p>Questions?</p>
            <a href="mailto:[EMAIL_ADDRESS]" className="legal-toc-email">
              [EMAIL_ADDRESS]
            </a>
          </div>
        </aside>

        {/* Content */}
        <main className="legal-content" id="legal-main">
          {sections.map((s, i) => (
            <Section key={s.id} id={s.id} index={i} title={s.title}>
              {s.content}
            </Section>
          ))}

          {/* Footer strip */}
          <div className="legal-end-strip">
            <div className="legal-end-inner">
              <p className="legal-end-label">Still have questions?</p>
              <a href="mailto:hello@dezhub.in" className="btn-cinema">
                Contact Us
              </a>
              <Link
                to={isTerms ? "/privacy" : "/terms"}
                className="btn-ghost"
              >
                {isTerms ? "Read Privacy Policy →" : "Read Terms of Service →"}
              </Link>
            </div>
          </div>
        </main>
      </div>

      <style>{LEGAL_CSS}</style>
    </div>
  );
}

/* ─── Scoped styles ───────────────────────────────────────────── */
const LEGAL_CSS = `
/* Root */
.legal-root {
  min-height: 100svh;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}

/* ── Hero ── */
.legal-hero {
  position: relative;
  padding: 9rem 2.5rem 5rem;
  border-bottom: 1px solid var(--border);
  overflow: hidden;
}
.legal-hero-inner {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
}
.legal-eyebrow {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 2rem;
}

/* Tabs */
.legal-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 2px;
  width: fit-content;
  overflow: hidden;
}
.legal-tab {
  padding: 10px 22px;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  transition: background 250ms ease, color 250ms ease;
}
.legal-tab:hover {
  color: var(--text);
  background: var(--surface);
}
.legal-tab--active {
  background: var(--surface-2);
  color: var(--heading);
  border-right: 1px solid var(--border);
}
.legal-tab--active:last-child {
  border-right: none;
  border-left: 1px solid var(--border);
}

.legal-title {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 8vw, 5.5rem);
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--heading);
  margin: 0 0 1.25rem;
  line-height: 1;
}
.legal-subtitle {
  font-size: 1.05rem;
  color: var(--text-dim);
  max-width: 52ch;
  line-height: 1.7;
  margin: 0 0 1.75rem;
}
.legal-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 12px;
  color: var(--text-faint);
  letter-spacing: 0.04em;
}
.legal-meta strong {
  color: var(--text-dim);
  font-weight: 500;
}
.legal-meta-sep { opacity: 0.4; }

/* Decorative grid */
.legal-hero-grid {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(to right, rgba(196,181,253,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(196,181,253,0.04) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

/* ── Body layout ── */
.legal-body {
  display: grid;
  grid-template-columns: 240px 1fr;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2.5rem;
  gap: 0;
  align-items: start;
}
@media (max-width: 860px) {
  .legal-body { grid-template-columns: 1fr; }
  .legal-toc { display: none; }
}

/* ── TOC ── */
.legal-toc {
  position: sticky;
  top: 6rem;
  padding: 3rem 2rem 3rem 0;
  border-right: 1px solid var(--border);
}
.legal-toc-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin: 0 0 1.25rem;
}
.legal-toc-item {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 7px 0;
  text-decoration: none;
  color: var(--text-faint);
  font-size: 12.5px;
  line-height: 1.45;
  border-left: 2px solid transparent;
  padding-left: 12px;
  margin-left: -12px;
  transition: color 250ms ease, border-color 250ms ease;
}
.legal-toc-item:hover { color: var(--text-dim); }
.legal-toc-item--active {
  color: var(--heading);
  border-left-color: var(--heading);
}
.legal-toc-num {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-faint);
  margin-top: 2px;
  flex-shrink: 0;
  transition: color 250ms ease;
}
.legal-toc-item--active .legal-toc-num { color: var(--heading); }
.legal-toc-text { flex: 1; }

.legal-toc-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--text-faint);
}
.legal-toc-footer p { margin: 0 0 0.4rem; }
.legal-toc-email {
  color: var(--brand);
  text-decoration: none;
  font-size: 12px;
  border-bottom: 1px solid transparent;
  transition: border-color 250ms ease;
}
.legal-toc-email:hover { border-bottom-color: var(--brand); }

/* ── Content ── */
.legal-content {
  padding: 3.5rem 0 3.5rem 3.5rem;
}
@media (max-width: 860px) {
  .legal-content { padding: 2.5rem 0; }
}

/* ── Sections ── */
.legal-section {
  padding: 2.75rem 0;
  border-bottom: 1px solid var(--border);
}
.legal-section:last-of-type { border-bottom: none; }

.legal-section-header {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.legal-index {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--brand);
  flex-shrink: 0;
}
.legal-section-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--heading);
  margin: 0;
  line-height: 1.2;
}

.legal-section-body {
  max-width: 64ch;
}
.legal-section-body p {
  font-size: 0.975rem;
  line-height: 1.8;
  color: var(--text-dim);
  margin: 0 0 1.1rem;
}
.legal-section-body p:last-child { margin-bottom: 0; }
.legal-section-body strong {
  color: var(--text);
  font-weight: 500;
}
.legal-section-body a {
  color: var(--brand);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 250ms ease;
}
.legal-section-body a:hover { border-bottom-color: var(--brand); }

/* List styles */
.legal-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 1rem;
}
.legal-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--text-dim);
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.legal-list li::before {
  content: "—";
  color: var(--brand);
  flex-shrink: 0;
  font-size: 0.8em;
  margin-top: 0.25em;
}

/* Highlight card */
.legal-callout {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--brand);
  border-radius: 2px;
  padding: 1.25rem 1.5rem;
  margin: 1.25rem 0;
  font-size: 0.92rem;
  line-height: 1.75;
  color: var(--text-dim);
}
.legal-callout strong { color: var(--heading); }

/* ── End strip ── */
.legal-end-strip {
  margin-top: 3.5rem;
  padding: 2.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2px;
}
.legal-end-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}
.legal-end-label {
  font-size: 0.9rem;
  color: var(--text-dim);
  margin: 0;
  flex: 1;
}
`;
