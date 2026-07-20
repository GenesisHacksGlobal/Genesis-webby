import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LANDING } from "@shared/constants/testIds";
import {
  CONTACT_EMAIL,
  buildMailtoHref,
  submitContactLead,
} from "./submitContactLead";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/genesishacks/?hl=en",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/genesishacks/posts/?feedView=all",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "freelancer",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");
  const [mailtoHref, setMailtoHref] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.message) {
      setError("Please fill in name, email and message.");
      return;
    }

    setStatus("submitting");
    const result = await submitContactLead(form);

    if (result.ok) {
      setStatus("success");
      setForm({ name: "", email: "", role: "freelancer", message: "" });
      return;
    }

    // Graceful degradation — never claim success for mailto
    const href = buildMailtoHref(form);
    setMailtoHref(href);
    setStatus("error");
    setError(
      "We could not reach the lead inbox automatically. You can still email us directly.",
    );
  };

  return (
    <section
      id="contact"
      className="relative z-[3] border-t border-border py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <span className="block h-px w-10 bg-[var(--text-dim)]" />
              <span className="overline">Chapter 05 · Contact</span>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="font-display text-4xl tracking-tighter leading-[1.02] text-[var(--heading)] sm:text-5xl md:text-6xl"
            >
              Let's build something together.
            </motion.h2>
            <p className="mt-8 max-w-[40ch] leading-relaxed text-[var(--text-dim)]">
              Freelancer, student, campus community or brand — drop a message and
              we'll get back within 24–48 hours.
            </p>

            <div className="mt-12 space-y-8">
              <div>
                <div className="overline">Email</div>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="link-draw mt-2 block font-display text-2xl text-[var(--heading)]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div>
                <div className="overline">Socials</div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-draw font-display text-xl text-[var(--heading)]/70 transition-colors hover:text-[var(--heading)]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="overline">We help with</div>
                <ul className="mt-2 space-y-1 text-[var(--text-dim)]">
                  <li>— Collabs & sponsorships</li>
                  <li>— Campus & community partnerships</li>
                  <li>— Freelancer onboarding</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                data-testid={LANDING.contactSuccess}
                className="border border-[var(--border)] bg-[var(--surface)] p-8 text-center md:p-12"
              >
                <div className="overline">Message received</div>
                <p className="mt-4 text-[var(--text-dim)]">
                  Thanks — the Genesis team will reply within 24–48 hours.
                </p>
                <button
                  type="button"
                  className="btn-cinema mt-8"
                  onClick={() => setStatus("idle")}
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form
                data-testid={LANDING.contactForm}
                onSubmit={onSubmit}
                className="flex flex-col gap-8 border border-[var(--border)] bg-[var(--surface)] p-8 md:p-12"
                noValidate
              >
                <div className="grid gap-8 sm:grid-cols-2">
                  <input
                    data-testid={LANDING.contactName}
                    required
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Name"
                    className="input-line"
                    disabled={status === "submitting"}
                  />
                  <input
                    data-testid={LANDING.contactEmail}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email"
                    className="input-line"
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <div className="overline mb-3">I am reaching out as</div>
                  <select
                    data-testid={LANDING.contactRole}
                    name="role"
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    className="input-line cursor-pointer appearance-none"
                    disabled={status === "submitting"}
                  >
                    <option value="freelancer" className="bg-white text-black">
                      Freelancer / individual
                    </option>
                    <option value="student" className="bg-white text-black">
                      Student / college community
                    </option>
                    <option value="brand" className="bg-white text-black">
                      Startup / brand
                    </option>
                    <option value="other" className="bg-white text-black">
                      Other
                    </option>
                  </select>
                </div>

                <textarea
                  data-testid={LANDING.contactMessage}
                  required
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us a little about you & what you're after…"
                  className="input-line resize-none"
                  disabled={status === "submitting"}
                />

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="max-w-[28ch] text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    By submitting, you agree to be contacted by the Genesis team.
                    See our{" "}
                    <Link to="/privacy" className="underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                  <button
                    data-testid={LANDING.contactSubmit}
                    type="submit"
                    className="btn-cinema disabled:opacity-50"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending…" : "Send message"}
                    <span aria-hidden>→</span>
                  </button>
                </div>

                {error && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-red-300/80" role="alert">
                      {error}
                    </p>
                    {mailtoHref ? (
                      <a
                        href={mailtoHref}
                        className="inline-flex text-sm text-[var(--heading)] underline-offset-4 hover:underline"
                      >
                        Open mail client as fallback →
                      </a>
                    ) : null}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
