import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact session timeout card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.

  DEVELOPER NOTE ON COUNTDOWN TIMING:
  In this 10-second (300-frame) stock footage asset, the countdown from startSeconds (default 30s) down to 2s
  is accelerated across ~260 frames to create a dynamic time-lapse effect suitable for promotional video overlays.
  To run at true 1:1 real-time speed, multiply durationInFrames by (startSeconds / 10).
*/

export interface SessionTimeoutCountdownCardProps {
  startSeconds?: number;
  warningThreshold?: number;
  accentColor?: string;
}

export const SessionTimeoutCountdownCard: React.FC<SessionTimeoutCountdownCardProps> = ({
  startSeconds = 30,
  warningThreshold = 10,
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 780;
  const cardH = 780;
  const cardX = centerX - cardW / 2; // 1530
  const cardY = centerY - cardH / 2; // 690

  // 1. Frame 0-20: Card Entrance (fade + scale + border draw)
  const perimeter = 2 * (cardW + cardH); // 3120px
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);

  const cardSpring = spring({ frame, fps, config: { damping: 18, stiffness: 220 } });
  const cardScale = interpolate(cardSpring, [0, 1], [0.95, 1.0]);
  const cardOpacity = interpolate(frame, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' });

  // 2. Frame 0-20: Progress Ring Entrance (draw full 100% circle)
  const ringRadius = 180;
  const ringCircumference = 2 * Math.PI * ringRadius; // ~1130.97px
  const initialRingDraw = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // 3. Frame 20-280: Accelerated Countdown (30s down to 2s)
  const countdownStartFrame = 20;
  const countdownEndFrame = 280;

  // Fraction of time remaining (1.0 -> 0.05)
  const ringFillFraction = frame >= countdownStartFrame
    ? interpolate(frame, [countdownStartFrame, countdownEndFrame], [1.0, 0.05], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1.0;

  // Actual ring strokeDashoffset calculation
  const ringDashOffset = frame < countdownStartFrame
    ? ringCircumference * (1 - initialRingDraw)
    : ringCircumference * (1 - ringFillFraction);

  // Simulated remaining seconds integer (30 down to 2)
  const rawSecondsRemaining = frame >= countdownStartFrame
    ? Math.max(2, Math.round(interpolate(frame, [countdownStartFrame, countdownEndFrame], [startSeconds, 2])))
    : startSeconds;

  const isWarningState = rawSecondsRemaining <= warningThreshold;

  // 4. Smooth Color Transition from Normal Accent to Warning Orange (#FBBF24)
  // Transition occurs smoothly over 20 frames around the threshold
  const warningTransitionProgress = isWarningState
    ? interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const currentRingColor = interpolateColors(warningTransitionProgress, [0, 1], [accentColor, '#FBBF24']);
  const currentTextColor = interpolateColors(warningTransitionProgress, [0, 1], ['#FFFFFF', '#FBBF24']);
  const ringGlowBlur = interpolate(warningTransitionProgress, [0, 1], [4, 8]);

  // Format seconds into MM:SS (e.g. 00:30, 00:09)
  const formattedMinutes = String(Math.floor(rawSecondsRemaining / 60)).padStart(2, '0');
  const formattedSecs = String(rawSecondsRemaining % 60).padStart(2, '0');
  const timeDisplayString = `${formattedMinutes}:${formattedSecs}`;

  // Micro-scale pulse per simulated second tick
  const tickPhase = ((frame - countdownStartFrame) % 8.66) / 8.66; // tick cycle
  const tickPulseScale = isWarningState
    ? 1.0 + Math.sin(tickPhase * Math.PI) * 0.10 // stronger pulse in warning
    : 1.0 + Math.sin(tickPhase * Math.PI) * 0.05;

  // Background ring track blinking in warning phase
  const trackBlinkCycle = isWarningState ? ((frame - 180) % 20) / 20 : 0;
  const trackOpacity = isWarningState
    ? 0.15 + Math.sin(trackBlinkCycle * Math.PI * 2) * 0.15
    : 0.15;

  // 5. Button Entrance & Urgency Pulse
  const btnSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 14, stiffness: 200 } });
  const btnScale = frame >= 20 ? interpolate(btnSpring, [0, 1], [0.9, 1.0]) : 0;
  const btnOpacity = interpolate(frame, [20, 35], [0, 1.0], { extrapolateRight: 'clamp' });

  // Button idle pulse (50f cycle normal -> 25f cycle warning)
  const btnPulseCycle = isWarningState ? ((frame - 180) % 25) / 25 : (frame % 50) / 50;
  const btnPulseScale = 1.0 + Math.sin(btnPulseCycle * Math.PI * 2) * (isWarningState ? 0.035 : 0.02);

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
          <filter id="timeoutCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="timeoutRingGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={ringGlowBlur} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (780px x 780px square centered) */}
      <div
        style={{
          position: 'absolute',
          left: `${cardX}px`,
          top: `${cardY}px`,
          width: `${cardW}px`,
          height: `${cardH}px`,
          borderRadius: '28px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '36px 44px',
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
            rx="28"
            fill="rgba(10, 31, 36, 0.4)"
          />

          {/* Background Technical Grid Lines */}
          <line x1="44" y1="84" x2={cardW - 44} y2="84" stroke="#164E56" strokeWidth="1" opacity="0.35" />
          <line x1="44" y1={cardH - 110} x2={cardW - 44} y2={cardH - 110} stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Style Accents */}
          <path d="M 14 44 V 14 H 44" fill="none" stroke={currentRingColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 44} 14 H ${cardW - 14} V 44`} fill="none" stroke={currentRingColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 14 ${cardH - 44} V ${cardH - 14} H 44`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 44} ${cardH - 14} H ${cardW - 14} V ${cardH - 44}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Glowing Outer Card Border */}
          <rect
            x="2"
            y="2"
            width={cardW - 4}
            height={cardH - 4}
            rx="26"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeDasharray={perimeter}
            strokeDashoffset={borderDashOffset}
            opacity={0.85}
            filter="url(#timeoutCardGlow)"
          />
        </svg>

        {/* TOP HEADER ROW: TITLE & WARNING BADGE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Title with Clock Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentRingColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.5px',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
              }}
            >
              Session Timeout
            </span>
          </div>

          {/* Status Badge */}
          <div
            style={{
              border: `1.5px solid ${currentRingColor}`,
              borderRadius: '16px',
              padding: '4px 14px',
              fontSize: '13px',
              fontWeight: 800,
              color: currentRingColor,
              letterSpacing: '1px',
              backgroundColor: isWarningState ? 'rgba(251, 191, 36, 0.12)' : 'rgba(34, 211, 238, 0.1)',
              textTransform: 'uppercase',
              boxShadow: isWarningState ? '0 0 12px rgba(251, 191, 36, 0.3)' : 'none',
            }}
          >
            {isWarningState ? 'AUTO LOGOUT SOON' : 'INACTIVITY NOTICE'}
          </div>
        </div>

        {/* CENTER SECTION: CIRCULAR PROGRESS TIMER RING & COUNTDOWN NUMBER */}
        <div
          style={{
            position: 'relative',
            width: '420px',
            height: '420px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* 100% MATHEMATICALLY CENTERED PROGRESS RING SVG */}
          <svg
            width="420"
            height="420"
            viewBox="0 0 420 420"
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            {/* Background Circle Track */}
            <circle
              cx="210"
              cy="210"
              r={ringRadius}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="12"
              opacity={trackOpacity}
            />

            {/* Main Progress Ring Fill */}
            <circle
              cx="210"
              cy="210"
              r={ringRadius}
              fill="none"
              stroke={currentRingColor}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringDashOffset}
              filter="url(#timeoutRingGlow)"
            />
          </svg>

          {/* COUNTDOWN NUMBER & SUB-TEXT AT CENTER OF RING */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 15,
            }}
          >
            {/* MM:SS Countdown Display */}
            <span
              style={{
                fontSize: '84px',
                fontWeight: 800,
                color: currentTextColor,
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-2px',
                lineHeight: 1,
                transform: `scale(${tickPulseScale})`,
                textShadow: `0 0 24px ${currentRingColor}`,
              }}
            >
              {timeDisplayString}
            </span>

            {/* Sub-label inside ring */}
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#FFFFFF',
                opacity: 0.75,
                marginTop: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              Remaining Time
            </span>
          </div>
        </div>

        {/* SUB-TITLE EXPLANATION TEXT */}
        <span
          style={{
            fontSize: '20px',
            fontWeight: 500,
            color: '#FFFFFF',
            opacity: 0.8,
            textAlign: 'center',
            zIndex: 10,
            marginTop: '-10px',
          }}
        >
          Your inactive session will close to protect your account.
        </span>

        {/* BOTTOM SECTION: FULL-WIDTH "STAY LOGGED IN" BUTTON */}
        <div
          style={{
            width: '100%',
            transform: `scale(${btnScale * btnPulseScale})`,
            opacity: btnOpacity,
            border: `2.5px solid ${currentRingColor}`,
            borderRadius: '18px',
            padding: '16px 0',
            backgroundColor: isWarningState ? 'rgba(251, 191, 36, 0.22)' : 'rgba(34, 211, 238, 0.22)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: `0 0 20px ${currentRingColor}`,
            zIndex: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={currentRingColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.5px',
            }}
          >
            Stay Logged In
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
