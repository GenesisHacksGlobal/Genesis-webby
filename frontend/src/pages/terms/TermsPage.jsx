import React from "react";
import InnerPage from "../shared/InnerPage";

export default function TermsPage() {
  return (
    <InnerPage eyebrow="Legal /" title="Terms of Service">
      <p>
        <strong className="text-[var(--heading)]">Last updated:</strong> 20 July
        2026
      </p>
      <p>
        By using the Genesis website and related community programmes you agree
        to these terms. If you do not agree, please do not use the site.
      </p>
      <p>
        <strong className="text-[var(--heading)]">The service.</strong> Genesis
        provides information about events, community programmes, and ways to get
        in touch. Event details may change; registration for third-party
        platforms (e.g. Luma) is governed by those platforms’ terms.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Acceptable use.</strong> Do not
        misuse the site (scraping that harms availability, injecting malware,
        impersonation, or harassment of community members).
      </p>
      <p>
        <strong className="text-[var(--heading)]">Content.</strong> Site copy,
        branding, and media are owned by Genesis or its licensors. You may not
        reuse them commercially without written permission.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Disclaimer.</strong> The site
        is provided “as is”. We are not liable for indirect or consequential
        losses arising from use of the site to the fullest extent permitted by
        law.
      </p>
      <p>
        <strong className="text-[var(--heading)]">Contact.</strong>{" "}
        <a
          href="mailto:hello@dezhub.in"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          hello@dezhub.in
        </a>
      </p>
    </InnerPage>
  );
}
