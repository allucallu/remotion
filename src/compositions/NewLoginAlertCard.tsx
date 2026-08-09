import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact alert card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface NewLoginAlertCardProps {
  deviceType?: 'laptop' | 'phone';
  locationLabel?: string;
  timeLabel?: string;
  accentColor?: string;
}

export const NewLoginAlertCard: React.FC<NewLoginAlertCardProps> = ({
  deviceType = 'laptop',
  locationLabel = 'Jakarta, Indonesia',
  timeLabel = 'Today, 14:32',
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2;

  const cardW = 1160;
  const cardH = 620;
  const cardX = centerX - cardW / 2;
  const cardY = centerY - cardH / 2;

  // 1. Frame 0-20: Card Entrance (slide down + fade + scale)
  const cardSpring = spring({ frame, fps, config: { damping: 18, stiffness: 260 } });
  const cardTranslateY = interpolate(cardSpring, [0, 1], [-30, 0]);
  const cardScale = interpolate(cardSpring, [0, 1], [0.96, 1.0]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' });

  // 2. Frame 20-35: Warning Icon Pulse (2 cycles x ~7.5f each)
  const warningPulsePhase = frame >= 20 && frame <= 50 ? ((frame - 20) % 15) / 15 : 0;
  const warningPulseScale = frame >= 20 && frame <= 50
    ? 1.0 + Math.sin(warningPulsePhase * Math.PI * 2) * 0.1 : 1.0;
  const warningPulseOpacity = frame >= 20 && frame <= 50
    ? 0.75 + Math.sin(warningPulsePhase * Math.PI * 2) * 0.25 : 1.0;
  const warningFadeIn = interpolate(frame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' });

  // 3. Frame 35-50: Title text slide-in
  const titleSlideX = frame >= 35
    ? interpolate(frame - 35, [0, 15], [-10, 0], { easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp' })
    : -10;
  const titleOpacity = frame >= 35
    ? interpolate(frame - 35, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Frame 55-70: Device icon scale-in
  const deviceSpring = spring({ frame: Math.max(0, frame - 55), fps, config: { damping: 14, stiffness: 180 } });
  const deviceScale = frame >= 55 ? interpolate(deviceSpring, [0, 1], [0.8, 1.0]) : 0;
  const deviceOpacity = frame >= 55
    ? interpolate(frame - 55, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 5. Frame 70-140: Info rows staggered entrance (3 rows, 20f delay each)
  const infoRows = [
    { startFrame: 70, icon: 'pin', label: locationLabel },
    { startFrame: 90, icon: 'clock', label: timeLabel },
    { startFrame: 110, icon: 'network', label: '192.168.xxx.xxx' },
  ];

  // 6. Frame 150-170: Divider draw-in
  const dividerScaleX = frame >= 150
    ? interpolate(frame - 150, [0, 20], [0, 1.0], { easing: Easing.inOut(Easing.cubic), extrapolateRight: 'clamp' })
    : 0;

  // 7. Frame 175-200: Buttons entrance (staggered 10f)
  const btn1Spring = spring({ frame: Math.max(0, frame - 175), fps, config: { damping: 14, stiffness: 200 } });
  const btn1Scale = frame >= 175 ? interpolate(btn1Spring, [0, 1], [0.9, 1.0]) : 0;
  const btn1Opacity = frame >= 175
    ? interpolate(frame - 175, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  const btn2Spring = spring({ frame: Math.max(0, frame - 185), fps, config: { damping: 14, stiffness: 200 } });
  const btn2Scale = frame >= 185 ? interpolate(btn2Spring, [0, 1], [0.9, 1.0]) : 0;
  const btn2Opacity = frame >= 185
    ? interpolate(frame - 185, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 8. Frame 200+: Secure Account button idle pulse
  const securePulseCycle = frame >= 200 ? ((frame - 200) % 40) / 40 : 0;
  const securePulseScale = frame >= 200 ? 1.0 + Math.sin(securePulseCycle * Math.PI * 2) * 0.03 : 1.0;
  const secureGlowOpacity = frame >= 200 ? 0.4 + Math.sin(securePulseCycle * Math.PI * 2) * 0.3 : 0;

  // Card draw-in border
  const perimeter = 2 * (cardW + cardH);
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        width: '100%', height: '100%',
        overflow: 'hidden', position: 'relative',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* SVG Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="alertCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="alertBtnGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* CARD CONTAINER */}
      <div
        style={{
          position: 'absolute',
          left: `${cardX}px`, top: `${cardY}px`,
          width: `${cardW}px`, height: `${cardH}px`,
          borderRadius: '24px', boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '32px 44px',
          transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
          opacity: cardOpacity,
        }}
      >
        {/* SVG Card Background & Border */}
        <svg
          width={cardW} height={cardH}
          viewBox={`0 0 ${cardW} ${cardH}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <rect x="0" y="0" width={cardW} height={cardH} rx="24" fill="rgba(10, 31, 36, 0.4)" />

          {/* Background divider guide lines */}
          <line x1="44" y1="90" x2={cardW - 44} y2="90" stroke="#164E56" strokeWidth="1" opacity="0.3" />

          {/* Corner Bracket Accents */}
          <path d="M 12 40 V 12 H 40" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.7" />
          <path d={`M ${cardW - 40} 12 H ${cardW - 12} V 40`} fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.7" />
          <path d={`M 12 ${cardH - 40} V ${cardH - 12} H 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.7" />
          <path d={`M ${cardW - 40} ${cardH - 12} H ${cardW - 12} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.7" />

          {/* Outer Border Draw-In */}
          <rect
            x="2" y="2" width={cardW - 4} height={cardH - 4} rx="22"
            fill="none" stroke="#FFFFFF" strokeWidth="3"
            strokeDasharray={perimeter} strokeDashoffset={borderDashOffset}
            opacity={0.85} filter="url(#alertCardGlow)"
          />
        </svg>

        {/* HEADER: Warning Icon + Title */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            width: '100%', zIndex: 10,
          }}
        >
          {/* Warning Triangle Icon */}
          <div
            style={{
              transform: `scale(${warningPulseScale})`,
              opacity: warningFadeIn * warningPulseOpacity,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="#FBBF24" strokeWidth="2.5" fill="rgba(251, 191, 36, 0.15)"
                style={{ filter: 'drop-shadow(0 0 8px #FBBF24)' }}
              />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#FBBF24" strokeWidth="2.5" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FBBF24" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Title Text */}
          <span
            style={{
              fontSize: '30px', fontWeight: 700, color: '#FFFFFF',
              letterSpacing: '0.5px',
              transform: `translateX(${titleSlideX}px)`,
              opacity: titleOpacity,
              textShadow: '0 0 12px rgba(255, 255, 255, 0.3)',
            }}
          >
            New Sign-in Detected
          </span>

          {/* Right-side: Severity Level Badge */}
          <div
            style={{
              marginLeft: 'auto',
              border: '1.5px solid #FBBF24', borderRadius: '20px',
              padding: '3px 14px', fontSize: '14px', fontWeight: 700,
              color: '#FBBF24', letterSpacing: '1px',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              opacity: titleOpacity,
            }}
          >
            REVIEW REQUIRED
          </div>
        </div>

        {/* MIDDLE: Device Icon + Info Rows */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '44px',
            width: '100%', zIndex: 10,
          }}
        >
          {/* Device Icon (Laptop or Phone outline) */}
          <div
            style={{
              transform: `scale(${deviceScale})`,
              opacity: deviceOpacity,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {deviceType === 'laptop' ? (
              <svg width="130" height="100" viewBox="0 0 130 100" fill="none">
                {/* Laptop Screen */}
                <rect x="15" y="8" width="100" height="62" rx="6"
                  stroke={accentColor} strokeWidth="3" fill="rgba(15, 23, 42, 0.8)"
                  style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
                />
                {/* Screen content lines */}
                <line x1="30" y1="28" x2="70" y2="28" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <line x1="30" y1="38" x2="85" y2="38" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                <line x1="30" y1="48" x2="55" y2="48" stroke="#FFFFFF" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
                {/* Question mark in screen center-right */}
                <text x="95" y="45" fill="#FBBF24" fontSize="22" fontWeight="800" textAnchor="middle" opacity="0.8">?</text>
                {/* Laptop Base */}
                <path d="M 5 72 H 125 L 118 88 H 12 Z"
                  stroke={accentColor} strokeWidth="2.5" fill="rgba(15, 23, 42, 0.6)"
                />
              </svg>
            ) : (
              <svg width="70" height="120" viewBox="0 0 70 120" fill="none">
                {/* Phone Body */}
                <rect x="5" y="5" width="60" height="110" rx="10"
                  stroke={accentColor} strokeWidth="3" fill="rgba(15, 23, 42, 0.8)"
                  style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
                />
                {/* Screen Area */}
                <rect x="10" y="20" width="50" height="75" rx="3"
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"
                />
                {/* Screen content lines */}
                <line x1="18" y1="38" x2="42" y2="38" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
                <line x1="18" y1="48" x2="50" y2="48" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                {/* Question mark */}
                <text x="35" y="72" fill="#FBBF24" fontSize="20" fontWeight="800" textAnchor="middle" opacity="0.8">?</text>
                {/* Home button circle */}
                <circle cx="35" cy="105" r="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
              </svg>
            )}
          </div>

          {/* Info Rows (Location, Time, IP) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            {infoRows.map((row, idx) => {
              const rowSlideX = frame >= row.startFrame
                ? interpolate(frame - row.startFrame, [0, 15], [12, 0], {
                    easing: Easing.out(Easing.cubic), extrapolateRight: 'clamp',
                  })
                : 12;
              const rowOpacity = frame >= row.startFrame
                ? interpolate(frame - row.startFrame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
                : 0;
              const iconPopScale = frame >= row.startFrame
                ? interpolate(frame - row.startFrame, [0, 6, 12], [0.6, 1.15, 1.0], { extrapolateRight: 'clamp' })
                : 0.6;

              return (
                <div
                  key={`info-row-${idx}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    transform: `translateX(${rowSlideX}px)`,
                    opacity: rowOpacity,
                  }}
                >
                  {/* Row Icon */}
                  <div style={{ transform: `scale(${iconPopScale})`, flexShrink: 0 }}>
                    {row.icon === 'pin' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    )}
                    {row.icon === 'clock' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                    {row.icon === 'network' && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <path d="M12 8v8" /><path d="M8 12h8" />
                      </svg>
                    )}
                  </div>

                  {/* Row Label */}
                  <span style={{ fontSize: '24px', fontWeight: 600, color: '#FFFFFF', opacity: 0.9 }}>
                    {row.icon === 'pin' && 'Location: '}
                    {row.icon === 'clock' && 'Time: '}
                    {row.icon === 'network' && 'IP Address: '}
                    <span style={{ color: idx === 2 ? '#FFFFFF' : accentColor, fontWeight: 700, opacity: idx === 2 ? 0.7 : 1.0 }}>
                      {row.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIVIDER LINE (Frame 150-170) */}
        <div
          style={{
            width: '100%', height: '1.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            transform: `scaleX(${dividerScaleX})`,
            transformOrigin: 'center center',
            zIndex: 10,
          }}
        />

        {/* BOTTOM: Action Buttons */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '28px', width: '100%', zIndex: 10,
          }}
        >
          {/* Button 1: "This Was Me" (outline/neutral) */}
          <div
            style={{
              transform: `scale(${btn1Scale})`,
              opacity: btn1Opacity,
              border: '2.5px solid rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              padding: '14px 48px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', opacity: 0.9 }}>
              This Was Me
            </span>
          </div>

          {/* Button 2: "Secure Account" (filled/accent, recommended) */}
          <div
            style={{
              transform: `scale(${btn2Scale * securePulseScale})`,
              opacity: btn2Opacity,
              border: `2.5px solid ${accentColor}`,
              borderRadius: '16px',
              padding: '14px 48px',
              backgroundColor: 'rgba(34, 211, 238, 0.2)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '10px',
              boxShadow: secureGlowOpacity > 0 ? `0 0 24px rgba(34, 211, 238, ${secureGlowOpacity})` : 'none',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '22px', fontWeight: 700, color: accentColor }}>
              Secure Account
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
