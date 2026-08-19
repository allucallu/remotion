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
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerSwissEditorialProps {
  accentColor?: string; // Emerald Forest Green #0F382C
  accentGradientEnd?: string; // Warm Coral Ochre #E05A47
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_SwissEditorial (Enhanced Visuals & Pure Blank Grid - No Corner Text)
 * Niche: Documentary, Swiss Graphic Design, Modernist Architecture, Editorial Launch, Cultural Exhibition.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Architectural Grid Shutter Collapse & Blackout (150 - 165f)
 * - Deep Swiss Slate (#161B18) with Emerald Forest Green (#0F382C) & Coral Ochre (#E05A47) accents.
 * - PURGED all corner text lines for a 100% clean graphic canvas.
 * - Added 360° Hairline Clock Arc Sweep & Cardinal Diamond Accent Nodes.
 * - Left Coral Anchor Pillar, Swiss Grid Axis lines, & Offset Circle Target (1050px, 4K).
 * - 3D Mechanical Tile Snap (rotateX: 90° -> 0°) & Swiss Grid Line Wipe on cut frames.
 * - Architectural Shutter Collapse exit to solid black.
 */
export const CountdownTimer_SwissEditorial: React.FC<CountdownTimerSwissEditorialProps> = ({
  accentColor = '#0F382C', // Emerald Forest Green
  accentGradientEnd = '#E05A47', // Warm Coral Ochre
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Background Resolver
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#161B18';
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

  // --- SWISS MECHANICAL SPRING ANIMATIONS ---
  // 3D Tile Snap Rotation (90° -> 0° for each number step)
  const tileSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 150 },
  });

  const tileRotateX = interpolate(tileSpring, [0, 1], [90, 0]);
  const tileOpacity = interpolate(tileSpring, [0, 1], [0, 1]);

  // Left Pillar Coral Accent Extension Spring
  const pillarSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.4, stiffness: 180 },
  });

  const pillarScaleY = interpolate(pillarSpring, [0, 1], [1.18, 1]);

  // Swiss Grid Line Wipe Progress on Cut Frame (3 frames duration)
  const gridWipeProgress = isCutFrame
    ? 1
    : (localFrame <= 3 ? interpolate(localFrame, [0, 3], [1, 0]) : 0);

  // Smooth Clock Progress Arc (360° sweep over 30 frames per number step)
  const clockArcProgress = (localFrame / framesPerNumber) * 360;

  // --- EXIT ARCHITECTURAL SHUTTER COLLAPSE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const shutterProgress = isEndPhase
    ? interpolate(frame, [150, 160], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.7, 0, 0.84, 0),
      })
    : 0;

  const shutterClipH = isEndPhase ? interpolate(shutterProgress, [0, 1], [height / 2, 0]) : height / 2;
  const exitOpacity = isEndPhase ? interpolate(shutterProgress, [0.8, 1], [1, 0]) : 1;
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
      {/* ARCHITECTURAL SHUTTER COLLAPSE CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          clipPath: isEndPhase
            ? `polygon(0 ${height / 2 - shutterClipH}px, ${width}px ${height / 2 - shutterClipH}px, ${width}px ${height / 2 + shutterClipH}px, 0 ${height / 2 + shutterClipH}px)`
            : 'none',
        }}
      >
        {/* 1. EMERALD FOREST GREEN SOFT BACK GLOW */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '1350px',
            height: '1350px',
            background: `radial-gradient(circle at center, ${accentColor}50 0%, ${accentGradientEnd}15 45%, transparent 70%)`,
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Emerald Forest Green to Slate Gradient */}
            <linearGradient id="emerald-swiss-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#185241" />
              <stop offset="50%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#08211A" />
            </linearGradient>

            <filter id="swiss-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000000" floodOpacity="0.85" />
            </filter>

            <filter id="coral-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={accentGradientEnd} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* LAYER A: SWISS GRID AXIS & MARGIN LINES */}
          <g filter="url(#swiss-shadow)" opacity="0.45">
            {/* Top & Bottom Horizontal Swiss Grid Rules */}
            <line x1="160" y1="160" x2="3680" y2="160" stroke="#F4F1EA" strokeWidth="2.5" />
            <line x1="160" y1="2000" x2="3680" y2="2000" stroke="#F4F1EA" strokeWidth="2.5" />

            {/* Left & Right Vertical Grid Axis */}
            <line x1="160" y1="160" x2="160" y2="2000" stroke="#F4F1EA" strokeWidth="2.5" />
            <line x1="3680" y1="160" x2="3680" y2="2000" stroke="#F4F1EA" strokeWidth="2.5" />

            {/* Grid Crosshair Intersections */}
            <circle cx="160" cy="160" r="7" fill="#E05A47" filter="url(#coral-glow)" />
            <circle cx="3680" cy="160" r="7" fill="#E05A47" filter="url(#coral-glow)" />
            <circle cx="160" cy="2000" r="7" fill="#E05A47" filter="url(#coral-glow)" />
            <circle cx="3680" cy="2000" r="7" fill="#E05A47" filter="url(#coral-glow)" />
          </g>

          {/* LAYER B: LEFT VERTICAL CORAL ANCHOR PILLAR */}
          <rect
            x="160"
            y="260"
            width="22"
            height="1640"
            rx="4"
            ry="4"
            fill={accentGradientEnd}
            transform={`scale(1, ${pillarScaleY})`}
            style={{ transformOrigin: '171px 1080px' }}
            filter="url(#coral-glow)"
          />

          {/* LAYER C: OFFSET SWISS CIRCLE TARGET (Center 1920, 1080, Radius = 525px) */}
          <g
            transform={`translate(${width / 2}, ${height / 2})`}
            filter="url(#swiss-shadow)"
          >
            {/* Outer Dark Emerald Solid Circle Plate */}
            <circle cx="0" cy="0" r="525" fill="url(#emerald-swiss-grad)" stroke="#F4F1EA" strokeWidth="4.5" />

            {/* Inner Precision Hairline Circle (Radius = 450px) */}
            <circle cx="0" cy="0" r="450" fill="none" stroke="#F4F1EA" strokeWidth="1.8" strokeDasharray="12 10" opacity="0.65" />

            {/* 360° SMOOTH CLOCK PROGRESS ARC SWEEP */}
            <path
              d={`M 0 -525 A 525 525 0 ${clockArcProgress > 180 ? 1 : 0} 1 ${Math.sin((clockArcProgress * Math.PI) / 180) * 525} ${-Math.cos((clockArcProgress * Math.PI) / 180) * 525}`}
              fill="none"
              stroke="#E05A47"
              strokeWidth="6"
              strokeLinecap="round"
              filter="url(#coral-glow)"
            />

            {/* Clock Arc Leading Coral Node */}
            <circle
              cx={Math.sin((clockArcProgress * Math.PI) / 180) * 525}
              cy={-Math.cos((clockArcProgress * Math.PI) / 180) * 525}
              r="7"
              fill="#FFFFFF"
              filter="url(#coral-glow)"
            />

            {/* 4 CARDINAL CORAL DIAMOND NOTCHES */}
            {[
              { x: 0, y: -525 },
              { x: 525, y: 0 },
              { x: 0, y: 525 },
              { x: -525, y: 0 },
            ].map((pt, idx) => (
              <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                <polygon points="0,-12 12,0 0,12 -12,0" fill="#E05A47" filter="url(#coral-glow)" />
                <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
              </g>
            ))}

            {/* Corner Alignment Ticks at 45°, 135°, 225°, 315° */}
            {[45, 135, 225, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <circle
                  key={deg}
                  cx={Math.sin(rad) * 450}
                  cy={-Math.cos(rad) * 450}
                  r="6"
                  fill="#F4F1EA"
                />
              );
            })}
          </g>

          {/* LAYER D: SWISS GRID LINE WIPE ON CUT FRAME */}
          {gridWipeProgress > 0 && (
            <g opacity={gridWipeProgress} filter="url(#coral-glow)">
              <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#E05A47" strokeWidth="7" />
              <line x1={width / 2} y1="0" x2={width / 2} y2={height} stroke="#E05A47" strokeWidth="7" />
            </g>
          )}
        </svg>

        {/* LAYER E: BIG BOLD SWISS 3D TILE SNAP NUMBER DISPLAY */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotateX(${tileRotateX}deg)`,
              transformOrigin: 'center center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '600px',
              height: '600px',
              opacity: tileOpacity,
              pointerEvents: 'none',
              perspective: '1000px',
            }}
          >
            <span
              style={{
                fontSize: '380px',
                fontWeight: 900,
                color: '#F4F1EA',
                letterSpacing: '-8px',
                lineHeight: 1,
                textShadow: '0 12px 32px rgba(0, 0, 0, 0.95), 0 0 20px rgba(224, 90, 71, 0.4)',
              }}
            >
              {currentDisplayNumber}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
