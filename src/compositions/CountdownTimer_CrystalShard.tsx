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

export interface CountdownTimerCrystalShardProps {
  neonUltraviolet?: string; // Electric Ultraviolet #9D00FF
  neonMint?: string; // Laser Mint Green #00FF9D
  neonPink?: string; // Bright Neon Pink #FF007F
  backgroundColor?: LowerThirdBg;
}

/**
 * Digit Bitmap Matrices (12 cols x 12 rows) for Digits 5, 4, 3, 2, 1.
 * 1 = Active Hexagonal/Diamond Crystal Shard, 0 = Empty Space.
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
 * Composition: CountdownTimer_CrystalShard (Vortex Hexagonal & Diamond Crystal Shard Shatter)
 * Niche: Cyberpunk Crystal Art, Vortex Kinetic Motion, Futuristic Luxury Launch, Electronic Concert Visuals.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Crystal Supernova Burst, Neon Strobe Flash & HARD CUT Exit (150 - 165f)
 * - Pure Obsidian Black Background (#000000).
 * - HEXAGONAL & DIAMOND CRYSTAL PRISM GEOMETRY (`clipPath: polygon(...)`).
 * - Neon Color Triad: Electric Ultraviolet (#9D00FF), Laser Mint Green (#00FF9D), Bright Neon Pink (#FF007F).
 * - Vortex Spiral Rotational Assembly (`rotate: 720deg -> 0deg`).
 * - Overlapping Shatter Out & Assembly In (Zero gap, continuous percussive kinetic energy).
 * - Climax Crystal Supernova Burst + 0.15s Neon Strobe Flash + HARD CUT Blackout exit.
 */
export const CountdownTimer_CrystalShard: React.FC<CountdownTimerCrystalShardProps> = ({
  neonUltraviolet = '#9D00FF', // Electric Ultraviolet
  neonMint = '#00FF9D', // Laser Mint Green
  neonPink = '#FF007F', // Bright Neon Pink
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
      easing: Easing.bezier(0.1, 0.9, 0.2, 1),
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
        easing: Easing.bezier(0.1, 0.9, 0.2, 1),
      })
    : 0;

  // --- CLIMAX EXIT PHASE: CRYSTAL SUPERNOVA + NEON STROBE FLASH + HARD CUT (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const isHardCutBlackout = frame >= 157; // HARD CUT Blackout at frame 157

  // 3-Frame Neon Color Strobe Flash (Frame 152 to 156)
  const isStrobePhase = frame >= 152 && frame < 157;
  const strobeColor = isStrobePhase
    ? [neonMint, neonUltraviolet, neonPink, '#FFFFFF'][frame % 4]
    : 'transparent';

  const climaxExplodeProgress = isEndPhase
    ? interpolate(frame, [150, 156], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.85, 0, 1, 0.2),
      })
    : 0;

  // Neon Color Selector Palette
  const neonColors = [neonMint, neonUltraviolet, neonPink];

  // Helper renderer for a 12x12 Hexagonal & Diamond Crystal Shard Digit Grid
  const renderCrystalDigitGrid = (
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
        const seed = (r * 12 + c + num * 43) % 100;
        const color = neonColors[(r * 2 + c + num) % neonColors.length];

        // Hexagonal Honeycomb vs Diamond Shard Geometry ClipPath
        const isHexagon = (r + c) % 2 === 0;
        const clipPathStyle = isHexagon
          ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' // 6-Sided Hexagon
          : 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'; // 4-Sided Diamond Shard

        // Vortex Spiral Flying Trajectories
        const spiralAngle = (seed / 100) * Math.PI * 2 + (1 - progress) * Math.PI * 4;
        const flyDist = 1900 + (seed % 40) * 25;

        const offX = Math.cos(spiralAngle) * flyDist;
        const offY = Math.sin(spiralAngle) * flyDist;

        let curX = 0;
        let curY = 0;
        let curRot = 0;
        let curScale = 1;
        let blurVal = 0;

        if (mode === 'assembly') {
          // Vortex Spiral Fly-In
          curX = (1 - progress) * offX;
          curY = (1 - progress) * offY;
          curRot = (1 - progress) * 720 * (seed % 2 === 0 ? 1 : -1);
          curScale = interpolate(progress, [0, 1], [0.1, 1]);
          blurVal = (1 - progress) * 10;
        } else {
          // Outward Percussive Crystal Shatter-Out
          curX = progress * offX;
          curY = progress * offY;
          curRot = progress * 1080 * (seed % 2 === 0 ? 1 : -1);
          curScale = interpolate(progress, [0, 1], [1, 0.1]);
          blurVal = progress * 14;
        }

        // Apply Climax Explosion Scale
        if (isEndPhase) {
          curX = climaxExplodeProgress * offX * 2.0;
          curY = climaxExplodeProgress * offY * 2.0;
          curRot = climaxExplodeProgress * 1200;
          blurVal = climaxExplodeProgress * 22;
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
              width: `${tileWidth - 2}px`,
              height: `${tileHeight - 2}px`,
              background: `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.8) 50%, ${color} 100%)`,
              clipPath: clipPathStyle,
              boxShadow: `0 8px 24px rgba(0,0,0,0.9), 0 0 20px ${color}`,
              transform: `translate(${curX}px, ${curY}px) rotate(${curRot}deg) scale(${curScale * extraScale})`,
              filter: blurVal > 1 ? `blur(${blurVal}px)` : 'none',
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
      {/* 1. AMBIENT CRYSTAL ULTRAVIOLET GLOW BACKDROP */}
      {!isHardCutBlackout && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1600px',
            height: '1600px',
            background: `radial-gradient(circle at center, ${neonUltraviolet}25 0%, ${neonMint}15 50%, transparent 70%)`,
            filter: 'blur(95px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* 2. NEON STROBE FLASH OVERLAY ON CLIMAX (Frame 152 to 156) */}
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

      {/* 3. MAIN HEXAGONAL & DIAMOND CRYSTAL SHARD CONTAINER */}
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
          {!isShattering && renderCrystalDigitGrid(currentNumber, assemblyProgress, 'assembly')}
          {isShattering && renderCrystalDigitGrid(currentNumber, shatterProgress, 'shatter')}

          {/* NEXT OVERLAPPING DIGIT (Assembly In simultaneously during Shatter Out) */}
          {isShattering && !isEndPhase && (
            renderCrystalDigitGrid(nextNumber, nextAssemblyProgress, 'assembly')
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
