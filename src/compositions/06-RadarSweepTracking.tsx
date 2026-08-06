import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ReticleRing } from '../components/ReticleRing';
import { RadarSweep } from '../components/RadarSweep';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';
import { scrambleHex } from '../utils/random';

export interface RadarSweepTrackingProps {
  color?: string;
}

export const RadarSweepTracking: React.FC<RadarSweepTrackingProps> = ({ color = '#00FF66' }) => {
  const frame = useCurrentFrame();

  // Radar sweep angle 0 to 360 degrees per 270 frames
  const sweepAngle = (frame * 360) / 270;

  // 4 Target Contact Blip Dots
  const blips = [
    { angle: 45, r: 180 },
    { angle: 140, r: 280 },
    { angle: 220, r: 120 },
    { angle: 310, r: 340 },
  ];

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
          <filter id="glowRadar" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Radar Display Group */}
        <g transform="translate(1920, 1080)" filter="url(#glowRadar)">
          {/* Concentric Distance Rings */}
          <ReticleRing radius={400} color={color} strokeWidth={2} />
          <ReticleRing radius={300} color={color} strokeWidth={1.5} dashed />
          <ReticleRing radius={200} color={color} strokeWidth={1.5} />
          <ReticleRing radius={100} color={color} strokeWidth={1.5} dashed />

          {/* Compass Crosshair N / S / E / W Lines */}
          <line x1="-440" y1="0" x2="440" y2="0" stroke={color} strokeWidth="2" opacity="0.6" />
          <line x1="0" y1="-440" x2="0" y2="440" stroke={color} strokeWidth="2" opacity="0.6" />

          {/* Rotating Radar Sweep Line & Sector Trail */}
          <RadarSweep radius={400} rotation={sweepAngle} color={color} />

          {/* Blip Target Dots flashing when sweep passes */}
          {blips.map((b, i) => {
            const angleDiff = (sweepAngle - b.angle + 360) % 360;
            const isJustSwept = angleDiff < 90;
            const opacity = isJustSwept ? 1 - angleDiff / 90 : 0.15;

            const bx = b.r * Math.cos((b.angle * Math.PI) / 180);
            const by = b.r * Math.sin((b.angle * Math.PI) / 180);

            return (
              <g key={i} transform={`translate(${bx}, ${by})`}>
                <circle r="7" fill={color} opacity={opacity} />
                {isJustSwept && <circle r="16" fill="none" stroke={color} strokeWidth="2" opacity={opacity} />}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Compass Direction Labels */}
      <div style={{ position: 'absolute', top: '610px', color, fontSize: '24px', fontWeight: 800 }}>N [0°]</div>
      <div style={{ position: 'absolute', bottom: '610px', color, fontSize: '24px', fontWeight: 800 }}>S [180°]</div>
      <div style={{ position: 'absolute', left: '1420px', color, fontSize: '24px', fontWeight: 800 }}>W [270°]</div>
      <div style={{ position: 'absolute', right: '1420px', color, fontSize: '24px', fontWeight: 800 }}>E [90°]</div>

      {/* NEW Top-Left Signal Telemetry Card */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>SIGNAL FREQUENCY</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>FREQ: 2.40 GHz</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>STRENGTH: 98.4%</div>
      </div>

      {/* NEW Bottom-Left Tactical Mode Card */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>TACTICAL MODE</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>SEARCH & TRACK</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>SWEEP RATE: 40°/sec</div>
      </div>

      {/* Telemetry Data Card Right */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.7 }}>TACTICAL RADAR TELEMETRY</div>
        <div style={{ fontSize: '28px', fontWeight: 800 }}>RANGE: 4.8 KM</div>
        <div style={{ fontSize: '22px', fontWeight: 700 }}>CONTACTS DETECTED: 4</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>GRID: 0x{scrambleHex(6, frame, 77)}</div>
      </div>
    </AbsoluteFill>
  );
};
