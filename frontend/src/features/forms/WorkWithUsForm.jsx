import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitFormToSheets } from "@shared/services/formSubmissionService";

export default function WorkWithUsForm({ isOpen, onClose, preselectedRole = "" }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    domain: preselectedRole || "engineering",
    experience: "1-3 years",
    portfolio: "",
    whyGenesis: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.fullName.trim() || !form.email.trim() || !form.whyGenesis.trim()) {
      setErrorMsg("Please fill in your name, email, and why you'd like to join.");
      return;
    }

    setStatus("submitting");

    const result = await submitFormToSheets({
      formType: "work_with_us",
      data: {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.domain,
        experience: form.experience,
        portfolio: form.portfolio,
        message: form.whyGenesis,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        domain: "engineering",
        experience: "1-3 years",
        portfolio: "",
        whyGenesis: "",
      });
    } else {
      setStatus("error");
      setErrorMsg(result.message || "Failed to submit. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#0e0e12] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] my-8 text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="mb-6">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--brand)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Join The Core Team
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-white uppercase tracking-tight mt-2">
              Work With Us
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/60 mt-1">
              Submissions log directly to our team directory on Google Sheets.
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--brand)]/20 text-[var(--brand)] flex items-center justify-center text-3xl mx-auto border border-[var(--brand)]/40">
                ✓
              </div>
              <h3 className="font-display text-2xl uppercase">Application Received!</h3>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Thank you for applying. Your application has been logged to our Google Sheet. Our team will review your profile and get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  onClose();
                }}
                className="mt-6 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-[var(--brand)] text-black hover:bg-white transition-colors"
              >
                Close Window
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Satoshi Nakamoto"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                    disabled={status === "submitting"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="satoshi@genesis.in"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                    disabled={status === "submitting"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Domain / Field
                  </label>
                  <select
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    className="w-full bg-[#16161b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer"
                    disabled={status === "submitting"}
                  >
                    <option value="engineering">Engineering / Fullstack</option>
                    <option value="ui_ux_design">UI/UX & 3D Design</option>
                    <option value="community_ops">Community & Growth</option>
                    <option value="content_marketing">Content & Media</option>
                    <option value="events_logistics">Events & Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full bg-[#16161b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer"
                    disabled={status === "submitting"}
                  >
                    <option value="Student / Fresher">Student / Fresher</option>
                    <option value="1-3 years">1–3 Years</option>
                    <option value="3-5 years">3–5 Years</option>
                    <option value="5+ years">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                    disabled={status === "submitting"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Portfolio / GitHub / LinkedIn URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://github.com/yourhandle"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                  disabled={status === "submitting"}
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-white/60 mb-1.5">
                  Why do you want to build with Genesis? *
                </label>
                <textarea
                  name="whyGenesis"
                  rows={4}
                  required
                  value={form.whyGenesis}
                  onChange={handleChange}
                  placeholder="Tell us about what you've built, your passions, and what drives you…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors resize-none"
                  disabled={status === "submitting"}
                />
              </div>

              {errorMsg && (
                <div className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl font-mono text-xs uppercase tracking-wider text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="px-7 py-3 rounded-xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_25px_rgba(196,181,253,0.3)] disabled:opacity-50"
                >
                  {status === "submitting" ? "Submitting…" : "Submit Application →"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
