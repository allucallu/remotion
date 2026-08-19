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

export interface LowerThirdCorporateProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdCorporate Composition (Varian 13: Executive Corporate & High-Finance Wave)
 * Niche: Corporate, Finance, Business Summit, Executive Keynote, High-End Presentation.
 * Features:
 * - Executive Shield Badge on left (180px x 180px) with 3D metallic platinum crest icon.
 * - Sleek Glass Banner on right (1400px x 115px) with Bezier Wave Underline Accent.
 * - Deep Midnight Navy (#1E3A8A) & Luminous Cyan (#06B6D4) gradients.
 * - Luminous Slate Glass fills (#202538 -> #101322) for 100% sharp contrast on black.
 * - 100% Blank SVG Graphic canvas ready for custom text overlay in Premiere/DaVinci.
 * - Entrance: Executive Smooth Wave Slide & Gold Hairline Unfurl.
 * - Exit: Smooth Wave Shrink & Fade Out.
 */
export const LowerThirdCorporate: React.FC<LowerThirdCorporateProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#06B6D4', // Luminous Cyan
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
  // Frame 0-45: Executive Smooth Ease Entrance
  // Frame 45-145: Hold Phase + Subtle Wave Pulse & Sheen Sweep
  // Frame 145-175: Smooth Wave Shrink & Fade Out Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Luxury High-Damped Ease Physics) ---
  // Layer 1: Left Executive Badge Drops DOWN (Frame 2 - 26)
  const badgeSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 18, mass: 1.0, stiffness: 95 }, // Luxury smooth ease
  });

  // Layer 2: Main Title Glass Banner Wave Unfurl (Frame 12 - 38)
  const bannerWipeProgress = interpolate(frame, [12, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Layer 3: Subtitle Pill Pop (Frame 20 - 44)
  const subPillSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 110 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Smooth Shrink & Fade Out) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const bannerRetractProgress = interpolate(exitProgress, [0, 0.6], [1, 0]);
  const badgeExitScaleY = interpolate(exitProgress, [0.4, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const wavePulseOpacity = frame >= 45 && frame < 145 ? 0.7 + Math.sin(idleTime * 3.0) * 0.2 : 0.85;

  // Metallic Sheen Pass
  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const badgeTranslateY = interpolate(badgeSpring, [0, 1], [-180, 0]);
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
      {/* EXECUTIVE CORPORATE CONTAINER (Positioned in 4K Safe Margin) */}
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
        {/* AMBIENT MIDNIGHT NAVY & CYAN GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '20px',
            width: '1200px',
            height: '240px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: badgeSpring * exitOpacity,
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
            {/* Navy to Luminous Cyan Executive Gradient */}
            <linearGradient id="corp-navy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="corp-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#202538" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#151928" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#101322" stopOpacity="0.98" />
            </linearGradient>

            {/* Badge Core Glass Gradient */}
            <linearGradient id="corp-glass-badge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A2D54" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#0F1B36" stopOpacity="0.98" />
            </linearGradient>

            {/* Metallic Sheen Gradient */}
            <linearGradient id="corp-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Executive Drop Shadow */}
            <filter id="corp-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity={wavePulseOpacity} />
            </filter>

            {/* Clip Path for Main Banner Sheen */}
            <clipPath id="corp-banner-clip">
              <path d="M 180 0 L 1420 0 C 1410 60 1370 115 1360 115 L 165 115 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: RIGHT SLEEK GLASS BANNER (Flush left edge with Badge seam at 180,0 -> 165,115) */}
          <g
            transform={`scale(${finalBannerScaleX}, 1)`}
            style={{ transformOrigin: '175px 57px' }}
            opacity={bannerWipeProgress}
            filter="url(#corp-shadow)"
          >
            {/* Sleek Glass Banner Body */}
            <path
              d="M 180 0 L 1420 0 C 1410 60 1370 115 1360 115 L 165 115 Z"
              fill="url(#corp-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Top Metallic White Highlight Line */}
            <line x1="180" y1="1" x2="1410" y2="1" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

            {/* Bezier Wave Underline Accent */}
            <path
              d="M 165 115 Q 750 128 1360 115"
              fill="none"
              stroke="url(#corp-navy-grad)"
              strokeWidth="3.5"
              filter="url(#cyan-glow)"
            />

            {/* Light Sheen Pass */}
            <g clipPath="url(#corp-banner-clip)">
              <rect
                x={sheenX}
                y="0"
                width="340"
                height="115"
                fill="url(#corp-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Right Side Accent Ticks */}
            <g transform="translate(1330, 20)" opacity="0.7">
              <line x1="0" y1="0" x2="16" y2="16" stroke="#06B6D4" strokeWidth="2.5" />
              <line x1="0" y1="20" x2="16" y2="36" stroke="#06B6D4" strokeWidth="2.5" />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE GLASS BANNER (Flush left edge at 178,124 -> 170,180) */}
          <g
            transform={`scale(${finalSubPillScaleX}, 1)`}
            style={{ transformOrigin: '175px 152px' }}
            opacity={subPillSpring}
            filter="url(#corp-shadow)"
          >
            {/* Subtitle Body with Bottom Edge Flushed Exactly to Y = 180px */}
            <path
              d="M 179 124 L 1060 124 L 1042 180 L 170 180 Z"
              fill="url(#corp-glass-front)"
              stroke="#06B6D4"
              strokeWidth="1.8"
            />
            {/* Left Slanted Neon Anchor Bar (179,124 -> 170,180) */}
            <line x1="179" y1="124" x2="170" y2="180" stroke="url(#corp-navy-grad)" strokeWidth="3.5" />

            {/* Abstract Status Dot & Level Ticks (Pure Graphic, Zero Text) */}
            <g transform="translate(195, 140)">
              <circle cx="8" cy="12" r="5" fill="#06B6D4" filter="url(#cyan-glow)" />
              <circle cx="28" cy="12" r="3" fill="#3B82F6" opacity="0.9" />
              <circle cx="42" cy="12" r="3" fill="#3B82F6" opacity="0.6" />
              <line x1="60" y1="12" x2="120" y2="12" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            </g>
          </g>

          {/* LAYER 3: LEFT EXECUTIVE BADGE (180px Wide x 180px Tall) */}
          <g
            transform={`translate(0, ${badgeTranslateY}) scale(1, ${badgeExitScaleY})`}
            style={{ transformOrigin: '90px 90px' }}
            opacity={badgeSpring}
            filter="url(#corp-shadow)"
          >
            {/* Outer Chamfered Executive Badge */}
            <polygon
              points="0,0 180,0 165,115 170,180 24,180 0,150"
              fill="url(#corp-glass-badge)"
              stroke="url(#corp-navy-grad)"
              strokeWidth="3.5"
              filter="url(#cyan-glow)"
            />

            {/* Left Accent Anchor Corner Stripe */}
            <polygon points="0,0 20,0 10,180 0,180" fill="url(#corp-navy-grad)" />

            {/* Slanted Right Seam Accent Hairline */}
            <line x1="180" y1="0" x2="170" y2="180" stroke="#3B82F6" strokeWidth="3" filter="url(#cyan-glow)" />

            {/* 3D Metallic Platinum Crest Icon */}
            <g transform="translate(90, 90)" filter="url(#cyan-glow)">
              <polygon points="0,-22 22,0 0,22 -22,0" fill="url(#corp-navy-grad)" />
              <polygon points="0,-12 12,0 0,12 -12,0" fill="#FFFFFF" opacity="0.9" />
              <circle cx="0" cy="0" r="4" fill="#06B6D4" />
            </g>

            {/* Badge Metric Scale Ticks */}
            {[0, 1, 2, 3].map((idx) => {
              const tickY = 36 + idx * 32;
              return (
                <line
                  key={idx}
                  x1="152"
                  y1={tickY}
                  x2="164"
                  y2={tickY}
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                />
              );
            })}
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '220px',
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
                color: '#06B6D4',
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
