import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Easing,
} from 'remotion';

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerTerminalSplitGridProps {
  accentColor?: string; // Luminous Phosphor Amber #FFB000
  accentGradientEnd?: string; // Emerald Mint #10B981
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_TerminalSplitGrid (Multi-Pane Asymmetric Command Grid Countdown - NO CENTER BOX)
 * Niche: Developer Command Center, Hacking Log Stream, Cyber Operations, Data Analytics Launch.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Asymmetric Shutter Collapse & Blackout (150 - 165f)
 * - NO CENTER BOX: Uses an Asymmetric Multi-Pane Modular Dashboard Layout.
 * - Left Pane (32% width): Live upward scrolling terminal command log stream.
 * - Right Main Zone (68% width): Giant open monospace countdown number with open grid crosshairs & bottom ASCII progress track.
 * - Phosphor Amber Gold (#FFB000) & Emerald Mint (#10B981) palette on Deep Obsidian (#0D1117).
 * - Decode Text Scramble: First 5 frames of each number step flicker random glyphs.
 * - Asymmetric Shutter Collapse exit to solid blackness.
 */
export const CountdownTimer_TerminalSplitGrid: React.FC<CountdownTimerTerminalSplitGridProps> = ({
  accentColor = '#FFB000', // Luminous Phosphor Amber
  accentGradientEnd = '#10B981', // Emerald Mint
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#0D1117';
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
  const isCutFrame = localFrame === 0 && frame > 0 && frame <= 150;

  // --- SCRAMBLE DECODE TEXT MATH ---
  // First 5 frames of each number step show random scramble characters
  const isDecodingPhase = localFrame >= 0 && localFrame <= 4 && frame < 150;
  const scrambleGlyphs = ['#', 'X', '0', '&', '?', '9', 'Z', '%', '$', '8', 'A', 'F', 'C'];
  const scrambleChar = scrambleGlyphs[(frame * 13 + localFrame * 7) % scrambleGlyphs.length];
  const displayGlyph = isDecodingPhase ? scrambleChar : targetNumber.toString();

  // --- RGB & HORIZONTAL DISPLACEMENT GLITCH MATH ---
  const isGlitchPhase = (localFrame >= 28 || localFrame <= 2) && frame < 150;
  const glitchX = isGlitchPhase ? (Math.sin(frame * 23.3) > 0 ? 16 : -16) : 0;
  const glitchY = isGlitchPhase ? (Math.cos(frame * 31.7) > 0 ? -10 : 10) : 0;

  // --- CRT SCANLINE SWEEP MATH ---
  const scanlineY = (frame * 24) % height;

  // --- ASCII PROGRESS TRACK MATH ---
  const asciiFilledBlocks = 3 + currentNumberIndex * 3;
  const asciiProgressTrack = `[${'■'.repeat(asciiFilledBlocks)}${'□'.repeat(15 - asciiFilledBlocks)}] ${Math.round((asciiFilledBlocks / 15) * 100)}% COMPLETE`;

  // --- LEFT TERMINAL LOG STREAM DATA (Scrolling Log Lines) ---
  const terminalLogLines = [
    'SYS_INIT: Booting Kernel v5.18.4-RELEASE...',
    'NET_SEC: Establishing 4096-bit RSA handshake...',
    'MEM_ALLOC: 16384MB VRAM allocated at 0x8F902A',
    'GPU_CORE: Parallel compute threads initialized',
    'SECURITY: Firewalls verified // Port 443 active',
    'ENCRYPT: AES-256 GCM cipher stream locked',
    'CALIBRATION: Telemetry sync at 3840x2160 30FPS',
    'EXEC: Running countdown sequence step...',
    'STATUS: Master lock verified // Proceeding',
    'DAEMON: Background tasks monitoring status',
    'DECRYPT: Parsing cipher key block 0x90F2...',
    'SUCCESS: Sequence step validated cleanly',
  ];

  // Upward scroll offset for left log stream
  const logScrollY = ((frame * 2.5) % (terminalLogLines.length * 38));

  // --- ASYMMETRIC SHUTTER COLLAPSE EXIT (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const exitProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const leftPaneSlideX = isEndPhase ? interpolate(exitProgress, [0, 1], [0, -1250]) : 0;
  const rightPaneScaleY = isEndPhase ? interpolate(exitProgress, [0, 1], [1, 0.002]) : 1;
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
      {/* 1. LUMINOUS AMBER & EMERALD MINT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          width: '1400px',
          height: '1400px',
          background: `radial-gradient(circle at center, ${accentColor}30 0%, ${accentGradientEnd}18 50%, transparent 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
      >
        <defs>
          <filter id="amber-split-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor={accentColor} floodOpacity="0.85" />
          </filter>

          <filter id="mint-split-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentGradientEnd} floodOpacity="0.8" />
          </filter>

          <radialGradient id="split-vignette" cx="50%" cy="50%" r="75%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="65%" stopColor="#000000" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* FULL-FRAME CRT SCANLINE SWEEP */}
        <g opacity="0.4">
          <line x1="0" y1={scanlineY} x2={width} y2={scanlineY} stroke={accentColor} strokeWidth="4" filter="url(#amber-split-glow)" />
          <line x1="0" y1={scanlineY + 6} x2={width} y2={scanlineY + 6} stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
      </svg>

      {/* 2. LEFT TERMINAL COMMAND LOG COLUMN (32% Width = 1228px, Slides Left on Exit) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1228px',
          height: '100%',
          borderRight: '3px solid #FFB000',
          backgroundColor: 'rgba(13, 17, 23, 0.85)',
          transform: `translateX(${leftPaneSlideX}px)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '80px 60px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Left Column Header Ticker */}
        <div
          style={{
            paddingBottom: '30px',
            marginBottom: '40px',
            borderBottom: '2px stroke #FFB000',
            color: accentColor,
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '2px',
            textShadow: '0 0 15px #FFB000',
          }}
        >
          {`[TERMINAL_LOG // LIVE_STREAM]`}
        </div>

        {/* Scrolling Log Stream */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            transform: `translateY(-${logScrollY}px)`,
            color: accentGradientEnd,
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {[...terminalLogLines, ...terminalLogLines].map((line, idx) => (
            <div key={idx} style={{ textShadow: '0 0 10px #10B981' }}>
              {`> ${line}`}
            </div>
          ))}
        </div>
      </div>

      {/* 3. RIGHT HERO COUNTDOWN ZONE (68% Width, OPEN LAYOUT WITH NO CENTER BOX!) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '1228px',
          width: '2612px',
          height: '100%',
          transform: `scaleY(${rightPaneScaleY}) translate(${glitchX}px, ${glitchY}px)`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          width="2612"
          height={height}
          viewBox={`0 0 2612 ${height}`}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
        >
          {/* OPEN GRID CROSSHAIR & AXIS RULES (NO RECTANGLE BOX AROUND NUMBER!) */}
          <g opacity="0.5" filter="url(#amber-split-glow)">
            {/* Top & Bottom Horizontal Axis Rules */}
            <line x1="120" y1="240" x2="2492" y2="240" stroke="#FFB000" strokeWidth="2.5" strokeDasharray="16 10" />
            <line x1="120" y1="1920" x2="2492" y2="1920" stroke="#FFB000" strokeWidth="2.5" strokeDasharray="16 10" />

            {/* Central Axis Target Hairlines */}
            <line x1="1306" y1="360" x2="1306" y2="1800" stroke="#10B981" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />
            <line x1="360" y1="1080" x2="2252" y2="1080" stroke="#10B981" strokeWidth="2" strokeDasharray="8 8" opacity="0.6" />

            {/* Corner Alignment Crosses */}
            <circle cx="120" cy="240" r="6" fill="#FFB000" />
            <circle cx="2492" cy="240" r="6" fill="#FFB000" />
            <circle cx="120" cy="1920" r="6" fill="#FFB000" />
            <circle cx="2492" cy="1920" r="6" fill="#FFB000" />
          </g>

          {/* GRID CUT WIPE EFFECT */}
          {isCutFrame && (
            <line x1="0" y1={height / 2} x2="2612" y2={height / 2} stroke="#10B981" strokeWidth="6" filter="url(#mint-split-glow)" />
          )}
        </svg>

        {/* GIANT OPEN MONOSPACE COUNTDOWN NUMBER */}
        {!isEndPhase && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: '440px',
                fontWeight: 900,
                color: '#F8FAFC',
                fontFamily: 'Courier New, monospace',
                lineHeight: 1,
                letterSpacing: '-10px',
                textShadow: '0 0 45px #FFB000, 0 0 90px rgba(16, 185, 129, 0.65), 0 15px 35px rgba(0, 0, 0, 0.95)',
              }}
            >
              {displayGlyph}
            </span>

            {/* ASCII MULTI-BLOCK PROGRESS TRACK */}
            <div
              style={{
                marginTop: '40px',
                padding: '14px 36px',
                backgroundColor: 'rgba(255, 176, 0, 0.08)',
                border: '2px solid rgba(255, 176, 0, 0.5)',
                borderRadius: '8px',
                fontSize: '32px',
                fontWeight: 800,
                color: accentColor,
                fontFamily: 'Courier New, monospace',
                letterSpacing: '4px',
                textShadow: '0 0 20px #FFB000',
              }}
            >
              {asciiProgressTrack}
            </div>
          </div>
        )}
      </div>

      {/* 4. VIGNETTE RADIAL SHADOW */}
      <rect x="0" y="0" width={width} height={height} fill="url(#split-vignette)" pointerEvents="none" />
    </AbsoluteFill>
  );
};
