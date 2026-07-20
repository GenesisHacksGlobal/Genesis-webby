import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";

export default function ContactPage() {
  return (
    <InnerPage
      eyebrow="Connect /"
      title="Contact Us"
      cta={
        <a
          href="https://www.linkedin.com/company/genesishacks/posts/?feedView=all"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cinema"
        >
          Message on LinkedIn →
        </a>
      }
    >
      <p>
        Partnerships, speaking, campus programmes, press, or just saying hello —
        drop us a line. We read everything.
      </p>
      <p className="font-mono text-sm text-[var(--text-faint)]">
        Prefer social? Find us on{" "}
        <a
          href="https://www.instagram.com/genesishacks/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          Instagram
        </a>{" "}
        and{" "}
        <a
          href="https://www.linkedin.com/company/genesishacks/posts/?feedView=all"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          LinkedIn
        </a>
        .
      </p>
      <p>
        <Link
          to="/careers"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          Looking for roles? Work at Genesis →
        </Link>
      </p>
    </InnerPage>
  );
}
