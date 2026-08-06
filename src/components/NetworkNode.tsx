import React from 'react';

export interface NetworkNodeProps {
  x: number;
  y: number;
  isActive?: boolean;
  color?: string;
  label?: string;
}

export const NetworkNode: React.FC<NetworkNodeProps> = ({
  x,
  y,
  isActive = false,
  color = '#0088FF',
  label,
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer Pulse Ring when Active */}
      {isActive && (
        <circle r="22" fill="none" stroke="#00F0FF" strokeWidth="2" opacity="0.8" />
      )}
      {/* Solid Node Core Dot */}
      <circle r="8" fill={isActive ? '#00F0FF' : color} />
      {label && (
        <text x="14" y="4" fill={isActive ? '#00F0FF' : '#94A3B8'} fontSize="12" fontWeight="700">
          {label}
        </text>
      )}
    </g>
  );
};

export interface NetworkLinkProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive?: boolean;
  color?: string;
}

export const NetworkLink: React.FC<NetworkLinkProps> = ({
  x1,
  y1,
  x2,
  y2,
  isActive = false,
  color = '#0088FF',
}) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isActive ? '#00F0FF' : color}
      strokeWidth={isActive ? '3' : '1.5'}
      opacity={isActive ? 0.9 : 0.3}
    />
  );
};
