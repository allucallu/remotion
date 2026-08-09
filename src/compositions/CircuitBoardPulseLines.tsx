import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export interface Point {
  x: number;
  y: number;
}

export interface PathDef {
  id: string;
  points: Point[];
  delay: number;
  pulsePeriod: number;
  pulseOffset: number;
  isMain: boolean;
}

export interface CircuitBoardPulseLinesProps {
  pathCount?: number;
  accentColor?: string;
  pulseSpeed?: 'slow' | 'medium' | 'fast';
}

// 8 Distinct 90-Degree Orthogonal PCB Traces across 4K UHD Canvas (3840 x 2160)
const DEFAULT_PATHS: PathDef[] = [
  {
    id: 'path-0',
    points: [
      { x: 200, y: 300 },
      { x: 800, y: 300 },
      { x: 800, y: 650 },
      { x: 1400, y: 650 },
      { x: 1400, y: 900 },
    ],
    delay: 0,
    pulsePeriod: 75,
    pulseOffset: 0,
    isMain: true,
  },
  {
    id: 'path-1',
    points: [
      { x: 3640, y: 250 },
      { x: 2900, y: 250 },
      { x: 2900, y: 550 },
      { x: 2200, y: 550 },
      { x: 2200, y: 800 },
    ],
    delay: 8,
    pulsePeriod: 80,
    pulseOffset: 20,
    isMain: true,
  },
  {
    id: 'path-2',
    points: [
      { x: 250, y: 1000 },
      { x: 700, y: 1000 },
      { x: 700, y: 1300 },
      { x: 1200, y: 1300 },
      { x: 1200, y: 1100 },
      { x: 1600, y: 1100 },
    ],
    delay: 16,
    pulsePeriod: 70,
    pulseOffset: 35,
    isMain: false,
  },
  {
    id: 'path-3',
    points: [
      { x: 3590, y: 1050 },
      { x: 3100, y: 1050 },
      { x: 3100, y: 1350 },
      { x: 2600, y: 1350 },
      { x: 2600, y: 1150 },
      { x: 2240, y: 1150 },
    ],
    delay: 24,
    pulsePeriod: 85,
    pulseOffset: 10,
    isMain: false,
  },
  {
    id: 'path-4',
    points: [
      { x: 300, y: 1850 },
      { x: 950, y: 1850 },
      { x: 950, y: 1500 },
      { x: 1500, y: 1500 },
      { x: 1500, y: 1300 },
    ],
    delay: 32,
    pulsePeriod: 78,
    pulseOffset: 45,
    isMain: true,
  },
  {
    id: 'path-5',
    points: [
      { x: 3540, y: 1900 },
      { x: 2850, y: 1900 },
      { x: 2850, y: 1600 },
      { x: 2300, y: 1600 },
      { x: 2300, y: 1350 },
    ],
    delay: 40,
    pulsePeriod: 82,
    pulseOffset: 15,
    isMain: true,
  },
  {
    id: 'path-6',
    points: [
      { x: 1920, y: 150 },
      { x: 1920, y: 450 },
      { x: 1650, y: 450 },
      { x: 1650, y: 850 },
      { x: 1920, y: 850 },
    ],
    delay: 48,
    pulsePeriod: 72,
    pulseOffset: 50,
    isMain: false,
  },
  {
    id: 'path-7',
    points: [
      { x: 1920, y: 2010 },
      { x: 1920, y: 1710 },
      { x: 2190, y: 1710 },
      { x: 2190, y: 1310 },
      { x: 1920, y: 1310 },
    ],
    delay: 56,
    pulsePeriod: 88,
    pulseOffset: 25,
    isMain: false,
  },
];

// Helper: Calculate total length of orthogonal 90-degree polyline
function getPolylineLength(points: Point[]): number {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

// Helper: Get point (x, y) along polyline at distance length
function getPointAtPolylineLength(points: Point[], length: number): Point {
  let accumulated = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const segLen = Math.sqrt(dx * dx + dy * dy);

    if (length <= accumulated + segLen) {
      const t = segLen > 0 ? (length - accumulated) / segLen : 0;
      return {
        x: p1.x + t * dx,
        y: p1.y + t * dy,
      };
    }
    accumulated += segLen;
  }
  return points[points.length - 1];
}

// Helper: Convert Point array to SVG path D string
function pointsToSvgPathD(points: Point[]): string {
  return points.map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
}

