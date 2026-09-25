import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { submitFormToSheets } from "@shared/services/formSubmissionService";

const INPUT_CLASS =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[var(--brand)] transition-colors disabled:opacity-60";

const LABEL_CLASS =
  "block text-[11px] font-mono uppercase tracking-wider text-white/70 mb-2";

const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024; // keeps the request under Vercel's 4.5 MB body limit once base64-encoded
const ATTACHMENT_EXTENSIONS = ["pdf", "ppt", "pptx"];

function fileExtension(name) {
  return name.split(".").pop().toLowerCase();
}

function readAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Shared inquiry form used by the Partner and Collaborate pages.
 * Each page passes its own formType, scope options and copy.
 */
export default function InquiryForm({
  formType,
  scopeLabel,
  scopeOptions,
  attachmentScopes = [],
  attachmentLabel = "Brochure or pitch deck (optional)",
  organizationLabel,
  organizationRequired = false,
  organizationPlaceholder,
  messageLabel,
  messagePlaceholder,
  submitLabel,
  successTitle,
  successBody,
}) {
  const initialForm = {
    name: "",
    organization: "",
    email: "",
    phone: "",
    partnershipType: scopeOptions[0].value,
    website: "",
    proposal: "",
  };

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);

  const showAttachment = attachmentScopes.includes(form.partnershipType);

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setErrorMsg("");
    if (!file) {
      setAttachment(null);
      return;
    }
    if (!ATTACHMENT_EXTENSIONS.includes(fileExtension(file.name))) {
      setErrorMsg("Please upload a PDF or PowerPoint file (.pdf, .ppt, .pptx).");
      clearAttachment();
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrorMsg("That file is over 3 MB. Please upload a smaller file or share a link in the message.");
      clearAttachment();
      return;
    }
    setAttachment(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.proposal.trim() ||
      (organizationRequired && !form.organization.trim())
    ) {
      setErrorMsg("Please fill in the required fields.");
      return;
    }

    setStatus("submitting");

    const data = { ...form };
    if (showAttachment && attachment) {
      try {
        data.attachmentName = attachment.name;
        data.attachmentData = await readAsBase64(attachment);
      } catch {
        setStatus("error");
        setErrorMsg("Could not read that file. Please try again or remove it.");
        return;
      }
    }

    const result = await submitFormToSheets({ formType, data });

    if (result.ok) {
      setStatus("success");
      setForm(initialForm);
      clearAttachment();
    } else {
      setStatus("error");
      setErrorMsg(result.message || "Could not send your message. Please try again.");
    }
  };

  const disabled = status === "submitting";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/15 bg-[#0d0d11] p-8 sm:p-12 text-center space-y-4"
      >
        <h3 className="font-display text-3xl uppercase tracking-tight text-white">
          {successTitle}
        </h3>
        <p className="text-sm text-white/70 max-w-md mx-auto leading-relaxed">
          {successBody}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-ghost mt-4"
        >
          Send another
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-white/15 bg-[#0d0d11] p-6 sm:p-10 space-y-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${formType}-name`} className={LABEL_CLASS}>
            Full name *
          </label>
          <input
            id={`${formType}-name`}
            type="text"
            name="name"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            className={INPUT_CLASS}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor={`${formType}-email`} className={LABEL_CLASS}>
            Email *
          </label>
          <input
            id={`${formType}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            className={INPUT_CLASS}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${formType}-org`} className={LABEL_CLASS}>
            {organizationLabel}
            {organizationRequired ? " *" : ""}
          </label>
          <input
            id={`${formType}-org`}
            type="text"
            name="organization"
            autoComplete="organization"
            required={organizationRequired}
            value={form.organization}
            onChange={handleChange}
            placeholder={organizationPlaceholder}
            className={INPUT_CLASS}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor={`${formType}-phone`} className={LABEL_CLASS}>
            Phone / WhatsApp
          </label>
          <input
            id={`${formType}-phone`}
            type="tel"
            name="phone"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            className={INPUT_CLASS}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor={`${formType}-scope`} className={LABEL_CLASS}>
            {scopeLabel}
          </label>
          <select
            id={`${formType}-scope`}
            name="partnershipType"
            value={form.partnershipType}
            onChange={handleChange}
            className={`${INPUT_CLASS} bg-[#16161b] cursor-pointer`}
            disabled={disabled}
          >
            {scopeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${formType}-website`} className={LABEL_CLASS}>
            Website / social link
          </label>
          <input
            id={`${formType}-website`}
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://"
            className={INPUT_CLASS}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formType}-message`} className={LABEL_CLASS}>
          {messageLabel} *
        </label>
        <textarea
          id={`${formType}-message`}
          name="proposal"
          rows={5}
          required
          value={form.proposal}
          onChange={handleChange}
          placeholder={messagePlaceholder}
          className={`${INPUT_CLASS} resize-none`}
          disabled={disabled}
        />
      </div>

      {showAttachment && (
        <div>
          <label htmlFor={`${formType}-attachment`} className={LABEL_CLASS}>
            {attachmentLabel}
          </label>
          <input
            id={`${formType}-attachment`}
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            className={`${INPUT_CLASS} cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-mono file:uppercase file:text-white`}
            disabled={disabled}
          />
          <p className="mt-2 text-[11px] text-white/40">
            PDF or PowerPoint, up to 3 MB.
          </p>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="text-xs font-mono text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
        >
          {errorMsg}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={disabled}
          className="btn-cinema w-full sm:w-auto justify-center disabled:opacity-50"
        >
          {disabled ? "Sending…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
