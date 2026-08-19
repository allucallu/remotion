import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter Google Font
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface LowerThirdGlassPillProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 17: LowerThirdGlassPill (Futuristic Bio-Tech Glass Capsule & Laser Node Ring)
 * Niche: Bio-Tech, Medical AI, Cybernetic Healthcare, Futuristic Product Launch.
 * Features:
 * - Left Holographic Laser Node Ring (160px x 160px, 4K) with orbital DNA / Atom core emblem.
 * - Extended Curved Capsule Glass Panel (1350px x 140px, 4K) with luminous Mint Emerald & Turquoise Cyan gradients.
 * - Luminous Slate Glass fills (#1C2E2A -> #0C1A18) for 100% sharp contrast on black background.
 * - 100% Blank SVG Graphic canvas ready for custom text overlay in Premiere/DaVinci.
 * - Entrance (1.0s / 30f): Laser Ring Ripple Pulse & Horizontal Pod Shutter Unfold.
 * - Hold (5.0s / 150f): Orbital Atom rotation, pulsing nucleus, & liquid sheen wave pass.
 * - Exit (1.0s / 30f): Capsule pod retracts into ring, ring implodes into core flash dot.
 * - Total Duration: 7.0 seconds (210 frames @ 30fps).
 */
export const LowerThirdGlassPill: React.FC<LowerThirdGlassPillProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#00F5A0', // Luminous Mint Emerald
  accentGradientEnd = '#00D9F5', // Electric Turquoise Cyan
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE ANIMASI (210 Frame @ 30fps = 7.0 Detik)
  // Frame 0-30: Entrance Phase (In 1.0s)
  //   - Frame 2-18: Laser Node Ring Ripple Scale Up
  //   - Frame 10-28: Glass Capsule Pod Shutter Unfold
  // Frame 30-180: Hold Phase (Hold 5.0s = 150f)
  //   - Orbital Atom Node Rotation
  //   - Nucleus Breathing Pulse
  //   - Liquid Sheen Wave Pass
  // Frame 180-210: Exit Phase (Out 1.0s = 30f)
  //   - Frame 180-195: Capsule Pod Retracts to Left Ring
  //   - Frame 190-210: Laser Node Ring Implodes into Core Flash
  // ==========================================

  // --- ENTRANCE SPRINGS & TRANSFORMS ---
  // Left Laser Node Ring Spring (Frame 2 - 18)
  const ringSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 150 },
  });

  // Glass Capsule Pod Unfold Spring (Frame 10 - 28)
  const podSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 130 },
  });

  // --- HOLD PHASE IDLE MOTION (Frame 30 - 180) ---
  const idleTime = Math.max(0, frame - 30) / 30;

  // Orbital Atom Node Rotation (0° -> 180°)
  const orbitRotate = idleTime * 36;

  // Core Nucleus Breathing Pulse
  const corePulseOpacity = frame >= 30 && frame < 180
    ? 0.8 + Math.sin(idleTime * 3.5) * 0.2
    : 0.85;

  // Liquid Sheen Wave Sweep Pass
  const sheenX = frame >= 30 && frame < 180
    ? interpolate((frame - 30) % 80, [0, 80], [-350, 1600], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -350;

  // --- EXIT PHASE (Frame 180 - 210) ---
  const exitProgress = interpolate(frame, [180, 208], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Capsule Pod Retracts to Left Ring (Frame 180 - 198)
  const podExitProgress = interpolate(exitProgress, [0, 0.6], [1, 0]);

  // Laser Node Ring Implosion (Frame 190 - 210)
  const ringExitScale = interpolate(exitProgress, [0.4, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // Combined Scale Transforms
  const finalPodScaleX = podSpring * podExitProgress;
  const titleTextOpacity = interpolate(podSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(podSpring, [0, 1], [0, 1]) * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* BIO-TECH GLASS PILL CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1540px',
          height: '220px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT MINT & TURQUOISE GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '10px',
            width: '1300px',
            height: '220px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: ringSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1540"
          height="220"
          viewBox="0 0 1540 220"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Mint Emerald to Turquoise Cyan Bio Gradient */}
            <linearGradient id="bio-mint-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="bio-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E332E" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#142622" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0B1A18" stopOpacity="0.98" />
            </linearGradient>

            {/* Metallic Sheen Gradient */}
            <linearGradient id="bio-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#D1FAE5" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="bio-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="mint-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentColor} floodOpacity={corePulseOpacity} />
            </filter>

            {/* Clip Path for Main Pod Sheen */}
            <clipPath id="bio-pod-clip">
              <rect x="180" y="20" width="1320" height="140" rx="36" ry="36" />
            </clipPath>
          </defs>

          {/* LAYER 1: MAIN CURVED GLASS CAPSULE POD (1350px Wide x 140px Tall, 4K) */}
          <g
            transform={`scale(${finalPodScaleX}, 1)`}
            style={{ transformOrigin: '160px 90px' }}
            opacity={podSpring}
            filter="url(#bio-shadow)"
          >
            {/* Outer Capsule Glass Body with Rounded Ends (rx="36", ry="36") */}
            <rect
              x="180"
              y="20"
              width="1320"
              height="140"
              rx="36"
              ry="36"
              fill="url(#bio-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Left Vertical Capsule Anchor Strip */}
            <rect
              x="180"
              y="20"
              width="18"
              height="140"
              rx="9"
              ry="9"
              fill="url(#bio-mint-grad)"
              filter="url(#mint-glow)"
            />

            {/* Top Metallic White Highlight Curve */}
            <line x1="210" y1="21" x2="1470" y2="21" stroke="#FFFFFF" strokeWidth="2" opacity="0.85" />

            {/* Bottom Neon Accent Underline */}
            <line
              x1="210"
              y1="159"
              x2="1470"
              y2="159"
              stroke="url(#bio-mint-grad)"
              strokeWidth="3.5"
              filter="url(#mint-glow)"
            />

            {/* Liquid Sheen Wave Pass */}
            <g clipPath="url(#bio-pod-clip)">
              <rect
                x={sheenX}
                y="20"
                width="320"
                height="140"
                fill="url(#bio-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Subtitle Divider Hairline (y = 100px) */}
            <line
              x1="220"
              y1="100"
              x2="1460"
              y2="100"
              stroke={accentColor}
              strokeWidth="1.2"
              opacity="0.6"
            />

            {/* Right Side Capsule Notch Dots */}
            <g transform="translate(1450, 40)" opacity="0.8">
              <circle cx="0" cy="0" r="3.5" fill="#00F5A0" />
              <circle cx="0" cy="16" r="3.5" fill="#00D9F5" />
              <circle cx="0" cy="32" r="3.5" fill="#00F5A0" />
            </g>
          </g>

          {/* LAYER 2: LEFT HOLOGRAPHIC LASER NODE RING (160px Wide x 160px Tall, Center 90, 90) */}
          <g
            transform={`translate(90, 90) scale(${ringSpring * ringExitScale})`}
            opacity={ringSpring}
            filter="url(#bio-shadow)"
          >
            {/* Outer Pulsing Laser Ring (r = 65px) */}
            <circle
              cx="0"
              cy="0"
              r="65"
              fill="none"
              stroke="url(#bio-mint-grad)"
              strokeWidth="3.5"
              filter="url(#mint-glow)"
            />

            {/* 8 Orbital Nodes along Outer Ring */}
            <g transform={`rotate(${orbitRotate})`}>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={Math.sin(rad) * 65}
                    cy={-Math.cos(rad) * 65}
                    r="4"
                    fill={deg % 90 === 0 ? "#00F5A0" : "#00D9F5"}
                  />
                );
              })}
            </g>

            {/* Inner Concentric Circle Reticle (r = 44px) */}
            <circle
              cx="0"
              cy="0"
              r="44"
              fill="none"
              stroke="#00D9F5"
              strokeWidth="2"
              strokeDasharray="10 6"
              opacity="0.8"
            />

            {/* 3D DNA Atom Nucleus Core (Center Node Emblem) */}
            <g filter="url(#mint-glow)">
              <ellipse cx="0" cy="0" rx="24" ry="10" fill="none" stroke="#00F5A0" strokeWidth="1.8" transform={`rotate(${orbitRotate})`} />
              <ellipse cx="0" cy="0" rx="24" ry="10" fill="none" stroke="#00D9F5" strokeWidth="1.8" transform={`rotate(${orbitRotate + 60})`} />
              <ellipse cx="0" cy="0" rx="24" ry="10" fill="none" stroke="#FFFFFF" strokeWidth="1.8" transform={`rotate(${orbitRotate + 120})`} />
              <circle cx="0" cy="0" r="6" fill="#00F5A0" opacity={corePulseOpacity} />
              <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
            </g>
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '42px',
              left: '230px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 14px rgba(0,0,0,0.95)',
              }}
            >
              {title}
            </span>
          </div>
        )}

        {subtitle && (
          <div
            style={{
              position: 'absolute',
              top: '118px',
              left: '230px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#00F5A0',
                letterSpacing: '2px',
                lineHeight: 1,
              }}
            >
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
