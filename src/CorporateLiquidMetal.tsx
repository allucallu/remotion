import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { noise2D } from '@remotion/noise';

/**
 * 9. CorporateLiquidMetal — Mercury Flow
 * Fix: Pengali theta pada specular highlight & blob position diubah ke integer murni.
 */

const LOOP_DURATION = 300;
const W = 3840;
const H = 2160;

type CorporateLiquidMetalProps = {
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
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
};

const generateMetalBlob = (
  cx: number, cy: number, baseR: number,
  numPts: number, seed: string, theta: number,
  noiseScale: number, noiseAmp: number,
): string => {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPts; i++) {
    const angle = (i / numPts) * Math.PI * 2;
    const nx = Math.cos(theta * 1) * noiseScale + Math.cos(angle) * 2.5;
    const ny = Math.sin(theta * 1) * noiseScale + Math.sin(angle) * 2.5;
    const nv = noise2D(seed, nx, ny);
    const r = baseR + nv * noiseAmp;
    points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return smoothClosedPath(points);
};

export const CorporateLiquidMetal: React.FC<CorporateLiquidMetalProps> = ({
  primaryColor = '#0D0D0D',
  secondaryColor = '#37474F',
  accentColor = '#B0BEC5',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  // Highlight offset diubah ke integer (theta * 1)
  const hlX = 40 + Math.sin(theta * 1 + 0.0) * 15;
  const hlY = 35 + Math.cos(theta * 1 + 0.5) * 10;

  const blobs = [
    { cx: W * 0.4, cy: H * 0.45, baseR: 550, pts: 10, seed: 'lm-1', ns: 0.5, na: 200 * intensity,
      ox: Math.sin(theta * 1 + 0.0) * 100, oy: Math.cos(theta * 1 + 0.5) * 80, blur: 60, opacity: 0.7 },
    { cx: W * 0.6, cy: H * 0.55, baseR: 420, pts: 10, seed: 'lm-2', ns: 0.7, na: 160 * intensity,
      ox: Math.cos(theta * 1 + 1.0) * 120, oy: Math.sin(theta * 2 + 2.0) * 90, blur: 40, opacity: 0.8 },
    { cx: W * 0.5, cy: H * 0.5, baseR: 300, pts: 12, seed: 'lm-3', ns: 0.9, na: 120 * intensity,
      ox: Math.sin(theta * 2 + 2.0) * 80, oy: Math.cos(theta * 1 + 1.0) * 60, blur: 20, opacity: 0.9 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {blobs.map((b, i) => {
        const gradId = `metal-grad-${i}`;
        return (
          <svg key={i} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            style={{ position: 'absolute', inset: 0, filter: `blur(${b.blur}px)`, opacity: b.opacity }}>
            <defs>
              <radialGradient id={gradId} cx={`${hlX}%`} cy={`${hlY}%`} r="60%">
                <stop offset="0%" stopColor="#ECEFF1" />
                <stop offset="30%" stopColor={accentColor} />
                <stop offset="60%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor={primaryColor} />
              </radialGradient>
            </defs>
            <path
              d={generateMetalBlob(b.cx + b.ox, b.cy + b.oy, b.baseR, b.pts, b.seed, theta, b.ns, b.na)}
              fill={`url(#${gradId})`} />
          </svg>
        );
      })}

      {/* Specular highlight */}
      <div style={{
        position: 'absolute', left: `${hlX}%`, top: `${hlY}%`,
        width: 400, height: 400, marginLeft: -200, marginTop: -200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 30%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.04,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-lm">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-lm)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP PROOF:
 * Offset blob (ox, oy), posisi highlight (hlX, hlY), dan morphing noise2D
 * semuanya menggunakan pengali theta * 1 dan theta * 2 (integer).
 * Frame 300 menyambung persis ke frame 0 tanpa patahan.
 */
