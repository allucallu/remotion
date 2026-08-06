import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ReticleRing } from '../components/ReticleRing';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';
import { scrambleHex } from '../utils/random';

export interface SatelliteOrbitalLockProps {
  color?: string;
  accentColor?: string;
}

export const SatelliteOrbitalLock: React.FC<SatelliteOrbitalLockProps> = ({
  color = '#00F0FF',
  accentColor = '#FFB700',
}) => {
  const frame = useCurrentFrame();

  // Satellite orbit rotation angle
  const orbitAngle = (frame * 1.5) % 360;
  const satX = 1920 + Math.cos((orbitAngle * Math.PI) / 180) * 480;
  const satY = 1080 + Math.sin((orbitAngle * Math.PI) / 180) * 280;

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
          <filter id="glowSat" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Elliptical Satellite Orbit Trajectory Ring */}
        <ellipse cx="1920" cy="1080" rx="480" ry="280" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="16 12" opacity="0.6" filter="url(#glowSat)" />

        {/* Central Lock Reticle */}
        <g transform="translate(1920, 1080)">
          <ReticleRing radius={160} color={accentColor} strokeWidth={2} dashed rotation={-frame * 2} />
          <ReticleRing radius={80} color={color} strokeWidth={2} />
          <line x1="-220" y1="0" x2="220" y2="0" stroke={color} strokeWidth="2" opacity="0.5" />
          <line x1="0" y1="-220" x2="0" y2="220" stroke={color} strokeWidth="2" opacity="0.5" />
        </g>

        {/* Rotating Satellite Node Icon */}
        <g transform={`translate(${satX}, ${satY})`}>
          <circle r="12" fill={accentColor} filter="url(#glowSat)" />
          <circle r="24" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.8" />
        </g>
      </svg>

      {/* Top Left Satellite Telemetry Card */}
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
        <div style={{ fontSize: '14px', opacity: 0.7 }}>SATELLITE SYNC TELEMETRY</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: accentColor }}>ORBITAL LOCK: SAT-09</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>LAT: 37.7749° N | LNG: 122.4194° W</div>
      </div>

      {/* Bottom Right Downlink Status Card */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${accentColor}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color: accentColor,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.7 }}>DOWNLINK DATASTREAM</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>SIGNAL STRENGTH: 100%</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>STREAM: 0x{scrambleHex(8, frame, 55)}</div>
      </div>

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '100px', left: '100px', fontSize: '24px', color, fontWeight: 700 }}>
        SATELLITE ORBITAL TARGET LOCK // SYSTEM SAT-99
      </div>
    </AbsoluteFill>
  );
};
