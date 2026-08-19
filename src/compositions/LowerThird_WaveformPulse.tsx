import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter Google Font
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface LowerThirdWaveformPulseProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 19: LowerThird_WaveformPulse
 * Niche: Podcast, Music, Audio-Visual, Broadcast Speech.
 * Features:
 * - ZERO solid box or panel background! (Solid black #000000).
 * - Left & Right Audio Spectrum Waveform clusters (14 vertical bars each) framing empty center text area.
 * - Gradient Mint-Tosca (#00FFC2) to Pure White (#FFFFFF) with bloom glow filter.
 * - Entrance (1.0s / 30f): Center-out expansion from flat line to dynamic waveform heights.
 * - Hold (6.0s / 180f): Real-time smooth audio visualizer loop (smooth trigonometric sine & noise math).
 * - Exit (1.0s / 30f): Waveform amplitude smooth collapse back to flat line (audio fade to silence) & fade out.
 * - Total Duration: 8.0 seconds (240 frames @ 30fps).
 */
export const LowerThird_WaveformPulse: React.FC<LowerThirdWaveformPulseProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#00FFC2', // Mint-Tosca
  accentGradientEnd = '#FFFFFF', // Pure White
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE ANIMASI (240 Frame @ 30fps = 8.0 Detik)
  // Frame 0-30: Entrance Phase (In 1.0s)
  //   - Frame 2-30: Center-out expansion from flat line (height=2px) to dynamic waveform heights
  // Frame 30-210: Hold Phase (Hold 6.0s = 180f)
  //   - Continuous organic audio spectrum visualizer loop
  // Frame 210-240: Exit Phase (Out 1.0s = 30f)
  //   - Frame 210-232: Amplitude collapse back to flat line (Audio fade to silence)
  //   - Frame 228-240: Fade out to 0% opacity
  // ==========================================

  // --- ENTRANCE SPREAD FROM CENTER-OUT (Frame 0 - 30) ---
  const entranceProgress = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- EXIT COLLAPSE TO FLAT LINE (Frame 210 - 240) ---
  const exitProgress = interpolate(frame, [210, 238], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const exitAmplitudeScale = interpolate(exitProgress, [0, 0.75], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.6, 1], [1, 0]);

  // Overall Waveform Amplitude Multiplier
  const globalAmplitude = entranceProgress * exitAmplitudeScale;

  // --- HOLD PHASE ORGANIC AUDIO VISUALIZER MATH (Frame 30 - 210) ---
  const idleTime = Math.max(0, frame - 30) / 30;

  // Generate 14 Bar Heights for Left & Right Waveform Clusters
  const numBars = 14;
  const barWidth = 6;
  const barGap = 10;

  const getBarHeight = (barIdx: number) => {
    // Trigonometric sine wave + noise combinations for smooth organic audio visualizer feel
    const baseFreq = 4.2;
    const wave1 = Math.sin(idleTime * baseFreq + barIdx * 0.55);
    const wave2 = Math.cos(idleTime * (baseFreq * 1.4) - barIdx * 0.85);
    const wave3 = Math.sin(idleTime * (baseFreq * 0.6) + barIdx * 1.2);

    const rawHeight = 24 + ((wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2) * 45 + 45);
    const maxBarHeight = 110;
    const clampedHeight = Math.max(4, Math.min(maxBarHeight, rawHeight));

    return clampedHeight * globalAmplitude;
  };

  const titleTextOpacity = interpolate(entranceProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(entranceProgress, [0, 1], [0, 1]) * exitOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* WAVEFORM PULSE CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1440px',
          height: '180px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT MINT-TOSCA GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '1460px',
            height: '200px',
            background: `radial-gradient(ellipse at center, ${accentColor}30 0%, transparent 70%)`,
            filter: 'blur(55px)',
            opacity: entranceProgress * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1440"
          height="180"
          viewBox="0 0 1440 180"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Mint-Tosca to White Equalizer Gradient */}
            <linearGradient id="wave-mint-grad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00FFC2" />
              <stop offset="70%" stopColor="#80FFE1" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Bloom Glow Filter */}
            <filter id="wave-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={accentColor} floodOpacity="0.85" />
            </filter>
          </defs>

          {/* 1. LEFT WAVEFORM CLUSTER (14 Vertical Bars) */}
          <g transform="translate(40, 90)" filter="url(#wave-glow)">
            {[...Array(numBars)].map((_, i) => {
              // Center-out stagger delay
              const delayFactor = Math.abs(i - (numBars - 1)) / numBars;
              const barStagger = interpolate(entranceProgress, [delayFactor * 0.4, 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              const h = getBarHeight(i) * barStagger;
              const xPos = i * (barWidth + barGap);

              return (
                <rect
                  key={`left-${i}`}
                  x={xPos}
                  y={-h / 2}
                  width={barWidth}
                  height={Math.max(2, h)}
                  rx={3}
                  ry={3}
                  fill="url(#wave-mint-grad)"
                />
              );
            })}
          </g>

          {/* 2. RIGHT WAVEFORM CLUSTER (14 Vertical Bars) */}
          <g transform="translate(1160, 90)" filter="url(#wave-glow)">
            {[...Array(numBars)].map((_, i) => {
              // Center-out stagger delay
              const delayFactor = i / numBars;
              const barStagger = interpolate(entranceProgress, [delayFactor * 0.4, 1], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

              const h = getBarHeight(i) * barStagger;
              const xPos = i * (barWidth + barGap);

              return (
                <rect
                  key={`right-${i}`}
                  x={xPos}
                  y={-h / 2}
                  width={barWidth}
                  height={Math.max(2, h)}
                  rx={3}
                  ry={3}
                  fill="url(#wave-mint-grad)"
                />
              );
            })}
          </g>

          {/* 3. CENTER BASELINE GUIDELINE & AUDIO FREQUENCY TICKS */}
          <g opacity={entranceProgress * exitOpacity}>
            {/* Center Baseline Guide Hairline (y = 90px) */}
            <line
              x1="270"
              y1="90"
              x2="1140"
              y2="90"
              stroke="#00FFC2"
              strokeWidth="1.8"
              strokeDasharray="6 8"
              opacity="0.45"
            />

            {/* Left & Right End Equalizer Anchor Dots */}
            <circle cx="260" cy="90" r="4" fill="#00FFC2" filter="url(#wave-glow)" />
            <circle cx="1150" cy="90" r="4" fill="#00FFC2" filter="url(#wave-glow)" />
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '280px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '48px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 14px rgba(0,0,0,0.95)',
              }}
            >
              {title}
            </span>
          </div>
        )}

        {subtitle && (
          <div
            style={{
              position: 'absolute',
              top: '110px',
              left: '280px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#00FFC2',
                letterSpacing: '2px',
                lineHeight: 1,
              }}
            >
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
