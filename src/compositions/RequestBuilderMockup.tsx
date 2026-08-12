import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ResponseToken {
  text: string;
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation';
}

export interface ResponseLineItem {
  indent: number;
  tokens: ResponseToken[];
}

export interface RequestBuilderThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  responseBgColor: string;
  borderColor: string;
  urlBarBgColor: string;
  textColor: string;
  placeholderColor: string;
  sendButtonBg: string;
  sendButtonText: string;
  ambientGlowColor: string;
}

export interface RequestBuilderMockupProps {
  useGreenScreen?: boolean;
  method?: HTTPMethod;
  urlPath?: string;
  sendButtonLabel?: string;
  sendClickFrame?: number;
  responseStatusText?: string;
  responseTimeText?: string;
  responseSizeText?: string;
  activeTabName?: string;
  responseBodyLines?: ResponseLineItem[];
  themeColors?: Partial<RequestBuilderThemeColors>;
}

const DEFAULT_THEME: RequestBuilderThemeColors = {
  panelBgColor: '#0F0F13',
  headerBgColor: '#16161A',
  responseBgColor: '#0C0C0F',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  urlBarBgColor: '#1A1A20',
  textColor: '#E4E4E7',
  placeholderColor: '#71717A',
  sendButtonBg: '#3B82F6',
  sendButtonText: '#FFFFFF',
  ambientGlowColor: '#3B82F6',
};

const DEFAULT_RESPONSE_LINES: ResponseLineItem[] = [
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
      { text: '"message"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '"Request processed successfully"', type: 'string' },
      { text: ',', type: 'punctuation' },
    ],
  },
  {
    indent: 1,
    tokens: [
      { text: '"execution_time_ms"', type: 'key' },
      { text: ': ', type: 'punctuation' },
      { text: '18.4', type: 'number' },
    ],
  },
  { indent: 0, tokens: [{ text: '}', type: 'punctuation' }] },
];

/**
 * RequestBuilderMockup Composition
 * Upgraded duration to 360 frames (6.0 seconds @ 60fps).
 */
