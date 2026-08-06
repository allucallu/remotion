import React from 'react';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface ARTagLabelProps {
  x: number;
  y: number;
  text: string;
  subtext?: string;
  color?: string;
  accentColor?: string;
  depth?: number; // 0.8 to 1.2
  opacity?: number;
}

export const ARTagLabel: React.FC<ARTagLabelProps> = ({
  x,
  y,
  text,
  subtext = 'SCAN: OK',
  color = '#00F0FF',
  accentColor = '#FF6B00',
  depth = 1.0,
  opacity = 1.0,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: `scale(${depth})`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {/* Target Anchor Dot */}
      <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: accentColor }} />

      {/* Connecting Leader Line */}
      <div style={{ width: '40px', height: '2px', backgroundColor: color }} />

      {/* Floating AR Tag Box */}
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${color}`,
          borderRadius: '8px',
          padding: '10px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          color: '#FFFFFF',
          fontFamily: jetBrainsMonoFontFamily,
          boxShadow: `0 0 15px ${color}30`,
        }}
      >
        <div style={{ fontSize: '16px', fontWeight: 800, color }}>{text}</div>
        <div style={{ fontSize: '12px', color: '#94A3B8' }}>{subtext}</div>
      </div>
    </div>
  );
};
