/**
 * Contact lead submission — production path with graceful degradation.
 *
 * Order:
 * 1. POST /api/contact (Vercel serverless when deployed)
 * 2. POST ${REACT_APP_BACKEND_URL}/api/contact
 * 3. Formspree if REACT_APP_FORMSPREE_ID is set
 * 4. Caller falls back to mailto:
 */

const CONTACT_EMAIL = "hello@dezhub.in";

function endpoints() {
  const list = [];
  if (typeof window !== "undefined") {
    list.push("/api/contact");
  }
  const backend = (process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
  if (backend) list.push(`${backend}/api/contact`);
  const formspreeId = process.env.REACT_APP_FORMSPREE_ID;
  if (formspreeId && !formspreeId.startsWith("%")) {
    list.push(`https://formspree.io/f/${formspreeId}`);
  }
  return list;
}

export function buildMailtoHref({ name, email, role, message }) {
  const subject = encodeURIComponent(`Genesis enquiry — ${role} — ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nI am a: ${role}\n\n${message}\n\n— Sent via genesis.in`,
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

export { CONTACT_EMAIL };

/**
 * @returns {Promise<{ ok: true } | { ok: false, reason: string }>}
 */
export async function submitContactLead(payload) {
  const body = {
    name: payload.name?.trim(),
    email: payload.email?.trim(),
    role: payload.role,
    message: payload.message?.trim(),
    source: "genesis-web-contact",
    submittedAt: new Date().toISOString(),
  };

  if (!body.name || !body.email || !body.message) {
    return { ok: false, reason: "missing_fields" };
  }

  const targets = endpoints();
  let lastReason = "no_endpoint";

  for (const url of targets) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) return { ok: true };

      // 404/501/503 → try next provider
      if (res.status === 404 || res.status === 501 || res.status === 503) {
        lastReason = `unavailable_${res.status}`;
        continue;
      }

      lastReason = `http_${res.status}`;
    } catch {
      lastReason = "network";
    }
  }

  return { ok: false, reason: lastReason };
}
