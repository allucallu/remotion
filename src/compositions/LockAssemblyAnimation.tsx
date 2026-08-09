import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LockAssemblyAnimationProps {
  accentColor?: string;
  particleCount?: number;
  lockShapeSize?: number;
}

export interface LockTargetPoint {
  x: number;
  y: number;
  isShackle: boolean;
}

export interface AssemblyParticle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  isShackle: boolean;
  delay: number;
  duration: number;
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Generate 60 High-Precision Padlock Target Points (Perfect Proportions)
function generatePadlockTargetPoints(cx: number, cy: number): LockTargetPoint[] {
  const points: LockTargetPoint[] = [];

  // 1. Shackle Arch & Legs (24 Points)
  const shackleRadius = 160;
  const shackleCenterY = cy - 140; // 940

  // Shackle Top Semi-Circle Arch (16 Points)
  for (let i = 0; i <= 15; i++) {
    const angleRad = (Math.PI * i) / 15;
    const x = cx + shackleRadius * Math.cos(Math.PI + angleRad);
    const y = shackleCenterY - shackleRadius * Math.sin(angleRad);
    points.push({ x, y, isShackle: true });
  }

  // Shackle Vertical Legs (8 Points)
  for (let i = 1; i <= 4; i++) {
    points.push({ x: cx - shackleRadius, y: shackleCenterY + i * 28, isShackle: true });
    points.push({ x: cx + shackleRadius, y: shackleCenterY + i * 28, isShackle: true });
  }

  // 2. Main Padlock Body (36 Points)
  const bodyW = 500;
  const bodyH = 380;
  const minX = cx - bodyW / 2; // 1670
  const maxX = cx + bodyW / 2; // 2170
  const minY = cy - 20;       // 1060
  const maxY = cy + 360;      // 1440

  // Top Body Edge (9 pts)
  for (let i = 0; i < 9; i++) {
    points.push({ x: minX + (i * bodyW) / 8, y: minY, isShackle: false });
  }
  // Right Body Edge (9 pts)
  for (let i = 1; i <= 9; i++) {
    points.push({ x: maxX, y: minY + (i * bodyH) / 9, isShackle: false });
  }
  // Bottom Body Edge (9 pts)
  for (let i = 1; i <= 9; i++) {
    points.push({ x: maxX - (i * bodyW) / 9, y: maxY, isShackle: false });
  }
  // Left Body Edge (9 pts)
  for (let i = 1; i < 9; i++) {
    points.push({ x: minX, y: maxY - (i * bodyH) / 9, isShackle: false });
  }

  return points;
}

