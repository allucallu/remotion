import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the permission card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface DataAccessPermissionCardProps {
  appName?: string;
  dataCategory?: 'contacts' | 'location' | 'photos' | 'microphone';
  accentColor?: string;
}

const CATEGORY_SUBTEXTS: Record<string, string> = {
  contacts: 'This lets the app find friends who are already using it.',
  location: 'This lets the app provide location-based features and tags.',
  photos: 'This lets the app select and edit photos from your library.',
  microphone: 'This lets the app record audio for voice notes and video.',
};

export const DataAccessPermissionCard: React.FC<DataAccessPermissionCardProps> = ({
  appName = 'PhotoEditor Pro',
  dataCategory = 'contacts',
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 880;
  const cardH = 540;
  const cardX = centerX - cardW / 2; // 1480
  const cardY = centerY - cardH / 2; // 810

  // 1. Frame 0-25: Card Pop-Up Entrance & Border Draw
  const perimeter = 2 * (cardW + cardH); // 2840px
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);

  // OS Pop-up Dialog Spring Entrance (0.85 -> 1.05 -> 1.0)
  const dialogSpring = spring({ frame, fps, config: { damping: 14, stiffness: 220 } });
  const entranceScale = interpolate(dialogSpring, [0, 1], [0.85, 1.0]);

  // Frame 165-180: Dialog Dismissal Fade-Out & Scale-Down
  let cardOpacity = interpolate(frame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' });
  let cardScale = entranceScale;

  if (frame >= 165) {
    const fadeOutProgress = interpolate(frame, [165, 180], [0, 1], { extrapolateRight: 'clamp' });
    cardOpacity = 1.0 - fadeOutProgress;
    cardScale = interpolate(fadeOutProgress, [0, 1], [1.0, 0.95]);
  }

  // 2. Frame 25-45: Data Category Icon Entrance
  const iconSpring = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 14, stiffness: 180 } });
  const iconScale = frame >= 25 ? interpolate(iconSpring, [0, 1], [0.7, 1.0]) : 0;
  const iconOpacity = frame >= 25
    ? interpolate(frame - 25, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 3. Frame 50-70: Request Title Text Slide-Up & Fade
  const titleSlideY = frame >= 50
    ? interpolate(frame - 50, [0, 20], [6, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 6;
  const titleOpacity = frame >= 50
    ? interpolate(frame - 50, [0, 20], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Frame 75-90: Sub-text Explanation Fade-In
  const subTextOpacity = frame >= 75
    ? interpolate(frame - 75, [0, 15], [0, 0.65], { extrapolateRight: 'clamp' })
    : 0;

  // 5. Frame 100-120: Staggered Buttons Entrance
  const btn1Spring = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 14, stiffness: 200 } });
  const btn1Scale = frame >= 100 ? interpolate(btn1Spring, [0, 1], [0.9, 1.0]) : 0;
  const btn1Opacity = frame >= 100
    ? interpolate(frame - 100, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  const btn2Spring = spring({ frame: Math.max(0, frame - 110), fps, config: { damping: 14, stiffness: 200 } });
  const btn2ScaleBase = frame >= 110 ? interpolate(btn2Spring, [0, 1], [0.9, 1.0]) : 0;
  const btn2Opacity = frame >= 110
    ? interpolate(frame - 110, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 6. Frame 150-165: "Allow" Click Simulation Squeeze & Flash
  const isClickPhase = frame >= 150 && frame <= 165;
  const clickSqueeze = isClickPhase
    ? interpolate(frame - 150, [0, 4, 8], [1.0, 0.95, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;
  const btn2Scale = btn2ScaleBase * clickSqueeze;

  const clickFlashOpacity = isClickPhase
    ? interpolate(frame - 150, [0, 3, 6], [0, 0.9, 0], { extrapolateRight: 'clamp' })
    : 0;

  // Formatting capitalized category name
  const formattedCategory = dataCategory.charAt(0).toUpperCase() + dataCategory.slice(1);
  const subTextContent = CATEGORY_SUBTEXTS[dataCategory] || CATEGORY_SUBTEXTS.contacts;

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
          <filter id="permCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="permIconGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (880px x 540px centered) */}
      {cardOpacity > 0 && (
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
              rx="26"
              fill="rgba(10, 31, 36, 0.4)"
            />

            {/* Background Technical Grid Lines */}
            <line x1="44" y1="84" x2={cardW - 44} y2="84" stroke="#164E56" strokeWidth="1" opacity="0.35" />

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
              filter="url(#permCardGlow)"
            />
          </svg>

          {/* HEADER SECTION: DATA CATEGORY ICON (~90px) */}
          <div
            style={{
              transform: `scale(${iconScale})`,
              opacity: iconOpacity,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '90px',
              height: '90px',
              borderRadius: '24px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: `2px solid ${accentColor}`,
              boxShadow: `0 0 16px ${accentColor}`,
              filter: 'url(#permIconGlow)',
              marginTop: '4px',
              zIndex: 10,
            }}
          >
            {dataCategory === 'contacts' && (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke={accentColor} />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={accentColor} />
              </svg>
            )}

            {dataCategory === 'location' && (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" stroke={accentColor} strokeWidth="2.5" />
              </svg>
            )}

            {dataCategory === 'photos' && (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" fill={accentColor} stroke={accentColor} />
                <polyline points="21 15 16 10 5 21" stroke={accentColor} />
              </svg>
            )}

            {dataCategory === 'microphone' && (
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke={accentColor} />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            )}
          </div>

          {/* MIDDLE SECTION: REQUEST TITLE & SUB-TEXT EXPLANATION */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',
              width: '100%',
              zIndex: 10,
            }}
          >
            {/* Main Request Title */}
            <span
              style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.4px',
                transform: `translateY(${titleSlideY}px)`,
                opacity: titleOpacity,
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
              }}
            >
              “{appName}” wants to access your {formattedCategory}
            </span>

            {/* Sub-text Explanation */}
            <span
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: '#FFFFFF',
                opacity: subTextOpacity,
                maxWidth: '680px',
                lineHeight: 1.4,
              }}
            >
              {subTextContent}
            </span>
          </div>

          {/* BOTTOM SECTION: 2 EQUAL HORIZONTAL BUTTONS ("Don't Allow" & "Allow") */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              width: '100%',
              zIndex: 10,
            }}
          >
            {/* Button 1: "Don't Allow" (Neutral Outline) */}
            <div
              style={{
                flex: 1,
                transform: `scale(${btn1Scale})`,
                opacity: btn1Opacity,
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                padding: '14px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#FFFFFF', opacity: 0.85 }}>
                Don't Allow
              </span>
            </div>

            {/* Button 2: "Allow" (Solid Accent Primary) */}
            <div
              style={{
                flex: 1,
                position: 'relative',
                transform: `scale(${btn2Scale})`,
                opacity: btn2Opacity,
                border: `2px solid ${accentColor}`,
                borderRadius: '16px',
                padding: '14px 0',
                backgroundColor: 'rgba(34, 211, 238, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 20px ${accentColor}`,
                overflow: 'hidden',
              }}
            >
              {/* Click Flash Overlay */}
              {clickFlashOpacity > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundColor: '#FFFFFF',
                    opacity: clickFlashOpacity,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF' }}>
                Allow
              </span>
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
