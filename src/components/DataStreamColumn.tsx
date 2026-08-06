import React from 'react';
import { scrambleHex } from '../utils/random';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface DataStreamColumnProps {
  x: number;
  y: number;
  speed?: number;
  opacity?: number;
  color?: string;
  frame: number;
  length?: number;
}

export const DataStreamColumn: React.FC<DataStreamColumnProps> = ({
  x,
  y,
  speed = 4,
  opacity = 0.5,
  color = '#00F0FF',
  frame,
  length = 8,
}) => {
  const yShift = (frame * speed) % 400;

  const hexLines = Array.from({ length }).map((_, i) =>
    scrambleHex(6, frame + i * 7, x * 10 + i)
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y + yShift}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        fontFamily: jetBrainsMonoFontFamily,
        fontSize: '14px',
        color,
        opacity,
        whiteSpace: 'nowrap',
        textShadow: `0 0 8px ${color}`,
      }}
    >
      {hexLines.map((line, idx) => (
        <div key={idx}>0x{line}</div>
      ))}
    </div>
  );
};
