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
  weights: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerChronometerVintageProps {
  accentColor?: string; // Warm Parchment Brass #E6C594
  accentGradientEnd?: string; // Aged Copper Rose #C87D55
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_ChronometerVintage (Vintage Astronomical Clockwork Terminal & Difference Engine)
 * Niche: Mechanical Computing, Babbage Difference Engine, Vintage Astronomy, Steampunk Hacking, Heritage Horology.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   12-Blade Clockwork Iris Shut & Blackout (150 - 165f)
 * - Warm Parchment Brass (#E6C594) & Aged Copper Rose (#C87D55) palette on Deep Antique Slate (#1A1715).
 * - Central Chamfered Clockwork Console Box (1240px x 940px, 4K) framed by 60-Tooth Precision Gear Ring.
 * - Background Astronomical Matrix Stream: Gear ratios (TEETH_60, RATIO_1.618, 0x7F8A, CHRONO_LOCK).
 * - ASCII Mechanical Progress Bar ([■■■■□□□□□□]) updating in sync with countdown.
 * - Decode Text Scramble: First 5 frames of each number step flicker random glyphs (#, X, ?, &).
 * - 30° Mechanical Gear Snap Spring & Warm Copper Glitch Split on cut frames (±18px).
 * - 12-Blade Clockwork Mechanical Iris Shut exit to solid blackness.
 */
export const CountdownTimer_ChronometerVintage: React.FC<CountdownTimerChronometerVintageProps> = ({
  accentColor = '#E6C594', // Warm Parchment Brass
  accentGradientEnd = '#C87D55', // Aged Copper Rose
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#1A1715';
    if (bg === 'greenscreen') return '#00FF00';
    if (bg === 'bluescreen') return '#0047AB';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE CALCULATIONS (165 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // ==========================================
  const framesPerNumber = 30;
  const currentNumberIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];
  const targetNumber = numberSequence[currentNumberIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;

  // --- MECHANICAL GEAR SNAP SPRING MATH ---
  const gearSnapSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });

  const gearSnapAngle = currentNumberIndex * 30 + interpolate(gearSnapSpring, [0, 1], [0, 30]);

  // --- SCRAMBLE DECODE TEXT MATH ---
  // First 5 frames of each number step show random scramble characters
  const isDecodingPhase = localFrame >= 0 && localFrame <= 4 && frame < 150;
  const scrambleGlyphs = ['#', 'X', '0', '&', '?', '9', 'Z', '%', '$', '8', 'A', 'F', 'C'];
  const scrambleChar = scrambleGlyphs[(frame * 13 + localFrame * 7) % scrambleGlyphs.length];
  const displayGlyph = isDecodingPhase ? scrambleChar : targetNumber.toString();

  // --- GLITCH & HORIZONTAL DISPLACEMENT MATH ---
  const isGlitchPhase = (localFrame >= 28 || localFrame <= 2) && frame < 150;
  const glitchX = isGlitchPhase ? (Math.sin(frame * 23.3) > 0 ? 18 : -18) : 0;
  const glitchY = isGlitchPhase ? (Math.cos(frame * 31.7) > 0 ? -10 : 10) : 0;

  // --- ASCII PROGRESS BAR MATH ---
  const asciiFilledBlocks = 2 + currentNumberIndex * 2;
  const asciiProgressBar = `[${'■'.repeat(asciiFilledBlocks)}${'□'.repeat(10 - asciiFilledBlocks)}] ${asciiFilledBlocks * 10}% CALIBRATED`;

  // --- BACKGROUND ASTRONOMICAL TELEMETRY STREAM (30 Ticks) ---
  const matrixChars = ['TEETH_60', '0x7F8A', 'RATIO_1.618', 'DECLIN_23.4°', 'CHRONO_LOCK', 'GEAR_RATIO_4', '0xFF90', 'CALIB_OK'];

  // --- EXIT PHASE: 12-BLADE MECHANICAL IRIS SHUT (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const irisProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const irisRadius = isEndPhase ? interpolate(irisProgress, [0, 1], [1200, 0]) : 1200;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : 1,
      }}
    >
      {/* 1. MECHANICAL IRIS SHUTTER CLIP CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: isEndPhase ? `circle(${irisRadius}px at 50% 50%)` : 'none',
        }}
      >
        {/* AMBIENT WARM ROSE GOLD & BRASS GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1450px',
            height: '1450px',
            background: `radial-gradient(circle at center, ${accentColor}30 0%, ${accentGradientEnd}18 45%, transparent 70%)`,
            filter: 'blur(85px)',
            pointerEvents: 'none',
          }}
        />

        {/* 2. BACKGROUND ASTRONOMICAL TELEMETRY CODE STREAM */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            padding: '80px',
            opacity: isEndPhase ? 0.15 : 0.22,
            color: accentColor,
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'Courier New, monospace',
            pointerEvents: 'none',
          }}
        >
          {[...Array(30)].map((_, i) => {
            const randVal = matrixChars[(i * 7 + frame * 3) % matrixChars.length];
            return (
              <div key={i} style={{ padding: '20px' }}>
                {`> ${randVal}`}
              </div>
            );
          })}
        </div>

        {/* 3. MAIN CLOCKWORK TERMINAL CONSOLE CONTAINER (1240px x 940px, Center 1920, 1080) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: `translate(${glitchX}px, ${glitchY}px)`,
            transformOrigin: 'center center',
          }}
        >
          {/* COPPER GLITCH OVERLAY */}
          {isGlitchPhase && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `translate(${glitchX * 1.5}px, ${glitchY * 1.5}px)`,
                opacity: 0.7,
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            >
              <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <polygon
                  points="1310,610 2530,610 2560,640 2560,1520 2530,1550 1310,1550 1280,1520 1280,640"
                  fill="none"
                  stroke="#C87D55"
                  strokeWidth="4"
                />
              </svg>
            </div>
          )}

          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Antique Brass Bloom Glow */}
              <filter id="vintage-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor={accentColor} floodOpacity="0.8" />
              </filter>

              {/* Dark Console Fill Shadow */}
              <filter id="vintage-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#000000" floodOpacity="0.95" />
              </filter>

              {/* Antique Brass Glass Gradient */}
              <linearGradient id="vintage-glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2A1E15" />
                <stop offset="50%" stopColor="#18110B" />
                <stop offset="100%" stopColor="#0B0704" />
              </linearGradient>

              {/* Vignette Shadow */}
              <radialGradient id="vintage-vignette" cx="50%" cy="50%" r="75%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                <stop offset="65%" stopColor="#000000" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
              </radialGradient>
            </defs>

            {/* ROTATING 60-TOOTH PRECISION GEAR FRAMEWORK (Center 1920, 1080) */}
            <g
              transform={`translate(${width / 2}, ${height / 2}) rotate(${gearSnapAngle})`}
              filter="url(#vintage-glow)"
              opacity="0.85"
            >
              <circle cx="0" cy="0" r="740" fill="none" stroke="url(#vintage-glass-grad)" strokeWidth="6" />

              {/* 60 GEAR TEETH */}
              {[...Array(60)].map((_, i) => {
                const deg = i * 6;
                const rad = (deg * Math.PI) / 180;
                const isMajor = i % 5 === 0;
                const rInner = isMajor ? 720 : 730;
                const rOuter = 755;
                return (
                  <line
                    key={i}
                    x1={Math.sin(rad) * rInner}
                    y1={-Math.cos(rad) * rInner}
                    x2={Math.sin(rad) * rOuter}
                    y2={-Math.cos(rad) * rOuter}
                    stroke={isMajor ? "#E6C594" : "#C87D55"}
                    strokeWidth={isMajor ? "3" : "1.5"}
                    opacity={isMajor ? 0.95 : 0.6}
                  />
                );
              })}
            </g>

            {/* LAYER A: CHAMFERED OCTAGONAL CLOCKWORK CONSOLE BOX (1240px x 940px, Center 1920, 1080) */}
            <g transform="translate(1300, 610)" filter="url(#vintage-shadow)">
              <polygon
                points="35,0 1205,0 1240,35 1240,905 1205,940 35,940 0,905 0,35"
                fill="url(#vintage-glass-grad)"
                stroke={accentColor}
                strokeWidth="4.5"
                filter="url(#vintage-glow)"
              />

              {/* Inner Precision Hairline Border */}
              <polygon
                points="45,14 1195,14 1226,45 1226,895 1195,926 45,926 14,895 14,45"
                fill="none"
                stroke="#C87D55"
                strokeWidth="1.8"
                strokeDasharray="18 12"
                opacity="0.5"
              />

              {/* Top Title Bar Header Plate */}
              <polygon
                points="35,0 1205,0 1240,35 1240,72 0,72 0,35"
                fill="#3E2A1A"
                stroke={accentColor}
                strokeWidth="2"
                opacity="0.9"
              />

              {/* Title Bar Separator Line */}
              <line x1="0" y1="72" x2="1240" y2="72" stroke={accentColor} strokeWidth="3" opacity="0.85" />

              {/* Top Title Bar Header Text Prompt */}
              <text x="36" y="45" fill="#E6C594" fontSize="22" fontWeight="800" fontFamily="Courier New, monospace" opacity="0.95" filter="url(#vintage-glow)">
                CHRONOMETER // ASTRONOMICAL_BOOT_v1.0
              </text>

              {/* Top Right Control Indicators */}
              <circle cx="1160" cy="36" r="7" fill="#C87D55" filter="url(#vintage-glow)" />
              <circle cx="1190" cy="36" r="7" fill="#E6C594" filter="url(#vintage-glow)" />

              {/* Bottom Status Ticker Line */}
              <line x1="30" y1="880" x2="1210" y2="880" stroke="#C87D55" strokeWidth="1.5" opacity="0.4" />
              <text x="40" y="912" fill="#E6C594" fontSize="18" fontWeight="700" fontFamily="Courier New, monospace" opacity="0.8">
                {`CALIB: 60_TEETH // GEAR_RATIO: 1.618 // STEP_0${currentNumberIndex + 1}`}
              </text>
            </g>

            {/* LAYER C: VINTAGE VIGNETTE RADIAL SHADOW */}
            <rect x="0" y="0" width={width} height={height} fill="url(#vintage-vignette)" pointerEvents="none" />
          </svg>

          {/* LAYER D: BIG MONOSPACE COUNTDOWN NUMBER & ASCII PROGRESS BAR */}
          {!isEndPhase && (
            <div
              style={{
                position: 'absolute',
                top: '682px',
                left: '1300px',
                width: '1240px',
                height: '800px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              {/* BIG MONOSPACE DECODE NUMBER */}
              <span
                style={{
                  fontSize: '370px',
                  fontWeight: 900,
                  color: '#F5EBE0',
                  fontFamily: 'Courier New, monospace',
                  lineHeight: 1,
                  textShadow: '0 0 35px #E6C594, 0 0 70px rgba(200, 125, 85, 0.65)',
                  letterSpacing: '-8px',
                }}
              >
                {displayGlyph}
              </span>

              {/* ASCII PROGRESS BAR CONTAINER */}
              <div
                style={{
                  marginTop: '25px',
                  padding: '12px 28px',
                  backgroundColor: 'rgba(230, 197, 148, 0.08)',
                  border: '1.8px solid rgba(230, 197, 148, 0.45)',
                  borderRadius: '8px',
                  fontSize: '30px',
                  fontWeight: 800,
                  color: accentColor,
                  fontFamily: 'Courier New, monospace',
                  letterSpacing: '3px',
                  textShadow: '0 0 18px #E6C594',
                }}
              >
                {asciiProgressBar}
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
