import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
import { TinyOtpLockIcon } from './TwoFactorIcons';

export interface OtpBoxRowProps {
  frame: number;
  otpLength?: number;
  digits?: string[];
  accentColor?: string;
}

const DEFAULT_DIGITS = ['4', '8', '2', '9', '1', '7'];

export const OtpBoxRow: React.FC<OtpBoxRowProps> = ({
  frame,
  otpLength = 6,
  digits = DEFAULT_DIGITS,
  accentColor = '#2563EB',
}) => {
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '26px',
        margin: '16px 0',
      }}
    >
      {Array.from({ length: otpLength }).map((_, idx) => {
        const startFrame = 20 + idx * 20; // 20 frames interval per OTP box
        const isFilled = frame >= startFrame;
        const isActiveTyping = frame >= startFrame && frame < startFrame + 12;
        const isWaitingNext = frame < startFrame && (idx === 0 || frame >= 20 + (idx - 1) * 20);

        // Digit Spring Pop-In (scale 0.5 -> 1 over 8-10 frames)
        const digitSpring = spring({
          frame: isFilled ? Math.max(0, frame - startFrame) : 0,
          fps,
          config: {
            damping: 14,
            stiffness: 240,
          },
        });

        const digitScale = isFilled ? interpolate(digitSpring, [0, 1], [0.5, 1]) : 0;
        const boxScale = isActiveTyping ? 1.05 : 1;

        // Styling state
        let borderColor = '#D1D5DB';
        let bgColor = '#FAFAFA';
        let boxShadow = 'none';

        if (isActiveTyping) {
          borderColor = accentColor;
          bgColor = '#EFF6FF';
          boxShadow = `0 0 20px ${accentColor}44, 0 4px 12px ${accentColor}22`;
        } else if (isFilled) {
          borderColor = accentColor;
          bgColor = '#FFFFFF';
          boxShadow = `0 6px 16px ${accentColor}18`;
        } else if (isWaitingNext) {
          borderColor = '#93C5FD';
          bgColor = '#FFFFFF';
        }

        const digit = digits[idx % digits.length];

        return (
          <div
            key={idx}
            style={{
              width: '124px', // Extra Large 4K Legible Width
              height: '136px', // Extra Large 4K Legible Height
              backgroundColor: bgColor,
              border: `2.5px solid ${borderColor}`,
              borderRadius: '22px',
              boxShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${boxScale})`,
              transition: 'border-color 0.1s ease, background-color 0.1s ease, transform 0.1s ease',
              position: 'relative',
            }}
          >
            {/* Top Right Tiny Lock Badge Icon when Filled */}
            {isFilled && (
              <div style={{ position: 'absolute', top: '10px', right: '12px', opacity: 0.85 }}>
                <TinyOtpLockIcon size={18} color={accentColor} />
              </div>
            )}

            {/* Active Blinking Cursor Line when waiting for typing */}
            {isWaitingNext && !isFilled && (
              <span style={{ fontSize: '42px', fontWeight: 300, color: accentColor, opacity: Math.floor(frame / 12) % 2 === 0 ? 1 : 0.2 }}>
                |
              </span>
            )}

            {/* Digit Character with Spring Scale Pop-In */}
            {isFilled && (
              <span
                style={{
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '64px',
                  fontWeight: 800,
                  color: '#111827',
                  lineHeight: 1,
                  transform: `scale(${digitScale})`,
                  display: 'inline-block',
                }}
              >
                {digit}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
