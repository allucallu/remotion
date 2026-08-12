import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  random,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

// Load JetBrains Mono Google Font
const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export interface OutputToken {
  text: string;
  type: 'text' | 'dim' | 'highlight-green' | 'highlight-blue' | 'highlight-yellow' | 'highlight-red';
}

export interface OutputLineItem {
  tokens: OutputToken[];
}

export interface TerminalThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  textColor: string;
  dimTextColor: string;
  promptColor: string;
  cursorColor: string;
  ambientGlowColor: string;
  dotColor: string;
}

export interface TerminalCurlTypingProps {
  useGreenScreen?: boolean;
  windowTitle?: string;
  promptSymbol?: string;
  commandText?: string;
  startTypingFrame?: number;
  pauseDurationFrames?: number;
  outputLines?: OutputLineItem[];
  themeColors?: Partial<TerminalThemeColors>;
}

const DEFAULT_THEME: TerminalThemeColors = {
  panelBgColor: '#0D0D0F', // Dark Terminal Surface
  headerBgColor: '#141418', // Dark Header Surface
  borderColor: 'rgba(255, 255, 255, 0.08)',
  textColor: '#E4E4E7', // Soft Off-White
  dimTextColor: '#71717A', // Muted Gray
  promptColor: '#4ADE80', // Soft Green Prompt Symbol
  cursorColor: '#E4E4E7', // Solid Block Cursor
  ambientGlowColor: '#3B82F6', // Ambient Background Glow
  dotColor: '#52525B', // Monochrome Window Dots
};

const DEFAULT_OUTPUT_LINES: OutputLineItem[] = [
  {
    tokens: [
      { text: 'HTTP/2 ', type: 'dim' },
      { text: '200 OK', type: 'highlight-green' },
    ],
  },
  {
    tokens: [
      { text: 'content-type: ', type: 'dim' },
      { text: 'application/json', type: 'highlight-blue' },
    ],
  },
  {
    tokens: [
      { text: 'x-request-id: ', type: 'dim' },
      { text: 'req_89f021bc90a', type: 'highlight-yellow' },
    ],
  },
  {
    tokens: [
      { text: '{"status":"connected","latency_ms":14}', type: 'text' },
    ],
  },
];

/**
 * Kalkulasi array frame kemunculan tiap karakter secara deterministik
 * Menggunakan seeded pseudo-random untuk mensimulasikan ritme ketikan manusia yang alami (40ms - 90ms / 2-5 frame @60fps).
 */
export function calculateTypingCadence(
  text: string,
  startFrame: number,
  minDelayFrames: number = 2,
  maxDelayFrames: number = 5,
  seedPrefix: string = 'term-type'
): { charFrames: number[]; completionFrame: number } {
  const charFrames: number[] = [];
  let currentFrame = startFrame;

  for (let i = 0; i < text.length; i++) {
    charFrames.push(currentFrame);
    // Variasi acak berbasis seed acak karakter
    const delay = Math.round(
      interpolate(random(`${seedPrefix}-${i}`), [0, 1], [minDelayFrames, maxDelayFrames])
    );
    currentFrame += delay;
  }

  return { charFrames, completionFrame: currentFrame };
}

/**
 * TerminalCurlTyping Composition
 * Renders a high-selling stock motion graphic of terminal typing & response output logs.
 */
