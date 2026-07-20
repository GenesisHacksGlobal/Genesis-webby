import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Post-sequence landing — Sui "Innovation, engineered." beat.
 * Heading starts hidden; ScrollSequence reveals it at frame 50 with
 * gsap.fromTo { y:50%, scale:0.7, opacity:0 } → { scale:1, y:0%, opacity:1,
 * duration:1 } — default power1.out ease, no extra easing.
 */
export default function TheLoop({
  heading = "Learn / Earn / Grow.",
  subtitle = "The Genesis loop for builders who ship.",
}) {
  const headingRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const hEl = headingRef.current;
    const bEl = bodyRef.current;
    if (hEl) gsap.set(hEl, { opacity: 0, y: "50%", scale: 0.7 });
    if (bEl) gsap.set(bEl, { opacity: 0, y: "20%" });
  }, []);

  return (
    <section
      id="loop"
      data-seq-reveal
      className="relative z-[45] min-h-[100vh] w-full bg-[#181818] text-white"
      aria-label="The Loop"
    >
      <div className="flex min-h-[100vh] flex-col items-center justify-center px-6 md:px-10 py-28">
        <div className="flex max-w-[20ch] flex-col items-center text-center">
          <h2
            ref={headingRef}
            data-seq-reveal-heading
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[90px] tracking-tighter leading-[0.95] text-white/90 will-change-transform"
          >
            {heading}
          </h2>
          <div
            ref={bodyRef}
            data-seq-reveal-body
            className="mt-8 flex items-center justify-center gap-3 max-w-[36ch] will-change-transform"
          >
            <span className="hidden sm:block h-3 w-3 shrink-0 bg-[#4DA2FF]" />
            <p className="text-base md:text-lg text-white/55 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        <div
          className="mt-24 grid w-full max-w-[1100px] gap-6 md:grid-cols-3 opacity-0 pointer-events-none"
          aria-hidden="true"
        >
          {["Learn", "Earn", "Grow"].map((label) => (
            <div
              key={label}
              className="min-h-[180px] border border-white/10 p-6 md:p-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
                Coming soon
              </div>
              <div className="mt-4 font-display text-3xl tracking-tight text-white/80">
                {label}.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
