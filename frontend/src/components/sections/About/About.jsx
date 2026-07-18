import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Adapted from inspo-animation `component--gridnumbers.vertical`
 * (tresmares capital home About stats block).
 *
 * Structure:
 *  - left sticky editorial copy
 *  - right: two stacked card columns
 *  - second column offset downward (10vw)
 *  - cards enter with magnet-style upward animation;
 *    second column starts later because of offset + delay
 */

const columns = [
  [
    { title: "HACK", label: "Hackathons built around real challenges" },
    { title: "BUILD", label: "Hands-on workshops that turn ideas into projects" },
    { title: "SHIP", label: "Real projects taken from concept to launch" },
  ],
  [
    { title: "SPEAK", label: "Speaker sessions with industry builders" },
    { title: "LEARN", label: "Practical knowledge shared by the community" },
    { title: "SCALE", label: "Community-led experiences across India" },
  ],
];

// Exact easing used by the inspiration: 1 - 2^(-10t).
const expoOut = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function MagnetCard({ title, label, isLast = false }) {
  const cardRef = useRef(null);
  const [entranceDelay, setEntranceDelay] = useState(0);

  useLayoutEffect(() => {
    const measureDelay = () => {
      if (!cardRef.current) return;

      // Exact inspo formula:
      // delay: 0.00025 * element.getBoundingClientRect().left
      setEntranceDelay(
        Math.max(0, cardRef.current.getBoundingClientRect().left * 0.00025),
      );
    };

    measureDelay();
    window.addEventListener("resize", measureDelay);
    return () => window.removeEventListener("resize", measureDelay);
  }, []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0.0001, y: "2.5vw", scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 2, delay: entranceDelay, ease: expoOut }}
      className={[
        "relative flex h-[55vw] w-full flex-col justify-between border border-[#d5d5d5] p-[6.667vw]",
        "md:h-[25vw] md:w-[20vw] md:border-y-0 md:border-l md:border-r md:border-[#d5d5d5] md:p-[1.667vw]",
        "md:border-t",
        isLast ? "md:border-b" : "",
      ].join(" ")}
    >
      <h3
        style={{ fontFamily: '"Aeonik", sans-serif' }}
        className="text-[12vw] leading-[0.82] tracking-[-0.05em] text-black md:text-[clamp(3.5rem,5.2vw,6.25rem)]"
      >
        {title}
      </h3>
      <p className="max-w-[18ch] text-[3.6vw] leading-snug text-black/70 md:w-[80%] md:max-w-none md:text-base">
        {label}
      </p>
    </motion.article>
  );
}

export default function About() {
  const leftColRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // inspo: content-1 parallax scrubbed against content-0 scroll range
  const { scrollYProgress } = useScroll({
    target: leftColRef,
    offset: ["start end", "end start"],
  });
  // Exact inspo value: appStore.px(-480) = -480 / 2400 = -20vw.
  const rightColY = useTransform(scrollYProgress, [0, 1], ["0vw", "-20vw"]);

  return (
    <section
      id="about"
      className="relative z-[3] bg-white py-[10vw] text-black md:pb-[3.333vw] md:pt-[10vw]"
    >
      <div className="mx-auto w-full px-5 md:w-[70vw] md:px-0">
        <div className="flex flex-col gap-[20vw] md:flex-row md:gap-0 md:justify-between">
          {/* Left sticky editorial — inspo item:first-child */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: expoOut }}
            className="w-full md:sticky md:top-[11.667vw] md:h-fit md:w-[20vw]"
          >
            <div className="flex items-center gap-3">
              <span className="block h-px w-10 bg-black/30" />
              <span className="overline !text-black/45">Chapter 01 · About</span>
            </div>

            <p className="mt-8 text-[5.2vw] leading-[1.25] tracking-[-0.02em] text-black/65 md:mt-[1.667vw] md:text-[1.15vw] md:leading-[1.35]">
              Genesis empowers the next generation of builders by creating space
              to learn, experiment, collaborate, and ship meaningful work across
              India.
            </p>

            <a
              href="#upcoming"
              className="mt-6 inline-block border-b border-black/50 pb-1 text-sm text-black/70 transition-colors hover:text-black md:mt-[1.667vw]"
            >
              Discover our experiences
            </a>
          </motion.div>

          {/* Right metric columns — inspo item:last-child */}
          <div className="flex w-full flex-col md:w-[40vw] md:flex-row md:justify-center">
            {/* content-0 */}
            <div ref={leftColRef} className="flex w-full flex-col md:w-[20vw]">
              {columns[0].map((card, i) => (
                <MagnetCard
                  key={card.title}
                  title={card.title}
                  label={card.label}
                  isLast={i === columns[0].length - 1}
                />
              ))}
            </div>

            {/* content-1 — offset + delayed entrance + subtle parallax */}
            <motion.div
              style={isDesktop ? { y: rightColY } : undefined}
              className="mt-[20vw] flex w-full flex-col md:mt-[10vw] md:w-[20vw] md:-ml-px"
            >
              {columns[1].map((card, i) => (
                <MagnetCard
                  key={card.title}
                  title={card.title}
                  label={card.label}
                  isLast={i === columns[1].length - 1}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
