import React from "react";

/**
 * Collaboration brands. Prefer /brand-logos/*.webp (optimized).
 * Missing logo → text fallback until asset is added + converted.
 */
const BRANDS = [
  { name: "AbhiBus", logo: null },
  { name: "Akai Space", logo: null },
  { name: "AlgoBharat", logo: null },
  { name: "Algorand Foundation", logo: null },
  { name: "Daytona", logo: null },
  { name: "Devfolio", logo: null },
  { name: "Duality AI", logo: "/brand-logos/duality-ai.webp" },
  { name: "EigenCloud", logo: null },
  { name: "Endless Domain", logo: null },
  { name: "ETHIndia", logo: "/brand-logos/ethindia.webp" },
  { name: "GitHub", logo: null },
  { name: "Google", logo: "/brand-logos/google.webp" },
  { name: "HackCulture", logo: null },
  { name: "KodeMaster AI", logo: null },
  { name: "Logitech", logo: null },
  { name: "Microsoft", logo: null },
  { name: "Microsoft Azure", logo: "/brand-logos/microsoft-azure.webp" },
  { name: "Physics Wallah (PW)", logo: "/brand-logos/physics-wallah.webp" },
  { name: "Polygon", logo: null },
  { name: "Reskill", logo: null },
  { name: "Stellar", logo: null },
  { name: "TON", logo: "/brand-logos/ton.webp" },
  { name: "Unstop", logo: null },
  { name: "Vercel", logo: null },
  { name: "Wormhole", logo: null },
];

function BrandMark({ brand }) {
  if (brand.logo) {
    return (
      <span
        role="img"
        aria-label={brand.name}
        title={brand.name}
        className="inline-block h-32 w-40 shrink-0 opacity-90 transition-opacity duration-300 hover:opacity-100 md:h-40 md:w-48"
        style={{
          backgroundColor: "var(--heading)",
          WebkitMaskImage: `url(${brand.logo})`,
          maskImage: `url(${brand.logo})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }

  return (
    <span className="font-display text-3xl leading-none text-[var(--heading)] md:text-5xl">
      {brand.name}
    </span>
  );
}

export default function Marquee() {
  const track = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section
      className="relative overflow-hidden border-y border-border bg-transparent py-6 md:py-10"
      aria-label="Brands we've collaborated with"
    >
      <div className="overflow-hidden py-3 md:py-4">
        <div
          className="inline-flex items-center gap-10 whitespace-nowrap md:gap-16"
          style={{
            animation: "marquee-ltr 70s linear infinite",
          }}
        >
          {track.map((brand, i) => (
            <React.Fragment key={`${brand.name}-${i}`}>
              <BrandMark brand={brand} />
              <span
                className="font-display text-2xl leading-none text-[var(--text-faint)] md:text-4xl"
                aria-hidden
              >
                ✦
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-ltr {
          from { transform: translateX(-33.333%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
