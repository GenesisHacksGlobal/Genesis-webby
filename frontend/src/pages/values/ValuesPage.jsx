import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";

const VALUES = [
  {
    num: "01",
    title: "SHIP WITH CRAFT",
    subhead: "Excellence down to the last detail",
    description:
      "Speed matters, but craft is non-negotiable. We value clean architecture, thoughtful typography, resilient codebases, and interfaces that wow users at first glance.",
    tenet: "A project isn't finished when it runs; it's finished when it's built with pride.",
    accent: "border-cyan-500/30 text-cyan-300"
  },
  {
    num: "02",
    title: "BUILD IN PUBLIC",
    subhead: "Radical transparency & open learning",
    description:
      "We encourage builders to share work-in-progress, open-source their tooling, publish post-mortems, and celebrate unfiltered breakthroughs and failures alike.",
    tenet: "Demystify the journey from zero to one.",
    accent: "border-purple-500/30 text-purple-300"
  },
  {
    num: "03",
    title: "RADICAL INCLUSION",
    subhead: "Merit & passion above credentials",
    description:
      "Elite engineering talent comes from anywhere—self-taught hackers, university dropouts, design obsessives, and veteran developers. Pedigree means nothing; curiosity is everything.",
    tenet: "The terminal treats everyone equally.",
    accent: "border-emerald-500/30 text-emerald-300"
  },
  {
    num: "04",
    title: "NO HYPE, ALL SUBSTANCE",
    subhead: "Deployed products over slides",
    description:
      "We measure progress by working software, compiled hardware, and solved real-world problems—never by vanity metrics, marketing fluff, or pitch decks.",
    tenet: "Show code, don't tell stories.",
    accent: "border-amber-500/30 text-amber-300"
  },
  {
    num: "05",
    title: "PEER-TO-PEER POWER",
    subhead: "Horizontal mentorship & support",
    description:
      "Knowledge flows laterally. The hacker sitting next to you at 2 AM might solve your toughest bug. We cultivate a culture where every builder lifts others as they climb.",
    tenet: "Collaboration always defeats solo ego.",
    accent: "border-blue-500/30 text-blue-300"
  },
  {
    num: "06",
    title: "LEAVE IT BETTER",
    subhead: "Stewardship of community & space",
    description:
      "We respect our venues, mentors, open-source repositories, and fellow community members. We leave every physical and digital environment stronger than we found it.",
    tenet: "Honor people's time, trust, and energy.",
    accent: "border-rose-500/30 text-rose-300"
  }
];

const CODE_OF_HONOR = [
  {
    title: "Intellectual Honesty",
    text: "Always credit original authors, open-source libraries, and teammates. Plagiarism and stolen work have zero place in our community."
  },
  {
    title: "Constructive Critique",
    text: "Review code and designs with empathy. Challenge ideas vigorously while supporting the person behind the keyboard."
  },
  {
    title: "Zero Ego, Max Curiosity",
    text: "Be eager to say 'I don't know yet, let's figure it out.' Relentless curiosity beats assumed knowledge every single time."
  },
  {
    title: "Safe & Supportive Space",
    text: "We maintain zero tolerance for harassment, discrimination, or gatekeeping of any kind across all online and offline Genesis events."
  }
];

export default function ValuesPage() {
  return (
    <InnerPage
      eyebrow="OUR ETHOS // CORE PRINCIPLES"
      title="The Genesis Code of Principles."
      cta={
        <Link to="/about" className="btn-cinema">
          About Genesis →
        </Link>
      }
    >
      {/* Intro Manifesto */}
      <div className="space-y-6 text-lg sm:text-xl text-[var(--text)] font-light leading-relaxed max-w-[65ch]">
        <p className="text-xl sm:text-2xl text-[var(--heading)] font-normal leading-snug">
          Values aren't just decorative words on a wall — they are the operational standards that govern every hackathon, workshop, and line of code produced within Genesis.
        </p>
        <p className="text-[var(--text-dim)]">
          Whether you're entering your very first 36-hour sprint or scaling a venture-backed startup, these six core tenets guide how we build, collaborate, and grow together.
        </p>
      </div>

      {/* 6 Core Values Bento Grid */}
      <div className="mt-14 space-y-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--heading)]/40" />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--heading)]">
            Our Six Core Tenets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.num}
              className={`group relative p-8 rounded-2xl border border-white/10 bg-white/[0.025] hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`font-mono text-xs uppercase tracking-widest font-semibold ${v.accent}`}>
                    {v.num} // {v.title}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white uppercase tracking-tight mb-1">
                  {v.subhead}
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/65 font-light leading-relaxed">
                  {v.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 font-mono text-xs text-white/50 italic">
                "{v.tenet}"
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Builder Code of Honor Section */}
      <div className="mt-16 space-y-8 pt-12 border-t border-white/10">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[var(--heading)]/40" />
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--heading)]">
            Builder Code of Honor
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {CODE_OF_HONOR.map((item, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
              <h4 className="font-display text-xl text-white uppercase tracking-tight mb-2">
                0{i + 1}. {item.title}
              </h4>
              <p className="text-sm text-white/65 font-light leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA & Quick Links */}
      <div className="mt-14 p-8 rounded-2xl border border-white/15 bg-gradient-to-r from-purple-900/20 via-blue-900/10 to-transparent flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-display text-2xl text-white uppercase tracking-tight">
            Ready to Build With Us?
          </h4>
          <p className="text-sm text-white/60 font-light mt-1">
            Join the next Genesis hackathon or drop into our active developer discord.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/events" className="btn-cinema">
            View Events
          </Link>
        </div>
      </div>
    </InnerPage>
  );
}
