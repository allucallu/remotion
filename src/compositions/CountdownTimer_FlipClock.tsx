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

export interface CountdownTimerFlipClockProps {
  accentColor?: string; // Crisp Off-White Text #F5F5F5
  cardColor?: string; // Metallic Dark Charcoal #2A2A2E
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_FlipClock (100% Aligned Matching Number Halves & 3D Split-Flap Mechanics)
 * Niche: Retro Mechanical, Vintage Airport/Train Station, Industrial Hardware, Classic Watch.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Split Mechanical Door Open Exit & Blackout (150 - 165f)
 * - PERFECTLY MATCHING NUMBER HALVES (No 4/3 hybrid bug!).
 * - Metallic Dark Charcoal Flap Card (#2A2A2E) with subtle bevel highlight & physical grain texture.
 * - Crisp White Typography (#F5F5F5, 780px, Font Weight 900) split horizontally at center hinge line.
 * - TRUE 3D Flap Rotation Mechanics (0° -> -90° -> -180° around central hinge).
 * - High-speed Motion Blur at 90° mid-flip.
 * - Impact Spring Bounce & Micro Camera Shake on flap landing.
 * - Mechanical Split Door Open exit to solid blackout.
 */
export const CountdownTimer_FlipClock: React.FC<CountdownTimerFlipClockProps> = ({
  accentColor = '#F5F5F5', // Crisp Off-White Text
  cardColor = '#2A2A2E', // Metallic Dark Charcoal
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
  // TIMELINE CALCULATIONS (165 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // Hold: 0 -> 19f (~0.63s) | 3D Flip: 19f -> 29f (~0.33s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];
  const nextNumber = numberSequence[Math.min(4, currentStepIndex + 1)];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const flipStartFrame = 19;
  const flipDuration = 10; // 19 to 29 frames

  // 3D Flip Progress (0 to 1)
  const rawFlipProgress = interpolate(
    localFrame,
    [flipStartFrame, flipStartFrame + flipDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.55, 0, 0.45, 1),
    }
  );

  const isFlipping = rawFlipProgress > 0 && rawFlipProgress < 1;

  // Phase 1 (0 to 0.5): Upper Flap falls down (0° to -90°)
  // Phase 2 (0.5 to 1.0): Lower Flap lands (90° to 0°)
  const isPhase1 = rawFlipProgress < 0.5;
  const phase1RotateX = interpolate(rawFlipProgress, [0, 0.5], [0, -90]);
  const phase2RotateX = interpolate(rawFlipProgress, [0.5, 1], [90, 0]);

  // Motion Blur Intensity at ~90° mid-flip (peak at t = 0.5)
  const midFlipBlur = Math.sin(rawFlipProgress * Math.PI) * 14; // up to 14px vertical blur

  // Impact Bounce & Micro Shake on Landing (localFrame 0 to 6)
  const isImpactPhase = localFrame <= 6 && currentStepIndex > 0 && frame < 150;
  const bounceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 9, mass: 0.35, stiffness: 180 },
  });

  const bounceRotateX = isImpactPhase ? interpolate(bounceSpring, [0, 1], [14, 0]) : 0;
  const shakeX = isImpactPhase ? (Math.sin(localFrame * 3.5) * 5) : 0;
  const shakeY = isImpactPhase ? (Math.cos(localFrame * 4.2) * 4) : 0;

