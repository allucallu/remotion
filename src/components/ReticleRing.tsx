import React from 'react';

export interface ReticleRingProps {
  radius: number;
  color?: string;
  strokeWidth?: number;
  dashed?: boolean;
  rotation?: number;
}

export const ReticleRing: React.FC<ReticleRingProps> = ({
  radius,
  color = '#FF3300',
  strokeWidth = 2,
  dashed = false,
  rotation = 0,
}) => {
  return (
    <g transform={`rotate(${rotation})`}>
      <circle
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? '12 12' : 'none'}
        opacity="0.85"
      />
    </g>
  );
};
