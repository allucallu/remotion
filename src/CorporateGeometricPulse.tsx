import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 5. CorporateGeometricPulse — Hexagonal Rhythm
 * Fix: Pengali theta diubah ke integer murni (1 dan 2) agar seamless loop.
 */

const LOOP_DURATION = 180;
const W = 3840;
const H = 2160;
const HEX_SIZE = 100;
const HEX_GAP = 8;

type CorporateGeometricPulseProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const HEX_W = (HEX_SIZE + HEX_GAP) * Math.sqrt(3);
const HEX_H = (HEX_SIZE + HEX_GAP) * 1.5;

const hexPositions = (() => {
  const hexes: { x: number; y: number }[] = [];
  const cols = Math.ceil(W / HEX_W) + 2;
  const rows = Math.ceil(H / HEX_H) + 2;
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      hexes.push({
        x: col * HEX_W + (row % 2 === 0 ? 0 : HEX_W / 2),
        y: row * HEX_H,
      });
    }
  }
  return hexes;
})();

const hexPath = (cx: number, cy: number, r: number): string => {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 6) + (i * Math.PI) / 3;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return `M ${pts.join(' L ')} Z`;
};

const rippleCenters = [
  { x: W * 0.35, y: H * 0.4 },
  { x: W * 0.7, y: H * 0.65 },
];

export const CorporateGeometricPulse: React.FC<CorporateGeometricPulseProps> = ({
  primaryColor = '#101820',
  secondaryColor = '#1E88E5',
  accentColor = '#E3F2FD',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', left: '30%', top: '30%', width: '40%', height: '40%',
        background: `radial-gradient(circle, ${secondaryColor}15 0%, transparent 70%)`,
        filter: 'blur(100px)',
      }} />

      {/* Hex grid layer 1 (outline, ripple opacity) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        {hexPositions.map((hex, i) => {
          let rippleVal = 0;
          rippleCenters.forEach((center, ci) => {
            const dist = Math.sqrt((hex.x - center.x) ** 2 + (hex.y - center.y) ** 2);
            // Pengali theta diubah ke integer (ci===0 ? 1 : 2)
            rippleVal += Math.sin(dist * 0.005 - theta * (ci === 0 ? 1 : 2)) * 0.5 + 0.5;
          });
          rippleVal = Math.min(1, rippleVal / 2);
          const opacity = 0.05 + rippleVal * 0.35 * intensity;
          const hexScale = 0.7 + rippleVal * 0.3 * intensity;
          return (
            <path key={i} d={hexPath(hex.x, hex.y, HEX_SIZE * hexScale)}
              fill="none" stroke={secondaryColor} strokeWidth={1.5} opacity={opacity} />
          );
        })}
      </svg>

      {/* Hex grid layer 2 (filled accents, parallax) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute', inset: 0,
          transform: `translate(${Math.sin(theta * 1) * 15}px, ${Math.cos(theta * 1) * 10}px)`,
        }}>
        {hexPositions.filter((_, i) => i % 3 === 0).map((hex, i) => {
          const dist = Math.sqrt((hex.x - W / 2) ** 2 + (hex.y - H / 2) ** 2);
          const rippleVal = Math.sin(dist * 0.004 - theta * 1) * 0.5 + 0.5;
          return (
            <path key={i} d={hexPath(hex.x, hex.y, HEX_SIZE * 0.6)}
              fill={accentColor} opacity={rippleVal * 0.15 * intensity} />
          );
        })}
      </svg>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.03,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-gp">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-gp)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Semua gelombang ripple dan parallax offset menggunakan pengali theta * 1 dan theta * 2 (integer).
 * Frame 180 menyambung persis ke frame 0 tanpa lompatan visual.
 */
