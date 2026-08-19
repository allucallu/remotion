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
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerShatterGridProps {
  neonCyan?: string; // Electric Cyan #00F0FF
  neonMagenta?: string; // Hot Neon Magenta #FF00E5
  neonYellow?: string; // Cyber Yellow #FFE600
  backgroundColor?: LowerThirdBg;
}

/**
 * Refined & Perfectly Structured Digit Bitmap Matrices (12 cols x 12 rows)
 * Clean, bold, instantly recognizable geometric silhouettes for Digits 5, 4, 3, 2, 1.
 */
const DIGIT_PATTERNS: Record<number, number[][]> = {
  5: [
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,0,0],
  ],
  4: [
    [1,1,1,0,0,0,0,1,1,1,0,0],
    [1,1,1,0,0,0,0,1,1,1,0,0],
    [1,1,1,0,0,0,0,1,1,1,0,0],
    [1,1,1,0,0,0,0,1,1,1,0,0],
    [1,1,1,0,0,0,0,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0],
  ],
  3: [
    [1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,1,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,0,0],
  ],
  2: [
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,1,1],
    [0,0,0,0,0,0,0,1,1,1,1,0],
    [0,0,0,0,0,0,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0],
    [0,0,1,1,1,1,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  1: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,0,1,1,1,0,0,0,0],
    [0,1,1,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,1,0],
  ],
};

/**
 * Composition: CountdownTimer_ShatterGrid (Percussive Glitch-Art Fragment Shatter & Assembly)
 * Niche: Cyberpunk Glitch Art, Electro Percussive Motion, EDM Concert Visuals, High-Energy Launch.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Climax Explosion, Neon Strobe Flash & HARD CUT Exit (150 - 165f)
 * - Pure Obsidian Black Background (#000000).
 * - Random Triad Neon Color Palette: Electric Cyan (#00F0FF), Hot Magenta (#FF00E5), Cyber Yellow (#FFE600).
 * - REFINED DIGIT MATRICES for Numbers 2 and 1 (Bold, crisp, perfectly centered).
 * - 12x12 Fragment Grid Matrix (~144 geometric tiles) with 3D bevel depth shadows.
 * - Percussive Snappy Motion Physics (`Easing.bezier(0.05, 0.95, 0.05, 1.0)`).
 * - Overlapping Shatter Out & Assembly In (Zero gap, continuous percussive kinetic energy).
 * - Climax Fragment Burst + 0.15s Neon Strobe Flash + HARD CUT Blackout exit.
 */
