import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 1. CorporateGradientFlow — Flowing Gradient Mesh
 * Fix: Semua pengali theta menggunakan bilangan bulat murni (1, 2, 3) agar seamless loop.
 */

const LOOP_DURATION = 240;

type CorporateGradientFlowProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const Blob: React.FC<{
  x: number; y: number; size: number; color: string; opacity: number; blur: number;
}> = ({ x, y, size, color, opacity, blur }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      width: size,
      height: size,
      marginLeft: -size / 2,
      marginTop: -size / 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      filter: `blur(${blur}px)`,
    }}
  />
);

export const CorporateGradientFlow: React.FC<CorporateGradientFlowProps> = ({
  primaryColor = '#0A1628',
  secondaryColor = '#1E3A5F',
  accentColor = '#4FC3F7',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {/* === LAYER 1: Background (far, large, blurred) === */}
      <Blob x={0.25 + Math.sin(theta * 1 + 0.0) * 0.12 * intensity}
            y={0.35 + Math.cos(theta * 1 + 0.5) * 0.08 * intensity}
            size={2200} color={secondaryColor} opacity={0.5} blur={200} />
      <Blob x={0.78 + Math.cos(theta * 1 + 1.2) * 0.10 * intensity}
            y={0.65 + Math.sin(theta * 2 + 0.8) * 0.12 * intensity}
            size={2000} color={accentColor} opacity={0.2} blur={250} />

      {/* === LAYER 2: Midground === */}
      <Blob x={0.52 + Math.sin(theta * 2 + 0.5) * 0.16 * intensity}
            y={0.28 + Math.cos(theta * 1 + 2.0) * 0.13 * intensity}
            size={1400} color={secondaryColor} opacity={0.45} blur={120} />
      <Blob x={0.38 + Math.cos(theta * 1 + 1.0) * 0.12 * intensity}
            y={0.72 + Math.sin(theta * 2 + 3.0) * 0.10 * intensity}
            size={1200} color={accentColor} opacity={0.3} blur={150} />

      {/* === LAYER 3: Foreground (accents) === */}
      <Blob x={0.62 + Math.sin(theta * 2 + 1.0) * 0.08 * intensity}
            y={0.42 + Math.cos(theta * 3 + 2.5) * 0.06 * intensity}
            size={600} color={accentColor} opacity={0.18} blur={80} />
      <Blob x={0.18 + Math.cos(theta * 1 + 3.5) * 0.06 * intensity}
            y={0.55 + Math.sin(theta * 2 + 1.5) * 0.05 * intensity}
            size={480} color={accentColor} opacity={0.12} blur={60} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.035,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-gf">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-gf)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * theta berputar 0 -> 2π dalam 240 frame.
 * Semua fungsi Math.sin(k * theta + phase) dan Math.cos(k * theta + phase)
 * menggunakan pengali k ∈ {1, 2, 3} (bilangan bulat murni).
 * Karena sin(k*2π + phase) = sin(phase) dan cos(k*2π + phase) = cos(phase),
 * nilai di frame 240 (kembali ke frame 0) persis identik dengan frame 0.
 */
