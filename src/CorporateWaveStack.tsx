import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 7. CorporateWaveStack — Layered Sine Curtains
 * Fix: Pengali theta pada gelombang harmonis kedua diubah ke integer (2).
 */

const LOOP_DURATION = 240;
const W = 3840;
const H = 2160;
const NUM_WAVES = 7;

type CorporateWaveStackProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const createWaveFillPath = (
  baseY: number, theta: number,
  amp1: number, freq1: number, phase1: number,
  amp2: number, freq2: number, phase2: number,
): string => {
  const steps = 60;
  let path = `M 0 ${H}`;
  for (let i = 0; i <= steps; i++) {
    const nx = i / steps;
    // Pengali theta kedua diubah dari 1.3 menjadi 2 (integer)
    const y = baseY
      + Math.sin(nx * Math.PI * 2 * freq1 + theta * 1 + phase1) * amp1
      + Math.sin(nx * Math.PI * 2 * freq2 + theta * 2 + phase2) * amp2;
    path += ` L ${nx * W} ${y}`;
  }
  return path + ` L ${W} ${H} Z`;
};

export const CorporateWaveStack: React.FC<CorporateWaveStackProps> = ({
  primaryColor = '#08122A',
  secondaryColor = '#0D47A1',
  accentColor = '#42A5F5',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const waves = Array.from({ length: NUM_WAVES }, (_, i) => {
    const t = i / (NUM_WAVES - 1);
    return {
      baseY: H * 0.2 + t * H * 0.65,
      amp1: (60 + i * 20) * intensity,
      freq1: 1 + i * 1, // Integer spatial frequency
      phase1: i * 0.8,
      amp2: (20 + i * 10) * intensity,
      freq2: 2 + i * 1, // Integer spatial frequency
      phase2: i * 1.5 + 1,
      opacity: 0.15 + t * 0.4,
      color: t < 0.5 ? secondaryColor : accentColor,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {waves.map((wave, i) => (
        <svg key={i} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: 'absolute', inset: 0, opacity: wave.opacity }}>
          <path
            d={createWaveFillPath(wave.baseY, theta, wave.amp1, wave.freq1, wave.phase1, wave.amp2, wave.freq2, wave.phase2)}
            fill={wave.color} />
        </svg>
      ))}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.035,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-ws">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-ws)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Gelombang sinus pertama (theta * 1) dan kedua (theta * 2) menggunakan pengali integer murni.
 * Nilai sinus di frame 240 persis sama dengan di frame 0.
 */
