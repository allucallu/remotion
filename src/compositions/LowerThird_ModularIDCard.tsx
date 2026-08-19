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

export interface LowerThirdModularIDCardProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 1: LowerThird_ModularIDCard (Enhanced Supporting Elements)
 * Features:
 * - 2 Separate Card Blocks with ±8px Gap (100% Blank Canvas).
 * - Left Card (120px x 120px, 4K): Executive Security Holographic Chip Badge with 4 corner notches & center diamond node.
 * - Right Card (1200px x 120px, 4K): Extended Slate Glass Panel with top-right telemetry ticks, chamfered corner notches, & golden divider hairline.
 * - Dark Slate Base Panel (#1F232B -> #12151C) with luminous gold accents (#D4A857).
 * - Entrance (0.8s / 24f): Left card scale-up with 105% overshoot spring, right card slide-in from BEHIND left card 0.15s later.
 * - Hold (4.2s / 126f): Divider line 3.0s looping laser shimmer sweep & subtle golden node pulse.
 * - Exit (1.0s / 30f): Cards move apart horizontally while scaling down & fading out with motion blur.
 * - Total Duration: 6.0 seconds (180 frames @ 30fps).
 */
export const LowerThird_ModularIDCard: React.FC<LowerThirdModularIDCardProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#D4A857', // Golden Amber Accent
  accentGradientEnd = '#F59E0B', // Bright Amber Gold
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
  // Frame 0-24: Entrance Phase (In 0.8s)
  // Frame 24-150: Hold Phase (Hold 4.2s = 126f) + 3.0s Looping Shimmer Sweep
  // Frame 150-180: Exit Phase (Out 1.0s = 30f)
  // ==========================================

  // --- ENTRANCE SPRINGS ---
  const leftCardSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 150 }, // Overshoot physics
  });

  const rightCardSpring = spring({
    frame: Math.max(0, frame - 7),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  // --- EXIT PHYSICS (Frame 150 - 180) ---
  const exitProgress = interpolate(frame, [150, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const exitLeftCardOffsetX = interpolate(exitProgress, [0, 1], [0, -60]);
  const exitRightCardOffsetX = interpolate(exitProgress, [0, 1], [0, 60]);

  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.85]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const exitBlur = interpolate(exitProgress, [0, 0.5, 1], [0, 8, 0]);

  // --- IDLE SHIMMER MOTION (Frame 24 - 150) ---
  const shimmerTime = Math.max(0, frame - 24);
  const shimmerX = frame >= 24 && frame < 150
    ? interpolate(shimmerTime % 90, [0, 75], [0, 1200], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const nodePulseOpacity = frame >= 24 && frame < 150 ? 0.7 + Math.sin(shimmerTime * 0.1) * 0.3 : 0.85;

  // --- TRANSFORM CALCULATIONS ---
  const rightCardSlideX = interpolate(rightCardSpring, [0, 1], [0, 128]);

  const titleTextOpacity = interpolate(rightCardSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(rightCardSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* MODULAR ID CARD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1400px',
          height: '180px',
          opacity: exitOpacity,
          transform: `scale(${exitScale})`,
          filter: `blur(${exitBlur}px)`,
        }}
      >
        {/* AMBIENT GOLDEN ANCHOR GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '450px',
            height: '180px',
            background: `radial-gradient(ellipse at center, ${accentColor}45 0%, transparent 75%)`,
            filter: 'blur(50px)',
            opacity: leftCardSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1400"
          height="180"
          viewBox="0 0 1400 180"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Dark Slate Base Panel Gradient (#1F232B to #12151C) */}
            <linearGradient id="modular-dark-slate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F232B" />
              <stop offset="50%" stopColor="#171A21" />
              <stop offset="100%" stopColor="#12151C" />
            </linearGradient>

            {/* Golden Amber Accent Gradient */}
            <linearGradient id="modular-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Divider Hairline Shimmer Gradient */}
            <linearGradient id="modular-shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFBEB" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Premium Editorial Drop Shadow */}
            <filter id="modular-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentColor} floodOpacity={nodePulseOpacity} />
            </filter>

            {/* Clip Path for Right Card Divider Shimmer Sweep */}
            <clipPath id="modular-divider-clip">
              <rect x="0" y="58" width="1200" height="4" />
            </clipPath>
          </defs>

          {/* LAYER 1: RIGHT EXTENDED NAME & TITLE CARD (Slides in from BEHIND Left Card) */}
          <g
            transform={`translate(${rightCardSlideX + exitRightCardOffsetX}, 0)`}
            opacity={rightCardSpring}
            filter="url(#modular-shadow)"
          >
            {/* Right Card Body (1200px x 120px, 4K) */}
            <rect
              x="0"
              y="0"
              width="1200"
              height="120"
              rx="14"
              ry="14"
              fill="url(#modular-dark-slate)"
              stroke={accentColor}
              strokeWidth="1.2"
            />

            {/* Inner Divider Hairline Line separating Name (top) and Subtitle (bottom) */}
            <line
              x1="24"
              y1="60"
              x2="1176"
              y2="60"
              stroke={accentColor}
              strokeWidth="1.2"
              opacity="0.85"
            />

            {/* Looping 3.0s Shimmer Highlight Pass along Divider Line */}
            {frame >= 24 && frame < 150 && (
              <g clipPath="url(#modular-divider-clip)">
                <rect
                  x={shimmerX}
                  y="58"
                  width="200"
                  height="4"
                  fill="url(#modular-shimmer-grad)"
                />
              </g>
            )}

            {/* Top Metallic White Highlight Line */}
            <line x1="16" y1="1" x2="1184" y2="1" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.45" />

            {/* Top-Right Telemetry Ticks / Metric Scale Marks */}
            <g transform="translate(1080, 18)" opacity="0.65">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <line
                  key={idx}
                  x1={idx * 14}
                  y1="0"
                  x2={idx * 14}
                  y2="10"
                  stroke="#D4A857"
                  strokeWidth="2"
                />
              ))}
            </g>

            {/* Right Side Chamfered Notch Details */}
            <g transform="translate(1170, 24)" opacity="0.75">
              <path d="M 0 0 L 12 0 L 12 12" fill="none" stroke="#D4A857" strokeWidth="2" />
              <path d="M 12 60 L 12 72 L 0 72" fill="none" stroke="#D4A857" strokeWidth="2" />
            </g>
          </g>

          {/* LAYER 2: LEFT SMALL SQUARE CARD (Appears First, Scale-up 105% Overshoot) */}
          <g
            transform={`translate(${0 + exitLeftCardOffsetX}, 0)`}
            filter="url(#modular-shadow)"
          >
            <g
              transform={`scale(${leftCardSpring})`}
              style={{ transformOrigin: '60px 60px' }}
              opacity={leftCardSpring}
            >
              {/* Left Small Square Card (120px x 120px, 4K) */}
              <rect
                x="0"
                y="0"
                width="120"
                height="120"
                rx="14"
                ry="14"
                fill="url(#modular-dark-slate)"
                stroke={accentColor}
                strokeWidth="1.5"
                filter="url(#gold-glow)"
              />

              {/* Inner Golden Accent Frame Hairline */}
              <rect
                x="8"
                y="8"
                width="104"
                height="104"
                rx="10"
                ry="10"
                fill="none"
                stroke="rgba(212, 168, 87, 0.45)"
                strokeWidth="1"
              />

              {/* 4 Golden Corner Notches */}
              <g stroke="#D4A857" strokeWidth="2" opacity="0.85">
                <path d="M 14 20 L 14 14 L 20 14" fill="none" />
                <path d="M 100 20 L 100 14 L 94 14" fill="none" />
                <path d="M 14 100 L 14 106 L 20 106" fill="none" />
                <path d="M 100 100 L 100 106 L 94 106" fill="none" />
              </g>

              {/* Center Executive Security Diamond Micro-Node (Pure Graphic Emblem) */}
              <g transform="translate(60, 60)" filter="url(#gold-glow)">
                <polygon points="0,-18 18,0 0,18 -18,0" fill="none" stroke="#D4A857" strokeWidth="1.8" />
                <polygon points="0,-10 10,0 0,10 -10,0" fill="url(#modular-gold-grad)" opacity="0.9" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
              </g>

              {/* Live Status LED Dot */}
              <circle cx="18" cy="18" r="3" fill="#D4A857" filter="url(#gold-glow)" />

              {/* Top Metallic Edge Line */}
              <line x1="14" y1="1" x2="106" y2="1" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.65" />
            </g>
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '156px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '36px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
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
              top: '72px',
              left: '156px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#D4A857',
                letterSpacing: '1.5px',
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
