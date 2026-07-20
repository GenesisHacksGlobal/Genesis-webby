import React from "react";
import { Link } from "react-router-dom";
import InnerPage from "../shared/InnerPage";

export default function AboutPage() {
  return (
    <InnerPage eyebrow="About /" title="About Genesis">
      <p>
        Genesis is a builder community across India — hackathons, meetups, and
        creative programmes that bring designers, developers, and founders into
        one room.
      </p>
      <p>
        We ship gatherings with real energy: panels, workshops, overnight builds,
        and the long conversations that happen after the stage lights go down.
      </p>
      <p>
        <Link
          to="/values"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          Our values →
        </Link>
        {" · "}
        <Link
          to="/events"
          className="text-[var(--heading)] underline-offset-4 hover:underline"
        >
          Events
        </Link>
      </p>
    </InnerPage>
  );
}
