/**
 * Form submission service with Google Sheets integration and API fallback.
 * 
 * Supports:
 * - Contact Us Form
 * - Work With Us Form (Team / Careers)
 * - Partner / Collaborate Form
 */

const DEFAULT_SHEETS_URL =
  process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL ||
  process.env.GOOGLE_SHEETS_WEBHOOK_URL ||
  "";

/**
 * Submits form data to Google Sheets webhook and Vercel serverless endpoints.
 * 
 * @param {Object} params
 * @param {'contact' | 'work_with_us' | 'partner_collaborate'} params.formType
 * @param {Object} params.data
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function submitFormToSheets({ formType, data }) {
  const payload = {
    formType,
    submittedAt: new Date().toISOString(),
    ...data,
  };

  const targets = [];

  // 1. Local Vercel Serverless API Route
  targets.push("/api/submit-form");

  // 2. Direct Google Sheets Webhook URL if configured
  if (DEFAULT_SHEETS_URL && !DEFAULT_SHEETS_URL.startsWith("%")) {
    targets.push(DEFAULT_SHEETS_URL);
  }

  // 3. Contact legacy API fallback
  if (formType === "contact") {
    targets.push("/api/contact");
  }

  let success = false;
  let lastError = "";

  for (const url of targets) {
    try {
      // Google Apps Script requires text/plain or no-cors in fetch to avoid CORS preflight issues
      const isGoogleScript = url.includes("script.google.com");
      
      const response = await fetch(url, {
        method: "POST",
        headers: isGoogleScript
          ? { "Content-Type": "text/plain;charset=utf-8" }
          : { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        mode: isGoogleScript ? "cors" : "cors",
      });

      if (response.ok || response.type === "opaque") {
        success = true;
        break;
      }

      if (response.status === 404 || response.status === 503) {
        continue;
      }
    } catch (err) {
      lastError = err.message || "Network request failed";
    }
  }

  if (success) {
    return { ok: true, message: "Submitted successfully to Google Sheets!" };
  }

  // Fallback: If network is completely blocked or endpoint unavailable, attempt direct form post or no-cors beacon
  if (DEFAULT_SHEETS_URL && !DEFAULT_SHEETS_URL.startsWith("%")) {
    try {
      await fetch(DEFAULT_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      return { ok: true, message: "Submitted successfully!" };
    } catch {
      // Silent pass for no-cors beacon fallback
    }
  }

  return {
    ok: false,
    message: lastError || "Could not complete submission. Please check network connection.",
  };
}
