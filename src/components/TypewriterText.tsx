import React from 'react';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface TypewriterTextProps {
  lines: string[];
  frame: number;
  color?: string;
  fontSize?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  lines,
  frame,
  color = '#00F0FF',
  fontSize = 20,
}) => {
  // Total characters across lines
  const fullText = lines.join('\n');
  const cycleLength = fullText.length * 2 + 60;
  const cycleFrame = frame % cycleLength;

  let visibleCount = 0;
  if (cycleFrame <= fullText.length) {
    visibleCount = cycleFrame; // Typing forward
  } else if (cycleFrame <= fullText.length + 30) {
    visibleCount = fullText.length; // Hold
  } else {
    visibleCount = Math.max(0, fullText.length - (cycleFrame - fullText.length - 30)); // Backspace
  }

  const currentDisplay = fullText.slice(0, visibleCount);

  return (
    <div
      style={{
        fontFamily: jetBrainsMonoFontFamily,
        fontSize: `${fontSize}px`,
        color,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5,
        letterSpacing: '0.1em',
        textShadow: `0 0 10px ${color}`,
      }}
    >
      {currentDisplay}
      <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>_</span>
    </div>
  );
};
