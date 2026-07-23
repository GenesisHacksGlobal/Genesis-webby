import React from "react";
import LegalPage from "../shared/LegalPage";

const SECTIONS = [
  {
    id: "overview",
    title: "Who We Are & Overview",
    content: (
      <>
        <p>
          Genesis ("we", "us", "our") is a developer community platform operated
          by <strong>Genesis Hacks</strong>, based in India. We operate the website at{" "}
          <strong>genesishacks.in</strong> (the "Site").
        </p>
        <p>
          This Privacy Policy explains what personal information we collect, how
          we use it, who we share it with, and the choices you have regarding
          your data. We are committed to handling your information with
          transparency, care, and respect.
        </p>
        <div className="legal-callout">
          <strong>The short version:</strong> We collect only what we need, we
          don't sell your data, and we give you control over what you share with
          us.
        </div>
      </>
    ),
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: (
      <>
        <p>
          We collect information in the following ways:
        </p>
        <p>
          <strong>Information you provide directly.</strong> When you submit our
          contact form, you provide your name, email address, role or affiliation,
          and a message. We use this solely to respond to your enquiry and, where
          relevant, to follow up with you about Genesis events and opportunities.
        </p>
        <p>
          <strong>Information collected automatically.</strong> When you visit the
          Site, we may automatically collect:
        </p>
        <ul className="legal-list">
          <li>Pages visited and approximate time spent on each page</li>
          <li>Device class (desktop / mobile) and browser type</li>
          <li>Geographic region (country / state level — not precise location)</li>
          <li>Referral source (how you found us)</li>
        </ul>
        <p>
          This data is collected only if you have provided your explicit consent
          through our cookie banner. We do not collect this data without your
          consent.
        </p>
        <p>
          <strong>Information from third parties.</strong> If you register for a
          Genesis event on a third-party platform (such as Luma), we may receive
          anonymised or aggregated attendance statistics from that platform. We do
          not receive your personal registration data from these third parties.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="legal-list">
          <li>
            <strong>To respond to your enquiries</strong> — Contact form
            submissions are used solely to reply to and assist you.
          </li>
          <li>
            <strong>To improve the Site</strong> — Aggregated, anonymised
            analytics help us understand which content is most useful and how to
            improve the experience.
          </li>
          <li>
            <strong>To communicate about Genesis events</strong> — If you've
            contacted us and expressed interest in our community, we may
            occasionally send you relevant updates. You can opt out at any time.
          </li>
          <li>
            <strong>To comply with legal obligations</strong> — We may retain or
            disclose data when required by applicable law.
          </li>
        </ul>
        <p>
          We do not use your data for automated decision-making, profiling, or
          targeted advertising.
        </p>
      </>
    ),
  },
  {
    id: "analytics",
    title: "Analytics & Cookies",
    content: (
      <>
        <p>
          We use <strong>PostHog</strong> for privacy-respecting analytics. PostHog
          is configured with the following restrictions:
        </p>
        <ul className="legal-list">
          <li>Session recording is <strong>disabled</strong></li>
          <li>Analytics only loads after you explicitly accept via our cookie banner</li>
          <li>No personal identifiers are sent to PostHog</li>
          <li>IP addresses are anonymised before processing</li>
          <li>We do not use third-party advertising cookies or tracking pixels</li>
        </ul>
        <p>
          <strong>Cookie types we use:</strong>
        </p>
        <ul className="legal-list">
          <li>
            <strong>Strictly necessary cookies</strong> — Required for the Site to
            function. These cannot be disabled.
          </li>
          <li>
            <strong>Analytics cookies</strong> — Loaded only with your consent.
            Used to understand aggregated site usage.
          </li>
        </ul>
        <div className="legal-callout">
          You can withdraw your analytics consent at any time by clearing site
          data for this domain in your browser settings and reloading the page.
          The cookie banner will reappear and you can choose your preference again.
        </div>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "Data Sharing & Disclosure",
    content: (
      <>
        <p>
          We do not sell, trade, rent, or otherwise transfer your personal
          information to third parties for commercial purposes. Period.
        </p>
        <p>We may share your information only in the following circumstances:</p>
        <ul className="legal-list">
          <li>
            <strong>Service providers:</strong> We use PostHog (analytics) and
            may use email infrastructure providers to respond to contact form
            submissions. These providers process data only as directed by us and
            under strict confidentiality obligations.
          </li>
          <li>
            <strong>Legal requirements:</strong> We may disclose your information
            if required to do so by law, court order, or governmental authority,
            or if we believe disclosure is necessary to protect rights, property,
            or safety.
          </li>
          <li>
            <strong>Business transfers:</strong> In the unlikely event of a merger
            or acquisition, your information may be transferred as part of that
            transaction. We will provide notice in such an event.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain personal data only for as long as necessary for the purposes
          for which it was collected or as required by applicable law.
        </p>
        <ul className="legal-list">
          <li>
            <strong>Contact form data</strong> — Retained for the duration of
            your communication with us and any reasonable follow-up period (up to
            12 months), then deleted or securely archived.
          </li>
          <li>
            <strong>Analytics data</strong> — Aggregated, anonymised analytics
            data may be retained indefinitely as it contains no personal
            information. Raw event data in PostHog is subject to PostHog's own
            retention policies.
          </li>
        </ul>
        <p>
          You may request deletion of your personal data at any time. See
          "Your Rights" below.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    content: (
      <>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal information. These include:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Right of access</strong> — Request a copy of the personal
            data we hold about you.
          </li>
          <li>
            <strong>Right to rectification</strong> — Request correction of
            inaccurate or incomplete data.
          </li>
          <li>
            <strong>Right to erasure</strong> — Request deletion of your personal
            data, subject to certain legal exceptions.
          </li>
          <li>
            <strong>Right to restrict processing</strong> — Request that we
            limit how we use your data in certain circumstances.
          </li>
          <li>
            <strong>Right to withdraw consent</strong> — Withdraw consent for
            analytics at any time by clearing your browser's site data.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please email us at{" "}
          <a href="mailto:hello@genesishacks.in">hello@genesishacks.in</a>. We will respond
          within 30 days. We may need to verify your identity before processing
          certain requests.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    content: (
      <>
        <p>
          We implement reasonable technical and organisational measures to protect
          your personal information against unauthorised access, alteration,
          disclosure, or destruction. These measures include:
        </p>
        <ul className="legal-list">
          <li>HTTPS encryption for all data in transit</li>
          <li>Access controls limiting who can view collected data</li>
          <li>Regular review of our data collection and processing practices</li>
          <li>Use of reputable, security-audited third-party processors</li>
        </ul>
        <p>
          However, no method of transmission over the internet or method of
          electronic storage is 100% secure. While we strive to use commercially
          acceptable means to protect your data, we cannot guarantee absolute
          security. If you have concerns about a specific data security matter,
          please contact us immediately.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: (
      <>
        <p>
          The Site is not directed to children under the age of 13. We do not
          knowingly collect personal information from children under 13. If you
          are a parent or guardian and believe your child has provided us with
          personal information, please contact us at{" "}
          <a href="mailto:hello@genesishacks.in">hello@genesishacks.in</a> and we will
          promptly delete such data.
        </p>
        <p>
          Participants in Genesis hackathons and events who are minors should
          obtain parental or guardian consent before registering.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, technology, legal requirements, or other factors. When
          we do, we will update the "Last updated" date at the top of this page.
        </p>
        <p>
          For significant changes, we will endeavour to provide more prominent
          notice (such as a banner on the Site). We encourage you to review this
          policy periodically. Your continued use of the Site after changes are
          posted constitutes your acceptance of the revised policy.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact & Data Requests",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or your personal data, please contact us:
        </p>
        <ul className="legal-list">
          <li>
            Email: <a href="mailto:[EMAIL_ADDRESS]">[EMAIL_ADDRESS]</a>
          </li>
          <li>Website: genesis.in</li>
          <li>Operated by: Genesis, India</li>
        </ul>
        <p>
          We will acknowledge your request within 5 business days and aim to
          resolve it within 30 days.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      type="privacy"
      sections={SECTIONS}
      lastUpdated="20 July 2026"
    />
  );
}
