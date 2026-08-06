import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { RotatingDial } from '../components/RotatingDial';
import { GlitchText } from '../components/GlitchText';
import { scrambleHex, seededRandom } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface IronmanStyleHUDProps {
  color?: string;
  accentColor?: string;
}

const statusPhrases = [
  'SYS.ONLINE',
  'SCANNING ARCHITECTURE...',
  'ANALYZING TELEMETRY',
  'POWER OVERDRIVE 98%',
  'QUANTUM SYNC OK',
];

export const IronmanStyleHUD: React.FC<IronmanStyleHUDProps> = ({
  color = '#00F0FF',
  accentColor = '#FFB700',
}) => {
  const frame = useCurrentFrame();

  // Scanline Y position moving top to bottom slowly (0 to 2160)
  const scanY = (frame * 5) % 2160;

  // Power percentage oscillation
  const pwrValue = Math.floor(
    interpolate(frame % 180, [0, 90, 180], [92, 99, 92])
  );

  // Status phrase step every 70 frames
  const statusIndex = Math.floor(frame / 70) % statusPhrases.length;
  const currentStatus = statusPhrases[statusIndex];
  const isGlitching = (frame % 70) < 5; // Glitch for 5 frames during text swap

  const dialRotation = (frame * 1.5) % 360;

  // 8 mini bar graph values
  const barHeights = Array.from({ length: 8 }).map((_, i) =>
    Math.floor(seededRandom(frame * 10 + i * 42) * 50 + 20)
  );

  // Vertical Ruler Ticks Array (10 to 90)
  const rulerTicks = [10, 20, 30, 40, 50, 60, 70, 80, 90];

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
          <filter id="glowHUD" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Subtle Crosshair (~25% opacity) */}
        <g stroke={color} strokeWidth="1.5" opacity="0.25" transform="translate(1920, 1080)">
          <line x1="-300" y1="0" x2="300" y2="0" />
          <line x1="0" y1="-300" x2="0" y2="300" />
          <circle r="180" fill="none" strokeDasharray="6 6" />
        </g>

        {/* Horizontal Laser Scan Line */}
        <line x1="0" y1={scanY} x2="3840" y2={scanY} stroke={color} strokeWidth="2" opacity="0.3" filter="url(#glowHUD)" />

        {/* Outer Perimeter Tech Brackets */}
        <path d="M 80 200 L 80 80 L 200 80" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
        <path d="M 3760 200 L 3760 80 L 3640 80" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
        <path d="M 80 1960 L 80 2080 L 200 2080" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
        <path d="M 3760 1960 L 3760 2080 L 3640 2080" fill="none" stroke={color} strokeWidth="3" opacity="0.6" />
      </svg>

      {/* Far Left Edge Vertical Altitude Scale Ticks */}
      <div
        style={{
          position: 'absolute',
          left: '60px',
          top: '300px',
          bottom: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color,
          fontSize: '14px',
          opacity: 0.5,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        {rulerTicks.map((val) => (
          <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>-</span>
            <span>ALT-{val}</span>
          </div>
        ))}
      </div>

      {/* Far Right Edge Vertical Depth Scale Ticks */}
      <div
        style={{
          position: 'absolute',
          right: '60px',
          top: '300px',
          bottom: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          color: accentColor,
          fontSize: '14px',
          opacity: 0.5,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        {rulerTicks.map((val) => (
          <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>RNG-{100 - val}</span>
            <span>-</span>
          </div>
        ))}
      </div>

      {/* Top Header Label */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          color,
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textShadow: `0 0 10px ${color}`,
        }}
      >
        INTELLIGENT HUD TELEMETRY // MK-7 OVERLAY
      </div>

      {/* Top Left Data Panel: Mini Bar Graph & PWR Metric */}
      <div
        style={{
          position: 'absolute',
          left: '140px',
          top: '140px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          boxShadow: `0 0 20px ${color}20`,
        }}
      >
        <div style={{ fontSize: '14px', color, fontWeight: 700, letterSpacing: '0.15em' }}>
          SYSTEM DIAGNOSTICS
        </div>

        <div style={{ fontSize: '32px', fontWeight: 800, color: accentColor, fontFamily: jetBrainsMonoFontFamily }}>
          PWR: {pwrValue}%
        </div>

        {/* 8 Mini Bar Chart Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
          {barHeights.map((h, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: `${h}px`,
                backgroundColor: i % 2 === 0 ? color : accentColor,
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>

      {/* NEW Top Right Data Panel: Distance & Target Tracking */}
      <div
        style={{
          position: 'absolute',
          right: '140px',
          top: '140px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${accentColor}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          boxShadow: `0 0 20px ${accentColor}20`,
        }}
      >
        <div style={{ fontSize: '14px', color: accentColor, fontWeight: 700, letterSpacing: '0.15em' }}>
          TARGET LOCK DISTANCE
        </div>

        <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: jetBrainsMonoFontFamily }}>
          DIST: 1,420M
        </div>

        <div style={{ fontSize: '14px', color, fontFamily: jetBrainsMonoFontFamily }}>
          VECTOR: [ 0x{scrambleHex(4, frame, 91)} ]
        </div>
      </div>

      {/* Bottom Right Data Panel: Rotating Dial & Telemetry */}
      <div
        style={{
          position: 'absolute',
          right: '140px',
          bottom: '140px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '20px',
          padding: '24px 32px',
        }}
      >
        <RotatingDial size={140} rotation={dialRotation} color={accentColor} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '14px', color: '#FFFFFF', opacity: 0.7 }}>TELEMETRY RADAR</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color, fontFamily: jetBrainsMonoFontFamily }}>
            360° SPHERE OK
          </span>
        </div>
      </div>

      {/* Dynamic Status Text Phrase with Glitch Effect */}
      <div style={{ position: 'absolute', left: '140px', bottom: '140px' }}>
        <GlitchText text={currentStatus} isGlitching={isGlitching} color={color} fontSize={28} />
      </div>
    </AbsoluteFill>
  );
};
