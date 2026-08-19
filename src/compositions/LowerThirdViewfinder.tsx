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

export interface LowerThirdViewfinderProps {
  title?: string; // e.g. "ALEXANDRA WIBOWO" (Optional: omit/leave empty for blank stock asset)
  subtitle?: string; // e.g. "Senior Marketing Strategist" (Optional: omit/leave empty for blank stock asset)
  accentColor?: string;
  accentGradientEnd?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * LowerThirdViewfinder Composition (Varian 7: Cinematic Viewfinder & Documentarian HUD Frame)
 * Refined visuals: Removed center plus icon, added audio dB decibel level meter ticks,
 * timecode counter telemetry, and subtle corner focus notch marks.
 */
export const LowerThirdViewfinder: React.FC<LowerThirdViewfinderProps> = ({
  title = '',
  subtitle = '',
  accentColor = '#EF4444', // Crimson Rec Red
  accentGradientEnd = '#F8FAFC', // Pure Platinum Silver
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
  // Frame 0-45: 4-Corner Cardinal Convergence Entrance
  // Frame 45-145: Hold Phase + REC Beacon Pulse & Audio Meter Micro-Motion
  // Frame 145-175: Lens Shutter Snap & Focal Collapse Exit
  // Frame 175-180: Quiet Out-Point Hold
  // ==========================================

  // --- ENTRANCE SPRINGS (4-Corner Cardinal Convergence) ---
  const topLeftSpring = spring({
    frame: Math.max(0, frame - 2),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  const topRightSpring = spring({
    frame: Math.max(0, frame - 6),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  const bottomLeftSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  const bottomRightSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, mass: 0.7, stiffness: 130 },
  });

  const telemetryProgress = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // --- EXIT PHYSICS (Frame 145 - 175, Camera Lens Shutter Snap & Focal Collapse) ---
  const exitProgress = interpolate(frame, [145, 172], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  const shutterSnapScale = interpolate(exitProgress, [0, 0.4, 1], [1, 1.08, 0]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  // --- IDLE MICRO-MOTION (Frame 45 - 145) ---
  const idleTime = Math.max(0, frame - 45) / 30;

  // REC Red Beacon Pulse
  const recPulseOpacity = frame >= 45 && frame < 145 ? 0.4 + Math.sin(idleTime * 4.5) * 0.5 : 0.9;

  // Timecode Frame Calculation
  const tcFrame = Math.floor(frame % 30).toString().padStart(2, '0');
  const tcSec = Math.floor((frame / 30) % 60).toString().padStart(2, '0');

  // --- TRANSFORM CALCULATIONS ---
  const tlX = interpolate(topLeftSpring, [0, 1], [-120, 0]);
  const tlY = interpolate(topLeftSpring, [0, 1], [-120, 0]);

  const trX = interpolate(topRightSpring, [0, 1], [120, 0]);
  const trY = interpolate(topRightSpring, [0, 1], [-120, 0]);

  const blX = interpolate(bottomLeftSpring, [0, 1], [-120, 0]);
  const blY = interpolate(bottomLeftSpring, [0, 1], [120, 0]);

  const brX = interpolate(bottomRightSpring, [0, 1], [120, 0]);
  const brY = interpolate(bottomRightSpring, [0, 1], [120, 0]);

  const titleTextOpacity = interpolate(telemetryProgress, [0, 1], [0, 1]) * exitOpacity;
  const subTextOpacity = interpolate(telemetryProgress, [0, 1], [0, 1]) * exitOpacity;

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
      {/* CINEMATIC VIEWFINDER CONTAINER (Positioned in 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '200px',
          width: '1500px',
          height: '260px',
          transform: `scale(${shutterSnapScale})`,
          transformOrigin: '550px 130px',
          opacity: exitOpacity,
        }}
      >
        {/* AMBIENT REC GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            width: '1100px',
            height: '260px',
            background: `radial-gradient(ellipse at center, ${accentColor}20 0%, transparent 70%)`,
            filter: 'blur(50px)',
            opacity: recPulseOpacity * exitOpacity,
            pointerEvents: 'none',
          }}
        />

        <svg
          width="1500"
          height="260"
          viewBox="0 0 1500 260"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Platinum Rec Gradient */}
            <linearGradient id="viewfinder-rec-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>

            <filter id="rec-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentColor} floodOpacity={recPulseOpacity} />
            </filter>

            <filter id="silver-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F8FAFC" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* 1. TOP-LEFT CORNER L-BRACKET */}
          <g
            transform={`translate(${tlX}, ${tlY})`}
            opacity={topLeftSpring}
            filter="url(#silver-glow)"
          >
            <path
              d="M 0 55 L 0 0 L 65 0"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="4"
              strokeLinecap="square"
            />
            {/* Top Red REC Indicator Dot */}
            <circle cx="18" cy="18" r="6.5" fill="url(#viewfinder-rec-grad)" filter="url(#rec-glow)" />
          </g>

          {/* 2. TOP-RIGHT CORNER L-BRACKET */}
          <g
            transform={`translate(${1100 + trX}, ${trY})`}
            opacity={topRightSpring}
            filter="url(#silver-glow)"
          >
            <path
              d="M -65 0 L 0 0 L 0 55"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="4"
              strokeLinecap="square"
            />
          </g>

          {/* 3. BOTTOM-LEFT CORNER L-BRACKET */}
          <g
            transform={`translate(${blX}, ${180 + blY})`}
            opacity={bottomLeftSpring}
            filter="url(#silver-glow)"
          >
            <path
              d="M 0 -55 L 0 0 L 65 0"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="4"
              strokeLinecap="square"
            />
          </g>

          {/* 4. BOTTOM-RIGHT CORNER L-BRACKET */}
          <g
            transform={`translate(${1100 + brX}, ${180 + brY})`}
            opacity={bottomRightSpring}
            filter="url(#silver-glow)"
          >
            <path
              d="M -65 0 L 0 0 L 0 -55"
              fill="none"
              stroke="#F8FAFC"
              strokeWidth="4"
              strokeLinecap="square"
            />
          </g>

          {/* 5. TELEMETRY SUPPORTING ELEMENTS (No center plus icon!) */}
          <g opacity={telemetryProgress}>
            {/* Vertical Anchor Rec Bar */}
            <line
              x1="0"
              y1="64"
              x2="0"
              y2="116"
              stroke="url(#viewfinder-rec-grad)"
              strokeWidth="4"
              filter="url(#rec-glow)"
            />

            {/* Audio dB Level Ticks along Left Anchor Bar */}
            <g transform="translate(-18, 64)">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const tickY = i * 8.5;
                const isActive = Math.sin(idleTime * 4.0 + i) > -0.2;
                return (
                  <line
                    key={i}
                    x1="0"
                    y1={tickY}
                    x2="8"
                    y2={tickY}
                    stroke={isActive ? '#38BDF8' : 'rgba(248, 250, 252, 0.25)'}
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>

            {/* Top Guideline Hairline */}
            <line
              x1="75"
              y1="0"
              x2="1025"
              y2="0"
              stroke="rgba(248, 250, 252, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Bottom Guideline Hairline */}
            <line
              x1="75"
              y1="180"
              x2="1025"
              y2="180"
              stroke="rgba(248, 250, 252, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Top Telemetry Header Bar (REC ● 4K UHD | RAW 12-BIT | F/2.8 ISO 400) */}
            <g transform="translate(75, -16)">
              <text
                x="0"
                y="0"
                fill="#38BDF8"
                fontSize="18"
                fontWeight="700"
                letterSpacing="2.5"
                opacity="0.9"
              >
                REC ● 4K UHD &nbsp;|&nbsp; RAW 12-BIT &nbsp;|&nbsp; F/2.8 &nbsp;ISO 400
              </text>
            </g>

            {/* Bottom Telemetry Footer Bar (TIMECODE counter: 00:04:12:TC) */}
            <g transform="translate(75, 204)">
              <text
                x="0"
                y="0"
                fill="rgba(248, 250, 252, 0.7)"
                fontSize="16"
                fontWeight="600"
                letterSpacing="2"
              >
                TC 00:04:{tcSec}:{tcFrame} &nbsp;&bull;&nbsp; 30.00 FPS &nbsp;&bull;&nbsp; AUDIO CH1/CH2 OK
              </text>
            </g>
          </g>
        </svg>

        {/* OPTIONAL TEXT OVERLAY MODE */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: '32px',
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
                textShadow: '0 4px 14px rgba(0,0,0,0.9)',
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
              left: '32px',
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
                color: '#F87171',
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
