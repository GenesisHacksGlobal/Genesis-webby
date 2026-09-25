import React from "react";
import InquiryForm from "./InquiryForm";

const SCOPE_OPTIONS = [
  { value: "sponsorship", label: "Event sponsorship" },
  { value: "campus_partner", label: "Campus / college chapter" },
  { value: "community_partner", label: "Community partnership" },
  { value: "in_kind", label: "Product, credits or perks" },
];

export default function PartnerForm() {
  return (
    <InquiryForm
      formType="partner"
      scopeLabel="What kind of partnership?"
      scopeOptions={SCOPE_OPTIONS}
      attachmentScopes={["sponsorship", "community_partner"]}
      organizationLabel="Company / college"
      organizationRequired
      organizationPlaceholder="Acme Corp / Tech University"
      messageLabel="What do you have in mind"
      messagePlaceholder="Which events, what you'd like to offer, and any timeline."
      submitLabel="Send partnership request →"
      successTitle="Request received"
      successBody="Thanks for reaching out. Someone from the Genesis team will reply within 24–48 hours."
    />
  );
}
