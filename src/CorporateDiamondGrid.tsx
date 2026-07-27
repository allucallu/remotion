import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 10. CorporateDiamondGrid — Geometric Matrix
 * Fix: Pengali theta pada interferensi ripple dan parallax diubah ke integer murni.
 */

const LOOP_DURATION = 180;
const W = 3840;
const H = 2160;
const DIAMOND_SIZE = 50;
const GAP = 10;
const CELL = DIAMOND_SIZE + GAP;

type CorporateDiamondGridProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const diamonds = (() => {
  const result: { x: number; y: number }[] = [];
  const cols = Math.ceil(W / CELL) + 2;
  const rows = Math.ceil(H / CELL) + 2;
  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      result.push({
        x: col * CELL + (row % 2 === 0 ? 0 : CELL / 2),
        y: row * CELL,
      });
    }
  }
  return result;
})();

const rippleCenters = [
  { x: W * 0.3, y: H * 0.3 },
  { x: W * 0.75, y: H * 0.6 },
  { x: W * 0.5, y: H * 0.8 },
];

export const CorporateDiamondGrid: React.FC<CorporateDiamondGridProps> = ({
  primaryColor = '#0F1923',
  secondaryColor = '#1565C0',
  accentColor = '#E8EAF6',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', left: '35%', top: '25%', width: '30%', height: '50%',
        background: `radial-gradient(circle, ${secondaryColor}12 0%, transparent 70%)`,
        filter: 'blur(120px)',
      }} />

      {/* Diamond grid layer 1 (outline, interference ripple) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {diamonds.map((d, i) => {
          let rippleVal = 0;
          rippleCenters.forEach((c, ci) => {
            const dist = Math.sqrt((d.x - c.x) ** 2 + (d.y - c.y) ** 2);
            // Pengali theta diubah ke integer (1, 2, atau 3)
            rippleVal += Math.sin(dist * 0.006 - theta * (1 + ci));
          });
          rippleVal = (rippleVal / rippleCenters.length + 1) / 2;
          const opacity = (0.03 + rippleVal * 0.2) * intensity;
          const s = DIAMOND_SIZE / 2;
          return (
            <rect key={i} x={d.x - s} y={d.y - s}
              width={DIAMOND_SIZE} height={DIAMOND_SIZE}
              transform={`rotate(45 ${d.x} ${d.y})`}
              fill="none" stroke={secondaryColor} strokeWidth={1} opacity={opacity} />
          );
        })}
      </svg>

      {/* Diamond grid layer 2 (filled accents, parallax) */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute', inset: 0,
          transform: `translate(${Math.sin(theta * 1) * 12}px, ${Math.cos(theta * 1) * 8}px)`,
        }}>
        {diamonds.filter((_, i) => i % 4 === 0).map((d, i) => {
          const dist = Math.sqrt((d.x - W * 0.5) ** 2 + (d.y - H * 0.5) ** 2);
          const rippleVal = Math.sin(dist * 0.005 - theta * 1) * 0.5 + 0.5;
          const s = DIAMOND_SIZE * 0.3;
          return (
            <rect key={i} x={d.x - s} y={d.y - s}
              width={s * 2} height={s * 2}
              transform={`rotate(45 ${d.x} ${d.y})`}
              fill={accentColor} opacity={rippleVal * 0.12 * intensity} />
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
        <filter id="grain-dg">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-dg)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Gelombang interferensi (theta * 1, theta * 2, theta * 3) dan parallax layer 2 (theta * 1)
 * semuanya menggunakan bilangan bulat murni.
 * Frame 180 menyambung persis ke frame 0.
 */
