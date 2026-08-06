import React from 'react';

export interface DriftLineProps {
  d: string;
  xShift?: number;
  color?: string;
  opacity?: number;
}

export const DriftLine: React.FC<DriftLineProps> = ({
  d,
  xShift = 0,
  color = '#38BDF8',
  opacity = 0.4,
}) => {
  return (
    <g transform={`translate(${xShift}, 0)`}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="200 400"
        strokeLinecap="round"
        opacity={opacity}
      />
    </g>
  );
};
