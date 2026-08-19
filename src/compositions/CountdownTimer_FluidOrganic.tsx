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
  weights: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerFluidOrganicProps {
  accentColor?: string; // Emerald Mint #10B981
  accentGradientEnd?: string; // Ocean Turquoise #06B6D4
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_FluidOrganic (Organic Fluid & Liquid Bio-Tech Countdown)
 * Niche: Lifestyle, Bio-Tech Innovation, Wellness, Sustainable Eco Tech, Creative Premiere.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Organic Liquid Ripple Dissolve & Blackout (150 - 165f)
 * - Luminous Emerald Mint (#10B981) & Ocean Turquoise (#06B6D4) palette on Deep Luminous Slate (#0F172A).
 * - 100% BLANK GRAPHIC CANVAS (No corner text lines).
 * - Fluid Droplet Impact & Wave Ripple Pulse (scale 1.15 -> 1.0) on cut frames.
 * - 360° Liquid Wave Progress Arc & 8 orbiting bio-droplets.
 * - Organic Liquid Ripple Dissolve exit to solid black.
 */
export const CountdownTimer_FluidOrganic: React.FC<CountdownTimerFluidOrganicProps> = ({
  accentColor = '#10B981', // Emerald Mint
  accentGradientEnd = '#06B6D4', // Ocean Turquoise
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#0F172A';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE CALCULATIONS (165 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // ==========================================
  const framesPerNumber = 30;
  const currentNumberIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];
  const currentDisplayNumber = numberSequence[currentNumberIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;

  // --- ORGANIC FLUID SPRING ANIMATIONS ---
  // Fluid Droplet Impact Number Spring (Scale: 0.7 -> 1.0)
  const fluidSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 130 },
  });

  const numberScale = interpolate(fluidSpring, [0, 1], [0.72, 1]);
  const numberOpacity = interpolate(fluidSpring, [0, 1], [0, 1]);

  // Liquid Wave Ripple Pulse on Cut Frame
  const rippleSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 9, mass: 0.4, stiffness: 150 },
  });

  const rippleScale = interpolate(rippleSpring, [0, 1], [1.18, 1]);
  const rippleWaveRadius = interpolate(rippleSpring, [0, 1], [580, 720]);
  const rippleWaveOpacity = interpolate(rippleSpring, [0, 1], [0.75, 0]);

  // Smooth 360° Liquid Wave Progress Arc (30 frames per number step)
  const liquidArcAngle = (localFrame / framesPerNumber) * 360;

  // Idle Sine Wave Undulation (0.05 rad/f)
  const waveUndulation = Math.sin(frame * 0.08) * 6;

  // --- EXIT PHASE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const exitProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const exitScale = isEndPhase ? interpolate(exitProgress, [0, 1], [1, 1.42]) : 1;
  const exitOpacity = isEndPhase ? interpolate(exitProgress, [0.4, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  // 8 Orbiting Bio-Droplets Array
  const orbitAngleBase = (frame * 0.03) % (Math.PI * 2);

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
      {/* 1. EMERALD MINT & TURQUOISE LIQUID AMBIENT GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1350px',
          height: '1350px',
          background: `radial-gradient(circle at center, ${accentColor}35 0%, ${accentGradientEnd}20 45%, transparent 70%)`,
          filter: 'blur(75px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN FLUID COUNTDOWN CONTAINER (Centered & Scaled for Exit) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${exitScale})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Emerald Mint to Ocean Turquoise Liquid Gradient */}
            <linearGradient id="fluid-mint-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            <filter id="fluid-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor={accentColor} floodOpacity="0.7" />
            </filter>

            {/* Vignette Radial Shadow */}
            <radialGradient id="fluid-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="65%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {/* LAYER A: CONCENTRIC LIQUID RIPPLE RINGS (Center 1920, 1080, Radius = 580px) */}
          <g
            transform={`translate(${width / 2}, ${height / 2}) scale(${rippleScale})`}
            filter="url(#fluid-glow)"
          >
            {/* Expansion Ripple Wave on Cut Frame */}
            <circle
              cx="0"
              cy="0"
              r={rippleWaveRadius}
              fill="none"
              stroke="url(#fluid-mint-grad)"
              strokeWidth="2"
              opacity={rippleWaveOpacity}
            />

            {/* Outer Liquid Ring (Radius = 580px) with Undulation */}
            <circle
              cx="0"
              cy="0"
              r={580 + waveUndulation}
              fill="none"
              stroke="url(#fluid-mint-grad)"
              strokeWidth="3.5"
            />

            {/* Inner Concentric Hairline Ring (Radius = 500px) */}
            <circle
              cx="0"
              cy="0"
              r={500 - waveUndulation * 0.5}
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="1.8"
              strokeDasharray="16 12"
              opacity="0.5"
            />

            {/* 360° SMOOTH LIQUID WAVE PROGRESS ARC */}
            <path
              d={`M 0 -580 A 580 580 0 ${liquidArcAngle > 180 ? 1 : 0} 1 ${Math.sin((liquidArcAngle * Math.PI) / 180) * 580} ${-Math.cos((liquidArcAngle * Math.PI) / 180) * 580}`}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="6.5"
              strokeLinecap="round"
              filter="url(#fluid-glow)"
            />

            {/* Arc Leading Liquid Node */}
            <circle
              cx={Math.sin((liquidArcAngle * Math.PI) / 180) * 580}
              cy={-Math.cos((liquidArcAngle * Math.PI) / 180) * 580}
              r="8"
              fill="#F8FAFC"
              filter="url(#fluid-glow)"
            />

            {/* 8 ORBITING BIO-DROPLETS ALONG PERIMETER */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => {
              const rad = (deg * Math.PI) / 180 + orbitAngleBase;
              const dropR = 580 + Math.sin(frame * 0.1 + idx) * 12;
              return (
                <circle
                  key={deg}
                  cx={Math.sin(rad) * dropR}
                  cy={-Math.cos(rad) * dropR}
                  r={5 + (idx % 3) * 2.5}
                  fill={idx % 2 === 0 ? "#10B981" : "#06B6D4"}
                  filter="url(#fluid-glow)"
                />
              );
            })}
          </g>

          {/* LAYER B: VIGNETTE DARK SHADOW */}
          <rect x="0" y="0" width={width} height={height} fill="url(#fluid-vignette)" pointerEvents="none" />
        </svg>

        {/* LAYER C: BIG MODERN ROUNDED SANS TYPOGRAPHY DISPLAY */}
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
              width: '600px',
              height: '600px',
              opacity: numberOpacity,
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '360px',
                fontWeight: 800,
                color: '#F8FAFC',
                letterSpacing: '-4px',
                lineHeight: 1,
                textShadow: '0 12px 35px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.55)',
              }}
            >
              {currentDisplayNumber}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
