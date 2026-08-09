import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the compact notification card is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface SecureFileTransferCardProps {
  fileName?: string;
  fileSize?: string;
  accentColor?: string;
}

export const SecureFileTransferCard: React.FC<SecureFileTransferCardProps> = ({
  fileName = 'financial_report.pdf',
  fileSize = '24.6 MB',
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const cardW = 1280;
  const cardH = 560;
  const cardX = centerX - cardW / 2;
  const cardY = centerY - cardH / 2;

  // 1. Frame 0-15: Card Outline Draw-In & Content Entrance
  const perimeter = 2 * (cardW + cardH);
  const cardDrawProgress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const cardDashOffset = perimeter * (1 - cardDrawProgress);

  const contentEntranceSlide = interpolate(frame, [0, 15], [-15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const contentEntranceOpacity = interpolate(frame, [0, 15], [0, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2. Frame 20-180: Non-Linear Realistic Transfer Progress
  let progressPercent = 0;
  if (frame >= 20 && frame < 70) {
    progressPercent = interpolate(frame, [20, 70], [0, 40], {
      easing: Easing.out(Easing.quad),
    });
  } else if (frame >= 70 && frame < 140) {
    progressPercent = interpolate(frame, [70, 140], [40, 75], {
      easing: Easing.inOut(Easing.quad),
    });
  } else if (frame >= 140 && frame <= 180) {
    progressPercent = interpolate(frame, [140, 180], [75, 100], {
      easing: Easing.inOut(Easing.cubic),
    });
  } else if (frame > 180) {
    progressPercent = 100;
  }

  const isCompleted = frame >= 180;
  const completedFrame = Math.max(0, frame - 180);

  // Dynamic transfer speed (simulated, oscillating)
  const currentSpeedMbps = frame >= 20 && !isCompleted
    ? (18.4 + Math.sin(frame * 0.15) * 4.2 + Math.cos(frame * 0.08) * 2.1).toFixed(1)
    : isCompleted ? '0.0' : '0.0';

  // Simulated bytes transferred
  const totalBytes = 24.6; // MB
  const transferredMB = (totalBytes * progressPercent / 100).toFixed(1);

  // 3. Progress Bar 100% Flash Burst (Frame 180-190)
  const barFlashOpacity = isCompleted
    ? interpolate(completedFrame, [0, 4, 10], [1.0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

  const percentTextOpacity = isCompleted
    ? interpolate(completedFrame, [0, 6], [1.0, 0], { extrapolateRight: 'clamp' })
    : 1.0;

  // 4. "Encrypted" Badge Spring Pop-In (Frame 180-195)
  const badgeSpring = spring({
    frame: completedFrame,
    fps,
    config: { damping: 13, stiffness: 170 },
  });
  const badgeScale = isCompleted ? interpolate(badgeSpring, [0, 1], [0, 1.0]) : 0;

  const lockRotateSnap = isCompleted
    ? interpolate(completedFrame, [0, 4, 8], [-25, 5, 0], { extrapolateRight: 'clamp' })
    : -25;

  // 5. File Icon Mini Lock Overlay (Frame 195-210)
  const iconLockScale = frame >= 195
    ? interpolate(frame - 195, [0, 10], [0, 1.0], {
        easing: Easing.out(Easing.back(1.5)),
        extrapolateRight: 'clamp',
      })
    : 0;

  // 6. Bottom metadata bar (Frame 10+)
  const metaBarOpacity = frame >= 10
    ? interpolate(frame - 10, [0, 12], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 7. Checksum hash reveal (Frame 185+)
  const checksumOpacity = frame >= 185
    ? interpolate(frame - 185, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 8. Final Idle Breathing on Encrypted Badge (Frame 210-240)
  const idleBreathCycle = frame >= 210 ? ((frame - 210) % 35) / 35 : 0;
  const badgeBreathScale = frame >= 210 ? 1.0 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.03 : 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* SVG Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="ftCardGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ftHeadGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* CARD CONTAINER (1280px x 560px centered) */}
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
          justifyContent: 'space-between',
          padding: '32px 44px',
        }}
      >
        {/* SVG Card Background & Border */}
        <svg
          width={cardW}
          height={cardH}
          viewBox={`0 0 ${cardW} ${cardH}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {/* Dark Fill */}
          <rect x="0" y="0" width={cardW} height={cardH} rx="24" fill="rgba(10, 31, 36, 0.4)" />

          {/* Background grid lines for technical feel */}
          <line x1="44" y1="100" x2={cardW - 44} y2="100" stroke="#164E56" strokeWidth="1" opacity="0.35" />
          <line x1="44" y1={cardH - 160} x2={cardW - 44} y2={cardH - 160} stroke="#164E56" strokeWidth="1" opacity="0.35" />

          {/* Corner Bracket Accents */}
          <path d="M 12 40 V 12 H 40" fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} 12 H ${cardW - 12} V 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M 12 ${cardH - 40} V ${cardH - 12} H 40`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />
          <path d={`M ${cardW - 40} ${cardH - 12} H ${cardW - 12} V ${cardH - 40}`} fill="none" stroke={accentColor} strokeWidth="3" opacity="0.8" />

          {/* Outer Border with Draw-In Animation */}
          <rect
            x="2" y="2" width={cardW - 4} height={cardH - 4} rx="22"
            fill="none" stroke="#FFFFFF" strokeWidth="3"
            strokeDasharray={perimeter} strokeDashoffset={cardDashOffset}
            opacity={0.85} filter="url(#ftCardGlow)"
          />
        </svg>

        {/* TRANSITION MICRO-FLASH BURST OVERLAY */}
        {barFlashOpacity > 0.3 && (
          <div
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: '#FFFFFF', opacity: barFlashOpacity * 0.2,
              borderRadius: '24px', pointerEvents: 'none', zIndex: 30,
            }}
          />
        )}

        {/* TOP HEADER: Protocol & Encryption Info Bar */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', opacity: metaBarOpacity, zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Upload Arrow Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', opacity: 0.9 }}>
              Secure Upload
            </span>
          </div>

          {/* Protocol + Encryption Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                border: `1.5px solid ${accentColor}`, borderRadius: '20px',
                padding: '3px 14px', fontSize: '14px', fontWeight: 700,
                color: accentColor, letterSpacing: '1px',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
              }}
            >
              TLS 1.3
            </div>
            <div
              style={{
                border: '1.5px solid rgba(255, 255, 255, 0.4)', borderRadius: '20px',
                padding: '3px 14px', fontSize: '14px', fontWeight: 700,
                color: '#FFFFFF', opacity: 0.85, letterSpacing: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
              }}
            >
              AES-256-GCM
            </div>
          </div>
        </div>

        {/* MIDDLE: FILE ICON + FILE METADATA + PERCENTAGE / ENCRYPTED BADGE */}
        <div
          style={{
            transform: `translateX(${contentEntranceSlide}px)`,
            opacity: contentEntranceOpacity,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', zIndex: 10,
          }}
        >
          {/* LEFT: File Icon + Text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div style={{ position: 'relative', width: '84px', height: '104px' }}>
              <svg width="84" height="104" viewBox="0 0 84 104" fill="none">
                <path
                  d="M 6 4 C 6 1.8 7.8 0 10 0 H 54 L 78 24 V 98 C 78 100.2 76.2 102 74 102 H 10 C 7.8 102 6 100.2 6 98 Z"
                  fill="rgba(15, 23, 42, 0.9)" stroke={accentColor} strokeWidth="3.5"
                  style={{ filter: `drop-shadow(0 0 10px ${accentColor})` }}
                />
                <path d="M 54 0 V 24 H 78 Z" fill={accentColor} opacity="0.8" />
                <line x1="20" y1="40" x2="62" y2="40" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                <line x1="20" y1="54" x2="62" y2="54" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                <line x1="20" y1="68" x2="48" y2="68" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              </svg>

              {/* Mini Lock Overlay Badge (Frame 195+) */}
              {iconLockScale > 0 && (
                <div
                  style={{
                    position: 'absolute', bottom: '-6px', right: '-8px',
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: '#0F172A', border: '2px solid #4ADE80',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transform: `scale(${iconLockScale})`, boxShadow: '0 0 12px #4ADE80',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
              )}
            </div>

            {/* File Name & Size */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '34px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.5px', textShadow: '0 0 12px rgba(255, 255, 255, 0.4)' }}>
                {fileName}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <span style={{ fontSize: '22px', fontWeight: 600, color: '#FFFFFF', opacity: 0.75 }}>
                  {fileSize}
                </span>
                <span style={{ color: accentColor, fontSize: '18px' }}>•</span>
                <span style={{ fontSize: '20px', fontWeight: 600, color: accentColor }}>
                  {isCompleted ? 'Transfer Complete' : 'Encrypting & Transferring...'}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Percentage or Encrypted Badge */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!isCompleted && (
              <span
                style={{
                  fontSize: '42px', fontWeight: 800, color: '#FFFFFF',
                  fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums',
                  opacity: percentTextOpacity, textShadow: `0 0 16px ${accentColor}`,
                }}
              >
                {Math.floor(progressPercent)}%
              </span>
            )}

            {isCompleted && (
              <div
                style={{
                  transform: `scale(${badgeScale * badgeBreathScale})`,
                  display: 'flex', alignItems: 'center', gap: '10px',
                  backgroundColor: 'rgba(74, 222, 128, 0.18)',
                  border: '2px solid #4ADE80', borderRadius: '30px',
                  padding: '8px 24px', boxShadow: '0 0 20px rgba(74, 222, 128, 0.5)',
                }}
              >
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#4ADE80" strokeWidth="3" strokeLinecap="round"
                  style={{ transform: `rotate(${lockRotateSnap}deg)` }}
                >
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#4ADE80', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Encrypted
                </span>
              </div>
            )}
          </div>
        </div>

        {/* PROGRESS BAR SECTION */}
        <div
          style={{
            transform: `translateX(${contentEntranceSlide}px)`,
            opacity: contentEntranceOpacity,
            position: 'relative', width: '100%', zIndex: 10,
          }}
        >
          {/* Progress Track */}
          <div
            style={{
              width: '100%', height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              borderRadius: '5px', overflow: 'hidden', position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`, height: '100%',
                background: `linear-gradient(90deg, #164E56 0%, ${accentColor} 70%, #FFFFFF 100%)`,
                borderRadius: '5px', boxShadow: `0 0 14px ${accentColor}`,
              }}
            />
          </div>

          {/* Leading edge glow head */}
          {progressPercent > 0 && progressPercent < 100 && (
            <div
              style={{
                position: 'absolute', top: '-4px',
                left: `calc(${progressPercent}% - 9px)`,
                width: '18px', height: '18px', borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: `0 0 16px ${accentColor}, 0 0 24px #FFFFFF`,
                filter: 'url(#ftHeadGlow)', pointerEvents: 'none',
              }}
            />
          )}

          {/* 100% Flash */}
          {barFlashOpacity > 0 && (
            <div
              style={{
                position: 'absolute', top: '-2px', left: 0,
                width: '100%', height: '14px', borderRadius: '7px',
                backgroundColor: '#FFFFFF', opacity: barFlashOpacity,
                boxShadow: '0 0 24px #FFFFFF', pointerEvents: 'none',
              }}
            />
          )}

          {/* Under-bar live transfer stats */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '10px', opacity: metaBarOpacity,
            }}
          >
            {/* Transfer speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: accentColor, fontSize: '16px', fontWeight: 800 }}>↑</span>
              <span style={{ fontSize: '17px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF', opacity: 0.85 }}>
                {isCompleted ? '—' : `${currentSpeedMbps} MB/s`}
              </span>
            </div>

            {/* Transferred / Total */}
            <span style={{ fontSize: '17px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF', opacity: 0.7 }}>
              {transferredMB} / {totalBytes} MB
            </span>

            {/* Elapsed estimate */}
            <span style={{ fontSize: '17px', fontWeight: 600, color: '#FFFFFF', opacity: 0.6 }}>
              {isCompleted ? 'Completed in 5.3s' : `ETA ${Math.max(1, Math.ceil((100 - progressPercent) / 12))}s`}
            </span>
          </div>
        </div>

        {/* BOTTOM SECTION: SHA-256 Checksum Hash & Destination */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', opacity: checksumOpacity,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '14px', padding: '14px 24px', boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          {/* Left: Checksum hash */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'monospace', color: '#FFFFFF', opacity: 0.7, letterSpacing: '0.5px' }}>
              SHA-256: a7f3c9...e41b02
            </span>
          </div>

          {/* Middle: Destination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              <path d="M22 12H2" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', opacity: 0.75 }}>
              cloud-vault-sg-01
            </span>
          </div>

          {/* Right: Integrity verified badge (after completion) */}
          {isCompleted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#4ADE80', letterSpacing: '1px' }}>
                INTEGRITY OK
              </span>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
