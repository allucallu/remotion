import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export interface JSONToken {
  text: string;
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'whitespace';
}

export interface JSONLineItem {
  indent: number;
  tokens: JSONToken[];
}

export interface JSONThemeColors {
  keyColor: string;
  stringValueColor: string;
  numberValueColor: string;
  booleanValueColor: string;
  nullValueColor: string;
  punctuationColor: string;
  lineNumberColor: string;
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  dotColor: string;
  cursorColor: string;
  ambientGlowColor: string;
}

export interface LiveJSONResponseStreamProps {
  useGreenScreen?: boolean;
  fileName?: string;
  fontSize?: number;
  lineHeight?: number;
  panelWidthRatio?: number;
  panelBorderRadius?: number;
  startFrame?: number;
  staggerDelayFrames?: number;
  lineAnimationDurationFrames?: number;
  tokenFadeDurationFrames?: number;
  cursorBlinkIntervalFrames?: number;
  themeColors?: Partial<JSONThemeColors>;
  jsonData?: JSONLineItem[];
}

const DEFAULT_THEME: JSONThemeColors = {
  keyColor: '#60A5FA', // Soft Blue
  stringValueColor: '#4ADE80', // Soft Green
  numberValueColor: '#FBBF24', // Soft Mustard Yellow
  booleanValueColor: '#F472B6', // Soft Pink
  nullValueColor: '#A78BFA', // Soft Purple
  punctuationColor: '#E4E4E7', // Soft Off-White
  lineNumberColor: '#71717A', // Muted Gray
  panelBgColor: '#0F0F13', // Deep Dark Panel
  headerBgColor: '#16161A', // Dark Glass Header
  borderColor: 'rgba(255, 255, 255, 0.08)', // Subtle Glass Border
  dotColor: '#52525B', // Monochrome Dots
  cursorColor: '#60A5FA', // Glowing Soft Blue Cursor
  ambientGlowColor: '#3B82F6', // Ambient Blue Glow
};

