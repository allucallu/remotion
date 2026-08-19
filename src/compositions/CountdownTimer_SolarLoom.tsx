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
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerSolarLoomProps {
  accentColor?: string; // Solar Amber Gold #F59E0B
  accentSecondary?: string; // Terracotta Copper #C87D55
  accentCream?: string; // Luminous Champagne Cream #FEF3C7
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_SolarLoom (Non-Generic Interlaced Kineto-Filament Solar Weave & Eclipse Countdown)
 * Niche: High-End Motion Graphics, Art Exhibition, Luxury Tech Reveal, Cinematic Teaser.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Solar Filament Unravel & Eclipse Collapse Exit (150 - 165f)
 * - NON-GENERIC DESIGN: 16 Interlaced Kineto-Filament Strands weaving radially.
 * - Warm Solar Amber Gold (#F59E0B), Terracotta Copper (#C87D55), & Champagne Cream (#FEF3C7) Palette.
 * - 8 Inward Spiral Solar Glare Nodes winding during charging (0% to 100%).
 * - Instantaneous Solar Eclipse Iris Silhouette Snap on number transitions.
 * - Solar Filament Unravel exit to solid blackout.
 */
export const CountdownTimer_SolarLoom: React.FC<CountdownTimerSolarLoomProps> = ({
  accentColor = '#F59E0B', // Solar Amber Gold
  accentSecondary = '#C87D55', // Terracotta Copper
  accentCream = '#FEF3C7', // Luminous Champagne Cream
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE CALCULATIONS (165 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // Charging Phase: 0 -> 26f (~0.87s) | Eclipse Snap: 26f -> 30f (~0.13s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const chargeDuration = 26; // 0 to 26 frames

  // Radial Filament Weave Progress (0 to 1)
  const chargeProgress = interpolate(
    localFrame,
    [0, chargeDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.33, 0, 0.2, 1),
    }
  );

  // Solar Eclipse Iris Snap Trigger (localFrame 25 to 29)
  const isEclipsing = localFrame >= 25 && frame < 150;
  const eclipseProgress = isEclipsing
    ? interpolate(localFrame, [25, 29], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Iris Mask Radius: Contracts to 0 on eclipse, expands out on new number
  const eclipseIrisRadius = isEclipsing
    ? interpolate(eclipseProgress, [0, 0.5, 1], [540, 0, 540])
    : 540;

  const numberSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.4, stiffness: 210 },
  });
  const numberPopScale = currentStepIndex > 0 && !isEclipsing
    ? interpolate(numberSpring, [0, 1], [0.72, 1])
    : 1;

  const numberRotate = currentStepIndex > 0 && localFrame < 12
    ? interpolate(numberSpring, [0, 1], [-15, 0])
    : 0;

  // --- FILAMENT & SPIRAL MATH (Center 1920, 1080) ---
  const cx = 1920;
  const cy = 1080;

  // 16 Interlaced Kineto-Filament Strands
  const baseRadius = 560;
  const strandCount = 16;
  const filaments = Array.from({ length: strandCount }).map((_, i) => {
    const angleOffset = (i / strandCount) * Math.PI * 2;
    // Winding rotation based on chargeProgress
    const rotationRad = angleOffset + chargeProgress * Math.PI * 1.5;

    // Interlaced spiral offset (+-45px)
    const spiralR = baseRadius + Math.sin(chargeProgress * Math.PI * 2 + i * 0.8) * 45;

    const x1 = cx + (spiralR - 35) * Math.cos(rotationRad);
    const y1 = cy + (spiralR - 35) * Math.sin(rotationRad);
    const x2 = cx + (spiralR + 35) * Math.cos(rotationRad + 0.4);
    const y2 = cy + (spiralR + 35) * Math.sin(rotationRad + 0.4);

    return { x1, y1, x2, y2, key: i };
  });

  // 8 Inward Spiral Solar Glare Nodes
  const spiralNodes = Array.from({ length: 8 }).map((_, i) => {
    const nodeAngle = (i / 8) * Math.PI * 2 + frame * 0.05;
    // Radial distance spiraling inwards during charge (720px -> 540px)
    const nodeR = 720 - chargeProgress * 180 + Math.sin(frame * 0.15 + i) * 15;

    const nx = cx + nodeR * Math.cos(nodeAngle);
    const ny = cy + nodeR * Math.sin(nodeAngle);

    return { nx, ny, key: i };
  });

  // --- EXIT PHASE: SOLAR FILAMENT UNRAVEL & ECLIPSE COLLAPSE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const unravelProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const unravelScale = isEndPhase ? 1 + unravelProgress * 2.2 : 1;
  const unravelOpacity = isEndPhase ? interpolate(unravelProgress, [0.65, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : unravelOpacity,
      }}
    >
      {/* 1. SOLAR CORONA AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1650px',
          height: '1650px',
          background: `radial-gradient(circle at center, ${accentColor}35 0%, ${accentSecondary}20 50%, transparent 70%)`,
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN SVG INTERLACED FILAMENT WEAVE & SPIRAL CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${unravelScale})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            {/* Solar Amber Gold to Terracotta Gradient */}
            <linearGradient id="solar-loom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentCream} />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentSecondary} />
            </linearGradient>

            {/* Solar Corona Glow Filter */}
            <filter id="solar-loom-bloom" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="28" floodColor={accentSecondary} floodOpacity="0.75" />
            </filter>

            {/* SOLAR ECLIPSE IRIS CLIP MASK */}
            <clipPath id="solar-iris-clip">
              <circle cx={cx} cy={cy} r={eclipseIrisRadius} />
            </clipPath>
          </defs>

          {/* BASE WEAVE TRACK CIRCLING CORE */}
          <circle
            cx={cx}
            cy={cy}
            r={baseRadius}
            fill="none"
            stroke={accentSecondary}
            strokeWidth="3"
            strokeDasharray="12 18"
            opacity="0.4"
          />

          {/* 16 INTERLACED KINETO-FILAMENT STRANDS */}
          {filaments.map((f) => (
            <path
              key={f.key}
              d={`M ${f.x1} ${f.y1} Q ${cx} ${cy} ${f.x2} ${f.y2}`}
              fill="none"
              stroke="url(#solar-loom-grad)"
              strokeWidth={3.5 + (f.key % 3) * 1.5}
              strokeLinecap="round"
              opacity={0.6 + Math.sin(frame * 0.2 + f.key) * 0.3}
              filter="url(#solar-loom-bloom)"
            />
          ))}

          {/* 8 INWARD SPIRAL SOLAR GLARE NODES */}
          {spiralNodes.map((node) => (
            <g key={node.key}>
              <circle
                cx={node.nx}
                cy={node.ny}
                r="10"
                fill={accentCream}
                filter="url(#solar-loom-bloom)"
              />
              <circle
                cx={node.nx}
                cy={node.ny}
                r="22"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                opacity="0.65"
              />
            </g>
          ))}
        </svg>

        {/* 3. CENTER HERO NUMBER WITH SOLAR ECLIPSE IRIS CLIP */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${numberPopScale}) rotate(${numberRotate}deg)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: accentCream,
              fontFamily: interFont,
              fontSize: '740px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-12px',
              textShadow: `0 0 35px ${accentColor}, 0 0 70px ${accentSecondary}`,
              clipPath: isEclipsing ? 'url(#solar-iris-clip)' : 'none',
            }}
          >
            {currentNumber}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