export const CountdownTimer_ShatterGrid: React.FC<CountdownTimerShatterGridProps> = ({
  neonCyan = '#00F0FF', // Electric Cyan
  neonMagenta = '#FF00E5', // Hot Magenta
  neonYellow = '#FFE600', // Cyber Yellow
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

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
  // Assembly: 0 -> 8f (~0.25s) | Hold: 8 -> 18f (~0.35s) | Shatter Swap: 18 -> 30f (~0.4s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];
  const nextNumber = numberSequence[Math.min(4, currentStepIndex + 1)];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const assemblyDuration = 8; // 0 to 8f
  const swapStartFrame = 18;
  const swapDuration = 12; // 18 to 30f

  // Assembly Progress (0 to 1) for current digit
  const assemblyProgress = interpolate(
    localFrame,
    [0, assemblyDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.05, 0.95, 0.05, 1),
    }
  );

  // Shatter-Out Progress (0 to 1) for current digit
  const shatterProgress = interpolate(
    localFrame,
    [swapStartFrame, swapStartFrame + swapDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.7, 0, 0.9, 0.3),
    }
  );

  const isShattering = shatterProgress > 0;

  // Assembly-In Progress (0 to 1) for next overlapping digit
  const nextAssemblyProgress = isShattering
    ? interpolate(localFrame, [swapStartFrame + 3, swapStartFrame + swapDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.05, 0.95, 0.05, 1),
      })
    : 0;

  // --- CLIMAX EXIT PHASE: EXPLOSION + NEON STROBE FLASH + HARD CUT (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const isHardCutBlackout = frame >= 157; // HARD CUT Blackout at frame 157

  // 3-Frame Neon Color Strobe Flash (Frame 152 to 156)
  const isStrobePhase = frame >= 152 && frame < 157;
  const strobeColor = isStrobePhase
    ? [neonCyan, neonMagenta, neonYellow, '#FFFFFF'][frame % 4]
    : 'transparent';

  const climaxExplodeProgress = isEndPhase
    ? interpolate(frame, [150, 156], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.85, 0, 1, 0.2),
      })
    : 0;

  // Neon Color Selector Palette
  const neonColors = [neonCyan, neonMagenta, neonYellow];

  // Helper renderer for a 12x12 Fragment Grid Digit
  const renderFragmentDigitGrid = (
    num: number,
    progress: number,
    mode: 'assembly' | 'shatter',
    extraScale: number = 1
  ) => {
    const pattern = DIGIT_PATTERNS[num] || DIGIT_PATTERNS[5];
    const gridCols = 12;
    const gridRows = 12;
    const tileWidth = 60;
    const tileHeight = 65;
    const startX = (width - gridCols * tileWidth) / 2;
    const startY = (height - gridRows * tileHeight) / 2;

    const tiles: React.JSX.Element[] = [];

    pattern.forEach((row, r) => {
      row.forEach((active, c) => {
        if (!active) return;

        const tileKey = `${num}-${r}-${c}`;
        const seed = (r * 12 + c + num * 37) % 100;
        const color = neonColors[(r + c + num) % neonColors.length];

        // Random Flying Trajectories (kiri, kanan, atas, bawah, diagonal)
        const flyAngle = (seed / 100) * Math.PI * 2;
        const flyDist = 1800 + (seed % 50) * 20;

        const offX = Math.cos(flyAngle) * flyDist;
        const offY = Math.sin(flyAngle) * flyDist;

        let curX = 0;
        let curY = 0;
        let curRot = 0;
        let curScale = 1;
        let blurVal = 0;

        if (mode === 'assembly') {
          // Inward Percussive Fly-In
          curX = (1 - progress) * offX;
          curY = (1 - progress) * offY;
          curRot = (1 - progress) * ((seed % 2 === 0 ? 1 : -1) * 180);
          curScale = interpolate(progress, [0, 1], [0.3, 1]);
          blurVal = (1 - progress) * 12;
        } else {
          // Outward Percussive Shatter-Out
          curX = progress * offX;
          curY = progress * offY;
          curRot = progress * ((seed % 2 === 0 ? 1 : -1) * 360);
          curScale = interpolate(progress, [0, 1], [1, 0.2]);
          blurVal = progress * 14;
        }

        // Apply Climax Explosion Scale
        if (isEndPhase) {
          curX = climaxExplodeProgress * offX * 1.8;
          curY = climaxExplodeProgress * offY * 1.8;
          curRot = climaxExplodeProgress * 480;
          blurVal = climaxExplodeProgress * 20;
        }

        const posX = startX + c * tileWidth;
        const posY = startY + r * tileHeight;

        tiles.push(
          <div
            key={tileKey}
            style={{
              position: 'absolute',
              top: posY,
              left: posX,
              width: `${tileWidth - 4}px`,
              height: `${tileHeight - 4}px`,
              backgroundColor: color,
              borderRadius: seed % 3 === 0 ? '4px' : '0px',
              boxShadow: `0 6px 18px rgba(0,0,0,0.85), inset 0 0 10px rgba(255,255,255,0.6), 0 0 15px ${color}80`,
              transform: `translate(${curX}px, ${curY}px) rotate(${curRot}deg) scale(${curScale * extraScale})`,
              filter: blurVal > 1 ? `blur(${blurVal}px)` : 'none',
              clipPath: seed % 4 === 0 ? 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' : 'none', // Geometric cutout variation
              pointerEvents: 'none',
            }}
          />
        );
      });
    });

    return tiles;
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isHardCutBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* 1. NEON STROBE FLASH OVERLAY ON CLIMAX (Frame 152 to 156) */}
      {isStrobePhase && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: strobeColor,
            mixBlendMode: 'screen',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 2. MAIN GEOMETRIC SHATTER GRID FRAGMENT CONTAINER */}
      {!isHardCutBlackout && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {/* CURRENT DIGIT (Assembly In / Shatter Out) */}
          {!isShattering && renderFragmentDigitGrid(currentNumber, assemblyProgress, 'assembly')}
          {isShattering && renderFragmentDigitGrid(currentNumber, shatterProgress, 'shatter')}

          {/* NEXT OVERLAPPING DIGIT (Assembly In simultaneously during Shatter Out) */}
          {isShattering && !isEndPhase && (
            renderFragmentDigitGrid(nextNumber, nextAssemblyProgress, 'assembly')
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
