import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getConsent,
  setConsent,
  startAnalyticsIfAllowed,
  stopAnalytics,
  CONSENT_EVENT,
} from "./consent";

/**
 * GDPR-style consent bar. Analytics stay dark until Accept.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
      return undefined;
    }
    if (existing.status === "accepted") {
      startAnalyticsIfAllowed();
    }
    const onChange = () => {
      const next = getConsent();
      setVisible(!next);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!visible) return null;

  const accept = () => {
    setConsent("accepted");
    setVisible(false);
    startAnalyticsIfAllowed();
  };

  const reject = () => {
    setConsent("rejected");
    setVisible(false);
    stopAnalytics();
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie and analytics consent"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/15 bg-[#0a0a0a]/95 px-4 py-4 backdrop-blur-xl md:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-[52ch] text-sm leading-relaxed text-white/70">
          We use optional analytics to improve Genesis. Essential site function
          works without them. See our{" "}
          <Link to="/privacy" className="text-[var(--heading)] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/terms" className="text-[var(--heading)] underline-offset-2 hover:underline">
            Terms
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={reject}
            className="border border-white/20 px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/40 hover:text-white"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={accept}
            className="bg-white px-4 py-2 text-xs font-mono uppercase tracking-[0.16em] text-black transition-opacity hover:opacity-90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
