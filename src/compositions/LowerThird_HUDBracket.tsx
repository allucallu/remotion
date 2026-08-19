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

export interface LowerThirdHUDBracketProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

interface ShatterParticle {
  id: string;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
}

/**
 * Composition 2: LowerThird_HUDBracket (Polished Visual & Telemetry Detail)
 * Features:
 * - ZERO panel/box background! 4 corner framing scope brackets (1200px x 180px area, 4K).
 * - Dual-notched corner scope brackets, center target crosshair dial node, & audio dB scale ticks.
 * - Electric Cyan (#00E5FF) with glow/bloom filter on solid black background (#000000).
 * - Entrance (1.0s / 30f): 4 corner brackets fly in from 4 cardinal offscreen directions,
 *   landing with physical jiggle/wobble oscillation. Baseline line draws from left to right in 0.3s.
 * - Hold (5.0s / 150f): Gentle scanning radar pulse (opacity 100% -> 85% -> 100%), looping baseline particles.
 * - Exit (1.0s / 30f): Baseline line vanishes first (10f), 4 brackets shatter into particles dropping with gravity.
 * - Total Duration: 7.0 seconds (210 frames @ 30fps).
 */
export const LowerThird_HUDBracket: React.FC<LowerThirdHUDBracketProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#00E5FF', // Electric Cyan
  accentGradientEnd = '#38BDF8', // Bright Cyan Blue
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
  // Frame 0-30: Entrance Phase (In 1.0s)
  // Frame 30-180: Hold Phase (Hold 5.0s = 150f)
  // Frame 180-210: Exit Phase (Out 1.0s = 30f)
  // ==========================================

  // --- ENTRANCE BRACKET SPRINGS & JIGGLE WOBBLE ---
  const tlFlySpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  const trFlySpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  const blFlySpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  const brFlySpring = spring({
    frame: Math.max(0, frame - 11),
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 140 },
  });

  // Physical Jiggle/Wobble Oscillation on Landing (Frame 14 - 30)
  const landingTime = Math.max(0, frame - 14);
  const jiggleWobble = frame >= 14 && frame < 30
    ? Math.sin(landingTime * 0.8) * Math.exp(-landingTime * 0.25) * 8
    : 0;

  // Baseline Line Draw Progress (0.3s = 9f, Frame 18 - 27)
  const lineDrawProgress = interpolate(frame, [18, 27], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- HOLD PHASE RADAR PULSE & PARTICLES (Frame 30 - 180) ---
  const idleTime = Math.max(0, frame - 30) / 30;

  const bracketPulseOpacity = frame >= 30 && frame < 180
    ? 0.925 + Math.sin(idleTime * 2.5) * 0.075
    : 1;

  // --- EXIT PHASE (Frame 180 - 210) ---
  const baselineExitOpacity = interpolate(frame, [180, 190], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const shatterProgress = interpolate(frame, [185, 210], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const shatterOpacity = interpolate(shatterProgress, [0.6, 1], [1, 0]);
  const bracketOpacity = frame < 185 ? bracketPulseOpacity : (1 - shatterProgress);

  // --- TRANSFORM CALCULATIONS FOR BRACKETS ---
  const tlX = interpolate(tlFlySpring, [0, 1], [-500, 0]) + jiggleWobble;
  const tlY = interpolate(tlFlySpring, [0, 1], [-500, 0]) - jiggleWobble;

  const trX = interpolate(trFlySpring, [0, 1], [500, 0]) - jiggleWobble;
  const trY = interpolate(trFlySpring, [0, 1], [-500, 0]) + jiggleWobble;

  const blX = interpolate(blFlySpring, [0, 1], [-500, 0]) - jiggleWobble;
  const blY = interpolate(blFlySpring, [0, 1], [500, 0]) + jiggleWobble;

  const brX = interpolate(brFlySpring, [0, 1], [500, 0]) + jiggleWobble;
  const brY = interpolate(brFlySpring, [0, 1], [500, 0]) - jiggleWobble;

  const titleTextOpacity = interpolate(lineDrawProgress, [0, 1], [0, 1]) * baselineExitOpacity;
  const subTextOpacity = interpolate(lineDrawProgress, [0, 1], [0, 1]) * baselineExitOpacity;

  // Generate 24 Shatter Particle Dots for 4 Brackets on Exit
  const shatterParticles = React.useMemo<ShatterParticle[]>(() => {
    const particles: ShatterParticle[] = [];
    const corners = [
      { cx: 0, cy: 0 },       // Top-Left
      { cx: 1200, cy: 0 },    // Top-Right
      { cx: 0, cy: 180 },     // Bottom-Left
      { cx: 1200, cy: 180 },  // Bottom-Right
    ];

    corners.forEach((c, cornerIdx) => {
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + cornerIdx;
        const speed = 120 + (i % 3) * 60;
        particles.push({
          id: `${cornerIdx}-${i}`,
          baseX: c.cx,
          baseY: c.cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 60,
          radius: 3 + (i % 3),
        });
      }
    });
    return particles;
  }, []);

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
      {/* HUD BRACKET CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1200px',
          height: '180px',
        }}
      >
        {/* AMBIENT ELECTRIC CYAN GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            width: '1240px',
            height: '220px',
            background: `radial-gradient(ellipse at center, ${accentColor}30 0%, transparent 70%)`,
            filter: 'blur(55px)',
            opacity: tlFlySpring * bracketOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1200"
          height="180"
          viewBox="0 0 1200 180"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Electric Cyan Bloom Gradient */}
            <linearGradient id="hud-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor={accentGradientEnd} />
            </linearGradient>

            {/* Bloom / Glow Filter */}
            <filter id="hud-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={accentColor} floodOpacity="0.85" />
            </filter>
          </defs>

          {/* 1. TOP-LEFT CORNER HUD BRACKET (Dual-Notched Scope Bracket) */}
          {shatterProgress === 0 && (
            <g
              transform={`translate(${tlX}, ${tlY})`}
              opacity={tlFlySpring * bracketOpacity}
              filter="url(#hud-glow)"
            >
              <path d="M 0 54 L 0 0 L 54 0" fill="none" stroke="#00E5FF" strokeWidth="3.5" strokeLinecap="square" />
              <path d="M 10 54 L 10 10 L 54 10" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <circle cx="16" cy="16" r="3.5" fill="#00E5FF" />
              <line x1="26" y1="16" x2="38" y2="16" stroke="#00E5FF" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* 2. TOP-RIGHT CORNER HUD BRACKET */}
          {shatterProgress === 0 && (
            <g
              transform={`translate(${1200 + trX}, ${trY})`}
              opacity={trFlySpring * bracketOpacity}
              filter="url(#hud-glow)"
            >
              <path d="M -54 0 L 0 0 L 0 54" fill="none" stroke="#00E5FF" strokeWidth="3.5" strokeLinecap="square" />
              <path d="M -54 10 L -10 10 L -10 54" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <circle cx="-16" cy="16" r="3.5" fill="#00E5FF" />
              <line x1="-38" y1="16" x2="-26" y2="16" stroke="#00E5FF" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* 3. BOTTOM-LEFT CORNER HUD BRACKET */}
          {shatterProgress === 0 && (
            <g
              transform={`translate(${blX}, ${180 + blY})`}
              opacity={blFlySpring * bracketOpacity}
              filter="url(#hud-glow)"
            >
              <path d="M 0 -54 L 0 0 L 54 0" fill="none" stroke="#00E5FF" strokeWidth="3.5" strokeLinecap="square" />
              <path d="M 10 -54 L 10 -10 L 54 -10" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <circle cx="16" cy="-16" r="3.5" fill="#00E5FF" />
              <line x1="26" y1="-16" x2="38" y2="-16" stroke="#00E5FF" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* 4. BOTTOM-RIGHT CORNER HUD BRACKET */}
          {shatterProgress === 0 && (
            <g
              transform={`translate(${1200 + brX}, ${180 + brY})`}
              opacity={brFlySpring * bracketOpacity}
              filter="url(#hud-glow)"
            >
              <path d="M -54 0 L 0 0 L 0 -54" fill="none" stroke="#00E5FF" strokeWidth="3.5" strokeLinecap="square" />
              <path d="M -54 -10 L -10 -10 L -10 -54" fill="none" stroke="#00E5FF" strokeWidth="1.5" opacity="0.6" />
              <circle cx="-16" cy="-16" r="3.5" fill="#00E5FF" />
              <line x1="-38" y1="-16" x2="-26" y2="-16" stroke="#00E5FF" strokeWidth="1.5" opacity="0.7" />
            </g>
          )}

          {/* 5. THIN HORIZONTAL BASELINE LINE & CENTER TARGET CROSSHAIR */}
          <g opacity={baselineExitOpacity}>
            {/* Baseline Line (y = 90px) */}
            <line
              x1="50"
              y1="90"
              x2="1150"
              y2="90"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeDasharray="1100"
              strokeDashoffset={1100 * (1 - lineDrawProgress)}
              strokeLinecap="round"
              filter="url(#hud-glow)"
            />

            {/* Audio dB / Frequency Level Scale Ticks along Left & Right Ends */}
            <g opacity={lineDrawProgress * 0.75}>
              {[0, 1, 2, 3, 4].map((i) => (
                <React.Fragment key={i}>
                  <line x1={80 + i * 20} y1="83" x2={80 + i * 20} y2="97" stroke="#00E5FF" strokeWidth="1.8" />
                  <line x1={1040 + i * 20} y1="83" x2={1040 + i * 20} y2="97" stroke="#00E5FF" strokeWidth="1.8" />
                </React.Fragment>
              ))}
            </g>

            {/* Center Target Crosshair Dial Node */}
            <g transform="translate(600, 90)" opacity={lineDrawProgress} filter="url(#hud-glow)">
              <circle cx="0" cy="0" r="9" fill="none" stroke="#00E5FF" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
              <line x1="-14" y1="0" x2="-9" y2="0" stroke="#00E5FF" strokeWidth="1.5" />
              <line x1="9" y1="0" x2="14" y2="0" stroke="#00E5FF" strokeWidth="1.5" />
              <line x1="0" y1="-14" x2="0" y2="-9" stroke="#00E5FF" strokeWidth="1.5" />
              <line x1="0" y1="9" x2="0" y2="14" stroke="#00E5FF" strokeWidth="1.5" />
            </g>

            {/* Continuous Looping Particle Dots along Baseline during Hold */}
            {frame >= 30 && frame < 180 && (
              <g opacity={lineDrawProgress}>
                {[0, 1, 2].map((pIdx) => {
                  const pOffset = ((idleTime * 200 + pIdx * 360) % 1100);
                  return (
                    <circle
                      key={pIdx}
                      cx={50 + pOffset}
                      cy="90"
                      r="3.5"
                      fill="#FFFFFF"
                      filter="url(#hud-glow)"
                    />
                  );
                })}
              </g>
            )}
          </g>

          {/* 6. EXIT SHATTER PARTICLES WITH GRAVITY DROP (Frame 185 - 210) */}
          {shatterProgress > 0 && (
            <g opacity={shatterOpacity}>
              {shatterParticles.map((pt) => {
                const t = shatterProgress * 0.8; // seconds
                const gravity = 400; // px/s^2
                const pX = pt.baseX + pt.vx * t;
                const pY = pt.baseY + pt.vy * t + 0.5 * gravity * t * t;
                return (
                  <circle
                    key={pt.id}
                    cx={pX}
                    cy={pY}
                    r={pt.radius * (1 - shatterProgress * 0.5)}
                    fill="#00E5FF"
                    filter="url(#hud-glow)"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* OPTIONAL IN-REMOTION TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '60px',
              opacity: titleTextOpacity,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '44px',
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
              top: '106px',
              left: '60px',
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
