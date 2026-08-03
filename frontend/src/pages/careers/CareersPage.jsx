import React, { useState } from "react";
import Navbar from "@/widgets/layout/Navbar";
import Footer from "@/widgets/layout/Footer";
import WorkWithUsForm from "@/features/forms/WorkWithUsForm";

const STATS = [
  { label: "Hackers Reached", value: "100K+" },
  { label: "Campus Chapters", value: "50+" },
  { label: "Remote Flexibility", value: "100%" },
  { label: "Sheet Sync Response", value: "< 24h" },
];

const CULTURE_VALUES = [
  {
    num: "01",
    title: "High Impact Ownership",
    desc: "You won't be building meaningless boilerplate. You will build platforms, tools, and hackathons experienced by thousands of builders worldwide."
  },
  {
    num: "02",
    title: "Hacker-First Spirit",
    desc: "We value rapid prototyping, shipping early, bold experimentation, and technical curiosity far more than endless meetings."
  },
  {
    num: "03",
    title: "Remote & Asynchronous",
    desc: "Work from wherever you are happiest. We trust our teammates to manage their time, focus on output, and communicate with clarity."
  },
  {
    num: "04",
    title: "Travel & Conference Perks",
    desc: "Fly out to flagship hackathons, tech conferences, and team retreats across the country to connect directly with developer communities."
  }
];

const PERKS = [
  { icon: "💻", title: "Tech Setup Allowance", desc: "Stipend for your laptop, monitors, and ergonomic home office gear." },
  { icon: "✈️", title: "Hackathon Travel", desc: "All expenses covered when attending or hosting Genesis flagship hackathons." },
  { icon: "📚", title: "Learning & Books", desc: "Reimbursements for developer courses, technical books, and subscriptions." },
  { icon: "🌴", title: "Flexible PTO", desc: "Take time off when you need to recharge with zero guilt or micro-management." },
  { icon: "⚡", title: "Internal Hack-Weeks", desc: "Dedicated sprints every quarter where you build whatever wild idea you want." },
  { icon: "🤝", title: "Leadership Mentorship", desc: "Direct 1-on-1 growth track with founders, senior leads, and industry mentors." }
];

const OPEN_ROLES = [
  {
    id: "engineering-lead",
    category: "engineering",
    title: "Lead Fullstack & Systems Engineer",
    type: "Full-Time",
    location: "Remote (Global)",
    desc: "Architect scalable web applications, real-time submission systems, and 3D interactive canvases powering Genesis platform services.",
    tags: ["React", "Node.js", "TailwindCSS", "PostgreSQL"]
  },
  {
    id: "design-principal",
    category: "design",
    title: "Principal UI/UX & Motion Designer",
    type: "Full-Time",
    location: "Remote (Global)",
    desc: "Craft dark-mode glassmorphic visual identities, component design systems, motion graphics, and micro-interactions.",
    tags: ["Figma", "UI/UX", "Three.js", "Design Systems"]
  },
  {
    id: "logistics-head",
    category: "community",
    title: "Head of Hackathon Operations & Logistics",
    type: "Full-Time / Season Lead",
    location: "Hybrid (Pan-India)",
    desc: "Lead physical and digital hackathon execution, venue partnerships, AV infrastructure, catering, and day-of run of show.",
    tags: ["Ops", "Logistics", "Event Mgmt", "Sponsors"]
  },
  {
    id: "campus-lead",
    category: "campus",
    title: "Genesis Campus Ambassador Lead",
    type: "Student / Part-Time",
    location: "Campus-Based",
    desc: "Represent Genesis at your university, organize local student hacker meetups, and run campus workshops.",
    tags: ["Community", "Leadership", "Workshops", "Campus"]
  },
  {
    id: "dev-advocate",
    category: "community",
    title: "Developer Advocate & Content Lead",
    type: "Full-Time",
    location: "Remote (Global)",
    desc: "Create technical tutorials, host mini-events, produce YouTube/Discord content, and engage developer communities.",
    tags: ["DevRel", "Content", "Discord", "YouTube"]
  },
  {
    id: "hackathon-coach",
    category: "community",
    title: "Technical Mentor & Hackathon Coach",
    type: "Season Lead / Part-Time",
    location: "Hybrid",
    desc: "Mentor beginner hackers during 24-48 hour hackathons, troubleshoot project blockers, and guide judging sessions.",
    tags: ["Mentorship", "Debugging", "Judging", "Coaching"]
  }
];

