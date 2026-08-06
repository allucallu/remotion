import React from 'react';

export interface RotatingDialProps {
  size?: number;
  rotation?: number;
  color?: string;
}

export const RotatingDial: React.FC<RotatingDialProps> = ({
  size = 180,
  rotation = 0,
  color = '#00F0FF',
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180">
      <g transform={`rotate(${rotation} 90 90)`}>
        {/* Outer Ring */}
        <circle cx="90" cy="90" r="80" fill="none" stroke={color} strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
        {/* Inner Ring */}
        <circle cx="90" cy="90" r="60" fill="none" stroke={color} strokeWidth="1.5" />
        {/* Pointer Needle Line */}
        <line x1="90" y1="90" x2="90" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="90" r="6" fill={color} />
      </g>
    </svg>
  );
};
