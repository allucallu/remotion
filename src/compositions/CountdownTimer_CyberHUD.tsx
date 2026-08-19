import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter Google Font
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerCyberHUDProps {
  accentColor?: string; // Hot Cyber Pink #FF0055
  accentGradientEnd?: string; // Electric Cyan #00F0FF
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_CyberHUD (Cyberpunk Sci-Fi HUD & Digital Glitch Countdown)
 * Niche: Cyberpunk, Sci-Fi Esports, Tech Event Launch, Streamer Intro.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Cyber Laser Beam Implosion & Blackout (150 - 165f)
 * - Octagonal HUD Shield Ring (1200px x 1200px, 4K) with 8 corner scope notches & reticle.
 * - Hot Cyber Pink (#FF0055) & Electric Cyan (#00F0FF) palette with bloom glow filter.
 * - PURGED all corner telemetry text lines for a 100% clean blank graphic canvas.
 * - Digital Glitch Physics: RGB Chromatic Aberration Offset Shift (±14px) & 3-frame Scanline Slice.
 * - 90° HUD Reticle Counter-Snap at each number change.
 * - Cyber Laser Implosion exit into total blackness.
 */
export const CountdownTimer_CyberHUD: React.FC<CountdownTimerCyberHUDProps> = ({
  accentColor = '#FF0055', // Hot Cyber Pink
  accentGradientEnd = '#00F0FF', // Electric Cyan
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#0B0E14';
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
  const currentDisplayNumber = numberSequence[currentNumberIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const isCutFrame = localFrame === 0 && frame > 0 && frame <= 150;
  const isGlitchPhase = (localFrame >= 27 || localFrame <= 2) && frame < 150;

  // --- CYBER HUD ANIMATION MATH ---
  // 1. Continuous Octagonal HUD Ring Rotation
  const hudRotate = (frame / 165) * 180;

  // 2. 90° Reticle Counter-Snap per Number Step
  const reticleSnapAngle = currentNumberIndex * -90;

  // 3. RGB Chromatic Glitch Offset Shift (Frame 27-29 & Frame 0-2)
  const glitchX = isGlitchPhase ? (Math.sin(frame * 19.3) > 0 ? 14 : -14) : 0;
  const glitchY = isGlitchPhase ? (Math.cos(frame * 23.7) > 0 ? -8 : 8) : 0;
  const glitchSliceY = isGlitchPhase ? Math.floor(((frame * 137) % 5) * 300) : -1000;

  // 4. Laser Energy Pulse on Cut Frame (Frame 30, 60, 90, 120, 150)
  const laserPulseOpacity = isCutFrame ? 0.95 : (localFrame === 1 ? 0.45 : 0);

  // 5. Cyber Laser Implosion Exit (Frame 150 - 165)
  const isEndPhase = frame >= 150;
  const implosionProgress = isEndPhase
    ? interpolate(frame, [150, 160], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const implosionScaleX = isEndPhase ? interpolate(implosionProgress, [0, 0.6, 1], [1, 1.4, 0]) : 1;
  const implosionScaleY = isEndPhase ? interpolate(implosionProgress, [0, 0.6, 1], [1, 0.05, 0]) : 1;
  const exitOpacity = isEndPhase ? interpolate(implosionProgress, [0.75, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 160;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : exitOpacity,
      }}
    >
      {/* 1. AMBIENT CYBER PINK & CYAN BLOOM GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1400px',
          height: '1400px',
          background: `radial-gradient(circle at center, ${accentColor}35 0%, ${accentGradientEnd}20 40%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. MAIN CYBER HUD CONTAINER (Centered & Scaled for Implosion) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${implosionScaleX}, ${implosionScaleY})`,
          transformOrigin: 'center center',
        }}
      >
        {/* RGB CHROMATIC ABERRATION GLITCH RED SHIFT */}
        {isGlitchPhase && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(${glitchX}px, ${glitchY}px)`,
              opacity: 0.75,
              mixBlendMode: 'screen',
              filter: 'hue-rotate(-40deg)',
              pointerEvents: 'none',
            }}
          >
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <circle cx={width / 2} cy={height / 2} r="580" fill="none" stroke="#FF0055" strokeWidth="6" />
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
            {/* Hot Pink to Cyan Cyber Gradient */}
            <linearGradient id="cyber-pink-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            <filter id="cyber-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={accentColor} floodOpacity="0.85" />
            </filter>

            <filter id="cyan-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentGradientEnd} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER A: FULL-FRAME TOP & BOTTOM TELEMETRY CALIBRATION LINES */}
          <g filter="url(#cyan-glow)" opacity="0.6">
            <line x1="200" y1="120" x2="3640" y2="120" stroke="#00F0FF" strokeWidth="2" strokeDasharray="16 10" />
            <line x1="200" y1="2040" x2="3640" y2="2040" stroke="#00F0FF" strokeWidth="2" strokeDasharray="16 10" />
            <circle cx="200" cy="120" r="5" fill="#00F0FF" />
            <circle cx="3640" cy="120" r="5" fill="#00F0FF" />
            <circle cx="200" cy="2040" r="5" fill="#00F0FF" />
            <circle cx="3640" cy="2040" r="5" fill="#00F0FF" />
          </g>

          {/* LAYER C: ROTATING OCTAGONAL HUD SHIELD RING (Center 1920, 1080, R = 600px) */}
          <g
            transform={`translate(${width / 2}, ${height / 2}) rotate(${hudRotate})`}
            filter="url(#cyber-glow)"
          >
            {/* Outer Octagonal Frame Ring */}
            <polygon
              points="550,-220 550,220 220,550 -220,550 -550,220 -550,-220 -220,-550 220,-550"
              fill="none"
              stroke="url(#cyber-pink-cyan)"
              strokeWidth="4"
            />

            {/* 8 Corner Chamfer Scope Brackets */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <line x1="0" y1="-570" x2="0" y2="-610" stroke="#FF0055" strokeWidth="4" />
                <rect x="-12" y="-625" width="24" height="6" fill="#00F0FF" />
              </g>
            ))}
          </g>

          {/* LAYER D: COUNTER-SNAPPING INNER HUD RETICLE (R = 480px) */}
          <g
            transform={`translate(${width / 2}, ${height / 2}) rotate(${reticleSnapAngle})`}
            filter="url(#cyan-glow)"
          >
            <circle cx="0" cy="0" r="480" fill="none" stroke="#00F0FF" strokeWidth="2.5" strokeDasharray="30 18" />
            <circle cx="0" cy="0" r="440" fill="none" stroke="#FF0055" strokeWidth="1.8" strokeDasharray="8 12" />

            {/* 4 Cardinal Scope Hairlines */}
            <line x1="-500" y1="0" x2="-440" y2="0" stroke="#00F0FF" strokeWidth="3" />
            <line x1="440" y1="0" x2="500" y2="0" stroke="#00F0FF" strokeWidth="3" />
            <line x1="0" y1="-500" x2="0" y2="-440" stroke="#00F0FF" strokeWidth="3" />
            <line x1="0" y1="440" x2="0" y2="500" stroke="#00F0FF" strokeWidth="3" />
          </g>

          {/* LAYER E: SCANLINE SLICE CORRUPTION ON GLITCH PHASE */}
          {isGlitchPhase && (
            <rect
              x="0"
              y={glitchSliceY}
              width={width}
              height="180"
              fill="#00F0FF"
              opacity="0.18"
              style={{ mixBlendMode: 'overlay' }}
            />
          )}
        </svg>

        {/* LAYER F: BIG FUTURISTIC CYBER DIGITAL NUMBER DISPLAY */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${glitchX}px), calc(-50% + ${glitchY}px))`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '600px',
              height: '600px',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '380px',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-6px',
                lineHeight: 1,
                textShadow: '0 0 35px #FF0055, 0 0 70px #00F0FF',
              }}
            >
              {currentDisplayNumber}
            </span>
          </div>
        )}
      </div>

      {/* 3. LASER ENERGY PULSE ON NUMBER CUT FRAME */}
      {laserPulseOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#FF0055',
            opacity: laserPulseOpacity,
            mixBlendMode: 'screen',
            pointerEvents: 'none',
          }}
        />
      )}
    </AbsoluteFill>
  );
};
