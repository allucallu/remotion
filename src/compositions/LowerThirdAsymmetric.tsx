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

export interface LowerThirdAsymmetricProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdAsymmetric Composition (Varian 6: Refined Parallel Seam Alignment)
 * Tidy seam overlap: Right ribbon left edge slants parallel to left shield seam to eliminate poking corners.
 */
export const LowerThirdAsymmetric: React.FC<LowerThirdAsymmetricProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#F59E0B', // Warm Amber Gold
  accentGradientEnd = '#EF4444', // Crimson Red Accent
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
  // Frame 0-45: Split & Converge Collision Entrance
  // Frame 45-145: Hold Phase + 3D Tilt Breathing & Sheen Pass
  // Frame 145-175: 3D Focal Collapse & Disperse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Split & Converge Collision Physics) ---
  const leftBadgeSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 130 },
  });

  const rightRibbonSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 11, mass: 0.8, stiffness: 120 },
  });

  const seamProgress = interpolate(frame, [20, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- EXIT PHYSICS (Frame 145 - 175, 3D Focal Collapse & Disperse) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const exitRotateY = interpolate(exitProgress, [0, 1], [0, 45]);
  const exitRotateX = interpolate(exitProgress, [0, 1], [0, -25]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.1]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const disperseProgress = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const idleRotateX = frame >= 45 && frame < 145 ? Math.sin(idleTime * 2.0) * 1.5 : 0;
  const idleRotateY = frame >= 45 && frame < 145 ? Math.cos(idleTime * 2.2) * 2.0 : 0;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1600], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const leftTranslateY = interpolate(leftBadgeSpring, [0, 1], [-180, 0]);
  const rightTranslateY = interpolate(rightRibbonSpring, [0, 1], [180, 0]);

  const titleTextOpacity = interpolate(rightRibbonSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(rightRibbonSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* ASYMMETRIC FOLDING RIBBON CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '200px',
          left: '200px',
          width: '1680px',
          height: '320px',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${idleRotateY + exitRotateY}deg) rotateX(${idleRotateX + exitRotateX}deg) scale(${exitScale})`,
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT BACKGROUND GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '60px',
            width: '1150px',
            height: '200px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}25 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: leftBadgeSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1680"
          height="320"
          viewBox="0 0 1680 320"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Amber-Crimson Gradient */}
            <linearGradient id="asym-amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Left Primary Badge Glass Gradient */}
            <linearGradient id="asym-left-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A1B14" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#140B07" stopOpacity="0.98" />
            </linearGradient>

            {/* Right Overlapping Ribbon Glass Gradient */}
            <linearGradient id="asym-right-glass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A1318" stopOpacity="0.93" />
              <stop offset="100%" stopColor="#0B070A" stopOpacity="0.96" />
            </linearGradient>

            {/* Metallic Sheen Sweep Gradient */}
            <linearGradient id="asym-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep 3D Drop Shadows */}
            <filter id="asym-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="22" stdDeviation="28" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="amber-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity="0.7" />
            </filter>

            {/* Clip Path for Right Ribbon Sheen */}
            <clipPath id="asym-ribbon-clip">
              <path d="M 40 0 L 1180 0 L 1120 130 C 1115 138 1105 144 1090 144 L 0 144 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: RIGHT OVERLAPPING RIBBON BANNER (Parallel Left Slant hidden behind Seam) */}
          <g
            transform={`translate(230, ${25 + rightTranslateY})`}
            opacity={rightRibbonSpring}
            filter="url(#asym-shadow)"
          >
            {/* Ribbon Glass Body with Left Slant parallel to Seam */}
            <path
              d="M 46 0 L 1180 0 L 1120 130 C 1115 138 1105 144 1090 144 L 0 144 Z"
              fill="url(#asym-right-glass)"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
            />

            {/* Top Border Hairline */}
            <line x1="46" y1="1" x2="1175" y2="1" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />

            {/* Bottom Metallic Underline Accent */}
            <path
              d={`M 0 144 L 1090 144`}
              stroke="url(#asym-amber-grad)"
              strokeWidth="3.5"
              strokeDasharray="1090"
              strokeDashoffset={1090 * (1 - seamProgress)}
              filter="url(#amber-glow)"
            />

            {/* Light Sheen Sweep */}
            <g clipPath="url(#asym-ribbon-clip)">
              <rect
                x={sheenX}
                y="0"
                width="300"
                height="144"
                fill="url(#asym-sheen-grad)"
                transform="skewX(-22)"
              />
            </g>
          </g>

          {/* LAYER 2: LEFT PRIMARY BADGE SHIELD (Drops DOWN - Overlaps Right Ribbon) */}
          <g
            transform={`translate(0, ${leftTranslateY})`}
            opacity={leftBadgeSpring}
            filter="url(#asym-shadow)"
          >
            {/* Asymmetric Shield Body with 30° Angled Cut */}
            <path
              d="M 0 0 L 280 0 L 220 180 L 0 180 Z"
              fill="url(#asym-left-glass)"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="2"
            />

            {/* Left Accent Anchor Bar */}
            <polygon points="0,0 16,0 16,180 0,180" fill="url(#asym-amber-grad)" />

            {/* Diagonal Accent Seam Line */}
            <line
              x1="280"
              y1="0"
              x2="220"
              y2="180"
              stroke="url(#asym-amber-grad)"
              strokeWidth="4"
              filter="url(#amber-glow)"
            />

            {/* 3D Embossed Shield Notch Icon */}
            <g transform="translate(110, 75)" filter="url(#amber-glow)">
              <polygon points="0,-16 16,0 0,16 -16,0" fill="url(#asym-amber-grad)" />
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            </g>
          </g>

          {/* LAYER 3: SEAM ACCENT & DISPERSE PARTICLES */}
          {disperseProgress > 0 && (
            <g opacity={1 - disperseProgress}>
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const dist = disperseProgress * 180;
                return (
                  <circle
                    key={i}
                    cx={240 + Math.cos(angle) * dist}
                    cy={100 + Math.sin(angle) * dist}
                    r={Math.max(1, 6 * (1 - disperseProgress))}
                    fill={i % 2 === 0 ? accentColor : accentGradientEnd}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '48px',
              left: '310px',
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
                letterSpacing: '3px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 14px rgba(0,0,0,0.85)',
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
              top: '116px',
              left: '310px',
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
                color: '#FBBF24',
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