export default function CareersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("engineering");
  const [activeTab, setActiveTab] = useState("all");

  const handleApplyClick = (roleCategory) => {
    setSelectedRole(roleCategory || "engineering");
    setIsFormOpen(true);
  };

  const filteredRoles = activeTab === "all"
    ? OPEN_ROLES
    : OPEN_ROLES.filter(r => r.category === activeTab);

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 max-w-[90rem] mx-auto w-full overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[var(--brand)] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Connect / Work at Genesis
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none">
            Build the Future of <br />
            <span className="text-[var(--brand)]">Hacker Ecosystems</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
            We are a high-velocity, remote-first team of engineers, designers, hackathon operators, and community leads building platforms for the next generation of creators.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleApplyClick("engineering")}
              className="btn-cinema cursor-pointer"
            >
              Apply / General Submission →
            </button>
            <a href="#open-roles" className="btn-ghost">
              Explore Open Roles ↓
            </a>
          </div>
        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10">
          {STATS.map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1">
              <span className="font-display text-3xl sm:text-4xl text-white tracking-tight block">
                {stat.value}
              </span>
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-16 px-4 sm:px-8 max-w-[90rem] mx-auto w-full space-y-12 border-t border-white/10">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
            Our Culture
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Why Build With Genesis?
          </h2>
          <p className="text-sm text-white/60">
            We operate with startup speed and community heart. Here is what you can expect when you join our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CULTURE_VALUES.map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all space-y-3 group relative overflow-hidden"
            >
              <span className="font-mono text-sm text-[var(--brand)] font-bold block">
                {item.num}
              </span>
              <h3 className="font-display text-xl text-white group-hover:text-[var(--brand)] transition-colors uppercase">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks & Benefits Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-[90rem] mx-auto w-full space-y-12 border-t border-white/10 bg-[#121214]">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
            Team Perks & Support
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Designed for Growth & Well-Being
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERKS.map((perk, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-[#181818] space-y-3"
            >
              <div className="text-3xl">{perk.icon}</div>
              <h3 className="font-display text-lg text-white uppercase">{perk.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Roles Section */}
      <section id="open-roles" className="py-20 px-4 sm:px-8 max-w-[90rem] mx-auto w-full space-y-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
              Career Opportunities
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
              Open Positions
            </h2>
            <p className="text-sm text-white/60">
              Find your domain below or submit a general application if you don't see an exact match.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Roles" },
              { id: "engineering", label: "Engineering" },
              { id: "design", label: "Design" },
              { id: "community", label: "Community & Ops" },
              { id: "campus", label: "Campus Lead" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[var(--brand)] text-black font-bold shadow-[0_0_20px_rgba(196,181,253,0.3)]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--brand)] bg-[var(--brand)]/10 px-3 py-1 rounded-full border border-[var(--brand)]/20">
                    {role.type}
                  </span>
                  <span className="font-mono text-[11px] uppercase text-white/50">
                    📍 {role.location}
                  </span>
                </div>

                <h3 className="font-display text-2xl text-white uppercase tracking-tight">
                  {role.title}
                </h3>

                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {role.desc}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {role.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] uppercase text-white/40 bg-white/5 px-2.5 py-1 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-white/40">
                  Google Sheet Sync
                </span>
                <button
                  type="button"
                  onClick={() => handleApplyClick(role.category)}
                  className="px-6 py-2.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_15px_rgba(196,181,253,0.25)] hover:scale-105 cursor-pointer"
                >
                  Quick Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Chapter Callout */}
      <section className="py-16 px-4 sm:px-8 max-w-[90rem] mx-auto w-full border-t border-white/10">
        <div className="p-8 sm:p-12 rounded-3xl border border-white/15 bg-gradient-to-r from-white/[0.03] to-[var(--brand)]/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
              Student Leadership
            </span>
            <h3 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
              Are You a Student Organizer?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Launch a Genesis Campus Chapter at your college, host local hackathons, and join our elite network of student community leads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleApplyClick("campus")}
            className="px-8 py-4 rounded-2xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_25px_rgba(196,181,253,0.35)] shrink-0 cursor-pointer"
          >
            Apply for Campus Chapter →
          </button>
        </div>
      </section>

      {/* Interactive Application Modal */}
      <WorkWithUsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        preselectedRole={selectedRole}
      />

      <Footer />
    </div>
  );
}
