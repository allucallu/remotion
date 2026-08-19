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
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerTitaniumCoreProps {
  accentColor?: string; // Sapphire Blue #3B82F6
  accentPlatinum?: string; // Platinum White #F8FAFC
  titaniumColor?: string; // Titanium Graphite #2B303A
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_TitaniumCore (Aerospace Titanium Gauge with Rich Kinetic Supporting Elements)
 * Niche: Aerospace Engineering, Automotive Kinetic Gauge, Sci-Fi Power Core, Luxury Tech Launch.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Electromagnetic Core Dissolve Exit & Blackout (150 - 165f)
 * - Machined Titanium & Sapphire Blue Palette (#2B303A, #3B82F6, #F8FAFC).
 * - SUPPORTING ELEMENTS ADDED:
 *   1. 4 Cardinal Crosshair Target Anchors (12, 3, 6, 9 o'clock) with cardinal diamond notches.
 *   2. Inner Rotating Concentric Micro-Dashed Grid Ring (480px radius, counter-rotating).
 *   3. 4 Titanium Aerospace Mounting Pins with glowing sapphire centers.
 *   4. Radar Scanner Line rotating 360° continuously.
 * - Machined Outer Titanium Ring (680px) with 60 micro ticks & 12 cardinal notches.
 * - Segmented 30-LED Progress Arc (580px) lighting up sequentially in clockwise order (0% to 100%).
 * - Kinetic 3D Tile Flip Snap & High-Speed Pulse Ring on number transitions.
 * - Electromagnetic Core Dissolve exit to solid blackout.
 */
export const CountdownTimer_TitaniumCore: React.FC<CountdownTimerTitaniumCoreProps> = ({
  accentColor = '#3B82F6', // Sapphire Blue
  accentPlatinum = '#F8FAFC', // Platinum White
  titaniumColor = '#2B303A', // Titanium Graphite
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

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
  // Charging Phase: 0 -> 26f (~0.87s) | Pulse Snap: 26f -> 30f (~0.13s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const chargeDuration = 26; // 0 to 26 frames

  // Radial Segment Progress (0 to 1)
  const chargeProgress = interpolate(
    localFrame,
    [0, chargeDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  // Electromagnetic Pulse & 3D Tile Flip Trigger (localFrame 26 to 29)
  const isPulsing = localFrame >= 25 && frame < 150;
  const pulseProgress = isPulsing
    ? interpolate(localFrame, [25, 29], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // 3D Tile Snap Rotation for Number Transition
  const tileSnapSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 10, mass: 0.35, stiffness: 200 },
  });
  const tileRotateY = currentStepIndex > 0 && localFrame < 10
    ? interpolate(tileSnapSpring, [0, 1], [-90, 0])
    : 0;

  const pulseRingScale = isPulsing ? 1 + pulseProgress * 0.75 : 1;
  const pulseRingOpacity = isPulsing ? 1 - pulseProgress : 0;
  const pulseFlash = isPulsing ? Math.sin(pulseProgress * Math.PI) * 0.7 : 0;

  // --- GAUGE & SEGMENT MATH (Center 1920, 1080) ---
  const cx = 1920;
  const cy = 1080;

  // Outer Titanium Ring (680px radius)
  const outerRadius = 680;
  const microTicksCount = 60;
  const microTicks = Array.from({ length: microTicksCount }).map((_, i) => {
    const angleRad = ((i * 6 - 90) * Math.PI) / 180;
    const isCardinal = i % 5 === 0;
    const rStart = outerRadius - (isCardinal ? 24 : 12);
    const rEnd = outerRadius;

    const x1 = cx + rStart * Math.cos(angleRad);
    const y1 = cy + rStart * Math.sin(angleRad);
    const x2 = cx + rEnd * Math.cos(angleRad);
    const y2 = cy + rEnd * Math.sin(angleRad);

    return { x1, y1, x2, y2, isCardinal, key: i };
  });

  // Segmented Radial Arc (580px radius, 30 LED Segments)
  const arcRadius = 580;
  const arcCircumference = 2 * Math.PI * arcRadius;
  const activeSegmentsCount = Math.floor(chargeProgress * 30);

  // SUPPORTING ELEMENT: Inner Micro-Dashed Grid Ring (480px radius, counter-rotating)
  const innerGridRadius = 480;
  const innerGridRotation = -frame * 0.8;

  // SUPPORTING ELEMENT: Radar Scanner Radial Sweep Angle
  const scannerAngleRad = ((frame * 2.5 - 90) * Math.PI) / 180;
  const scannerX = cx + (outerRadius + 40) * Math.cos(scannerAngleRad);
  const scannerY = cy + (outerRadius + 40) * Math.sin(scannerAngleRad);

  // SUPPORTING ELEMENT: 4 Diagonal Titanium Mounting Pins (45°, 135°, 225°, 315°)
  const mountingPins = [45, 135, 225, 315].map((deg, i) => {
    const rad = (deg * Math.PI) / 180;
    const pinR = outerRadius + 45;
    return {
      px: cx + pinR * Math.cos(rad),
      py: cy + pinR * Math.sin(rad),
      key: i,
    };
  });

  // --- EXIT PHASE: ELECTROMAGNETIC CORE DISSOLVE (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const dissolveProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.2, 0.8, 0.2, 1),
      })
    : 0;

  const dissolveScale = isEndPhase ? 1 + dissolveProgress * 1.8 : 1;
  const dissolveOpacity = isEndPhase ? interpolate(dissolveProgress, [0.6, 1], [1, 0]) : 1;
  const dissolveFlash = isEndPhase ? interpolate(dissolveProgress, [0, 0.4, 1], [0, 0.9, 0]) : 0;
  const isTotalBlackout = frame >= 162;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : dissolveOpacity,
      }}
    >
      {/* 1. SAPPHIRE TITANIUM AMBIENT BACK GLOW */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1700px',
          height: '1700px',
          background: `radial-gradient(circle at center, ${accentColor}30 0%, ${titaniumColor}25 50%, transparent 70%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. ELECTROMAGNETIC PULSE FLASH OVERLAY */}
      {(pulseFlash > 0 || dissolveFlash > 0) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF',
            opacity: Math.max(pulseFlash, dissolveFlash),
            mixBlendMode: 'screen',
            pointerEvents: 'none',
            zIndex: 40,
          }}
        />
      )}

      {/* 3. MAIN SVG TITANIUM GAUGE & SUPPORTING ELEMENTS CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `scale(${dissolveScale})`,
          transformOrigin: 'center center',
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
        >
          <defs>
            {/* Sapphire Blue Gradient */}
            <linearGradient id="sapphire-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="60%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            {/* Sapphire Core Bloom Glow Filter */}
            <filter id="sapphire-bloom" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="16" floodColor={accentColor} floodOpacity="0.85" />
              <feDropShadow dx="0" dy="0" stdDeviation="30" floodColor="#1D4ED8" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* SUPPORTING ELEMENT A: 4 CARDINAL CROSSHAIR TARGET ANCHORS (12, 3, 6, 9 o'clock) */}
          <line x1={cx} y1={cy - outerRadius - 100} x2={cx} y2={cy - outerRadius - 20} stroke={accentColor} strokeWidth="2.5" opacity="0.6" />
          <line x1={cx} y1={cy + outerRadius + 20} x2={cx} y2={cy + outerRadius + 100} stroke={accentColor} strokeWidth="2.5" opacity="0.6" />
          <line x1={cx - outerRadius - 100} y1={cy} x2={cx - outerRadius - 20} y2={cy} stroke={accentColor} strokeWidth="2.5" opacity="0.6" />
          <line x1={cx + outerRadius + 20} y1={cy} x2={cx + outerRadius + 100} y2={cy} stroke={accentColor} strokeWidth="2.5" opacity="0.6" />

          {/* Cardinal Diamond Target Notches */}
          <polygon points={`${cx},${cy - outerRadius - 110} ${cx - 8},${cy - outerRadius - 120} ${cx},${cy - outerRadius - 130} ${cx + 8},${cy - outerRadius - 120}`} fill={accentColor} opacity="0.8" />
          <polygon points={`${cx},${cy + outerRadius + 110} ${cx - 8},${cy + outerRadius + 120} ${cx},${cy + outerRadius + 130} ${cx + 8},${cy + outerRadius + 120}`} fill={accentColor} opacity="0.8" />
          <polygon points={`${cx - outerRadius - 110},${cy} ${cx - outerRadius - 120},${cy - 8} ${cx - outerRadius - 130},${cy} ${cx - outerRadius - 120},${cy + 8}`} fill={accentColor} opacity="0.8" />
          <polygon points={`${cx + outerRadius + 110},${cy} ${cx + outerRadius + 120},${cy - 8} ${cx + outerRadius + 130},${cy} ${cx + outerRadius + 120},${cy + 8}`} fill={accentColor} opacity="0.8" />

          {/* SUPPORTING ELEMENT B: RADAR SCANNER SWEEP LINE */}
          <line
            x1={cx}
            y1={cy}
            x2={scannerX}
            y2={scannerY}
            stroke={accentColor}
            strokeWidth="2"
            opacity="0.45"
            filter="url(#sapphire-bloom)"
          />

          {/* MACHINED TITANIUM BASE RING */}
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            fill="none"
            stroke={titaniumColor}
            strokeWidth="12"
            opacity="0.9"
          />

          {/* 60 TITANIUM MICRO TICKS & CARDINAL NOTCHES */}
          {microTicks.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isCardinal ? accentPlatinum : titaniumColor}
              strokeWidth={tick.isCardinal ? 3.5 : 2}
              opacity={tick.isCardinal ? 0.9 : 0.45}
            />
          ))}

          {/* SUPPORTING ELEMENT C: INNER COUNTER-ROTATING MICRO-DASHED GRID RING (480px radius) */}
          <circle
            cx={cx}
            cy={cy}
            r={innerGridRadius}
            fill="none"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeDasharray="6 14"
            transform={`rotate(${innerGridRotation} ${cx} ${cy})`}
            opacity="0.35"
          />

          {/* BACKGROUND INACTIVE SEGMENTED ARC (30 LED Blocks) */}
          <circle
            cx={cx}
            cy={cy}
            r={arcRadius}
            fill="none"
            stroke="#1E232A"
            strokeWidth="20"
            strokeDasharray="28 12"
            transform={`rotate(-90 ${cx} ${cy})`}
          />

          {/* ACTIVE CHARGING SEGMENTED ARC (0% to 100%) */}
          <circle
            cx={cx}
            cy={cy}
            r={arcRadius}
            fill="none"
            stroke="url(#sapphire-grad)"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray="28 12"
            strokeDashoffset={arcCircumference * (1 - (activeSegmentsCount / 30))}
            transform={`rotate(-90 ${cx} ${cy})`}
            filter="url(#sapphire-bloom)"
          />

          {/* SUPPORTING ELEMENT D: 4 DIAGONAL TITANIUM MOUNTING PINS */}
          {mountingPins.map((pin) => (
            <g key={pin.key}>
              <circle cx={pin.px} cy={pin.py} r="14" fill={titaniumColor} stroke="#4A5260" strokeWidth="2" />
              <circle cx={pin.px} cy={pin.py} r="6" fill={accentColor} filter="url(#sapphire-bloom)" />
            </g>
          ))}

          {/* ELECTROMAGNETIC PULSE RING (On 100% Charge) */}
          {isPulsing && (
            <circle
              cx={cx}
              cy={cy}
              r={arcRadius * pulseRingScale}
              fill="none"
              stroke={accentPlatinum}
              strokeWidth={interpolate(pulseProgress, [0, 1], [24, 2])}
              opacity={pulseRingOpacity}
              filter="url(#sapphire-bloom)"
            />
          )}
        </svg>

        {/* 4. CENTER HERO NUMBER WITH KINETIC 3D TILE FLIP SNAP */}
        {!isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotateY(${tileRotateY}deg)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: accentPlatinum,
              fontFamily: interFont,
              fontSize: '750px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-12px',
              textShadow: `0 10px 30px rgba(0,0,0,0.9), 0 0 40px ${accentColor}`,
              perspective: '1200px',
            }}
          >
            {currentNumber}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
