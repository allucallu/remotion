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

export type LowerThirdBg = 'black' | 'greenscreen' | string;

export interface LowerThirdFluidProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdFluid Composition (Varian 4: Organic-Fluid / Liquid Bio & Creative Lifestyle Style)
 * Features smooth organic curved capsules (radius 36px), liquid wave bezier underlines,
 * floating ambient droplet micro-motion, Emerald Mint to Indigo-Violet gradients (#10B981 -> #06B6D4 -> #6366F1),
 * and ultra-smooth fluid spring physics.
 */
export const LowerThirdFluid: React.FC<LowerThirdFluidProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#10B981', // Emerald Mint
  accentGradientEnd = '#06B6D4', // Vibrant Cyan
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE ANIMASI (180 Frame @ 30fps = 6.0 Detik)
  // Frame 0-45: Fluid Morphing Organic Entrance
  // Frame 45-145: Hold Phase + Liquid Wave Oscillation & Floating Droplet Micro-Motion
  // Frame 145-175: Smooth Liquid Bubble Shrink Exit (Beda gaya dari V1, V2, V3)
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Fluid Organic Elastic Physics) ---
  // Layer 0: Ambient Liquid Glow Entrance (Frame 0 - 20)
  const glowEntrance = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Layer 1: Main Fluid Capsule Entrance (Frame 4 - 32)
  const mainCapsuleSpring = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 14, mass: 0.9, stiffness: 85 }, // Fluid spring
  });

  // Layer 2: Subtitle Floating Pill Container Entrance (Frame 16 - 42)
  const subCapsuleSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 15, mass: 0.9, stiffness: 90 },
  });

  // Layer 3: Liquid Wave Line-Draw Progress (Frame 20 - 45)
  const waveDrawProgress = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Layer 4: Droplets Pop (Frame 25 - 45)
  const dropletPopSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 130 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Liquid Bubble Shrink Exit) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.2]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  // Liquid Wave Morphing Bezier Shift
  const waveMorphShift = frame >= 45 && frame < 145 ? Math.sin(idleTime * 3.0) * 12 : 0;

  // Floating Droplet Sine Motion
  const dropletY1 = frame >= 45 && frame < 145 ? Math.sin(idleTime * 2.8) * 8 : 0;
  const dropletY2 = frame >= 45 && frame < 145 ? Math.cos(idleTime * 3.4) * 10 : 0;
  const dropletY3 = frame >= 45 && frame < 145 ? Math.sin(idleTime * 2.2 + 1) * 7 : 0;

  // Fluid Sheen Pass
  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 95, [0, 95], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- FINAL TRANSFORMS ---
  const mainCapsuleScale = mainCapsuleSpring * exitScale;
  const subCapsuleTranslateY = interpolate(subCapsuleSpring, [0, 1], [-25, 0]);

  const titleTextOpacity = interpolate(mainCapsuleSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(subCapsuleSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* ORGANIC FLUID LOWER THIRD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '300px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT LIQUID GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            left: '80px',
            width: '1250px',
            height: '170px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}25 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: glowEntrance * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1680"
          height="300"
          viewBox="0 0 1680 300"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Liquid Emerald-Cyan Gradient */}
            <linearGradient id="fluid-emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={accentGradientEnd} />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            {/* Organic Main Glass Capsule Dark Gradient */}
            <linearGradient id="fluid-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.94" />
              <stop offset="50%" stopColor="#090E17" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#04070D" stopOpacity="0.97" />
            </linearGradient>

            {/* Subtitle Glass Pill Gradient */}
            <linearGradient id="fluid-sub-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.78" />
            </linearGradient>

            {/* Liquid Sheen Sweep Gradient */}
            <linearGradient id="fluid-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Soft Organic Drop Shadow */}
            <filter id="fluid-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#000000" floodOpacity="0.75" />
            </filter>

            <filter id="emerald-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentGradientEnd} floodOpacity="0.65" />
            </filter>

            {/* Clip Path for Main Capsule Sheen (Radius 36px) */}
            <clipPath id="fluid-capsule-clip">
              <rect x="0" y="0" width="1440" height="136" rx="36" ry="36" />
            </clipPath>
          </defs>

          {/* LAYER 1: MAIN ORGANIC GLASS CAPSULE (Radius 36px) */}
          <g
            transform={`scale(${mainCapsuleScale}, ${mainCapsuleSpring})`}
            style={{ transformOrigin: '180px 68px' }}
            opacity={mainCapsuleSpring}
            filter="url(#fluid-shadow)"
          >
            {/* Main Capsule Body */}
            <rect
              x="0"
              y="0"
              width="1440"
              height="136"
              rx="36"
              ry="36"
              fill="url(#fluid-glass-grad)"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="2"
            />

            {/* Top Curved Highlight Edge */}
            <path
              d="M 36 2 C 200 2, 1240 2, 1404 2"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Fluid Sheen Sweep Pass */}
            <g clipPath="url(#fluid-capsule-clip)">
              <rect
                x={sheenX}
                y="0"
                width="320"
                height="136"
                fill="url(#fluid-sheen-grad)"
                transform="skewX(-18)"
              />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE FLOATING GLASS PILL (Radius 24px) */}
          <g
            transform={`translate(0, ${154 + subCapsuleTranslateY}) scale(${subCapsuleSpring}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={subCapsuleSpring}
            filter="url(#fluid-shadow)"
          >
            {/* Subtitle Pill Container */}
            <rect
              x="0"
              y="0"
              width="980"
              height="64"
              rx="24"
              ry="24"
              fill="url(#fluid-sub-grad)"
              stroke="rgba(6, 182, 212, 0.25)"
              strokeWidth="1.2"
            />
            {/* Left Liquid Blob Pill Accent */}
            <rect x="16" y="16" width="10" height="32" rx="5" ry="5" fill="url(#fluid-emerald-grad)" />
          </g>

          {/* LAYER 3: LIQUID WAVE UNDERLINE ACCENT (Cubic Bezier Organic Wave) */}
          <g opacity={mainCapsuleSpring} filter="url(#emerald-glow)">
            <path
              d={`M 200 136 Q ${600 + waveMorphShift} ${136 + waveMorphShift * 0.4}, 800 136 T 1400 136`}
              fill="none"
              stroke="url(#fluid-emerald-grad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="1200"
              strokeDashoffset={1200 * (1 - waveDrawProgress)}
            />
          </g>

          {/* LAYER 4: FLOATING AMBIENT LIQUID DROPLETS */}
          {/* Droplet 1 (Left Main Pill) */}
          <g
            transform={`translate(60, ${68 + dropletY1}) scale(${dropletPopSpring})`}
            style={{ transformOrigin: 'center center' }}
            opacity={mainCapsuleSpring}
            filter="url(#emerald-glow)"
          >
            <circle cx="0" cy="0" r="14" fill="url(#fluid-emerald-grad)" />
            <circle cx="-4" cy="-4" r="4" fill="#FFFFFF" opacity="0.8" />
          </g>

          {/* Droplet 2 (Middle Satellite) */}
          <g
            transform={`translate(100, ${42 + dropletY2}) scale(${dropletPopSpring * 0.8})`}
            style={{ transformOrigin: 'center center' }}
            opacity={mainCapsuleSpring * 0.8}
            filter="url(#emerald-glow)"
          >
            <circle cx="0" cy="0" r="8" fill={accentGradientEnd} />
            <circle cx="-2" cy="-2" r="2.5" fill="#FFFFFF" opacity="0.9" />
          </g>

          {/* Droplet 3 (Right Edge Satellite) */}
          <g
            transform={`translate(1410, ${68 + dropletY3}) scale(${dropletPopSpring})`}
            style={{ transformOrigin: 'center center' }}
            opacity={mainCapsuleSpring}
            filter="url(#emerald-glow)"
          >
            <circle cx="0" cy="0" r="10" fill="url(#fluid-emerald-grad)" />
            <circle cx="-3" cy="-3" r="3" fill="#FFFFFF" opacity="0.85" />
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '42px',
              left: '140px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '52px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 14px rgba(0,0,0,0.7)',
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
              top: '172px',
              left: '52px',
              opacity: subTextOpacity,
              transform: `translateY(${subCapsuleTranslateY}px)`,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#E2E8F0',
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