export const LockAssemblyAnimation: React.FC<LockAssemblyAnimationProps> = ({
  accentColor = '#22D3EE',
  particleCount = 60,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  // 1. Generate Target Points & Particles
  const { particles } = React.useMemo(() => {
    const targets = generatePadlockTargetPoints(centerX, centerY).slice(0, particleCount);
    const particleList: AssemblyParticle[] = targets.map((target, idx) => {
      const spawnAngle = pseudoRandom(idx * 7) * Math.PI * 2;
      const spawnDist = 950 + pseudoRandom(idx * 13) * 550;
      const startX = centerX + spawnDist * Math.cos(spawnAngle);
      const startY = centerY + spawnDist * Math.sin(spawnAngle);

      const delay = Math.floor(pseudoRandom(idx * 17) * 50); // 0-50 frames staggered delay
      const duration = 48 + Math.floor(pseudoRandom(idx * 23) * 20); // 48-68 frames transit duration

      return {
        id: idx,
        startX,
        startY,
        targetX: target.x,
        targetY: target.y,
        isShackle: target.isShackle,
        delay,
        duration,
      };
    });

    return { particles: particleList };
  }, [centerX, centerY, particleCount]);

  // 2. Mechanical Lock Click Moment (Frame 160-190)
  const isLockClicked = frame >= 160;
  const clickFrame = Math.max(0, frame - 160);

  // Shackle translateY offset (0 -> 22px downward mechanical click)
  const shackleClickY = isLockClicked
    ? interpolate(clickFrame, [0, 8, 14], [0, 26, 22], {
        easing: Easing.out(Easing.quad),
        extrapolateRight: 'clamp',
      })
    : 0;

  // Flash Burst White Opacity at Frame 160
  const flashWhiteOpacity = isLockClicked
    ? interpolate(clickFrame, [0, 4, 10], [1.0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

  // Expanding Cyan/White Ring Pulse at Frame 160
  const clickRingScale = isLockClicked
    ? interpolate(clickFrame, [0, 30], [0, 2.2], { extrapolateRight: 'clamp' })
    : 0;
  const clickRingOpacity = isLockClicked
    ? interpolate(clickFrame, [0, 30], [0.75, 0], { extrapolateRight: 'clamp' })
    : 0;

  // 3. Keyhole Fade & Scale In (Frame 140-160)
  const keyholeScale = frame >= 140
    ? interpolate(frame - 140, [0, 15], [0, 1.0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;

  // 4. Final Idle Breathing Pulse (Frame 190+)
  const idleBreathCycle = frame >= 190 ? ((frame - 190) % 40) / 40 : 0;
  const idleBreathOpacity = frame >= 190 ? 0.85 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.15 : 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000', // CRITICAL: Solid black background for Screen/Add additive blend mode
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* SVG Filters for Glow Effects */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="lockGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lockMegaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* MAIN PADLOCK ASSEMBLY SVG CONTAINER */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* INNER INSET ACCENT OUTLINE FOR EXTRA VISUAL DEPTH (Frame 140+) */}
        {frame >= 140 && (
          <g style={{ opacity: idleBreathOpacity * 0.6 }}>
            {/* Inner Body Inset Border */}
            <rect
              x={centerX - 220}
              y={centerY + 10}
              width={440}
              height={320}
              rx="20"
              fill="none"
              stroke="#164E56"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </g>
        )}

        {/* LAYER 1: PARTICLES IN TRANSIT & SETTLED OUTLINE PARTICLES */}
        {particles.map((p) => {
          const spawnOpacity = interpolate(frame, [0, 15], [0, 0.4], { extrapolateRight: 'clamp' });
          const transitStart = 15 + p.delay;
          const transitEnd = transitStart + p.duration;

          const rawProgress = interpolate(frame - transitStart, [0, p.duration], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.cubic),
          });

          const isTransitStarted = frame >= transitStart;
          const isSettled = frame >= transitEnd;

          // Target Position with Shackle Click translateY offset
          const effectiveTargetY = p.isShackle ? p.targetY + shackleClickY : p.targetY;

          // Current Particle Coordinates
          const curX = isSettled ? p.targetX : isTransitStarted ? p.startX + rawProgress * (p.targetX - p.startX) : p.startX;
          const curY = isSettled ? effectiveTargetY : isTransitStarted ? p.startY + rawProgress * (effectiveTargetY - p.startY) : p.startY;

          // Micro-Flash on Settle
          const settleAge = isSettled ? Math.max(0, frame - transitEnd) : -1;
          const isSettleFlashing = settleAge >= 0 && settleAge <= 8;
          const settleFlashScale = isSettleFlashing ? interpolate(settleAge, [0, 4, 8], [1.0, 1.45, 1.0]) : 1.0;

          // Styling
          let particleOpacity = isSettled ? 1.0 : isTransitStarted ? 0.4 + rawProgress * 0.6 : spawnOpacity;
          particleOpacity *= idleBreathOpacity;

          let particleColor = isSettled ? accentColor : interpolateColors(rawProgress, [0, 0.7, 1], ['#1E3A5F', accentColor, '#FFFFFF']);
          let particleRadius = isSettled ? 6.0 : 4.2;

          if (isSettleFlashing) {
            particleColor = '#FFFFFF';
          }
          if (flashWhiteOpacity > 0) {
            particleColor = '#FFFFFF';
            particleOpacity = 1.0;
          }

          return (
            <g key={`particle-${p.id}`}>
              {/* Motion Trail Dots */}
              {isTransitStarted && !isSettled && (
                <g>
                  {Array.from({ length: 4 }).map((_, tIdx) => {
                    const tailT = Math.max(0, rawProgress - (tIdx * 0.04));
                    const tailX = p.startX + tailT * (p.targetX - p.startX);
                    const tailY = p.startY + tailT * (effectiveTargetY - p.startY);

                    const tailOpacity = (1 - tIdx / 4) * 0.45;

                    return (
                      <circle
                        key={`trail-${tIdx}`}
                        cx={tailX}
                        cy={tailY}
                        r={particleRadius * (1 - tIdx / 5)}
                        fill={accentColor}
                        opacity={tailOpacity}
                      />
                    );
                  })}
                </g>
              )}

              {/* Soft Glow Layer for Settled Outline Particles */}
              {isSettled && (
                <circle
                  cx={curX}
                  cy={curY}
                  r={(particleRadius + 4) * settleFlashScale}
                  fill={particleColor}
                  opacity={particleOpacity * 0.55}
                  filter="url(#lockGlow)"
                />
              )}

              {/* Core Solid Particle Point */}
              <circle
                cx={curX}
                cy={curY}
                r={particleRadius * settleFlashScale}
                fill={particleColor}
                opacity={particleOpacity}
              />
            </g>
          );
        })}

        {/* LAYER 2: CENTRAL KEYHOLE ICON (Frame 140+) */}
        {keyholeScale > 0 && (
          <g style={{ transform: `translate(${centerX}px, ${centerY + 170}px) scale(${keyholeScale})`, transformOrigin: `${centerX}px ${centerY + 170}px` }}>
            {/* Keyhole Glow Outer Aura */}
            <path
              d="M 0 -22 A 24 24 0 1 1 0 26 L -16 58 L 16 58 Z"
              fill="#FFFFFF"
              opacity={0.35}
              filter="url(#lockGlow)"
            />

            {/* Solid Keyhole Shape */}
            <path
              d="M 0 -22 A 20 20 0 1 1 0 20 L -14 52 L 14 52 Z"
              fill={flashWhiteOpacity > 0 ? '#FFFFFF' : accentColor}
              style={{ filter: `drop-shadow(0 0 14px ${accentColor})` }}
            />
          </g>
        )}

        {/* LAYER 3: MECHANICAL LOCK CLICK EXPANDING RING (Frame 160+) */}
        {isLockClicked && clickRingOpacity > 0 && (
          <circle
            cx={centerX}
            cy={centerY + 140}
            r={260 * clickRingScale}
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
            opacity={clickRingOpacity}
            filter="url(#lockMegaGlow)"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
