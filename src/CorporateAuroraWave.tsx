import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';

/**
 * 2. CorporateAuroraWave — Northern Light Silk
 * Fix: Pengali theta pada harmonic wave diubah ke integer murni (2) agar seamless.
 */

const LOOP_DURATION = 300;
const W = 3840;
const H = 2160;

type CorporateAuroraWaveProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const createWaveBandPath = (
  baseY: number, thickness: number, theta: number,
  amplitude: number, frequency: number, phase: number,
  seed: string, noiseAmp: number, int: number,
): string => {
  const steps = 50;
  const top: string[] = [];
  const bot: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const nx = i / steps;
    const x = nx * W;
    // Pengali theta diubah dari 1.4 ke 2 (integer) agar seamless loop sempurna
    const wave =
      Math.sin(nx * Math.PI * 2 * frequency + theta * 1 + phase) * amplitude +
      Math.sin(nx * Math.PI * 2 * frequency * 2 + theta * 2 + phase * 1.5) * amplitude * 0.3;
    const noiseX = Math.cos(theta * 1) * 0.7 + nx * 4;
    const noiseY = Math.sin(theta * 1) * 0.7;
    const nv = noise2D(seed, noiseX, noiseY) * noiseAmp;
    const y = baseY + (wave + nv) * int;
    top.push(`${x},${y}`);
    bot.push(`${x},${y + thickness}`);
  }

  return `M ${top.join(' L ')} L ${bot.reverse().join(' L ')} Z`;
};

export const CorporateAuroraWave: React.FC<CorporateAuroraWaveProps> = ({
  primaryColor = '#050A18',
  secondaryColor = '#1565C0',
  accentColor = '#00E5FF',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const bands = [
    { baseY: H * 0.15, thickness: 160, amp: 100, freq: 1, phase: 0, seed: 'aw1', noiseAmp: 50, color: secondaryColor, blur: 140, opacity: 0.25 },
    { baseY: H * 0.30, thickness: 200, amp: 130, freq: 1, phase: 1.2, seed: 'aw2', noiseAmp: 60, color: accentColor, blur: 170, opacity: 0.20 },
    { baseY: H * 0.48, thickness: 180, amp: 110, freq: 2, phase: 2.8, seed: 'aw3', noiseAmp: 55, color: secondaryColor, blur: 190, opacity: 0.30 },
    { baseY: H * 0.62, thickness: 140, amp: 90, freq: 2, phase: 0.7, seed: 'aw4', noiseAmp: 45, color: accentColor, blur: 160, opacity: 0.18 },
    { baseY: H * 0.78, thickness: 170, amp: 120, freq: 1, phase: 3.2, seed: 'aw5', noiseAmp: 65, color: '#B3E5FC', blur: 150, opacity: 0.12 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {bands.map((b, i) => (
        <svg key={i} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{
            position: 'absolute', inset: 0,
            filter: `blur(${b.blur}px)`,
            opacity: b.opacity,
            mixBlendMode: 'screen' as const,
          }}>
          <path
            d={createWaveBandPath(b.baseY, b.thickness, theta, b.amp, b.freq, b.phase, b.seed, b.noiseAmp, intensity)}
            fill={b.color}
          />
        </svg>
      ))}

      {/* Ambient glow at horizon */}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '40%',
        background: `linear-gradient(to top, ${secondaryColor}15, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 35%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.04,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-aw">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-aw)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Gelombang dan lintasan noise2D menggunakan theta * 1 dan theta * 2 (integer).
 * Koordinat noiseX/noiseY membentuk lingkaran penuh di ruang noise saat theta: 0 -> 2π.
 * Frame 300 kembali persis ke frame 0 tanpa lompatan visual.
 */
