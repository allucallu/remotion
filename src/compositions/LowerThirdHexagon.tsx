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

export interface LowerThirdHexagonProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdHexagon Composition (Varian 11: Tactical Cyber Hexagon - 100% Blank Stock Graphic)
 * Purged all hardcoded text tags from SVG graphic layers so video editors have a 100% clean,
 * empty canvas to overlay their own custom text in Premiere/DaVinci/After Effects.
 */
export const LowerThirdHexagon: React.FC<LowerThirdHexagonProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#F97316', // Sunset Neon Orange
  accentGradientEnd = '#84CC16', // Tactical Lime Green
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
  // Frame 0-45: Hexagon Spin & Laser Wipe Entrance
  // Frame 45-145: Hold Phase + Core Pulse & Laser Sheen Sweep
  // Frame 145-175: Laser Shrink & Hexagon Spin Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Tactical Hexagon Physics) ---
  const hexSpinSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const ribbonWipeProgress = interpolate(frame, [14, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const subPillSpring = spring({
    frame: Math.max(0, frame - 22),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Laser Shrink & Hexagon Spin Collapse) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const ribbonRetractProgress = interpolate(exitProgress, [0, 0.6], [1, 0]);
  const hexExitSpin = interpolate(exitProgress, [0.4, 1], [0, 180]);
  const hexExitScale = interpolate(exitProgress, [0.4, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const corePulseOpacity = frame >= 45 && frame < 145 ? 0.7 + Math.sin(idleTime * 4.0) * 0.25 : 0.85;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1700], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  // --- TRANSFORM CALCULATIONS ---
  const hexRotate = interpolate(hexSpinSpring, [0, 1], [-180, 0]) + hexExitSpin;
  const hexScale = hexSpinSpring * hexExitScale;

  const finalRibbonScaleX = ribbonWipeProgress * ribbonRetractProgress;
  const finalSubPillScaleX = subPillSpring * ribbonRetractProgress;

  const titleTextOpacity = interpolate(ribbonWipeProgress, [0, 1], [0, 1]) * exitOpacity;
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
      {/* TACTICAL CYBER HEXAGON CONTAINER (Positioned in 4K Safe Margin) */}
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
        {/* AMBIENT ORANGE-LIME GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '30px',
            width: '1200px',
            height: '240px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: hexSpinSpring * exitOpacity,
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
            {/* Sunset Orange to Tactical Lime Gradient */}
            <linearGradient id="hex-orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* High-Contrast Luminous Slate Glass Gradient */}
            <linearGradient id="hex-glass-front" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2A2834" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#1C1A26" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#12101B" stopOpacity="0.98" />
            </linearGradient>

            {/* Hexagon Core Glass Gradient */}
            <linearGradient id="hex-glass-core" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#36221A" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#1B100B" stopOpacity="0.98" />
            </linearGradient>

            {/* Metallic Sheen Gradient */}
            <linearGradient id="hex-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="hex-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="16" stdDeviation="22" floodColor="#000000" floodOpacity="0.82" />
            </filter>

            <filter id="orange-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity={corePulseOpacity} />
            </filter>

            {/* Clip Path for Main Angled Ribbon Sheen */}
            <clipPath id="hex-ribbon-clip">
              <path d="M 0 0 L 1400 0 L 1330 115 L 0 115 Z" />
            </clipPath>
          </defs>

          {/* LAYER 1: RIGHT ANGLE-CUT TRAPEZOID GLASS RIBBON (100% BLANK TEXT CANVAS) */}
          <g
            transform={`translate(160, 0) scale(${finalRibbonScaleX}, 1)`}
            style={{ transformOrigin: '0px 57px' }}
            opacity={ribbonWipeProgress}
            filter="url(#hex-shadow)"
          >
            {/* Angled Glass Ribbon Body */}
            <path
              d="M 0 0 L 1400 0 L 1330 115 L 0 115 Z"
              fill="url(#hex-glass-front)"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
            />

            {/* Top Metallic Highlight Line */}
            <line x1="10" y1="1" x2="1390" y2="1" stroke="#FFFFFF" strokeWidth="2" opacity="0.9" />

            {/* Bottom Metallic Underline Accent */}
            <line
              x1="0"
              y1="115"
              x2="1330"
              y2="115"
              stroke="url(#hex-orange-grad)"
              strokeWidth="3.5"
              filter="url(#orange-glow)"
            />

            {/* Light Sheen Pass */}
            <g clipPath="url(#hex-ribbon-clip)">
              <rect
                x={sheenX}
                y="0"
                width="340"
                height="115"
                fill="url(#hex-sheen-grad)"
                transform="skewX(-20)"
              />
            </g>

            {/* Right Edge Tech Chamfer Notches */}
            <g transform="translate(1310, 16)" opacity="0.7">
              <line x1="0" y1="0" x2="14" y2="14" stroke="#84CC16" strokeWidth="2.5" />
              <line x1="0" y1="18" x2="14" y2="32" stroke="#84CC16" strokeWidth="2.5" />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE GLASS BANNER (100% BLANK CANVAS - NO HARDCODED TEXT) */}
          <g
            transform={`translate(160, 132) scale(${finalSubPillScaleX}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={subPillSpring}
            filter="url(#hex-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="1040"
              height="56"
              rx="16"
              ry="16"
              fill="url(#hex-glass-front)"
              stroke="#F97316"
              strokeWidth="1.8"
            />
            <rect x="0" y="0" width="8" height="56" rx="4" ry="4" fill="url(#hex-orange-grad)" />

            {/* Abstract Luminous Status Dot (Pure Graphic, Zero Text) */}
            <g transform="translate(22, 16)">
              <circle cx="8" cy="12" r="5" fill="#F97316" filter="url(#orange-glow)" />
              <circle cx="28" cy="12" r="3" fill="#84CC16" opacity="0.8" />
              <circle cx="42" cy="12" r="3" fill="#84CC16" opacity="0.5" />
            </g>
          </g>

          {/* LAYER 3: LEFT TACTICAL CYBER HEXAGON BADGE TOWER (180px x 180px) */}
          <g
            transform={`translate(90, 90) scale(${hexScale}) rotate(${hexRotate})`}
            style={{ transformOrigin: 'center center' }}
            filter="url(#hex-shadow)"
          >
            <g transform="translate(-90, -90)">
              {/* Outer Hexagon Shield Shape */}
              <polygon
                points="45,0 135,0 180,90 135,180 45,180 0,90"
                fill="url(#hex-glass-core)"
                stroke="url(#hex-orange-grad)"
                strokeWidth="3.5"
                filter="url(#orange-glow)"
              />

              {/* Inner White Accent Hexagon Outline */}
              <polygon
                points="50,10 130,10 170,90 130,170 50,170 10,90"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* 6 Corner Telemetry Nodes */}
              {[
                { x: 45, y: 0 },
                { x: 135, y: 0 },
                { x: 180, y: 90 },
                { x: 135, y: 180 },
                { x: 45, y: 180 },
                { x: 0, y: 90 },
              ].map((pt, i) => (
                <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#84CC16" />
              ))}

              {/* Center Core Emblem */}
              <g transform="translate(90, 90)" filter="url(#orange-glow)">
                <polygon points="0,-20 17,10 -17,10" fill="url(#hex-orange-grad)" />
                <polygon points="0,20 17,-10 -17,-10" fill="url(#hex-orange-grad)" opacity="0.6" />
                <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
              </g>
            </g>
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE (Only active if props.title / props.subtitle passed) */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '200px',
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
              left: '240px',
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
                color: '#84CC16',
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
