import React, { useState } from "react";

export default function Footer() {
    const [email, setEmail] = useState("");

    return (
        <footer
            style={{
                backgroundColor: "#ffffff",
                color: "#0a0a0a",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 3,
                borderTop: "1px solid rgba(0,0,0,0.12)",
            }}
        >
            <style>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    padding: 3rem 3rem 0;
                }
                .footer-email-row {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .footer-email-input {
                    padding: 0.7rem 1.1rem;
                    border: 1.5px solid rgba(0,0,0,0.2);
                    border-radius: 5px;
                    font-size: 0.9rem;
                    background: rgba(0,0,0,0.04);
                    color: #0a0a0a;
                    outline: none;
                    font-family: inherit;
                    width: 220px;
                    min-width: 0;
                }
                .footer-bottom-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.9rem 3rem;
                    border-top: 1px solid rgba(0,0,0,0.1);
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.7rem;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(10,10,10,0.4);
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                .footer-wordmark {
                    font-family: 'Gridular', 'Bebas Neue', sans-serif;
                    font-size: clamp(48px, 19vw, 300px);
                    color: #0a0a0a;
                    letter-spacing: -0.01em;
                    line-height: 0.78;
                    white-space: nowrap;
                    text-align: center;
                    width: 100%;
                }
                @media (max-width: 640px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        padding: 2rem 1.5rem 0;
                    }
                    .footer-email-input {
                        width: 100%;
                        flex: 1 1 100%;
                    }
                    .footer-bottom-bar {
                        padding: 0.9rem 1.5rem;
                        flex-direction: column;
                        align-items: flex-start;
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
            `}</style>

            {/* ── TOP SECTION: two columns (stacks on mobile) ── */}
            <div className="footer-grid">
                {/* LEFT — heading + email form */}
                <div>
                    <h2
                        style={{
                            fontFamily: "'Gridular', 'Bebas Neue', sans-serif",
                            fontSize: "clamp(2rem, 4vw, 3.5rem)",
                            lineHeight: 1.0,
                            color: "#0a0a0a",
                            letterSpacing: "-0.01em",
                            marginBottom: "2rem",
                            fontWeight: 400,
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
                                background: "#0a0a0a",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                fontSize: "0.82rem",
                                fontFamily: "'JetBrains Mono', monospace",
                                cursor: "pointer",
                                letterSpacing: "0.06em",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                whiteSpace: "nowrap",
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
                            color: "rgba(10,10,10,0.6)",
                            maxWidth: "44ch",
                            margin: 0,
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
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.13em",
                                    color: "rgba(10,10,10,0.5)",
                                    border: "1px solid rgba(0,0,0,0.18)",
                                    padding: "0.28rem 0.65rem",
                                    textDecoration: "none",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#0a0a0a";
                                    e.currentTarget.style.borderColor = "#0a0a0a";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "rgba(10,10,10,0.5)";
                                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)";
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

            {/* ── BOTTOM WORDMARK — always fits screen width ── */}
            <div style={{ overflow: "hidden", userSelect: "none", lineHeight: 0.78 }}>
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
