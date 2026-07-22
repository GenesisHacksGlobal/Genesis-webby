import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPOTLIGHT_MEMBERS } from '@shared/data/teamMembers';

gsap.registerPlugin(ScrollTrigger);

export function TeamSpotlightReel({ onSelect }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const marqueeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const marquee = marqueeRef.current;
    if (!section || !track) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
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

      timeline.to(track, { x: () => -getScrollAmount(), ease: 'none' });

      if (marquee) {
        timeline.to(marquee, { xPercent: -40, ease: 'none' }, 0);
      }

      const cards = track.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.82, opacity: 0.4, rotateY: 18, filter: 'blur(4px)' },
          {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: timeline,
              start: 'left 95%',
              end: 'left 35%',
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0a0a0d] border-y border-white/10">
      <div className="absolute top-8 left-0 right-0 pointer-events-none opacity-[0.035] overflow-hidden whitespace-nowrap">
        <div
          ref={marqueeRef}
          className="font-display text-[14vw] uppercase tracking-tighter text-white font-bold leading-none"
        >
          SPOTLIGHT • GENESIS CREW • BUILDERS • SPOTLIGHT • GENESIS CREW •
        </div>
      </div>

      <div className="h-screen flex flex-col justify-center relative z-10 py-12">
        <div className="px-6 sm:px-12 max-w-[1400px] w-full mx-auto mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Scroll Choreography // Spotlight Reel
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
              Faces Behind Genesis
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-xs text-white/30">
            SCROLL TO REEL →
          </span>
        </div>

        <div className="w-full overflow-hidden">
          <div ref={trackRef} className="flex gap-6 sm:gap-8 px-6 sm:px-12 w-max items-stretch">
            {SPOTLIGHT_MEMBERS.map((member) => (
              <button
                type="button"
                key={member.id}
                onClick={() => onSelect?.(member)}
                className="spotlight-card w-[280px] sm:w-[360px] shrink-0 rounded-3xl border border-white/12 bg-white/[0.02] hover:bg-white/[0.05] overflow-hidden relative group cursor-pointer transition-colors duration-500 hover:border-[var(--brand)]/40 text-left"
                style={{ perspective: '1000px' }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-40 group-hover:opacity-20 transition-opacity"
                    style={{ background: `linear-gradient(160deg, ${member.color}80, transparent 60%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/30 to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[10px] text-white/50 px-2 py-1 rounded-full border border-white/15 bg-black/30 backdrop-blur-sm">
                    #{member.id}
                  </span>
                </div>

                <div className="p-6 space-y-2">
                  <span
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: member.color }}
                  >
                    {member.dept}
                  </span>
                  <h3 className="font-display text-2xl uppercase tracking-tight text-white group-hover:text-[var(--heading)] transition-colors">
                    {member.name}
                  </h3>
                  <p className="font-sans text-xs text-white/55 line-clamp-2">{member.bio}</p>
                  <span className="inline-block pt-2 font-mono text-[10px] text-[var(--brand)] group-hover:translate-x-1 transition-transform">
                    VIEW PROFILE →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
