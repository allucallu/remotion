import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact encryption toggle card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface E2EEncryptionToggleCardProps {
  accentColor?: string;
}

export const E2EEncryptionToggleCard: React.FC<E2EEncryptionToggleCardProps> = ({
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 1120;
  const cardH = 560;
  const cardX = centerX - cardW / 2; // 1360
  const cardY = centerY - cardH / 2; // 800

  // 1. Frame 0-20: Card Entrance (fade + scale + border draw)
  const perimeter = 2 * (cardW + cardH); // 3360px
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);

  const cardSpring = spring({ frame, fps, config: { damping: 18, stiffness: 220 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.95, 1.0]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' });

  // 2. Frame 40-55: Toggle Switch Animation (ON/OFF)
  const toggleProgress = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Knob slide X from 0px (left) to 36px (right)
  const knobX = toggleProgress * 36;

  // Knob elastic squeeze (scaleX 1.0 -> 0.82 -> 1.0)
  const knobScaleX = frame >= 40 && frame <= 55
    ? interpolate(frame - 40, [0, 7, 15], [1.0, 0.82, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  // Toggle Background Pill Color Transition
  const toggleBgColor = interpolateColors(toggleProgress, [0, 1], ['rgba(255, 255, 255, 0.12)', accentColor]);
  const toggleBorderColor = interpolateColors(toggleProgress, [0, 1], ['rgba(255, 255, 255, 0.4)', accentColor]);

  // 3. Frame 40-55: Shackle Lock Movement (Unlocked to Locked)
  // Shackle rotates from -32deg (open tilted) to 0deg (locked vert) & moves down
  const lockProgress = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)), // overshoot bounce at snap
  });

  const shackleAngle = (1 - lockProgress) * -32;
  const shackleY = (1 - lockProgress) * -16;

  const isLocked = frame >= 55;

  // 4. Frame 60-70: Lock Confirmation Climax Flash & Expanding Ring
  const flashOpacity = isLocked
    ? interpolate(frame, [55, 60, 68], [0, 0.9, 0], { extrapolateRight: 'clamp' })
    : 0;

  const expRingScale = isLocked
    ? interpolate(frame - 55, [0, 25], [0, 1.8], { extrapolateRight: 'clamp' })
    : 0;
  const expRingOpacity = isLocked
    ? interpolate(frame - 55, [0, 25], [0.75, 0], { extrapolateRight: 'clamp' })
    : 0;

  // Lock glow intensity
  const lockGlowBlur = isLocked ? 6 : 0;
  const lockColor = isLocked ? accentColor : '#FFFFFF';

  // 5. Frame 75-95: Sub-copy Text Entrance
  const subTextSlideY = frame >= 75
    ? interpolate(frame - 75, [0, 20], [8, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 8;
  const subTextOpacity = frame >= 75
    ? interpolate(frame - 75, [0, 20], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 6. Frame 105-125: Micro-badge "ACTIVE" Pop-In (positioned directly below padlock)
  const badgeSpring = spring({
    frame: Math.max(0, frame - 105),
    fps,
    config: { damping: 13, stiffness: 180 },
  });
  const badgeScale = frame >= 105 ? interpolate(badgeSpring, [0, 1], [0, 1.0]) : 0;
  const badgeOpacity = frame >= 105
    ? interpolate(frame - 105, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 7. Frame 125-210: Idle Breathing & Soft Aura Ring
  const idleBreathCycle = frame >= 125 ? ((frame - 125) % 40) / 40 : 0;
  const badgeBreathOpacity = frame >= 125 ? 0.85 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.15 : 1.0;

  const auraBreathCycle = frame >= 125 ? ((frame - 125) % 60) / 60 : 0;
  const auraOpacity = frame >= 125 ? Math.sin(auraBreathCycle * Math.PI * 2) * 0.35 : 0;

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
          <filter id="e2eCardGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="e2eLockGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation={lockGlowBlur} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="e2eRingGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (1120px x 560px centered) */}
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
          padding: '32px 48px',
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
            rx="24"
            fill="rgba(10, 31, 36, 0.4)"
          />

          {/* Background Technical Grid Lines */}
          <line x1="48" y1="84" x2={cardW - 48} y2="84" stroke="#164E56" strokeWidth="1" opacity="0.35" />
          <line x1="48" y1={cardH - 100} x2={cardW - 48} y2={cardH - 100} stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Style Accents */}
          <path d="M 12 40 V 12 H 40" fill="none" stroke={lockColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} 12 H ${cardW - 12} V 40`} fill="none" stroke={lockColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 12 ${cardH - 40} V ${cardH - 12} H 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} ${cardH - 12} H ${cardW - 12} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Outer Border Draw-In */}
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
            strokeDashoffset={borderDashOffset}
            opacity={0.85}
            filter="url(#e2eCardGlow)"
          />
        </svg>

        {/* HEADER ROW: Small Lock Icon + Title + Privacy Control Badge + Toggle Switch */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Left: Small Lock Icon + Title + Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={lockColor} strokeWidth="2.5" strokeLinecap="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.5px',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
              }}
            >
              End-to-End Encryption
            </span>
            <div
              style={{
                border: `1.5px solid ${accentColor}`,
                borderRadius: '16px',
                padding: '3px 12px',
                fontSize: '13px',
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '1px',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                textTransform: 'uppercase',
              }}
            >
              PRIVACY CONTROL
            </div>
          </div>

          {/* Right: Toggle Switch (Interactive UI Look) */}
          <div
            style={{
              position: 'relative',
              width: '76px',
              height: '40px',
              borderRadius: '20px',
              backgroundColor: toggleBgColor,
              border: `2px solid ${toggleBorderColor}`,
              boxSizing: 'border-box',
              padding: '3px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: isLocked ? `0 0 16px ${accentColor}` : 'none',
            }}
          >
            {/* Toggle Knob Circle */}
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                transform: `translateX(${knobX}px) scaleX(${knobScaleX})`,
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.4), 0 0 10px #FFFFFF',
              }}
            />
          </div>
        </div>

        {/* MIDDLE SECTION: HERO PADLOCK & ACTIVE BADGE DIRECTLY BELOW IT */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          {/* PADLOCK SVG WITH MATHEMATICALLY CENTERED RINGS */}
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '160px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* 100% MATHEMATICALLY CENTERED SVG CANVAS */}
            <svg
              width="180"
              height="160"
              viewBox="-40 -40 184 194"
              fill="none"
              style={{ filter: 'url(#e2eLockGlow)' }}
            >
              {/* Expanding Climax Shield Ring (Centered at Padlock Body Center cx=52, cy=77) */}
              {expRingOpacity > 0 && (
                <circle
                  cx="52"
                  cy="77"
                  r={64 * expRingScale}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                  opacity={expRingOpacity}
                  filter="url(#e2eRingGlow)"
                />
              )}

              {/* Idle Breathing Aura Ring (Centered at Padlock Body Center cx=52, cy=77) */}
              {auraOpacity > 0 && (
                <circle
                  cx="52"
                  cy="77"
                  r="68"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2.5"
                  opacity={auraOpacity}
                  filter="url(#e2eRingGlow)"
                />
              )}

              {/* Flash Burst Overlay Circle at Snap Moment */}
              {flashOpacity > 0 && (
                <circle
                  cx="52"
                  cy="77"
                  r="56"
                  fill="#FFFFFF"
                  opacity={flashOpacity}
                  filter="url(#e2eLockGlow)"
                />
              )}

              {/* Padlock Body Box (Center is x=52, y=77) */}
              <rect
                x="12"
                y="46"
                width="80"
                height="62"
                rx="14"
                fill="rgba(15, 23, 42, 0.95)"
                stroke={lockColor}
                strokeWidth="4.5"
                style={{ filter: `drop-shadow(0 0 12px ${lockColor})` }}
              />

              {/* Padlock Keyhole Dot & Bar */}
              <circle cx="52" cy="73" r="5" fill={lockColor} />
              <line x1="52" y1="78" x2="52" y2="89" stroke={lockColor} strokeWidth="4" strokeLinecap="round" />

              {/* Padlock Moving Shackle (Top Arch) */}
              <g
                style={{
                  transform: `translateY(${shackleY}px) rotate(${shackleAngle}deg)`,
                  transformOrigin: '28px 46px',
                }}
              >
                <path
                  d="M 28 46 V 26 C 28 13 38 4 52 4 C 66 4 76 13 76 26 V 46"
                  fill="none"
                  stroke={isLocked ? '#FFFFFF' : lockColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>

          {/* MICRO-BADGE "ACTIVE" POSITIONED DIRECTLY BELOW THE PADLOCK (100% PERFECT SYMMETRY & ZERO OVERLAP!) */}
          <div
            style={{
              height: '32px', // reserve height to prevent layout shift
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {badgeOpacity > 0 && (
              <div
                style={{
                  transform: `scale(${badgeScale})`,
                  opacity: badgeOpacity * badgeBreathOpacity,
                  backgroundColor: 'rgba(74, 222, 128, 0.2)',
                  border: '2px solid #4ADE80',
                  borderRadius: '20px',
                  padding: '5px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 18px rgba(74, 222, 128, 0.5)',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4ADE80',
                    boxShadow: '0 0 8px #4ADE80',
                  }}
                />
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: '#4ADE80',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Active
                </span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION: SUB-COPY EXPLANATION BANNER */}
        <div
          style={{
            transform: `translateY(${subTextSlideY}px)`,
            opacity: subTextOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '14px 28px',
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 600,
              color: '#FFFFFF',
              opacity: 0.9,
              textAlign: 'center',
              letterSpacing: '0.3px',
            }}
          >
            Only you and the recipient can read this conversation
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
