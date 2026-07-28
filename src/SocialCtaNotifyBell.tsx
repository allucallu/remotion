import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 3. SocialCtaNotifyBell (COMPACT CTA SIZE)
 * Mood: Alert / Update channel — Lonceng abstrak + pill "NOTIFY ME" berdenyut.
 * Ukuran Kompak CTA: Width = 1200px (~31%), Height = 110px
 */

interface SocialCtaNotifyBellProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaNotifyBell: React.FC<SocialCtaNotifyBellProps> = ({
  primaryColor = '#334155',
  accentColor = '#D97706',
  ctaText = 'NOTIFY ME',
  delayFrame = 0,
  exitStartFrame = 165,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const bellIn = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const pillIn = spring({ frame: localFrame - 5, fps, config: { damping: 14, stiffness: 130, mass: 0.8 } });
  const textIn = spring({ frame: localFrame - 8, fps, config: { damping: 16, stiffness: 110, mass: 0.9 } });

  const bellOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const pillOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });

  const bellScale = isExiting ? interpolate(bellOut, [0, 1], [1, 0]) : bellIn;
  const pillScaleX = isExiting ? interpolate(pillOut, [0, 1], [1, 0]) : interpolate(pillIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const holdPhase = localFrame > 20 && !isExiting;
  const pulseScale = holdPhase ? 1 + Math.sin(localFrame * 0.15) * 0.04 : 1;

  const bellContainerSize = 150;
  const pillHeight = 110;

  return (
    <AbsoluteFill>
      {/* Main Pill Bar */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + bellContainerSize * 0.55,
          bottom: bottomOffset + (bellContainerSize - pillHeight) / 2,
          width: barWidth,
          height: pillHeight,
          backgroundColor: primaryColor,
          borderRadius: pillHeight / 2,
          transformOrigin: 'left center',
          transform: `scaleX(${pillScaleX})`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
        }}
      />

      {/* CTA Text */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + bellContainerSize + 20,
          bottom: bottomOffset + (bellContainerSize - pillHeight) / 2,
          width: barWidth - bellContainerSize,
          height: pillHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 54,
            color: 'white',
            letterSpacing: 5,
          }}
        >
          {ctaText}
        </span>
      </div>

      {/* Abstract Bell Shape */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: bellContainerSize,
          height: bellContainerSize,
          transformOrigin: 'center center',
          transform: `scale(${bellScale * pulseScale})`,
          zIndex: 10,
        }}
      >
        <div style={{ position: 'absolute', left: bellContainerSize / 2 - 12, top: 6, width: 24, height: 24, borderRadius: '50%', backgroundColor: accentColor }} />
        <div style={{ position: 'absolute', left: 20, top: 26, width: bellContainerSize - 40, height: bellContainerSize - 60, backgroundColor: accentColor, borderRadius: '18px 18px 50% 50%', boxShadow: `0 10px 30px ${accentColor}80` }} />
        <div style={{ position: 'absolute', left: 10, bottom: 10, width: bellContainerSize - 20, height: 18, backgroundColor: accentColor, borderRadius: 9 }} />
        <div style={{ position: 'absolute', left: bellContainerSize / 2 - 8, bottom: 0, width: 16, height: 16, borderRadius: '50%', backgroundColor: '#FBBF24' }} />
      </div>
    </AbsoluteFill>
  );
};
