import React from "react";
import InnerPage from "../shared/InnerPage";

export default function PrivacyPage() {
  return (
    <InnerPage eyebrow="Legal /" title="Privacy Policy">
      <p>
        <strong className="text-[var(--heading)]">Last updated:</strong> 20 July
        2026
      </p>
      <p>
        Genesis (“we”, “us”) operates the genesis.dezhub.in website. This policy
        explains what information we collect and how we use it.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Information you provide.</strong>{" "}
        When you submit the contact form we collect your name, email, role, and
        message so we can respond to your enquiry. We do not sell personal data.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Analytics.</strong> If you
        accept cookies/analytics we may use PostHog to understand aggregated
        usage (pages viewed, device class). Session recording is disabled.
        Analytics does not load until you accept.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Retention.</strong> Contact
        messages are retained only as long as needed to handle your request and
        related follow-up, then deleted or archived securely.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Your rights.</strong> You may
        request access, correction, or deletion of your personal data by emailing{" "}
        <a
          href="mailto:hello@dezhub.in"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          hello@dezhub.in
        </a>
        . You can withdraw analytics consent anytime by clearing site data for
        this domain and reloading.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Contact.</strong> Questions
        about this policy: hello@dezhub.in
      </p>
    </InnerPage>
  );
}
