import React from 'react';

export interface SegmentedProgressRingProps {
  size?: number;
  progress: number; // 0 to 1
  totalSegments?: number;
  color?: string;
}

export const SegmentedProgressRing: React.FC<SegmentedProgressRingProps> = ({
  size = 400,
  progress = 0,
  totalSegments = 36,
  color = '#FF9900',
}) => {
  const radius = size / 2 - 20;
  const activeSegments = Math.floor(progress * totalSegments);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        {Array.from({ length: totalSegments }).map((_, i) => {
          const angle = (i * 360) / totalSegments;
          const isActive = i < activeSegments;

          return (
            <g key={i} transform={`rotate(${angle})`}>
              <line
                x1={radius - 16}
                y1="0"
                x2={radius}
                y2="0"
                stroke={isActive ? color : '#334155'}
                strokeWidth="6"
                strokeLinecap="round"
                opacity={isActive ? 1 : 0.25}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
