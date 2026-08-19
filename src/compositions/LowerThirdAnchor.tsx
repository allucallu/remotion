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

export interface LowerThirdAnchorProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdAnchor Composition (Varian 8: Swiss Editorial Vertical Anchor - 100% Blank Stock Graphic)
 * Purged all hardcoded text tags from SVG graphic layers so video editors have a 100% clean,
 * empty canvas to overlay their own custom text in Premiere/DaVinci/After Effects.
 */
export const LowerThirdAnchor: React.FC<LowerThirdAnchorProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#EAB308', // Electric Yellow
  accentGradientEnd = '#FACC15', // Bright Lime Yellow
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
  // Frame 0-45: Elastic Snap Anchor Drop & Hairline Shoot Entrance
  // Frame 45-145: Hold Phase + Pillar Pulse & Laser Sheen Sweep
  // Frame 145-175: High-Speed Pull-Out & Pillar Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Elastic Anchor Drop Physics) ---
  const pillarSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 160 },
  });

  const hairlineProgress = interpolate(frame, [12, 36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const tagSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  // --- EXIT PHYSICS (Frame 145 - 175, High-Speed Pull-Out) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const hairlineExitProgress = interpolate(exitProgress, [0, 1], [1, 0]);
  const pillarExitScaleY = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 85, [0, 85], [0, 1400], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const anchorPulseOpacity = frame >= 45 && frame < 145 ? 0.65 + Math.sin(idleTime * 4.0) * 0.3 : 0.85;

  // --- TRANSFORM CALCULATIONS ---
  const pillarTranslateY = interpolate(pillarSpring, [0, 1], [-160, 0]);
  const finalHairlineScaleX = hairlineProgress * hairlineExitProgress;

  const titleTextOpacity = interpolate(hairlineProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(tagSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* SWISS EDITORIAL ANCHOR CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1600px',
          height: '280px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT YELLOW ANCHOR GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '0px',
            width: '450px',
            height: '220px',
            background: `radial-gradient(ellipse at center, ${accentColor}45 0%, transparent 75%)`,
            filter: 'blur(55px)',
            opacity: pillarSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1600"
          height="280"
          viewBox="0 0 1600 280"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Electric Yellow Gradient */}
            <linearGradient id="anchor-yellow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Distinct Luminous Slate-Charcoal Glass Gradient */}
            <linearGradient id="anchor-glass-sub" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D2F3E" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#202230" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#151722" stopOpacity="0.98" />
            </linearGradient>

            <filter id="yellow-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentColor} floodOpacity={anchorPulseOpacity} />
            </filter>

            <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER 1: HEAVY VERTICAL PILLAR ANCHOR WITH CHAMFER STEPS */}
          <g
            transform={`translate(0, ${pillarTranslateY}) scale(1, ${pillarExitScaleY})`}
            style={{ transformOrigin: '0px 90px' }}
            opacity={pillarSpring}
            filter="url(#yellow-glow)"
          >
            {/* Primary Chamfered Pillar Shape */}
            <polygon
              points="0,0 36,0 28,180 0,180"
              fill="url(#anchor-yellow-grad)"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />

            {/* Inner White Core Accent Hairline */}
            <line x1="12" y1="16" x2="8" y2="164" stroke="#FFFFFF" strokeWidth="3" opacity="0.95" />

            {/* Vertical Scale Calibration Ticks */}
            {[0, 1, 2, 3, 4].map((idx) => {
              const tickY = 24 + idx * 32;
              return (
                <line
                  key={idx}
                  x1="-8"
                  y1={tickY}
                  x2="-2"
                  y2={tickY}
                  stroke={accentColor}
                  strokeWidth="2.5"
                />
              );
            })}
          </g>

          {/* LAYER 2: DUAL FLOATING HAIRLINE TRACKS & DISTINCT SLATE GLASS PANEL */}
          <g opacity={pillarSpring}>
            {/* Top Main Title Hairline Track */}
            <line
              x1="32"
              y1="90"
              x2="1420"
              y2="90"
              stroke="url(#anchor-yellow-grad)"
              strokeWidth="4"
              strokeDasharray="1388"
              strokeDashoffset={1388 * (1 - finalHairlineScaleX)}
              strokeLinecap="round"
              filter="url(#yellow-glow)"
            />

            {/* Metric Timeline Scale Ticks along Main Hairline */}
            <g transform="translate(48, 80)" opacity={finalHairlineScaleX}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <line
                  key={i}
                  x1={i * 120}
                  y1="0"
                  x2={i * 120}
                  y2="6"
                  stroke="#FACC15"
                  strokeWidth="2"
                />
              ))}
            </g>

            {/* Subtitle Slate Glass Panel (100% BLANK CANVAS) */}
            <g
              transform={`translate(36, 126) scale(${finalHairlineScaleX}, 1)`}
              style={{ transformOrigin: '0px 0px' }}
              opacity={tagSpring}
              filter="url(#card-shadow)"
            >
              <rect
                x="0"
                y="0"
                width="1020"
                height="54"
                rx="12"
                ry="12"
                fill="url(#anchor-glass-sub)"
                stroke="rgba(255, 255, 255, 0.22)"
                strokeWidth="1.8"
              />
              {/* Luminous Top Metallic Highlight */}
              <line x1="12" y1="1" x2="1008" y2="1" stroke="#EAB308" strokeWidth="2" />
            </g>

            {/* Bottom Subtitle Hairline Track */}
            <line
              x1="32"
              y1="180"
              x2="1060"
              y2="180"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="1028"
              strokeDashoffset={1028 * (1 - finalHairlineScaleX)}
              strokeLinecap="round"
            />

            {/* Dotted Guideline Accent */}
            <line
              x1="32"
              y1="190"
              x2="880"
              y2="190"
              stroke={accentColor}
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeDashoffset={848 * (1 - finalHairlineScaleX)}
              opacity="0.85"
            />

            {/* Laser Sheen Pass along Hairline */}
            {frame >= 45 && frame < 145 && (
              <circle
                cx={32 + sheenX}
                cy="90"
                r="5"
                fill="#FFFFFF"
                filter="url(#yellow-glow)"
              />
            )}
          </g>

          {/* LAYER 3: ANCHOR TELEMETRY HEADER BADGE (100% BLANK GRAPHIC) */}
          <g
            transform={`translate(48, 12) scale(${tagSpring})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={tagSpring}
          >
            <rect x="0" y="0" width="120" height="26" rx="4" ry="4" fill="#282A3A" stroke="#EAB308" strokeWidth="1.5" />
            <rect x="0" y="0" width="6" height="26" rx="3" ry="3" fill="url(#anchor-yellow-grad)" />
            <circle cx="20" cy="13" r="4" fill="#FACC15" filter="url(#yellow-glow)" />
            <circle cx="34" cy="13" r="2.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="46" cy="13" r="2.5" fill="#FFFFFF" opacity="0.5" />
          </g>

          {/* Pillar Base Crosshair Tick */}
          <g transform="translate(0, 180)" opacity={pillarSpring}>
            <circle cx="14" cy="0" r="5" fill="#FFFFFF" stroke={accentColor} strokeWidth="2" filter="url(#yellow-glow)" />
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '30px',
              left: '48px',
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
              top: '136px',
              left: '52px',
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
                color: '#FACC15',
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
