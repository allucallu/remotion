import React from 'react';

export interface EnergyParticleProps {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  progress: number; // 0 to 1
  color?: string;
}

export const EnergyParticle: React.FC<EnergyParticleProps> = ({
  startX,
  startY,
  targetX,
  targetY,
  progress,
  color = '#FF007F',
}) => {
  // Parabolic curved path calculation
  const midX = (startX + targetX) / 2 + 100;
  const midY = (startY + targetY) / 2 - 100;

  const t = progress;
  const curX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * targetX;
  const curY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * midY + t * t * targetY;

  // Trail position slightly behind current position
  const tTrail = Math.max(0, t - 0.08);
  const trailX = (1 - tTrail) * (1 - tTrail) * startX + 2 * (1 - tTrail) * tTrail * midX + tTrail * tTrail * targetX;
  const trailY = (1 - tTrail) * (1 - tTrail) * startY + 2 * (1 - tTrail) * tTrail * midY + tTrail * tTrail * targetY;

  return (
    <g>
      {/* Particle Trail Line */}
      <line x1={trailX} y1={trailY} x2={curX} y2={curY} stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      {/* Leading Glowing Energy Particle Dot */}
      <circle cx={curX} cy={curY} r="6" fill="#FFFFFF" stroke={color} strokeWidth="2" />
    </g>
  );
};
