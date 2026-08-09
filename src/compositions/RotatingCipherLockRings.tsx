import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface RotatingCipherLockRingsProps {
  ringCount?: number;
  accentColor?: string;
  segmentPerRing?: number;
  lockState?: 'locking' | 'unlocking';
}

// SVG Arc Calculation Helper Functions
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

// Normalize angle to 0 - 360 range
function normalizeAngle(angle: number) {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

// Distance between two angles in degrees (-180 to 180)
function getAngleDistance(a1: number, a2: number) {
  let diff = normalizeAngle(a1) - normalizeAngle(a2);
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return Math.abs(diff);
}

export const RotatingCipherLockRings: React.FC<RotatingCipherLockRingsProps> = ({
  ringCount = 4,
  accentColor = '#22D3EE',
  segmentPerRing = 16,
  lockState = 'locking',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  // 4 Concentric Extra Large 4K Ring Radii
  const ringRadii = [780, 610, 440, 270].slice(0, ringCount);

  // Target Rotations for 4 Rings (in turns)
  const ringRotationsTurn = [1.5, -2.25, 3.0, -1.75];

  // 1. Idle Pulse for Center Core Vault Engine
  const idlePulseFrame = frame % 45;
  const centerIdleScale = interpolate(idlePulseFrame, [0, 22.5, 45], [1.0, 1.08, 1.0]);

  // 2. Climax Moment Logic (Frame 220-260)
  const isClimaxHit = frame >= 220;
  const climaxFrame = Math.max(0, frame - 220);

  // Center Node Burst Flash
  const centerBurstScale = isClimaxHit
    ? interpolate(climaxFrame, [0, 7, 15], [1.0, 2.2, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;
  const centerBurstOpacity = isClimaxHit
    ? interpolate(climaxFrame, [0, 7, 15], [1.0, 0.3, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  // Multi-Layer Ripple Wave Bursts
  const ripple1Scale = isClimaxHit ? interpolate(climaxFrame, [0, 30], [0, 2.8], { extrapolateRight: 'clamp' }) : 0;
  const ripple1Opacity = isClimaxHit ? interpolate(climaxFrame, [0, 30], [0.8, 0], { extrapolateRight: 'clamp' }) : 0;

  const ripple2Scale = isClimaxHit ? interpolate(climaxFrame, [6, 36], [0, 2.8], { extrapolateRight: 'clamp' }) : 0;
  const ripple2Opacity = isClimaxHit ? interpolate(climaxFrame, [6, 36], [0.7, 0], { extrapolateRight: 'clamp' }) : 0;

  // All Markers Bright White Flash
  const markerFlashOpacity = isClimaxHit
    ? interpolate(climaxFrame, [0, 5, 12], [0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

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
      {/* SVG Filters for High-Energy Glow Effects */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="ringSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* MAIN CONCENTRIC CIPHER RINGS CONTAINER */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Outer 360° Compass Degree Ticks Ring */}
        <circle cx={centerX} cy={centerY} r={820} stroke="#164E56" strokeWidth="1.5" strokeDasharray="3 9" opacity={0.45} />

        {/* Vertical Alignment Guide Line */}
        <line
          x1={centerX}
          y1={centerY - 810}
          x2={centerX}
          y2={centerY + 810}
          stroke="#164E56"
          strokeWidth="1.8"
          strokeDasharray="8 8"
          opacity={0.5}
        />

        {ringRadii.map((radius, rIdx) => {
          const entranceStart = rIdx * 8;
          const entranceSpring = spring({
            frame: Math.max(0, frame - entranceStart),
            fps,
            config: { damping: 18, stiffness: 180 },
          });

          const ringScale = interpolate(entranceSpring, [0, 1], [0.9, 1.0]);
          const ringEntranceOpacity = interpolate(frame - entranceStart, [0, 15], [0, 1.0], {
            extrapolateRight: 'clamp',
          });

          let currentRotationDeg = 0;

          if (frame < 30) {
            currentRotationDeg = 0;
          } else if (frame <= 220) {
            const totalTargetDeg = ringRotationsTurn[rIdx] * 360;
            currentRotationDeg = interpolate(frame, [30, 220], [0, totalTargetDeg], {
              easing: Easing.out(Easing.cubic),
            });
          } else {
            const totalTargetDeg = ringRotationsTurn[rIdx] * 360;
            if (lockState === 'locking') {
              currentRotationDeg = totalTargetDeg;
            } else {
              const postSpin = (rIdx % 2 === 0 ? 1 : -1) * 90;
              currentRotationDeg = totalTargetDeg + interpolate(frame, [220, 290], [0, postSpin], {
                easing: Easing.out(Easing.cubic),
                extrapolateRight: 'clamp',
              });
            }
          }

          const segCount = segmentPerRing;
          const totalAnglePerSeg = 360 / segCount;
          const gapAngle = 3.5;
          const segArcLength = totalAnglePerSeg - gapAngle;

          const baseStrokeWidth = rIdx === 0 ? 18 : rIdx === 1 ? 14 : rIdx === 2 ? 11 : 8;

          return (
            <g
              key={`ring-${rIdx}`}
              style={{
                transform: `scale(${ringScale})`,
                transformOrigin: `${centerX}px ${centerY}px`,
                opacity: ringEntranceOpacity,
              }}
            >
              {/* Thin Guide Rail Base Circle Line */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#164E56"
                strokeWidth="1.5"
                fill="none"
                opacity={0.4}
              />

              {/* Ring Arc Segments */}
              {Array.from({ length: segCount }).map((_, sIdx) => {
                const isMarker = sIdx === 0;
                const localStartAngle = sIdx * totalAnglePerSeg + gapAngle / 2;
                const localEndAngle = localStartAngle + segArcLength;

                const segCenterLocalAngle = localStartAngle + segArcLength / 2;
                const segCenterWorldAngle = normalizeAngle(segCenterLocalAngle + currentRotationDeg);

                const distToTop = getAngleDistance(segCenterWorldAngle, 0);
                const gaussianHighlight = Math.exp(-Math.pow(distToTop, 2) / (2 * Math.pow(22, 2)));

                let segOpacity = 0.22 + gaussianHighlight * 0.78;
                let segColor = interpolateColors(gaussianHighlight, [0, 1], ['#0E3A42', accentColor]);

                if (isClimaxHit) {
                  if (isMarker) {
                    segOpacity = 1.0;
                    segColor = '#FFFFFF';
                  } else {
                    segOpacity = 0.4 + gaussianHighlight * 0.6;
                  }
                }

                const arcPathD = describeArc(centerX, centerY, radius, localStartAngle, localEndAngle);
                const strokeWidth = isMarker ? baseStrokeWidth + 6 : baseStrokeWidth;

                return (
                  <g key={`ring-${rIdx}-seg-${sIdx}`} style={{ transform: `rotate(${currentRotationDeg}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}>
                    {/* Soft Blurred Glow Layer */}
                    <path
                      d={arcPathD}
                      fill="none"
                      stroke={isMarker ? '#ECFEFF' : segColor}
                      strokeWidth={strokeWidth + 6}
                      strokeLinecap="round"
                      opacity={segOpacity * 0.65}
                      filter="url(#ringSoftGlow)"
                    />
                    {/* Sharp Core Arc Segment */}
                    <path
                      d={arcPathD}
                      fill="none"
                      stroke={isMarker ? '#FFFFFF' : (gaussianHighlight > 0.7 ? '#ECFEFF' : segColor)}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      opacity={segOpacity}
                    />

                    {/* Marker Pointer Tick Indicator on Marker Segment */}
                    {isMarker && (
                      <circle
                        cx={polarToCartesian(centerX, centerY, radius + baseStrokeWidth + 12, segCenterLocalAngle).x}
                        cy={polarToCartesian(centerX, centerY, radius + baseStrokeWidth + 12, segCenterLocalAngle).y}
                        r={rIdx === 0 ? 8 : 6}
                        fill="#FFFFFF"
                        style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* LAYER 3: CLIMAX MULTI-LAYER RIPPLE WAVE BURSTS */}
        {isClimaxHit && ripple1Opacity > 0 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={300 * ripple1Scale}
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
            opacity={ripple1Opacity}
            filter="url(#ringSoftGlow)"
          />
        )}

        {isClimaxHit && ripple2Opacity > 0 && (
          <circle
            cx={centerX}
            cy={centerY}
            r={300 * ripple2Scale}
            stroke={accentColor}
            strokeWidth="3"
            fill="none"
            opacity={ripple2Opacity}
            filter="url(#ringSoftGlow)"
          />
        )}

        {/* LAYER 4: CENTER VAULT ENGINE CORE */}
        <g style={{ transform: `scale(${centerIdleScale * centerBurstScale})`, transformOrigin: `${centerX}px ${centerY}px` }}>
          <circle
            cx={centerX}
            cy={centerY}
            r={60}
            fill={accentColor}
            opacity={centerBurstOpacity * 0.45}
            filter="url(#ringSoftGlow)"
          />

          <circle
            cx={centerX}
            cy={centerY}
            r={38}
            stroke="#A5F3FC"
            strokeWidth="3"
            strokeDasharray="8 6"
            fill="none"
            opacity={centerBurstOpacity}
            style={{ transform: `rotate(${frame * 2}deg)`, transformOrigin: `${centerX}px ${centerY}px` }}
          />

          <circle
            cx={centerX}
            cy={centerY}
            r={24}
            fill="#FFFFFF"
            opacity={centerBurstOpacity}
            style={{ filter: `drop-shadow(0 0 18px ${accentColor})` }}
          />
        </g>

        {/* Marker Flash Highlight Beam at Frame 220 */}
        {isClimaxHit && markerFlashOpacity > 0 && (
          <line
            x1={centerX}
            y1={centerY - 800}
            x2={centerX}
            y2={centerY - 240}
            stroke="#FFFFFF"
            strokeWidth="12"
            strokeLinecap="round"
            opacity={markerFlashOpacity}
            filter="url(#ringSoftGlow)"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
