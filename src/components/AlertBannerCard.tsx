import React from 'react';
import { interpolate, interpolateColors, spring, useVideoConfig } from 'remotion';
import { WarningTriangleIcon, ShieldCheckIcon, CloseDismissIcon, ServerVectorIcon, ShieldLockBadgeIcon } from './AlertBannerIcons';

export interface AlertBannerCardProps {
  frame: number;
  alertMessage?: string;
  resolvedMessage?: string;
  dangerColor?: string;
  safeColor?: string;
}

export const AlertBannerCard: React.FC<AlertBannerCardProps> = ({
  frame,
  alertMessage = 'Suspicious Login Detected',
  resolvedMessage = 'Threat Neutralized',
  dangerColor = '#DC2626',
  safeColor = '#16A34A',
}) => {
  const { fps } = useVideoConfig();

  // 1. Frame 0-20: Slide-in Entry Spring (translateY -140px -> 0px, opacity 0 -> 1)
  const entrySpring = spring({
    frame,
    fps,
    config: {
      damping: 180,
      stiffness: 260,
    },
  });

  const entryTranslateY = interpolate(entrySpring, [0, 1], [-140, 0]);
  const entryOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Frame 380-410: Slide-out Exit (translateY 0px -> -140px, opacity 1 -> 0)
  const isExiting = frame >= 380;
  const exitProgress = isExiting ? (frame - 380) / 30 : 0;
  const exitTranslateY = interpolate(exitProgress, [0, 1], [0, -140], { extrapolateRight: 'clamp' });
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0], { extrapolateRight: 'clamp' });

  const totalTranslateY = entryTranslateY + exitTranslateY;
  const totalOpacity = entryOpacity * exitOpacity;

  // 3. Frame 20-35: Warning Icon Breathing Pulse 2 Cycles (opacity 1 -> 0.45 -> 1)
  const isBreathing = frame >= 20 && frame <= 50;
  const warningOpacity = isBreathing
    ? 0.725 + Math.sin((frame - 20) * (Math.PI / 7.5)) * 0.275
    : 1;

  // 4. Frame 35-50: Sub-text Detail Reveal (translateY 6px -> 0px, opacity 0 -> 0.9)
  const subtextProgress = Math.max(0, frame - 35);
  const subtextOpacity = interpolate(subtextProgress, [0, 15], [0, 0.9], { extrapolateRight: 'clamp' });
  const subtextTranslateY = interpolate(subtextProgress, [0, 15], [6, 0], { extrapolateRight: 'clamp' });

  // 5. Frame 200-230: Smooth Resolution Transition
  // a. Smooth Background Color Interpolation (#DC2626 -> #16A34A) over 25 frames (Frame 200..225)
  const isResolved = frame >= 200;
  const colorProgress = Math.max(0, Math.min(1, (frame - 200) / 25));
  const bannerBgColor = interpolateColors(colorProgress, [0, 1], [dangerColor, safeColor]);

  // b. Icon Crossfade (Warning Triangle -> Shield Check)
  const iconTransitionProgress = Math.max(0, Math.min(1, (frame - 205) / 20));
  const dangerIconOpacity = interpolate(iconTransitionProgress, [0, 1], [1, 0]);
  const safeIconOpacity = interpolate(iconTransitionProgress, [0, 1], [0, 1]);

  const shieldSpring = spring({
    frame: Math.max(0, frame - 205),
    fps,
    config: {
      damping: 14,
      stiffness: 220,
    },
  });

  const shieldScale = interpolate(shieldSpring, [0, 1], [0.7, 1]);

  // c. Text Crossfade (Alert Message -> Resolved Message)
  const textTransitionProgress = Math.max(0, Math.min(1, (frame - 205) / 20));
  const dangerTextOpacity = interpolate(textTransitionProgress, [0, 1], [1, 0]);
  const safeTextOpacity = interpolate(textTransitionProgress, [0, 1], [0, 1]);
  const safeTextTranslateY = interpolate(textTransitionProgress, [0, 1], [4, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: '110px',
        left: '50%',
        transform: `translate(-50%, ${totalTranslateY}px)`,
        opacity: totalOpacity,
        width: '2500px', // Extra Large 4K UHD Console Width
        backgroundColor: bannerBgColor,
        borderRadius: '28px',
        padding: '34px 56px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        transition: 'background-color 0.1s linear',
        zIndex: 20,
        overflow: 'hidden',
      }}
    >
      {/* Top Console Command Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          <span style={{ fontSize: '15px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.95)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            INCIDENT #SEC-8092 • REAL-TIME THREAT DETECTION CONSOLE
          </span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.8)' }}>
          AUTOMATED SIEM AGENT ACTIVE
        </span>
      </div>

      {/* Main Console Content Body (Left Message, Center Telemetry Box, Right Badge) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Left Icon Container & Center Text Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Left Icon Container with Icon Crossfade */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '22px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            {/* Danger State Warning Triangle Icon */}
            {dangerIconOpacity > 0 && (
              <div style={{ position: 'absolute', opacity: dangerIconOpacity }}>
                <WarningTriangleIcon size={68} color="#FFFFFF" opacity={warningOpacity} />
              </div>
            )}

            {/* Resolved State Shield Check Icon */}
            {safeIconOpacity > 0 && (
              <div style={{ position: 'absolute', opacity: safeIconOpacity }}>
                <ShieldCheckIcon size={68} color="#FFFFFF" scale={shieldScale} opacity={safeIconOpacity} />
              </div>
            )}
          </div>

          {/* Center Text Message Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
            {/* Main Message Title */}
            <div style={{ position: 'relative', height: '46px', display: 'flex', alignItems: 'center' }}>
              {dangerTextOpacity > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '38px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.4px',
                    opacity: dangerTextOpacity,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {alertMessage}
                </span>
              )}

              {safeTextOpacity > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '38px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-0.4px',
                    opacity: safeTextOpacity,
                    transform: `translateY(${safeTextTranslateY}px)`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {resolvedMessage}
                </span>
              )}
            </div>

            {/* Subtext Detail */}
            <div
              style={{
                opacity: subtextOpacity,
                transform: `translateY(${subtextTranslateY}px)`,
                position: 'relative',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {dangerTextOpacity > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.92)',
                    opacity: dangerTextOpacity,
                    whiteSpace: 'nowrap',
                  }}
                >
                  IP Address: 192.168.1.104 • Immediate action recommended
                </span>
              )}

              {safeTextOpacity > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.92)',
                    opacity: safeTextOpacity,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Resolved at 20:17:04 • Threat blocked by Security Engine
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center Live Telemetry Box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.16)',
            borderRadius: '16px',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ServerVectorIcon size={24} color="#FFFFFF" opacity={0.9} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>TARGET RESOURCE</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>auth-service-us-east-1</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldLockBadgeIcon size={24} color="#FFFFFF" opacity={0.9} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>MITIGATION PROTOCOL</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: isResolved ? '#DCFCE7' : '#FEF2F2' }}>
                {isResolved ? 'FIREWALL RULE APPLIED' : 'AUTOMATIC PORT ISOLATION'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Group: Dynamic Status Tag Badge & Close Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              backgroundColor: isResolved ? '#F0FDF4' : '#FEF2F2',
              color: isResolved ? '#15803D' : dangerColor,
              padding: '12px 26px',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            {isResolved ? '● RESOLVED' : 'CRITICAL ALERT'}
          </div>

          <CloseDismissIcon size={32} color="#FFFFFF" opacity={0.8} />
        </div>
      </div>
    </div>
  );
};
