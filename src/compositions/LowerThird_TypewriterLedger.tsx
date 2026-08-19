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

export interface LowerThirdTypewriterLedgerProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition 18: LowerThird_TypewriterLedger (Enhanced Supporting Elements & Mechanical Animation)
 * Niche: Documentary, Podcast Journalism, Vintage Editorial, Typewriter Document.
 * Features:
 * - Off-white yellowish paper panel (#EDE6D3) with ruled paper lines, red margin rule, & brass grommet ring.
 * - Far left: Stamp box (40px x 40px) with simple cross "×" stamp mark & brass clip.
 * - Top-right: Red ink document seal badge; Bottom-right: Industrial barcode serial ticks.
 * - 100% Blank SVG Graphic canvas ready for custom text overlay in Premiere/DaVinci.
 * - Entrance (1.5s / 45f): Mechanical typewriter carriage slide-in (-200px -> 0px), 130% stamp-in impact, & typing dashes with key vibration.
 * - Hold (4.5s / 135f): Blinking typewriter cursor (±0.8s interval).
 * - Exit (1.0s / 30f): Organic wet ink dissolve wipe + fast rightward carriage slide-out (+250px).
 * - Total Duration: 7.0 seconds (210 frames @ 30fps).
 */
export const LowerThird_TypewriterLedger: React.FC<LowerThirdTypewriterLedgerProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#1C1C1C', // Deep Ink Black
  accentGradientEnd = '#333333',
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
  // TIMELINE ANIMASI (210 Frame @ 30fps = 7.0 Detik)
  // Frame 0-45: Entrance Phase (In 1.5s)
  //   - Frame 0-16: Mechanical Carriage Slide-In (-200px -> 0px)
  //   - Frame 6-16: Left Stamp Box 130% -> 100% Stamp-In
  //   - Frame 12-42: Typewriter Typing Graphic Dashes (Left to Right)
  //   - Frame 12-42: Mechanical Micro-Shake Key Strike Vibration
  // Frame 45-180: Hold Phase (Hold 4.5s = 135f)
  //   - Blinking Typewriter Cursor Line (0.8s / 24f loop)
  // Frame 180-210: Exit Phase (Out 1.0s = 30f)
  //   - Organic Wet Ink Dissolve Wipe + Carriage Slide-Out (+250px)
  // ==========================================

  // --- ENTRANCE STAMP-IN & MECHANICAL CARRIAGE SPRINGS ---
  // Paper Panel Mechanical Carriage Slide-In Spring (-200px -> 0px)
  const carriageSpring = spring({
    frame: Math.max(0, frame - 0),
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 140 },
  });

  const carriageInX = interpolate(carriageSpring, [0, 1], [-200, 0]);

  // Left Stamp Box: 130% -> 100% Rapid Stamp-In
  const stampSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
  });

  // Typewriter Typing Progress (Frame 12 - 42)
  const typingProgress = interpolate(frame, [12, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // Mechanical Micro-Shake Key Strike Vibration on panel (Frame 12 - 42)
  const typingStep = Math.floor(typingProgress * 14);
  const microShakeX = frame >= 12 && frame < 42
    ? Math.sin(frame * 3.8) * Math.exp(-((frame - 12) % 3) * 1.5) * 2.5
    : 0;
  const microShakeY = frame >= 12 && frame < 42
    ? Math.cos(frame * 4.2) * Math.exp(-((frame - 12) % 3) * 1.5) * 1.8
    : 0;

  // --- HOLD PHASE CURSOR BLINK (Frame 45 - 180) ---
  const idleFrame = Math.max(0, frame - 45);
  const cursorBlink = frame >= 45 && frame < 180
    ? (Math.floor(idleFrame / 12) % 2 === 0 ? 1 : 0)
    : 0;

  // --- EXIT MECHANICAL CARRIAGE SLIDE-OUT & ORGANIC WIPE (Frame 180 - 210) ---
  const exitProgress = interpolate(frame, [180, 208], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.6, 0, 0.8, 0),
  });

  // Mechanical Carriage Slide-Out to Right (+250px)
  const carriageOutX = interpolate(exitProgress, [0, 1], [0, 250]);

  // Organic irregular ink wipe edge: X offset moves from 1350 to 0
  const inkWipeX = interpolate(exitProgress, [0, 1], [1350, -100]);
  const exitOpacity = interpolate(exitProgress, [0.75, 1], [1, 0]);

  // Combined X Offset
  const totalX = carriageInX + carriageOutX + microShakeX;

  const titleTextOpacity = interpolate(typingProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(typingProgress, [0, 1], [0, 1]) * exitOpacity;

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
      {/* TYPEWRITER LEDGER CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1350px',
          height: '150px',
          opacity: exitOpacity,
          transform: `translate(${totalX}px, ${microShakeY}px)`,
        }}
      >
        {/* VINTAGE PAPER SOFT BACK GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '1350px',
            height: '150px',
            background: 'radial-gradient(ellipse at center, rgba(237, 230, 211, 0.28) 0%, transparent 75%)',
            filter: 'blur(45px)',
            opacity: carriageSpring * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1350"
          height="150"
          viewBox="0 0 1350 150"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Vintage Off-White Ledger Paper Gradient */}
            <linearGradient id="ledger-paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3ECE0" />
              <stop offset="50%" stopColor="#EDE6D3" />
              <stop offset="100%" stopColor="#E4DBC8" />
            </linearGradient>

            {/* Brass Grommet Ring Gradient */}
            <linearGradient id="brass-grommet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A857" />
              <stop offset="100%" stopColor="#B48837" />
            </linearGradient>

            {/* Ink Stamp Drop Shadow */}
            <filter id="ledger-shadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.75" />
            </filter>

            {/* Organic Wet Ink Dissolve Clip Path */}
            <clipPath id="ink-dissolve-clip">
              <path
                d={`M -50 -20 
                   L ${inkWipeX} -20 
                   Q ${inkWipeX - 30} 35 ${inkWipeX - 10} 75 
                   T ${inkWipeX - 40} 150 
                   L -50 170 Z`}
              />
            </clipPath>
          </defs>

          {/* MAIN PAPER & TYPING CONTENT WITH ORGANIC INK WIPE CLIP */}
          <g clipPath="url(#ink-dissolve-clip)" filter="url(#ledger-shadow)">
            {/* 1. OFF-WHITE VINTAGE LEDGER PAPER PANEL */}
            <rect
              x="0"
              y="0"
              width="1350"
              height="150"
              rx="8"
              ry="8"
              fill="url(#ledger-paper-grad)"
              stroke="#1C1C1C"
              strokeWidth="2.5"
            />

            {/* 2. FINE HORIZONTAL RULED PAPER LINES TEXTURE */}
            {[25, 50, 75, 100, 125].map((lineY) => (
              <line
                key={lineY}
                x1="12"
                y1={lineY}
                x2="1338"
                y2={lineY}
                stroke="#1C1C1C"
                strokeWidth="1"
                opacity="0.1"
              />
            ))}

            {/* Vertical Left Red Margin Rule Line */}
            <line x1="84" y1="0" x2="84" y2="150" stroke="#EF4444" strokeWidth="1.8" opacity="0.4" />

            {/* 3. TOP-RIGHT RED CONFIDENTIAL / CLASSIFIED INK STAMP BADGE */}
            <g transform="translate(1220, 16)" opacity="0.85">
              <rect x="0" y="0" width="100" height="26" rx="4" ry="4" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="6 3" />
              <circle cx="16" cy="13" r="4" fill="#DC2626" />
              <line x1="30" y1="13" x2="86" y2="13" stroke="#DC2626" strokeWidth="2" />
            </g>

            {/* 4. BOTTOM-RIGHT INDUSTRIAL BARCODE SERIAL TICKS */}
            <g transform="translate(1240, 110)" opacity="0.75">
              {[2, 5, 2, 8, 3, 6, 2, 5, 3, 7].map((w, idx) => (
                <rect key={idx} x={idx * 8} y="0" width={w} height="22" fill="#1C1C1C" />
              ))}
            </g>

            {/* 5. TYPEWRITER GRAPHIC REPRESENTATIVE KEY DASHES (typing left to right) */}
            <g opacity={typingProgress}>
              {[...Array(13)].map((_, i) => {
                const dashVisible = i <= typingStep;
                return (
                  <line
                    key={i}
                    x1={115 + i * 82}
                    y1="108"
                    x2={175 + i * 82}
                    y2="108"
                    stroke="#1C1C1C"
                    strokeWidth="2.5"
                    opacity={dashVisible ? 0.38 : 0}
                  />
                );
              })}
            </g>

            {/* 6. BLINKING TYPEWRITER CURSOR LINE (Hold Phase) */}
            {cursorBlink > 0 && typingProgress >= 1 && (
              <rect
                x={115 + 14 * 82}
                y="38"
                width="3"
                height="70"
                fill="#1C1C1C"
              />
            )}
          </g>

          {/* 7. FAR LEFT STAMP BOX (40px x 40px) WITH STAMP CROSS & BRASS GROMMET */}
          <g
            transform={`translate(24, 55) scale(${stampSpring})`}
            style={{ transformOrigin: '20px 20px' }}
            opacity={stampSpring}
            filter="url(#ledger-shadow)"
          >
            {/* Square Stamp Box */}
            <rect
              x="0"
              y="0"
              width="40"
              height="40"
              rx="4"
              ry="4"
              fill="#EDE6D3"
              stroke="#1C1C1C"
              strokeWidth="2.5"
            />
            {/* Simple Cross "×" Stamp Lines */}
            <line x1="10" y1="10" x2="30" y2="30" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="10" x2="10" y2="30" stroke="#1C1C1C" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Brass Grommet Ring Hole Accent (Top-Left) */}
          <g transform="translate(44, 22)" opacity={carriageSpring}>
            <circle cx="0" cy="0" r="6" fill="url(#brass-grommet-grad)" stroke="#1C1C1C" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2.5" fill="#000000" />
          </g>
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '22px',
              left: '115px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '44px',
                fontWeight: 800,
                color: '#1C1C1C',
                letterSpacing: '2px',
                fontFamily: 'Courier New, monospace',
                lineHeight: 1,
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
              top: '82px',
              left: '115px',
              opacity: subTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#444444',
                letterSpacing: '1.5px',
                fontFamily: 'Courier New, monospace',
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
