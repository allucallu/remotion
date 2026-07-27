import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';

/**
 * 3. CorporateBlobMorph — Organic Shape Shifting
 * Fix: Semua pergeseran blob (ox, oy) menggunakan pengali theta integer murni.
 */

const LOOP_DURATION = 240;
const W = 3840;
const H = 2160;

type CorporateBlobMorphProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

const smoothClosedPath = (points: { x: number; y: number }[]): string => {
  const n = points.length;
  if (n < 3) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const generateBlobPath = (
  cx: number, cy: number, baseR: number,
  numPts: number, seed: string, theta: number,
  noiseScale: number, noiseAmp: number,
): string => {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPts; i++) {
    const angle = (i / numPts) * Math.PI * 2;
    const nx = Math.cos(theta * 1) * noiseScale + Math.cos(angle) * 2;
    const ny = Math.sin(theta * 1) * noiseScale + Math.sin(angle) * 2;
    const nv = noise2D(seed, nx, ny);
    const r = baseR + nv * noiseAmp;
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return smoothClosedPath(points);
};

export const CorporateBlobMorph: React.FC<CorporateBlobMorphProps> = ({
  primaryColor = '#0D1B2A',
  secondaryColor = '#1B4965',
  accentColor = '#5FA8D3',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const blobs = [
    { cx: W * 0.35, cy: H * 0.45, baseR: 500, pts: 8, seed: 'bm-bg1', ns: 0.6, na: 150 * intensity,
      ox: Math.sin(theta * 1 + 0.0) * 100 * intensity, oy: Math.cos(theta * 1 + 0.5) * 60 * intensity,
      color: secondaryColor, opacity: 0.4, blur: 100 },
    { cx: W * 0.7, cy: H * 0.55, baseR: 450, pts: 8, seed: 'bm-bg2', ns: 0.5, na: 120 * intensity,
      ox: Math.cos(theta * 1 + 1.0) * 80 * intensity, oy: Math.sin(theta * 2 + 2.0) * 70 * intensity,
      color: accentColor, opacity: 0.25, blur: 130 },
    { cx: W * 0.5, cy: H * 0.4, baseR: 380, pts: 10, seed: 'bm-mid', ns: 0.8, na: 180 * intensity,
      ox: Math.sin(theta * 2 + 0.5) * 120 * intensity, oy: Math.cos(theta * 1 + 1.5) * 80 * intensity,
      color: secondaryColor, opacity: 0.5, blur: 60 },
    { cx: W * 0.55, cy: H * 0.6, baseR: 250, pts: 12, seed: 'bm-fg', ns: 1.0, na: 100 * intensity,
      ox: Math.sin(theta * 1 + 2.0) * 60 * intensity, oy: Math.cos(theta * 2 + 1.0) * 50 * intensity,
      color: accentColor, opacity: 0.35, blur: 30 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {blobs.map((b, i) => (
        <svg key={i} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
          style={{ position: 'absolute', inset: 0, filter: `blur(${b.blur}px)`, opacity: b.opacity }}>
          <path
            d={generateBlobPath(b.cx + b.ox, b.cy + b.oy, b.baseR, b.pts, b.seed, theta, b.ns, b.na)}
            fill={b.color}
          />
        </svg>
      ))}

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 45%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.035,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-bm">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-bm)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Semua pergerakan offset blob (ox, oy) menggunakan pengali theta * 1 dan theta * 2 (integer).
 * Noise generator menggunakan cos(theta*1) dan sin(theta*1) yang melingkar sempurna.
 * Frame 240 menyambung persis ke frame 0.
 */
