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

export interface LowerThirdBoldProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdBold Composition (Varian 3: Bold Cyber-Sport & Energetic Creator Style)
 * Refined top badge tag: Symmetrical chamfered trapezoid with micro neon guideline & indicator dot.
 */
export const LowerThirdBold: React.FC<LowerThirdBoldProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#8B5CF6', // Neon Violet
  accentGradientEnd = '#EC4899', // Hot Electric Pink
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
  // Frame 0-45: Snappy Energetic Spring Entrance
  // Frame 45-145: Hold Phase + Neon Sheen Sweep & Tech Grid Matrix Pulse
  // Frame 145-175: Diagonal Wipe Out Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Snappy Energetic Bounce Physics) ---
  const backFrameSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 140 },
  });

  const mainCardSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 150 },
  });

  const badgeTabSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 160 },
  });

  const subContainerSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 130 },
  });

  const matrixDotsProgress = interpolate(frame, [26, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.175, 0.885, 0.32, 1.275),
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Diagonal Wipe Out) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 75, [0, 75], [-400, 1800], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  const matrixPulseOpacity = frame >= 45 && frame < 145 ? 0.5 + Math.sin(idleTime * 5.0) * 0.4 : 0.8;

  // --- FINAL TRANSFORMS ---
  const backFrameTranslateX = interpolate(backFrameSpring, [0, 1], [-120, 0]);
  const mainCardTranslateX = interpolate(mainCardSpring, [0, 1], [-160, 0]);
  const badgeScaleY = badgeTabSpring;

  const exitTranslateX = interpolate(exitProgress, [0, 1], [0, 200]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const titleTextOpacity = interpolate(mainCardSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(subContainerSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* BOLD CYBER LOWER THIRD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '320px',
          transform: `translateX(${exitTranslateX}px)`,
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT NEON BACK GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '80px',
            width: '1250px',
            height: '180px',
            background: `radial-gradient(ellipse at center, ${accentGradientEnd}35 0%, ${accentColor}20 50%, transparent 75%)`,
            filter: 'blur(55px)',
            opacity: backFrameSpring * exitOpacity,
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
            {/* Cyber Electric Gradient */}
            <linearGradient id="bold-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Main Glass Card Dark Gradient */}
            <linearGradient id="bold-card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E162B" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#140E1E" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0B0712" stopOpacity="0.98" />
            </linearGradient>

            {/* Subtitle Glass Container Gradient */}
            <linearGradient id="bold-sub-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#251A38" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#120A1D" stopOpacity="0.82" />
            </linearGradient>

            {/* High-Contrast Neon Sheen Gradient */}
            <linearGradient id="neon-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="bold-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="20" stdDeviation="26" floodColor="#000000" floodOpacity="0.8" />
            </filter>

            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentGradientEnd} floodOpacity="0.75" />
            </filter>

            {/* Clip Path for Main Card Sheen */}
            <clipPath id="bold-card-clip">
              <rect x="0" y="32" width="1450" height="136" rx="16" ry="16" />
            </clipPath>
          </defs>

          {/* LAYER 0: OFFSET BACKING FRAME */}
          <g
            transform={`translate(${backFrameTranslateX + 16}, 48) scale(${backFrameSpring}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={backFrameSpring}
            filter="url(#neon-glow)"
          >
            <rect
              x="0"
              y="0"
              width="1450"
              height="136"
              rx="18"
              ry="18"
              fill="none"
              stroke="url(#bold-neon-grad)"
              strokeWidth="3.5"
            />
          </g>

          {/* LAYER 1: MAIN NEON GLASS CARD */}
          <g
            transform={`translate(${mainCardTranslateX}, 32) scale(${mainCardSpring}, 1)`}
            style={{ transformOrigin: '0px 68px' }}
            opacity={mainCardSpring}
            filter="url(#bold-shadow)"
          >
            {/* Main Card Shape */}
            <rect
              x="0"
              y="0"
              width="1450"
              height="136"
              rx="16"
              ry="16"
              fill="url(#bold-card-grad)"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="2"
            />

            {/* Left Accent Neon Bar */}
            <rect x="0" y="0" width="12" height="136" rx="6" ry="6" fill="url(#bold-neon-grad)" />

            {/* Neon Edge Highlight Line */}
            <line x1="16" y1="1" x2="1434" y2="1" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />

            {/* High-Speed Sheen Pass */}
            <g clipPath="url(#bold-card-clip)">
              <rect
                x={sheenX}
                y="32"
                width="300"
                height="136"
                fill="url(#neon-sheen-grad)"
                transform="skewX(-25)"
              />
            </g>
          </g>

          {/* LAYER 2: REFINED SYMMETRICAL BADGE TAB (Top Symmetrical Chamfer Tag) */}
          <g
            transform={`translate(28, 0) scale(1, ${badgeScaleY})`}
            style={{ transformOrigin: '0px 32px' }}
            opacity={badgeTabSpring}
            filter="url(#neon-glow)"
          >
            {/* Symmetrical Chamfer Badge Shape */}
            <path
              d="M 12 0 L 250 0 L 230 32 L 0 32 Z"
              fill="url(#bold-neon-grad)"
            />
            {/* Indicator Dot & Dotted Line Detail */}
            <circle cx="22" cy="16" r="4.5" fill="#FFFFFF" />
            <line x1="40" y1="16" x2="205" y2="16" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" strokeDasharray="5 4" />
          </g>

          {/* LAYER 3: SUBTITLE GLASS CONTAINER */}
          <g
            transform={`translate(0, ${184}) scale(1, ${subContainerSpring})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={subContainerSpring}
            filter="url(#bold-shadow)"
          >
            <path
              d="M 0 0 L 1020 0 L 980 68 L 0 68 Z"
              fill="url(#bold-sub-grad)"
              stroke="rgba(236, 72, 153, 0.3)"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="8" height="68" fill="url(#bold-neon-grad)" />
          </g>

          {/* LAYER 4: 5x3 TECH MATRIX DOT GRID */}
          <g
            transform="translate(36, 68)"
            opacity={matrixDotsProgress * matrixPulseOpacity}
          >
            {[0, 1, 2, 3, 4].map((col) =>
              [0, 1, 2].map((row) => (
                <circle
                  key={`${col}-${row}`}
                  cx={col * 14}
                  cy={row * 14}
                  r="2.5"
                  fill={col === 0 ? accentGradientEnd : accentColor}
                />
              ))
            )}
          </g>

          {/* Live Beacon Status Dot */}
          <g
            transform="translate(32, 218)"
            opacity={subContainerSpring * matrixPulseOpacity}
          >
            <circle cx="0" cy="0" r="6" fill={accentGradientEnd} filter="url(#neon-glow)" />
            <circle cx="0" cy="0" r="11" fill="none" stroke={accentGradientEnd} strokeWidth="1.5" />
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '74px',
              left: '135px',
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
                textShadow: '0 4px 14px rgba(0,0,0,0.8)',
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
              top: '204px',
              left: '56px',
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
                color: '#F472B6',
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
