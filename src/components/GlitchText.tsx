import React from 'react';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface GlitchTextProps {
  text: string;
  isGlitching?: boolean;
  color?: string;
  fontSize?: number;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  isGlitching = false,
  color = '#00F0FF',
  fontSize = 24,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        fontFamily: jetBrainsMonoFontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        color,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}
    >
      {/* RGB Split Offset Copies when Glitching */}
      {isGlitching && (
        <>
          <span
            style={{
              position: 'absolute',
              left: '-4px',
              top: '1px',
              color: '#FF0055',
              clipPath: 'inset(10% 0 15% 0)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            style={{
              position: 'absolute',
              left: '4px',
              top: '-1px',
              color: '#00F0FF',
              clipPath: 'inset(40% 0 5% 0)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
      <span>{text}</span>
    </div>
  );
};
