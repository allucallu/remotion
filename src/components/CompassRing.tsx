import React from 'react';

export interface CompassRingProps {
  size?: number;
  rotation?: number;
  color?: string;
}

export const CompassRing: React.FC<CompassRingProps> = ({
  size = 240,
  rotation = 0,
  color = '#38BDF8',
}) => {
  const radius = size / 2 - 15;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(${rotation})`}>
        {/* Outer Ring */}
        <circle r={radius} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />

        {/* Degree Ticks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="0"
            y1={-radius}
            x2="0"
            y2={-radius + 10}
            stroke={color}
            strokeWidth="2"
            transform={`rotate(${i * 30})`}
          />
        ))}

        {/* Compass N / S / E / W Labels */}
        <text x="0" y={-radius + 24} textAnchor="middle" fill={color} fontSize="14" fontWeight="800">N</text>
        <text x="0" y={radius - 14} textAnchor="middle" fill={color} fontSize="14" fontWeight="800">S</text>
        <text x={radius - 18} y="5" textAnchor="middle" fill={color} fontSize="14" fontWeight="800">E</text>
        <text x={-radius + 18} y="5" textAnchor="middle" fill={color} fontSize="14" fontWeight="800">W</text>
      </g>
    </svg>
  );
};