const DEFAULT_JSON_DATA: JSONLineItem[] = [
  { indent: 0, tokens: [{ text: '{', type: 'punctuation' }] },
  {
    indent: 1,
    tokens: [
      { text: '"status"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '200', type: 'number' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: '"statusText"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"OK"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: '"data"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '{', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: '"event"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"user.authenticated"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: '"timestamp"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '1776041215', type: 'number' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: '"user"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '{', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: '"id"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"usr_99x82f0a"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: '"email"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"alex.dev@cloud.internal"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: '"role"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"administrator"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: '"verified"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: 'true', type: 'boolean' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: '}', type: 'punctuation' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: '"rate_limit_remaining"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '4998', type: 'number' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: '}', type: 'punctuation' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: '"signature"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"sha256_e3b0c442"', type: 'string' },
    ],
  },
  { indent: 0, tokens: [{ text: '}', type: 'punctuation' }] },
];

export const LiveJSONResponseStream: React.FC<LiveJSONResponseStreamProps> = ({
  useGreenScreen = false,
  fileName = 'response.json',
  fontSize = 36,
  lineHeight = 60,
  panelWidthRatio = 0.7,
  panelBorderRadius = 24,
  startFrame = 24,
  staggerDelayFrames = 6,
  lineAnimationDurationFrames = 18,
  tokenFadeDurationFrames = 12,
  cursorBlinkIntervalFrames = 30,
  themeColors = {},
  jsonData = DEFAULT_JSON_DATA,
}) => {
  const frame = useCurrentFrame();
  const theme: JSONThemeColors = { ...DEFAULT_THEME, ...themeColors };

  const panelEasing = Easing.bezier(0.16, 1, 0.3, 1);

  const panelOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const panelScale = interpolate(frame, [0, 24], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const activeLineIndex = Math.min(
    jsonData.length - 1,
    Math.max(
      0,
      Math.floor((frame - startFrame) / Math.max(1, staggerDelayFrames))
    )
  );

  const isCursorVisible =
    frame >= startFrame &&
    Math.floor(frame / (cursorBlinkIntervalFrames / 2)) % 2 === 0;

  const getTokenTargetColor = (type: JSONToken['type']): string => {
    switch (type) {
      case 'key':
        return theme.keyColor;
      case 'string':
        return theme.stringValueColor;
      case 'number':
        return theme.numberValueColor;
      case 'boolean':
        return theme.booleanValueColor;
      case 'null':
        return theme.nullValueColor;
      case 'punctuation':
      default:
        return theme.punctuationColor;
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LAYER 1: Subtle Ambient Glow & Tech Grid */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2400px',
              height: '1400px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse at center, ${theme.ambientGlowColor}14 0%, ${theme.ambientGlowColor}04 45%, transparent 70%)`,
              filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Tech Marks */}
          <div style={{ position: 'absolute', top: '48px', left: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            + 00:38:40 / 4K UHD
          </div>
          <div style={{ position: 'absolute', top: '48px', right: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            JSON // REALTIME STREAM
          </div>
        </>
      )}

      {/* LAYER 2: Glassmorphic IDE Code Window Container */}
      <div
        style={{
          width: `${panelWidthRatio * 100}%`,
          backgroundColor: theme.panelBgColor,
          borderRadius: `${panelBorderRadius}px`,
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 50px 120px rgba(0, 0, 0, 0.8), 0 16px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          opacity: panelOpacity,
          transform: `scale(${panelScale})`,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            height: '76px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '32px',
            paddingRight: '32px',
            position: 'relative',
          }}
        >
          {/* 3 Window Controls */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
          </div>

          {/* Centered File Title Label */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#A1A1AA',
              fontSize: '24px',
              fontWeight: 500,
              letterSpacing: '0.5px',
            }}
          >
            {fileName}
          </div>

          {/* Status Tag */}
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#4ADE80',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              letterSpacing: '1px',
            }}
          >
            STREAMING
          </div>
        </div>

        {/* Body Panel: Code Lines & Numbers */}
        <div
          style={{
            paddingTop: '48px',
            paddingBottom: '48px',
            paddingLeft: '48px',
            paddingRight: '48px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {jsonData.map((line, lineIdx) => {
            const lineStartFrame = startFrame + lineIdx * staggerDelayFrames;

            const lineOpacity = interpolate(
              frame,
              [lineStartFrame, lineStartFrame + lineAnimationDurationFrames],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: panelEasing,
              }
            );

            const lineTranslateY = interpolate(
              frame,
              [lineStartFrame, lineStartFrame + lineAnimationDurationFrames],
              [10, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: panelEasing,
              }
            );

            const isLineActive = lineIdx === activeLineIndex;
            const isLastLine = lineIdx === jsonData.length - 1;
            const allLinesRevealed = frame >= startFrame + jsonData.length * staggerDelayFrames;

            return (
              <div
                key={lineIdx}
                style={{
                  height: `${lineHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  opacity: lineOpacity,
                  transform: `translateY(${lineTranslateY}px)`,
                  fontSize: `${fontSize}px`,
                  whiteSpace: 'pre',
                  borderRadius: '6px',
                  backgroundColor:
                    isLineActive && !allLinesRevealed
                      ? 'rgba(96, 165, 250, 0.04)'
                      : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                {/* Line Numbers Column */}
                <div
                  style={{
                    width: '80px',
                    textAlign: 'right',
                    paddingRight: '40px',
                    color: theme.lineNumberColor,
                    opacity: 0.4,
                    userSelect: 'none',
                    fontWeight: 400,
                  }}
                >
                  {lineIdx + 1}
                </div>

                {/* Code Content Line */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: `${line.indent * 48}px`,
                  }}
                >
                  {line.tokens.map((token, tokenIdx) => {
                    const targetColor = getTokenTargetColor(token.type);

                    const tokenColorProgress = interpolate(
                      frame,
                      [
                        lineStartFrame,
                        lineStartFrame + tokenFadeDurationFrames,
                      ],
                      [0, 1],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.bezier(0.42, 0, 0.58, 1),
                      }
                    );

                    const animatedColor = interpolateColors(
                      tokenColorProgress,
                      [0, 1],
                      [theme.punctuationColor, targetColor]
                    );

                    return (
                      <span
                        key={tokenIdx}
                        style={{
                          color: animatedColor,
                          fontWeight: token.type === 'key' ? 500 : 400,
                        }}
                      >
                        {token.text}
                      </span>
                    );
                  })}

                  {/* Glowing Vertical Cursor */}
                  {((isLineActive && !allLinesRevealed) || (isLastLine && allLinesRevealed)) && (
                    <div
                      style={{
                        width: '4px',
                        height: `${fontSize * 0.9}px`,
                        backgroundColor: theme.cursorColor,
                        marginLeft: '6px',
                        opacity: isCursorVisible ? 1 : 0,
                        borderRadius: '2px',
                        boxShadow: isCursorVisible
                          ? `0 0 16px ${theme.cursorColor}, 0 0 6px ${theme.cursorColor}`
                          : 'none',
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Supporting Footer Metadata Status Bar */}
        <div
          style={{
            height: '44px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderTop: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '32px',
            paddingRight: '32px',
            fontSize: '14px',
            color: '#71717A',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Lines: <span style={{ color: '#A1A1AA' }}>{jsonData.length}</span></span>
            <span>Encoding: <span style={{ color: '#A1A1AA' }}>UTF-8</span></span>
            <span>Size: <span style={{ color: '#A1A1AA' }}>1.4 KB</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
            <span>Transfer: <span style={{ color: '#60A5FA', fontWeight: 600 }}>840 KB/s</span></span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
