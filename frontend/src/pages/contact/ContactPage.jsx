import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";
import Contact from "@/features/contact/Contact";

export default function ContactPage() {
  return (
    <InnerPage
      eyebrow="Connect /"
      title="Contact Us"
      cta={
        <div className="flex flex-wrap gap-4">
          <Link to="/partner" className="btn-cinema">
            Partner With Us →
          </Link>
          <a
            href="https://www.linkedin.com/company/genesishacks/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Message on LinkedIn
          </a>
        </div>
      }
    >
      <div className="-mt-8">
        <Contact />
      </div>
    </InnerPage>
  );
}
