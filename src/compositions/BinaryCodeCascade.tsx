import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';

export interface BinaryCodeCascadeProps {
  columnCount?: number;
  rowCount?: number;
  accentColor?: string;
  highlightRatio?: number;
}

// Deterministic pseudo-random hash generator for Remotion reproducibility
function pseudoRandom(row: number, col: number, seed: number): number {
  const x = Math.sin(row * 12.9898 + col * 78.233 + seed * 43758.5453) * 43758.5453;
  return x - Math.floor(x);
}

// Get deterministic binary digit ('0' or '1') for cell at current frame
function getBinaryDigit(row: number, col: number, frame: number): string {
  const flipPeriod = Math.floor(20 + pseudoRandom(row, col, 1) * 30); // 20-50 frames period
  const cycleIndex = Math.floor(frame / flipPeriod);
  const val = pseudoRandom(row, col, cycleIndex);
  return val > 0.5 ? '1' : '0';
}

// 5 Independent Local Compute Clusters (3x3 or 4x4 regions)
const INDEPENDENT_CLUSTERS = [
  { startFrame: 40, duration: 40, minRow: 2, maxRow: 5, minCol: 3, maxCol: 6 },
  { startFrame: 90, duration: 45, minRow: 8, maxRow: 11, minCol: 16, maxCol: 19 },
  { startFrame: 140, duration: 40, minRow: 1, maxRow: 4, minCol: 17, maxCol: 20 },
  { startFrame: 180, duration: 45, minRow: 7, maxRow: 10, minCol: 4, maxCol: 7 },
  { startFrame: 60, duration: 50, minRow: 5, maxRow: 8, minCol: 10, maxCol: 13 },
];

export const BinaryCodeCascade: React.FC<BinaryCodeCascadeProps> = ({
  columnCount = 24,
  rowCount = 14,
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  // Grid Dimensions & Spacing
  const gridWidth = 3120; // Margin 360px on sides
  const gridHeight = 1680; // Margin 240px top/bottom
  const cellWidth = gridWidth / columnCount; // 130px
  const cellHeight = gridHeight / rowCount; // 120px

  const startX = centerX - gridWidth / 2 + cellWidth / 2;
  const startY = centerY - gridHeight / 2 + cellHeight / 2;

  // 1. Initial Entrance Fade-in (Frame 0-20: opacity 0 -> 0.25)
  const gridEntranceOpacity = interpolate(frame, [0, 20], [0, 1.0], { extrapolateRight: 'clamp' });

  // 2. Diagonal Wave Front Motion (Frame 20-200: Top-Left to Bottom-Right and Back)
  const maxDiagonal = (columnCount - 1) + (rowCount - 1); // 23 + 13 = 36
  const waveCycleFrames = 180; // 90 frames down + 90 frames up
  const waveProgress = frame >= 20 ? ((frame - 20) % waveCycleFrames) / waveCycleFrames : 0;

  // 0 -> 1 -> 0 triangle wave for smooth back-and-forth sweeping
  const waveDirection = waveProgress <= 0.5 ? waveProgress / 0.5 : (1 - waveProgress) / 0.5;
  const currentWaveDiagonal = waveDirection * maxDiagonal;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000', // CRITICAL: Solid black background for Screen/Add additive blend mode
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'monospace, system-ui, sans-serif',
      }}
    >
      {/* MAIN STATIC BINARY GRID CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          opacity: gridEntranceOpacity,
        }}
      >
        {Array.from({ length: rowCount }).map((_, rIdx) => {
          return Array.from({ length: columnCount }).map((_, cIdx) => {
            const posX = startX + cIdx * cellWidth;
            const posY = startY + rIdx * cellHeight;

            // Deterministic binary digit value '0' or '1'
            const digit = getBinaryDigit(rIdx, cIdx, frame);

            // 1. Diagonal Wave Front Distance & Intensity
            const cellDiag = rIdx + cIdx;
            const distToWave = Math.abs(cellDiag - currentWaveDiagonal);
            let waveIntensity = Math.max(0, 1 - distToWave / 3.2);
            waveIntensity = Easing.out(Easing.cubic)(waveIntensity);

            // 2. Independent Cluster Highlight Detection
            let clusterIntensity = 0;
            INDEPENDENT_CLUSTERS.forEach((cluster) => {
              if (
                rIdx >= cluster.minRow &&
                rIdx <= cluster.maxRow &&
                cIdx >= cluster.minCol &&
                cIdx <= cluster.maxCol
              ) {
                if (frame >= cluster.startFrame && frame <= cluster.startFrame + cluster.duration) {
                  const elapsedCluster = frame - cluster.startFrame;
                  clusterIntensity = interpolate(elapsedCluster, [0, 6, 20, cluster.duration], [0, 0.9, 0.9, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                }
              }
            });

            // Combine Wave & Cluster Intensities
            const totalHighlight = Math.max(waveIntensity, clusterIntensity);

            // Digit Color & Opacity Calculation (CRITICAL ADDITIVE BLEND RULES)
            // Idle state: #1E3A5F, opacity 0.25 (never 0 opacity or pure black!)
            // Highlight peak: #FFFFFF -> accentColor #22D3EE, opacity 1.0
            const digitOpacity = interpolate(totalHighlight, [0, 1], [0.25, 1.0]);
            const digitColor = interpolateColors(totalHighlight, [0, 0.6, 1.0], ['#1E3A5F', accentColor, '#FFFFFF']);

            const fontSize = totalHighlight > 0.5 ? 58 : 54;
            const fontColor = totalHighlight > 0.8 ? '#FFFFFF' : digitColor;

            return (
              <div
                key={`cell-${rIdx}-${cIdx}`}
                style={{
                  position: 'absolute',
                  left: `${posX}px`,
                  top: `${posY}px`,
                  transform: 'translate(-50%, -50%)',
                  width: `${cellWidth}px`,
                  height: `${cellHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: `${fontSize}px`,
                  fontWeight: 900,
                  fontFamily: '"Courier New", Courier, monospace',
                  fontVariantNumeric: 'tabular-nums',
                  color: fontColor,
                  opacity: digitOpacity,
                  textShadow: totalHighlight > 0.5 ? `0 0 16px ${accentColor}` : 'none',
                  transition: 'fontSize 0.05s ease',
                }}
              >
                {digit}
              </div>
            );
          });
        })}
      </div>
    </AbsoluteFill>
  );
};
