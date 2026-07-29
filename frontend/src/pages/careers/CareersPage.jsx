import React, { useState } from "react";
import InnerPage from "../shared/InnerPage";
import WorkWithUsForm from "@/features/forms/WorkWithUsForm";

export default function CareersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <InnerPage
      eyebrow="Connect / Careers"
      title="Work at Genesis"
      cta={
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="btn-cinema cursor-pointer"
          >
            Apply / Work With Us →
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-white/80">
          We’re always looking for operators, designers, engineers, and community
          leads who care about craft and people in equal measure.
        </p>
        <p className="text-sm leading-relaxed text-[var(--text-dim)]">
          Open roles rotate with the season — tell us what you want to build, submit your details, and our leadership team will review your submission directly via our team Google Sheet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider block mb-2">01. Engineering</span>
            <h3 className="font-display text-xl text-white uppercase mb-2">Fullstack & Web3</h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Build high-performance web applications, interactive 3D engines, and community platforms.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider block mb-2">02. Design</span>
            <h3 className="font-display text-xl text-white uppercase mb-2">UI/UX & Visual</h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Craft award-winning design systems, brand identities, motion graphics, and user journeys.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-wider block mb-2">03. Community</span>
            <h3 className="font-display text-xl text-white uppercase mb-2">Ops & Growth</h3>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed">
              Lead developer hackathons, manage campus ambassadors, and scale tech communities.
            </p>
          </div>
        </div>
      </div>

      <WorkWithUsForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </InnerPage>
  );
}