  // --- EXIT PHASE: MECHANICAL SPLIT DOOR OPEN (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const doorProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const leftDoorX = isEndPhase ? interpolate(doorProgress, [0, 1], [0, -2000]) : 0;
  const rightDoorX = isEndPhase ? interpolate(doorProgress, [0, 1], [0, 2000]) : 0;
  const exitOpacity = isEndPhase ? interpolate(doorProgress, [0.8, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  // Helper render for single half card (Top or Bottom)
  const renderCardHalf = (
    num: number,
    half: 'top' | 'bottom',
    shadowOpacity: number = 0
  ) => {
    const isTop = half === 'top';
    return (
      <div
        style={{
          position: 'absolute',
          top: isTop ? 0 : '650px',
          left: 0,
          width: '1100px',
          height: '650px',
          overflow: 'hidden',
          backgroundColor: cardColor,
          backgroundImage: 'linear-gradient(180deg, #35353A 0%, #222226 100%)',
          borderRadius: isTop ? '24px 24px 0 0' : '0 0 24px 24px',
          border: '2.5px solid #48484E',
          boxSizing: 'border-box',
          boxShadow: isTop
            ? 'inset 0 2px 4px rgba(255,255,255,0.15), 0 10px 25px rgba(0,0,0,0.5)'
            : 'inset 0 -2px 4px rgba(0,0,0,0.5), 0 15px 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Number Text Positioned for Split Alignment */}
        <div
          style={{
            position: 'absolute',
            top: isTop ? '0px' : '-650px',
            left: 0,
            width: '1100px',
            height: '1300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: accentColor,
            fontFamily: interFont,
            fontSize: '780px',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-12px',
            textShadow: '0 8px 24px rgba(0,0,0,0.85)',
          }}
        >
          {num}
        </div>

        {/* Dynamic Shadow Overlay */}
        {shadowOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              opacity: shadowOpacity,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    );
  };

  // Render complete Flip Card Content (for Left or Right door half)
  const renderFlipCardContent = () => {
    return (
      <>
        {/* TOP BASE CARD: Show nextNumber if flipping, else currentNumber */}
        {renderCardHalf(isFlipping ? nextNumber : currentNumber, 'top')}

        {/* BOTTOM BASE CARD: Show currentNumber */}
        {renderCardHalf(currentNumber, 'bottom', bounceRotateX > 0 ? 0.2 : 0)}

        {/* FOREGROUND ROTATING FLAP (Only active during 3D flip transition) */}
        {isFlipping && (
          <div
            style={{
              position: 'absolute',
              top: isPhase1 ? 0 : '650px',
              left: 0,
              width: '1100px',
              height: '650px',
              transformOrigin: isPhase1 ? 'bottom center' : 'top center',
              transform: `rotateX(${isPhase1 ? phase1RotateX : phase2RotateX}deg)`,
              filter: midFlipBlur > 1 ? `blur(0px ${midFlipBlur}px)` : 'none',
              zIndex: 20,
            }}
          >
            {isPhase1
              ? renderCardHalf(currentNumber, 'top', interpolate(rawFlipProgress, [0, 0.5], [0, 0.7]))
              : renderCardHalf(nextNumber, 'bottom', interpolate(rawFlipProgress, [0.5, 1], [0.7, 0]))}
          </div>
        )}
      </>
    );
  };

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
      {/* 1. AMBIENT CARD SHADOW BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1450px',
          height: '1650px',
          background: 'radial-gradient(circle at center, rgba(42,42,46,0.35) 0%, transparent 70%)',
          filter: 'blur(85px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN CENTERED FLIP CLOCK CARD CONTAINER (1100px x 1300px) */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${shakeX}px), calc(-50% + ${shakeY}px))`,
          width: '1100px',
          height: '1300px',
        }}
      >
        {/* LEFT HALF SPLIT DOOR (Moves Left on Exit) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1100px',
            height: '1300px',
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
            transform: `translateX(${leftDoorX}px)`,
            perspective: '2000px',
          }}
        >
          {renderFlipCardContent()}
        </div>

        {/* RIGHT HALF SPLIT DOOR (Moves Right on Exit) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1100px',
            height: '1300px',
            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
            transform: `translateX(${rightDoorX}px)`,
            perspective: '2000px',
          }}
        >
          {renderFlipCardContent()}
        </div>

        {/* CENTER HINGE GAP LINE & METALLIC HINGE PINS */}
        {!isEndPhase && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 30 }}>
            <svg width="1100" height="1300" viewBox="0 0 1100 1300">
              {/* Horizontal Center Hinge Gap */}
              <line x1="0" y1="650" x2="1100" y2="650" stroke="#121215" strokeWidth="6" />

              {/* Left & Right Metallic Hinge Pins */}
              <rect x="-14" y="636" width="22" height="28" rx="4" fill="#66666E" stroke="#1E1E22" strokeWidth="2" />
              <rect x="1092" y="636" width="22" height="28" rx="4" fill="#66666E" stroke="#1E1E22" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
