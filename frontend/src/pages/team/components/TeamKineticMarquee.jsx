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
      className="min-w-[48vw] md:min-w-[18vw] space-y-4 rounded-2xl border border-white/10 bg-[#121217] overflow-hidden group shadow-lg"
      style={{ transform: `rotate(${index % 2 === 0 ? -2 : 2}deg)` }}
    >
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          src={member.photo}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-color"
          style={{ background: member.color }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-transparent to-transparent opacity-90" />
      </div>
      <div className="space-y-1 pb-4 px-4">
        <h3 className="text-lg font-display uppercase tracking-tight text-white">{member.name}</h3>
        <h4 className="font-mono text-xs uppercase tracking-wider" style={{ color: member.color }}>
          {member.role}
        </h4>
      </div>
    </div>
  );
}

export function TeamKineticMarquee() {
  const rowA = SPOTLIGHT_MEMBERS;
  const rowB = [...SPOTLIGHT_MEMBERS].reverse();

  return (
    <ScrollAnimation spacerClass="h-[50vh]" className="overflow-hidden py-8">
      <ScrollTranslateY
        yRange={[80, -80]}
        inputRange={[0, 1]}
        className="min-h-svh flex flex-col justify-center items-center gap-10"
      >
        <ScrollOpacity inputRange={[0, 0.15]} opacityRange={[0, 1]} className="w-full">
          <ScrollTranslateX
            xRange={['-220%', '5%']}
            inputRange={[0.2, 0.85]}
            className="origin-bottom flex flex-nowrap gap-4 md:gap-6"
          >
            {rowA.map((member, index) => (
              <ScrollRotate
                key={`a-${member.id}`}
                inputRange={[0.2, 0.85]}
                rotateRange={[index % 2 === 0 ? -8 : 8, 0]}
              >
                <MarqueeCard member={member} index={index} />
              </ScrollRotate>
            ))}
          </ScrollTranslateX>
        </ScrollOpacity>

        <ScrollScale
          inputRange={[0.1, 0.55]}
          scaleRange={[1.5, 1]}
          className="w-11/12 max-w-4xl flex flex-col justify-center text-center items-center mx-auto origin-center py-4 px-4"
        >
          <ScrollLetterSpacing
            inputRange={[0.1, 0.55]}
            spacingRange={['0.4em', '-0.02em']}
            className="text-3xl md:text-5xl lg:text-6xl font-display uppercase tracking-tight text-white leading-tight"
          >
            Compact team of{' '}
            <span className="text-[var(--brand)] font-bold">strategists & builders</span>
          </ScrollLetterSpacing>
          <ScrollBlur inputRange={[0.2, 0.5]} blurRange={[8, 0]} className="mt-4">
            <p className="font-sans text-sm md:text-base text-white/45 max-w-md">
              Every scroll reveals another layer — engineers, designers, operators, all moving in sync.
            </p>
          </ScrollBlur>
        </ScrollScale>

        <ScrollOpacity inputRange={[0.3, 0.9]} opacityRange={[0, 1]} className="w-full">
          <ScrollTranslateX
            inputRange={[0.25, 0.9]}
            xRange={['120%', '-60%']}
            className="flex flex-nowrap gap-4 md:gap-6"
          >
            {rowB.map((member, index) => (
              <ScrollRotate
                key={`b-${member.id}`}
                inputRange={[0.25, 0.9]}
                rotateRange={[index % 2 === 0 ? 8 : -8, 0]}
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
