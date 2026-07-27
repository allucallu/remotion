import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 4. CorporateParticleDrift — Floating Data Points
 * Fix: Frekuensi gelombang sin/cos tiap partikel (freqX, freqY) diubah ke integer murni (1, 2, 3).
 */

const LOOP_DURATION = 180;
const W = 3840;
const H = 2160;
const NUM_PARTICLES = 45;
const CONNECTION_DIST = 350;

type CorporateParticleDriftProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const hash = (n: number): number => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// freqX & freqY diubah menjadi bilangan bulat murni (1, 2, atau 3) agar tiap partikel menyelesaikan siklus utuh
const particleConfigs = Array.from({ length: NUM_PARTICLES }, (_, i) => ({
  baseX: hash(i * 3 + 1) * W,
  baseY: hash(i * 3 + 2) * H,
  moveX: (hash(i * 5 + 3) - 0.5) * 500,
  moveY: (hash(i * 5 + 4) - 0.5) * 400,
  phaseX: hash(i * 7 + 5) * Math.PI * 2,
  phaseY: hash(i * 7 + 6) * Math.PI * 2,
  freqX: Math.floor(1 + hash(i * 11 + 7) * 3), // Integer: 1, 2, atau 3
  freqY: Math.floor(1 + hash(i * 11 + 8) * 3), // Integer: 1, 2, atau 3
  size: 3 + hash(i * 13 + 9) * 5,
  layer: Math.floor(hash(i * 17 + 10) * 3),
}));

export const CorporateParticleDrift: React.FC<CorporateParticleDriftProps> = ({
  primaryColor = '#0A0E17',
  secondaryColor = '#2962FF',
  accentColor = '#82B1FF',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const positions = particleConfigs.map((p) => ({
    x: p.baseX + Math.sin(theta * p.freqX + p.phaseX) * p.moveX * intensity,
    y: p.baseY + Math.cos(theta * p.freqY + p.phaseY) * p.moveY * intensity,
    size: p.size,
    layer: p.layer,
  }));

  const connections: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (Math.abs(positions[i].layer - positions[j].layer) > 1) continue;
      const dx = positions[i].x - positions[j].x;
      const dy = positions[i].y - positions[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECTION_DIST) {
        connections.push({
          x1: positions[i].x, y1: positions[i].y,
          x2: positions[j].x, y2: positions[j].y,
          opacity: (1 - dist / CONNECTION_DIST) * 0.3,
        });
      }
    }
  }

  const layerStyle = [
    { opacity: 0.3, sizeMul: 0.6, color: accentColor + '60' },
    { opacity: 0.6, sizeMul: 1.0, color: accentColor + 'A0' },
    { opacity: 1.0, sizeMul: 1.4, color: secondaryColor },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        {connections.map((c, i) => (
          <line key={`l-${i}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={accentColor} strokeWidth={1} opacity={c.opacity} />
        ))}
        {positions.map((p, i) => {
          const ls = layerStyle[p.layer];
          return (
            <circle key={`p-${i}`} cx={p.x} cy={p.y} r={p.size * ls.sizeMul}
              fill={ls.color} opacity={ls.opacity} />
          );
        })}
      </svg>

      {/* Central ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${secondaryColor}08 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 45%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.03,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-pd">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-pd)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * freqX dan freqY untuk setiap partikel dijamin bernilai integer (1, 2, atau 3).
 * Oleh karena itu, sin(theta * freqX + phaseX) dan cos(theta * freqY + phaseY)
 * dipastikan menyelesaikan persis 1, 2, atau 3 gelombang penuh dalam 180 frame.
 * Posisi semua partikel di frame 180 persis sama dengan frame 0.
 */
