import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { EnergyParticle } from '../components/EnergyParticle';
import { spaceMonoFontFamily } from '../utils/fonts';

export interface ParticleEnergyFieldProps {
  color?: string;
  accentColor?: string;
}

export const ParticleEnergyField: React.FC<ParticleEnergyFieldProps> = ({
  color = '#FF007F',
  accentColor = '#00F0FF',
}) => {
  const frame = useCurrentFrame();

  const corners = [
    { x: 300, y: 300 },
    { x: 3540, y: 300 },
    { x: 300, y: 1860 },
    { x: 3540, y: 1860 },
  ];

  // 12 Energy Particles with staggered delays & target corners
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const delay = i * 25;
    const targetCorner = corners[i % 4];
    const startX = i % 2 === 0 ? 1920 + (i - 6) * 300 : (i % 4 < 2 ? 200 : 3640);
    const startY = i % 2 === 1 ? 1080 + (i - 6) * 200 : (i % 4 >= 2 ? 200 : 1960);

    return { startX, startY, targetCorner, delay };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: spaceMonoFontFamily,
      }}
    >
      <svg width="3840" height="2160" viewBox="0 0 3840 2160" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="glowParticle" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Decorative Base Energy Field Curved Lines at 4 Corners */}
        <g stroke={accentColor} strokeWidth="2" opacity="0.3" fill="none">
          <path d="M 120 600 Q 600 600 600 120" />
          <path d="M 3720 600 Q 3240 600 3240 120" />
          <path d="M 120 1560 Q 600 1560 600 2040" />
          <path d="M 3720 1560 Q 3240 1560 3240 2040" />
        </g>

        {/* 4 Corner Energy Accumulator Nodes */}
        {corners.map((c, idx) => {
          const pulse = 0.5 + Math.sin(frame * 0.2 + idx) * 0.5;
          return (
            <g key={idx} transform={`translate(${c.x}, ${c.y})`} filter="url(#glowParticle)">
              <circle r={24 + pulse * 12} fill="none" stroke={color} strokeWidth="3" opacity={pulse} />
              <circle r="12" fill={color} />
            </g>
          );
        })}

        {/* 12 Flowing Energy Particles */}
        <g filter="url(#glowParticle)">
          {particles.map((p, i) => {
            const pFrame = (frame + p.delay) % 150;
            const progress = pFrame / 150;

            return (
              <EnergyParticle
                key={i}
                startX={p.startX}
                startY={p.startY}
                targetX={p.targetCorner.x}
                targetY={p.targetCorner.y}
                progress={progress}
                color={color}
              />
            );
          })}
        </g>
      </svg>

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '100px', color, fontSize: '24px', fontWeight: 800 }}>
        PARTICLE ENERGY FIELD // CORNER ACCUMULATORS
      </div>
    </AbsoluteFill>
  );
};
