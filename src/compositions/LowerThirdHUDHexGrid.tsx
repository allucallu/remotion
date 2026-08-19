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

export interface LowerThirdHUDHexGridProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 16: LowerThirdHUDHexGrid (Tidy Layout & Collision-Free Clearance)
 * Fixed: Shifted framing brackets & hairlines start position to X = 220px, providing a clean 55px
 * clearance gap between the rotating hex target scope (X = 100px) and the framing brackets to completely
 * eliminate overlapping node collisions and visual clutter.
 */
export const LowerThirdHUDHexGrid: React.FC<LowerThirdHUDHexGridProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#FF3366', // Hot Neon Crimson
  accentGradientEnd = '#00E5FF', // Electric Cyan
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
  // TIMELINE ANIMASI (210 Frame @ 30fps = 7.0 Detik)
  // Frame 0-30: Entrance Phase (In 1.0s)
  // Frame 30-180: Hold Phase (Hold 5.0s = 150f)
  // Frame 180-210: Exit Phase (Out 1.0s = 30f)
  // ==========================================

  // --- ENTRANCE SPRINGS & TRANSFORMS ---
  const hexTargetSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const hexTargetRotation = interpolate(hexTargetSpring, [0, 1], [0, 360]);

  // Dual Parallel Hairlines Draw Progress (Frame 10 - 24)
  const hairlineDrawProgress = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Corner Chamfer Brackets Snap Progress (Frame 16 - 28)
  const bracketSnapSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 160 },
  });

  const bracketAngle = interpolate(bracketSnapSpring, [0, 1], [45, 0]);

  // --- HOLD PHASE COUNTER-ROTATION & LASER SWEEP (Frame 30 - 180) ---
  const idleTime = Math.max(0, frame - 30) / 30;

  // Outer Hex Ring slowly rotates clockwise (0° -> 90°)
  const idleOuterRotate = idleTime * 18;
  // Inner Reticle Circle slowly rotates counter-clockwise (0° -> -120°)
  const idleInnerRotate = -idleTime * 24;

  // Center Core Pulsing LED
  const corePulseOpacity = frame >= 30 && frame < 180
    ? 0.75 + Math.sin(idleTime * 4.0) * 0.25
    : 0.85;

  // Looping Laser Sweep Dot along Calibration Hairline (X = 220 -> 1480)
  const laserSweepX = frame >= 30 && frame < 180
    ? interpolate((frame - 30) % 75, [0, 75], [220, 1480], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.linear,
      })
    : 220;

  // --- EXIT PHASE (Frame 180 - 210) ---
  const exitProgress = interpolate(frame, [180, 208], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const hairlineExitProgress = interpolate(exitProgress, [0, 0.6], [1, 0]);

  const exitSpin = interpolate(exitProgress, [0.3, 1], [0, 180]);
  const exitScale = interpolate(exitProgress, [0.4, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.7, 1], [1, 0]);

  // Combined Transforms
  const finalHairlineScaleX = hairlineDrawProgress * hairlineExitProgress;
  const titleTextOpacity = interpolate(hairlineDrawProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(bracketSnapSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* SCI-FI HUD HEX GRID CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1520px',
          height: '200px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT HOT CRIMSON & CYAN BLOOM GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '1540px',
            height: '220px',
            background: `radial-gradient(ellipse at center, ${accentColor}35 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: hexTargetSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1520"
          height="200"
          viewBox="0 0 1520 200"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Neon Crimson to Electric Cyan Gradient */}
            <linearGradient id="hex-hud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Bloom Glow Filter */}
            <filter id="hex-hud-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor={accentColor} floodOpacity={corePulseOpacity} />
            </filter>

            <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={accentGradientEnd} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER 1: DUAL PARALLEL CALIBRATION HAIRLINES & SCALE TICKS (Shifted to X = 220px) */}
          <g opacity={hexTargetSpring}>
            {/* Top Parallel Hairline Track (y = 20px, x = 220 -> 1480) */}
            <line
              x1="220"
              y1="20"
              x2="1480"
              y2="20"
              stroke="url(#hex-hud-grad)"
              strokeWidth="3"
              strokeDasharray="1260"
              strokeDashoffset={1260 * (1 - finalHairlineScaleX)}
              strokeLinecap="round"
              filter="url(#hex-hud-glow)"
            />

            {/* Metric Millimeter Scale Ticks along Top Hairline */}
            <g transform="translate(220, 10)" opacity={finalHairlineScaleX * 0.75}>
              {[...Array(23)].map((_, i) => (
                <line
                  key={i}
                  x1={i * 56}
                  y1="0"
                  x2={i * 56}
                  y2={i % 5 === 0 ? "10" : "5"}
                  stroke={i % 5 === 0 ? "#FF3366" : "#00E5FF"}
                  strokeWidth="1.8"
                />
              ))}
            </g>

            {/* Bottom Parallel Hairline Track (y = 180px, x = 220 -> 1480) */}
            <line
              x1="220"
              y1="180"
              x2="1480"
              y2="180"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeDasharray="1260"
              strokeDashoffset={1260 * (1 - finalHairlineScaleX)}
              strokeLinecap="round"
              filter="url(#cyan-glow)"
            />

            {/* Subtitle Baseline Guide Line (y = 124px) */}
            <line
              x1="250"
              y1="124"
              x2="1220"
              y2="124"
              stroke="rgba(255, 51, 102, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeDashoffset={970 * (1 - finalHairlineScaleX)}
            />

            {/* Looping Laser Sweep Dot along Top Hairline */}
            {frame >= 30 && frame < 180 && (
              <circle
                cx={laserSweepX}
                cy="20"
                r="4.5"
                fill="#FFFFFF"
                filter="url(#hex-hud-glow)"
              />
            )}
          </g>

          {/* LAYER 2: 4 CORNER CHAMFER SCOPE BRACKETS (Framing Empty Text Area at X = 220px to 1480px) */}
          <g opacity={bracketSnapSpring}>
            {/* Top-Right Chamfer Scope Bracket (1480, 20) */}
            <g
              transform={`translate(1480, 20) rotate(${bracketAngle})`}
              filter="url(#hex-hud-glow)"
            >
              <path d="M -48 0 L 0 0 L 0 48" fill="none" stroke="#FF3366" strokeWidth="3.5" />
              <path d="M -48 10 L -10 10 L -10 48" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <line x1="-16" y1="0" x2="-16" y2="10" stroke="#FF3366" strokeWidth="2" />
            </g>

            {/* Bottom-Right Chamfer Scope Bracket (1480, 180) */}
            <g
              transform={`translate(1480, 180) rotate(${-bracketAngle})`}
              filter="url(#hex-hud-glow)"
            >
              <path d="M -48 0 L 0 0 L 0 -48" fill="none" stroke="#FF3366" strokeWidth="3.5" />
              <path d="M -48 -10 L -10 -10 L -10 -48" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <line x1="-16" y1="0" x2="-16" y2="-10" stroke="#FF3366" strokeWidth="2" />
            </g>

            {/* Top-Left Chamfer Scope Bracket (220, 20) */}
            <g
              transform={`translate(220, 20) rotate(${-bracketAngle})`}
              filter="url(#hex-hud-glow)"
            >
              <path d="M 48 0 L 0 0 L 0 48" fill="none" stroke="#FF3366" strokeWidth="3.5" />
              <path d="M 48 10 L 10 10 L 10 48" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
            </g>

            {/* Bottom-Left Chamfer Scope Bracket (220, 180) */}
            <g
              transform={`translate(220, 180) rotate(${bracketAngle})`}
              filter="url(#hex-hud-glow)"
            >
              <path d="M 48 0 L 0 0 L 0 -48" fill="none" stroke="#FF3366" strokeWidth="3.5" />
              <path d="M 48 -10 L 10 -10 L 10 -48" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
            </g>
          </g>

          {/* LAYER 3: LEFT ROTATING TACTICAL HEX SCOPE TARGET (Positioned at X = 100px, Y = 100px) */}
          <g
            transform={`translate(100, 100) scale(${hexTargetSpring * exitScale})`}
            opacity={hexTargetSpring}
            filter="url(#hex-hud-glow)"
          >
            {/* Outer Hexagonal Scope Ring (Rotates Clockwise) */}
            <g transform={`rotate(${hexTargetRotation + idleOuterRotate + exitSpin})`}>
              <polygon
                points="0,-65 56.3,-32.5 56.3,32.5 0,65 -56.3,32.5 -56.3,-32.5"
                fill="none"
                stroke="url(#hex-hud-grad)"
                strokeWidth="3.5"
              />
              {/* 6 Corner Nodes */}
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={Math.sin(rad) * 65}
                    cy={-Math.cos(rad) * 65}
                    r="4"
                    fill="#FF3366"
                  />
                );
              })}
            </g>

            {/* Inner Circular Reticle Ring (Counter-Rotates) */}
            <g transform={`rotate(${-hexTargetRotation + idleInnerRotate})`}>
              <circle cx="0" cy="0" r="40" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="12 7" />
              {/* 4 Crosshair Reticle Ticks */}
              <line x1="-48" y1="0" x2="-32" y2="0" stroke="#00E5FF" strokeWidth="2.5" />
              <line x1="32" y1="0" x2="48" y2="0" stroke="#00E5FF" strokeWidth="2.5" />
              <line x1="0" y1="-48" x2="0" y2="-32" stroke="#00E5FF" strokeWidth="2.5" />
              <line x1="0" y1="32" x2="0" y2="48" stroke="#00E5FF" strokeWidth="2.5" />
            </g>

            {/* Center Live Target Core Dot */}
            <circle cx="0" cy="0" r="7" fill="#FF3366" filter="url(#hex-hud-glow)" opacity={corePulseOpacity} />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '250px',
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
              top: '136px',
              left: '260px',
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
                color: '#00E5FF',
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
