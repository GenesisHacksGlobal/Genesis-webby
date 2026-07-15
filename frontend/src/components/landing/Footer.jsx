import React from "react";

const LOGO_URL =
    "https://customer-assets.emergentagent.com/job_31a4271f-8bfb-44ef-a6c3-4b205b8fb50d/artifacts/iud9zkn6_logo.png";

export default function Footer() {
    return (
        <footer className="relative z-[3] border-t border-[var(--border)] bg-[var(--bg)]">
            <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
                <div className="grid md:grid-cols-12 gap-10">
                    <div className="md:col-span-5">
                        <div className="flex items-center gap-4">
                            <img src={LOGO_URL} alt="DezHub" className="w-14 h-14 border border-[var(--border)]" />
                            <div>
                                <div className="font-display text-2xl text-[var(--text)]">DezHub India</div>
                                <div className="overline mt-1">Learn · Earn · Grow</div>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-[var(--text-dim)] max-w-[40ch] leading-relaxed">
                            A community-led initiative building a structured freelance ecosystem.
                            Designed in the dark · shipped with the lights on.
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <div className="overline mb-4">Navigate</div>
                        <ul className="space-y-2 text-[var(--text-dim)]">
                            <li><a href="#about" className="link-draw">About</a></li>
                            <li><a href="#loop" className="link-draw">The Loop</a></li>
                            <li><a href="#events" className="link-draw">Events</a></li>
                            <li><a href="#gallery" className="link-draw">Gallery</a></li>
                            <li><a href="#contact" className="link-draw">Contact</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-4">
                        <div className="overline mb-4">Get in touch</div>
                        <a href="mailto:hello@dezhub.in" className="font-display text-2xl text-[var(--text)] link-draw">hello@dezhub.in</a>
                        <p className="mt-4 text-sm text-[var(--text-faint)] font-mono">
                            @DezHubIndia · IG · X · LinkedIn
                        </p>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-xs font-mono uppercase tracking-[0.18em] text-[var(--text-faint)]">
                    <span>© {new Date().getFullYear()} DezHub India · All rights reserved</span>
                    <span>Made in India · Built in the dark</span>
                </div>
            </div>
        </footer>
    );
}
