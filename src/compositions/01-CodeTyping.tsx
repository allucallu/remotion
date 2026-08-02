import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { TerminalWindow } from '../components/TerminalWindow';
import { firaCodeFontFamily } from '../utils/fonts';

export interface CodeTypingProps {
  background?: 'alpha' | 'solid';
}

interface CodeLineToken {
  text: string;
  color: string;
}

interface CodeLine {
  lineNumber: number;
  tokens: CodeLineToken[];
}

const codeLines: CodeLine[] = [
  {
    lineNumber: 1,
    tokens: [
      { text: 'import ', color: '#569CD6' },
      { text: 'React', color: '#4EC9B0' },
      { text: ', { ', color: '#D4D4D4' },
      { text: 'useState', color: '#DCDCAA' },
      { text: ', ', color: '#D4D4D4' },
      { text: 'useEffect', color: '#DCDCAA' },
      { text: ' } ', color: '#D4D4D4' },
      { text: 'from ', color: '#569CD6' },
      { text: "'react'", color: '#CE9178' },
      { text: ';', color: '#D4D4D4' },
    ],
  },
  {
    lineNumber: 2,
    tokens: [
      { text: 'import ', color: '#569CD6' },
      { text: '{ ', color: '#D4D4D4' },
      { text: 'useCurrentFrame', color: '#DCDCAA' },
      { text: ' } ', color: '#D4D4D4' },
      { text: 'from ', color: '#569CD6' },
      { text: "'remotion'", color: '#CE9178' },
      { text: ';', color: '#D4D4D4' },
    ],
  },
  { lineNumber: 3, tokens: [] },
  {
    lineNumber: 4,
    tokens: [
      { text: 'export ', color: '#569CD6' },
      { text: 'const ', color: '#569CD6' },
      { text: 'DataStream', color: '#4EC9B0' },
      { text: ' = ({ ', color: '#D4D4D4' },
      { text: 'status', color: '#9CDCFE' },
      { text: ' }) => {', color: '#D4D4D4' },
    ],
  },
  {
    lineNumber: 5,
    tokens: [
      { text: '  const ', color: '#569CD6' },
      { text: '[', color: '#D4D4D4' },
      { text: 'metrics', color: '#9CDCFE' },
      { text: ', ', color: '#D4D4D4' },
      { text: 'setMetrics', color: '#DCDCAA' },
      { text: '] = ', color: '#D4D4D4' },
      { text: 'useState', color: '#DCDCAA' },
      { text: '({ ', color: '#D4D4D4' },
      { text: 'latency', color: '#9CDCFE' },
      { text: ': ', color: '#D4D4D4' },
      { text: '12', color: '#B5CEA8' },
      { text: ' });', color: '#D4D4D4' },
    ],
  },
  {
    lineNumber: 6,
    tokens: [
      { text: '  const ', color: '#569CD6' },
      { text: 'frame', color: '#9CDCFE' },
      { text: ' = ', color: '#D4D4D4' },
      { text: 'useCurrentFrame', color: '#DCDCAA' },
      { text: '();', color: '#D4D4D4' },
    ],
  },
  { lineNumber: 7, tokens: [] },
  {
    lineNumber: 8,
    tokens: [
      { text: '  return ', color: '#569CD6' },
      { text: '(', color: '#D4D4D4' },
    ],
  },
  {
    lineNumber: 9,
    tokens: [
      { text: '    <', color: '#80CBC4' },
      { text: 'div', color: '#569CD6' },
      { text: ' className', color: '#9CDCFE' },
      { text: '=', color: '#D4D4D4' },
      { text: '"pipeline-container"', color: '#CE9178' },
      { text: '>', color: '#80CBC4' },
    ],
  },
  {
    lineNumber: 10,
    tokens: [
      { text: '      <', color: '#80CBC4' },
      { text: 'StatusBadge', color: '#4EC9B0' },
      { text: ' active', color: '#9CDCFE' },
      { text: '={', color: '#D4D4D4' },
      { text: 'true', color: '#569CD6' },
      { text: '} />', color: '#80CBC4' },
    ],
  },
  {
    lineNumber: 11,
    tokens: [
      { text: '    </', color: '#80CBC4' },
      { text: 'div', color: '#569CD6' },
      { text: '>', color: '#80CBC4' },
    ],
  },
  {
    lineNumber: 12,
    tokens: [
      { text: '  );', color: '#D4D4D4' },
    ],
  },
  {
    lineNumber: 13,
    tokens: [
      { text: '};', color: '#D4D4D4' },
    ],
  },
];

export const CodeTyping: React.FC<CodeTypingProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  // Total characters calculation
  const totalChars = codeLines.reduce(
    (acc, line) => acc + line.tokens.reduce((tAcc, token) => tAcc + token.text.length, 0) + 1,
    0
  );

  // Type characters across frame 10 to 170
  const typedCount = Math.floor(
    interpolate(frame, [10, 170], [0, totalChars], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  // Cursor blinking
  const isCursorVisible = Math.floor(frame / 15) % 2 === 0;

  const bgColor = background === 'solid' ? '#1E1E1E' : 'transparent';

  let runningCharCount = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: firaCodeFontFamily,
      }}
    >
      <TerminalWindow
        title="App.tsx — Remotion IDE"
        width="1400px"
        height="900px"
        backgroundColor="#1E1E1E"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '28px', lineHeight: 1.6 }}>
          {codeLines.map((line) => {
            const lineStartIndex = runningCharCount;
            let lineCharOffset = 0;

            const lineTokensToRender = line.tokens.map((token) => {
              const tokenStart = lineStartIndex + lineCharOffset;
              lineCharOffset += token.text.length;

              if (typedCount <= tokenStart) {
                return null;
              }

              const visibleLength = Math.min(token.text.length, typedCount - tokenStart);
              const visibleText = token.text.slice(0, visibleLength);

              return (
                <span key={tokenStart} style={{ color: token.color }}>
                  {visibleText}
                </span>
              );
            });

            // Account for newline character
            runningCharCount += lineCharOffset + 1;

            const isCurrentLine = typedCount >= lineStartIndex && typedCount <= runningCharCount;

            return (
              <div key={line.lineNumber} style={{ display: 'flex', alignItems: 'center' }}>
                {/* Line Number */}
                <div
                  style={{
                    width: '60px',
                    color: '#858585',
                    textAlign: 'right',
                    marginRight: '32px',
                    fontSize: '24px',
                    userSelect: 'none',
                  }}
                >
                  {line.lineNumber}
                </div>

                {/* Line Code Tokens */}
                <div style={{ display: 'flex', whiteSpace: 'pre', position: 'relative' }}>
                  {lineTokensToRender}

                  {/* Blinking Cursor on active typing line */}
                  {isCurrentLine && (
                    <span
                      style={{
                        opacity: isCursorVisible ? 1 : 0,
                        backgroundColor: '#AEAFAD',
                        width: '14px',
                        height: '32px',
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        marginLeft: '2px',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};
