import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { RotatingDial } from '../components/RotatingDial';
import { scrambleHex } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface RotatingTechFrameProps {
  color?: string;
}

export const RotatingTechFrame: React.FC<RotatingTechFrameProps> = ({ color = '#00F0FF' }) => {
  const frame = useCurrentFrame();

  const rotationAngle = (frame * 1.2) % 360;
  const dashOffset = (frame * 3) % 100;
  const pulseOpacity = 0.4 + Math.sin(frame * 0.1) * 0.6;

  // Stream of 6 hex data lines
  const hexLines = Array.from({ length: 6 }).map((_, i) => scrambleHex(12, frame + i * 5, 88 + i));

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
          <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Inset Border Tech Frame with Flowing Dashed Stroke */}
        <rect
          x="120"
          y="120"
          width="3600"
          height="1920"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray="40 20 100 20"
          strokeDashoffset={-dashOffset}
          filter="url(#glowCyan)"
          opacity="0.8"
        />

        {/* Inner Solid Border */}
        <rect
          x="140"
          y="140"
          width="3560"
          height="1880"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
        />

        {/* Pulsing Corner Indicator Dots */}
        <circle cx="200" cy="200" r="6" fill={color} opacity={pulseOpacity} />
        <circle cx="3640" cy="200" r="6" fill={color} opacity={pulseOpacity} />
        <circle cx="200" cy="1960" r="6" fill={color} opacity={pulseOpacity} />
        <circle cx="3640" cy="1960" r="6" fill={color} opacity={pulseOpacity} />
      </svg>

      {/* 4 Rotating Corner Gear Dials */}
      <div style={{ position: 'absolute', left: '60px', top: '60px' }}>
        <RotatingDial size={180} rotation={rotationAngle} color={color} />
      </div>
      <div style={{ position: 'absolute', right: '60px', top: '60px' }}>
        <RotatingDial size={180} rotation={-rotationAngle} color={color} />
      </div>
      <div style={{ position: 'absolute', left: '60px', bottom: '60px' }}>
        <RotatingDial size={180} rotation={-rotationAngle} color={color} />
      </div>
      <div style={{ position: 'absolute', right: '60px', bottom: '60px' }}>
        <RotatingDial size={180} rotation={rotationAngle} color={color} />
      </div>

      {/* Bottom Right Vertical Hex Stream Data */}
      <div
        style={{
          position: 'absolute',
          right: '180px',
          bottom: '180px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '16px',
          color,
          opacity: 0.45,
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {hexLines.map((line, idx) => (
          <div key={idx}>0x{line}</div>
        ))}
      </div>

      {/* Top Header Label */}
      <div
        style={{
          position: 'absolute',
          top: '160px',
          left: '200px',
          fontSize: '18px',
          color,
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: `0 0 10px ${color}`,
        }}
      >
        ROTATING TECH FRAME // SYS.OPERATIONAL
      </div>
    </AbsoluteFill>
  );
};
