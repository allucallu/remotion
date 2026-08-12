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

export interface TickerRowData {
  id?: string;
  label: string;
  initialValue: number;
  volatility: number;
  decimals?: number;
  unit?: string;
}

export interface TickerThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  labelColor: string;
  textColor: string;
  upColor: string;
  downColor: string;
  ambientGlowColor: string;
}

export interface RealtimeDataTickerProps {
  useGreenScreen?: boolean;
  headerTitle?: string;
  containerWidthRatio?: number;
  fontSize?: number;
  lineHeight?: number;
  rows?: TickerRowData[];
  themeColors?: Partial<TickerThemeColors>;
}

const DEFAULT_THEME: TickerThemeColors = {
  panelBgColor: '#0F0F13',
  headerBgColor: '#16161A',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  labelColor: '#71717A', // Muted Gray
  textColor: '#E4E4E7', // Soft Off-White
  upColor: '#4ADE80', // Soft Green
  downColor: '#F87171', // Soft Red / Coral
  ambientGlowColor: '#3B82F6',
};

const DEFAULT_ROWS: TickerRowData[] = [
  {
    label: 'LATENCY_MS',
    initialValue: 14.2,
    volatility: 1.5,
    decimals: 1,
    unit: ' ms',
  },
  {
    label: 'THROUGHPUT',
    initialValue: 840.5,
    volatility: 12.0,
    decimals: 1,
    unit: ' MB/s',
  },
  {
    label: 'ACTIVE_NODES',
    initialValue: 128,
    volatility: 2,
    decimals: 0,
    unit: ' nodes',
  },
  {
    label: 'CPU_LOAD',
    initialValue: 42.8,
    volatility: 3.5,
    decimals: 1,
    unit: '%',
  },
  {
    label: 'ERROR_RATE',
    initialValue: 0.04,
    volatility: 0.02,
    decimals: 2,
    unit: '%',
  },
];

export interface RowStateAtFrame {
  currentValue: number;
  prevValue: number;
  lastDirection: 'up' | 'down' | 'none';
  framesSinceUpdate: number;
  historyPoints: number[];
}

/**
 * Pre-kalkulasi state nilai & riwayat tren deterministik per baris ticker.
 */
export function getRowStateAtFrame(
  row: TickerRowData,
  rowIndex: number,
  frame: number
): RowStateAtFrame {
  let currentVal = row.initialValue;
  let lastDirection: 'up' | 'down' | 'none' = 'none';
  let updateFrames: number[] = [0];
  let valuesHistory: number[] = [row.initialValue];

  let f = 0;
  let step = 0;

  while (f < 600) {
    const interval = Math.round(
      interpolate(random(`interval-${rowIndex}-${step}`), [0, 1], [24, 48])
    );
    f += interval;
    updateFrames.push(f);

    const delta = interpolate(
      random(`delta-${rowIndex}-${step}`),
      [0, 1],
      [-row.volatility, row.volatility]
    );

    let nextVal = currentVal + delta;
    if (row.initialValue > 0 && nextVal < 0) {
      nextVal = Math.abs(nextVal);
    }

    valuesHistory.push(nextVal);
    currentVal = nextVal;
    step++;
  }

  let activeStep = 0;
  for (let i = 0; i < updateFrames.length; i++) {
    if (frame >= updateFrames[i]) {
      activeStep = i;
    } else {
      break;
    }
  }

  const activeValue = valuesHistory[activeStep];
  const prevValue = activeStep > 0 ? valuesHistory[activeStep - 1] : row.initialValue;
  const lastUpdateFrame = updateFrames[activeStep];
  const framesSinceUpdate = frame - lastUpdateFrame;

  if (activeStep > 0) {
    lastDirection = activeValue >= prevValue ? 'up' : 'down';
  }

  // Extract last 6 history points for SVG sparkline graph
  const startIndex = Math.max(0, activeStep - 5);
  const historyPoints = valuesHistory.slice(startIndex, activeStep + 1);

  return {
    currentValue: activeValue,
    prevValue,
    lastDirection,
    framesSinceUpdate,
    historyPoints,
  };
}

/**
 * Triangle Indicator Arrow Component
 */
