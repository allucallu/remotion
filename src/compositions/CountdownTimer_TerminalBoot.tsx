import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Easing,
} from 'remotion';

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerTerminalBootProps {
  accentColor?: string; // Phosphor CRT Green #00FF41
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_TerminalBoot (Hacking Command-Line & CRT Terminal Countdown)
 * Niche: Hacking, Cyber Security, Tech Boot, Developer Stream, Console Command-Line.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Heavy Terminal Crash & CRT Dot Collapse (150 - 165f)
 * - Phosphor Terminal Green (#00FF41) on Solid Black (#000000).
 * - Enhanced Terminal Window Box (1240px x 940px, 4K): Dual-layer hairline borders, 4 L-bracket corner notches, header bar plate, & inner phosphor glass gradient.
 * - Background Matrix Code Stream: Rapid random hex/binary characters (0x4F2A, #FF01).
 * - ASCII Progress Bar ([■■■■□□□□□□]) updating in sync with countdown.
 * - Decode Text Scramble: First 5 frames of each number step flicker random glyphs (#, X, ?, &).
 * - RGB Split Glitch & Slice Displacement on cut frames (±18px).
 * - Continuous CRT Scanline Sweep (top to bottom).
 * - CRT Dot Collapse exit into solid blackness.
 */
export const CountdownTimer_TerminalBoot: React.FC<CountdownTimerTerminalBootProps> = ({
  accentColor = '#00FF41', // Phosphor CRT Green
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
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

  // --- SCRAMBLE DECODE TEXT MATH ---
  // First 5 frames of each number step show random scramble characters
  const isDecodingPhase = localFrame >= 0 && localFrame <= 4 && frame < 150;
  const scrambleGlyphs = ['#', 'X', '0', '&', '?', '9', 'Z', '%', '$', '8', 'A', 'F'];
  const scrambleChar = scrambleGlyphs[(frame * 13 + localFrame * 7) % scrambleGlyphs.length];
  const displayGlyph = isDecodingPhase ? scrambleChar : targetNumber.toString();

  // --- RGB GLITCH & SLICE DISPLACEMENT MATH ---
  const isGlitchPhase = (localFrame >= 28 || localFrame <= 2) && frame < 150;
  const glitchX = isGlitchPhase ? (Math.sin(frame * 23.3) > 0 ? 18 : -18) : 0;
  const glitchY = isGlitchPhase ? (Math.cos(frame * 31.7) > 0 ? -10 : 10) : 0;

  // --- CRT SCANLINE SWEEP MATH ---
  const scanlineY = (frame * 24) % height;

  // --- ASCII PROGRESS BAR MATH ---
  // Fill 2 to 10 blocks out of 10
  const asciiFilledBlocks = 2 + currentNumberIndex * 2;
  const asciiProgressBar = `[${'■'.repeat(asciiFilledBlocks)}${'□'.repeat(10 - asciiFilledBlocks)}] ${asciiFilledBlocks * 10}%`;

  // --- BACKGROUND MATRIX CODE GENERATION (30 Ticks) ---
  const matrixChars = ['0x4F', '0x8A', '#FF01', 'SYS_OK', 'MEM_0x2', '0101', 'BOOT', 'LOCK', '0x99', '0xFF'];

  // --- END PHASE TERMINAL CRASH & CRT DOT COLLAPSE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const crashProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  // Heavy Crash Glitch Flicker (Frame 150 - 157)
  const isHeavyCrashGlitch = isEndPhase && frame <= 157;
  const crashGlitchX = isHeavyCrashGlitch ? (Math.sin(frame * 43.1) > 0 ? 45 : -45) : 0;

  // CRT Dot Collapse (Frame 157 - 162): Scale down to tiny dot
  const crtDotScaleX = isEndPhase ? interpolate(crashProgress, [0.5, 0.95, 1], [1, 0.04, 0]) : 1;
  const crtDotScaleY = isEndPhase ? interpolate(crashProgress, [0.5, 0.95, 1], [1, 0.003, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: 'Courier New, monospace, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : 1,
      }}
    >
      {/* 1. CRT PHOSPHOR GREEN AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1450px',
          height: '1450px',
          background: `radial-gradient(circle at center, ${accentColor}35 0%, transparent 68%)`,
          filter: 'blur(85px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. BACKGROUND MATRIX CODE TELEMETRY STREAM */}
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
          opacity: isEndPhase ? 0.18 : 0.22,
          color: accentColor,
          fontSize: '24px',
          fontWeight: 700,
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

      {/* 3. MAIN ENHANCED TERMINAL CONSOLE CONTAINER (1240px x 940px, Center 1920, 1080) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${crtDotScaleX}, ${crtDotScaleY}) translate(${glitchX + crashGlitchX}px, ${glitchY}px)`,
          transformOrigin: 'center center',
        }}
      >
        {/* RGB CHROMATIC RED GLITCH SHIFT */}
        {isGlitchPhase && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(${glitchX * 1.5}px, ${glitchY * 1.5}px)`,
              opacity: 0.75,
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          >
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <rect x="1300" y="610" width="1240" height="940" rx="16" fill="none" stroke="#FF0055" strokeWidth="4" />
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
            {/* CRT Phosphor Bloom Glow Filter */}
            <filter id="crt-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor={accentColor} floodOpacity="0.88" />
            </filter>

            {/* Dark Window Fill Shadow */}
            <filter id="terminal-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="20" stdDeviation="28" floodColor="#000000" floodOpacity="0.95" />
            </filter>

            {/* Inner Terminal Phosphor Glass Gradient */}
            <linearGradient id="terminal-glass-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#081E10" />
              <stop offset="50%" stopColor="#041209" />
              <stop offset="100%" stopColor="#020A05" />
            </linearGradient>

            {/* CRT Monitor Radial Vignette */}
            <radialGradient id="crt-vignette" cx="50%" cy="50%" r="75%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0" />
              <stop offset="65%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.92" />
            </radialGradient>
          </defs>

          {/* LAYER A: ENHANCED TERMINAL WINDOW BOX (1240px x 940px, Center 1920, 1080) */}
          <g transform="translate(1300, 610)" filter="url(#terminal-shadow)">
            {/* Terminal Window Outer Background & Solid Fill */}
            <rect
              x="0"
              y="0"
              width="1240"
              height="940"
              rx="16"
              ry="16"
              fill="url(#terminal-glass-grad)"
              stroke={accentColor}
              strokeWidth="4"
              filter="url(#crt-glow)"
            />

            {/* Inner Precision Hairline Border */}
            <rect
              x="12"
              y="12"
              width="1216"
              height="916"
              rx="10"
              ry="10"
              fill="none"
              stroke="#00FF41"
              strokeWidth="1.5"
              strokeDasharray="20 12"
              opacity="0.45"
            />

            {/* Top Window Title Bar Header Plate Background */}
            <path
              d="M 0 16 A 16 16 0 0 1 16 0 L 1224 0 A 16 16 0 0 1 1240 16 L 1240 68 L 0 68 Z"
              fill="#0E2818"
              stroke="#00FF41"
              strokeWidth="2"
              opacity="0.9"
            />

            {/* Top Window Title Bar Separator Line */}
            <line x1="0" y1="68" x2="1240" y2="68" stroke={accentColor} strokeWidth="3" opacity="0.8" />

            {/* Top Left Window Control Dots (Red, Amber, Green) */}
            <circle cx="36" cy="34" r="9" fill="#FF4444" filter="url(#crt-glow)" />
            <circle cx="68" cy="34" r="9" fill="#FFBB33" filter="url(#crt-glow)" />
            <circle cx="100" cy="34" r="9" fill="#00FF41" filter="url(#crt-glow)" />

            {/* Top Left Header Text Title Prompt */}
            <text x="135" y="42" fill="#00FF41" fontSize="20" fontWeight="700" fontFamily="Courier New, monospace" opacity="0.9" filter="url(#crt-glow)">
              CONSOLE // TERMINAL_BOOT_05.SH
            </text>

            {/* Top Right Decorative Terminal Hairlines */}
            <line x1="1120" y1="34" x2="1190" y2="34" stroke={accentColor} strokeWidth="2.5" opacity="0.8" />
            <circle cx="1205" cy="34" r="4" fill="#00FF41" />

            {/* 4 CORNER L-BRACKET NOTCHES */}
            <path d="M -8 40 L -8 -8 L 40 -8" fill="none" stroke="#00FF41" strokeWidth="4" filter="url(#crt-glow)" />
            <path d="M 1200 -8 L 1248 -8 L 1248 40" fill="none" stroke="#00FF41" strokeWidth="4" filter="url(#crt-glow)" />
            <path d="M 1248 900 L 1248 948 L 1200 948" fill="none" stroke="#00FF41" strokeWidth="4" filter="url(#crt-glow)" />
            <path d="M 40 948 L -8 948 L -8 900" fill="none" stroke="#00FF41" strokeWidth="4" filter="url(#crt-glow)" />

            {/* Bottom Terminal Status Footer Ticker Line */}
            <line x1="20" y1="880" x2="1220" y2="880" stroke="#00FF41" strokeWidth="1.5" opacity="0.35" />
            <text x="36" y="910" fill="#00FF41" fontSize="18" fontWeight="700" fontFamily="Courier New, monospace" opacity="0.75">
              {`STATUS: DECRYPTING_STEP_0${currentNumberIndex + 1} // 3840x2160 @ 30FPS`}
            </text>
          </g>

          {/* LAYER B: CONTINUOUS CRT HORIZONTAL SCANLINE SWEEP */}
          <g opacity="0.45">
            <line x1="0" y1={scanlineY} x2={width} y2={scanlineY} stroke={accentColor} strokeWidth="4" filter="url(#crt-glow)" />
            <line x1="0" y1={scanlineY + 6} x2={width} y2={scanlineY + 6} stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* LAYER C: CRT VIGNETTE SHADOW */}
          <rect x="0" y="0" width={width} height={height} fill="url(#crt-vignette)" pointerEvents="none" />
        </svg>

        {/* LAYER D: BIG CONSOLE COUNTDOWN NUMBER & ASCII PROGRESS BAR */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '678px',
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
                color: accentColor,
                fontFamily: 'Courier New, monospace',
                lineHeight: 1,
                textShadow: '0 0 35px #00FF41, 0 0 70px rgba(0, 255, 65, 0.65)',
                letterSpacing: '-8px',
              }}
            >
              {displayGlyph}
            </span>

            {/* ENHANCED ASCII PROGRESS BAR */}
            <div
              style={{
                marginTop: '30px',
                padding: '10px 24px',
                backgroundColor: 'rgba(0, 255, 65, 0.08)',
                border: '1.5px solid rgba(0, 255, 65, 0.4)',
                borderRadius: '8px',
                fontSize: '30px',
                fontWeight: 800,
                color: accentColor,
                fontFamily: 'Courier New, monospace',
                letterSpacing: '3px',
                textShadow: '0 0 16px #00FF41',
              }}
            >
              {asciiProgressBar}
            </div>
          </div>
        )}
      </div>

      {/* 4. HEAVY CRASH FLASH OVERLAY ON CRASH PHASE (Frame 150 - 157) */}
      {isHeavyCrashGlitch && (
        <AbsoluteFill
          style={{
            backgroundColor: '#00FF41',
            opacity: Math.sin(frame * 2.8) > 0 ? 0.35 : 0.08,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
