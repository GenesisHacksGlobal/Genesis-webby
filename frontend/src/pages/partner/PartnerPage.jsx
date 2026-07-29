import React from "react";
import InnerPage from "../shared/InnerPage";
import PartnerForm from "@/features/forms/PartnerForm";

export default function PartnerPage() {
  return (
    <InnerPage
      eyebrow="Connect / Partnerships"
      title="Partner With Us"
      cta={
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.linkedin.com/company/genesishacks/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            LinkedIn Page →
          </a>
        </div>
      }
    >
      <div className="space-y-12">
        <p className="text-lg leading-relaxed text-white/80 max-w-2xl">
          Whether you&apos;re a tech brand seeking developer engagement, a college looking for a campus hackathon chapter, or an ecosystem partner — let&apos;s build together.
        </p>

        {/* Embedded Partner Form */}
        <PartnerForm />
      </div>
    </InnerPage>
  );
}
