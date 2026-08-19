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

export interface LowerThirdMinimalProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdMinimal Composition (Varian 2: Ultra-Premium Editorial Luxury)
 * Redesigned with 4-layer glassmorphic depth, asymmetric bevel geometry, champagne gold light sheen,
 * diamond focal cluster, dual line-draw accents, and editorial slow spring physics.
 */
export const LowerThirdMinimal: React.FC<LowerThirdMinimalProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#D4AF37', // Champagne Gold
  accentGradientEnd = '#FEF3C7', // Soft Light Gold
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
  // Frame 0-45: Luxury Staggered Layered Entrance
  // Frame 45-145: Hold Phase + Light Sheen Pass & Diamond Breathing
  // Frame 145-175: Horizontal Focal Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Editorial Slow Luxury Physics) ---
  // Layer 0: Ambient Gold Back Glow (Frame 0 - 20)
  const glowEntrance = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  // Layer 1: Diamond Focal Cluster Pop (Frame 2 - 22)
  const notchSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 110 },
  });

  // Layer 2: Dual Hairline Line-Draw (Frame 8 - 32)
  const lineDrawProgress = interpolate(frame, [8, 32], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Layer 3: Main Glass Panel Unfold (Frame 14 - 42)
  const glassPanelSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 18, mass: 1.2, stiffness: 55 }, // Slow luxury ease-out
  });

  // Layer 4: Subtitle Glass Container Slide Down (Frame 22 - 45)
  const subPanelSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 16, mass: 1.0, stiffness: 65 },
  });

  // --- EXIT COLLAPSE PHYSICS (Frame 145 - 175, Horizontal Focal Collapse) ---
  // Subtitle Container Slides Up & Fades (Frame 145 - 158)
  const subExitProgress = interpolate(frame, [145, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Main Glass Panel Collapses Horizontally (Frame 152 - 166)
  const mainExitProgress = interpolate(frame, [152, 166], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Hairlines Contract into Center Diamond (Frame 160 - 172)
  const lineExitProgress = interpolate(frame, [160, 172], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Focal Diamond Cluster Shrinks Away (Frame 166 - 176)
  const notchExit = interpolate(frame, [166, 176], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // --- HOLD PHASE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  // Diamond Cluster Sine-Wave Breathing
  const diamondScale = frame >= 45 && frame < 145 ? 1.0 + Math.sin(idleTime * 2.5) * 0.06 : 1.0;
  const diamondGlowOpacity = frame >= 45 && frame < 145 ? 0.65 + Math.sin(idleTime * 2.5) * 0.25 : 0.65;

  // Slow Sheen Sweep across Main Glass Surface
  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 100, [0, 100], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- FINAL TRANSFORMS ---
  const finalNotchScale = notchSpring * notchExit * diamondScale;
  const finalLineProgress = lineDrawProgress * lineExitProgress;

  const glassScaleXEntrance = glassPanelSpring;
  const glassScaleXExit = interpolate(mainExitProgress, [0, 1], [1, 0]);
  const finalGlassScaleX = glassScaleXEntrance * glassScaleXExit;
  const finalGlassOpacity = interpolate(mainExitProgress, [0, 1], [1, 0]);

  const subTranslateYEntrance = interpolate(subPanelSpring, [0, 1], [-20, 0]);
  const subTranslateYExit = interpolate(subExitProgress, [0, 1], [0, -30]);
  const finalSubOpacity = interpolate(subPanelSpring, [0, 1], [0, 1]) * interpolate(subExitProgress, [0, 1], [1, 0]);

  const titleTextOpacity = interpolate(glassPanelSpring, [0, 1], [0, 1]) * finalGlassOpacity;
  const subTextOpacity = finalSubOpacity;

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
      {/* ULTRA-PREMIUM EDITORIAL LOWER THIRD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '300px',
        }}
      >
        {/* LAYER 0: AMBIENT GOLD BACKGROUND GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '100px',
            width: '1200px',
            height: '160px',
            background: `radial-gradient(ellipse at center, ${accentColor}25 0%, transparent 70%)`,
            filter: 'blur(60px)',
            opacity: glowEntrance * finalGlassOpacity,
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
            {/* Champagne Gold Metallic Gradient */}
            <linearGradient id="minimal-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={accentGradientEnd} />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>

            {/* Main Glass Panel Dark Gradient */}
            <linearGradient id="minimal-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181F" stopOpacity="0.94" />
              <stop offset="50%" stopColor="#101015" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0A0A0D" stopOpacity="0.97" />
            </linearGradient>

            {/* Subtitle Glass Container Gradient */}
            <linearGradient id="minimal-sub-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1D1D26" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#0F0F16" stopOpacity="0.80" />
            </linearGradient>

            {/* Golden Sheen Sweep Gradient */}
            <linearGradient id="gold-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor={accentGradientEnd} stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Soft Editorial Shadow */}
            <filter id="editorial-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#000000" floodOpacity="0.75" />
            </filter>

            <filter id="gold-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentColor} floodOpacity={diamondGlowOpacity} />
            </filter>

            {/* Asymmetric Chamfered Bevel Clip Path for Main Panel */}
            <clipPath id="asymmetric-glass-clip">
              <path d="M 32 0 L 1460 0 C 1475 0 1480 12 1470 24 L 1430 134 C 1425 140 1415 144 1400 144 L 0 144 C -10 144 -16 132 -8 120 L 24 10 C 26 4 30 0 32 0 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: MAIN ASYMMETRIC FROSTED GLASS PANEL */}
          <g
            transform={`scale(${finalGlassScaleX}, 1)`}
            style={{ transformOrigin: '240px 70px' }}
            opacity={finalGlassOpacity}
            filter="url(#editorial-shadow)"
          >
            {/* Asymmetric Beveled Panel Shape */}
            <path
              d="M 32 0 L 1460 0 C 1475 0 1480 12 1470 24 L 1430 134 C 1425 140 1415 144 1400 144 L 0 144 C -10 144 -16 132 -8 120 L 24 10 C 26 4 30 0 32 0 Z"
              fill="url(#minimal-glass-grad)"
              stroke="rgba(255, 255, 255, 0.14)"
              strokeWidth="1.5"
            />

            {/* Top Micro Metallic Hairline */}
            <path
              d="M 32 1 L 1455 1"
              stroke="url(#minimal-gold-grad)"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Light Sheen Pass across Surface */}
            <g clipPath="url(#asymmetric-glass-clip)">
              <rect
                x={sheenX}
                y="0"
                width="320"
                height="144"
                fill="url(#gold-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE FLOATING GLASS CONTAINER */}
          <g
            transform={`translate(0, ${156 + subTranslateYEntrance + subTranslateYExit}) scale(1, ${subPanelSpring})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={finalSubOpacity}
            filter="url(#editorial-shadow)"
          >
            {/* Subtitle Glass Bar with Chamfer Corner */}
            <path
              d="M 0 0 L 980 0 L 940 68 L 0 68 Z"
              fill="url(#minimal-sub-grad)"
              stroke="rgba(212, 175, 55, 0.22)"
              strokeWidth="1.2"
            />
            {/* Left Accent Gold Strip */}
            <rect x="0" y="0" width="8" height="68" fill="url(#minimal-gold-grad)" />
          </g>

          {/* LAYER 3: DUAL GOLDEN HAIRLINES & LINE DRAW ACCENTS */}
          <g opacity={finalGlassOpacity}>
            {/* Vertical Accent Pillar inside Main Bar */}
            <rect
              x="240"
              y="16"
              width="5"
              height="112"
              rx="2.5"
              fill="url(#minimal-gold-grad)"
              filter="url(#gold-glow)"
              style={{
                transform: `scaleY(${finalLineProgress})`,
                transformOrigin: '240px 72px',
              }}
            />

            {/* Bottom Golden Hairline Accent */}
            <line
              x1="240"
              y1="144"
              x2="1400"
              y2="144"
              stroke="url(#minimal-gold-grad)"
              strokeWidth="2.5"
              strokeDasharray="1160"
              strokeDashoffset={1160 * (1 - finalLineProgress)}
              strokeLinecap="round"
              filter="url(#gold-glow)"
            />

            {/* Dotted Guideline Accent */}
            <line
              x1="240"
              y1="152"
              x2="1320"
              y2="152"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeDashoffset={1080 * (1 - finalLineProgress)}
            />
          </g>

          {/* LAYER 4: DIAMOND FOCAL CLUSTER & CORNER BRACKETS */}
          {/* Diamond Rhombus Focal Notch */}
          <g
            transform={`translate(242, 72) scale(${finalNotchScale})`}
            style={{ transformOrigin: 'center center' }}
            opacity={finalGlassOpacity}
            filter="url(#gold-glow)"
          >
            <polygon points="0,-14 14,0 0,14 -14,0" fill="url(#minimal-gold-grad)" />
            <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
          </g>

          {/* Top-Right & Bottom-Left Chamfered Gold Corner Brackets */}
          <g
            transform={`translate(1450, 0) scale(${finalNotchScale})`}
            style={{ transformOrigin: 'center center' }}
            opacity={finalGlassOpacity}
          >
            <path
              d="M -24 0 L 10 0 L 0 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#gold-glow)"
            />
          </g>

          {/* Subtitle Pulsing Live Dot */}
          <g
            transform={`translate(32, 190) scale(${finalNotchScale})`}
            style={{ transformOrigin: 'center center' }}
            opacity={finalSubOpacity}
          >
            <circle cx="0" cy="0" r="6" fill={accentColor} opacity={diamondGlowOpacity} />
            <circle cx="0" cy="0" r="11" fill="none" stroke={accentColor} strokeWidth="1.5" opacity={diamondGlowOpacity * 0.6} />
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE (Renders smoothly if props title/subtitle are provided) */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              left: '280px',
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
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 12px rgba(0,0,0,0.7)',
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
              top: '176px',
              left: '56px',
              opacity: subTextOpacity,
              transform: `translateY(${subTranslateYEntrance + subTranslateYExit}px)`,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 600,
                color: '#E4E4E7',
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