const DirectionTriangle: React.FC<{ direction: 'up' | 'down'; color: string }> = ({
  direction,
  color,
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={color}
    style={{
      transform: direction === 'down' ? 'rotate(180deg)' : 'none',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '8px',
    }}
  >
    <polygon points="12 4 22 20 2 20" />
  </svg>
);

/**
 * Mini Sparkline Trend Graph SVG Component
 */
const SparklineGraph: React.FC<{ points: number[]; color: string }> = ({
  points,
  color,
}) => {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 140;
  const height = 36;
  const stepX = width / (points.length - 1);

  const svgPoints = points
    .map((val, idx) => {
      const x = idx * stepX;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={svgPoints}
        opacity={0.8}
      />
    </svg>
  );
};

export const RealtimeDataTicker: React.FC<RealtimeDataTickerProps> = ({
  useGreenScreen = false,
  headerTitle = 'LIVE METRICS TICKER',
  containerWidthRatio = 0.7,
  fontSize = 30,
  lineHeight = 76,
  rows = DEFAULT_ROWS,
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const theme: TickerThemeColors = { ...DEFAULT_THEME, ...themeColors };

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
      {/* LAYER 1: Ambient Background Glow & Grid Overlay */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2600px',
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
            METRICS // REALTIME TICKER (8.0s)
          </div>
        </>
      )}

      {/* LAYER 2: Glassmorphic Ticker Panel Container */}
      <div
        style={{
          width: `${containerWidthRatio * 100}%`,
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
        {/* Header Bar */}
        <div
          style={{
            height: '76px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '36px',
            paddingRight: '36px',
            position: 'relative',
          }}
        >
          {/* 3 Window Dots */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
          </div>

          {/* Centered Header Title */}
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
            {headerTitle}
          </div>

          {/* Status Tag */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#4ADE80',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              border: '1px solid rgba(74, 222, 128, 0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
            <span>REALTIME</span>
          </div>
        </div>

        {/* Ticker Rows Container */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {rows.map((row, rowIdx) => {
            const rowState = getRowStateAtFrame(row, rowIdx, frame);
            const isLast = rowIdx === rows.length - 1;

            const decimals = row.decimals ?? 2;
            const formattedVal = `${rowState.currentValue.toFixed(decimals)}${row.unit || ''}`;

            const deltaVal = rowState.currentValue - rowState.prevValue;
            const deltaPercent = rowState.prevValue !== 0 ? (deltaVal / rowState.prevValue) * 100 : 0;
            const formattedDelta = `${deltaVal >= 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`;

            const dirColor = rowState.lastDirection === 'up' ? theme.upColor : theme.downColor;

            // Flash Backdrop Animation
            let flashOpacity = 0;
            if (rowState.framesSinceUpdate <= 24 && rowState.lastDirection !== 'none') {
              if (rowState.framesSinceUpdate <= 6) {
                flashOpacity = interpolate(
                  rowState.framesSinceUpdate,
                  [0, 6],
                  [0, 0.12],
                  { easing: Easing.out(Easing.quad) }
                );
              } else {
                flashOpacity = interpolate(
                  rowState.framesSinceUpdate,
                  [6, 24],
                  [0.12, 0],
                  { easing: Easing.in(Easing.quad) }
                );
              }
            }

            // Direction Triangle Animation
            let indicatorOpacity = 0;
            let indicatorScale = 1.0;

            if (rowState.framesSinceUpdate <= 30 && rowState.lastDirection !== 'none') {
              if (rowState.framesSinceUpdate <= 6) {
                indicatorOpacity = interpolate(rowState.framesSinceUpdate, [0, 6], [0, 1]);
                indicatorScale = interpolate(rowState.framesSinceUpdate, [0, 6], [0.8, 1.0]);
              } else if (rowState.framesSinceUpdate <= 18) {
                indicatorOpacity = 1;
                indicatorScale = 1.0;
              } else {
                indicatorOpacity = interpolate(rowState.framesSinceUpdate, [18, 30], [1, 0]);
                indicatorScale = 1.0;
              }
            }

            return (
              <div
                key={rowIdx}
                style={{
                  height: `${lineHeight}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: '48px',
                  paddingRight: '48px',
                  borderBottom: isLast ? 'none' : `1px solid ${theme.borderColor}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Flash Tint Backdrop */}
                {flashOpacity > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: dirColor,
                      opacity: flashOpacity,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Left Column: Metric Label & Sparkline Graph */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div
                    style={{
                      color: theme.labelColor,
                      fontSize: `${fontSize}px`,
                      fontWeight: 500,
                      letterSpacing: '1.5px',
                      width: '240px',
                    }}
                  >
                    {row.label}
                  </div>

                  {/* Sparkline Mini Graph */}
                  <SparklineGraph points={rowState.historyPoints} color={dirColor} />
                </div>

                {/* Right Column: Delta Badge, Direction Triangle & SNAP Value */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {rowState.lastDirection !== 'none' && (
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: dirColor,
                        backgroundColor: `${dirColor}15`,
                        border: `1px solid ${dirColor}30`,
                        padding: '4px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      {formattedDelta}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {indicatorOpacity > 0 && (
                      <div
                        style={{
                          opacity: indicatorOpacity,
                          transform: `scale(${indicatorScale})`,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <DirectionTriangle
                          direction={rowState.lastDirection === 'up' ? 'up' : 'down'}
                          color={dirColor}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        color: rowState.framesSinceUpdate <= 12 ? dirColor : theme.textColor,
                        fontSize: `${fontSize * 1.15}px`,
                        fontWeight: 700,
                        letterSpacing: '1px',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {formattedVal}
                    </div>
                  </div>
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
            paddingLeft: '36px',
            paddingRight: '36px',
            fontSize: '14px',
            color: '#71717A',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Metrics: <span style={{ color: '#A1A1AA' }}>{rows.length} Active</span></span>
            <span>Update Mode: <span style={{ color: '#A1A1AA' }}>ASYNC RANDOM WALK</span></span>
          </div>

          <div>
            Stream Status: <span style={{ color: '#4ADE80', fontWeight: 600 }}>100% ONLINE</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
