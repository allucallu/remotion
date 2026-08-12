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

const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type StatusCategory = 'success' | 'error' | 'warning' | 'neutral';

export interface StatusBadgeItem {
  id?: string;
  label: string;
  statusText: string;
  statusType: StatusCategory;
  latencyText?: string;
}

export interface StatusCategoryColors {
  success: string;
  error: string;
  warning: string;
  neutral: string;
  textColor: string;
  badgeBorderBase: string;
  badgeBgBase: string;
}

export interface StatusIndicatorBadgeCycleProps extends Record<string, unknown> {
  useGreenScreen?: boolean;
  framesPerCycle?: number;
  badgeWidth?: number;
  badgeHeight?: number;
  fontSize?: number;
  categoryColors?: Partial<StatusCategoryColors>;
  items?: StatusBadgeItem[];
}

const DEFAULT_CATEGORY_COLORS: StatusCategoryColors = {
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
  neutral: '#71717A',
  textColor: '#E4E4E7',
  badgeBorderBase: 'rgba(255, 255, 255, 0.08)',
  badgeBgBase: 'rgba(18, 18, 21, 0.85)',
};

const DEFAULT_ITEMS: StatusBadgeItem[] = [
  {
    label: 'SYSTEM INTEGRITY CHECK',
    statusText: 'PASSED',
    statusType: 'success',
    latencyText: '12 ms',
  },
  {
    label: 'DATA ENCRYPTION TUNNEL',
    statusText: 'ESTABLISHED',
    statusType: 'success',
    latencyText: '18 ms',
  },
  {
    label: 'STORAGE QUOTA WARNING',
    statusText: '85% CAPACITY',
    statusType: 'warning',
    latencyText: '42 ms',
  },
  {
    label: 'UNAUTHORIZED AUTH ATTEMPT',
    statusText: 'BLOCKED',
    statusType: 'error',
    latencyText: '0 ms',
  },
  {
    label: 'BACKGROUND SYNC TASK',
    statusText: 'STANDBY',
    statusType: 'neutral',
    latencyText: '120 ms',
  },
];

export const StatusIndicatorBadgeCycle: React.FC<StatusIndicatorBadgeCycleProps> = ({
  useGreenScreen = false,
  framesPerCycle = 180,
  badgeWidth = 1180,
  badgeHeight = 110,
  fontSize = 30,
  categoryColors = {},
  items = DEFAULT_ITEMS,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colors: StatusCategoryColors = {
    ...DEFAULT_CATEGORY_COLORS,
    ...categoryColors,
  };

  const currentItemIndex = Math.min(
    items.length - 1,
    Math.floor(frame / framesPerCycle)
  );

  const activeItem = items[currentItemIndex] || DEFAULT_ITEMS[0];
  const cycleFrame = frame % framesPerCycle;

  const getStatusColor = (type: StatusCategory): string => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'neutral':
      default:
        return colors.neutral;
    }
  };

  const finalStatusColor = getStatusColor(activeItem.statusType);

  // FASE 1: Progress Bar Fill
  const fillDurationFrames = Math.round(0.8 * fps);
  const progressPercent = interpolate(
    cycleFrame,
    [0, fillDurationFrames],
    [0, 100],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // FASE 2: Resolve & Spring Pop
  const resolveStartFrame = fillDurationFrames;
  const resolveDurationFrames = Math.round(0.2 * fps);

  const resolveProgress = interpolate(
    cycleFrame,
    [resolveStartFrame, resolveStartFrame + resolveDurationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.42, 0, 0.58, 1),
    }
  );

  const currentBadgeColor = interpolateColors(
    resolveProgress,
    [0, 1],
    [colors.neutral, finalStatusColor]
  );

  const springProgress = spring({
    frame: Math.max(0, cycleFrame - resolveStartFrame),
    fps,
    config: {
      damping: 20,
      stiffness: 180,
      mass: 1,
    },
  });

  const badgeEntryScale =
    cycleFrame < resolveStartFrame
      ? 0.98
      : interpolate(springProgress, [0, 1], [0.98, 1.0]);

  const badgeEntryOpacity = interpolate(cycleFrame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const pulseRingScale = interpolate(
    cycleFrame,
    [resolveStartFrame, resolveStartFrame + 30],
    [1, 2.4],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const pulseRingOpacity = interpolate(
    cycleFrame,
    [resolveStartFrame, resolveStartFrame + 30],
    [0.6, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // FASE 4: Exit
  const exitStartFrame = Math.round(2.2 * fps);
  const exitDurationFrames = Math.round(0.3 * fps);

  const exitProgress = interpolate(
    cycleFrame,
    [exitStartFrame, exitStartFrame + exitDurationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.6, 0, 0.9, 0.2),
    }
  );

  const exitTranslateY = interpolate(exitProgress, [0, 1], [0, -12]);
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);

  const totalScale = badgeEntryScale;
  const totalOpacity = badgeEntryOpacity * exitOpacity;

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
      {/* Ambient Backdrop Glow & Grid */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2000px',
              height: '1200px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse at center, ${currentBadgeColor}15 0%, transparent 65%)`,
              filter: 'blur(90px)',
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
            SYSTEM // TELEMETRY BADGE
          </div>
        </>
      )}

      {/* Badge / Pill Container */}
      <div
        style={{
          width: `${badgeWidth}px`,
          height: `${badgeHeight}px`,
          borderRadius: '9999px',
          backgroundColor: colors.badgeBgBase,
          border: `2px solid ${currentBadgeColor}`,
          boxShadow: `0 30px 80px rgba(0, 0, 0, 0.7), 0 0 35px ${currentBadgeColor}25`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '36px',
          paddingRight: '36px',
          opacity: totalOpacity,
          transform: `scale(${totalScale}) translateY(${exitTranslateY}px)`,
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Left Section: Dot & Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {cycleFrame >= resolveStartFrame && (
              <div
                style={{
                  position: 'absolute',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: currentBadgeColor,
                  transform: `scale(${pulseRingScale})`,
                  opacity: pulseRingOpacity,
                }}
              />
            )}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: currentBadgeColor,
                boxShadow: `0 0 16px ${currentBadgeColor}`,
              }}
            />
          </div>

          <div
            style={{
              color: colors.textColor,
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            {activeItem.label}
          </div>
        </div>

        {/* Right Section: Status Text & Supporting Latency Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {activeItem.latencyText && (
            <div style={{ fontSize: '15px', color: '#71717A', backgroundColor: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              PING: <span style={{ color: '#A1A1AA', fontWeight: 600 }}>{activeItem.latencyText}</span>
            </div>
          )}

          <div
            style={{
              color: currentBadgeColor,
              fontSize: `${fontSize}px`,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textShadow: `0 0 14px ${currentBadgeColor}40`,
            }}
          >
            {cycleFrame < resolveStartFrame
              ? 'PROCESSING...'
              : activeItem.statusText}
          </div>
        </div>

        {/* Progress Bar Track & Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: currentBadgeColor,
              borderRadius: '2px',
              boxShadow: `0 0 8px ${currentBadgeColor}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
