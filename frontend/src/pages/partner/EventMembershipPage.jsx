import React, { useState } from "react";
import Navbar from "@/widgets/layout/Navbar";
import Footer from "@/widgets/layout/Footer";
import PartnerForm from "@/features/forms/PartnerForm";

const MEMBERSHIP_BENEFITS = [
  {
    icon: "🌐",
    title: "Community & Hackcon",
    desc: "Join a global network of organizers. Receive priority access & discounted tickets to Genesis Hackcon conference and featured spotlights in our monthly community newsletter."
  },
  {
    icon: "📋",
    title: "Pre-Event Support",
    desc: "Our Hackathon Community managers advise hundreds of hackathons yearly. Access our Organizer Guide, regular 1-on-1 advice calls, and operational playbooks."
  },
  {
    icon: "⚡",
    title: "Day-of Benefits",
    desc: "Our team supports your event on-site and online to ensure smooth operations, hardware lab provisioning, and special hacker experiences."
  },
  {
    icon: "🤝",
    title: "Dedicated Mentorship",
    desc: "Participate in organizer Peer Groups, receive direct 1-on-1 mentorship, and consult with veteran community leads to solve complex venue or financial hurdles."
  },
  {
    icon: "📅",
    title: "Season Schedule & Promotion",
    desc: "Official listing on the Genesis Season Calendar. We promote your event to tens of thousands of hackers via social media campaigns and broadcast newsletters."
  },
  {
    icon: "🏷️",
    title: "Preferred Vendor Discounts",
    desc: "Access exclusive partner discounts on event venues, domain vouchers, cloud credits, catering, and printing partners."
  },
  {
    icon: "📊",
    title: "Templates & Tutorials",
    desc: "Library of battle-tested templates: budget calculators, sponsor pitch decks, volunteer shift rosters, and judging spreadsheets."
  },
  {
    icon: "🎪",
    title: "On-Site Support Rep",
    desc: "We send a trained Genesis representative to your event to act as an extension of your organizing team, assisting with floor logistics and schedule flow."
  },
  {
    icon: "⚖️",
    title: "Judging Support",
    desc: "Run stress-free science fair / expo judging. Our representatives assist with demo rotation, rubrics, and fair scoring algorithms."
  },
  {
    icon: "🏆",
    title: "Prizes & Medals",
    desc: "Official Genesis winner pins, custom category awards (e.g. Best Domain, Best Use of AI), and sponsor hardware prizes."
  },
  {
    icon: "💻",
    title: "Genesis Software Lab",
    desc: "Every hacker at your event gets special access to domain names, web hosting credits, cloud API passes, and developer tools."
  },
  {
    icon: "🛡️",
    title: "Genesis Emergency Budget",
    desc: "If attendance surges up to 200% over target and exhausts emergency reserves, Genesis covers up to $1,000 in excess food or venue costs."
  },
  {
    icon: "🔑",
    title: "Genesis OAuth Sync",
    desc: "Streamlined hacker registration API integration enabling instant profile pre-fill and priority developer troubleshooting."
  },
  {
    icon: "🎁",
    title: "Season & Sponsor Swag",
    desc: "Receive official Genesis stickers, 'I Demoed' badges, developer t-shirts, notebook packs, and sponsor merchandise kits."
  },
  {
    icon: "🎮",
    title: "Guided Mini-Events",
    desc: "Genesis reps host high-energy side activities during your event—Cup Stacking, Slide Karaoke, Esports tournaments, and Tech Trivia."
  },
  {
    icon: "📈",
    title: "Hacker Surveys & Analytics",
    desc: "Post-event hacker feedback reports comparing your metrics with regional benchmarks to identify key growth areas."
  },
  {
    icon: "🥇",
    title: "Season League Rankings",
    desc: "Hackers earn points for their university or club in the official Genesis Season league standings to compete for annual trophies."
  },
  {
    icon: "🔍",
    title: "Project Cheating Audit",
    desc: "If cheating or duplicate submissions are suspected, Genesis experts conduct formal code audits following strict resolution protocols."
  }
];

const APPLICATION_STEPS = [
  {
    step: "01",
    title: "Read the Guidelines",
    desc: "Review the Genesis Member Event requirements, Code of Conduct, and safety standards to ensure alignment."
  },
  {
    step: "02",
    title: "Submit Application",
    desc: "Complete the Member Event application form 3 to 4 months in advance of your target event dates."
  },
  {
    step: "03",
    title: "Interview with Genesis",
    desc: "Schedule a 20-minute video consultation with the Genesis team to review venue, budget, and member perks."
  }
];

export default function EventMembershipPage() {
  const [showForm, setShowForm] = useState(false);

  const scrollToForm = () => {
    setShowForm(true);
    const el = document.getElementById("membership-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 sm:px-8 max-w-[90rem] mx-auto w-full overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--brand)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#e2efba] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#e2efba] animate-pulse" />
            Genesis Member Events
          </div>

          <h1 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight leading-none">
            Join the Genesis <br />
            <span className="text-[#e2efba]">Hackathon Season</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl font-light leading-relaxed">
            Each year, we support hackathons and invention competitions across the country that inspire innovation, cultivate builder communities, and empower thousands of student creators.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              type="button"
              onClick={scrollToForm}
              className="btn-cinema cursor-pointer"
            >
              Apply to Join Season →
            </button>
            <a
              href="/guide/introduction/community-values"
              className="btn-ghost"
            >
              Member Guidelines
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 sm:px-8 max-w-[90rem] mx-auto w-full space-y-12 border-t border-white/10">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
            Base Benefits Included
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Why Become a Genesis Member Event?
          </h2>
          <p className="text-sm text-white/60">
            By joining the Genesis Season, your event unlocks comprehensive operational, financial, and promotional support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMBERSHIP_BENEFITS.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all space-y-3 group"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="font-display text-lg text-white group-hover:text-[#e2efba] transition-colors uppercase">
                {item.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Stepper */}
      <section className="py-16 px-4 sm:px-8 max-w-[90rem] mx-auto w-full space-y-12 border-t border-white/10 bg-[#121214]">
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight">
            How to Become a Member Event
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {APPLICATION_STEPS.map((step, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/10 bg-[#181818] space-y-4 relative"
            >
              <span className="font-mono text-3xl text-[#e2efba] font-bold block">
                {step.step}
              </span>
              <h3 className="font-display text-xl text-white uppercase">
                {step.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Embedded Application Form */}
      <section id="membership-form" className="py-20 px-4 sm:px-8 max-w-[90rem] mx-auto w-full border-t border-white/10">
        <PartnerForm />
      </section>

      <Footer />
    </div>
  );
}
