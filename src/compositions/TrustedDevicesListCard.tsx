import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact trusted devices card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface DeviceItem {
  type: 'laptop' | 'phone' | 'tablet';
  name: string;
  lastActive: string;
  isActiveNow: boolean;
}

export interface TrustedDevicesListCardProps {
  devices?: DeviceItem[];
  accentColor?: string;
}

const DEFAULT_DEVICES: DeviceItem[] = [
  { type: 'laptop', name: 'MacBook Pro 16"', lastActive: '2 hours ago', isActiveNow: false },
  { type: 'phone', name: 'iPhone 15 Pro', lastActive: 'Active now', isActiveNow: true },
  { type: 'tablet', name: 'iPad Air 10.9"', lastActive: 'Yesterday, 18:40', isActiveNow: false },
  { type: 'laptop', name: 'Windows Workstation', lastActive: '3 days ago', isActiveNow: false },
];

export const TrustedDevicesListCard: React.FC<TrustedDevicesListCardProps> = ({
  devices = DEFAULT_DEVICES,
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 960;
  const cardH = 680;
  const cardX = centerX - cardW / 2; // 1440
  const cardY = centerY - cardH / 2; // 700

  // 1. Frame 0-20: Card Entrance (fade + scale + border draw)
  const perimeter = 2 * (cardW + cardH); // 3280px
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);

  const cardSpring = spring({ frame, fps, config: { damping: 18, stiffness: 220 } });
  const cardScaleBase = interpolate(cardSpring, [0, 1], [0.95, 1.0]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' });

  // Frame 190-205: Subtle Card Settle Pulse
  const settlePulse = frame >= 190 && frame <= 205
    ? interpolate(frame - 190, [0, 7, 15], [1.0, 1.012, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;
  const cardScale = cardScaleBase * settlePulse;

  // Header Title Slide & Fade (Frame 0-20)
  const headerSlideY = interpolate(frame, [0, 20], [-8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const headerOpacity = interpolate(frame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' });

  // Active status dot pulse cycle (45f cycle)
  const activeDotCycle = (frame % 45) / 45;
  const activeDotPulseScale = 1.0 + Math.sin(activeDotCycle * Math.PI * 2) * 0.25;
  const activeDotGlowOpacity = 0.8 + Math.sin(activeDotCycle * Math.PI * 2) * 0.2;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000', // CRITICAL: Solid black background for Screen/Add additive blend mode
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* SVG Glow Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="devicesCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="activeDotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (960px x 680px centered) */}
      <div
        style={{
          position: 'absolute',
          left: `${cardX}px`,
          top: `${cardY}px`,
          width: `${cardW}px`,
          height: `${cardH}px`,
          borderRadius: '26px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 44px',
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* SVG Card Background & Border */}
        <svg
          width={cardW}
          height={cardH}
          viewBox={`0 0 ${cardW} ${cardH}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Dark Cyan Fill */}
          <rect
            x="0"
            y="0"
            width={cardW}
            height={cardH}
            rx="26"
            fill="rgba(10, 31, 36, 0.4)"
          />

          {/* Background Technical Grid Lines */}
          <line x1="44" y1="90" x2={cardW - 44} y2="90" stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Style Accents */}
          <path d="M 14 40 V 14 H 40" fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} 14 H ${cardW - 14} V 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 14 ${cardH - 40} V ${cardH - 14} H 44`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} ${cardH - 14} H ${cardW - 14} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Glowing Outer Card Border */}
          <rect
            x="2"
            y="2"
            width={cardW - 4}
            height={cardH - 4}
            rx="24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray={perimeter}
            strokeDashoffset={borderDashOffset}
            opacity={0.85}
            filter="url(#devicesCardGlow)"
          />
        </svg>

        {/* HEADER SECTION: TITLE & SUB-TEXT */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            transform: `translateY(${headerSlideY}px)`,
            opacity: headerOpacity,
            zIndex: 10,
          }}
        >
          {/* Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.5px',
                  textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
                }}
              >
                Trusted Devices
              </span>
              <span
                style={{
                  fontSize: '17px',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  opacity: 0.65,
                  marginTop: '2px',
                }}
              >
                {devices.length} devices connected to your account
              </span>
            </div>
          </div>

          {/* Right Status Badge */}
          <div
            style={{
              border: `1.5px solid ${accentColor}`,
              borderRadius: '16px',
              padding: '4px 14px',
              fontSize: '13px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '1px',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              textTransform: 'uppercase',
            }}
          >
            DEVICE MANAGER
          </div>
        </div>

        {/* MIDDLE SECTION: 4 STAGGERED DEVICE ROWS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            width: '100%',
            marginTop: '16px',
            zIndex: 10,
          }}
        >
          {devices.map((device, dIdx) => {
            const rowStartFrame = 30 + dIdx * 35;

            // Row Entrance (Frame rowStartFrame to rowStartFrame + 15)
            const rowSlideX = frame >= rowStartFrame
              ? interpolate(frame - rowStartFrame, [0, 15], [-15, 0], {
                  easing: Easing.out(Easing.cubic),
                  extrapolateRight: 'clamp',
                })
              : -15;

            const rowOpacity = frame >= rowStartFrame
              ? interpolate(frame - rowStartFrame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
              : 0;

            // Icon pop-in
            const iconPopScale = frame >= rowStartFrame
              ? interpolate(frame - rowStartFrame, [0, 8, 15], [0.8, 1.1, 1.0], { extrapolateRight: 'clamp' })
              : 0.8;

            // Status dot delay (8 frames after row)
            const dotStartFrame = rowStartFrame + 8;
            const dotOpacity = frame >= dotStartFrame
              ? interpolate(frame - dotStartFrame, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
              : 0;
            const dotScale = frame >= dotStartFrame
              ? interpolate(frame - dotStartFrame, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
              : 0;

            // Active row highlight border draw (20 frames)
            const borderHighlightDraw = device.isActiveNow && frame >= rowStartFrame + 12
              ? interpolate(frame - (rowStartFrame + 12), [0, 20], [0, 1.0], {
                  easing: Easing.out(Easing.cubic),
                  extrapolateRight: 'clamp',
                })
              : 0;

            return (
              <React.Fragment key={`device-row-${dIdx}`}>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 22px',
                    borderRadius: '16px',
                    backgroundColor: device.isActiveNow
                      ? 'rgba(34, 211, 238, 0.08)'
                      : 'rgba(15, 23, 42, 0.45)',
                    border: device.isActiveNow
                      ? `1.5px solid rgba(34, 211, 238, ${0.5 * borderHighlightDraw})`
                      : '1.5px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: device.isActiveNow ? '0 0 16px rgba(34, 211, 238, 0.2)' : 'none',
                    transform: `translateX(${rowSlideX}px)`,
                    opacity: rowOpacity,
                    boxSizing: 'border-box',
                  }}
                >
                  {/* LEFT: Device Icon & Device Name + Last Active */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* DEVICE ICON OUTLINE */}
                    <div
                      style={{
                        transform: `scale(${iconPopScale})`,
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {device.type === 'laptop' && (
                        <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                          <rect x="6" y="4" width="28" height="18" rx="2" stroke={device.isActiveNow ? accentColor : '#FFFFFF'} strokeWidth="2" strokeOpacity={device.isActiveNow ? 1 : 0.85} />
                          <line x1="2" y1="26" x2="38" y2="26" stroke={device.isActiveNow ? accentColor : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeOpacity={device.isActiveNow ? 1 : 0.85} />
                        </svg>
                      )}

                      {device.type === 'phone' && (
                        <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
                          <rect x="4" y="3" width="20" height="34" rx="4" stroke={device.isActiveNow ? accentColor : '#FFFFFF'} strokeWidth="2" strokeOpacity={device.isActiveNow ? 1 : 0.85} />
                          <line x1="10" y1="32" x2="18" y2="32" stroke={device.isActiveNow ? accentColor : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeOpacity={device.isActiveNow ? 1 : 0.85} />
                        </svg>
                      )}

                      {device.type === 'tablet' && (
                        <svg width="34" height="38" viewBox="0 0 34 38" fill="none">
                          <rect x="3" y="3" width="28" height="32" rx="4" stroke={device.isActiveNow ? accentColor : '#FFFFFF'} strokeWidth="2" strokeOpacity={device.isActiveNow ? 1 : 0.85} />
                          <circle cx="17" cy="30" r="1.5" fill={device.isActiveNow ? accentColor : '#FFFFFF'} fillOpacity={device.isActiveNow ? 1 : 0.85} />
                        </svg>
                      )}
                    </div>

                    {/* DEVICE NAME & LAST ACTIVE METADATA */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontSize: '21px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {device.name}
                      </span>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 500,
                          color: '#FFFFFF',
                          opacity: 0.6,
                          marginTop: '2px',
                        }}
                      >
                        Last active: {device.lastActive}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: STATUS DOT & LABEL */}
                  <div
                    style={{
                      transform: `scale(${dotScale})`,
                      opacity: dotOpacity,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    {device.isActiveNow ? (
                      <>
                        {/* ACTIVE GREEN GLOWING DOT */}
                        <div
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: '#4ADE80',
                            transform: `scale(${activeDotPulseScale})`,
                            boxShadow: `0 0 12px rgba(74, 222, 128, ${activeDotGlowOpacity})`,
                            filter: 'url(#activeDotGlow)',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#4ADE80',
                            letterSpacing: '0.5px',
                            textShadow: '0 0 10px rgba(74, 222, 128, 0.4)',
                          }}
                        >
                          Active now
                        </span>
                      </>
                    ) : (
                      <>
                        {/* INACTIVE DULL DOT */}
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            opacity: 0.35,
                          }}
                        />
                        <span
                          style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#FFFFFF',
                            opacity: 0.5,
                          }}
                        >
                          Connected
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* ROW DIVIDER LINE (Between rows) */}
                {dIdx < devices.length - 1 && (
                  <div
                    style={{
                      width: '100%',
                      height: '1px',
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                      opacity: rowOpacity * 0.6,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* BOTTOM SECTION: SECURITY ACTION LINK */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '14px 28px',
            boxSizing: 'border-box',
            zIndex: 10,
            marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', opacity: 0.85 }}>
              Don't recognize a device?
            </span>
          </div>

          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '0.5px',
              textShadow: `0 0 10px ${accentColor}`,
            }}
          >
            Sign out all devices →
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
