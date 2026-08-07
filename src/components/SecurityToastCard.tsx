import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { getSecurityIcon, CloseIcon, ShieldWatermark } from './SecurityIcons';

export interface ToastItem {
  icon: 'lock' | 'ip' | 'firewall' | 'ssl';
  title: string;
  subtitle: string;
  badge?: string;
  timestamp?: string;
  accentColor?: string;
}

export interface SecurityToastCardProps {
  toast: ToastItem;
  frame: number;
  startFrame: number;
  position?: 'top-right' | 'bottom-left';
  accentColor?: string;
}

export const SecurityToastCard: React.FC<SecurityToastCardProps> = ({
  toast,
  frame,
  startFrame,
  position = 'top-right',
  accentColor = '#2563EB',
}) => {
  const { fps } = useVideoConfig();
  const activeFrame = frame - startFrame;

  if (activeFrame < 0) return null;

  const cardAccent = toast.accentColor || (toast.icon === 'ssl' ? '#16A34A' : toast.icon === 'firewall' ? '#DC2626' : accentColor);
  const isRight = position === 'top-right';

  // 1. Entrance Spring Animation (15 frames)
  const entranceSpring = spring({
    frame: activeFrame,
    fps,
    config: {
      damping: 180,
      mass: 1,
      stiffness: 280,
    },
  });

  const entranceOpacity = interpolate(activeFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const entranceTranslateX = interpolate(
    entranceSpring,
    [0, 1],
    [isRight ? 120 : -120, 0]
  );

  // 2. Icon Micro-Scale Pop (10 frames)
  const iconScale = interpolate(
    activeFrame,
    [0, 6, 12],
    [1, 1.18, 1],
    { extrapolateRight: 'clamp' }
  );

  // 3. Pulsing Online Status Dot
  const dotPulse = 0.5 + Math.sin(activeFrame * 0.15) * 0.5;

  // 4. Progress Bar Fill (0% to 100% over 45 frames)
  const progressWidth = interpolate(
    activeFrame,
    [0, 45],
    [0, 100],
    { extrapolateRight: 'clamp' }
  );

  // 5. Exit Slide-Out & Fade-Out Animation (after frame 220, duration 14 frames)
  const exitStartFrame = 220;
  const exitProgress = Math.max(0, activeFrame - exitStartFrame);
  const exitOpacity = interpolate(exitProgress, [0, 14], [1, 0], { extrapolateRight: 'clamp' });
  const exitTranslateX = interpolate(exitProgress, [0, 14], [0, isRight ? 120 : -120], { extrapolateRight: 'clamp' });

  const finalOpacity = entranceOpacity * exitOpacity;
  const finalTranslateX = entranceTranslateX + exitTranslateX;

  if (finalOpacity <= 0) return null;

  // Default Badges & Timestamps
  const badgeText = toast.badge || (
    toast.icon === 'ssl' ? 'VERIFIED' : toast.icon === 'firewall' ? 'BLOCKED' : toast.icon === 'ip' ? 'PROTECTED' : 'ACTIVE'
  );
  const badgeBg = toast.icon === 'ssl' ? '#DCFCE7' : toast.icon === 'firewall' ? '#FEE2E2' : '#DBEAFE';
  const badgeColor = toast.icon === 'ssl' ? '#15803D' : toast.icon === 'firewall' ? '#B91C1C' : '#1D4ED8';
  const timeText = toast.timestamp || (activeFrame < 60 ? 'Just now' : `${Math.floor(activeFrame / 60)}s ago`);

  return (
    <div
      style={{
        width: '1380px', // Extra Large Card Width filling prominent corner space
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: '28px',
        border: '2px solid rgba(229, 231, 235, 0.95)',
        boxShadow: '0 16px 44px rgba(0, 0, 0, 0.12), 0 6px 18px rgba(0, 0, 0, 0.06)',
        padding: '40px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        position: 'relative',
        overflow: 'hidden',
        transform: `translateX(${finalTranslateX}px)`,
        opacity: finalOpacity,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background Faint Shield Watermark Accent */}
      <div style={{ position: 'absolute', right: '-10px', bottom: '-50px', pointerEvents: 'none' }}>
        <ShieldWatermark size={280} color={cardAccent} />
      </div>

      {/* Accent Left Vertical Bar */}
      <div
        style={{
          width: '8px',
          height: '76px',
          backgroundColor: cardAccent,
          borderRadius: '6px',
          flexShrink: 0,
        }}
      />

      {/* Icon Container with Micro-Scale Animation & Live Status Dot */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${iconScale})`,
          flexShrink: 0,
        }}
      >
        {getSecurityIcon(toast.icon, 76, cardAccent)}
        
        {/* Pulsing Live Status Indicator Dot */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: cardAccent,
            boxShadow: `0 0 0 ${6 + dotPulse * 6}px ${cardAccent}33`,
          }}
        />
      </div>

      {/* Main Content Info (Title, Badge, Subtitle) */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <span
            style={{
              fontSize: '46px', // Extra Large Title
              fontWeight: 700,
              color: '#111827',
              letterSpacing: '-0.6px',
              lineHeight: 1.2,
            }}
          >
            {toast.title}
          </span>

          {/* Status Pill Badge */}
          <span
            style={{
              fontSize: '20px', // Extra Large Badge
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              backgroundColor: badgeBg,
              color: badgeColor,
              padding: '6px 16px',
              borderRadius: '10px',
            }}
          >
            {badgeText}
          </span>
        </div>

        <span
          style={{
            fontSize: '30px', // Extra Large Subtitle
            fontWeight: 400,
            color: '#4B5563',
            lineHeight: 1.3,
          }}
        >
          {toast.subtitle}
        </span>
      </div>

      {/* Top Right Header Elements: Timestamp & Close Button */}
      <div
        style={{
          position: 'absolute',
          top: '32px',
          right: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '24px', color: '#9CA3AF', fontWeight: 500 }}>
          {timeText}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', opacity: 0.7 }}>
          <CloseIcon size={30} color="#9CA3AF" />
        </div>
      </div>

      {/* 5px Progress Bar at Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '6px',
          width: `${progressWidth}%`,
          backgroundColor: cardAccent,
          opacity: 0.9,
        }}
      />
    </div>
  );
};
