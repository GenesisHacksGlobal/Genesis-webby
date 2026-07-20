import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";

export default function CareersPage() {
  return (
    <InnerPage
      eyebrow="Connect / Careers"
      title="Work at Genesis"
      cta={
        <Link to="/contact" className="btn-cinema">
          Get in touch →
        </Link>
      }
    >
      <p>
        We’re always looking for operators, designers, engineers, and community
        leads who care about craft and people in equal measure.
      </p>
      <p>
        Open roles rotate with the season — tell us what you want to build and
        we’ll figure out if there’s a fit.
      </p>
    </InnerPage>
  );
}
