import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  Easing,
  spring,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

// Load JetBrains Mono Google Font
const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type ResultType = 'success' | 'error';

export interface LoadingResultThemeColors {
  loadingAccentColor: string;
  successColor: string;
  errorColor: string;
  trackColor: string;
  textColor: string;
  ambientGlowColor: string;
}

export interface LoadingResultTransitionProps {
  useGreenScreen?: boolean;
  resultType?: ResultType;
  label?: string;
  processId?: string;
  latencyText?: string;
  bytesText?: string;
  circleSize?: number;
  themeColors?: Partial<LoadingResultThemeColors>;
}

const DEFAULT_THEME: LoadingResultThemeColors = {
  loadingAccentColor: '#60A5FA', // Soft Blue
  successColor: '#4ADE80', // Soft Green
  errorColor: '#F87171', // Soft Red / Coral
  trackColor: '#27272A', // Dark Neutral Track
  textColor: '#E4E4E7', // Soft Off-White
  ambientGlowColor: '#3B82F6', // Ambient Glow
};

/**
 * LoadingResultTransition Composition
 * Upgraded duration to 360 frames (6.0 seconds @ 60fps) with percentage counter,
 * expanding shockwave aura, telemetry badges, and corner HUD markings.
 */
export const LoadingResultTransition: React.FC<LoadingResultTransitionProps> = ({
  useGreenScreen = false,
  resultType = 'success',
  label = resultType === 'success' ? 'Request Succeeded' : 'Request Failed',
  processId = 'JOB_89F021BC',
  latencyText = '18.4 ms',
  bytesText = '2.4 KB',
  circleSize = 240, // 4K Scale
  themeColors = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const theme: LoadingResultThemeColors = { ...DEFAULT_THEME, ...themeColors };
  const isSuccess = resultType === 'success';
  const targetStatusColor = isSuccess ? theme.successColor : theme.errorColor;

  // ==========================================
  // LINIMASA DURASI (TOTAL 360 FRAME / 6.0 DETIK @60FPS):
  // 0 - 150f (2.5s): Loading phase + Numerical percentage (0% -> 100%)
  // 150 - 180f (0.5s): Shape morph + Shockwave aura pulse
  // 180 - 210f (0.5s): Progressive SVG checkmark/cross path draw
  // 210 - 240f (0.5s): Impact spring bounce + label fade-in
  // 240 - 360f (2.0s): Hold phase (fully readable)
  // ==========================================

  // FASE 1: Loading Phase (Frame 0 - 150)
  const spinnerRotation = (frame / 48) * 360;

  const progressPercent = Math.round(
    interpolate(frame, [0, 150], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    })
  );

  const progressBarColor = interpolateColors(
    interpolate(frame, [140, 160], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
    [0, 1],
    ['#71717A', targetStatusColor]
  );

  // FASE 2: Shape Morph & Shockwave Aura (Frame 150 - 180)
  const heavyEaseOut = Easing.bezier(0.16, 1, 0.3, 1);

  const morphProgress = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: heavyEaseOut,
  });

  const spinnerOpacity = interpolate(morphProgress, [0, 0.5], [1, 0]);
  const circleOpacity = interpolate(morphProgress, [0.3, 1], [0, 1]);
  const circleScale = interpolate(morphProgress, [0, 1], [0.85, 1.0]);

  // Shockwave aura pulse expansion (Frame 150 - 190)
  const shockwaveScale = interpolate(frame, [150, 190], [1, 2.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const shockwaveOpacity = interpolate(frame, [150, 190], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // FASE 3: Progressive SVG Vector Path Drawing (Frame 180 - 210)
  const drawStartFrame = 180;
  const drawEndFrame = 210;

  const checkmarkLength = 140;
  const crossLineLength = 110;

  const checkmarkOffset = interpolate(
    frame,
    [drawStartFrame, drawEndFrame],
    [checkmarkLength, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    }
  );

  const crossOffset = interpolate(
    frame,
    [drawStartFrame, drawEndFrame],
    [crossLineLength, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    }
  );

  // FASE 4: Impact Spring Bounce (Frame 210 - 240)
  const bounceSpring = spring({
    frame: Math.max(0, frame - 210),
    fps,
    config: {
      stiffness: 250,
      damping: 12,
      mass: 1,
    },
  });

  const iconBounceScale =
    frame < 210 ? 1.0 : interpolate(bounceSpring, [0, 1], [1.0, 1.08]);

  // FASE 5: Label & Telemetry Entrance (Frame 220 - 240)
  const textOpacity = interpolate(frame, [220, 240], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: heavyEaseOut,
  });

  const textTranslateY = interpolate(frame, [220, 240], [6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: heavyEaseOut,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LAYER 1: Ambient Background Glow & Grid Overlay */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2600px',
              height: '1400px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse at center, ${
                frame >= 150 ? targetStatusColor : theme.loadingAccentColor
              }15 0%, transparent 65%)`,
              filter: 'blur(100px)',
              pointerEvents: 'none',
              transition: 'background 0.3s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Tech Marks */}
          <div style={{ position: 'absolute', top: '48px', left: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            + 00:38:40 / 4K UHD
          </div>
          <div style={{ position: 'absolute', top: '48px', right: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            EXECUTION // TRANSITION RESULT (6.0s)
          </div>
        </>
      )}

      {/* LAYER 2: Main Motion Element Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '40px',
          position: 'relative',
        }}
      >
        {/* Supporting Header Process Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '15px', color: '#71717A', backgroundColor: 'rgba(255,255,255,0.04)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            PROCESS: <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{processId}</span>
          </div>
          <div style={{ fontSize: '15px', color: '#71717A', backgroundColor: 'rgba(255,255,255,0.04)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            LATENCY: <span style={{ color: '#FBBF24', fontWeight: 600 }}>{latencyText}</span>
          </div>
          <div style={{ fontSize: '15px', color: '#71717A', backgroundColor: 'rgba(255,255,255,0.04)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            PAYLOAD: <span style={{ color: '#60A5FA', fontWeight: 600 }}>{bytesText}</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div
          style={{
            width: '900px',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: theme.trackColor,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: progressBarColor,
              borderRadius: '4px',
              boxShadow: `0 0 16px ${progressBarColor}`,
            }}
          />
        </div>

        {/* Center Spinner & Morph Circle Area */}
        <div
          style={{
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* FASE 1: Linear Rotating SVG Spinner Arc & Percentage Counter */}
          {frame < 160 && (
            <>
              <svg
                width={circleSize}
                height={circleSize}
                viewBox="0 0 240 240"
                style={{
                  position: 'absolute',
                  opacity: spinnerOpacity,
                  transform: `rotate(${spinnerRotation}deg)`,
                  transformOrigin: 'center',
                }}
              >
                <circle
                  cx="120"
                  cy="120"
                  r="104"
                  fill="none"
                  stroke={theme.trackColor}
                  strokeWidth="10"
                />
                <circle
                  cx="120"
                  cy="120"
                  r="104"
                  fill="none"
                  stroke={theme.loadingAccentColor}
                  strokeWidth="10"
                  strokeDasharray="160 490"
                  strokeLinecap="round"
                />
              </svg>

              {/* Center Percentage Counter during Loading */}
              <div
                style={{
                  position: 'absolute',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: theme.textColor,
                  opacity: spinnerOpacity,
                  letterSpacing: '1px',
                }}
              >
                {progressPercent}%
              </div>
            </>
          )}

          {/* FASE 2: Expanding Shockwave Aura Pulse */}
          {frame >= 150 && (
            <div
              style={{
                position: 'absolute',
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: '50%',
                border: `3px solid ${targetStatusColor}`,
                transform: `scale(${shockwaveScale})`,
                opacity: shockwaveOpacity,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* FASE 2: Solid Filled Status Circle */}
          {frame >= 150 && (
            <div
              style={{
                position: 'absolute',
                width: `${circleSize}px`,
                height: `${circleSize}px`,
                borderRadius: '50%',
                backgroundColor: `${targetStatusColor}18`,
                border: `3px solid ${targetStatusColor}`,
                boxShadow: `0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px ${targetStatusColor}30`,
                opacity: circleOpacity,
                transform: `scale(${circleScale * iconBounceScale})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* FASE 3: Progressive SVG Vector Icon (Checkmark / Cross) */}
              <svg
                width="150"
                height="150"
                viewBox="0 0 220 220"
                fill="none"
                style={{
                  transform: `scale(${iconBounceScale})`,
                }}
              >
                {isSuccess ? (
                  <path
                    d="M 65 115 L 100 150 L 155 90"
                    stroke={theme.textColor}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={checkmarkLength}
                    strokeDashoffset={checkmarkOffset}
                  />
                ) : (
                  <>
                    <path
                      d="M 75 75 L 145 145"
                      stroke={theme.textColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={crossLineLength}
                      strokeDashoffset={crossOffset}
                    />
                    <path
                      d="M 145 75 L 75 145"
                      stroke={theme.textColor}
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={crossLineLength}
                      strokeDashoffset={crossOffset}
                    />
                  </>
                )}
              </svg>
            </div>
          )}
        </div>

        {/* FASE 5: Status Text Label & Bottom Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: targetStatusColor,
              letterSpacing: '1.5px',
              opacity: textOpacity,
              transform: `translateY(${textTranslateY}px)`,
              textShadow: `0 0 20px ${targetStatusColor}40`,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontSize: '16px',
              color: '#71717A',
              letterSpacing: '1px',
              opacity: textOpacity,
            }}
          >
            STATUS: <span style={{ color: targetStatusColor, fontWeight: 600 }}>{isSuccess ? 'HTTP 200 OK' : 'HTTP 500 ERROR'}</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
