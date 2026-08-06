import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ReticleRing } from '../components/ReticleRing';
import { CornerBracket } from '../components/CornerBracket';
import { scrambleHex } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';
import { hudSnapSpringConfig } from '../utils/easings';

export interface TargetLockReticleProps {
  color?: string;
}

export const TargetLockReticle: React.FC<TargetLockReticleProps> = ({ color = '#FF3300' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Loop progress 0 to 1 across 150 frames
  const isLocked = frame >= 45;

  const lockSpring = isLocked
    ? spring({
        frame: frame - 45,
        fps,
        config: hudSnapSpringConfig,
      })
    : 0;

  // Bracket slide offset from outer edge (300px to 0px)
  const bracketOffset = (1 - Math.min(1, frame / 45)) * 350;

  // Scrambling percentage increment 0% -> 98.4%
  const percentValue = isLocked
    ? (
        interpolate(frame, [45, 90], [0, 98.4], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      ).toFixed(1)
    : (Number(scrambleHex(2, frame)) % 90).toString();

  // Fade out / Fade in loop transition
  const opacity = interpolate(frame, [0, 15, 130, 150], [0, 1, 1, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: spaceMonoFontFamily,
        opacity,
      }}
    >
      <svg width="3840" height="2160" viewBox="0 0 3840 2160" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Reticle Central Concentric Rings & Crosshair */}
        <g transform="translate(1920, 1080)" filter="url(#neonGlowRed)">
          <ReticleRing radius={160} color={color} strokeWidth={2.5} dashed rotation={frame * 2} />
          <ReticleRing radius={120} color={color} strokeWidth={1.5} rotation={-frame * 3} />
          <ReticleRing radius={40} color={color} strokeWidth={2} />

          {/* Central Crosshair */}
          <line x1="-200" y1="0" x2="-50" y2="0" stroke={color} strokeWidth="2" />
          <line x1="50" y1="0" x2="200" y2="0" stroke={color} strokeWidth="2" />
          <line x1="0" y1="-200" x2="0" y2="-50" stroke={color} strokeWidth="2" />
          <line x1="0" y1="50" x2="0" y2="200" stroke={color} strokeWidth="2" />
        </g>
      </svg>

      {/* 4 Corner Lock Brackets sliding in towards target */}
      {/* Top Left Bracket */}
      <div style={{ position: 'absolute', left: `${1920 - 240 - bracketOffset}px`, top: `${1080 - 240 - bracketOffset}px` }}>
        <CornerBracket size={140} color={color} strokeWidth={4} />
      </div>

      {/* Top Right Bracket */}
      <div style={{ position: 'absolute', left: `${1920 + 240 + bracketOffset}px`, top: `${1080 - 240 - bracketOffset}px`, transform: 'scaleX(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={4} />
      </div>

      {/* Bottom Left Bracket */}
      <div style={{ position: 'absolute', left: `${1920 - 240 - bracketOffset}px`, top: `${1080 + 240 + bracketOffset}px`, transform: 'scaleY(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={4} />
      </div>

      {/* Bottom Right Bracket */}
      <div style={{ position: 'absolute', left: `${1920 + 240 + bracketOffset}px`, top: `${1080 + 240 + bracketOffset}px`, transform: 'scale(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={4} />
      </div>

      {/* Target Lock Status Box & Percentage Display */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            left: '2220px',
            top: '1000px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color,
            textShadow: `0 0 15px ${color}`,
            transform: `scale(${lockSpring})`,
            transformOrigin: 'left center',
          }}
        >
          <div style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '0.15em' }}>[ TARGET LOCKED ]</div>
          <div style={{ fontFamily: jetBrainsMonoFontFamily, fontSize: '42px', fontWeight: 800 }}>
            CONFIDENCE: {percentValue}%
          </div>
          <div style={{ fontSize: '18px', color: '#FFFFFF', opacity: 0.8 }}>
            SYS.ID: 0x{scrambleHex(6, frame, 12)}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
