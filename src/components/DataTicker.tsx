import React from 'react';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface DataTickerProps {
  items: string[];
  frame: number;
  speed?: number;
  direction?: 'left' | 'right';
  color?: string;
  accentColor?: string;
  highlightIndex?: number;
}

export const DataTicker: React.FC<DataTickerProps> = ({
  items,
  frame,
  speed = 4,
  direction = 'left',
  color = '#00FF66',
  accentColor = '#FFB700',
  highlightIndex = -1,
}) => {
  const repeatedText = [...items, ...items, ...items].join('   •••   ');
  const shift = (frame * speed) % 1920;
  const xOffset = direction === 'left' ? -shift : shift;

  return (
    <div
      style={{
        width: '3840px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: jetBrainsMonoFontFamily,
        fontSize: '20px',
        color,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textShadow: `0 0 10px ${color}`,
      }}
    >
      <div style={{ transform: `translateX(${xOffset}px)`, display: 'inline-block' }}>
        {repeatedText.split('   •••   ').map((item, idx) => {
          const isHighlighted = idx % items.length === highlightIndex;
          return (
            <span
              key={idx}
              style={{
                backgroundColor: isHighlighted ? `${accentColor}30` : 'transparent',
                color: isHighlighted ? accentColor : color,
                padding: '4px 12px',
                borderRadius: '6px',
                marginRight: '24px',
              }}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
};
