import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
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

export interface CountdownTimerInkWashProps {
  inkColor?: string; // Deep Ink Black #0D0D0D
  paperBg?: string; // Soft Ivory White #FAF7F2
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_InkWash (Organic Monochrome Ink Wash & Fluid Paper Diffusion)
 * Niche: Minimalist Art, Zen Sumi-e Aesthetic, Editorial Fine Art, Luxury Fashion, Documentary.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 8.5 seconds (255 frames @ 30fps):
 *   Number 5 (0 - 45f = 1.5s)
 *   Number 4 (45 - 90f = 1.5s)
 *   Number 3 (90 - 135f = 1.5s)
 *   Number 2 (135 - 180f = 1.5s)
 *   Number 1 (180 - 225f = 1.5s)
 *   Ink Diffusion Overflow & Fade to Clean White Exit (225 - 255f = 1.0s)
 * - STRICT MONOCHROME PALETTE: Soft Ivory White (#FAF7F2) & Deep Ink Black (#0D0D0D).
 * - SVG Fractal Noise Displacement (`feTurbulence` + `feDisplacementMap` + `feGaussianBlur`).
 * - Asymmetric Non-Linear Ink Diffusion & Density Gradients (darker core, feathering edges).
 * - Zen Breathing Rhythm: 5-frame pure blank ivory canvas pause between numbers.
 * - Massive Ink Spill & Fade to CLEAN WHITE exit.
 */
export const CountdownTimer_InkWash: React.FC<CountdownTimerInkWashProps> = ({
  inkColor = '#0D0D0D', // Deep Ink Black
  paperBg = '#FAF7F2', // Soft Ivory White
}) => {
  const frame = useCurrentFrame();

  // ==========================================
  // TIMELINE CALCULATIONS (255 Frames Total @ 30fps)
  // Number Step = 45 frames (1.5s) per number
  // Bloom In: 0 -> 18f (~0.6s)
  // Hold & Fluid Bleed: 18 -> 33f (~0.5s)
  // Wash Out: 33 -> 40f (~0.25s)
  // Zen Blank Pause: 40 -> 45f (~0.15s)
  // ==========================================
  const framesPerNumber = 45;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 44)
  const localFrame = frame % framesPerNumber;
  const bloomDuration = 18; // 0 to 18f
  const holdDuration = 15; // 18 to 33f
  const washDuration = 7; // 33 to 40f

  // 1. Ink Bloom Progress (0 to 1)
  const bloomProgress = interpolate(
    localFrame,
    [0, bloomDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0, 0.15, 1),
    }
  );