export const RequestBuilderMockup: React.FC<RequestBuilderMockupProps> = ({
  useGreenScreen = false,
  method = 'GET',
  urlPath = 'https://api.cloud.internal/v1/resource',
  sendButtonLabel = 'Send',
  sendClickFrame = 180, // Frame 180 (3.0s) trigger click
  responseStatusText = '200 OK',
  responseTimeText = '18.4 ms',
  responseSizeText = '1.4 KB',
  activeTabName = 'Params',
  responseBodyLines = DEFAULT_RESPONSE_LINES,
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const theme: RequestBuilderThemeColors = { ...DEFAULT_THEME, ...themeColors };

  const getMethodStyle = (m: HTTPMethod) => {
    switch (m) {
      case 'POST':
        return { color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.12)', border: 'rgba(74, 222, 128, 0.3)' };
      case 'PUT':
        return { color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.3)' };
      case 'DELETE':
        return { color: '#F87171', bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.3)' };
      case 'GET':
      default:
        return { color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)', border: 'rgba(96, 165, 250, 0.3)' };
    }
  };

  const methodStyle = getMethodStyle(method);

  // Panel Entry Zoom-Through
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

  // Cursor blink
  const isCursorVisible = Math.floor(frame / 15) % 2 === 0;

  // Send button click feedback
  const clickDuration = 12;
  const clickProgress = interpolate(
    frame,
    [sendClickFrame, sendClickFrame + clickDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    }
  );

  const sendButtonScale =
    frame >= sendClickFrame && frame <= sendClickFrame + clickDuration
      ? interpolate(clickProgress, [0, 0.5, 1], [1.0, 0.94, 1.0])
      : 1.0;

  // Response Panel Slide-In
  const responseStartFrame = sendClickFrame + 6;
  const responseDuration = 21;

  const responseOpacity = interpolate(
    frame,
    [responseStartFrame, responseStartFrame + responseDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: panelEasing,
    }
  );

  const responseTranslateY = interpolate(
    frame,
    [responseStartFrame, responseStartFrame + responseDuration],
    [30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: panelEasing,
    }
  );

  // Status badge scale pop
  const badgeStartFrame = responseStartFrame + 6;
  const badgeProgress = interpolate(
    frame,
    [badgeStartFrame, badgeStartFrame + 12],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const badgeScale = interpolate(badgeProgress, [0, 1], [0.9, 1.0]);
  const badgeOpacity = interpolate(badgeProgress, [0, 1], [0, 1]);

  const getTokenTargetColor = (type: ResponseToken['type']): string => {
    switch (type) {
      case 'key':
        return '#60A5FA';
      case 'string':
        return '#4ADE80';
      case 'number':
        return '#FBBF24';
      case 'boolean':
        return '#F472B6';
      case 'null':
        return '#A78BFA';
      case 'punctuation':
      default:
        return '#E4E4E7';
    }
  };

  const tabs = ['Params', 'Headers', 'Body', 'Auth'];

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
      {/* Ambient Backdrop Glow & Grid */}
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
              background: `radial-gradient(ellipse at center, ${theme.ambientGlowColor}14 0%, transparent 65%)`,
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
            FRAMEWORK // GENERIC (6.0s)
          </div>
        </>
      )}

      {/* Main Glassmorphic Panel Container */}
      <div
        style={{
          width: '70%',
          backgroundColor: theme.panelBgColor,
          borderRadius: '24px',
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
        {/* TOP SECTION: Window Bar & Request Builder Row */}
        <div
          style={{
            padding: '32px 40px 24px 40px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Controls Bar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            </div>

            <div style={{ color: '#A1A1AA', fontSize: '20px', fontWeight: 500, letterSpacing: '1px' }}>
              REQUEST BUILDER
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4ADE80', backgroundColor: 'rgba(74,222,128,0.1)', padding: '4px 12px', borderRadius: '9999px', border: '1px solid rgba(74,222,128,0.2)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
              <span>ONLINE</span>
            </div>
          </div>

          {/* Request Input Builder Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                padding: '16px 28px',
                borderRadius: '14px',
                backgroundColor: methodStyle.bg,
                border: `1.5px solid ${methodStyle.border}`,
                color: methodStyle.color,
                fontSize: '24px',
                fontWeight: 700,
                letterSpacing: '1px',
                userSelect: 'none',
              }}
            >
              {method}
            </div>

            <div
              style={{
                flex: 1,
                height: '64px',
                borderRadius: '14px',
                backgroundColor: theme.urlBarBgColor,
                border: `1px solid ${theme.borderColor}`,
                paddingLeft: '24px',
                paddingRight: '24px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '24px',
                color: theme.textColor,
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.4) inset',
              }}
            >
              <span>{urlPath}</span>
              <div
                style={{
                  width: '3px',
                  height: '28px',
                  backgroundColor: '#60A5FA',
                  marginLeft: '4px',
                  opacity: isCursorVisible ? 1 : 0,
                  boxShadow: isCursorVisible ? '0 0 10px #60A5FA' : 'none',
                }}
              />
            </div>

            <div
              style={{
                padding: '16px 36px',
                borderRadius: '14px',
                backgroundColor: theme.sendButtonBg,
                color: theme.sendButtonText,
                fontSize: '24px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.35)',
                transform: `scale(${sendButtonScale})`,
                transition: 'transform 0.1s ease',
                userSelect: 'none',
              }}
            >
              {sendButtonLabel}
            </div>
          </div>

          {/* Navigation Tab Bar Supporting Element */}
          <div style={{ display: 'flex', gap: '24px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {tabs.map((tab, idx) => {
              const isActive = tab === activeTabName;
              return (
                <div
                  key={idx}
                  style={{
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#60A5FA' : '#71717A',
                    borderBottom: isActive ? '2px solid #60A5FA' : '2px solid transparent',
                    paddingBottom: '8px',
                    letterSpacing: '0.5px',
                  }}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM SECTION: Response Viewer Panel */}
        <div
          style={{
            padding: '36px 40px',
            backgroundColor: theme.responseBgColor,
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            opacity: responseOpacity,
            transform: `translateY(${responseTranslateY}px)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(74, 222, 128, 0.12)',
                  border: '1.5px solid rgba(74, 222, 128, 0.3)',
                  color: '#4ADE80',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  opacity: badgeOpacity,
                  transform: `scale(${badgeScale})`,
                }}
              >
                {responseStatusText}
              </div>
              <div style={{ color: '#71717A', fontSize: '18px', opacity: badgeOpacity }}>
                Response Payload
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', opacity: badgeOpacity }}>
              <div style={{ fontSize: '15px', color: '#A1A1AA', backgroundColor: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                TIME: <span style={{ color: '#FBBF24', fontWeight: 600 }}>{responseTimeText}</span>
              </div>
              <div style={{ fontSize: '15px', color: '#A1A1AA', backgroundColor: 'rgba(255,255,255,0.04)', padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                SIZE: <span style={{ color: '#60A5FA', fontWeight: 600 }}>{responseSizeText}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {responseBodyLines.map((line, lineIdx) => {
              const lineStartFrame = responseStartFrame + 18 + lineIdx * 5;

              const lineOpacity = interpolate(
                frame,
                [lineStartFrame, lineStartFrame + 15],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              const lineTranslateY = interpolate(
                frame,
                [lineStartFrame, lineStartFrame + 15],
                [8, 0],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              return (
                <div
                  key={lineIdx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: `${line.indent * 40}px`,
                    opacity: lineOpacity,
                    transform: `translateY(${lineTranslateY}px)`,
                    fontSize: '28px',
                    whiteSpace: 'pre',
                  }}
                >
                  {line.tokens.map((token, tokenIdx) => (
                    <span
                      key={tokenIdx}
                      style={{
                        color: getTokenTargetColor(token.type),
                        fontWeight: token.type === 'key' ? 500 : 400,
                      }}
                    >
                      {token.text}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
