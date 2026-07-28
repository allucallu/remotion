import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 4. SocialCtaHandleBar (COMPACT CTA SIZE)
 * Mood: Podcast / personal brand — Bar minimalis + "@yourhandle" + titik aksen.
 * Ukuran Kompak CTA: Width = 1500px (~39%), Height = 100px
 */

interface SocialCtaHandleBarProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaHandleBar: React.FC<SocialCtaHandleBarProps> = ({
  primaryColor = '#1E293B',
  accentColor = '#F59E0B',
  ctaText = '@yourhandle',
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 340,
  barWidth = 1500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const dotIn = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 200, mass: 0.5 } });
  const lineIn = spring({ frame: localFrame - 3, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
  const barIn = spring({ frame: localFrame - 6, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const textIn = spring({ frame: localFrame - 10, fps, config: { damping: 18, stiffness: 100, mass: 1.0 } });

  const dotOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 20, stiffness: 220, mass: 0.4 } });
  const lineOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.4 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.4 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.4 } });

  const dotScale = isExiting ? interpolate(dotOut, [0, 1], [1, 0]) : dotIn;
  const lineScaleX = isExiting ? interpolate(lineOut, [0, 1], [1, 0]) : interpolate(lineIn, [0, 1], [0, 1]);
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const barHeight = 100;
  const dotSize = 32;

  return (
    <AbsoluteFill>
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 18,
          bottom: bottomOffset + barHeight + 12,
          width: barWidth * 0.4,
          height: 4,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${lineScaleX})`,
          borderRadius: 2,
          boxShadow: `0 0 12px ${accentColor}80`,
        }}
      />

      {/* Accent dot */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset - dotSize / 2 + 8,
          bottom: bottomOffset + barHeight / 2 - dotSize / 2,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: accentColor,
          transformOrigin: 'center center',
          transform: `scale(${dotScale})`,
          boxShadow: `0 0 20px ${accentColor}80`,
          zIndex: 10,
        }}
      />

      {/* Main bar */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 18,
          bottom: bottomOffset,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 12px 12px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.45)',
          borderLeft: `4px solid ${accentColor}`,
        }}
      />

      {/* Handle Text */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 55,
          bottom: bottomOffset,
          width: barWidth - 60,
          height: barHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 700,
            fontSize: 52,
            color: 'white',
            letterSpacing: 3,
          }}
        >
          {ctaText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
