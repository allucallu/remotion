import React from 'react';

export interface RadarSweepProps {
  radius?: number;
  rotation?: number;
  color?: string;
}

export const RadarSweep: React.FC<RadarSweepProps> = ({
  radius = 300,
  rotation = 0,
  color = '#00FF66',
}) => {
  return (
    <g transform={`rotate(${rotation})`}>
      <defs>
        <linearGradient id="radarTrailGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sweep Sector Trail Shading */}
      <path
        d={`M 0 0 L 0 ${-radius} A ${radius} ${radius} 0 0 0 ${-radius * 0.5} ${-radius * 0.866} Z`}
        fill="url(#radarTrailGrad)"
      />

      {/* Leading Radar Sweep Line */}
      <line x1="0" y1="0" x2="0" y2={-radius} stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="0" cy={-radius} r="5" fill={color} />
    </g>
  );
};
