import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';

/**
 * 6. CorporateNoiseField — Perlin Landscape
 * Mood: Abstrak, meditatif, premium. Lanskap noise yang bergerak pelan
 * seperti topografi digital — garis kontur yang hidup.
 * Durasi Loop: 10 detik (300 frame @30fps)
 * Palet: #0C1821 (deep ocean), #324A5F (steel), #CED4DA (silver mist)
 */

const LOOP_DURATION = 300;
const W = 3840;
const H = 2160;
const NUM_LINES = 30;

type CorporateNoiseFieldProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const createContourPath = (
  baseY: number, theta: number, seed: string,
  amplitude: number, noiseScale: number,
): string => {
  const steps = 80;
  let path = `M 0 ${baseY}`;
  for (let i = 1; i <= steps; i++) {
    const nx = i / steps;
    const nX = Math.cos(theta) * noiseScale + nx * 5;
    const nY = Math.sin(theta) * noiseScale + 0.5;
    const nv = noise2D(seed, nX, nY);
    path += ` L ${nx * W} ${baseY + nv * amplitude}`;
  }
  return path;
};

export const CorporateNoiseField: React.FC<CorporateNoiseFieldProps> = ({
  primaryColor = '#0C1821',
  secondaryColor = '#324A5F',
  accentColor = '#CED4DA',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const lines = Array.from({ length: NUM_LINES }, (_, i) => {
    const t = i / (NUM_LINES - 1);
    return {
      baseY: H * 0.1 + t * H * 0.8,
      amplitude: (80 + t * 60) * intensity,
      seed: `nf-${i}`,
      noiseScale: 0.5 + t * 0.3,
      color: t < 0.5 ? secondaryColor : accentColor,
      opacity: 0.15 + t * 0.35,
      strokeWidth: 1 + t * 2,
    };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', left: '20%', top: '30%', width: '60%', height: '40%',
        background: `radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%)`,
        filter: 'blur(120px)',
      }} />

      {/* Contour lines */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {lines.map((line, i) => (
          <path key={i}
            d={createContourPath(line.baseY, theta, line.seed, line.amplitude, line.noiseScale)}
            fill="none" stroke={line.color} strokeWidth={line.strokeWidth}
            opacity={line.opacity} strokeLinecap="round" />
        ))}
      </svg>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 35%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.04,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-nf">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-nf)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP:
 * Setiap garis kontur menggunakan noise2D dengan koordinat temporal melingkar:
 * nX = cos(theta) × noiseScale + posisi_x, nY = sin(theta) × noiseScale
 * Di theta=0 dan theta=2π, koordinat noise identik → bentuk gelombang identik.
 */
