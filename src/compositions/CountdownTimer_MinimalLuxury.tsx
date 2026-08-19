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
  weights: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerMinimalLuxuryProps {
  accentColor?: string; // Champagne Gold #D4AF37
  accentGradientEnd?: string; // Soft Light Platinum #FEF3C7
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_MinimalLuxury (Luxury Editorial & Minimalist Champagne Gold Countdown)
 * Niche: Fashion Film, Luxury Brand Premiere, Corporate Keynote, Executive Gala.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Champagne Gold Bloom Dissolve & Blackout (150 - 165f)
 * - Concentric Hairline Target Circles (1100px diameter, 4K) with cardinal diamond notches.
 * - Champagne Gold (#D4AF37) & Warm Platinum (#FEF3C7) palette on Deep Onyx Slate (#12131A).
 * - Ultra-smooth spring number slide-up & pulse wave expansion on cut frame.
 * - Floating micro gold sparkles & soft vignette.
 */
export const CountdownTimer_MinimalLuxury: React.FC<CountdownTimerMinimalLuxuryProps> = ({
  accentColor = '#D4AF37', // Champagne Gold
  accentGradientEnd = '#FEF3C7', // Soft Light Platinum
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#12131A';
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

  // --- ELEGANT SPRING ANIMATIONS ---
  // Number Entrance Spring Slide Up (0 -> 1 for each number step)
  const numberSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });

  const numberY = interpolate(numberSpring, [0, 1], [30, 0]);
  const numberOpacity = interpolate(numberSpring, [0, 1], [0, 1]);

  // Cardinal Diamond Notch Pulse on Cut Frame
  const pulseSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 160 },
  });

  const pulseScale = interpolate(pulseSpring, [0, 1], [1.3, 1]);
  const pulseWaveRadius = interpolate(pulseSpring, [0, 1], [550, 680]);
  const pulseWaveOpacity = interpolate(pulseSpring, [0, 1], [0.7, 0]);

  // Smooth Clock Progress Arc (360° sweep over 30 frames per number step)
  const clockArcProgress = (localFrame / framesPerNumber) * 360;

  // --- EXIT PHASE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const exitProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : 0;

  const exitScale = isEndPhase ? interpolate(exitProgress, [0, 1], [1, 1.35]) : 1;
  const exitOpacity = isEndPhase ? interpolate(exitProgress, [0.4, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  // Micro Floating Gold Sparkles Array (12 slow drifting particles)
  const goldSparkles = [...Array(12)].map((_, i) => {
    const sSeed = (i * 53 + frame * 0.4) % 1000;
    const sx = (i * 310 + sSeed * 1.5) % width;
    const sy = ((height + 100) - ((i * 180 + frame * 4.5 + sSeed * 0.8) % (height + 200)));
    const sr = 1.2 + (i % 3) * 1.0;
    const sOp = 0.2 + Math.sin(frame * 0.08 + i) * 0.15 + 0.15;
    return { sx, sy, sr, sOp };
  });

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
      {/* 1. ELEGANT CHAMPAGNE GOLD AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px',
          height: '1200px',
          background: `radial-gradient(circle at center, ${accentColor}25 0%, ${accentGradientEnd}12 45%, transparent 70%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN LUXURY COUNTDOWN CONTAINER (Centered & Scaled for Exit) */}
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
            {/* Champagne Gold to Platinum Gradient */}
            <linearGradient id="gold-luxury-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7E7A9" />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#B88E2B" />
            </linearGradient>

            <filter id="gold-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor={accentColor} floodOpacity="0.65" />
            </filter>

            {/* Soft Radial Vignette */}
            <radialGradient id="lux-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {/* LAYER A: FLOATING MICRO GOLD SPARKLES */}
          <g>
            {goldSparkles.map((sp, idx) => (
              <circle
                key={idx}
                cx={sp.sx}
                cy={sp.sy}
                r={sp.sr}
                fill="url(#gold-luxury-grad)"
                opacity={sp.sOp}
                filter="url(#gold-glow)"
              />
            ))}
          </g>

          {/* LAYER B: CONCENTRIC LUXURY HAIRLINE CIRCLES (Center 1920, 1080, Radius 550px) */}
          <g
            transform={`translate(${width / 2}, ${height / 2})`}
            filter="url(#gold-glow)"
          >
            {/* Expansion Pulse Wave on Cut Frame */}
            <circle
              cx="0"
              cy="0"
              r={pulseWaveRadius}
              fill="none"
              stroke="url(#gold-luxury-grad)"
              strokeWidth="1.5"
              opacity={pulseWaveOpacity}
            />

            {/* Outer Fine Hairline Target Circle (Radius = 550px) */}
            <circle cx="0" cy="0" r="550" fill="none" stroke="url(#gold-luxury-grad)" strokeWidth="2.5" opacity="0.85" />

            {/* Inner Precision Hairline Circle (Radius = 490px) */}
            <circle cx="0" cy="0" r="490" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.4" />

            {/* 360° SMOOTH CLOCK PROGRESS ARC */}
            <path
              d={`M 0 -550 A 550 550 0 ${clockArcProgress > 180 ? 1 : 0} 1 ${Math.sin((clockArcProgress * Math.PI) / 180) * 550} ${-Math.cos((clockArcProgress * Math.PI) / 180) * 550}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Clock Arc Leading Gold Node */}
            <circle
              cx={Math.sin((clockArcProgress * Math.PI) / 180) * 550}
              cy={-Math.cos((clockArcProgress * Math.PI) / 180) * 550}
              r="6"
              fill="#FFFFFF"
              filter="url(#gold-glow)"
            />

            {/* 4 CARDINAL RHOMBUS DIAMOND NOTCHES (Top, Bottom, Left, Right) */}
            {[
              { x: 0, y: -550 },
              { x: 550, y: 0 },
              { x: 0, y: 550 },
              { x: -550, y: 0 },
            ].map((pt, idx) => (
              <g key={idx} transform={`translate(${pt.x}, ${pt.y}) scale(${pulseScale})`}>
                <polygon points="0,-10 10,0 0,10 -10,0" fill="url(#gold-luxury-grad)" />
                <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
              </g>
            ))}

            {/* Outer Corner Sub-Ticks (12 Clock Positions) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={Math.sin(rad) * 550}
                  y1={-Math.cos(rad) * 550}
                  x2={Math.sin(rad) * 572}
                  y2={-Math.cos(rad) * 572}
                  stroke={deg % 90 === 0 ? "#D4AF37" : "#FFFFFF"}
                  strokeWidth={deg % 90 === 0 ? "2.5" : "1.2"}
                  opacity={deg % 90 === 0 ? 0.9 : 0.45}
                />
              );
            })}
          </g>

          {/* LAYER C: VIGNETTE DARK SHADOW */}
          <rect x="0" y="0" width={width} height={height} fill="url(#lux-vignette)" pointerEvents="none" />
        </svg>

        {/* LAYER D: BIG ELEGANT LUXURY TYPOGRAPHY DISPLAY */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, calc(-50% + ${numberY}px))`,
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
                fontSize: '340px',
                fontWeight: 300,
                color: '#FFFFFF',
                letterSpacing: '-2px',
                lineHeight: 1,
                textShadow: '0 10px 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(212, 175, 55, 0.5)',
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
