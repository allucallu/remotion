import React from 'react';
import { Easing, interpolate, interpolateColors, spring, useVideoConfig } from 'remotion';
import { getPasswordIcon, EyeShowIcon } from './PasswordIcons';

export interface LabelTexts {
  weak?: string;
  fair?: string;
  strong?: string;
  veryStrong?: string;
}

export interface PasswordStrengthCardProps {
  frame: number;
  showInputField?: boolean;
  labelTexts?: LabelTexts;
}

export const PasswordStrengthCard: React.FC<PasswordStrengthCardProps> = ({
  frame,
  showInputField = true,
  labelTexts = {
    weak: 'Weak Password',
    fair: 'Fair Password',
    strong: 'Strong Password',
    veryStrong: 'Very Strong Password',
  },
}) => {
  const { fps } = useVideoConfig();

  // 1. Dynamic Password Typing Sequence (Password characters grow dynamically as strength increases!)
  // Frame 0-35: 0 -> 4 chars (Weak)
  // Frame 45-95: 4 -> 8 chars (Fair)
  // Frame 105-165: 8 -> 12 chars (Strong)
  // Frame 175-245: 12 -> 16 chars (Very Strong)
  let charsCount = 0;
  if (frame < 45) {
    charsCount = Math.floor(interpolate(frame, [0, 35], [0, 4], { extrapolateRight: 'clamp' }));
  } else if (frame < 105) {
    charsCount = Math.floor(interpolate(frame, [45, 95], [4, 8], { extrapolateRight: 'clamp' }));
  } else if (frame < 175) {
    charsCount = Math.floor(interpolate(frame, [105, 165], [8, 12], { extrapolateRight: 'clamp' }));
  } else {
    charsCount = Math.floor(interpolate(frame, [175, 245], [12, 16], { extrapolateRight: 'clamp' }));
  }

  const bulletString = '•'.repeat(charsCount);

  // 2. Input Field Horizontal Shake Warning (Frame 35-50 when Weak)
  const isShaking = frame >= 35 && frame <= 50;
  const shakeX = isShaking
    ? Math.sin((frame - 35) * (Math.PI / 2.5)) * 6
    : 0;

  // 3. Smooth Bar Width & Color Interpolation
  // Phase 1 (Weak): Frame 0-35 (0% -> 25%)
  // Phase 2 (Fair): Frame 45-95 (25% -> 50%)
  // Phase 3 (Strong): Frame 105-165 (50% -> 75%)
  // Phase 4 (Very Strong): Frame 175-245 (75% -> 100%)
  const widthPercent = interpolate(
    frame,
    [0, 35, 45, 95, 105, 165, 175, 245],
    [0, 25, 25, 50, 50, 75, 75, 100],
    {
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    }
  );

  const barColor = interpolateColors(
    frame,
    [0, 35, 45, 95, 105, 165, 175, 245],
    ['#DC2626', '#DC2626', '#DC2626', '#EA580C', '#EA580C', '#CA8A04', '#CA8A04', '#16A34A']
  );

  // 4. Determine Active Phase & Label Text
  let currentStep: 'weak' | 'fair' | 'strong' | 'very-strong' = 'weak';
  let currentLabel = labelTexts.weak || 'Weak Password';

  if (frame >= 175) {
    currentStep = 'very-strong';
    currentLabel = labelTexts.veryStrong || 'Very Strong Password';
  } else if (frame >= 105) {
    currentStep = 'strong';
    currentLabel = labelTexts.strong || 'Strong Password';
  } else if (frame >= 45) {
    currentStep = 'fair';
    currentLabel = labelTexts.fair || 'Fair Password';
  }

  // 5. Very Strong ScaleY Pulse (Frame 245-260)
  const isPulseActive = frame >= 245 && frame <= 260;
  const barScaleY = isPulseActive
    ? interpolate(frame, [245, 252, 260], [1, 1.25, 1], { extrapolateRight: 'clamp' })
    : 1;

  // 6. Icon Spring Pop-In on Very Strong Reveal
  const iconSpring = spring({
    frame: Math.max(0, frame - 175),
    fps,
    config: {
      damping: 12,
      stiffness: 220,
    },
  });

  const iconScale = currentStep === 'very-strong' ? interpolate(iconSpring, [0, 1], [0.5, 1]) : 1;

  // 7. Status Text Vertical Slide & Fade Animation
  const stepStartFrames = [0, 45, 105, 175];
  const lastStepStart = stepStartFrames.reduce((acc, f) => (frame >= f ? f : acc), 0);
  const textProgress = Math.min(15, frame - lastStepStart);

  const textOpacity = interpolate(textProgress, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const textTranslateY = interpolate(textProgress, [0, 12], [10, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '1240px', // Extra Large 4K Card Width
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: '30px',
        border: '2px solid rgba(229, 231, 235, 0.95)',
        boxShadow: '0 18px 52px rgba(0, 0, 0, 0.09), 0 6px 18px rgba(0, 0, 0, 0.04)',
        padding: '52px 60px',
        display: 'flex',
        flexDirection: 'column',
        gap: '36px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Input Field Mockup with Synchronized Dynamic Password Typing & Shake Warning */}
      {showInputField && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transform: `translateX(${shakeX}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.6px' }}>
              PASSWORD INPUT
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#9CA3AF' }}>
              CHARACTER COUNT: {charsCount} / 16
            </span>
          </div>

          <div
            style={{
              width: '100%',
              height: '86px',
              backgroundColor: '#FAFAFA',
              border: `2.5px solid ${isShaking ? '#DC2626' : '#E5E7EB'}`,
              borderRadius: '20px',
              padding: '0 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.03)',
              transition: 'border-color 0.15s ease',
            }}
          >
            <span
              style={{
                fontSize: '46px',
                fontWeight: 700,
                letterSpacing: '9px',
                color: '#111827',
                lineHeight: 1,
              }}
            >
              {bulletString}
              {charsCount < 16 && (
                <span style={{ opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.2, color: barColor }}>|</span>
              )}
            </span>

            {/* Password Eye Toggle Icon Mockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', opacity: 0.7 }}>
              <EyeShowIcon size={30} color="#9CA3AF" />
            </div>
          </div>
        </div>
      )}

      {/* 2. Password Strength Meter Controls & Dynamic Synchronized Label Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: '#4B5563', letterSpacing: '0.6px' }}>
            SECURITY STRENGTH METER
          </span>

          {/* Animated Status Text Label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              opacity: textOpacity,
              transform: `translateY(${textTranslateY}px)`,
            }}
          >
            <span
              style={{
                fontSize: '30px',
                fontWeight: 700,
                color: barColor,
                letterSpacing: '-0.3px',
              }}
            >
              {currentLabel}
            </span>
          </div>
        </div>

        {/* 3. Horizontal Strength Bar & Status Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {/* Progress Bar Track */}
          <div
            style={{
              flexGrow: 1,
              height: '22px',
              backgroundColor: '#E5E7EB',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Active Filling Bar with Color & Width Interpolation */}
            <div
              style={{
                height: '100%',
                width: `${widthPercent}%`,
                backgroundColor: barColor,
                borderRadius: '9999px',
                transform: `scaleY(${barScaleY})`,
                transformOrigin: 'center center',
                transition: 'width 0.1s linear, background-color 0.1s linear',
                boxShadow: `0 0 14px ${barColor}44`,
              }}
            />
          </div>

          {/* Icon End Marker with Spring Scale Pop */}
          <div style={{ transform: `scale(${iconScale})`, flexShrink: 0 }}>
            {getPasswordIcon(currentStep, 56)}
          </div>
        </div>
      </div>
    </div>
  );
};
