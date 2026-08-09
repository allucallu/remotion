import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/*
  NOTE: This composition is specifically designed for Screen / Add / Linear Dodge additive blend modes.
  The background outside the login form and autofill popup is intentionally solid black (#000000),
  which automatically becomes 100% transparent when overlaid onto video footage in editing software.
*/

export interface PasswordManagerAutofillPopupProps {
  siteLabel?: string;
  accentColor?: string;
}

export const PasswordManagerAutofillPopup: React.FC<PasswordManagerAutofillPopupProps> = ({
  siteLabel = 'example.com',
  accentColor = '#22D3EE',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig(); // 3840 x 2160 4K UHD

  const centerX = width / 2; // 1920
  const centerY = height / 2; // 1080

  const formW = 860;
  const formH = 460;
  const formX = centerX - formW / 2; // 1490
  const formY = centerY - formH / 2 - 20; // 830

  // 1. Frame 0-25: Form Entrance (Dim Background Context)
  const formOpacity = interpolate(frame, [0, 25], [0, 0.4], { extrapolateRight: 'clamp' });

  // 2. Frame 30-40: Password Field Focus Shift
  const passBorderOpacity = frame >= 30
    ? interpolate(frame, [30, 40], [0.3, 0.65], { extrapolateRight: 'clamp' })
    : 0.3;

  const passFocusGlow = frame >= 30
    ? interpolate(frame, [30, 40], [0, 8], { extrapolateRight: 'clamp' })
    : 0;

  // 3. Frame 45-65: Popup Entrance (slide-down + fade + scale)
  const popupSpring = spring({ frame: Math.max(0, frame - 45), fps, config: { damping: 15, stiffness: 200 } });
  const popupSlideY = frame >= 45
    ? interpolate(popupSpring, [0, 1], [-10, 0])
    : -10;
  const popupScale = frame >= 45 ? interpolate(popupSpring, [0, 1], [0.92, 1.0]) : 0.92;

  // Popup Fade In & Fade Out (Frame 45-65 in, Frame 90-105 out)
  let popupOpacity = 0;
  if (frame >= 45 && frame < 90) {
    popupOpacity = interpolate(frame - 45, [0, 15], [0, 1.0], { extrapolateRight: 'clamp' });
  } else if (frame >= 90 && frame <= 105) {
    popupOpacity = interpolate(frame - 90, [0, 15], [1.0, 0], { extrapolateRight: 'clamp' });
  }

  // Popup Click Flash (Frame 90-96)
  const popupFlashOpacity = frame >= 90 && frame <= 96
    ? interpolate(frame - 90, [0, 3, 6], [0, 0.9, 0], { extrapolateRight: 'clamp' })
    : 0;

  // Key icon pop-in inside popup (Frame 65-80)
  const keySpring = spring({ frame: Math.max(0, frame - 65), fps, config: { damping: 13, stiffness: 180 } });
  const keyScale = frame >= 65 ? interpolate(keySpring, [0, 1], [0, 1.0]) : 0;
  const popupTextOpacity = frame >= 70
    ? interpolate(frame - 70, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // 4. Frame 105-160: 10 Password Dots Autofill Typing Sequence
  const totalDots = 10;
  const dotsStartFrame = 105;

  // Placeholder text fade-out
  const placeholderOpacity = frame >= dotsStartFrame
    ? interpolate(frame - dotsStartFrame, [0, 6], [0.4, 0], { extrapolateRight: 'clamp' })
    : 0.4;

  // 5. Frame 160-165: Success Field Flash
  const successFlashOpacity = frame >= 160 && frame <= 168
    ? interpolate(frame - 160, [0, 4, 8], [0, 1.0, 0], { extrapolateRight: 'clamp' })
    : 0;

  // 6. Frame 165-180: Success Checkmark Pop-In
  const checkSpring = spring({ frame: Math.max(0, frame - 165), fps, config: { damping: 14, stiffness: 220 } });
  const checkScale = frame >= 165 ? interpolate(checkSpring, [0, 1], [0, 1.0]) : 0;
  const checkOpacity = frame >= 165
    ? interpolate(frame - 165, [0, 10], [0, 1.0], { extrapolateRight: 'clamp' })
    : 0;

  // Idle breath on checkmark (Frame 180-210)
  const idleBreathCycle = frame >= 180 ? ((frame - 180) % 40) / 40 : 0;
  const checkBreathOpacity = frame >= 180 ? 0.85 + Math.sin(idleBreathCycle * Math.PI * 2) * 0.15 : 1.0;

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
          <filter id="autofillGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="popupBorderAura" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* MOCKUP LOGIN FORM CONTAINER (Dim Background Context, 860px x 460px) */}
      <div
        style={{
          position: 'absolute',
          left: `${formX}px`,
          top: `${formY}px`,
          width: `${formW}px`,
          height: `${formH}px`,
          borderRadius: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 44px',
          backgroundColor: 'rgba(10, 31, 36, 0.3)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          opacity: formOpacity,
        }}
      >
        {/* Background Technical Grid Lines & Corner Brackets */}
        <svg
          width={formW}
          height={formH}
          viewBox={`0 0 ${formW} ${formH}`}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          <line x1="44" y1="74" x2={formW - 44} y2="74" stroke="#164E56" strokeWidth="1" opacity="0.3" />
          <path d="M 12 30 V 12 H 30" fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.5" />
          <path d={`M ${formW - 30} 12 H ${formW - 12} V 30`} fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.5" />
          <path d={`M 12 ${formH - 30} V ${formH - 12} H 30`} fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.5" />
          <path d={`M ${formW - 30} ${formH - 12} H ${formW - 12} V ${formH - 30}`} fill="none" stroke={accentColor} strokeWidth="2.5" opacity="0.5" />
        </svg>

        {/* FORM TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.7">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', opacity: 0.85, letterSpacing: '0.5px' }}>
            Account Sign In
          </span>
        </div>

        {/* INPUT FIELDS STACK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', zIndex: 10 }}>
          {/* FIELD 1: EMAIL / USERNAME */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', opacity: 0.6 }}>
              Email / Username
            </span>
            <div
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '14px',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                padding: '0 20px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: 500, color: '#FFFFFF', opacity: 0.85 }}>
                user@example.com
              </span>
            </div>
          </div>

          {/* FIELD 2: PASSWORD (TARGET FIELD FOR AUTOFILL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', opacity: 0.6 }}>
              Password
            </span>
            <div
              style={{
                width: '100%',
                height: '56px',
                borderRadius: '14px',
                border: successFlashOpacity > 0
                  ? `2px solid ${accentColor}`
                  : `1.5px solid rgba(255, 255, 255, ${passBorderOpacity})`,
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                padding: '0 20px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: passFocusGlow > 0
                  ? `0 0 ${passFocusGlow}px ${accentColor}`
                  : successFlashOpacity > 0
                  ? `0 0 16px ${accentColor}`
                  : 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            >
              {/* Left Side: Placeholder or Password Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Placeholder text (fades out at frame 105) */}
                {placeholderOpacity > 0 && (
                  <span style={{ fontSize: '18px', fontWeight: 400, color: '#FFFFFF', opacity: placeholderOpacity }}>
                    Enter your password
                  </span>
                )}

                {/* 10 Password Dots (Sequential Pop-In Frame 105+) */}
                {frame >= dotsStartFrame && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {Array.from({ length: totalDots }).map((_, dotIdx) => {
                      const dotFrameStart = dotsStartFrame + dotIdx * 5;
                      const dotSpring = spring({
                        frame: Math.max(0, frame - dotFrameStart),
                        fps,
                        config: { damping: 13, stiffness: 200 },
                      });
                      const dotScale = frame >= dotFrameStart ? interpolate(dotSpring, [0, 1], [0, 1.0]) : 0;
                      const dotOpacity = frame >= dotFrameStart
                        ? interpolate(frame - dotFrameStart, [0, 6], [0, 1.0], { extrapolateRight: 'clamp' })
                        : 0;

                      return (
                        <div
                          key={`pass-dot-${dotIdx}`}
                          style={{
                            width: '9px',
                            height: '9px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            transform: `scale(${dotScale})`,
                            opacity: dotOpacity,
                            boxShadow: '0 0 8px #FFFFFF',
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Side: Micro-Checkmark Icon (Frame 165+) */}
              {checkOpacity > 0 && (
                <div
                  style={{
                    transform: `scale(${checkScale})`,
                    opacity: checkOpacity * checkBreathOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    border: '1.5px solid #4ADE80',
                    boxShadow: '0 0 10px #4ADE80',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM SUBMIT BUTTON MOCKUP */}
        <div
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '14px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#FFFFFF', opacity: 0.6 }}>
            Sign In
          </span>
        </div>
      </div>

      {/* FOREGROUND HERO ELEMENT: AUTOFILL POPUP DROPDOWN (Attached right under password field) */}
      {popupOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            left: `${formX + 44}px`, // aligned with form padding
            top: `${formY + 292}px`, // positioned right under password field
            width: `${formW - 88}px`, // matches password field width (772px)
            height: '76px',
            borderRadius: '16px',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(10, 31, 36, 0.85)',
            border: popupFlashOpacity > 0
              ? '2.5px solid #FFFFFF'
              : '2px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            transform: `translateY(${popupSlideY}px) scale(${popupScale})`,
            opacity: popupOpacity,
            boxShadow: `0 0 20px ${accentColor}, 0 0 30px rgba(255, 255, 255, 0.4)`,
            filter: 'url(#popupBorderAura)',
            zIndex: 30,
          }}
        >
          {/* LEFT: KEY ICON + SITE LABEL + SUB-TEXT */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {/* KEY ICON */}
            <div
              style={{
                transform: `scale(${keyScale})`,
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(34, 211, 238, 0.18)',
                border: `1.5px solid ${accentColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${accentColor}`,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-2-2l2 2m2 2l-2 2m-2-2l2 2M3 11a7 7 0 1 1 14 0c0 1.6-.5 3-1.4 4.3L21 21l-3 3-3-3-3 3-5.7-5.7A7 7 0 0 1 3 11z" />
              </svg>
            </div>

            {/* TEXT LABELS */}
            <div style={{ display: 'flex', flexDirection: 'column', opacity: popupTextOpacity }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.3px' }}>
                {siteLabel}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 600, color: accentColor, marginTop: '2px' }}>
                Use saved password?
              </span>
            </div>
          </div>

          {/* RIGHT: AUTOFILL BADGE BUTTON */}
          <div
            style={{
              opacity: popupTextOpacity,
              backgroundColor: 'rgba(34, 211, 238, 0.2)',
              border: `1.5px solid ${accentColor}`,
              borderRadius: '20px',
              padding: '6px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: `0 0 14px ${accentColor}`,
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: accentColor, letterSpacing: '0.5px' }}>
              Autofill →
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
