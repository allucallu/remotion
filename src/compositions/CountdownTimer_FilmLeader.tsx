import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter Google Font
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerFilmLeaderProps {
  accentColor?: string; // e.g. Sepia Vintage Light #E5DCB6
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_FilmLeader
 * Niche: Classic Cinema Film Leader Countdown (35mm Celluloid Movie Header)
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Whiteout Burn Reel Tail & Cut to Black (150 - 165f)
 * - Large double-circle target (diameter ~1300px in 4K) & full-frame crosshairs.
 * - Stencil vintage typography centered in circle.
 * - Sepia film tint (#D4C89A) & monochrome celluloid palette.
 * - Film Textures: Dynamic flickering vertical hair scratches, falling dust particles, & vignetting.
 * - Projector Physics: Mechanical gate jitter (±1-2px), arc lamp flicker, 15-20° flash rotation before cut, & 1-frame film burn white flash transitions.
 */
export const CountdownTimer_FilmLeader: React.FC<CountdownTimerFilmLeaderProps> = ({
  accentColor = '#E5DCB6', // Warm Vintage Sepia Cream
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#0A0908';
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
  const isCutFrame = localFrame === 0 && frame > 0 && frame <= 150;
  const isPreCutPhase = localFrame >= 25 && frame < 150; // 0.16s before cut

  // --- FILM PROJECTOR PHYSICS & INSTABILITY MATH ---
  // 1. Mechanical Gate Jitter (±1.5px random vibration)
  const jitterX = Math.sin(frame * 7.3) * 1.6;
  const jitterY = Math.cos(frame * 8.7) * 1.4;

  // 2. Arc Lamp Light Flicker (Opacity 94% - 100%)
  const lampFlickerOpacity = 0.94 + (Math.sin(frame * 13.1) * 0.03 + Math.cos(frame * 19.3) * 0.03);

  // 3. Pre-Cut Flash Rotation (15° - 20° quick spin before number switch)
  const preCutSpin = isPreCutPhase
    ? interpolate(localFrame, [25, 29], [0, 18], { easing: Easing.bezier(0.8, 0, 1, 1) })
    : 0;

  // 4. 1-Frame Film Burn White Flash Transition (Frame 30, 60, 90, 120)
  const burnFlashOpacity = isCutFrame ? 0.92 : (localFrame === 1 ? 0.4 : 0);

  // 5. Final Whiteout Reel Tail Flash (Frame 150 - 156) & Cut to Black (Frame 157 - 165)
  const isEndPhase = frame >= 150;
  const whiteoutOpacity = isEndPhase
    ? interpolate(frame, [150, 154, 158], [1, 1, 0], { extrapolateRight: 'clamp' })
    : 0;

  const isTotalBlackout = frame >= 157;

  // --- FILM SCRATCHES & DUST PARTICLES SEED MATH ---
  // Dynamic Vertical Scratches (Random X shifts per frame)
  const scratchSeed = (frame * 17) % 100;
  const scratchX1 = 400 + ((scratchSeed * 37) % 3000);
  const scratchX2 = 800 + ((scratchSeed * 73) % 2400);
  const scratchX3 = 200 + ((scratchSeed * 91) % 3400);

  // Dust Particles Array (8 drifting particles)
  const dustParticles = [...Array(10)].map((_, i) => {
    const pSeed = (i * 43 + frame * 3) % 1000;
    const px = (i * 380 + pSeed * 2.7) % width;
    const py = ((i * 220 + frame * 9 + pSeed * 1.8) % (height + 200)) - 100;
    const pr = 1.5 + (i % 3) * 1.2;
    const pOp = 0.25 + (Math.sin(frame * 0.5 + i) * 0.15 + 0.15);
    return { px, py, pr, pOp };
  });

  // Clock Sweep Radar Arc Progress (360° sweep over 30 frames per number)
  const clockSweepAngle = (localFrame / framesPerNumber) * 360;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : lampFlickerOpacity,
      }}
    >
      {/* 1. SEPIA FILM TINT OVERLAY (#D4C89A at 14% opacity) */}
      <AbsoluteFill
        style={{
          backgroundColor: '#D4C89A',
          mixBlendMode: 'color',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN FILM LEADER CONTENT (Centered with Projector Jitter) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translate(${jitterX}px, ${jitterY}px)`,
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Vintage Sepia Cream Gradient */}
            <linearGradient id="sepia-cream-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5EED6" />
              <stop offset="50%" stopColor="#E5DCB6" />
              <stop offset="100%" stopColor="#C2B58A" />
            </linearGradient>

            {/* Dark Ink Stroke Filter */}
            <filter id="film-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.85" />
            </filter>

            {/* Vignette Radial Shadow */}
            <radialGradient id="vignette-grad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="60%" stopColor="#000000" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.88" />
            </radialGradient>
          </defs>

          {/* LAYER A: FULL-SCREEN TARGET CROSSHAIRS */}
          <g filter="url(#film-shadow)">
            {/* Horizontal Crosshair Line */}
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#1C1917" strokeWidth="9" />
            <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="url(#sepia-cream-grad)" strokeWidth="4" />

            {/* Vertical Crosshair Line */}
            <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#1C1917" strokeWidth="9" />
            <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="url(#sepia-cream-grad)" strokeWidth="4" />
          </g>

          {/* LAYER B: LARGE CENTER CIRCLE TARGET (Diameter ~1300px, 4K) */}
          <g
            transform={`translate(${width / 2}, ${height / 2}) rotate(${preCutSpin})`}
            filter="url(#film-shadow)"
          >
            {/* Outer Thick Target Circle (Radius = 650px) */}
            <circle cx="0" cy="0" r="650" fill="none" stroke="#1C1917" strokeWidth="18" />
            <circle cx="0" cy="0" r="650" fill="none" stroke="url(#sepia-cream-grad)" strokeWidth="8" />

            {/* Inner Concentric Target Circle (Radius = 520px) */}
            <circle cx="0" cy="0" r="520" fill="none" stroke="#1C1917" strokeWidth="10" />
            <circle cx="0" cy="0" r="520" fill="none" stroke="url(#sepia-cream-grad)" strokeWidth="4" strokeDasharray="16 12" />

            {/* 360° CLOCK RADAR SWEEP SECTOR (Vintage Film Leader Sweep) */}
            <path
              d={`M 0 0 L 0 -520 A 520 520 0 ${clockSweepAngle > 180 ? 1 : 0} 1 ${Math.sin((clockSweepAngle * Math.PI) / 180) * 520} ${-Math.cos((clockSweepAngle * Math.PI) / 180) * 520} Z`}
              fill="url(#sepia-cream-grad)"
              opacity="0.16"
            />

            {/* Radar Sweep Leading Hairline */}
            <line
              x1="0"
              y1="0"
              x2={Math.sin((clockSweepAngle * Math.PI) / 180) * 520}
              y2={-Math.cos((clockSweepAngle * Math.PI) / 180) * 520}
              stroke="url(#sepia-cream-grad)"
              strokeWidth="4"
              opacity="0.75"
            />

            {/* Corner Alignment Ticks at 45°, 135°, 225°, 315° */}
            {[45, 135, 225, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <line
                  key={deg}
                  x1={Math.sin(rad) * 650}
                  y1={-Math.cos(rad) * 650}
                  x2={Math.sin(rad) * 690}
                  y2={-Math.cos(rad) * 690}
                  stroke="url(#sepia-cream-grad)"
                  strokeWidth="6"
                />
              );
            })}
          </g>

          {/* LAYER C: FLICKERING VERTICAL CELLULOID SCRATCHES */}
          <g opacity="0.35">
            <line x1={scratchX1} y1="0" x2={scratchX1 + 4} y2={height} stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1={scratchX2} y1="0" x2={scratchX2 - 3} y2={height} stroke="#000000" strokeWidth="2.0" />
            <line x1={scratchX3} y1="0" x2={scratchX3 + 2} y2={height} stroke="#E5DCB6" strokeWidth="1.2" />
          </g>

          {/* LAYER D: FALLING DUST & DIRT PARTICLES */}
          <g>
            {dustParticles.map((p, idx) => (
              <circle
                key={idx}
                cx={p.px}
                cy={p.py}
                r={p.pr}
                fill={idx % 2 === 0 ? "#E5DCB6" : "#1C1917"}
                opacity={p.pOp}
              />
            ))}
          </g>

          {/* LAYER E: VIGNETTE DARK CORNERS */}
          <rect x="0" y="0" width={width} height={height} fill="url(#vignette-grad)" pointerEvents="none" />
        </svg>

        {/* LAYER F: BIG CENTER STENCIL NUMBER DISPLAY */}
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
              width: '600px',
              height: '600px',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '360px',
                fontWeight: 900,
                color: '#E5DCB6',
                fontFamily: 'Courier New, monospace, sans-serif',
                lineHeight: 1,
                textShadow: '0 12px 28px rgba(0, 0, 0, 0.95), 0 0 20px rgba(229, 220, 182, 0.4)',
                letterSpacing: '-10px',
                transform: `rotate(${preCutSpin * 0.3}deg)`,
              }}
            >
              {currentDisplayNumber}
            </span>
          </div>
        )}
      </div>

      {/* 3. 1-FRAME FILM BURN WHITE FLASH TRANSITION OVERLAY */}
      {burnFlashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#FFFBEA',
            opacity: burnFlashOpacity,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 4. FINAL WHITEOUT REEL TAIL FLASH OVERLAY (Frame 150 - 156) */}
      {whiteoutOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#FFFFFF',
            opacity: whiteoutOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
