import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { scrambleText } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';
import { GlitchText } from '../components/GlitchText';

export interface CyberpunkCornerFrameProps {
  color?: string;
  accentColor?: string;
}

export const CyberpunkCornerFrame: React.FC<CyberpunkCornerFrameProps> = ({
  color = '#FF007F',
  accentColor = '#00F0FF',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Periodic Glitch every 60 frames for 4 frames
  const isGlitching = (frame % 60) < 4;

  // Path draw entrance animation
  const drawSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const dashOffset = (1 - drawSpring) * 800;

  // Decoded text word vs scrambled text
  const isDecoded = (frame % 100) > 40 && (frame % 100) < 85;
  const decodedText = isDecoded ? 'ACCESS GRANTED' : scrambleText(14, frame, 77);

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
          <filter id="glowCyber" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 4 Cyberpunk Diagonal Slanted Corner Brackets */}
        {/* Top-Left Slanted Bracket */}
        <path
          d="M 120 400 L 120 180 L 240 120 L 600 120"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray="800"
          strokeDashoffset={dashOffset}
          filter="url(#glowCyber)"
        />

        {/* Top-Right Slanted Bracket */}
        <path
          d="M 3720 400 L 3720 180 L 3600 120 L 3240 120"
          fill="none"
          stroke={accentColor}
          strokeWidth="4"
          strokeDasharray="800"
          strokeDashoffset={dashOffset}
          filter="url(#glowCyber)"
        />

        {/* Bottom-Left Slanted Bracket */}
        <path
          d="M 120 1760 L 120 1980 L 240 2040 L 600 2040"
          fill="none"
          stroke={accentColor}
          strokeWidth="4"
          strokeDasharray="800"
          strokeDashoffset={dashOffset}
          filter="url(#glowCyber)"
        />

        {/* Bottom-Right Slanted Bracket */}
        <path
          d="M 3720 1760 L 3720 1980 L 3600 2040 L 3240 2040"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray="800"
          strokeDashoffset={dashOffset}
          filter="url(#glowCyber)"
        />

        {/* Glitch Horizontal Noise Lines during Glitch frames */}
        {isGlitching && (
          <>
            <line x1="0" y1="420" x2="3840" y2="420" stroke={color} strokeWidth="2" opacity="0.8" />
            <line x1="0" y1="1680" x2="3840" y2="1680" stroke={accentColor} strokeWidth="2" opacity="0.8" />
          </>
        )}
      </svg>

      {/* Central Decoded / Scrambled Status Banner */}
      <div style={{ position: 'absolute', top: '160px' }}>
        <GlitchText
          text={decodedText}
          isGlitching={isGlitching}
          color={isDecoded ? '#00FF66' : color}
          fontSize={32}
        />
      </div>

      {/* Vertical Dangling Data Stream Left */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '440px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '16px',
          color: accentColor,
          opacity: 0.6,
        }}
      >
        <span>{scrambleText(10, frame, 101)}</span>
        <span>{scrambleText(10, frame, 102)}</span>
        <span>{scrambleText(10, frame, 103)}</span>
      </div>
    </AbsoluteFill>
  );
};
