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

export interface LowerThirdGamingProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdGaming Composition (Varian 12: Perfect Bottom Seam Realignment)
 * Fixed: Subtitle banner bottom edge aligned to Y = 180px to match the bottom edge of the left shield badge
 * to the exact pixel, completely eliminating the 6px hanging lip protrusion at the bottom.
 */
export const LowerThirdGaming: React.FC<LowerThirdGamingProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#10B981', // Cyber Emerald Neon Green
  accentGradientEnd = '#EC4899', // Electric Hot Pink
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
  // Frame 0-45: Snappy Gaming Bounce & Laser Wipe Entrance
  // Frame 45-145: Hold Phase + Core Pulse & Matrix Micro-Motion
  // Frame 145-175: High-Speed Retract & Cyber Particle Disperse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Esports Snappy Bounce Physics) ---
  const shieldSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 160 },
  });

  const bannerWipeProgress = interpolate(frame, [12, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subPillSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Retract & Cyber Disperse Burst) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const bannerRetractProgress = interpolate(exitProgress, [0, 0.5], [1, 0]);
  const disperseProgress = interpolate(frame, [155, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const corePulseOpacity = frame >= 45 && frame < 145 ? 0.75 + Math.sin(idleTime * 4.5) * 0.25 : 0.85;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 85, [0, 85], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const shieldTranslateY = interpolate(shieldSpring, [0, 1], [-180, 0]);
  const finalBannerScaleX = bannerWipeProgress * bannerRetractProgress;
  const finalSubPillScaleX = subPillSpring * bannerRetractProgress;

  const titleTextOpacity = interpolate(bannerWipeProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(subPillSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* ESPORTS CYBER GAMING CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '260px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT NEON MINT & PINK GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '20px',
            width: '1200px',
            height: '240px',
            background: `radial-gradient(ellipse at center, ${accentColor}45 0%, ${accentGradientEnd}25 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: shieldSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1680"
          height="260"
          viewBox="0 0 1680 260"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Emerald Mint to Hot Pink Neon Gradient */}
            <linearGradient id="gaming-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="gaming-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#282C3D" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#1B1D2C" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#10121F" stopOpacity="0.98" />
            </linearGradient>

            {/* Shield Core Dark Glass Gradient */}
            <linearGradient id="gaming-glass-shield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C382F" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#0D1E19" stopOpacity="0.98" />
            </linearGradient>

            {/* Metallic Sheen Gradient */}
            <linearGradient id="gaming-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#A7F3D0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="gaming-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity={corePulseOpacity} />
            </filter>

            {/* Clip Path for Main Banner Sheen */}
            <clipPath id="gaming-banner-clip">
              <path d="M 185 0 L 1400 0 L 1330 115 L 165 115 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: RIGHT 45° CHAMFERED GLASS BANNER */}
          <g
            transform={`scale(${finalBannerScaleX}, 1)`}
            style={{ transformOrigin: '180px 60px' }}
            opacity={bannerWipeProgress}
            filter="url(#gaming-shadow)"
          >
            {/* Chamfered Main Banner Body */}
            <path
              d="M 185 0 L 1400 0 L 1330 115 L 165 115 Z"
              fill="url(#gaming-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Top Metallic White Edge Line */}
            <line x1="185" y1="1" x2="1390" y2="1" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

            {/* Bottom Metallic Neon Underline Accent */}
            <line
              x1="165"
              y1="115"
              x2="1330"
              y2="115"
              stroke="url(#gaming-neon-grad)"
              strokeWidth="3.5"
              filter="url(#neon-glow)"
            />

            {/* 5x3 Tech Matrix Dot Grid in Top-Right Corner */}
            <g transform="translate(1260, 20)" opacity="0.7">
              {[0, 1, 2, 3, 4].map((col) =>
                [0, 1, 2].map((row) => (
                  <circle
                    key={`${col}-${row}`}
                    cx={col * 12}
                    cy={row * 12}
                    r="2.5"
                    fill={row === 1 ? '#EC4899' : '#10B981'}
                  />
                ))
              )}
            </g>

            {/* Light Sheen Pass */}
            <g clipPath="url(#gaming-banner-clip)">
              <rect
                x={sheenX}
                y="0"
                width="340"
                height="115"
                fill="url(#gaming-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Right Chamfer Notch Lines */}
            <g transform="translate(1310, 24)" opacity="0.8">
              <line x1="0" y1="0" x2="14" y2="14" stroke="#EC4899" strokeWidth="2.5" />
              <line x1="0" y1="20" x2="14" y2="34" stroke="#EC4899" strokeWidth="2.5" />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE GLASS BANNER (Bottom Edge Flushed 100% to Y = 180px) */}
          <g
            transform={`scale(${finalSubPillScaleX}, 1)`}
            style={{ transformOrigin: '175px 152px' }}
            opacity={subPillSpring}
            filter="url(#gaming-shadow)"
          >
            {/* Subtitle Body with Bottom Edge Flushed Exactly to Y = 180px */}
            <path
              d="M 179 124 L 1050 124 L 1038 180 L 170 180 Z"
              fill="url(#gaming-glass-front)"
              stroke="#10B981"
              strokeWidth="1.8"
            />
            {/* Left Slanted Neon Anchor Bar (179,124 -> 170,180) */}
            <line x1="179" y1="124" x2="170" y2="180" stroke="url(#gaming-neon-grad)" strokeWidth="3.5" />

            {/* Abstract Gaming Status Dot & Level Ticks */}
            <g transform="translate(195, 140)">
              <circle cx="8" cy="12" r="5" fill="#10B981" filter="url(#neon-glow)" />
              <circle cx="28" cy="12" r="3" fill="#EC4899" opacity="0.9" />
              <circle cx="42" cy="12" r="3" fill="#EC4899" opacity="0.6" />
              <line x1="60" y1="12" x2="120" y2="12" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            </g>
          </g>

          {/* LAYER 3: LEFT ESPORTS CYBER SHIELD BADGE (200px Wide x 180px Tall) */}
          <g
            transform={`translate(0, ${shieldTranslateY})`}
            opacity={shieldSpring}
            filter="url(#gaming-shadow)"
          >
            {/* Outer Chamfered Cyber Shield */}
            <polygon
              points="0,0 200,0 170,180 30,180"
              fill="url(#gaming-glass-shield)"
              stroke="url(#gaming-neon-grad)"
              strokeWidth="3.5"
              filter="url(#neon-glow)"
            />

            {/* Left Accent Anchor Corner Stripe */}
            <polygon points="0,0 24,0 12,180 0,180" fill="url(#gaming-neon-grad)" />

            {/* Slanted Right Seam Accent Hairline */}
            <line x1="200" y1="0" x2="170" y2="180" stroke="#EC4899" strokeWidth="3" filter="url(#neon-glow)" />

            {/* 8-bit Crosshair Core Emblem */}
            <g transform="translate(100, 90)" filter="url(#neon-glow)">
              <polygon points="0,-22 22,0 0,22 -22,0" fill="none" stroke="#EC4899" strokeWidth="2" />
              <polygon points="0,-14 14,0 0,14 -14,0" fill="url(#gaming-neon-grad)" />
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
            </g>

            {/* Shield Metric Scale Ticks */}
            {[0, 1, 2, 3].map((idx) => {
              const tickY = 36 + idx * 32;
              return (
                <line
                  key={idx}
                  x1="172"
                  y1={tickY}
                  x2="184"
                  y2={tickY}
                  stroke="#EC4899"
                  strokeWidth="2.5"
                />
              );
            })}
          </g>

          {/* LAYER 4: DISPERSE PARTICLES ON EXIT */}
          {disperseProgress > 0 && (
            <g opacity={1 - disperseProgress}>
              {[...Array(14)].map((_, i) => {
                const angle = (i / 14) * Math.PI * 2;
                const dist = disperseProgress * 200;
                return (
                  <circle
                    key={i}
                    cx={100 + Math.cos(angle) * dist}
                    cy={90 + Math.sin(angle) * dist}
                    r={Math.max(1, 6 * (1 - disperseProgress))}
                    fill={i % 2 === 0 ? accentColor : accentGradientEnd}
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '220px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '54px',
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
              top: '144px',
              left: '320px',
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
                color: '#10B981',
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
