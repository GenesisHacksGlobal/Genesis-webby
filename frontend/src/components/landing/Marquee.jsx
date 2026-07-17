import React from "react";

const row1 = [
    { t: "Designers", s: "lg" },
    { t: "✦", s: "sm" },
    { t: "Developers", s: "lg", italic: true },
    { t: "⟶", s: "md" },
    { t: "Content writers", s: "xl" },
    { t: "○", s: "md" },
    { t: "Marketers", s: "lg" },
    { t: "✦", s: "sm" },
    { t: "Product folks", s: "xl", italic: true },
    { t: "⟶", s: "md" },
    { t: "Ops & PMs", s: "lg" },
    { t: "○", s: "sm" },
    { t: "Founders", s: "xl" },
    { t: "✦", s: "md" },
    { t: "Editors", s: "lg", italic: true },
];
const row2 = [
    { t: "Hybrid", s: "md" },
    { t: "·", s: "sm" },
    { t: "Online", s: "lg" },
    { t: "·", s: "sm" },
    { t: "Offline", s: "lg", italic: true },
    { t: "·", s: "sm" },
    { t: "Cohorts", s: "md" },
    { t: "·", s: "sm" },
    { t: "Briefs", s: "lg" },
    { t: "·", s: "sm" },
    { t: "Gigs", s: "xl", italic: true },
    { t: "·", s: "sm" },
    { t: "Jams", s: "md" },
    { t: "·", s: "sm" },
    { t: "Reviews", s: "lg" },
];

const sizes = {
    sm: "text-2xl md:text-3xl text-[var(--text-faint)]",
    md: "text-3xl md:text-5xl text-[var(--text-dim)]",
    lg: "text-4xl md:text-6xl text-[var(--heading)]",
    xl: "text-5xl md:text-7xl text-[var(--heading)]",
};

function Row({ items, dir = "left", speed = 38 }) {
    const dup = [...items, ...items, ...items];
    return (
        <div className="overflow-hidden py-3">
            <div
                className="inline-flex gap-10 md:gap-16 whitespace-nowrap"
                style={{
                    animation: `marquee-${dir} ${speed}s linear infinite`,
                }}
            >
                {dup.map((it, i) => (
                    <span
                        key={i}
                        className={`font-display ${sizes[it.s]} leading-none`}
                    >
                        {it.t}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Marquee() {
    return (
        <section className="border-y border-border py-6 md:py-10 overflow-hidden bg-transparent relative">
            <Row items={row1} dir="left" speed={42} />
            <Row items={row2} dir="right" speed={56} />

            <style>{`
                @keyframes marquee-left {
                    from { transform: translateX(0); }
                    to { transform: translateX(-33.333%); }
                }
                @keyframes marquee-right {
                    from { transform: translateX(-33.333%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}
