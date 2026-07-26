import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";

const METRICS = [
  { value: "5,000+", label: "Active Builders & Hackers", desc: "Developers, hardware creators & designers across India." },
  { value: "$150K+", label: "Grants & Prize Pools", desc: "Non-dilutive cash prizes, cloud credits & incubation pools." },
  { value: "40+", label: "Hackathons & Micro-Builds", desc: "High-density overnight builds, workshops & technical sprints." },
  { value: "12+", label: "Funded Startups Incubated", desc: "Early-stage teams formed at Genesis that raised seed capital." },
];

const PILLARS = [
  {
    num: "01",
    title: "High-Intensity Sprints",
    subtitle: "Real Hardware & Production APIs",
    description: "Our 36-to-48 hour hackathons strip away shallow pitch deck fluff. Teams build real software, compile hardware prototypes, and test live under high-stakes conditions.",
    badge: "Production Code"
  },
  {
    num: "02",
    title: "Direct Mentor Access",
    subtitle: "Senior Engineers & Founders",
    description: "No generic advice. Participants work directly alongside staff engineers, smart contract auditors, and seed founders who troubleshoot bugs in real time.",
    badge: "1-on-1 Guidance"
  },
  {
    num: "03",
    title: "Venture & Seed Pathways",
    subtitle: "From Prototype to Startup",
    description: "Winning projects don't end when the stage lights turn off. We connect breakout teams with venture capital partners, accelerator entry, and ecosystem grants.",
    badge: "Capital & Scale"
  }
];

const TESTIMONIALS = [
  {
    quote: "Genesis isn't just another hackathon. The mentor density and midnight energy helped us turn our hack into a YC-backed startup within 6 months.",
    author: "Aarav Sharma",
    role: "Founder, Synthetix AI (Genesis '24 Winner)"
  },
  {
    quote: "The focus on real execution over vanity slide decks is refreshing. You meet builders who ship production code in 36 hours straight.",
    author: "Neha Kulkarni",
    role: "Staff Engineer & Genesis Mentor"
  }
];

export default function AboutPage() {
  return (
    <InnerPage
      eyebrow="ABOUT GENESIS // ORIGIN & ECOSYSTEM"
      title="Pioneering the Next Generation of Builders."
      cta={
        <Link to="/values" className="btn-cinema">
          Explore Our Values →
        </Link>
      }
    >
      {/* Intro Editorial Copy */}
      <div className="space-y-6 text-lg sm:text-xl text-[var(--text)] font-light leading-relaxed max-w-[65ch]">
        <p className="text-xl sm:text-2xl text-[var(--heading)] font-normal leading-snug">
          Genesis is India's premier builder community — a high-conviction collective of developers, designers, hardware hackers, and founders dedicated to turning bold ideas into shipping software.
        </p>
        <p className="text-[var(--text-dim)]">
          We bring together high-density technical talent into intense, collaborative environments: overnight builds, hands-on architectural workshops, and raw developer gatherings where real work gets done.
        </p>
      </div>

      {/* Metrics Counter Grid */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-8 border-y border-white/10">
        {METRICS.map((m, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md flex flex-col justify-between">
            <div className="font-display text-4xl sm:text-5xl text-[var(--heading)] tracking-tight font-bold">
              {m.value}
            </div>
            <div className="mt-3">
              <div className="font-mono text-xs uppercase tracking-wider text-white/80 font-medium">{m.label}</div>
              <div className="mt-1 font-mono text-[11px] text-white/40">{m.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Story & Philosophy Section */}
      <div className="mt-16 space-y-10">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--heading)]/40" />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--heading)]">
            Our Origin & Philosophy
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
            <h3 className="font-display text-2xl text-[var(--heading)] uppercase tracking-tight">
              The Genesis Spark
            </h3>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed font-light">
              Genesis was created out of frustration with shallow corporate pitch competitions where winning meant having the slickest PowerPoint deck rather than the best codebase.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed font-light">
              We set out to create a sanctuary for true builders—an unfiltered ecosystem where late-night commit logs, hardware wiring, and elegant algorithms are celebrated above all else.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
            <h3 className="font-display text-2xl text-[var(--heading)] uppercase tracking-tight">
              High-Density Culture
            </h3>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed font-light">
              Great things happen when you put 300 passionate engineers in a room with unlimited coffee, high-speed fiber internet, and zero corporate distractions.
            </p>
            <p className="text-sm md:text-base text-[var(--text-dim)] leading-relaxed font-light">
              From early-stage project feedback to finding your future co-founder at 3 AM, Genesis cultivates lifelong friendships and high-conviction ventures.
            </p>
          </div>
        </div>
      </div>

      {/* Ecosystem Pillars Section */}
      <div className="mt-16 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[var(--heading)]/40" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--heading)]">
              Core Program Pillars
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.num}
              className="group relative p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-mono text-xs text-[var(--brand)]">{p.num} // {p.badge}</span>
                </div>
                <h4 className="font-display text-2xl text-white uppercase tracking-tight mb-1">
                  {p.title}
                </h4>
                <p className="font-mono text-xs text-white/40 mb-3">{p.subtitle}</p>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16 space-y-6 pt-10 border-t border-white/10">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--heading)]">
          Words From Our Community
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] italic text-sm md:text-base text-white/70">
              "{t.quote}"
              <div className="mt-4 not-italic font-mono text-xs text-white/90 font-medium">
                — {t.author} <span className="text-white/40">({t.role})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation CTA Links */}
      <div className="mt-12 flex flex-wrap gap-4 items-center font-mono text-xs uppercase tracking-wider text-white/60">
        <span>Explore More:</span>
        <Link to="/events" className="text-[var(--heading)] hover:underline">
          Upcoming Events →
        </Link>
        <span>·</span>
        <Link to="/gallery" className="text-[var(--heading)] hover:underline">
          Photo Archive →
        </Link>
        <span>·</span>
        <Link to="/team" className="text-[var(--heading)] hover:underline">
          Meet The Team →
        </Link>
      </div>
    </InnerPage>
  );
}
