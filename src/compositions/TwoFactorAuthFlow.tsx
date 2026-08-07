import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { OtpBoxRow } from '../components/OtpBoxRow';
import { TwoFactorShieldIcon, ArcSpinnerIcon, VerifiedCheckmarkIcon } from '../components/TwoFactorIcons';

export interface TwoFactorAuthFlowProps {
  otpLength?: number;
  successMessage?: string;
  accentColor?: string;
}

export const TwoFactorAuthFlow: React.FC<TwoFactorAuthFlowProps> = ({
  otpLength = 6,
  successMessage = 'Verified',
  accentColor = '#2563EB',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Frame 0-15: Card Entry Spring Reveal (scale 0.95 -> 1, opacity 0 -> 1)
  const cardEntrySpring = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 180,
    },
  });

  const cardEntryScale = interpolate(cardEntrySpring, [0, 1], [0.95, 1]);
  const cardEntryOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Frame 150-210: Loading Spinner Rotate (2 full 360° revolutions = 720°)
  const isSpinnerActive = frame >= 150 && frame < 210;
  const spinnerOpacity = interpolate(frame, [150, 160, 200, 210], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const spinnerRotation = interpolate(frame, [150, 210], [0, 720], { extrapolateRight: 'clamp' });

  // 3. Frame 210-225: Verified Green Checkmark Spring Pop-In (scale 0 -> 1.15 -> 1)
  const isVerifiedActive = frame >= 210;
  const checkmarkSpring = spring({
    frame: Math.max(0, frame - 210),
    fps,
    config: {
      damping: 12,
      stiffness: 220,
    },
  });

  const checkmarkScale = isVerifiedActive
    ? interpolate(checkmarkSpring, [0, 1], [0, 1])
    : 0;

  // 4. Frame 225-240: Status Text Fade + translateY (8px -> 0px)
  const textProgress = Math.max(0, frame - 225);
  const textOpacity = interpolate(textProgress, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = interpolate(textProgress, [0, 12], [8, 0], { extrapolateRight: 'clamp' });

  // 5. Frame 240-260: Subtle Card Pulse Scale (1 -> 1.02 -> 1)
  const isPulseActive = frame >= 240 && frame <= 255;
  const pulseScale = isPulseActive
    ? interpolate(frame, [240, 247, 255], [1, 1.02, 1], { extrapolateRight: 'clamp' })
    : 1;

  const totalCardScale = cardEntryScale * pulseScale;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Centered 4K UI Card Container (1280px Width) */}
      <div
        style={{
          width: '1280px', // Extra Large 4K Legible Width
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '36px',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.09), 0 4px 18px rgba(0, 0, 0, 0.03)',
          padding: '60px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '36px',
          opacity: cardEntryOpacity,
          transform: `scale(${totalCardScale})`,
          transition: 'transform 0.1s linear',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Security Session Pill Badge */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '12px',
            padding: '6px 18px',
            fontSize: '14px',
            fontWeight: 800,
            color: '#1E40AF',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor }} />
          SECURE SESSION • ENCRYPTED 2FA VERIFICATION
        </div>

        {/* Header Section (2FA Shield Icon + Title + Subtitle) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '28px',
              backgroundColor: '#EFF6FF',
              border: '2.5px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
            }}
          >
            <TwoFactorShieldIcon size={60} color={accentColor} />
          </div>

          <span style={{ fontSize: '36px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginTop: '4px' }}>
            Enter Verification Code
          </span>

          <span style={{ fontSize: '20px', fontWeight: 500, color: '#6B7280', maxWidth: '840px', lineHeight: 1.4 }}>
            We sent a 6-digit OTP security code to <strong style={{ color: '#374151' }}>+1 (***) ***-8921</strong>
          </span>
        </div>

        {/* 6 OTP Input Boxes Row */}
        <OtpBoxRow
          frame={frame}
          otpLength={otpLength}
          accentColor={accentColor}
        />

        {/* Bottom Verification Status Area (Spinner -> Verified Checkmark -> Status Text) */}
        <div
          style={{
            height: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {/* Arc Loading Spinner (Frame 150-210) */}
          {isSpinnerActive && (
            <div style={{ opacity: spinnerOpacity }}>
              <ArcSpinnerIcon size={76} color={accentColor} rotation={spinnerRotation} />
            </div>
          )}

          {/* Verified Green Checkmark (Frame 210+) */}
          {isVerifiedActive && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div style={{ transform: `scale(${checkmarkScale})` }}>
                <VerifiedCheckmarkIcon size={96} color="#16A34A" />
              </div>

              {/* Status Text Label */}
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#16A34A',
                  letterSpacing: '0.4px',
                  opacity: textOpacity,
                  transform: `translateY(${textTranslateY}px)`,
                }}
              >
                {successMessage}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Progress Bar Line on Verified Completion */}
        {isVerifiedActive && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              backgroundColor: '#16A34A',
              boxShadow: '0 0 12px rgba(22, 163, 74, 0.4)',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
