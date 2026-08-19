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

export interface CountdownTimerSundialShadowProps {
  shadowColor?: string; // Translucent Slate Blue #3A4A5C
  digitColor?: string; // Pure Clean White #FFFFFF
  centerBgColor?: string; // Very Dark Slate Charcoal #131313
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_SundialShadow (Cinematic Continuous Accelerating Sundial Sweep)
 * Niche: Cinematic Editorial, Documentary, Time-Pressure Reflective, High-End Luxury.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 6.0 seconds (180 frames @ 30fps):
 *   Number 5 (0 - 30f = 1.0s)
 *   Number 4 (30 - 60f = 1.0s)
 *   Number 3 (60 - 90f = 1.0s)
 *   Number 2 (90 - 120f = 1.0s)
 *   Number 1 (120 - 150f = 1.0s)
 *   Hyper-Speed Final Sweep & Reflective Sunset Fade-Out (150 - 180f = 1.0s)
 * - Pure Clean White Static Hero Typography (#FFFFFF, 760px).
 * - Continuous Non-Stop Sundial Shadow Sweep with gradual exponential acceleration.
 * - Subtle 0.15s (4.5f) Fast Digit Crossfade (shadow never stops or hitches).
 * - Translucent Slate Blue Sundial Beam (#3A4A5C, 45% opacity).
 * - Climax Hyper-Speed Sweep & Reflective Sunset Fade-Out.
 */
export const CountdownTimer_SundialShadow: React.FC<CountdownTimerSundialShadowProps> = ({
  shadowColor = '#3A4A5C', // Translucent Slate Blue
  digitColor = '#FFFFFF', // Pure Clean White
  centerBgColor = '#131313', // Very Dark Slate Charcoal
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE CALCULATIONS (180 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const crossfadeDuration = 5; // 5 frames (~0.16s) fast crossfade

  // Fast Subtle Digit Crossfade Opacity (1 -> 0 -> 1 at number boundaries)
  const digitCrossfadeOpacity = interpolate(
    localFrame,
    [0, crossfadeDuration / 2, crossfadeDuration],
    [currentStepIndex > 0 ? 0.2 : 1, 0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // --- CONTINUOUS ACCELERATING SUNDIAL ROTATION MATH ---
  // Frame 0 to 150: Gradually accelerating rotation angle (0° to 1260° = 3.5 full turns)
  const shadowRotationDeg = interpolate(
    frame,
    [0, 30, 60, 90, 120, 150],
    [0, 120, 300, 560, 890, 1260],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.35, 0, 0.25, 1),
    }
  );

  // Rotational Motion Blur (Increases as shadow accelerates)
  const shadowMotionBlur = interpolate(frame, [0, 60, 120, 150], [3, 8, 18, 28], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- CLIMAX EXIT PHASE: HYPER-SPEED SWEEP & SUNSET FADE-OUT (Frame 150 - 180) ---
  const isEndPhase = frame >= 150;
  const hyperSweepProgress = isEndPhase
    ? interpolate(frame, [150, 165], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const exitRotationDeg = isEndPhase
    ? 1260 + hyperSweepProgress * 450 // One final hyper-speed 360°+ sweep
    : shadowRotationDeg;

  const exitMotionBlur = isEndPhase
    ? interpolate(hyperSweepProgress, [0, 0.6, 1], [28, 36, 10])
    : shadowMotionBlur;

  // Sunset Fade-Out (Frame 165 to 180)
  const sunsetFadeOpacity = isEndPhase
    ? interpolate(frame, [165, 180], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 0, 0.2, 1),
      })
    : 1;

  const isTotalFadeOut = frame >= 180;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalFadeOut ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalFadeOut ? 0 : sunsetFadeOpacity,
      }}
    >
      {/* 1. SOFT SUBTLE RADIAL GRADIENT BACKDROP (Pure Black #000000 to Slate Charcoal #131313) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center, ${centerBgColor} 0%, #080808 60%, #000000 100%)`,
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN CENTERED STATIC HERO TYPOGRAPHY */}
      {!isEndPhase && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: digitColor,
            fontFamily: interFont,
            fontSize: '760px',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-14px',
            opacity: digitCrossfadeOpacity,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {currentNumber}
        </div>
      )}

      {/* 3. CONTINUOUS ACCELERATING SUNDIAL SHADOW BEAM (Center 1920, 1080) */}
      <div
        style={{
          position: 'absolute',
          top: '1080px',
          left: '1920px',
          width: '1900px',
          height: '180px',
          background: `linear-gradient(90deg, ${shadowColor}90 0%, ${shadowColor}50 40%, transparent 100%)`,
          clipPath: 'polygon(0 40%, 100% 0%, 100% 100%, 0 60%)', // Tapered sundial shadow wedge
          transformOrigin: 'left center',
          transform: `rotate(${exitRotationDeg}deg)`,
          opacity: 0.52,
          filter: `blur(${exitMotionBlur}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

      {/* 4. SECONDARY SOFT SHADOW CORONA HALO */}
      <div
        style={{
          position: 'absolute',
          top: '1080px',
          left: '1920px',
          width: '1600px',
          height: '240px',
          background: `radial-gradient(ellipse at left, ${shadowColor}40 0%, transparent 75%)`,
          transformOrigin: 'left center',
          transform: `rotate(${exitRotationDeg}deg)`,
          opacity: 0.35,
          filter: `blur(${exitMotionBlur + 14}px)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />
    </AbsoluteFill>
  );
};
