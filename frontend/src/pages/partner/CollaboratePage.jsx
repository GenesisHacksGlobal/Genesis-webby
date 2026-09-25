import React from "react";
import CollaborateForm from "@/features/forms/CollaborateForm";
import InquiryPageLayout from "./InquiryPageLayout";

export default function CollaboratePage() {
  return (
    <InquiryPageLayout
      eyebrow="Collaborate /"
      title="Collaborate With Us"
      intro="Co-host a hackathon, run a track, list your event in the Genesis season, or join us as a speaker, judge or mentor."
      points={[
        "Co-host or run a track at a hackathon",
        "List your event in the Genesis season",
        "Speak, judge or mentor",
      ]}
      altLink={{
        prefix: "Looking to sponsor or start a campus chapter?",
        to: "/partner",
        label: "Partner with us",
      }}
    >
      <CollaborateForm />
    </InquiryPageLayout>
  );
}