export const TerminalCurlTyping: React.FC<TerminalCurlTypingProps> = ({
  useGreenScreen = false,
  windowTitle = 'terminal',
  promptSymbol = '$ ',
  commandText = 'curl -X GET https://example.com/api/data',
  startTypingFrame = 24, // Frame 24 (400ms)
  pauseDurationFrames = 24, // Jeda 400ms setelah selesai ngetik sebelum output muncul
  outputLines = DEFAULT_OUTPUT_LINES,
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const theme: TerminalThemeColors = { ...DEFAULT_THEME, ...themeColors };

  // ==========================================
  // FASE 1: Window Entry Zoom-Through
  // Durasi 400ms (24 frame pada 60fps), scale 1.05 -> 1.0 & opacity 0 -> 1
  // ==========================================
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

  // ==========================================
  // FASE 2: Natural Human Typing Cadence Logic
  // Hitung frame kemunculan tiap karakter secara deterministik
  // ==========================================
  const { charFrames, completionFrame } = calculateTypingCadence(
    commandText,
    startTypingFrame,
    2,
    5,
    'curl-cmd'
  );

  // Hitung berapa banyak karakter yang sudah ter-reveal pada frame saat ini
  let revealedCharCount = 0;
  for (let i = 0; i < charFrames.length; i++) {
    if (frame >= charFrames[i]) {
      revealedCharCount = i + 1;
    } else {
      break;
    }
  }

  const currentTypedText = commandText.slice(0, revealedCharCount);
  const isTypingComplete = frame >= completionFrame;

  // ==========================================
  // FASE 3: Solid Block Cursor Blink
  // Kedip linear 500ms (15 frame ON / 15 frame OFF @60fps)
  // Cursor aktif berkedip saat idle atau jeda eksekusi
  // ==========================================
  const isCursorBlinking = Math.floor(frame / 15) % 2 === 0;

  // ==========================================
  // FASE 4: Output Log Staggered Reveal
  // Output muncul setelah completionFrame + pauseDurationFrames
  // Delay 60ms (4 frame @60fps) antar baris output
  // ==========================================
  const outputStartFrame = completionFrame + pauseDurationFrames;

  const getTokenColor = (type: OutputToken['type']): string => {
    switch (type) {
      case 'highlight-green':
        return '#4ADE80';
      case 'highlight-blue':
        return '#60A5FA';
      case 'highlight-yellow':
        return '#FBBF24';
      case 'highlight-red':
        return '#F87171';
      case 'dim':
        return theme.dimTextColor;
      case 'text':
      default:
        return theme.textColor;
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
      {/* LAYER 1: Ambient Backdrop Glow & Grid Overlay */}
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
            CLI // TERMINAL EMULATOR
          </div>
        </>
      )}

      {/* LAYER 2: Glassmorphic Terminal Window */}
      <div
        style={{
          width: '70%',
          backgroundColor: theme.panelBgColor,
          borderRadius: '16px',
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
            height: '64px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '28px',
            paddingRight: '28px',
            position: 'relative',
          }}
        >
          {/* 3 Window Dots */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: theme.dotColor }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: theme.dotColor }} />
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: theme.dotColor }} />
          </div>

          {/* Centered Window Title */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#71717A',
              fontSize: '18px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            {windowTitle}
          </div>

          <div style={{ width: '64px' }} />
        </div>

        {/* Terminal Body */}
        <div
          style={{
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            minHeight: '440px',
            fontSize: '32px',
            lineHeight: '48px',
          }}
        >
          {/* Command Line with Prompt & Snap Cursor */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: theme.promptColor, fontWeight: 700, marginRight: '16px' }}>
              {promptSymbol}
            </span>
            <span style={{ color: theme.textColor, fontWeight: 500 }}>
              {currentTypedText}
            </span>

            {/* Solid Block Cursor (Snap position right after typed text) */}
            <div
              style={{
                width: '18px',
                height: '36px',
                backgroundColor: theme.cursorColor,
                opacity: isCursorBlinking ? 0.75 : 0,
                marginLeft: '4px',
                borderRadius: '2px',
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            />
          </div>

          {/* Output Logs (Revealed Staggered after execution pause) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '20px',
              borderTop: frame >= outputStartFrame ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
              transition: 'border-color 0.2s ease',
            }}
          >
            {outputLines.map((line, lineIdx) => {
              const lineStartFrame = outputStartFrame + lineIdx * 4; // 60ms delay (4 frames @60fps)

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
                [6, 0],
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
                    gap: '8px',
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
                        color: getTokenColor(token.type),
                        fontWeight: token.type.startsWith('highlight') ? 600 : 400,
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
            <span>Shell: <span style={{ color: '#A1A1AA' }}>zsh</span></span>
            <span>Status: <span style={{ color: isTypingComplete ? '#4ADE80' : '#FBBF24', fontWeight: 600 }}>{isTypingComplete ? 'EXIT 0' : 'EXECUTING'}</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
            <span>TTY: <span style={{ color: '#A1A1AA' }}>/dev/ttys001</span></span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
