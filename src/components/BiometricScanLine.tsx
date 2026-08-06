import React from 'react';

export interface BiometricScanLineProps {
  yPos: number;
  width?: number;
  color?: string;
}

export const BiometricScanLine: React.FC<BiometricScanLineProps> = ({
  yPos,
  width = 600,
  color = '#00F0FF',
}) => {
  return (
    <g transform={`translate(0, ${yPos})`}>
      {/* Main Scan Line */}
      <line x1={-width / 2} y1="0" x2={width / 2} y2="0" stroke={color} strokeWidth="3" opacity="0.9" />

      {/* Grid Dot Array glowing on scan line */}
      {[-200, -100, 0, 100, 200].map((x, i) => (
        <circle key={i} cx={x} cy="0" r="4" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      ))}
    </g>
  );
};
