import React from "react";
import PartnerForm from "@/features/forms/PartnerForm";
import InquiryPageLayout from "./InquiryPageLayout";

export default function PartnerPage() {
  return (
    <InquiryPageLayout
      eyebrow="Partner /"
      title="Partner With Us"
      intro="Sponsor a Genesis event, bring Genesis to your campus, or offer credits and perks to our hackers."
      points={[
        "Event and title sponsorships",
        "Campus and college chapters",
        "Community and in-kind partnerships",
      ]}
      altLink={{
        prefix: "Want to co-host, judge or mentor?",
        to: "/collaborate",
        label: "Collaborate with us",
      }}
    >
      <PartnerForm />
    </InquiryPageLayout>
  );
}
