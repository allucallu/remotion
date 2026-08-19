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

export interface LowerThirdMonolithProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdMonolith Composition (Varian 10: Architectural Monolith - 100% Blank Stock Graphic)
 * Purged all hardcoded text tags from SVG graphic layers so video editors have a 100% clean,
 * empty canvas to overlay their own custom text in Premiere/DaVinci/After Effects.
 */
export const LowerThirdMonolith: React.FC<LowerThirdMonolithProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#A855F7', // Electric Ultra-Violet Purple
  accentGradientEnd = '#06B6D4', // Cyber Turquoise Cyan
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
  // Frame 0-45: Monolith Drop & Right Banner Horizontal Slide Entrance
  // Frame 45-145: Hold Phase + Pulse & Metallic Sheen Sweep (100% Flat to Camera)
  // Frame 145-175: Banner Retract & Vertical Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Flat Architectural Slide Physics) ---
  const monolithSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const mainBannerProgress = interpolate(frame, [12, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subBannerSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Banner Retract & Vertical Collapse) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const bannerRetractProgress = interpolate(exitProgress, [0, 0.6], [1, 0]);
  const monolithExitScaleY = interpolate(exitProgress, [0.5, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const pulseOpacity = frame >= 45 && frame < 145 ? 0.7 + Math.sin(idleTime * 3.5) * 0.25 : 0.85;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const monolithTranslateY = interpolate(monolithSpring, [0, 1], [-180, 0]);
  const finalMainBannerScaleX = mainBannerProgress * bannerRetractProgress;
  const finalSubBannerScaleX = subBannerSpring * bannerRetractProgress;

  const titleTextOpacity = interpolate(mainBannerProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(subBannerSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* ARCHITECTURAL MONOLITH CONTAINER (Positioned Flat in 4K Safe Margin) */}
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
        {/* AMBIENT PURPLE BACK GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '40px',
            width: '1200px',
            height: '240px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: monolithSpring * exitOpacity,
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
            {/* Electric Purple to Cyber Cyan Gradient */}
            <linearGradient id="monolith-purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="monolith-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#282A3D" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#1B1D2C" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#10121E" stopOpacity="0.98" />
            </linearGradient>

            {/* Monolith Badge Glass Gradient */}
            <linearGradient id="monolith-glass-tower" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#322648" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#161024" stopOpacity="0.98" />
            </linearGradient>

            {/* Metallic Sheen Sweep Gradient */}
            <linearGradient id="monolith-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#F472B6" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="monolith-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="purple-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity={pulseOpacity} />
            </filter>

            {/* Clip Path for Main Title Banner Sheen */}
            <clipPath id="monolith-banner-clip">
              <path d="M 0 0 L 1380 0 L 1330 115 L 0 115 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: MAIN TITLE GLASS BANNER (100% BLANK CANVAS) */}
          <g
            transform={`translate(180, 0) scale(${finalMainBannerScaleX}, 1)`}
            style={{ transformOrigin: '0px 57px' }}
            opacity={mainBannerProgress}
            filter="url(#monolith-shadow)"
          >
            {/* Flat Main Banner Glass Body */}
            <path
              d="M 0 0 L 1380 0 L 1330 115 L 0 115 Z"
              fill="url(#monolith-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Top Metallic Edge Line */}
            <line x1="10" y1="1" x2="1370" y2="1" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

            {/* Bottom Metallic Accent Underline */}
            <line
              x1="0"
              y1="115"
              x2="1330"
              y2="115"
              stroke="url(#monolith-purple-grad)"
              strokeWidth="3.5"
              filter="url(#purple-glow)"
            />

            {/* Light Sheen Pass */}
            <g clipPath="url(#monolith-banner-clip)">
              <rect
                x={sheenX}
                y="0"
                width="340"
                height="115"
                fill="url(#monolith-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Right Edge Tech Notches */}
            <g transform="translate(1310, 16)" opacity="0.7">
              <line x1="0" y1="0" x2="14" y2="14" stroke="#06B6D4" strokeWidth="2.5" />
              <line x1="0" y1="18" x2="14" y2="32" stroke="#06B6D4" strokeWidth="2.5" />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE GLASS BANNER (100% BLANK CANVAS - ZERO HARDCODED TEXT) */}
          <g
            transform={`translate(180, 132) scale(${finalSubBannerScaleX}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={subBannerSpring}
            filter="url(#monolith-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="1020"
              height="56"
              rx="16"
              ry="16"
              fill="url(#monolith-glass-front)"
              stroke="#A855F7"
              strokeWidth="1.8"
            />
            <rect x="0" y="0" width="8" height="56" rx="4" ry="4" fill="url(#monolith-purple-grad)" />

            {/* Abstract Luminous Status Dot (Pure Graphic, Zero Text) */}
            <g transform="translate(22, 16)">
              <circle cx="8" cy="12" r="5" fill="#A855F7" filter="url(#purple-glow)" />
              <circle cx="28" cy="12" r="3" fill="#06B6D4" opacity="0.8" />
              <circle cx="42" cy="12" r="3" fill="#06B6D4" opacity="0.5" />
            </g>
          </g>

          {/* LAYER 3: LEFT ARCHITECTURAL MONOLITH BADGE TOWER (180px x 180px) */}
          <g
            transform={`translate(0, ${monolithTranslateY}) scale(1, ${monolithExitScaleY})`}
            style={{ transformOrigin: '90px 90px' }}
            opacity={monolithSpring}
            filter="url(#monolith-shadow)"
          >
            {/* Flat Chamfered Monolith Badge */}
            <path
              d="M 24 0 L 180 0 L 180 180 L 0 180 L 0 24 Z"
              fill="url(#monolith-glass-tower)"
              stroke="url(#monolith-purple-grad)"
              strokeWidth="3"
              filter="url(#purple-glow)"
            />

            {/* Left Accent Anchor Corner Stripe */}
            <path d="M 24 0 L 0 24 L 0 180 L 10 180 L 10 20 L 28 0 Z" fill="url(#monolith-purple-grad)" />

            {/* 3D Embossed Center Logo Diamond Icon */}
            <g transform="translate(90, 90)" filter="url(#purple-glow)">
              <polygon points="0,-20 20,0 0,20 -20,0" fill="url(#monolith-purple-grad)" />
              <polygon points="0,-10 10,0 0,10 -10,0" fill="#FFFFFF" opacity="0.9" />
              <circle cx="0" cy="0" r="3.5" fill="#A855F7" />
            </g>

            {/* Monolith Scale Ticks */}
            {[0, 1, 2, 3].map((idx) => {
              const tickY = 36 + idx * 32;
              return (
                <line
                  key={idx}
                  x1="156"
                  y1={tickY}
                  x2="168"
                  y2={tickY}
                  stroke="#06B6D4"
                  strokeWidth="2"
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
              top: '146px',
              left: '260px',
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
                color: '#C084FC',
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
