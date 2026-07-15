import React, { useState } from "react";
import { motion } from "framer-motion";
import { LANDING } from "@/constants/testIds";

const CONTACT_EMAIL = "hello@dezhub.in";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", role: "freelancer", message: "" });
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.email || !form.message) {
            setError("Please fill in name, email and message.");
            return;
        }
        const subject = encodeURIComponent(`DezHub enquiry — ${form.role} — ${form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\nI am a: ${form.role}\n\n${form.message}\n\n— Sent via dezhub.in`,
        );
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        setStatus("success");
    };

    return (
        <section id="contact" className="relative py-28 md:py-40 z-[3] border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10">
                <div className="grid md:grid-cols-12 gap-12 md:gap-20">
                    {/* left */}
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="block w-10 h-px bg-[var(--text-dim)]" />
                            <span className="overline">Chapter 05 · Contact</span>
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tighter leading-[1.02] text-[var(--text)]"
                        >
                            Let's build something together.
                        </motion.h2>
                        <p className="mt-8 text-[var(--text-dim)] leading-relaxed max-w-[40ch]">
                            Freelancer, student, campus community or brand — drop a message and we'll
                            get back within 24–48 hours.
                        </p>

                        <div className="mt-12 space-y-8">
                            <div>
                                <div className="overline">Email</div>
                                <a
                                    href="mailto:hello@dezhub.in"
                                    className="mt-2 block font-display text-2xl text-[var(--text)] link-draw"
                                >
                                    hello@dezhub.in
                                </a>
                            </div>
                            <div>
                                <div className="overline">Socials</div>
                                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
                                    {["Instagram", "X / Twitter", "LinkedIn"].map((s) => (
                                        <a key={s} href="#" className="font-display text-xl text-[var(--text-dim)] link-draw hover:text-[var(--text)] transition-colors">
                                            {s}
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

                    {/* form */}
                    <div className="md:col-span-7">
                        {status === "success" ? (
                            <motion.div
                                data-testid={LANDING.contactSuccess}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="border border-[var(--border)] p-12 bg-[var(--surface)]"
                            >
                                <div className="overline">Message received</div>
                                <h4 className="mt-4 font-display text-3xl md:text-4xl text-[var(--text)]">
                                    Thanks for reaching out. <br /> We'll write back within 48 hours.
                                </h4>
                                <button onClick={() => setStatus("idle")} className="btn-ghost mt-8">
                                    Send another message
                                </button>
                            </motion.div>
                        ) : (
                            <form
                                data-testid={LANDING.contactForm}
                                onSubmit={onSubmit}
                                className="border border-[var(--border)] p-8 md:p-12 bg-[var(--surface)] flex flex-col gap-8"
                            >
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <input
                                        data-testid={LANDING.contactName}
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Name"
                                        className="input-line"
                                    />
                                    <input
                                        data-testid={LANDING.contactEmail}
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="Email"
                                        className="input-line"
                                    />
                                </div>

                                <div>
                                    <div className="overline mb-3">I am reaching out as</div>
                                    <select
                                        data-testid={LANDING.contactRole}
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        className="input-line cursor-pointer appearance-none"
                                    >
                                        <option value="freelancer" className="bg-[var(--bg)]">Freelancer / individual</option>
                                        <option value="student" className="bg-[var(--bg)]">Student / college community</option>
                                        <option value="brand" className="bg-[var(--bg)]">Startup / brand</option>
                                        <option value="other" className="bg-[var(--bg)]">Other</option>
                                    </select>
                                </div>

                                <textarea
                                    data-testid={LANDING.contactMessage}
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    placeholder="Tell us a little about you & what you're after…"
                                    className="input-line resize-none"
                                />

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--text-faint)] max-w-[28ch]">
                                        By submitting, you agree to be contacted by the DezHub team.
                                    </p>
                                    <button
                                        data-testid={LANDING.contactSubmit}
                                        type="submit"
                                        className="btn-cinema"
                                    >
                                        Send message
                                        <span aria-hidden>→</span>
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-xs font-mono text-red-300/80">{error}</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
