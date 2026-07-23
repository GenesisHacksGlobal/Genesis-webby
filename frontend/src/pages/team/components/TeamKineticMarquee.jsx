import React from 'react';
import {
  ScrollAnimation,
  ScrollScale,
  ScrollTranslateX,
  ScrollTranslateY,
  ScrollRotate,
  ScrollBlur,
  ScrollLetterSpacing,
  ScrollOpacity,
} from '@/components/ui/team-section';
import { SPOTLIGHT_MEMBERS } from '@shared/data/teamMembers';

function MarqueeCard({ member, index }) {
  return (
    <div
      className="min-w-[45vw] md:min-w-[17vw] space-y-3 rounded-2xl border border-white/12 bg-[#0f0f14] overflow-hidden group shadow-xl p-3 text-left"
      style={{ transform: `rotate(${index % 2 === 0 ? -1.5 : 1.5}deg)` }}
    >
      <div className="w-full aspect-[4/3] overflow-hidden relative rounded-xl bg-black/40">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-color"
          style={{ background: member.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-transparent opacity-80" />
      </div>
      <div className="space-y-0.5 px-1">
        <h3 className="text-base font-display uppercase tracking-tight text-white group-hover:text-[var(--brand)] transition-colors truncate">
          {member.name}
        </h3>
        <p className="font-mono text-[10px] uppercase tracking-wider truncate" style={{ color: member.color }}>
          {member.role}
        </p>
      </div>
    </div>
  );
}

export function TeamKineticMarquee() {
  const rowA = SPOTLIGHT_MEMBERS;
  const rowB = [...SPOTLIGHT_MEMBERS].reverse();

  return (
    <ScrollAnimation spacerClass="h-[40vh]" className="overflow-hidden py-12 bg-[#070709] border-t border-white/8">
      <ScrollTranslateY
        yRange={[60, -60]}
        inputRange={[0, 1]}
        className="min-h-[90vh] flex flex-col justify-center items-center gap-10"
      >
        {/* Top Scrolling Row */}
        <ScrollOpacity inputRange={[0, 0.15]} opacityRange={[0, 1]} className="w-full">
          <ScrollTranslateX
            xRange={['-200%', '5%']}
            inputRange={[0.15, 0.85]}
            className="origin-bottom flex flex-nowrap gap-4 md:gap-6"
          >
            {rowA.map((member, index) => (
              <ScrollRotate
                key={`a-${member.id}`}
                inputRange={[0.15, 0.85]}
                rotateRange={[index % 2 === 0 ? -6 : 6, 0]}
              >
                <MarqueeCard member={member} index={index} />
              </ScrollRotate>
            ))}
          </ScrollTranslateX>
        </ScrollOpacity>

        {/* Central Kinetic Typography Section */}
        <ScrollScale
          inputRange={[0.1, 0.55]}
          scaleRange={[1.35, 1]}
          className="w-11/12 max-w-4xl flex flex-col justify-center text-center items-center mx-auto origin-center py-6 px-4"
        >
          <ScrollLetterSpacing
            inputRange={[0.1, 0.55]}
            spacingRange={['0.35em', '-0.02em']}
            className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tight text-white leading-tight"
          >
            ENGINEERED FOR <span className="text-[var(--brand)] font-bold">EXCELLENCE</span> • UNITED BY <span className="text-white">OBSESSION</span>
          </ScrollLetterSpacing>
          <ScrollBlur inputRange={[0.2, 0.5]} blurRange={[6, 0]} className="mt-4">
            <p className="font-sans text-sm md:text-base text-white/50 max-w-lg leading-relaxed">
              Every line of code, every pixel, every event detail — carefully orchestrated by a passionate team of creators.
            </p>
          </ScrollBlur>
        </ScrollScale>

        {/* Bottom Opposing Scrolling Row */}
        <ScrollOpacity inputRange={[0.25, 0.9]} opacityRange={[0, 1]} className="w-full">
          <ScrollTranslateX
            inputRange={[0.2, 0.9]}
            xRange={['110%', '-50%']}
            className="flex flex-nowrap gap-4 md:gap-6"
          >
            {rowB.map((member, index) => (
              <ScrollRotate
                key={`b-${member.id}`}
                inputRange={[0.2, 0.9]}
                rotateRange={[index % 2 === 0 ? 6 : -6, 0]}
              >
                <MarqueeCard member={member} index={index + 1} />
              </ScrollRotate>
            ))}
          </ScrollTranslateX>
        </ScrollOpacity>
      </ScrollTranslateY>
    </ScrollAnimation>
  );
}
