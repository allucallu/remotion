import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  Easing,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export interface StreamToken {
  text: string;
  type:
    | 'text'
    | 'highlight-blue'
    | 'highlight-green'
    | 'highlight-yellow'
    | 'highlight-pink'
    | 'highlight-purple'
    | 'punctuation';
}

export interface StreamLineItem {
  indent: number;
  tokens: StreamToken[];
}

export interface StreamThemeColors {
  mainTextColor: string;
  highlightBlue: string;
  highlightGreen: string;
  highlightYellow: string;
  highlightPink: string;
  highlightPurple: string;
  punctuationColor: string;
  lineNumberColor: string;
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  dotColor: string;
  cursorColor: string;
  ambientGlowColor: string;
}

export interface DigitalDataStreamBackgroundProps {
  useGreenScreen?: boolean;
  headerLabel?: string;
  fontSize?: number;
  lineHeight?: number;
  panelWidthRatio?: number;
  panelBorderRadius?: number;
  startFrame?: number;
  staggerDelayFrames?: number;
  lineAnimationDurationFrames?: number;
  tokenFadeDurationFrames?: number;
  cursorBlinkIntervalFrames?: number;
  enableLoopCrossfade?: boolean;
  loopCrossfadeDurationFrames?: number;
  themeColors?: Partial<StreamThemeColors>;
  streamData?: StreamLineItem[];
}

const DEFAULT_THEME: StreamThemeColors = {
  mainTextColor: '#E4E4E7', // Soft Off-White
  highlightBlue: '#60A5FA', // Soft Blue
  highlightGreen: '#4ADE80', // Soft Green
  highlightYellow: '#FBBF24', // Soft Mustard Yellow
  highlightPink: '#F472B6', // Soft Pink
  highlightPurple: '#A78BFA', // Soft Purple
  punctuationColor: '#E4E4E7', // Soft Off-White
  lineNumberColor: '#71717A', // Muted Gray
  panelBgColor: '#0F0F13', // Deep Dark Panel
  headerBgColor: '#16161A', // Dark Glass Header
  borderColor: 'rgba(255, 255, 255, 0.08)', // Glass Border
  dotColor: '#52525B', // Monochrome Dots
  cursorColor: '#60A5FA', // Soft Glowing Cursor
  ambientGlowColor: '#3B82F6', // Ambient Cyan/Blue Glow
};

