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

export interface DataDiffItem {
  key: string;
  value: string | number | boolean;
  isDifferent?: boolean;
}

export interface DataDiffThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  keyColor: string;
  valueColor: string;
  diffHighlightBg: string;
  diffBorderColor: string;
  matchHighlightBg: string;
  matchBorderColor: string;
  errorColor: string;
  successColor: string;
  ambientGlowColor: string;
}

export interface DataDiffValidationOverlayProps {
  useGreenScreen?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  differenceCount?: number;
  expectedData?: DataDiffItem[];
  actualData?: DataDiffItem[];
  themeColors?: Partial<DataDiffThemeColors>;
}

const DEFAULT_THEME: DataDiffThemeColors = {
  panelBgColor: '#0F0F13',
  headerBgColor: '#16161A',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  keyColor: '#60A5FA', // Soft Blue
  valueColor: '#E4E4E7', // Off-White
  diffHighlightBg: 'rgba(248, 113, 113, 0.14)', // Soft Red/Coral Highlight
  diffBorderColor: 'rgba(248, 113, 113, 0.3)',
  matchHighlightBg: 'rgba(74, 222, 128, 0.06)', // Soft Green Match Highlight
  matchBorderColor: 'rgba(74, 222, 128, 0.15)',
  errorColor: '#F87171',
  successColor: '#4ADE80',
  ambientGlowColor: '#3B82F6',
};

const DEFAULT_EXPECTED_DATA: DataDiffItem[] = [
  { key: 'status_code', value: 200, isDifferent: false },
  { key: 'user_role', value: '"administrator"', isDifferent: true },
  { key: 'auth_type', value: '"bearer_token"', isDifferent: false },
  { key: 'timeout_ms', value: 5000, isDifferent: true },
  { key: 'ssl_enabled', value: 'true', isDifferent: false },
];

const DEFAULT_ACTUAL_DATA: DataDiffItem[] = [
  { key: 'status_code', value: 200, isDifferent: false },
  { key: 'user_role', value: '"guest"', isDifferent: true },
  { key: 'auth_type', value: '"bearer_token"', isDifferent: false },
  { key: 'timeout_ms', value: 3000, isDifferent: true },
  { key: 'ssl_enabled', value: 'true', isDifferent: false },
];

/**
 * DataDiffValidationOverlay Composition
 * Motion graphic comparing Expected vs Actual data panels with 4 layered reveal stages.
 * Total Duration: 360 frames (6.0 seconds @ 60fps).
 */
