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

export interface CountdownTimerPortalEnergyProps {
  accentColor?: string; // Electric Cyan #06B6D4
  accentSecondary?: string; // Deep Cobalt Blue #2563EB
  accentMint?: string; // Luminous Emerald Mint #10B981
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_PortalEnergy (Quantum Arc Portal & Counter-Rotating Energy Ring Countdown)
 * Niche: Quantum Tech, Sci-Fi Portal Launch, Deep Space Energy Core, High-Tech Corporate Reveal.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Quantum Singularity Portal Warp Exit & Blackout (150 - 165f)
 * - Deep Space Cyan, Cobalt Blue, & Emerald Mint Palette (#06B6D4 -> #2563EB -> #10B981).
 * - DUAL Concentric Counter-Rotating Energy Arc Rings (Outer Clockwise 620px, Inner Counter-Clockwise 540px).
 * - 12 Pulsing Radial Starlight Energy Rays.
 * - Implosive Core Snap & Dimensional Portal Ring Shockwave on number transitions.
 * - Quantum Portal Singularity Hyper-Warp exit to solid blackout.
 */
export const CountdownTimer_PortalEnergy: React.FC<CountdownTimerPortalEnergyProps> = ({
  accentColor = '#06B6D4', // Electric Cyan
  accentSecondary = '#2563EB', // Deep Cobalt Blue
  accentMint = '#10B981', // Luminous Emerald Mint
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
  // Charging Phase: 0 -> 26f (~0.87s) | Implosive Warp Shockwave: 26f -> 30f (~0.13s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const chargeDuration = 26; // 0 to 26 frames

  // Radial Ring Progress (0 to 1)
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

  // Implosive Core Snap & Portal Shockwave Trigger (localFrame 25 to 29)
  const isImploding = localFrame >= 25 && frame < 150;
  const implosionProgress = isImploding
    ? interpolate(localFrame, [25, 29], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Implosion Number Scale: contracts down then pops back out for next number
  const implosionNumberScale = isImploding
    ? interpolate(implosionProgress, [0, 0.5, 1], [1, 0.15, 1.25])
    : 1;

  const numberSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, mass: 0.35, stiffness: 220 },
  });
  const numberPopScale = currentStepIndex > 0 && !isImploding
    ? interpolate(numberSpring, [0, 1], [1.2, 1])
    : 1;

  const portalShockwaveScale = isImploding ? 1 + implosionProgress * 0.85 : 1;
  const portalShockwaveOpacity = isImploding ? 1 - implosionProgress : 0;
  const portalFlash = isImploding ? Math.sin(implosionProgress * Math.PI) * 0.8 : 0;

  // --- RING MATH (Center 1920, 1080) ---
  const cx = 1920;
  const cy = 1080;

  // Outer Ring Radius 620px (Rotates Clockwise)
  const outerRadius = 620;
  const outerRotation = frame * 1.5;

  // Inner Ring Radius 540px (Rotates Counter-Clockwise & Charges 0% to 100%)
  const innerRadius = 540;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerDashoffset = innerCircumference * (1 - chargeProgress);
  const innerRotation = -frame * 2.2;

  // 12 Radial Starlight Beams
  const rayBeams = Array.from({ length: 12 }).map((_, i) => {
    const angleRad = ((i * 30 + frame * 0.6) * Math.PI) / 180;
    const rStart = innerRadius + 10;
    const rEnd = outerRadius + 30 + Math.sin(frame * 0.2 + i) * 20;

    const x1 = cx + rStart * Math.cos(angleRad);
    const y1 = cy + rStart * Math.sin(angleRad);
    const x2 = cx + rEnd * Math.cos(angleRad);
    const y2 = cy + rEnd * Math.sin(angleRad);

    return { x1, y1, x2, y2, key: i };
  });

  // --- EXIT PHASE: QUANTUM PORTAL SINGULARITY WARP (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const warpProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.6, 0, 0.8, 1),
      })
    : 0;

  // Collapse to singularity then explode into hyper-warp
  const warpScale = isEndPhase
    ? interpolate(warpProgress, [0, 0.35, 1], [1, 0.08, 4.5])
    : 1;
  const warpOpacity = isEndPhase ? interpolate(warpProgress, [0.65, 1], [1, 0]) : 1;
  const warpFlash = isEndPhase ? interpolate(warpProgress, [0.3, 0.5, 0.9], [0, 0.95, 0]) : 0;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : warpOpacity,
      }}
    >
      {/* 1. QUANTUM NEBULA AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1650px',
          height: '1650px',
          background: `radial-gradient(circle at center, ${accentColor}30 0%, ${accentSecondary}20 45%, transparent 70%)`,
          filter: 'blur(95px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. PORTAL IMPLOSION FLASH OVERLAY */}
      {(portalFlash > 0 || warpFlash > 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            opacity: Math.max(portalFlash, warpFlash),
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      )}

      {/* 3. DUAL COUNTER-ROTATING ENERGY RINGS & PORTAL RAYS CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${warpScale})`,
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
            {/* Quantum Cyan to Emerald Mint Gradient */}
            <linearGradient id="quantum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={accentSecondary} />
              <stop offset="100%" stopColor={accentMint} />
            </linearGradient>

            {/* Quantum Core Bloom Glow Filter */}
            <filter id="quantum-bloom" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor={accentColor} floodOpacity="0.85" />
              <feDropShadow dx="0" dy="0" stdDeviation="35" floodColor={accentSecondary} floodOpacity="0.7" />
            </filter>
          </defs>

          {/* 12 RADIAL STARLIGHT BEAMS */}
          {rayBeams.map((ray) => (
            <line
              key={ray.key}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="url(#quantum-grad)"
              strokeWidth={2.5 + (ray.key % 3) * 1.5}
              strokeLinecap="round"
              opacity={0.5 + Math.sin(frame * 0.3 + ray.key) * 0.35}
              filter="url(#quantum-bloom)"
            />
          ))}

          {/* OUTER RING: QUADRANT SEGMENTED ARCS (Rotates Clockwise) */}
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            fill="none"
            stroke="url(#quantum-grad)"
            strokeWidth="8"
            strokeDasharray="280 180"
            transform={`rotate(${outerRotation} ${cx} ${cy})`}
            opacity="0.75"
            filter="url(#quantum-bloom)"
          />

          {/* INNER RING: CHARGING ARC PROGRESS (0% to 100%, Counter-Clockwise) */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius}
            fill="none"
            stroke="url(#quantum-grad)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={innerCircumference}
            strokeDashoffset={innerDashoffset}
            transform={`rotate(${innerRotation} ${cx} ${cy})`}
            filter="url(#quantum-bloom)"
          />

          {/* PORTAL IMPLOSION RIPPLE SHOCKWAVE */}
          {isImploding && (
            <circle
              cx={cx}
              cy={cy}
              r={innerRadius * portalShockwaveScale}
              fill="none"
              stroke={accentMint}
              strokeWidth={interpolate(implosionProgress, [0, 1], [26, 2])}
              opacity={portalShockwaveOpacity}
              filter="url(#quantum-bloom)"
            />
          )}
        </svg>

        {/* 4. CENTER HERO NUMBER */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${implosionNumberScale * numberPopScale})`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFFFFF',
              fontFamily: interFont,
              fontSize: '720px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-10px',
              textShadow: `0 0 35px ${accentColor}, 0 0 70px ${accentSecondary}`,
            }}
          >
            {currentNumber}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
