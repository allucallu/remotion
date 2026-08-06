import React from 'react';

export interface CircuitTraceProps {
  d: string; // SVG path string with 90 degree bends
  progress: number; // 0 to 1
  color?: string;
  strokeWidth?: number;
}

export const CircuitTrace: React.FC<CircuitTraceProps> = ({
  d,
  progress,
  color = '#00FF66',
  strokeWidth = 3,
}) => {
  const dashOffset = (1 - progress) * 1200;

  return (
    <g>
      {/* Background PCB Line Trace */}
      <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} opacity="0.35" strokeLinecap="square" />

      {/* Animated Electric Pulse along Trace */}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 1}
        strokeDasharray="80 1120"
        strokeDashoffset={dashOffset}
        strokeLinecap="square"
        opacity="0.95"
      />
    </g>
  );
};

export interface CircuitNodeProps {
  x: number;
  y: number;
  isActive?: boolean;
  color?: string;
  size?: number;
}

export const CircuitNode: React.FC<CircuitNodeProps> = ({
  x,
  y,
  isActive = false,
  color = '#00FF66',
  size = 14,
}) => {
  return (
    <rect
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      fill={isActive ? '#FFFFFF' : color}
      stroke={color}
      strokeWidth="2"
      opacity={isActive ? 1.0 : 0.4}
      style={{
        boxShadow: isActive ? `0 0 15px ${color}` : 'none',
      }}
    />
  );
};
