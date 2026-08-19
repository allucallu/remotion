import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
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

export interface LowerThirdAudioSpectrumProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 20: LowerThirdAudioSpectrum (Radial Equalizer Ring & Dual Oscilloscope Horizon)
 * Niche: Podcast, Music Production, DJ Live Stream, Broadcast Audio.
 * Features:
 * - ZERO solid box fill! (Solid black #000000 background).
 * - Left Radial Equalizer Turbine Ring (160px x 160px, 4K) with 24 outward frequency bars & core nucleus.
 * - Center Dual Oscilloscope Waveform Horizon Lines framing the empty text area.
 * - Electric Violet (#8B5CF6), Neon Cyan (#00E5FF), & Hot Pink (#EC4899) palette with bloom glow.
 * - Entrance (1.0s / 30f): Radial Ring 180° Spin Expansion & Dual Horizon Wave Line Draw.
 * - Hold (6.0s / 180f): Real-time circular audio turbine pulse & live undulating dual oscilloscope.
 * - Exit (1.0s / 30f): Oscilloscope flattens to zero amplitude (audio mute) & Radial Ring implodes to center.
 * - Total Duration: 8.0 seconds (240 frames @ 30fps).
 */
export const LowerThirdAudioSpectrum: React.FC<LowerThirdAudioSpectrumProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#8B5CF6', // Electric Violet
  accentGradientEnd = '#00E5FF', // Neon Cyan
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
  //   - Frame 2-20: Left Radial Turbine Ring 180° Spin Expansion
  //   - Frame 10-28: Dual Oscilloscope Waveform Lines Draw (Left to Right)
  // Frame 30-210: Hold Phase (Hold 6.0s = 180f)
  //   - Continuous 24-radial bar turbine pulse
  //   - Live undulating dual sine wave oscilloscope
  // Frame 210-240: Exit Phase (Out 1.0s = 30f)
  //   - Frame 210-230: Dual Oscilloscope flattens to zero amplitude (Audio Mute)
  //   - Frame 220-240: Radial Turbine Ring implodes & fades out
  // ==========================================

  // --- ENTRANCE SPRINGS & TRANSFORMS ---
  // Left Radial Turbine Ring Spring (Frame 2 - 20)
  const ringSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 140 },
  });

  const ringSpinIn = interpolate(ringSpring, [0, 1], [-180, 0]);

  // Dual Oscilloscope Horizon Line Draw Progress (Frame 10 - 28)
  const lineDrawProgress = interpolate(frame, [10, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- HOLD PHASE IDLE AUDIO VISUALIZER (Frame 30 - 210) ---
  const idleTime = Math.max(0, frame - 30) / 30;

  // Slow continuous turbine rotation (0° -> 120°)
  const turbineRotate = idleTime * 24;

  // Core Nucleus Breathing Pulse
  const corePulseOpacity = frame >= 30 && frame < 210
    ? 0.8 + Math.sin(idleTime * 4.0) * 0.2
    : 0.85;

  // --- EXIT PHASE (Frame 210 - 240) ---
  const exitProgress = interpolate(frame, [210, 238], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Dual Oscilloscope flattens to zero amplitude (Frame 210 - 230)
  const waveAmplitudeScale = interpolate(exitProgress, [0, 0.7], [1, 0]);

  // Ring Implosion (Frame 220 - 240)
  const ringExitScale = interpolate(exitProgress, [0.3, 1], [1, 0]);
  const exitOpacity = interpolate(exitProgress, [0.75, 1], [1, 0]);

  // Global Scale Calculations
  const finalLineScaleX = lineDrawProgress * waveAmplitudeScale;
  const titleTextOpacity = interpolate(lineDrawProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(lineDrawProgress, [0, 1], [0, 1]) * exitOpacity;

  // 24 Radial Frequency Bars Generator
  const numRadialBars = 24;
  const getRadialLength = (barIdx: number) => {
    const freq = 5.0;
    const wave1 = Math.sin(idleTime * freq + barIdx * 0.7);
    const wave2 = Math.cos(idleTime * (freq * 1.3) - barIdx * 1.1);
    const rawLen = 12 + ((wave1 * 0.6 + wave2 * 0.4) * 16 + 16);
    return rawLen * ringSpring * waveAmplitudeScale;
  };

  // Dual Oscilloscope Path Generators (Top Wave & Bottom Wave)
  const generateOscilloscopePath = (isTop: boolean) => {
    const startX = 210;
    const endX = 1440;
    const width = endX - startX;
    const points = [];
    const steps = 40;
    const baseY = isTop ? 24 : 176;
    const phaseShift = isTop ? 0 : Math.PI;

    for (let i = 0; i <= steps; i++) {
      const x = startX + (i / steps) * width;
      const normX = i / steps;

      // Dual Sine Wave Oscilloscope Math
      const wave1 = Math.sin(idleTime * 6.0 + normX * Math.PI * 4 + phaseShift);
      const wave2 = Math.cos(idleTime * 3.5 - normX * Math.PI * 2);
      const envelope = Math.sin(normX * Math.PI); // Smooth dampening at ends

      const amp = (wave1 * 12 + wave2 * 8) * envelope * waveAmplitudeScale * lineDrawProgress;
      const y = baseY + (isTop ? -amp : amp);

      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }

    return points.join(' ');
  };

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
      {/* AUDIO SPECTRUM CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1480px',
          height: '200px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT VIOLET & CYAN BLOOM GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '1500px',
            height: '220px',
            background: `radial-gradient(ellipse at center, ${accentColor}40 0%, ${accentGradientEnd}20 50%, transparent 75%)`,
            filter: 'blur(60px)',
            opacity: ringSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1480"
          height="200"
          viewBox="0 0 1480 200"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Violet to Cyan Audio Spectrum Gradient */}
            <linearGradient id="audio-spec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Bloom Glow Filter */}
            <filter id="spec-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor={accentColor} floodOpacity={corePulseOpacity} />
            </filter>

            <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={accentGradientEnd} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER 1: DUAL OSCILLOSCOPE HORIZON WAVEFORM LINES */}
          <g opacity={lineDrawProgress}>
            {/* Top Oscilloscope Wave Line */}
            <path
              d={generateOscilloscopePath(true)}
              fill="none"
              stroke="url(#audio-spec-grad)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#spec-glow)"
            />

            {/* Bottom Oscilloscope Wave Line */}
            <path
              d={generateOscilloscopePath(false)}
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#cyan-glow)"
            />

            {/* Subtitle Baseline Guide (y = 124px) */}
            <line
              x1="220"
              y1="124"
              x2="1240"
              y2="124"
              stroke="rgba(236, 72, 153, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeDashoffset={1020 * (1 - finalLineScaleX)}
            />

            {/* Right Side Frequency dB Scale Ticks */}
            <g transform="translate(1420, 40)" opacity={finalLineScaleX * 0.8}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 20}
                  x2={i % 2 === 0 ? "16" : "10"}
                  y2={i * 20}
                  stroke={i % 2 === 0 ? "#EC4899" : "#00E5FF"}
                  strokeWidth="2"
                />
              ))}
            </g>
          </g>

          {/* LAYER 2: LEFT RADIAL EQUALIZER TURBINE RING (Center 90, 100) */}
          <g
            transform={`translate(90, 100) scale(${ringSpring * ringExitScale})`}
            opacity={ringSpring}
            filter="url(#spec-glow)"
          >
            {/* Outer Concentric Reticle Ring */}
            <circle cx="0" cy="0" r="48" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="10 6" opacity="0.8" />

            {/* 24 Radial Frequency Equalizer Bars (Outward Sunburst) */}
            <g transform={`rotate(${ringSpinIn + turbineRotate})`}>
              {[...Array(numRadialBars)].map((_, i) => {
                const angle = (i / numRadialBars) * Math.PI * 2;
                const len = getRadialLength(i);
                const rInner = 50;
                const rOuter = rInner + len;

                const x1 = Math.sin(angle) * rInner;
                const y1 = -Math.cos(angle) * rInner;
                const x2 = Math.sin(angle) * rOuter;
                const y2 = -Math.cos(angle) * rOuter;

                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={i % 2 === 0 ? "#8B5CF6" : "#EC4899"}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* Center Live Audio Micro-Core */}
            <circle cx="0" cy="0" r="28" fill="none" stroke="url(#audio-spec-grad)" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#EC4899" filter="url(#spec-glow)" opacity={corePulseOpacity} />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '220px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '52px',
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
              top: '136px',
              left: '230px',
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
                color: '#00E5FF',
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
