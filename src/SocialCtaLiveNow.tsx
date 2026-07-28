import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 10. SocialCtaLiveNow (COMPACT CTA SIZE)
 * Mood: Streaming / live event — Badge pulsing "LIVE" + bar info.
 * Ukuran Kompak CTA: Width = 1100px (~29%), badgeWidth = 280px, infoBarHeight = 90px
 */

interface SocialCtaLiveNowProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  subText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaLiveNow: React.FC<SocialCtaLiveNowProps> = ({
  primaryColor = '#1E293B',
  accentColor = '#EF4444',
  ctaText = 'LIVE',
  subText = 'STREAMING NOW',
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 300,
  barWidth = 1100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const badgeIn = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 170, mass: 0.6 } });
  const barIn = spring({ frame: localFrame - 5, fps, config: { damping: 14, stiffness: 130, mass: 0.8 } });
  const textIn = spring({ frame: localFrame - 8, fps, config: { damping: 16, stiffness: 110, mass: 0.9 } });

  const badgeOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });

  const badgeScale = isExiting ? interpolate(badgeOut, [0, 1], [1, 0]) : badgeIn;
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const holdPhase = localFrame > 15 && !isExiting;
  const dotPulse = holdPhase ? 0.6 + Math.sin(localFrame * 0.2) * 0.4 : 1;

  const badgeWidth = 280;
  const badgeHeight = 95;
  const infoBarHeight = 90;
  const dotSize = 26;

  return (
    <AbsoluteFill>
      {/* Info Bar */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: barWidth,
          height: infoBarHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 12px 12px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: leftOffset + 40,
          bottom: bottomOffset,
          width: barWidth - 60,
          height: infoBarHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 48, color: 'white', letterSpacing: 5 }}>
          {subText}
        </span>
      </div>

      {/* LIVE Badge */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + infoBarHeight + 12,
          width: badgeWidth,
          height: badgeHeight,
          backgroundColor: accentColor,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          transformOrigin: 'left center',
          transform: `scale(${badgeScale})`,
          boxShadow: `0 12px 35px ${accentColor}60, 0 0 20px ${accentColor}40`,
        }}
      >
        <div
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: 'white',
            opacity: dotPulse,
            boxShadow: '0 0 10px rgba(255,255,255,0.8)',
          }}
        />
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 52, color: 'white', letterSpacing: 8 }}>
          {ctaText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
