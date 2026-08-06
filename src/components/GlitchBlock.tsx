import React from 'react';

export interface GlitchBlockProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
}

export const GlitchBlock: React.FC<GlitchBlockProps> = ({
  x,
  y,
  width = 120,
  height = 40,
  color = '#FF0055',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: color,
        opacity: 0.85,
        mixBlendMode: 'screen',
        boxShadow: `0 0 15px ${color}`,
      }}
    />
  );
};
