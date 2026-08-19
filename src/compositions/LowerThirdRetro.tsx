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

export type LowerThirdBg = 'black' | 'greenscreen' | string;

export interface LowerThirdRetroProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdRetro Composition (Varian 5: Refined Parallel Chamfer Alignment)
 * Tidy integrated corner geometry: Wireframe outline and corner accent are perfectly parallel & flush.
 */
export const LowerThirdRetro: React.FC<LowerThirdRetroProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#FF007A', // Neon Synthwave Magenta
  accentGradientEnd = '#FF8A00', // Sunburst Amber Orange
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE ANIMASI (180 Frame @ 30fps = 6.0 Detik)
  // Frame 0-45: Elastic Cyber Spring Entrance
  // Frame 45-145: Hold Phase + Scanline Glitch Sheen & Barcode Telemetry Micro-Motion
  // Frame 145-175: VHS Scanline Wipe Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (Cyberpunk Elastic Physics) ---
  const glowEntrance = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const wireframeSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 11, mass: 0.7, stiffness: 130 },
  });

  const glassPanelSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 140 },
  });

  const subContainerSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 120 },
  });

  const barcodeProgress = interpolate(frame, [22, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- EXIT PHYSICS (Frame 145 - 175, VHS Scanline Wipe Exit) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const exitScaleY = interpolate(exitProgress, [0, 1], [1, 0.05]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  const sheenX = frame >= 45 && frame < 145
    ? interpolate((frame - 45) % 80, [0, 80], [-400, 1800], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      })
    : -400;

  const telemetryPulse = frame >= 45 && frame < 145 ? 0.5 + Math.sin(idleTime * 6.0) * 0.4 : 0.8;

  // --- FINAL TRANSFORMS ---
  const glassTranslateX = interpolate(glassPanelSpring, [0, 1], [-180, 0]);

  const titleTextOpacity = interpolate(glassPanelSpring, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(subContainerSpring, [0, 1], [0, 1]) * exitOpacity;

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
      {/* RETRO SYNTHWAVE LOWER THIRD CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1680px',
          height: '320px',
          opacity: exitOpacity,
          transform: `scaleY(${exitScaleY})`,
          transformOrigin: '200px 160px',
        }}
      >
        {/* AMBIENT SYNTHWAVE GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '80px',
            width: '1250px',
            height: '180px',
            background: `radial-gradient(ellipse at center, ${accentColor}35 0%, ${accentGradientEnd}25 50%, transparent 75%)`,
            filter: 'blur(55px)',
            opacity: glowEntrance * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1680"
          height="320"
          viewBox="0 0 1680 320"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Synthwave Gradient */}
            <linearGradient id="retro-synth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={accentGradientEnd} />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>

            {/* Main Dark Synthwave Glass Gradient */}
            <linearGradient id="retro-glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F092B" stopOpacity="0.96" />
              <stop offset="50%" stopColor="#14061F" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0B0312" stopOpacity="0.98" />
            </linearGradient>

            {/* Subtitle Glass Gradient */}
            <linearGradient id="retro-sub-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2A0B38" stopOpacity="0.90" />
              <stop offset="100%" stopColor="#110319" stopOpacity="0.82" />
            </linearGradient>

            {/* VHS Scanline Pattern */}
            <pattern id="retro-scanlines" width="100" height="4" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255, 0, 122, 0.15)" strokeWidth="1" />
            </pattern>

            {/* High-Contrast Glitch Sheen */}
            <linearGradient id="retro-sheen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Deep Drop Shadow */}
            <filter id="retro-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="20" stdDeviation="26" floodColor="#000000" floodOpacity="0.8" />
            </filter>

            <filter id="synth-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentColor} floodOpacity="0.75" />
            </filter>

            {/* Clip Path for Main Panel */}
            <clipPath id="retro-card-clip">
              <path d="M 0 0 L 1450 0 L 1410 136 L 0 136 Z" />
            </clipPath>
          </defs>

          {/* LAYER 0: PARALLEL BACKING WIREFRAME OUTLINE (Parallel Chamfer Alignment) */}
          <g
            transform={`translate(${glassTranslateX - 8}, 24) scale(${wireframeSpring}, 1)`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={wireframeSpring * 0.85}
            filter="url(#synth-glow)"
          >
            <path
              d="M 0 0 L 1458 0 L 1418 144 L 0 144 Z"
              fill="none"
              stroke="url(#retro-synth-grad)"
              strokeWidth="2.5"
            />
          </g>

          {/* LAYER 1: MAIN DARK SYNTHWAVE GLASS PANEL */}
          <g
            transform={`translate(${glassTranslateX}, 32) scale(${glassPanelSpring}, 1)`}
            style={{ transformOrigin: '0px 68px' }}
            opacity={glassPanelSpring}
            filter="url(#retro-shadow)"
          >
            {/* Main Panel Body */}
            <path
              d="M 0 0 L 1450 0 L 1410 136 L 0 136 Z"
              fill="url(#retro-glass-grad)"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="2"
            />

            {/* Scanline Grid Texture Overlay */}
            <rect x="0" y="0" width="1450" height="136" fill="url(#retro-scanlines)" />

            {/* Left Accent Bar */}
            <rect x="0" y="0" width="10" height="136" fill="url(#retro-synth-grad)" />

            {/* Metallic Top Edge Line */}
            <line x1="10" y1="1" x2="1445" y2="1" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />

            {/* Integrated Top-Right Chamfer Corner Accent (Flush Fitted to Slanted Edge) */}
            <path
              d="M 1405 0 L 1450 0 L 1438 40"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#synth-glow)"
            />

            {/* Glitch Sheen Pass */}
            <g clipPath="url(#retro-card-clip)">
              <rect
                x={sheenX}
                y="0"
                width="300"
                height="136"
                fill="url(#retro-sheen-grad)"
                transform="skewX(-25)"
              />
            </g>
          </g>

          {/* LAYER 2: SUBTITLE GLASS CONTAINER */}
          <g
            transform={`translate(0, ${184}) scale(1, ${subContainerSpring})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={subContainerSpring}
            filter="url(#retro-shadow)"
          >
            <path
              d="M 0 0 L 1020 0 L 980 68 L 0 68 Z"
              fill="url(#retro-sub-grad)"
              stroke="rgba(255, 0, 122, 0.3)"
              strokeWidth="1.5"
            />
            <rect x="0" y="0" width="8" height="68" fill="url(#retro-synth-grad)" />
          </g>

          {/* LAYER 3: SCI-FI TELEMETRY BARCODE GRAPHIC */}
          <g
            transform="translate(36, 48)"
            opacity={barcodeProgress * telemetryPulse}
          >
            {[4, 10, 6, 14, 8, 4, 12, 6, 16, 8, 4, 10].map((width, idx) => (
              <rect
                key={idx}
                x={idx * 16}
                y="0"
                width={width}
                height="24"
                fill={idx % 3 === 0 ? '#00F0FF' : accentColor}
                opacity="0.85"
              />
            ))}
          </g>

          {/* Subtitle Live Beacon Dot */}
          <g
            transform="translate(32, 218)"
            opacity={subContainerSpring * telemetryPulse}
          >
            <circle cx="0" cy="0" r="6" fill="#00F0FF" filter="url(#synth-glow)" />
            <circle cx="0" cy="0" r="11" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '84px',
              left: '260px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '50px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '3.5px',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 4px 14px rgba(0,0,0,0.85)',
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
              top: '204px',
              left: '56px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#FF8A00',
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
