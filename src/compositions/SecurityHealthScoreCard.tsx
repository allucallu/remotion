import React from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact security score card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface SecurityHealthScoreCardProps {
  score?: number; // 0 to 100
  recommendationCount?: number;
  accentColor?: string;
}

const DEFAULT_RECOMMENDATIONS = [
  { icon: 'shield', title: 'Enable Two-Factor Authentication (2FA)', status: 'High Priority' },
  { icon: 'key', title: 'Update 3 outdated account passwords', status: 'Recommended' },
  { icon: 'apps', title: 'Review connected third-party app permissions', status: 'Optional' },
];

export const SecurityHealthScoreCard: React.FC<SecurityHealthScoreCardProps> = ({
  score = 92,
  recommendationCount = 3,
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 920;
  const cardH = 760;
  const cardX = centerX - cardW / 2; // 1460
  const cardY = centerY - cardH / 2; // 700

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

  // 2. Frame 20-50: Gauge Track (Dim Background Arc) Draw-In
  const ringRadius = 175;
  const arcLength = Math.PI * ringRadius; // ~549.78px (Semi-circle 180° to 0°)
  const trackDrawProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const trackDashOffset = arcLength * (1 - trackDrawProgress);

  // 3. Frame 50-140: Gauge Arc Fill & Score Counting (0 to score)
  const fillProgress = frame >= 50
    ? interpolate(frame - 50, [0, 90], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;

  const currentScoreVal = Math.round(fillProgress * score);
  const fillFraction = (currentScoreVal / 100);
  const fillDashOffset = arcLength * (1 - (fillProgress * (score / 100)));

  // Dynamic Color Interpolation based on current score value (0-40 Red, 40-70 Yellow, 70-100 Green)
  let currentColor = '#F87171'; // Red
  if (currentScoreVal < 40) {
    const t = currentScoreVal / 40;
    currentColor = interpolateColors(t, [0, 1], ['#F87171', '#FBBF24']);
  } else if (currentScoreVal < 70) {
    const t = (currentScoreVal - 40) / 30;
    currentColor = interpolateColors(t, [0, 1], ['#FBBF24', '#4ADE80']);
  } else {
    const t = (currentScoreVal - 70) / 30;
    currentColor = interpolateColors(t, [0, 1], ['#4ADE80', accentColor]);
  }

  // Leading edge dot angle and coordinates (from 180° = Math.PI down to 0° = 0)
  const currentAngleRad = Math.PI - fillFraction * Math.PI;
  const gaugeCenterX = 210;
  const gaugeCenterY = 220;
  const dotX = gaugeCenterX + ringRadius * Math.cos(currentAngleRad);
  const dotY = gaugeCenterY - ringRadius * Math.sin(currentAngleRad);

  // 4. Frame 140-155: Completion Climax Pulse & Sub-label Entrance
  const dotPulseScale = frame >= 140 && frame <= 155
    ? interpolate(frame - 140, [0, 6, 12], [1.0, 1.5, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  const scoreSettlePulse = frame >= 140 && frame <= 155
    ? interpolate(frame - 140, [0, 6, 12], [1.0, 1.08, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  const labelSlideY = frame >= 140
    ? interpolate(frame - 140, [0, 12], [6, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 6;
  const labelOpacity = frame >= 140
    ? interpolate(frame - 140, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 5. Frame 155-165: Divider Draw Line
  const dividerScaleX = frame >= 155
    ? interpolate(frame - 155, [0, 10], [0, 1.0], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;

  // 6. Frame 165-230: Staggered Recommendations Entrance
  const activeRecommendations = DEFAULT_RECOMMENDATIONS.slice(0, recommendationCount);

  // 7. Frame 230-240: Idle Breathing on Leading Edge Dot
  const idleBreathCycle = frame >= 230 ? ((frame - 230) % 50) / 50 : 0;
  const dotBreathOpacity = frame >= 230 ? 0.75 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.25 : 1.0;

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
          <filter id="scoreCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="scoreGaugeGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (920px x 760px centered) */}
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
            rx="28"
            fill="rgba(10, 31, 36, 0.4)"
          />

          {/* Background Technical Grid Lines */}
          <line x1="44" y1="84" x2={cardW - 44} y2="84" stroke="#164E56" strokeWidth="1" opacity="0.35" />
          <line x1="44" y1={cardH - 240} x2={cardW - 44} y2={cardH - 240} stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Style Accents */}
          <path d="M 14 44 V 14 H 44" fill="none" stroke={currentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 44} 14 H ${cardW - 14} V 44`} fill="none" stroke={currentColor} strokeWidth="3" opacity="0.8" />
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
            filter="url(#scoreCardGlow)"
          />
        </svg>

        {/* HEADER ROW: TITLE & SYSTEM HEALTH BADGE */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={currentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
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
              Security Checkup
            </span>
          </div>

          {/* System Health Badge */}
          <div
            style={{
              border: `1.5px solid ${currentColor}`,
              borderRadius: '16px',
              padding: '4px 14px',
              fontSize: '13px',
              fontWeight: 800,
              color: currentColor,
              letterSpacing: '1px',
              backgroundColor: 'rgba(74, 222, 128, 0.1)',
              textTransform: 'uppercase',
              boxShadow: `0 0 12px ${currentColor}`,
            }}
          >
            {currentScoreVal >= 80 ? 'SYSTEM EXCELLENT' : currentScoreVal >= 50 ? 'ACTION RECOMMENDED' : 'CRITICAL RISK'}
          </div>
        </div>

        {/* TOP HERO GAUGE SECTION: SPEEDOMETER SEMI-CIRCLE ARC & BIG SCORE */}
        <div
          style={{
            position: 'relative',
            width: '420px',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            marginTop: '8px',
          }}
        >
          {/* MATHEMATICALLY EXACT SPEEDOMETER GAUGE SVG */}
          <svg
            width="420"
            height="240"
            viewBox="0 0 420 240"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Track Arc (Dim Background Semi-circle, 180° to 0°) */}
            <path
              d="M 35 220 A 175 175 0 0 1 385 220"
              fill="none"
              stroke="rgba(255, 255, 255, 0.16)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={trackDashOffset}
            />

            {/* Colored Fill Arc (0 to Score) */}
            {fillProgress > 0 && (
              <path
                d="M 35 220 A 175 175 0 0 1 385 220"
                fill="none"
                stroke={currentColor}
                strokeWidth="17"
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={fillDashOffset}
                filter="url(#scoreGaugeGlow)"
              />
            )}

            {/* Leading Edge Indicator Glowing Dot */}
            {fillProgress > 0 && (
              <g style={{ transform: `scale(${dotPulseScale})`, transformOrigin: `${dotX}px ${dotY}px` }}>
                <circle
                  cx={dotX}
                  cy={dotY}
                  r="10"
                  fill="#FFFFFF"
                  opacity={dotBreathOpacity}
                  filter="url(#scoreGaugeGlow)"
                />
                <circle
                  cx={dotX}
                  cy={dotY}
                  r="5"
                  fill={currentColor}
                />
              </g>
            )}
          </svg>

          {/* BIG SCORE NUMBER DISPLAY AT CENTER OF GAUGE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: '10px',
              transform: `scale(${scoreSettlePulse})`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span
                style={{
                  fontSize: '84px',
                  fontWeight: 800,
                  color: currentColor,
                  fontFamily: 'monospace',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  textShadow: `0 0 20px ${currentColor}`,
                }}
              >
                {currentScoreVal}
              </span>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  opacity: 0.65,
                }}
              >
                /100
              </span>
            </div>

            {/* Sub-label "Security Score" */}
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#FFFFFF',
                opacity: labelOpacity * 0.7,
                transform: `translateY(${labelSlideY}px)`,
                marginTop: '6px',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}
            >
              Security Score
            </span>
          </div>
        </div>

        {/* DIVIDER LINE (Frame 155+) */}
        <div
          style={{
            width: '100%',
            height: '1.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            transform: `scaleX(${dividerScaleX})`,
            transformOrigin: 'center center',
            margin: '12px 0',
            zIndex: 10,
          }}
        />

        {/* BOTTOM RECOMMENDATIONS LIST (Default 3 Items, Frame 165+) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            zIndex: 10,
          }}
        >
          {activeRecommendations.map((rec, rIdx) => {
            const itemStartFrame = 165 + rIdx * 20;

            const itemSlideX = frame >= itemStartFrame
              ? interpolate(frame - itemStartFrame, [0, 12], [-10, 0], {
                  easing: Easing.out(Easing.cubic),
                  extrapolateRight: 'clamp',
                })
              : -10;

            const itemOpacity = frame >= itemStartFrame
              ? interpolate(frame - itemStartFrame, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
              : 0;

            const iconPopScale = frame >= itemStartFrame
              ? interpolate(frame - itemStartFrame, [0, 6, 12], [0.8, 1.15, 1.0], { extrapolateRight: 'clamp' })
              : 0.8;

            return (
              <div
                key={`rec-item-${rIdx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1.5px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  transform: `translateX(${itemSlideX}px)`,
                  opacity: itemOpacity,
                  boxSizing: 'border-box',
                }}
              >
                {/* Left: Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      transform: `scale(${iconPopScale})`,
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(34, 211, 238, 0.15)',
                      border: `1.5px solid ${accentColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 10px ${accentColor}`,
                    }}
                  >
                    {rec.icon === 'shield' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    )}
                    {rec.icon === 'key' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="7.5" cy="15.5" r="4.5" />
                        <path d="M21 2l-9.6 9.6" />
                        <path d="M15.5 7.5l3 3" />
                      </svg>
                    )}
                    {rec.icon === 'apps' && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    )}
                  </div>

                  <span style={{ fontSize: '19px', fontWeight: 600, color: '#FFFFFF', opacity: 0.9 }}>
                    {rec.title}
                  </span>
                </div>

                {/* Right: Status Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: rIdx === 0 ? '#FBBF24' : accentColor,
                      letterSpacing: '0.5px',
                    }}
                  >
                    {rec.status}
                  </span>
                  <span style={{ color: accentColor, fontWeight: 800 }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
