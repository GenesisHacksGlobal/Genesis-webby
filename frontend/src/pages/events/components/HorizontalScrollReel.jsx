import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function HorizontalScrollReel({ events, onSelect }) {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const trackRef = useRef(null);
  const marqueeRef = useRef(null);

  // Take top 8 highlight events for the horizontal reel
  const highlightEvents = events.slice(0, 8);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const marquee = marqueeRef.current;

    if (!section || !track) return;

    // Calculate total horizontal scroll distance
    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth + 120;
    };

    const ctx = gsap.context(() => {
      // Pin horizontal track on vertical scroll
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Move track horizontally
      timeline.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none',
      });

      // Move kinetic marquee text in opposite direction for parallax speed contrast
      if (marquee) {
        timeline.to(
          marquee,
          {
            xPercent: -30,
            ease: 'none',
          },
          0
        );
      }

      // Animate cards 3D tilt & scale as they pass the viewport center
      const cards = track.querySelectorAll('.reel-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.85, opacity: 0.5, rotateY: 12 },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: timeline,
              start: 'left 90%',
              end: 'left 40%',
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [highlightEvents]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0a0a0d] border-y border-white/10">
      {/* Background Kinetic Marquee driven by ScrollTrigger */}
      <div className="absolute top-12 left-0 right-0 pointer-events-none opacity-[0.04] overflow-hidden whitespace-nowrap">
        <div ref={marqueeRef} className="font-display text-[16vw] uppercase tracking-tighter text-white font-bold leading-none">
          FEATURED ARCHIVE • GENESIS 2022–2026 • MILESTONES • FEATURED ARCHIVE •
        </div>
      </div>

      <div ref={triggerRef} className="h-screen flex flex-col justify-center relative z-10 py-12">
        {/* Section Header */}
        <div className="px-6 sm:px-12 max-w-[1400px] w-full mx-auto mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              GSAP SCROLLTRIGGER // FEATURED REEL
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
              Curated Milestones
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-xs text-white/30">
            SCROLL DOWN TO REEL →
          </span>
        </div>

        {/* Horizontal Track Container */}
        <div className="w-full overflow-hidden">
          <div ref={trackRef} className="flex gap-8 px-6 sm:px-12 w-max items-center">
            {highlightEvents.map((event, idx) => (
              <div
                key={event.id}
                onClick={() => onSelect && onSelect(event)}
                className="reel-card w-[320px] sm:w-[420px] shrink-0 h-[440px] rounded-3xl border border-white/12 bg-white/[0.02] hover:bg-white/[0.05] p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-[var(--brand)]/50 hover:shadow-[0_20px_50px_rgba(196,181,253,0.15)]"
                style={{ perspective: '1000px' }}
              >
                {/* Background Image with Hover Parallax */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/70 to-transparent" />
                </div>

                {/* Card Top */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/20 text-[var(--brand)] bg-[var(--brand)]/10 rounded-full backdrop-blur-md">
                    {event.category}
                  </span>
                  <span className="font-mono text-xs text-white/50">{event.year}</span>
                </div>

                {/* Card Content */}
                <div className="relative z-10 space-y-3">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest block">
                    REEL RECORD #{event.id}
                  </span>
                  <h3 className="font-display text-2xl sm:text-4xl uppercase tracking-tight text-white group-hover:text-[var(--heading)] transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="font-sans text-xs text-white/60 line-clamp-2 font-light">
                    {event.location}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-white/40">
                  <span>{event.date || 'MILESTONE'}</span>
                  <span className="text-[var(--brand)] group-hover:translate-x-2 transition-transform">
                    EXPLORE ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
