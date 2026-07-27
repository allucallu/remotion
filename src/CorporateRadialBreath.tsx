import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

/**
 * 8. CorporateRadialBreath — Concentric Energy
 * Mood: Fokus, powerful, centered. Lingkaran konsentris yang berdenyut
 * seperti bernafas, memancarkan energi dari pusat.
 * Durasi Loop: 8 detik (240 frame @30fps)
 * Palet: #0A0F1A (void), #1A237E (indigo corp), #7C4DFF (violet accent)
 */

const LOOP_DURATION = 240;
const W = 3840;
const H = 2160;
const NUM_RINGS = 12;

type CorporateRadialBreathProps = {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  speed?: number;
  intensity?: number;
};

export const CorporateRadialBreath: React.FC<CorporateRadialBreathProps> = ({
  primaryColor = '#0A0F1A',
  secondaryColor = '#1A237E',
  accentColor = '#7C4DFF',
  speed = 1,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const theta = ((frame * speed) % LOOP_DURATION) / LOOP_DURATION * Math.PI * 2;

  const cx = W / 2;
  const cy = H / 2;
  const maxRadius = Math.sqrt(cx * cx + cy * cy);

  const rings = Array.from({ length: NUM_RINGS }, (_, i) => {
    const t = i / (NUM_RINGS - 1);
    const baseRadius = 100 + t * (maxRadius * 0.7);
    const phaseOffset = i * 0.5;
    const breathScale = 1 + Math.sin(theta + phaseOffset) * 0.15 * intensity;
    const radius = baseRadius * breathScale;
    const opacity = 0.08 + (1 - (Math.sin(theta + phaseOffset) * 0.5 + 0.5)) * 0.2 * intensity;
    const strokeWidth = 3 - t * 2;
    const color = i % 3 === 0 ? accentColor : secondaryColor;
    return { radius, opacity, strokeWidth, color };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: primaryColor, overflow: 'hidden' }}>
      {/* Central glow */}
      <div style={{
        position: 'absolute',
        left: cx - 400, top: cy - 400, width: 800, height: 800,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
        filter: 'blur(80px)',
      }} />

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        {rings.map((ring, i) => (
          <React.Fragment key={i}>
            {/* Glow ring */}
            <circle cx={cx} cy={cy} r={ring.radius}
              fill="none" stroke={ring.color} strokeWidth={ring.strokeWidth + 6}
              opacity={ring.opacity * 0.3} filter="url(#ring-glow)" />
            {/* Sharp ring */}
            <circle cx={cx} cy={cy} r={ring.radius}
              fill="none" stroke={ring.color} strokeWidth={ring.strokeWidth}
              opacity={ring.opacity} />
          </React.Fragment>
        ))}
      </svg>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 30%, ${primaryColor} 100%)`,
        pointerEvents: 'none',
      }} />

      {/* Film Grain */}
      <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.04,
                    mixBlendMode: 'overlay' as const, pointerEvents: 'none' as const }}>
        <filter id="grain-rb">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-rb)" />
      </svg>
    </AbsoluteFill>
  );
};

/*
 * SEAMLESS LOOP:
 * Radius dan opacity tiap cincin dihitung dari sin(theta + phaseOffset).
 * theta = progress × 2π → periodik. Phase offset berbeda per cincin
 * menciptakan efek gelombang radial. sin(0+p) = sin(2π+p) → loop sempurna.
 */