const DEFAULT_STREAM_DATA: StreamLineItem[] = [
  {
    indent: 0,
    tokens: [
      { text: '[', type: 'punctuation' },
      { text: 'SYSTEM_INIT', type: 'highlight-blue' },
      { text: ']', type: 'punctuation' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: 'stream_id', type: 'text' },
      { text: ' -> ', type: 'punctuation' },
      { text: '0x8F92A10B', type: 'highlight-yellow' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: 'status', type: 'text' },
      { text: ': ', type: 'punctuation' },
      { text: 'ACTIVE', type: 'highlight-green' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: 'payload', type: 'text' },
      { text: ' {', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: 'cycle_count', type: 'text' },
      { text: ': ', type: 'punctuation' },
      { text: '142850', type: 'highlight-yellow' },
      { text: ';', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: 'bandwidth', type: 'text' },
      { text: ': ', type: 'punctuation' },
      { text: '"10.4 Gbps"', type: 'highlight-green' },
      { text: ';', type: 'punctuation' },
    ],
  },
  {
    indent: 2,
    tokens: [
      { text: 'node_matrix', type: 'text' },
      { text: ' [', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: 'node_01', type: 'highlight-blue' },
      { text: ': ', type: 'punctuation' },
      { text: 'SYNCED', type: 'highlight-green' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: 'node_02', type: 'highlight-blue' },
      { text: ': ', type: 'punctuation' },
      { text: 'SYNCED', type: 'highlight-green' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 3,
    tokens: [
      { text: 'node_03', type: 'highlight-blue' },
      { text: ': ', type: 'punctuation' },
      { text: 'STANDBY', type: 'highlight-pink' },
    ],
  },
  {
    indent: 2,
    tokens: [{ text: '];', type: 'punctuation' }],
  },
  {
    indent: 2,
    tokens: [
      { text: 'encryption_hash', type: 'text' },
      { text: ': ', type: 'punctuation' },
      { text: '"a3f901c890bd"', type: 'highlight-green' },
    ],
  },
  {
    indent: 1,
    tokens: [{ text: '}', type: 'punctuation' }],
  },
  {
    indent: 1,
    tokens: [
      { text: 'stream_health', type: 'text' },
      { text: ' -> ', type: 'punctuation' },
      { text: '100%', type: 'highlight-green' },
    ],
  },
  {
    indent: 0,
    tokens: [
      { text: '[', type: 'punctuation' },
      { text: 'END_OF_STREAM', type: 'highlight-blue' },
      { text: ']', type: 'punctuation' },
    ],
  },
];

export const DigitalDataStreamBackground: React.FC<DigitalDataStreamBackgroundProps> = ({
  useGreenScreen = false,
  headerLabel = 'SYSTEM',
  fontSize = 36,
  lineHeight = 60,
  panelWidthRatio = 0.7,
  panelBorderRadius = 24,
  startFrame = 24,
  staggerDelayFrames = 6,
  lineAnimationDurationFrames = 18,
  tokenFadeDurationFrames = 12,
  cursorBlinkIntervalFrames = 30,
  enableLoopCrossfade = true,
  loopCrossfadeDurationFrames = 30,
  themeColors = {},
  streamData = DEFAULT_STREAM_DATA,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const theme: StreamThemeColors = { ...DEFAULT_THEME, ...themeColors };

  const panelEasing = Easing.bezier(0.16, 1, 0.3, 1);

  const entryOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const panelScale = interpolate(frame, [0, 24], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const exitStartFrame = durationInFrames - loopCrossfadeDurationFrames;
  const loopOpacity = enableLoopCrossfade
    ? interpolate(frame, [exitStartFrame, durationInFrames], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      })
    : 1;

  const totalPanelOpacity = entryOpacity * loopOpacity;

  const activeLineIndex = Math.min(
    streamData.length - 1,
    Math.max(
      0,
      Math.floor((frame - startFrame) / Math.max(1, staggerDelayFrames))
    )
  );

  const isCursorVisible =
    frame >= startFrame &&
    Math.floor(frame / (cursorBlinkIntervalFrames / 2)) % 2 === 0;

  const getTokenTargetColor = (type: StreamToken['type']): string => {
    switch (type) {
      case 'highlight-blue':
        return theme.highlightBlue;
      case 'highlight-green':
        return theme.highlightGreen;
      case 'highlight-yellow':
        return theme.highlightYellow;
      case 'highlight-pink':
        return theme.highlightPink;
      case 'highlight-purple':
        return theme.highlightPurple;
      case 'punctuation':
        return theme.punctuationColor;
      case 'text':
      default:
        return theme.mainTextColor;
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
      {/* LAYER 1: Ambient Glow & Grid */}
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
            DATA STREAM // GENERIC PROCESS
          </div>
        </>
      )}

      {/* LAYER 2: Glassmorphic Panel Window Container */}
      <div
        style={{
          width: `${panelWidthRatio * 100}%`,
          backgroundColor: theme.panelBgColor,
          borderRadius: `${panelBorderRadius}px`,
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 50px 120px rgba(0, 0, 0, 0.8), 0 16px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          opacity: totalPanelOpacity,
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
          {/* 3 Monochrome Controls */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: theme.dotColor, opacity: 0.8 }} />
          </div>

          {/* Centered Generic Header Title */}
          {headerLabel && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#A1A1AA',
                fontSize: '22px',
                fontWeight: 500,
                letterSpacing: '2px',
              }}
            >
              {headerLabel}
            </div>
          )}

          {/* Status Badge Tag */}
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#60A5FA',
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              letterSpacing: '1px',
            }}
          >
            LIVE STREAM
          </div>
        </div>

        {/* Body Panel: Data Lines & Numbers */}
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
          {streamData.map((line, lineIdx) => {
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
            const isLastLine = lineIdx === streamData.length - 1;
            const allLinesRevealed = frame >= startFrame + streamData.length * staggerDelayFrames;

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

                {/* Stream Data Line Content */}
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
                      [theme.mainTextColor, targetColor]
                    );

                    return (
                      <span
                        key={tokenIdx}
                        style={{
                          color: animatedColor,
                          fontWeight: token.type.startsWith('highlight') ? 500 : 400,
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

        {/* Supporting Footer Telemetry Bar */}
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
            <span>Lines: <span style={{ color: '#A1A1AA' }}>{streamData.length}</span></span>
            <span>Protocol: <span style={{ color: '#A1A1AA' }}>SSE / HTTP2</span></span>
            <span>Sync: <span style={{ color: '#4ADE80', fontWeight: 600 }}>100%</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
            <span>Health: <span style={{ color: '#4ADE80', fontWeight: 600 }}>OPTIMAL</span></span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