export const CircuitBoardPulseLines: React.FC<CircuitBoardPulseLinesProps> = ({
  pathCount = 8,
  accentColor = '#22D3EE',
  pulseSpeed = 'medium',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const activePaths = DEFAULT_PATHS.slice(0, pathCount);

  // Speed multiplier based on pulseSpeed prop
  const speedMult = pulseSpeed === 'fast' ? 1.4 : pulseSpeed === 'slow' ? 0.7 : 1.0;
  const pulseDurationFrames = Math.round(45 / speedMult); // ~45 frames to travel path

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

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
      {/* SVG Filters for High-Energy Soft Blur Glow */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="pcbSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* CENTER SOC HARDWARE SECURITY CHIP (320px Square Processor Outline) */}
      <div
        style={{
          position: 'absolute',
          left: `${centerX}px`,
          top: `${centerY}px`,
          width: '320px',
          height: '320px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: `2.5px solid ${accentColor}`,
          borderRadius: '24px',
          boxShadow: `0 0 40px rgba(34, 211, 238, 0.35)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          zIndex: 15,
        }}
      >
        {/* Corner Bracket Overlays */}
        <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '28px', height: '28px', borderTop: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF' }} />
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '28px', height: '28px', borderTop: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF' }} />
        <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '28px', height: '28px', borderBottom: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF' }} />
        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '28px', height: '28px', borderBottom: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF' }} />

        {/* Center Chip Microprocessor Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(34, 211, 238, 0.15)',
            border: '2px solid #67E8F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${accentColor}`,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ECFEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" fill="#22D3EE" fillOpacity="0.4" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="15" x2="23" y2="15" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="15" x2="4" y2="15" />
          </svg>
        </div>
      </div>

      {/* MAIN PCB TRACES & SIGNAL PULSES SVG CONTAINER */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {activePaths.map((pathDef) => {
          const pathD = pointsToSvgPathD(pathDef.points);
          const totalLength = getPolylineLength(pathDef.points);

          // 1. Initial Draw-In Animation (Frame 0 to 90: strokeDashoffset totalLength -> 0)
          const drawStart = pathDef.delay;
          const drawProgress = interpolate(frame - drawStart, [0, 40], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.cubic),
          });

          const strokeDashoffset = totalLength * (1 - drawProgress);
          const pathOpacity = interpolate(frame - drawStart, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' });

          // 2. Continuous Traveling Signal Pulse Logic (Frame 90+)
          const effectivePeriod = Math.round(pathDef.pulsePeriod / speedMult);
          const adjustedFrame = Math.max(0, frame - 90 + pathDef.pulseOffset);
          const pulseCycleFrame = adjustedFrame % effectivePeriod;
          const isPulseActive = frame >= 90 && pulseCycleFrame < pulseDurationFrames;

          // Current Head Position along path (length 0 to totalLength)
          const pulseProgress = isPulseActive ? pulseCycleFrame / pulseDurationFrames : 0;
          const headLength = pulseProgress * totalLength;
          const headPoint = getPointAtPolylineLength(pathDef.points, headLength);

          const strokeWidth = pathDef.isMain ? 4.5 : 3.0;

          return (
            <g key={pathDef.id} style={{ opacity: pathOpacity }}>
              {/* Idle Base PCB Trace Line (#0E3A42 dark desaturated cyan) */}
              <path
                d={pathD}
                fill="none"
                stroke="#0E3A42"
                strokeWidth={strokeWidth}
                strokeDasharray={totalLength}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="square"
                strokeLinejoin="miter"
                opacity={0.35}
              />

              {/* Glowing Base Line Segment when Draw-In is active */}
              {drawProgress > 0 && drawProgress < 1 && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={strokeWidth + 3}
                  strokeDasharray={totalLength}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  opacity={0.75}
                  filter="url(#pcbSoftGlow)"
                />
              )}

              {/* 4. Moving Pulse Segment with 200px Gradient Tail */}
              {isPulseActive && (
                <g>
                  {/* Trail gradient dots/lines behind head point */}
                  {Array.from({ length: 20 }).map((_, tIdx) => {
                    const tailOffset = tIdx * 10;
                    const tailLen = Math.max(0, headLength - tailOffset);
                    const tailPt = getPointAtPolylineLength(pathDef.points, tailLen);

                    const tailOpacity = (1 - tIdx / 20) * 0.85;
                    const tailColor = tIdx === 0 ? '#FFFFFF' : tIdx < 5 ? '#ECFEFF' : tIdx < 12 ? '#67E8F9' : accentColor;
                    const tailSize = (1 - tIdx / 24) * (strokeWidth + 8);

                    return (
                      <circle
                        key={`pulse-tail-${tIdx}`}
                        cx={tailPt.x}
                        cy={tailPt.y}
                        r={tailSize / 2}
                        fill={tailColor}
                        opacity={tailOpacity}
                        filter={tIdx < 8 ? 'url(#pcbSoftGlow)' : undefined}
                      />
                    );
                  })}

                  {/* Sharp Solid White Head Point */}
                  <circle
                    cx={headPoint.x}
                    cy={headPoint.y}
                    r={strokeWidth + 5}
                    fill="#FFFFFF"
                    style={{ filter: `drop-shadow(0 0 20px ${accentColor})` }}
                  />
                </g>
              )}

              {/* 5. PCB Junction Nodes */}
              {pathDef.points.map((pt, ptIdx) => {
                let isNodeHit = false;

                if (isPulseActive) {
                  const distToNode = Math.sqrt(Math.pow(headPoint.x - pt.x, 2) + Math.pow(headPoint.y - pt.y, 2));
                  if (distToNode < 40) {
                    isNodeHit = true;
                  }
                }

                let nodeScale = 1.0;
                let nodeColor = '#164E56';
                let nodeOpacity = 0.55;

                if (isNodeHit) {
                  nodeScale = 1.6;
                  nodeColor = '#FFFFFF';
                  nodeOpacity = 1.0;
                }

                return (
                  <g key={`node-${pathDef.id}-${ptIdx}`}>
                    {/* Outer Glow Ring on Node Flash */}
                    {isNodeHit && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={32}
                        fill={accentColor}
                        opacity={0.65}
                        filter="url(#pcbSoftGlow)"
                      />
                    )}

                    {/* Outer Node Border Ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={12}
                      stroke={isNodeHit ? '#FFFFFF' : '#22D3EE'}
                      strokeWidth="2.5"
                      fill="none"
                      opacity={nodeOpacity}
                    />

                    {/* Core Solid Junction Dot (16px Diameter) */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={7 * nodeScale}
                      fill={nodeColor}
                      opacity={nodeOpacity}
                      style={{ filter: isNodeHit ? `drop-shadow(0 0 16px ${accentColor})` : undefined }}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
