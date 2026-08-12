import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

// Load JetBrains Mono Google Font
const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type PanelPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface InspectorItem {
  id?: string;
  label: string;
  value: string | number;
  isCounter?: boolean;
  startCounterValue?: number;
  unit?: string;
  valueColor?: string;
  dotColor?: string;
}

export interface InspectorThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  labelColor: string;
  textColor: string;
  liveDotColor: string;
  ambientGlowColor: string;
}

export interface HeaderInspectorPanelProps {
  useGreenScreen?: boolean;
  panelPosition?: PanelPosition;
  headerTitle?: string;
  panelWidth?: number;
  fontSize?: number;
  items?: InspectorItem[];
  themeColors?: Partial<InspectorThemeColors>;
}

const DEFAULT_THEME: InspectorThemeColors = {
  panelBgColor: 'rgba(17, 17, 19, 0.92)', // Translucent Glass Surface
  headerBgColor: 'rgba(24, 24, 28, 0.95)',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  labelColor: '#71717A', // Muted Gray Label
  textColor: '#E4E4E7', // Soft Off-White
  liveDotColor: '#4ADE80', // Soft Green Pulsing Dot
  ambientGlowColor: '#3B82F6',
};

const DEFAULT_ITEMS: InspectorItem[] = [
  {
    label: 'Status Code',
    value: '200 OK',
    valueColor: '#4ADE80',
    dotColor: '#4ADE80',
  },
  {
    label: 'Response Time',
    value: 184,
    isCounter: true,
    startCounterValue: 0,
    unit: ' ms',
    valueColor: '#FBBF24',
    dotColor: '#FBBF24',
  },
  {
    label: 'Payload Size',
    value: 1420,
    isCounter: true,
    startCounterValue: 800,
    unit: ' bytes',
    valueColor: '#60A5FA',
    dotColor: '#60A5FA',
  },
  {
    label: 'Content Type',
    value: 'application/json',
    valueColor: '#E4E4E7',
    dotColor: '#A1A1AA',
  },
  {
    label: 'Server Node',
    value: 'cloud-east-01',
    valueColor: '#A78BFA',
    dotColor: '#A78BFA',
  },
];

/**
 * Helper kalkulasi posisi dinamis CSS berdasarkan prop panelPosition
 */
function getPositionStyles(pos: PanelPosition, marginPx: number = 80): React.CSSProperties {
  switch (pos) {
    case 'top-left':
      return { top: `${marginPx}px`, left: `${marginPx}px` };
    case 'top-right':
      return { top: `${marginPx}px`, right: `${marginPx}px` };
    case 'bottom-left':
      return { bottom: `${marginPx}px`, left: `${marginPx}px` };
    case 'bottom-right':
    default:
      return { bottom: `${marginPx}px`, right: `${marginPx}px` };
  }
}

/**
 * Helper kalkulasi transisi slide dari tepi kanvas terdekat
 */
function getSlideOffset(pos: PanelPosition, progress: number): string {
  const dist = 40;
  const inv = (1 - progress) * dist;

  switch (pos) {
    case 'top-left':
      return `translate(${-inv}px, ${-inv}px)`;
    case 'top-right':
      return `translate(${inv}px, ${-inv}px)`;
    case 'bottom-left':
      return `translate(${-inv}px, ${inv}px)`;
    case 'bottom-right':
    default:
      return `translate(${inv}px, ${inv}px)`;
  }
}

/**
 * HeaderInspectorPanel Composition
 * Overlay corner inspector panel for video graphics with animated counters & supporting telemetry elements.
 * Total Duration: 360 frames (6.0 seconds @ 60fps).
 */
