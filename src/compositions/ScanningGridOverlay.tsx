import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BiometricKeyIcon, CodeBugIcon, DatabaseCyberIcon, FirewallGateIcon, ShieldLockIcon, TargetReticleRing } from '../components/CyberGridIcons';

export interface GridNode {
  id: string;
  col: number;
  row: number;
  iconType: 'shield' | 'bug' | 'db' | 'firewall' | 'biometric';
}

export interface ScanningGridOverlayProps {
  gridSize?: { cols: number; rows: number };
  accentColor?: string;
  nodeCount?: number;
  scanDurationFrames?: number;
}

const DEFAULT_NODES: GridNode[] = [
  { id: 'node-1', col: 2, row: 2, iconType: 'shield' },
  { id: 'node-2', col: 9, row: 2, iconType: 'bug' },
  { id: 'node-3', col: 4, row: 4, iconType: 'db' },
  { id: 'node-4', col: 8, row: 5, iconType: 'firewall' },
  { id: 'node-5', col: 6, row: 1, iconType: 'biometric' },
];

export const ScanningGridOverlay: React.FC<ScanningGridOverlayProps> = ({
  gridSize = { cols: 12, rows: 7 },
  nodeCount = 5,
  scanDurationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const cols = gridSize.cols;
  const rows = gridSize.rows;

  // Scan Line Motion
  const cycleProgress = (frame % scanDurationFrames) / scanDurationFrames;
  const currentScanY = cycleProgress * height;

  const rowPositions = Array.from({ length: rows + 1 }, (_, j) => (j / rows) * height);
  const colPositions = Array.from({ length: cols + 1 }, (_, i) => (i / cols) * width);

  const activeNodes = DEFAULT_NODES.slice(0, nodeCount);

  const renderNodeIcon = (type: string, color: string, opacity: number) => {
    switch (type) {
      case 'shield':
        return <ShieldLockIcon size={38} color={color} opacity={opacity} />;
      case 'bug':
        return <CodeBugIcon size={38} color={color} opacity={opacity} />;
      case 'db':
        return <DatabaseCyberIcon size={38} color={color} opacity={opacity} />;
      case 'firewall':
        return <FirewallGateIcon size={38} color={color} opacity={opacity} />;
      case 'biometric':
        return <BiometricKeyIcon size={38} color={color} opacity={opacity} />;
      default:
        return <ShieldLockIcon size={38} color={color} opacity={opacity} />;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000', // Solid black background for Screen/Add blend mode
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* SVG Filters for Glow Effects */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="cyanSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* MAIN RADAR SCAN GRID SVG */}
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Horizontal Grid Lines */}
        {rowPositions.map((yPos, j) => {
          const currentCycleIndex = Math.floor(frame / scanDurationFrames);
          const scanPassFrame = currentCycleIndex * scanDurationFrames + (j / rows) * scanDurationFrames;

          let flashProgress = 0;
          if (frame >= scanPassFrame) {
            const elapsed = frame - scanPassFrame;
            flashProgress = Math.max(0, 1 - elapsed / 28);
            flashProgress = Easing.out(Easing.cubic)(flashProgress);
          }

          const lineStrokeColor = interpolateColors(flashProgress, [0, 1], ['#1E3A5F', '#60A5FA']);
          const lineStrokeWidth = 1 + flashProgress * 2.5;

          return (
            <line
              key={`h-line-${j}`}
              x1={0}
              y1={yPos}
              x2={width}
              y2={yPos}
              stroke={lineStrokeColor}
              strokeWidth={lineStrokeWidth}
              opacity={0.3 + flashProgress * 0.7}
            />
          );
        })}

        {/* Vertical Grid Lines */}
        {colPositions.map((xPos, i) => {
          const proxDist = Math.abs(currentScanY - (height / 2));
          const proxGlow = Math.max(0, 1 - proxDist / 500);

          return (
            <g key={`v-line-group-${i}`}>
              <line
                x1={xPos}
                y1={0}
                x2={xPos}
                y2={height}
                stroke="#1E3A5F"
                strokeWidth="1.2"
                opacity={0.35}
              />
              <line
                x1={xPos}
                y1={Math.max(0, currentScanY - 110)}
                x2={xPos}
                y2={Math.min(height, currentScanY + 110)}
                stroke="#60A5FA"
                strokeWidth="3"
                opacity={0.6 + proxGlow * 0.4}
                filter="url(#cyanSoftGlow)"
              />
            </g>
          );
        })}

        {/* Dynamic Energy Scan Beam */}
        <g>
          <rect x={0} y={Math.max(0, currentScanY - 130)} width={width} height={130} fill="url(#scanTrailGradient)" opacity={0.65} />

          <line
            x1={0}
            y1={currentScanY}
            x2={width}
            y2={currentScanY}
            stroke="#60A5FA"
            strokeWidth="24"
            opacity={0.35}
            filter="url(#cyanSoftGlow)"
          />
          <line
            x1={0}
            y1={currentScanY}
            x2={width}
            y2={currentScanY}
            stroke="#DBEAFE"
            strokeWidth="6"
            opacity={1.0}
          />

          <linearGradient id="scanTrailGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0" />
          </linearGradient>
        </g>

        {/* Cybersecurity Target Nodes */}
        {activeNodes.map((node) => {
          const nodeX = (node.col / cols) * width;
          const nodeY = (node.row / rows) * height;

          const distToScan = Math.abs(currentScanY - nodeY);
          const isHit = distToScan < 30;

          const springScale = spring({
            frame: isHit ? Math.max(0, frame) : 0,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          const nodeScale = isHit ? interpolate(springScale, [0, 1], [1, 1.3]) : 1.0;
          const nodeColor = isHit ? '#FFFFFF' : '#60A5FA';
          const outerGlowOpacity = isHit ? 0.9 : 0.45;

          return (
            <g key={node.id} style={{ transform: `scale(${nodeScale})`, transformOrigin: `${nodeX}px ${nodeY}px` }}>
              {/* Outer Radial Glow */}
              <circle
                cx={nodeX}
                cy={nodeY}
                r={38}
                fill={nodeColor}
                opacity={outerGlowOpacity * 0.4}
                filter="url(#cyanSoftGlow)"
              />

              {/* Rotating Target Reticle Ring */}
              <g style={{ transform: `translate(${nodeX}px, ${nodeY}px)` }}>
                <TargetReticleRing size={110} color={nodeColor} rotationDeg={frame * 1.5} />
              </g>

              {/* Node Icon Badge Container */}
              <circle
                cx={nodeX}
                cy={nodeY}
                r={32}
                fill="rgba(15, 23, 42, 0.9)"
                stroke={nodeColor}
                strokeWidth="3"
              />

              {/* SVG Cybersecurity Icon */}
              <g style={{ transform: `translate(${nodeX - 19}px, ${nodeY - 19}px)` }}>
                {renderNodeIcon(node.iconType, nodeColor, outerGlowOpacity)}
              </g>

              {/* Solid White Core Dot */}
              <circle
                cx={nodeX}
                cy={nodeY}
                r={7}
                fill="#FFFFFF"
                style={{ filter: 'drop-shadow(0 0 10px #FFFFFF)' }}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
