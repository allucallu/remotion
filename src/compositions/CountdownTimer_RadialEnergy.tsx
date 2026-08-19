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

export interface CountdownTimerRadialEnergyProps {
  accentColor?: string; // Crimson Red #DC2626
  accentOrange?: string; // Solar Orange #F97316
  accentYellow?: string; // Golden Amber #FBBF24
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_RadialEnergy (High-Energy Radial Charging Ring & Solar Plasma Explosion Countdown)
 * Niche: High Energy Sports Promo, Gaming Tournament, Sci-Fi Power Core, Dynamic Tech Event Launch.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Supernova Climax Energy Explosion & Blackout (150 - 165f)
 * - Fiery Solar Color Palette (#DC2626 -> #F97316 -> #FBBF24).
 * - SVG `strokeDasharray` & `strokeDashoffset` Radial Arc Progress Ring (0% to 100% charging).
 * - 14 Orbital Plasma Motes with exponential velocity acceleration near 100% charge.
 * - Trigonometric Leading Lens Flare Tip Tracking.
 * - Explosive Shockwave & Lens Flare Flash on each number transition.
 * - Supernova Climax Particle Burst exit to solid blackout.
 */
export const CountdownTimer_RadialEnergy: React.FC<CountdownTimerRadialEnergyProps> = ({
  accentColor = '#DC2626', // Crimson Red
  accentOrange = '#F97316', // Solar Orange
  accentYellow = '#FBBF24', // Golden Amber
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
  // Charging Phase: 0 -> 26f (~0.87s) | Shockwave Flash: 26f -> 30f (~0.13s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const chargeDuration = 26; // 0 to 26 frames

  // Radial Ring Progress (0 to 1) with smooth acceleration
  const chargeProgress = interpolate(
    localFrame,
    [0, chargeDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  // Explosive Shockwave & Flash Trigger (localFrame 26 to 29)
  const isExploding = localFrame >= 25 && frame < 150;
  const explosionProgress = isExploding
    ? interpolate(localFrame, [25, 29], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const shockwaveScale = isExploding ? 1 + explosionProgress * 0.75 : 1;
  const shockwaveOpacity = isExploding ? 1 - explosionProgress : 0;
  const flashOpacity = isExploding ? Math.sin(explosionProgress * Math.PI) * 0.75 : 0;

  // Impact Scale Snap for Hero Number
  const numberPopSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 200 },
  });
  const numberScale = currentStepIndex > 0 ? interpolate(numberPopSpring, [0, 1], [1.18, 1]) : 1;

  // --- RING & TRIGONOMETRY MATH (Radius 580px) ---
  const ringRadius = 580;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference * (1 - chargeProgress);

  // Leading Tip Angle in Radians (-90° starting at top 12 o'clock)
  const tipAngleDeg = -90 + chargeProgress * 360;
  const tipAngleRad = (tipAngleDeg * Math.PI) / 180;

  // Center Coordinates (1920, 1080)
  const cx = 1920;
  const cy = 1080;
  const tipX = cx + ringRadius * Math.cos(tipAngleRad);
  const tipY = cy + ringRadius * Math.sin(tipAngleRad);

  // --- ORBITAL PLASMA PARTICLES (14 Motes) ---
  // Acceleration factor: orbits faster as charge progress approaches 1.0
  const orbitalSpeedMultiplier = 1 + Math.pow(chargeProgress, 2.5) * 3.5;
  const baseAngle = frame * 0.08 * orbitalSpeedMultiplier;

  const particles = Array.from({ length: 14 }).map((_, i) => {
    const angleOffset = (i / 14) * Math.PI * 2;
    const currentAngle = baseAngle + angleOffset;

    // Radius fluctuation (+-25px)
    const radOffset = Math.sin(frame * 0.2 + i * 1.5) * 22;
    const r = ringRadius + radOffset;

    const px = cx + r * Math.cos(currentAngle);
    const py = cy + r * Math.sin(currentAngle);
    const pSize = 10 + (i % 4) * 4;

    return { px, py, pSize, key: i };
  });

  // --- EXIT PHASE: SUPERNOVA CLIMAX EXPLOSION (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const climaxProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    : 0;

  const climaxShockwaveScale = isEndPhase ? 1 + climaxProgress * 2.8 : 1;
  const climaxShockwaveOpacity = isEndPhase ? interpolate(climaxProgress, [0, 0.7], [1, 0]) : 0;
  const climaxFlash = isEndPhase ? interpolate(climaxProgress, [0, 0.3, 1], [0, 0.9, 0]) : 0;
  const exitOpacity = isEndPhase ? interpolate(climaxProgress, [0.75, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : exitOpacity,
      }}
    >
      {/* 1. SOLAR CORE AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1600px',
          height: '1600px',
          background: `radial-gradient(circle at center, ${accentOrange}35 0%, ${accentColor}20 45%, transparent 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. EXPLOSIVE FLASH OVERLAY */}
      {(flashOpacity > 0 || climaxFlash > 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            opacity: Math.max(flashOpacity, climaxFlash),
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      )}

      {/* 3. MAIN SVG RADIAL CHARGING RING & SHOCKWAVE CONTAINER */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
      >
        <defs>
          {/* Fiery Solar Sweep Gradient */}
          <linearGradient id="fire-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="50%" stopColor={accentOrange} />
            <stop offset="100%" stopColor={accentYellow} />
          </linearGradient>

          {/* High Energy Bloom Glow Filter */}
          <filter id="solar-bloom" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor={accentOrange} floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="35" floodColor={accentColor} floodOpacity="0.75" />
          </filter>
        </defs>

        {/* STATIC BACKGROUND TRACK RING */}
        <circle
          cx={cx}
          cy={cy}
          r={ringRadius}
          fill="none"
          stroke="#2A1515"
          strokeWidth="10"
          opacity="0.6"
        />

        {/* CHARGING PROGRESS RING (0% to 100%) */}
        <circle
          cx={cx}
          cy={cy}
          r={ringRadius}
          fill="none"
          stroke="url(#fire-grad)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray={ringCircumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          filter="url(#solar-bloom)"
        />

        {/* INTERMEDIATE SHOCKWAVE RING (Explosion on 100% Charge) */}
        {isExploding && (
          <circle
            cx={cx}
            cy={cy}
            r={ringRadius * shockwaveScale}
            fill="none"
            stroke={accentYellow}
            strokeWidth={interpolate(explosionProgress, [0, 1], [24, 2])}
            opacity={shockwaveOpacity}
            filter="url(#solar-bloom)"
          />
        )}

        {/* SUPERNOVA CLIMAX SHOCKWAVE RING (Exit Phase) */}
        {isEndPhase && (
          <circle
            cx={cx}
            cy={cy}
            r={ringRadius * climaxShockwaveScale}
            fill="none"
            stroke="url(#fire-grad)"
            strokeWidth={interpolate(climaxProgress, [0, 1], [32, 2])}
            opacity={climaxShockwaveOpacity}
            filter="url(#solar-bloom)"
          />
        )}

        {/* LEADING TIP HIGH-INTENSITY LENS FLARE */}
        {chargeProgress > 0.02 && chargeProgress < 0.98 && (
          <g transform={`translate(${tipX}, ${tipY})`}>
            {/* Core Bright Spot */}
            <circle cx="0" cy="0" r="16" fill="#FFFFFF" filter="url(#solar-bloom)" />
            {/* Outer Flare Ring */}
            <circle cx="0" cy="0" r="32" fill="none" stroke={accentYellow} strokeWidth="4" opacity="0.8" />
          </g>
        )}

        {/* 4. ORBITAL PLASMA PARTICLES */}
        {particles.map((pt) => {
          const particleScale = isEndPhase ? 1 + climaxProgress * 3.5 : 1;
          const particleOpacity = isEndPhase ? interpolate(climaxProgress, [0.4, 1], [1, 0]) : 1;

          return (
            <circle
              key={pt.key}
              cx={cx + (pt.px - cx) * particleScale}
              cy={cy + (pt.py - cy) * particleScale}
              r={pt.pSize}
              fill={pt.key % 2 === 0 ? accentYellow : accentOrange}
              opacity={particleOpacity}
              filter="url(#solar-bloom)"
            />
          );
        })}
      </svg>

      {/* 5. CENTER HERO NUMBER */}
      {!isEndPhase && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${numberScale})`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#FFFFFF',
            fontFamily: interFont,
            fontSize: '740px',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-10px',
            textShadow: `0 0 35px ${accentOrange}, 0 0 70px ${accentColor}`,
          }}
        >
          {currentNumber}
        </div>
      )}
    </AbsoluteFill>
  );
};
