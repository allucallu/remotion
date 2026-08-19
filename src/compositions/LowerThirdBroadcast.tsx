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

export interface LowerThirdBroadcastProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Broadcast-Quality Multi-Layered Stock Lower Third Component
 * Integrated flush corner design (Opsi 2: Bracket locked & fitted flush to panel edge).
 */
export const LowerThirdBroadcast: React.FC<LowerThirdBroadcastProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#06B6D4',
  accentGradientEnd = '#3B82F6',
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
  // Frame 0-45: Staggered Multi-Layer Entrance
  // Frame 45-145: Hold Phase + Light-Sweep Sheen & Pulse Micro-Motion
  // Frame 145-175: Directional Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Staggered Layered Choreography) ---
  const glassPanelSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
  });

  const accentBlockSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 10, mass: 0.7, stiffness: 110 },
  });

  const subPanelSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 95 },
  });

  const lineDrawProgress = interpolate(frame, [22, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const bracketSpring = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  // --- EXIT COLLAPSE PHYSICS (Frame 145 - 175) ---
  const bracketExit = interpolate(frame, [145, 155], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const subPanelExitProgress = interpolate(frame, [150, 162], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const accentExitProgress = interpolate(frame, [156, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const glassExitProgress = interpolate(frame, [162, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // --- HOLD PHASE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const lightSweepX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 90, [0, 90], [-400, 1900], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  const dotPulseOpacity = frame >= 45 && frame < 145 ? 0.4 + Math.sin(idleTime * 4.5) * 0.4 : 0.8;
  const accentLineScaleX = frame >= 45 && frame < 145 ? 1.0 + Math.sin(idleTime * 2.0) * 0.015 : 1.0;

  // --- TRANSFORM CALCULATIONS ---
  const glassScaleXEntrance = glassPanelSpring;
  const glassScaleXExit = interpolate(glassExitProgress, [0, 1], [1, 0]);
  const glassTranslateXExit = interpolate(glassExitProgress, [0, 1], [0, 120]);
  const glassOpacityExit = interpolate(glassExitProgress, [0, 1], [1, 0]);
  const finalGlassScaleX = glassScaleXEntrance * glassScaleXExit;
  const finalGlassOpacity = glassOpacityExit;

  const accentTranslateXEntrance = interpolate(accentBlockSpring, [0, 1], [-200, 0]);
  const accentOpacityEntrance = interpolate(accentBlockSpring, [0, 1], [0, 1]);
  const accentScaleYExit = interpolate(accentExitProgress, [0, 1], [1, 0]);
  const accentOpacityExit = interpolate(accentExitProgress, [0, 1], [1, 0]);
  const finalAccentOpacity = accentOpacityEntrance * accentOpacityExit;

  const subTranslateYEntrance = interpolate(subPanelSpring, [0, 1], [-25, 0]);
  const subScaleYEntrance = subPanelSpring;
  const subTranslateYExit = interpolate(subPanelExitProgress, [0, 1], [0, 50]);
  const subOpacityExit = interpolate(subPanelExitProgress, [0, 1], [1, 0]);
  const finalSubOpacity = interpolate(subPanelSpring, [0, 1], [0, 1]) * subOpacityExit;

  const finalBracketScale = bracketSpring * bracketExit;

  const titleTextOpacity = interpolate(accentBlockSpring, [0, 1], [0, 1]) * glassOpacityExit;
  const titleTextTranslateX = interpolate(accentBlockSpring, [0, 1], [-40, 0]);
  const subTextOpacity = interpolate(subPanelSpring, [0, 1], [0, 1]) * subOpacityExit;

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
      {/* BROADCAST LOWER THIRD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '300px',
        }}
      >
        <svg
          width="1680"
          height="300"
          viewBox="0 0 1680 300"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Accent Linear Gradient */}
            <linearGradient id="broadcast-accent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Glass Panel Gradient */}
            <linearGradient id="glass-panel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C1C24" stopOpacity="0.94" />
              <stop offset="100%" stopColor="#0D0D12" stopOpacity="0.96" />
            </linearGradient>

            {/* Subtitle Glass Gradient */}
            <linearGradient id="sub-panel-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14141B" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#0A0A0F" stopOpacity="0.75" />
            </linearGradient>

            {/* Light Sweep Sheen Linear Gradient */}
            <linearGradient id="sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Drop Shadow for Layered Depth */}
            <filter id="layer-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000000" floodOpacity="0.75" />
            </filter>

            <filter id="glow-accent" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor={accentColor} floodOpacity="0.6" />
            </filter>

            {/* Clip Path for Light Sweep across Main Panel */}
            <clipPath id="main-panel-clip">
              <polygon points="0,0 1480,0 1410,140 0,140" />
            </clipPath>
          </defs>

          {/* LAYER 1: BACK MAIN FROSTED GLASS PANEL */}
          <g
            transform={`translate(${glassTranslateXExit}, 0) scale(${finalGlassScaleX}, 1)`}
            style={{ transformOrigin: '0px 70px' }}
            opacity={finalGlassOpacity}
            filter="url(#layer-shadow)"
          >
            {/* Main Panel Outer Border & Fill */}
            <polygon
              points="0,0 1480,0 1410,140 0,140"
              fill="url(#glass-panel-grad)"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="2"
            />

            {/* Metallic Top Edge Line */}
            <line x1="0" y1="1" x2="1480" y2="1" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />

            {/* Light Sweep Sheen Pass */}
            <g clipPath="url(#main-panel-clip)">
              <rect
                x={lightSweepX}
                y="0"
                width="320"
                height="140"
                fill="url(#sheen-grad)"
                transform="skewX(-20)"
              />
            </g>
          </g>

          {/* LAYER 2: FOREGROUND ACCENT BLOCK */}
          <g
            transform={`translate(${accentTranslateXEntrance}, 0) scale(1, ${accentScaleYExit})`}
            style={{ transformOrigin: '0px 140px' }}
            opacity={finalAccentOpacity}
            filter="url(#glow-accent)"
          >
            <polygon
              points="0,0 340,0 290,140 0,140"
              fill="url(#broadcast-accent-grad)"
            />
            <line x1="325" y1="0" x2="275" y2="140" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          </g>

          {/* LAYER 3: SUBTITLE GLASS CONTAINER */}
          <g
            transform={`translate(0, ${150 + subTranslateYEntrance + subTranslateYExit}) scale(1, ${subScaleYEntrance})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={finalSubOpacity}
            filter="url(#layer-shadow)"
          >
            <polygon
              points="0,0 1050,0 1000,75 0,75"
              fill="url(#sub-panel-grad)"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="8" height="75" fill="url(#broadcast-accent-grad)" />
          </g>

          {/* LAYER 4: LINE DRAW ACCENTS */}
          <g opacity={finalGlassOpacity} transform={`scale(${accentLineScaleX}, 1)`} style={{ transformOrigin: '0px 0px' }}>
            <line
              x1="360"
              y1="140"
              x2="1410"
              y2="140"
              stroke="url(#broadcast-accent-grad)"
              strokeWidth="4"
              strokeDasharray="1050"
              strokeDashoffset={1050 * (1 - lineDrawProgress)}
              strokeLinecap="round"
            />
            <line
              x1="360"
              y1="148"
              x2="1330"
              y2="148"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeDashoffset={1050 * (1 - lineDrawProgress)}
            />
          </g>

          {/* LAYER 5: INTEGRATED CORNER BRACKET (Opsi 2: Flush Fitted to Panel Edge) */}
          <g
            transform={`scale(${finalBracketScale})`}
            style={{ transformOrigin: '1480px 0px' }}
            opacity={finalGlassOpacity}
          >
            {/* Flush Corner Highlight Line along Top & Slanted Edge */}
            <path
              d="M 1445 0 L 1480 0 L 1465 30"
              fill="none"
              stroke={accentColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-accent)"
            />
          </g>

          {/* Live Pulsing Dot */}
          <g
            transform={`translate(32, 188) scale(${finalBracketScale})`}
            style={{ transformOrigin: 'center center' }}
            opacity={finalSubOpacity}
          >
            <circle cx="0" cy="0" r="7" fill={accentColor} opacity={dotPulseOpacity} />
            <circle cx="0" cy="0" r="12" fill="none" stroke={accentColor} strokeWidth="1.5" opacity={dotPulseOpacity * 0.6} />
          </g>

          {/* Grid Crosshair Tech Mark (Integrated Inside Bottom-Right Corner) */}
          <g transform="translate(1380, 110)" opacity={finalGlassOpacity * 0.4}>
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '360px',
              opacity: titleTextOpacity,
              transform: `translateX(${titleTextTranslateX}px) translateY(${glassTranslateXExit * 0.2}px)`,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '54px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 12px rgba(0,0,0,0.6)',
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
              top: '172px',
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
                fontSize: '30px',
                fontWeight: 600,
                color: '#D4D4D8',
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
