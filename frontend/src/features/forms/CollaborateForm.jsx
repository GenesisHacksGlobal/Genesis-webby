import React from "react";
import InquiryForm from "./InquiryForm";

const SCOPE_OPTIONS = [
  { value: "cohost", label: "Co-host a hackathon" },
  { value: "track", label: "Run a track or challenge" },
  { value: "member_event", label: "List my event in the Genesis season" },
  { value: "speaker_mentor", label: "Speak, judge or mentor" },
];

export default function CollaborateForm() {
  return (
    <InquiryForm
      formType="collaborate"
      scopeLabel="How would you like to collaborate?"
      scopeOptions={SCOPE_OPTIONS}
      organizationLabel="Organization / event (optional)"
      organizationPlaceholder="Club, company or event name"
      messageLabel="Tell us about the idea"
      messagePlaceholder="What you want to do together, expected dates, and audience size."
      submitLabel="Send collaboration request →"
      successTitle="Request received"
      successBody="Thanks for the idea. Someone from the Genesis team will reply within 24–48 hours."
    />
  );
}