export const HeaderInspectorPanel: React.FC<HeaderInspectorPanelProps> = ({
  useGreenScreen = false,
  panelPosition = 'bottom-right',
  headerTitle = 'Details',
  panelWidth = 960, // 4K Scale
  fontSize = 26,
  items = DEFAULT_ITEMS,
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const theme: InspectorThemeColors = { ...DEFAULT_THEME, ...themeColors };

  // ==========================================
  // FASE 1: Panel Slide-In Entrance (Frame 0 - 20 / 300ms @60fps)
  // Easing: Ease-Out cubic-bezier(0.16, 1, 0.3, 1)
  // ==========================================
  const panelEasing = Easing.bezier(0.16, 1, 0.3, 1);

  const panelProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const panelOpacity = panelProgress;
  const slideTransform = getSlideOffset(panelPosition, panelProgress);

  // ==========================================
  // FASE 2: Live Pulsing Indicator Dot
  // Continuous Loop tiap 72 frame (1.2 detik @60fps)
  // ==========================================
  const pulseLoopFrame = frame % 72;

  const dotScale = interpolate(pulseLoopFrame, [0, 36, 72], [1.0, 1.25, 1.0], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const pulseRingScale = interpolate(pulseLoopFrame, [0, 48], [1.0, 2.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const pulseRingOpacity = interpolate(pulseLoopFrame, [0, 48], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const positionStyles = getPositionStyles(panelPosition, 80);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
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
              ...positionStyles,
              width: `${panelWidth * 1.3}px`,
              height: '700px',
              transform: 'translate(-10%, -10%)',
              background: `radial-gradient(ellipse at center, ${theme.ambientGlowColor}12 0%, transparent 70%)`,
              filter: 'blur(90px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.03,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Tech Marks */}
          <div style={{ position: 'absolute', top: '48px', left: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            + 00:38:40 / 4K UHD
          </div>
          <div style={{ position: 'absolute', top: '48px', right: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            OVERLAY // HEADER INSPECTOR (6.0s)
          </div>
        </>
      )}

      {/* LAYER 2: Corner Overlay Inspector Panel Container */}
      <div
        style={{
          position: 'absolute',
          ...positionStyles,
          width: `${panelWidth}px`,
          backgroundColor: theme.panelBgColor,
          borderRadius: '20px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), 0 12px 30px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          opacity: panelOpacity,
          transform: slideTransform,
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            height: '68px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '28px',
            paddingRight: '28px',
          }}
        >
          {/* Header Title with Live Pulsing Dot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: theme.liveDotColor,
                  transform: `scale(${pulseRingScale})`,
                  opacity: pulseRingOpacity,
                }}
              />
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: theme.liveDotColor,
                  transform: `scale(${dotScale})`,
                  boxShadow: `0 0 12px ${theme.liveDotColor}`,
                }}
              />
            </div>

            <div
              style={{
                color: theme.textColor,
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              {headerTitle}
            </div>
          </div>

          {/* 3 Monochrome Control Dots & Status Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            </div>

            <div
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#60A5FA',
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                padding: '4px 12px',
                borderRadius: '9999px',
                letterSpacing: '1.5px',
              }}
            >
              INSPECTOR
            </div>
          </div>
        </div>

        {/* List Items Container */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((item, itemIdx) => {
            const itemStartFrame = 20 + itemIdx * 6;

            const itemOpacity = interpolate(
              frame,
              [itemStartFrame, itemStartFrame + 15],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: panelEasing,
              }
            );

            const itemTranslateX = interpolate(
              frame,
              [itemStartFrame, itemStartFrame + 15],
              [12, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: panelEasing,
              }
            );

            // LOGIC COUNTER ANIMATION
            let displayValue: string = String(item.value);

            if (item.isCounter && typeof item.value === 'number') {
              const startVal = item.startCounterValue ?? 0;
              const targetVal = item.value;

              const counterProgress = interpolate(
                frame,
                [itemStartFrame, itemStartFrame + 30],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.quad),
                }
              );

              const currentVal = Math.round(
                interpolate(counterProgress, [0, 1], [startVal, targetVal])
              );

              displayValue = `${currentVal}${item.unit || ''}`;
            }

            const itemValueColor = item.valueColor || theme.textColor;
            const itemDotColor = item.dotColor || itemValueColor;
            const isLast = itemIdx === items.length - 1;

            return (
              <div
                key={itemIdx}
                style={{
                  height: '64px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingLeft: '28px',
                  paddingRight: '28px',
                  borderBottom: isLast ? 'none' : `1px solid ${theme.borderColor}`,
                  opacity: itemOpacity,
                  transform: `translateX(${itemTranslateX}px)`,
                }}
              >
                {/* Left Column: Status Bullet Dot & Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: itemDotColor,
                      boxShadow: `0 0 8px ${itemDotColor}`,
                    }}
                  />
                  <div
                    style={{
                      color: theme.labelColor,
                      fontSize: `${fontSize * 0.85}px`,
                      fontWeight: 500,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                  </div>
                </div>

                {/* Right Column: Value / Counter */}
                <div
                  style={{
                    color: itemValueColor,
                    fontSize: `${fontSize}px`,
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}
                >
                  {displayValue}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Telemetry Status Bar */}
        <div
          style={{
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderTop: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '28px',
            paddingRight: '28px',
            fontSize: '13px',
            color: '#71717A',
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>ID: <span style={{ color: '#A1A1AA' }}>#4092</span></span>
            <span>Sync: <span style={{ color: '#4ADE80', fontWeight: 600 }}>LIVE</span></span>
          </div>

          <div>
            Mode: <span style={{ color: '#60A5FA' }}>MONITOR</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
