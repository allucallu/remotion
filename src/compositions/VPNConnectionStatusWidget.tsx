import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact VPN widget card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface VPNConnectionStatusWidgetProps {
  locationLabel?: string;
  accentColor?: string;
  connectDuration?: number;
}

export const VPNConnectionStatusWidget: React.FC<VPNConnectionStatusWidgetProps> = ({
  locationLabel = 'Singapore',
  accentColor = '#22D3EE',
  connectDuration = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const cardCenterY = height / 2 + 180; // 1260px

  const cardW = 1240;
  const cardH = 580;
  const cardX = centerX - cardW / 2; // 1300
  const cardY = cardCenterY - cardH / 2; // 970

  // 1. Frame 0-15: Card Outline Draw-In Animation
  const perimeter = 2 * (cardW + cardH); // 3640px
  const cardDrawProgress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cardDashOffset = perimeter * (1 - cardDrawProgress);

  // 2. Phase 1: Connecting Spinner Rotation & Dots (Frame 15 to 15 + connectDuration)
  const connectStart = 15;
  const connectEnd = connectStart + connectDuration; // default frame 75

  const spinnerRotation = (frame * 12) % 360;
  const dotCount = Math.floor((frame / 15) % 3) + 1;
  const connectingDots = '.'.repeat(dotCount);

  // 3. Phase 2: Transition to Connected (Frame 75-95)
  const isConnected = frame >= connectEnd;
  const connectedFrame = Math.max(0, frame - connectEnd);

  // Micro-Flash Burst at Transition
  const flashWhiteOpacity = isConnected
    ? interpolate(connectedFrame, [0, 3, 8], [0.95, 0.7, 0], { extrapolateRight: 'clamp' })
    : 0;

  // Spinner Scale Out
  const spinnerScale = isConnected
    ? interpolate(connectedFrame, [0, 8], [1.0, 0], { extrapolateRight: 'clamp' })
    : 1.0;

  // Shield Check Icon Spring Scale-In
  const shieldSpring = spring({
    frame: connectedFrame,
    fps,
    config: { damping: 13, stiffness: 170 },
  });
  const shieldScale = isConnected ? interpolate(shieldSpring, [0, 1], [0, 1.0]) : 0;

  // SECURE Badge Slide-In
  const secureBadgeSlide = frame >= connectEnd + 20
    ? interpolate(frame - (connectEnd + 20), [0, 12], [20, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 20;
  const secureBadgeOpacity = frame >= connectEnd + 20
    ? interpolate(frame - (connectEnd + 20), [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Supporting HUD Elements: IP Address, Protocol, Speed Counters
  const ipOpacity = frame >= 25 ? interpolate(frame - 25, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' }) : 0;

  // Dynamic Speed Values (Frame 120+)
  const downloadSpeed = (142.8 + Math.sin(frame * 0.1) * 3.2).toFixed(1);
  const uploadSpeed = (48.5 + Math.cos(frame * 0.12) * 1.5).toFixed(1);

  // 5. Phase 3: Location Info & Signal Bars (Frame 120-150)
  const locationSlideY = frame >= 120
    ? interpolate(frame - 120, [0, 20], [15, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 15;
  const locationOpacity = frame >= 120
    ? interpolate(frame - 120, [0, 20], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  const pinBounceScale = frame >= 120
    ? interpolate(frame - 120, [0, 5, 10], [1.0, 1.25, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  // 6. Final Idle Breathing on SECURE Badge
  const idleBreathCycle = frame >= 160 ? ((frame - 160) % 40) / 40 : 0;
  const secureBreathOpacity = frame >= 160 ? 0.85 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.15 : 1.0;

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
      {/* SVG Filters for Soft Glow Effects */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="vpnCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="vpnShieldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (1240px x 580px centered in lower area) */}
      <div
        style={{
          position: 'absolute',
          left: `${cardX}px`,
          top: `${cardY}px`,
          width: `${cardW}px`,
          height: `${cardH}px`,
          borderRadius: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 40px',
        }}
      >
        {/* SVG Card Border Draw-In & Dark Fill Layer */}
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
            rx="24"
            fill="rgba(10, 31, 36, 0.4)"
            stroke="none"
          />

          {/* Background Technical Grid Lines */}
          <line x1="40" y1="90" x2={cardW - 40} y2="90" stroke="#164E56" strokeWidth="1" opacity="0.4" />
          <line x1="40" y1={cardH - 110} x2={cardW - 40} y2={cardH - 110} stroke="#164E56" strokeWidth="1" opacity="0.4" />

          {/* Corner Bracket Style Accents */}
          <path d="M 12 40 V 12 H 40" fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} 12 H ${cardW - 12} V 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 12 ${cardH - 40} V ${cardH - 12} H 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} ${cardH - 12} H ${cardW - 12} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Glowing White/Cyan Outer Border Line */}
          <rect
            x="2"
            y="2"
            width={cardW - 4}
            height={cardH - 4}
            rx="22"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray={perimeter}
            strokeDashoffset={cardDashOffset}
            opacity={0.85}
            filter="url(#vpnCardGlow)"
          />
        </svg>

        {/* TRANSITION MICRO-FLASH BURST OVERLAY */}
        {flashWhiteOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              opacity: flashWhiteOpacity,
              borderRadius: '24px',
              pointerEvents: 'none',
              zIndex: 30,
            }}
          />
        )}

        {/* SUPPORTING ELEMENT 1: TOP HEADER INFO BAR (IP Address & Protocol Badge) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            opacity: ipOpacity,
            zIndex: 10,
          }}
        >
          {/* IP Address Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: isConnected ? '#4ADE80' : accentColor,
                boxShadow: isConnected ? '0 0 10px #4ADE80' : `0 0 10px ${accentColor}`,
              }}
            />
            <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF', letterSpacing: '1px' }}>
              IP: {isConnected ? '185.220.101.42' : '192.168.1.104'}
            </span>
          </div>

          {/* Protocol Badge */}
          <div
            style={{
              border: `1.5px solid ${accentColor}`,
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '15px',
              fontWeight: 700,
              color: accentColor,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
            }}
          >
            WireGuard® / AES-256
          </div>
        </div>

        {/* MIDDLE MAIN STATUS SECTION */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            zIndex: 10,
          }}
        >
          {/* PHASE 1: CONNECTING SPINNER (Frame 0-75) */}
          {!isConnected && (
            <svg
              width="68"
              height="68"
              viewBox="0 0 68 68"
              style={{
                transform: `scale(${spinnerScale}) rotate(${spinnerRotation}deg)`,
                transformOrigin: '34px 34px',
              }}
            >
              <circle cx="34" cy="34" r="28" stroke="#164E56" strokeWidth="6" fill="none" />
              <path
                d="M 34 6 A 28 28 0 0 1 62 34"
                fill="none"
                stroke={accentColor}
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#vpnShieldGlow)"
              />
            </svg>
          )}

          {/* PHASE 2: CONNECTED SHIELD CHECK ICON (Frame 75+) */}
          {isConnected && (
            <div
              style={{
                transform: `scale(${shieldScale})`,
                transformOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="76" height="76" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="#4ADE80" opacity="0.25" filter="url(#vpnShieldGlow)" />
                <path
                  d="M 36 8 L 60 16 V 36 C 60 52 36 64 36 64 C 36 64 12 52 12 36 V 16 Z"
                  fill="rgba(15, 23, 42, 0.95)"
                  stroke="#4ADE80"
                  strokeWidth="3.5"
                  style={{ filter: 'drop-shadow(0 0 12px #4ADE80)' }}
                />
                <path
                  d="M 26 36 L 33 43 L 47 27"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* MAIN STATUS TEXT & SECURE BADGE */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  color: isConnected ? '#4ADE80' : '#FFFFFF',
                  letterSpacing: '0.5px',
                  textShadow: isConnected ? '0 0 20px rgba(74, 222, 128, 0.6)' : 'none',
                }}
              >
                {!isConnected ? `Connecting${connectingDots}` : 'Connected'}
              </span>

              {/* SECURE BADGE (Phase 2+) */}
              {isConnected && (
                <div
                  style={{
                    transform: `translateX(${secureBadgeSlide}px)`,
                    opacity: secureBadgeOpacity * secureBreathOpacity,
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    border: '2px solid #4ADE80',
                    borderRadius: '30px',
                    padding: '6px 18px',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#4ADE80',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    boxShadow: '0 0 16px rgba(74, 222, 128, 0.4)',
                  }}
                >
                  Secure
                </div>
              )}
            </div>

            <span
              style={{
                fontSize: '22px',
                fontWeight: 500,
                color: '#FFFFFF',
                opacity: 0.85,
                marginTop: '4px',
              }}
            >
              {!isConnected ? 'Establishing secure tunnel...' : 'Encrypted & protected'}
            </span>
          </div>
        </div>

        {/* SUPPORTING ELEMENT 2: BOTTOM SECTION (LOCATION, SPEED COUNTERS & SIGNAL BARS) */}
        {frame >= 120 && (
          <div
            style={{
              transform: `translateY(${locationSlideY}px)`,
              opacity: locationOpacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '16px',
              padding: '16px 28px',
              boxSizing: 'border-box',
              zIndex: 10,
            }}
          >
            {/* LOCATION PIN & CITY LABEL */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: `scale(${pinBounceScale})`,
                  filter: `drop-shadow(0 0 8px ${accentColor})`,
                }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}>
                Location:{' '}
                <span style={{ color: accentColor, fontWeight: 800 }}>{locationLabel}</span>
              </span>
            </div>

            {/* LIVE SPEED COUNTERS (Download / Upload) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: accentColor, fontSize: '20px', fontWeight: 800 }}>↓</span>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF' }}>
                  {downloadSpeed} Mbps
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: accentColor, fontSize: '20px', fontWeight: 800 }}>↑</span>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF' }}>
                  {uploadSpeed} Mbps
                </span>
              </div>
            </div>

            {/* LATENCY PING & SIGNAL BARS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#4ADE80', fontFamily: 'monospace' }}>
                Ping: 12ms
              </span>

              {/* 4 SIGNAL BARS */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '22px' }}>
                {Array.from({ length: 4 }).map((_, bIdx) => {
                  const barStartFrame = 150 + bIdx * 3;
                  const barScaleY = frame >= barStartFrame
                    ? interpolate(frame - barStartFrame, [0, 8], [0, 1.0], {
                        easing: Easing.out(Easing.cubic),
                        extrapolateRight: 'clamp',
                      })
                    : 0;

                  const barHeight = 8 + bIdx * 4.5;

                  return (
                    <div
                      key={`sig-bar-${bIdx}`}
                      style={{
                        width: '6px',
                        height: `${barHeight}px`,
                        backgroundColor: '#4ADE80',
                        borderRadius: '3px',
                        transform: `scaleY(${barScaleY})`,
                        transformOrigin: 'bottom center',
                        boxShadow: '0 0 8px #4ADE80',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
