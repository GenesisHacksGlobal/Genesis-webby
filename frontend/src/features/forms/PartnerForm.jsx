import React, { useState } from "react";
import { motion } from "framer-motion";
import { submitFormToSheets } from "@shared/services/formSubmissionService";

export default function PartnerForm() {
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    partnershipType: "sponsorship",
    website: "",
    proposal: "",
  });

  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name.trim() || !form.organization.trim() || !form.email.trim() || !form.proposal.trim()) {
      setErrorMsg("Please fill in your name, organization, email, and proposal details.");
      return;
    }

    setStatus("submitting");

    const result = await submitFormToSheets({
      formType: "partner_collaborate",
      data: {
        name: form.name,
        organization: form.organization,
        email: form.email,
        phone: form.phone,
        partnershipType: form.partnershipType,
        website: form.website,
        proposal: form.proposal,
      },
    });

    if (result.ok) {
      setStatus("success");
      setForm({
        name: "",
        organization: "",
        email: "",
        phone: "",
        partnershipType: "sponsorship",
        website: "",
        proposal: "",
      });
    } else {
      setStatus("error");
      setErrorMsg(result.message || "Failed to submit partnership request. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl border border-white/15 bg-[#0d0d11]/90 backdrop-blur-2xl p-6 sm:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.7)] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,181,253,0.08),transparent_70%)] pointer-events-none" />

      <div className="mb-8 relative">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
          Partnerships & Alliances
        </span>
        <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-2">
          Collaborate With Genesis
        </h2>
        <p className="font-sans text-xs sm:text-sm text-white/60 mt-2 max-w-xl">
          Sponsor a hackathon, launch a campus chapter, or build community together. All inquiry logs save directly into our Google Sheet.
        </p>
      </div>

      {status === "success" ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-16 text-center space-y-5 border border-white/10 rounded-2xl bg-white/[0.02]"
        >
          <div className="w-20 h-20 rounded-full bg-[var(--brand)]/20 text-[var(--brand)] flex items-center justify-center text-4xl mx-auto border border-[var(--brand)]/40 shadow-[0_0_30px_rgba(196,181,253,0.2)]">
            ⚡
          </div>
          <h3 className="font-display text-3xl uppercase tracking-tight">Proposal Received!</h3>
          <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to partner with Genesis. Your response has been saved to our Google Sheet. Our partnership leads will reach out within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 px-8 py-3.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_20px_rgba(196,181,253,0.3)]"
          >
            Submit Another Proposal
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Your Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                disabled={status === "submitting"}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Organization / Brand / College *
              </label>
              <input
                type="text"
                name="organization"
                required
                value={form.organization}
                onChange={handleChange}
                placeholder="Acme Corp / Tech University"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                disabled={status === "submitting"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Work Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="alex@acme.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                disabled={status === "submitting"}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Phone / Telegram / WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                disabled={status === "submitting"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Partnership Scope
              </label>
              <select
                name="partnershipType"
                value={form.partnershipType}
                onChange={handleChange}
                className="w-full bg-[#16161b] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[var(--brand)] transition-colors cursor-pointer"
                disabled={status === "submitting"}
              >
                <option value="sponsorship">Title / Event Sponsorship</option>
                <option value="campus_partner">Campus / College Chapter</option>
                <option value="hackathon_collab">Hackathon Co-Host / Track</option>
                <option value="speaker_mentor">Speaker / Judge / Mentor</option>
                <option value="community_cross">Community Partnership</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
                Website / Social Handle
              </label>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="https://yourbrand.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors"
                disabled={status === "submitting"}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2">
              Proposal Details / Message *
            </label>
            <textarea
              name="proposal"
              rows={5}
              required
              value={form.proposal}
              onChange={handleChange}
              placeholder="Tell us what you'd like to achieve together, expected timeline, and any specific ideas..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--brand)] transition-colors resize-none"
              disabled={status === "submitting"}
            />
          </div>

          {errorMsg && (
            <div className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            <span className="font-mono text-[10px] uppercase text-white/40 tracking-wider hidden sm:inline">
              ⚡ Realtime Google Sheets Sync
            </span>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl font-mono text-xs uppercase font-bold tracking-wider text-black bg-[var(--brand)] hover:bg-white transition-all shadow-[0_0_30px_rgba(196,181,253,0.35)] hover:scale-105 disabled:opacity-50"
            >
              {status === "submitting" ? "Submitting Proposal…" : "Send Proposal →"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