  // 2. Ink Wash-Out Progress (0 to 1)
  const washProgress = interpolate(
    localFrame,
    [bloomDuration + holdDuration, bloomDuration + holdDuration + washDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.5, 0, 0.8, 1),
    }
  );

  // Zen Blank Pause (localFrame 40 to 44)
  const isBlankPause = localFrame >= (bloomDuration + holdDuration + washDuration) && frame < 225;

  // --- ASYMMETRIC INK DIFFUSION TRANSFORM MATH ---
  // Scale & Skew for non-symmetrical organic growth
  const inkScaleX = interpolate(bloomProgress, [0, 1], [0.15, 1]);
  const inkScaleY = interpolate(bloomProgress, [0, 1], [0.22, 1]);
  const inkSkewX = (1 - bloomProgress) * 16 * (currentStepIndex % 2 === 0 ? 1 : -1);
  const inkSkewY = (1 - bloomProgress) * -12;

  // Ink Bleed Density & Blur
  const inkBlur = isBlankPause
    ? 0
    : washProgress > 0
    ? interpolate(washProgress, [0, 1], [3, 45])
    : interpolate(bloomProgress, [0, 0.7, 1], [22, 8, 3]);

  const inkOpacity = isBlankPause
    ? 0
    : washProgress > 0
    ? interpolate(washProgress, [0, 1], [0.95, 0])
    : interpolate(bloomProgress, [0, 0.3, 1], [0, 0.75, 0.96]);

  // Dynamic SVG Displacement Map Scale (Controls organic paper edge turbulence)
  const displacementScale = isBlankPause
    ? 0
    : washProgress > 0
    ? interpolate(washProgress, [0, 1], [30, 140])
    : interpolate(bloomProgress, [0, 1], [85, 30]);

  // Gentle Fluid Micro-Bleed on Hold
  const holdBleedX = Math.sin(frame * 0.05 + currentStepIndex) * 6;
  const holdBleedY = Math.cos(frame * 0.04 + currentStepIndex) * 5;

  // --- EXIT PHASE: MASSIVE INK SPILL & FADE TO CLEAN WHITE (Frame 225 - 255) ---
  const isEndPhase = frame >= 225;
  const spillProgress = isEndPhase
    ? interpolate(frame, [225, 252], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    : 0;

  const spillScale = isEndPhase ? interpolate(spillProgress, [0, 1], [1, 4.5]) : 1;
  const spillBlur = isEndPhase ? interpolate(spillProgress, [0, 1], [3, 70]) : 0;
  const spillOpacity = isEndPhase ? interpolate(spillProgress, [0, 0.5, 1], [0.96, 0.4, 0]) : 1;
  const isPureWhiteCanvas = frame >= 252;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isPureWhiteCanvas ? '#FFFFFF' : paperBg,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* 1. SUBTLE FINE PAPER FIBER GRAIN TEXTURE */}
      {!isPureWhiteCanvas && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(rgba(120, 100, 80, 0.08) 1px, transparent 0)',
            backgroundSize: '20px 20px',
            opacity: 0.65,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 2. SVG FRACTAL NOISE DISPLACEMENT & BLEED FILTER DEFS */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="ink-wash-filter" x="-30%" y="-30%" width="160%" height="160%">
            {/* Fractal Noise Generator */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.024"
              numOctaves="4"
              result="inkNoise"
            />
            {/* Displacement Map driven by Noise */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="inkNoise"
              scale={displacementScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedInk"
            />
            {/* Gaussian Blur for Soft Merging Edges */}
            <feGaussianBlur in="displacedInk" stdDeviation={inkBlur} result="blurredInk" />
            {/* Density Threshold Color Matrix */}
            <feColorMatrix
              in="blurredInk"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -4"
            />
          </filter>
        </defs>
      </svg>

      {/* 3. MAIN CENTERED ORGANIC INK WASH NUMBER */}
      {!isBlankPause && !isPureWhiteCanvas && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isEndPhase ? spillOpacity : inkOpacity,
            filter: 'url(#ink-wash-filter)',
          }}
        >
          {/* PRIMARY INK CORE (Deep Ink Black #0D0D0D) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: isEndPhase
                ? `translate(-50%, -50%) scale(${spillScale})`
                : `translate(calc(-50% + ${holdBleedX}px), calc(-50% + ${holdBleedY}px)) scale(${inkScaleX}, ${inkScaleY}) skew(${inkSkewX}deg, ${inkSkewY}deg)`,
              transformOrigin: 'center center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: inkColor,
              fontFamily: interFont,
              fontSize: '780px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-14px',
              filter: `blur(${isEndPhase ? spillBlur : inkBlur}px)`,
            }}
          >
            {currentNumber}
          </div>

          {/* SECONDARY UNDERLAY INK FEATHER (Slight Offset for Uneven Density) */}
          {!isEndPhase && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${holdBleedX + 12}px), calc(-50% + ${holdBleedY - 8}px)) scale(${inkScaleX * 1.04}, ${inkScaleY * 1.04}) skew(${inkSkewX * 1.2}deg, ${inkSkewY * 1.2}deg)`,
                transformOrigin: 'center center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: inkColor,
                fontFamily: interFont,
                fontSize: '780px',
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-14px',
                opacity: 0.4,
                filter: `blur(${inkBlur + 12}px)`,
              }}
            >
              {currentNumber}
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
