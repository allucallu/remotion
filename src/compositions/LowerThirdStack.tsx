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

export interface LowerThirdStackProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdStack Composition (Varian 9: Offset 3D Layered Card Stack - 100% Blank Stock Graphic)
 * Purged all hardcoded text tags from SVG graphic layers so video editors have a 100% clean,
 * empty canvas to overlay their own custom text in Premiere/DaVinci/After Effects.
 */
export const LowerThirdStack: React.FC<LowerThirdStackProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#06B6D4', // Electric Cyan
  accentGradientEnd = '#3B82F6', // Royal Sapphire Blue
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
  // TIMELINE ANIMASI (180 Frame @ 30fps = 6.0 Detik)
  // Frame 0-45: 3D Fanning Deck Deal Entrance
  // Frame 45-145: Hold Phase + 3D Floating Micro-Motion & Metallic Foil Sheen
  // Frame 145-175: 3D Card Flip & Gather Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (3D Card Unfold & Fanning Physics) ---
  const deckSlideSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 130 },
  });

  const backCardUnfold = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 125 },
  });

  const midCardUnfold = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 125 },
  });

  const frontCardSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 135 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, 3D Card Flip & Gather Collapse) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const gatherRotation = interpolate(exitProgress, [0, 0.5], [1, 0]);
  const exitRotateX = interpolate(exitProgress, [0.3, 1], [0, 90]);
  const exitTranslateY = interpolate(exitProgress, [0.3, 1], [0, 180]);
  const exitOpacity = interpolate(exitProgress, [0.6, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const cardFloatY1 = frame >= 45 && frame < 145 ? Math.sin(idleTime * 2.2) * 5 : 0;
  const cardFloatY2 = frame >= 45 && frame < 145 ? Math.cos(idleTime * 2.5) * 6 : 0;
  const cardFloatY3 = frame >= 45 && frame < 145 ? Math.sin(idleTime * 1.8 + 1) * 4 : 0;

  // Metallic Foil Sheen Pass
  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1800], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const deckTranslateY = interpolate(deckSlideSpring, [0, 1], [180, 0]);

  const rotBack = -3.2 * backCardUnfold * gatherRotation;
  const rotMid = 2.0 * midCardUnfold * gatherRotation;

  const titleTextOpacity = interpolate(frontCardSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(frontCardSpring, [0, 1], [0, 1]) * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        perspective: '1200px',
      }}
    >
      {/* 3D LAYERED CARD STACK CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '200px',
          left: '200px',
          width: '1720px',
          height: '360px',
          transformStyle: 'preserve-3d',
          transform: `translateY(${deckTranslateY + exitTranslateY}px) rotateX(${exitRotateX}deg)`,
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT CYAN-BLUE GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '80px',
            width: '1350px',
            height: '240px',
            background: `radial-gradient(ellipse at center, ${accentColor}35 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(65px)',
            opacity: deckSlideSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1720"
          height="360"
          viewBox="0 0 1720 360"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Electric Cyan to Sapphire Gradient */}
            <linearGradient id="stack-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={accentGradientEnd} />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="stack-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#262A3C" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#1A1D2D" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0F1220" stopOpacity="0.98" />
            </linearGradient>

            {/* Middle Card Accent Fill Gradient */}
            <linearGradient id="stack-glass-mid" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1F2336" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#131628" stopOpacity="0.85" />
            </linearGradient>

            {/* Metallic Sheen Gradient */}
            <linearGradient id="stack-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep 3D Drop Shadows */}
            <filter id="stack-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="22" stdDeviation="28" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity={0.7} />
            </filter>

            {/* Clip Path for Expanded Front Card Sheen */}
            <clipPath id="stack-front-clip">
              <rect x="0" y="0" width="1580" height="190" rx="22" ry="22" />
            </clipPath>
          </defs>

          {/* CARD 1: BACK OFFSET CARD */}
          <g
            transform={`translate(0, ${24 + cardFloatY1}) rotate(${rotBack})`}
            style={{ transformOrigin: '200px 100px' }}
            opacity={backCardUnfold}
            filter="url(#cyan-glow)"
          >
            <rect
              x="0"
              y="0"
              width="1560"
              height="190"
              rx="24"
              ry="24"
              fill="none"
              stroke="url(#stack-cyan-grad)"
              strokeWidth="4"
            />
          </g>

          {/* CARD 2: MIDDLE OFFSET ACCENT CARD */}
          <g
            transform={`translate(12, ${12 + cardFloatY2}) rotate(${rotMid})`}
            style={{ transformOrigin: '200px 95px' }}
            opacity={midCardUnfold}
            filter="url(#stack-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="1570"
              height="190"
              rx="22"
              ry="22"
              fill="url(#stack-glass-mid)"
              stroke="rgba(59, 130, 246, 0.45)"
              strokeWidth="2"
            />
            {/* Top Accent Strip */}
            <line x1="24" y1="1" x2="1546" y2="1" stroke="#3B82F6" strokeWidth="2.5" opacity="0.85" />
            
            {/* Top-Right Telemetry Metric Ticks */}
            <g transform="translate(1420, 20)" opacity="0.7">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={i} x1={i * 14} y1="0" x2={i * 14} y2="10" stroke="#3B82F6" strokeWidth="2" />
              ))}
            </g>
          </g>

          {/* CARD 3: FRONT MAIN EXPANDED LUMINOUS SLATE CARD (100% BLANK CANVAS) */}
          <g
            transform={`translate(24, ${0 + cardFloatY3}) scale(${frontCardSpring}, 1)`}
            style={{ transformOrigin: '0px 95px' }}
            opacity={frontCardSpring}
            filter="url(#stack-shadow)"
          >
            {/* Front Main Card Body */}
            <rect
              x="0"
              y="0"
              width="1580"
              height="190"
              rx="22"
              ry="22"
              fill="url(#stack-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Left Vertical Accent Anchor Bar */}
            <rect x="0" y="0" width="14" height="190" rx="7" ry="7" fill="url(#stack-cyan-grad)" />

            {/* Top Metallic White Highlight Line */}
            <line x1="24" y1="1" x2="1556" y2="1" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

            {/* Metallic Sheen Pass */}
            <g clipPath="url(#stack-front-clip)">
              <rect
                x={sheenX}
                y="0"
                width="340"
                height="190"
                fill="url(#stack-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Front Card Corner Notches */}
            <g transform="translate(1550, 24)" opacity="0.7">
              <path d="M -18 0 L 0 0 L 0 18" fill="none" stroke="#06B6D4" strokeWidth="2.5" />
            </g>
          </g>

          {/* SUBTITLE NEON PILL CONTAINER (100% BLANK CANVAS - ZERO HARDCODED TEXT) */}
          <g
            transform={`translate(42, ${214 + cardFloatY3}) scale(${frontCardSpring}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={frontCardSpring}
            filter="url(#stack-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="1120"
              height="64"
              rx="20"
              ry="20"
              fill="url(#stack-glass-front)"
              stroke="#06B6D4"
              strokeWidth="1.8"
            />
            <rect x="0" y="0" width="10" height="64" rx="5" ry="5" fill="url(#stack-cyan-grad)" />

            {/* Abstract Luminous Status Indicator (Pure Graphic, Zero Text) */}
            <g transform="translate(24, 20)">
              <circle cx="8" cy="12" r="5" fill="#06B6D4" filter="url(#cyan-glow)" />
              <circle cx="28" cy="12" r="3" fill="#38BDF8" opacity="0.8" />
              <circle cx="42" cy="12" r="3" fill="#38BDF8" opacity="0.5" />
            </g>
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '52px',
              left: '78px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '56px',
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
              top: '230px',
              left: '120px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#38BDF8',
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