export const DataDiffValidationOverlay: React.FC<DataDiffValidationOverlayProps> = ({
  useGreenScreen = false,
  leftLabel = 'Expected',
  rightLabel = 'Actual',
  differenceCount = 2,
  expectedData = DEFAULT_EXPECTED_DATA,
  actualData = DEFAULT_ACTUAL_DATA,
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const theme: DataDiffThemeColors = { ...DEFAULT_THEME, ...themeColors };

  // LAPIS 1 (Frame 0 - 25): Kedua Panel Container Muncul Bersamaan
  const panelEasing = Easing.bezier(0.16, 1, 0.3, 1);

  const layer1Progress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const layer1Opacity = layer1Progress;
  const leftTranslateX = interpolate(layer1Progress, [0, 1], [-30, 0]);
  const rightTranslateX = interpolate(layer1Progress, [0, 1], [30, 0]);

  // LAPIS 3 (Frame 100 - 160): Diff Highlight Fade-In
  const diffHighlightStart = 100;
  const smoothCurve = Easing.bezier(0.45, 0, 0.55, 1);

  // LAPIS 4 (Frame 160 - 190): Badge Ringkasan Muncul Terakhir
  const badgeStartFrame = 160;
  const badgeProgress = interpolate(
    frame,
    [badgeStartFrame, badgeStartFrame + 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const badgeOpacity = badgeProgress;
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.9, 1.0]);

  const hasDiff = differenceCount > 0;
  const badgeStatusColor = hasDiff ? theme.errorColor : theme.successColor;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LAYER 1: Ambient Background Glow & Tech Grid Overlay */}
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
              background: `radial-gradient(ellipse at center, ${
                hasDiff ? theme.errorColor : theme.successColor
              }12 0%, transparent 65%)`,
              filter: 'blur(100px)',
              pointerEvents: 'none',
              transition: 'background 0.3s ease',
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
            VALIDATION // DATA DIFF OVERLAY (6.0s)
          </div>
        </>
      )}

      {/* Main Container: 2 Parallel Panels */}
      <div
        style={{
          display: 'flex',
          gap: '80px',
          width: '80%',
          justifyContent: 'center',
        }}
      >
        {/* LEFT PANEL: EXPECTED DATA */}
        <div
          style={{
            flex: 1,
            backgroundColor: theme.panelBgColor,
            borderRadius: '24px',
            border: `1px solid ${theme.borderColor}`,
            boxShadow: '0 50px 120px rgba(0, 0, 0, 0.8), 0 16px 40px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            opacity: layer1Opacity,
            transform: `translateX(${leftTranslateX}px)`,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              height: '72px',
              backgroundColor: theme.headerBgColor,
              borderBottom: `1px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '36px',
              paddingRight: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              </div>
              <div style={{ color: '#A1A1AA', fontSize: '22px', fontWeight: 600, letterSpacing: '1.5px' }}>
                {leftLabel}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#60A5FA', backgroundColor: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', padding: '4px 12px', borderRadius: '9999px', letterSpacing: '1px' }}>
              SCHEMA A
            </div>
          </div>

          {/* Rows Body */}
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {expectedData.map((item, rowIdx) => {
              const rowStartFrame = 25 + rowIdx * 6;

              const rowOpacity = interpolate(
                frame,
                [rowStartFrame, rowStartFrame + 15],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              const rowTranslateY = interpolate(
                frame,
                [rowStartFrame, rowStartFrame + 15],
                [8, 0],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              let highlightOpacity = 0;
              if (item.isDifferent) {
                const diffIndex = expectedData.filter((d, i) => i < rowIdx && d.isDifferent).length;
                const highlightFrame = diffHighlightStart + diffIndex * 5;

                highlightOpacity = interpolate(
                  frame,
                  [highlightFrame, highlightFrame + 15],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: smoothCurve,
                  }
                );
              }

              return (
                <div
                  key={rowIdx}
                  style={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '12px',
                    backgroundColor: item.isDifferent
                      ? `rgba(248, 113, 113, ${0.14 * highlightOpacity})`
                      : theme.matchHighlightBg,
                    border: item.isDifferent
                      ? `1px solid rgba(248, 113, 113, ${0.3 * highlightOpacity})`
                      : `1px solid ${theme.matchBorderColor}`,
                    opacity: rowOpacity,
                    transform: `translateY(${rowTranslateY}px)`,
                    fontSize: '26px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <span style={{ color: theme.keyColor, fontWeight: 500 }}>
                    "{item.key}"
                  </span>
                  <span
                    style={{
                      color: item.isDifferent && highlightOpacity > 0.5 ? theme.errorColor : theme.valueColor,
                      fontWeight: 600,
                    }}
                  >
                    {String(item.value)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Status Bar */}
          <div
            style={{
              height: '40px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderTop: `1px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '36px',
              paddingRight: '36px',
              fontSize: '13px',
              color: '#71717A',
            }}
          >
            <span>Target: <span style={{ color: '#A1A1AA' }}>EXPECTED_V1</span></span>
            <span>Fields: <span style={{ color: '#A1A1AA' }}>{expectedData.length}</span></span>
          </div>
        </div>

        {/* RIGHT PANEL: ACTUAL DATA */}
        <div
          style={{
            flex: 1,
            backgroundColor: theme.panelBgColor,
            borderRadius: '24px',
            border: `1px solid ${theme.borderColor}`,
            boxShadow: '0 50px 120px rgba(0, 0, 0, 0.8), 0 16px 40px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            opacity: layer1Opacity,
            transform: `translateX(${rightTranslateX}px)`,
            display: 'flex',
            flexDirection: 'column',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              height: '72px',
              backgroundColor: theme.headerBgColor,
              borderBottom: `1px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '36px',
              paddingRight: '36px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#52525B' }} />
              </div>
              <div style={{ color: '#A1A1AA', fontSize: '22px', fontWeight: 600, letterSpacing: '1.5px' }}>
                {rightLabel}
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#4ADE80', backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '4px 12px', borderRadius: '9999px', letterSpacing: '1px' }}>
              SCHEMA B
            </div>
          </div>

          {/* Rows Body */}
          <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {actualData.map((item, rowIdx) => {
              const rowStartFrame = 25 + rowIdx * 6;

              const rowOpacity = interpolate(
                frame,
                [rowStartFrame, rowStartFrame + 15],
                [0, 1],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              const rowTranslateY = interpolate(
                frame,
                [rowStartFrame, rowStartFrame + 15],
                [8, 0],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: panelEasing,
                }
              );

              let highlightOpacity = 0;
              if (item.isDifferent) {
                const diffIndex = actualData.filter((d, i) => i < rowIdx && d.isDifferent).length;
                const highlightFrame = diffHighlightStart + diffIndex * 5;

                highlightOpacity = interpolate(
                  frame,
                  [highlightFrame, highlightFrame + 15],
                  [0, 1],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: smoothCurve,
                  }
                );
              }

              return (
                <div
                  key={rowIdx}
                  style={{
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    borderRadius: '12px',
                    backgroundColor: item.isDifferent
                      ? `rgba(248, 113, 113, ${0.14 * highlightOpacity})`
                      : theme.matchHighlightBg,
                    border: item.isDifferent
                      ? `1px solid rgba(248, 113, 113, ${0.3 * highlightOpacity})`
                      : `1px solid ${theme.matchBorderColor}`,
                    opacity: rowOpacity,
                    transform: `translateY(${rowTranslateY}px)`,
                    fontSize: '26px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <span style={{ color: theme.keyColor, fontWeight: 500 }}>
                    "{item.key}"
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.isDifferent && highlightOpacity > 0.3 && (
                      <span style={{ fontSize: '12px', color: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.18)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
                        MISMATCH
                      </span>
                    )}
                    <span
                      style={{
                        color: item.isDifferent && highlightOpacity > 0.5 ? theme.errorColor : theme.valueColor,
                        fontWeight: 600,
                      }}
                    >
                      {String(item.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Status Bar */}
          <div
            style={{
              height: '40px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderTop: `1px solid ${theme.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '36px',
              paddingRight: '36px',
              fontSize: '13px',
              color: '#71717A',
            }}
          >
            <span>Result: <span style={{ color: hasDiff ? '#F87171' : '#4ADE80', fontWeight: 600 }}>{hasDiff ? `${differenceCount} MISMATCH` : 'MATCHED'}</span></span>
            <span>Status: <span style={{ color: '#A1A1AA' }}>VALIDATED</span></span>
          </div>
        </div>
      </div>

      {/* LAPIS 4 (Frame 160 - 190): Bottom Summary Badge */}
      <div
        style={{
          marginTop: '48px',
          opacity: badgeOpacity,
          transform: `scale(${badgeScale})`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: `${badgeStatusColor}15`,
          border: `1.5px solid ${badgeStatusColor}40`,
          padding: '12px 32px',
          borderRadius: '9999px',
          boxShadow: `0 0 25px ${badgeStatusColor}20`,
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: badgeStatusColor,
            boxShadow: `0 0 12px ${badgeStatusColor}`,
          }}
        />
        <div
          style={{
            color: badgeStatusColor,
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {hasDiff
            ? `${differenceCount} DIFFERENCES DETECTED`
            : 'ALL DATA MATCHED PERFECTLY'}
        </div>
      </div>
    </AbsoluteFill>
  );
};
