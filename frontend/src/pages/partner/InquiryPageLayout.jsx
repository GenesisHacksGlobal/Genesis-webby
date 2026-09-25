import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/widgets/layout/Navbar";
import Footer from "@/widgets/layout/Footer";
import { CONTACT_EMAIL } from "@/features/contact/submitContactLead";

/**
 * Form-first layout for the Partner / Collaborate pages:
 * short intro on the left, the form as the main element on the right.
 */
export default function InquiryPageLayout({
  eyebrow,
  title,
  intro,
  points,
  altLink,
  children,
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 w-full max-w-[90rem] mx-auto px-4 sm:px-8 pt-32 pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div className="space-y-5">
              <span className="font-mono text-xs text-[var(--brand)] uppercase tracking-[0.24em]">
                {eyebrow}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.02] text-white">
                {title}
              </h1>
              <p className="text-base text-white/65 leading-relaxed max-w-md">
                {intro}
              </p>
            </div>

            <ul className="space-y-2 text-sm text-white/60">
              {points.map((point) => (
                <li key={point}>— {point}</li>
              ))}
            </ul>

            <div className="space-y-2 text-sm text-white/60 pt-6 border-t border-white/10">
              <p>
                Prefer email?{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-white underline underline-offset-4 hover:text-[var(--brand)]"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>
                {altLink.prefix}{" "}
                <Link
                  to={altLink.to}
                  className="text-white underline underline-offset-4 hover:text-[var(--brand)]"
                >
                  {altLink.label}
                </Link>
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
