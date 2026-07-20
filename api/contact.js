/**
 * Vercel serverless contact intake.
 * Set FORMSPREE_ID or RESEND_API_KEY + CONTACT_TO_EMAIL in Vercel env.
 * Without a provider, returns 503 so the client can fall back to mailto.
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function json(res, status, data) {
  res.statusCode = status;
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === "object") {
      resolve(req.body);
      return;
    }
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new Error("body_too_large"));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("invalid_json"));
      }
    });
    req.on("error", reject);
  });
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }

  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch (err) {
    json(res, 400, { ok: false, error: err.message || "bad_request" });
    return;
  }

  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const role = String(payload.role || "other").trim();
  const message = String(payload.message || "").trim();

  if (!name || !validEmail(email) || !message) {
    json(res, 400, { ok: false, error: "validation_failed" });
    return;
  }

  if (name.length > 200 || message.length > 5000) {
    json(res, 400, { ok: false, error: "payload_too_large" });
    return;
  }

  const formspreeId = process.env.FORMSPREE_ID || process.env.REACT_APP_FORMSPREE_ID;
  if (formspreeId) {
    const fsRes = await fetch(`https://formspree.io/f/${formspreeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, email, role, message, _subject: `Genesis enquiry — ${role} — ${name}` }),
    });
    if (fsRes.ok) {
      json(res, 200, { ok: true, provider: "formspree" });
      return;
    }
    json(res, 502, { ok: false, error: "formspree_failed" });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || "hello@dezhub.in";
  if (resendKey) {
    const rs = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Genesis <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `Genesis enquiry — ${role} — ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nRole: ${role}\n\n${message}`,
      }),
    });
    if (rs.ok) {
      json(res, 200, { ok: true, provider: "resend" });
      return;
    }
    json(res, 502, { ok: false, error: "resend_failed" });
    return;
  }

  // No provider configured — client should use mailto fallback
  json(res, 503, {
    ok: false,
    error: "no_provider",
    hint: "Set FORMSPREE_ID or RESEND_API_KEY on Vercel",
  });
};
