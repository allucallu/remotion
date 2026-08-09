import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact scan result card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface AntivirusScanResultCardProps {
  filesScanned?: number;
  threatsFound?: number;
  scanDuration?: string;
  accentColor?: string;
}

export const AntivirusScanResultCard: React.FC<AntivirusScanResultCardProps> = ({
  filesScanned = 1204,
  threatsFound = 0,
  scanDuration = '2m 14s',
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 1180;
  const cardH = 680;
  const cardX = centerX - cardW / 2; // 1330
  const cardY = centerY - cardH / 2; // 700

  const isSafe = threatsFound === 0;
  const mainStatusColor = isSafe ? '#4ADE80' : '#FBBF24'; // Emerald green vs Warning yellow-orange

  // 1. Frame 0-20: Card Border Draw-In
  const perimeter = 2 * (cardW + cardH); // 3720px
  const borderDrawProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const borderDashOffset = perimeter * (1 - borderDrawProgress);
  const cardOpacity = interpolate(frame, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' });

  // Header & Top HUD Bar Fade (Frame 10+)
  const topHudOpacity = frame >= 10
    ? interpolate(frame - 10, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 2. Frame 20-60: Ring Draw-In & Shield Icon Entrance
  const ringDrawProgress = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const shieldSpring = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 14, stiffness: 180 },
  });
  const shieldScale = frame >= 35 ? interpolate(shieldSpring, [0, 1], [0, 1.0]) : 0;

  // 3. Frame 65-75: Confirmation Sweep / Spark Burst
  const isSettlePhase = frame >= 65 && frame <= 75;
  const settleFlashOpacity = isSettlePhase
    ? interpolate(frame, [65, 68, 75], [0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

  const sparkProgress = frame >= 65
    ? interpolate(frame - 65, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;
  const sparkOpacity = frame >= 65
    ? interpolate(frame - 65, [0, 5, 15], [0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Frame 80-130: Big Threats Found Number Counting Down & Pulse
  const startThreatCount = isSafe ? 47 : threatsFound + 25;
  const countProgress = frame >= 80
    ? interpolate(frame - 80, [0, 45], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;

  const displayedThreats = frame >= 80
    ? Math.round(startThreatCount - countProgress * (startThreatCount - threatsFound))
    : startThreatCount;

  // Scale pulse on final zero (Frame 125-135)
  const threatPulseScale = frame >= 125 && frame <= 135
    ? interpolate(frame - 125, [0, 5, 10], [1.0, 1.15, 1.0], { extrapolateRight: 'clamp' })
    : 1.0;

  // 5. Frame 130-140: "Threats Found" Label Slide & Fade
  const threatLabelSlideY = frame >= 130
    ? interpolate(frame - 130, [0, 10], [6, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 6;
  const threatLabelOpacity = frame >= 130
    ? interpolate(frame - 130, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 6. Frame 150-165: Divider Draw Line
  const dividerScaleX = frame >= 150
    ? interpolate(frame - 150, [0, 15], [0, 1.0], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;

  // 7. Frame 155-200: Bottom Statistics & Engine Badges Entrance
  const filesCountProgress = frame >= 155
    ? interpolate(frame - 155, [0, 35], [0, 1], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 0;
  const displayedFilesScanned = frame >= 155 ? Math.round(filesCountProgress * filesScanned) : 0;
  const filesColOpacity = frame >= 155
    ? interpolate(frame - 155, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // Registry count animation
  const displayedRegistryCount = frame >= 165
    ? Math.round(interpolate(frame - 165, [0, 30], [0, 48150], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      }))
    : 0;

  const durationColOpacity = frame >= 170
    ? interpolate(frame - 170, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // Bottom protection badges slide-up (Frame 185+)
  const protectionBadgesOpacity = frame >= 185
    ? interpolate(frame - 185, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;
  const protectionBadgesSlideY = frame >= 185
    ? interpolate(frame - 185, [0, 15], [10, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: 'clamp',
      })
    : 10;

  // 8. Frame 200-240: Idle Breathing on Shield Ring
  const idleBreathCycle = frame >= 200 ? ((frame - 200) % 45) / 45 : 0;
  const ringBreathOpacity = frame >= 200 ? 0.5 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.3 : 0.6;

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
          <filter id="avCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="avHeroShieldGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="avRingSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* COMPACT CARD CONTAINER (1180px x 680px centered) */}
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
          opacity: cardOpacity,
        }}
      >
        {/* SVG Card Border & Background */}
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

          {/* Background technical grid lines */}
          <line x1="40" y1="80" x2={cardW - 40} y2="80" stroke="#164E56" strokeWidth="1" opacity="0.35" />
          <line x1="40" y1={cardH - 120} x2={cardW - 40} y2={cardH - 120} stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Style Accents */}
          <path d="M 12 40 V 12 H 40" fill="none" stroke={mainStatusColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} 12 H ${cardW - 12} V 40`} fill="none" stroke={mainStatusColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 12 ${cardH - 40} V ${cardH - 12} H 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} ${cardH - 12} H ${cardW - 12} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Glowing Outer Card Border */}
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
            filter="url(#avCardGlow)"
          />
        </svg>

        {/* SUPPORTING ELEMENT 1: TOP HEADER HUD BAR (Scan Mode & Database Version) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            opacity: topHudOpacity,
            zIndex: 10,
          }}
        >
          {/* Scan Mode Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', opacity: 0.9, letterSpacing: '0.5px' }}>
              Full System Deep Scan
            </span>
          </div>

          {/* Database Version Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: mainStatusColor,
                boxShadow: `0 0 8px ${mainStatusColor}`,
              }}
            />
            <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace', color: accentColor, letterSpacing: '1px' }}>
              VIRUS DB: 2026.08.09 (UP TO DATE)
            </span>
          </div>
        </div>

        {/* TOP HERO SECTION: SHIELD ICON & DECORATIVE RING */}
        <div
          style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '4px',
            zIndex: 10,
          }}
        >
          {/* Ring Draw-In & Idle Breathing Circle */}
          <svg
            width="150"
            height="150"
            viewBox="0 0 150 150"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Outer Subtle Tech Ring */}
            <circle
              cx="75"
              cy="75"
              r="69"
              fill="none"
              stroke={mainStatusColor}
              strokeWidth="2"
              strokeDasharray={434}
              strokeDashoffset={434 * (1 - ringDrawProgress)}
              opacity={ringBreathOpacity}
              filter="url(#avRingSoftGlow)"
            />

            {/* Confirmation Flash Overlay Ring (Frame 65-75) */}
            {settleFlashOpacity > 0 && (
              <circle
                cx="75"
                cy="75"
                r="69"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4"
                opacity={settleFlashOpacity}
                filter="url(#avHeroShieldGlow)"
              />
            )}

            {/* Burst Sparks (Frame 65+) */}
            {sparkOpacity > 0 &&
              Array.from({ length: 6 }).map((_, sIdx) => {
                const angleRad = (Math.PI / 3) * sIdx;
                const rStart = 60;
                const rEnd = 88;
                const rCurrent = rStart + sparkProgress * (rEnd - rStart);
                const x = 75 + rCurrent * Math.cos(angleRad);
                const y = 75 + rCurrent * Math.sin(angleRad);

                return (
                  <circle
                    key={`spark-${sIdx}`}
                    cx={x}
                    cy={y}
                    r={3.5 * (1 - sparkProgress)}
                    fill="#FFFFFF"
                    opacity={sparkOpacity}
                  />
                );
              })}
          </svg>

          {/* MAIN HERO SHIELD ICON */}
          <div
            style={{
              transform: `scale(${shieldScale})`,
              transformOrigin: 'center center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 72 72"
              style={{ filter: 'url(#avHeroShieldGlow)' }}
            >
              {/* Outer White Contour Line for Extra Contrast */}
              <path
                d="M 36 6 L 62 15 V 36 C 62 53 36 66 36 66 C 36 66 10 53 10 36 V 15 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="4.5"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* Main Shield Fill & Colored Outline */}
              <path
                d="M 36 8 L 60 16 V 36 C 60 52 36 64 36 64 C 36 64 12 52 12 36 V 16 Z"
                fill="rgba(15, 23, 42, 0.95)"
                stroke={mainStatusColor}
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Inside Icon: Checkmark if Safe, Exclamation Mark if Threat */}
              {isSafe ? (
                <path
                  d="M 26 36 L 33 43 L 47 27"
                  fill="none"
                  stroke={mainStatusColor}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <g>
                  <line
                    x1="36" y1="24" x2="36" y2="40"
                    stroke={mainStatusColor} strokeWidth="5" strokeLinecap="round"
                  />
                  <circle
                    cx="36" cy="48" r="3"
                    fill={mainStatusColor}
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* MIDDLE SECTION: BIG THREATS FOUND COUNT & SUB-LABEL */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Big Threat Count Number */}
          <span
            style={{
              fontSize: '88px',
              fontWeight: 800,
              color: mainStatusColor,
              fontFamily: 'monospace',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-1px',
              lineHeight: 1,
              transform: `scale(${threatPulseScale})`,
              textShadow: `0 0 24px ${mainStatusColor}`,
            }}
          >
            {displayedThreats}
          </span>

          {/* Sub-label "Threats Found" */}
          <span
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#FFFFFF',
              opacity: threatLabelOpacity * 0.7,
              transform: `translateY(${threatLabelSlideY}px)`,
              marginTop: '6px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Threats Found
          </span>
        </div>

        {/* DIVIDER LINE (Frame 150+) */}
        <div
          style={{
            width: '100%',
            height: '1.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            transform: `scaleX(${dividerScaleX})`,
            transformOrigin: 'center center',
            margin: '4px 0',
            zIndex: 10,
          }}
        />

        {/* SUPPORTING ELEMENT 2: 3 STATISTICAL COLUMNS (Files Scanned, Registry & Memory, Scan Duration) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            zIndex: 10,
          }}
        >
          {/* Column 1: Files Scanned */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: filesColOpacity,
            }}
          >
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                opacity: 0.65,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Files Scanned
            </span>
            <span
              style={{
                fontSize: '34px',
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
              }}
            >
              {displayedFilesScanned.toLocaleString()}
            </span>
          </div>

          {/* Vertical Separator 1 */}
          <div
            style={{
              width: '1px',
              height: '38px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              opacity: durationColOpacity,
            }}
          />

          {/* Column 2: Registry & Memory Items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: filesColOpacity,
            }}
          >
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                opacity: 0.65,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Registry & Memory
            </span>
            <span
              style={{
                fontSize: '34px',
                fontWeight: 700,
                color: accentColor,
                fontFamily: 'monospace',
                fontVariantNumeric: 'tabular-nums',
                textShadow: `0 0 12px ${accentColor}`,
              }}
            >
              {displayedRegistryCount.toLocaleString()} Clean
            </span>
          </div>

          {/* Vertical Separator 2 */}
          <div
            style={{
              width: '1px',
              height: '38px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              opacity: durationColOpacity,
            }}
          />

          {/* Column 3: Scan Duration */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: durationColOpacity,
            }}
          >
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#FFFFFF',
                opacity: 0.65,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Duration
            </span>
            <span
              style={{
                fontSize: '34px',
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: 'monospace',
                textShadow: '0 0 12px rgba(255, 255, 255, 0.4)',
              }}
            >
              {scanDuration}
            </span>
          </div>
        </div>

        {/* SUPPORTING ELEMENT 3: BOTTOM REAL-TIME PROTECTION ENGINE BADGES (Frame 185+) */}
        <div
          style={{
            transform: `translateY(${protectionBadgesSlideY}px)`,
            opacity: protectionBadgesOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '14px',
            padding: '12px 24px',
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          {/* Badge 1: Real-time Shield */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', opacity: 0.85 }}>
              Real-time Protection: <span style={{ color: '#4ADE80', fontWeight: 800 }}>ACTIVE</span>
            </span>
          </div>

          {/* Badge 2: Ransomware Shield */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', opacity: 0.85 }}>
              Ransomware Shield: <span style={{ color: '#4ADE80', fontWeight: 800 }}>SECURED</span>
            </span>
          </div>

          {/* Badge 3: AI Engine */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, color: accentColor, letterSpacing: '0.5px' }}>
              HEURISTIC AI PASSED
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
