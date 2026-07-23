import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPOTLIGHT_MEMBERS } from '@shared/data/teamMembers';

gsap.registerPlugin(ScrollTrigger);

export function TeamSpotlightReel({ onSelect }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const marqueeRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const marquee = marqueeRef.current;
    const progressBar = progressRef.current;

    if (!section || !track) return;

    const getScrollAmount = () => track.scrollWidth - window.innerWidth + 120;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBar) {
              progressBar.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      // Horizontal track movement
      timeline.to(track, { x: () => -getScrollAmount(), ease: 'none' });

      // Opposite direction marquee text movement
      if (marquee) {
        timeline.to(marquee, { xPercent: -35, ease: 'none' }, 0);
      }

      // Card scale & blur choreography as they slide into view
      const cards = track.querySelectorAll('.spotlight-card');
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.85, opacity: 0.35, rotateY: 15, filter: 'blur(6px)' },
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

  // Card mouse tilt effect
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section
      id="spotlight-reel"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#070709] border-y border-white/10"
    >
      {/* Background kinetic watermark */}
      <div className="absolute top-12 left-0 right-0 pointer-events-none opacity-[0.03] overflow-hidden whitespace-nowrap z-0">
        <div
          ref={marqueeRef}
          className="font-display text-[15vw] uppercase tracking-tighter text-white font-bold leading-none select-none"
        >
          GENESIS CREW • LEADERSHIP • BUILDERS • SPOTLIGHT REEL • CREATORS •
        </div>
      </div>

      <div className="h-screen flex flex-col justify-center relative z-10 py-10">
        {/* Section Header */}
        <div className="px-6 sm:px-12 max-w-[1400px] w-full mx-auto mb-8 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--brand)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-pulse" />
              Scroll Choreography // Spotlight Reel
            </span>
            <h2 className="font-display text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
              Spotlight Roster
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-white/40">
            <span>SCROLL DOWN TO SLIDE REEL</span>
            <span className="w-8 h-px bg-white/20" />
            <span className="text-[var(--brand)]">→</span>
          </div>
        </div>

        {/* Horizontal Reel Track */}
        <div className="w-full overflow-hidden">
          <div ref={trackRef} className="flex gap-6 sm:gap-8 px-6 sm:px-12 w-max items-stretch pb-4">
            {SPOTLIGHT_MEMBERS.map((member) => (
              <div
                key={member.id}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                onClick={() => onSelect?.(member)}
                style={{ transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                className="spotlight-card w-[290px] sm:w-[370px] shrink-0 rounded-3xl border border-white/12 bg-white/[0.02] hover:bg-white/[0.05] overflow-hidden relative group cursor-pointer transition-colors duration-500 hover:border-white/30 text-left flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                {/* Image & Photo Frame */}
                <div className="aspect-[3/4] relative overflow-hidden bg-black/40">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div
                    className="absolute inset-0 mix-blend-multiply opacity-50 group-hover:opacity-30 transition-opacity"
                    style={{ background: `linear-gradient(160deg, ${member.color}90, transparent 65%)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/20 to-transparent opacity-90" />

                  {/* ID Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-white/70 px-2.5 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md font-bold">
                      #{member.id}
                    </span>
                  </div>

                  {/* Department Pill */}
                  <div
                    className="absolute top-4 right-4 px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider border font-medium backdrop-blur-md"
                    style={{
                      borderColor: `${member.color}40`,
                      background: `${member.color}15`,
                      color: member.color,
                    }}
                  >
                    {member.dept}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between relative z-10 border-t border-white/8">
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-tight text-white group-hover:text-[var(--brand)] transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-mono text-[11px] uppercase tracking-wider mt-0.5" style={{ color: member.color }}>
                      {member.role}
                    </p>
                    <p className="font-sans text-xs text-white/55 leading-relaxed mt-2 line-clamp-2">
                      {member.bio}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-white/40 group-hover:text-white transition-colors">
                      Explore Profile
                    </span>
                    <span
                      className="font-mono text-xs font-bold transition-transform group-hover:translate-x-1"
                      style={{ color: member.color }}
                    >
                      DOSSIER →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reel Progress Bar */}
        <div className="px-6 sm:px-12 max-w-[1400px] w-full mx-auto mt-6">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-[var(--brand)] to-white origin-left transition-transform duration-100 ease-out"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
