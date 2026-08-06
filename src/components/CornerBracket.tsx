import React from 'react';

export interface CornerBracketProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const CornerBracket: React.FC<CornerBracketProps> = ({
  size = 120,
  color = '#FF3300',
  strokeWidth = 3,
}) => {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path
        d={`M 0 ${size} L 0 0 L ${size} 0`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
};
