import React, { useEffect, useState } from "react";
import BlackHole from "@/components/ui/BlackHole";
import { prefersReducedMotion } from "@/hooks/useAnimationLifecycle";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [particleCount, setParticleCount] = useState(520);
    const [enableBlackHole, setEnableBlackHole] = useState(false);

    useEffect(() => {
        const narrow = window.matchMedia("(max-width: 768px)");
        const saveData = navigator.connection?.saveData;
        const apply = () => {
            const reduced = prefersReducedMotion();
            setEnableBlackHole(!reduced && !saveData);
            setParticleCount(narrow.matches ? 280 : 520);
        };
        apply();
        narrow.addEventListener("change", apply);
        const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
        motionMq.addEventListener?.("change", apply);
        return () => {
            narrow.removeEventListener("change", apply);
            motionMq.removeEventListener?.("change", apply);
        };
    }, []);

    return (
        <footer
            className="site-footer"
            style={{
                backgroundColor: "transparent",
                color: "var(--text)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 3,
                borderTop: "1px solid var(--border)",
            }}
        >
            <style>{`
                .site-footer {
                    min-height: var(--app-height);
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    padding: 3rem 3rem 0;
                    position: relative;
                    z-index: 2;
                }
                .footer-email-row {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .footer-email-input {
                    padding: 0.7rem 1.1rem;
                    border: 1.5px solid var(--border-strong);
                    border-radius: 5px;
                    font-size: 0.9rem;
                    background: var(--surface);
                    color: var(--text);
                    outline: none;
                    font-family: var(--font-sans);
                    width: 220px;
                    min-width: 0;
                }
                .footer-email-input::placeholder {
                    color: var(--text-faint);
                }
                .footer-bottom-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.9rem 3rem;
                    border-top: 1px solid var(--border);
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--text-faint);
                    gap: 1rem;
                    flex-wrap: wrap;
                    position: relative;
                    z-index: 2;
                    background: linear-gradient(to top, var(--bg) 60%, transparent);
                }
                .footer-wordmark-stage {
                    position: relative;
                    overflow: hidden;
                    user-select: none;
                    width: 100%;
                    /* Square-ish stage so full disk diameter fits (radius ≈ half width) */
                    height: min(78vw, 720px);
                    min-height: min(78vw, 720px);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    isolation: isolate;
                }
                .footer-blackhole {
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0.95;
                }
                .footer-wordmark {
                    position: relative;
                    z-index: 1;
                    font-family: var(--font-display);
                    font-size: clamp(48px, 19vw, 300px);
                    color: var(--heading);
                    letter-spacing: -0.01em;
                    line-height: 0.78;
                    white-space: nowrap;
                    text-align: center;
                    width: 100%;
                    text-transform: uppercase;
                    text-shadow: 0 2px 28px rgba(10, 4, 67, 0.65);
                    padding-bottom: 0.06em;
                }
                @media (max-width: 640px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                        padding: 3.5rem 1.5rem 0;
                    }
                    .footer-email-input {
                        width: 100%;
                        flex: 1 1 100%;
                    }
                    .footer-bottom-bar {
                        padding: 1.1rem 1.5rem;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.75rem;
                    }
                    .footer-wordmark-stage {
                        height: min(82vw, 420px);
                        min-height: min(82vw, 420px);
                        margin-top: 2.5rem;
                    }
                    .footer-wordmark {
                        font-size: clamp(44px, 19vw, 300px);
                    }
                }
                @media (min-width: 641px) and (max-width: 900px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        padding: 2.5rem 2rem 0;
                    }
                    .footer-wordmark {
                        font-size: clamp(56px, 19vw, 300px);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .footer-blackhole {
                        display: none;
                    }
                }
            `}</style>

            {/* ── TOP SECTION: two columns (stacks on mobile) ── */}
            <div className="footer-grid">
                {/* LEFT — heading + email form */}
                <div>
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(2rem, 4vw, 3.5rem)",
                            lineHeight: 1.0,
                            color: "var(--heading)",
                            letterSpacing: "-0.01em",
                            marginBottom: "2rem",
                            fontWeight: 400,
                            textTransform: "uppercase",
                        }}
                    >
                        Drop us a line
                    </h2>

                    <div className="footer-email-row">
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="footer-email-input"
                        />
                        <button
                            style={{
                                padding: "0.7rem 1.4rem",
                                background: "var(--text)",
                                color: "#0a0443",
                                border: "none",
                                borderRadius: "5px",
                                fontSize: "0.82rem",
                                fontFamily: "var(--font-sans)",
                                cursor: "pointer",
                                letterSpacing: "0.06em",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                whiteSpace: "nowrap",
                                textTransform: "uppercase",
                            }}
                        >
                            Contact →
                        </button>
                    </div>
                </div>

                {/* RIGHT — description + social pills */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <p
                        style={{
                            fontSize: "0.9rem",
                            lineHeight: 1.75,
                            color: "var(--text-dim)",
                            maxWidth: "44ch",
                            margin: 0,
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        Book a meeting or leave a request. We're ready to embark on this journey with you. Are you?
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {["EMAIL", "INSTAGRAM", "FACEBOOK", "LINKEDIN", "AWWWARDS", "BEHANCE"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                style={{
                                    fontFamily: "var(--font-mono)",
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.13em",
                                    color: "var(--text-faint)",
                                    border: "1px solid var(--border)",
                                    padding: "0.28rem 0.65rem",
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "var(--text)";
                                    e.currentTarget.style.borderColor = "var(--border-strong)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "var(--text-faint)";
                                    e.currentTarget.style.borderColor = "var(--border)";
                                }}
                            >
                                [ {link} ]
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MIDDLE SPACER ── */}
            <div style={{ flex: 1 }} />

            {/* ── BOTTOM WORDMARK + Black Hole behind GENESIS ── */}
            <div className="footer-wordmark-stage" aria-hidden={false}>
                {enableBlackHole && (
                    <div className="footer-blackhole" aria-hidden="true">
                        <BlackHole
                            particleCount={particleCount}
                            particleSize={5}
                            colors={["#ffffff", "#e9e4ff", "#c4b5fd"]}
                            outerRadius={78}
                            tilt={18}
                            tiltSideway={158}
                            trail={48}
                            orbitSpeed={3.6}
                            pullSpeed={0}
                            voidColor="#0a0443"
                            background="transparent"
                            centre={{ voidRadius: 74, voidX: 50, voidY: 34 }}
                        />
                    </div>
                )}
                <div className="footer-wordmark">GENESIS</div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="footer-bottom-bar">
                <span>©{new Date().getFullYear()}, All rights reserved</span>
                <div style={{ display: "flex", gap: "1.5rem" }}>
                    <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
                    <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
}
