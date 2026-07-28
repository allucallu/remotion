import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 2. SocialCtaFollowerCount (COMPACT CTA SIZE)
 * Mood: Brand / Influencer showcase — Badge lingkaran + angka counter animasi + bar horizontal.
 * Ukuran Kompak CTA: Width = 1400px (~36%), Height = 110px
 */

interface SocialCtaFollowerCountProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  followerTarget?: number;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaFollowerCount: React.FC<SocialCtaFollowerCountProps> = ({
  primaryColor = '#4F46E5',
  accentColor = '#34D399',
  ctaText = 'FOLLOWERS',
  followerTarget = 10000,
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const circleIn = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });
  const barIn = spring({ frame: localFrame - 4, fps, config: { damping: 16, stiffness: 120, mass: 0.9 } });
  const textIn = spring({ frame: localFrame - 7, fps, config: { damping: 18, stiffness: 100, mass: 1.0 } });

  const circleOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });

  const circleScale = isExiting ? interpolate(circleOut, [0, 1], [1, 0]) : circleIn;
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const counterProgress = interpolate(localFrame, [10, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayCount = Math.floor(counterProgress * followerTarget);
  const formattedCount = displayCount >= 1000
    ? `${(displayCount / 1000).toFixed(displayCount >= 10000 ? 0 : 1)}K`
    : displayCount.toString();

  const circleSize = 170;
  const barHeight = 110;

  return (
    <AbsoluteFill>
      {/* Horizontal Bar */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + circleSize / 2,
          bottom: bottomOffset + (circleSize - barHeight) / 2,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 16px 16px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
        }}
      />

      {/* CTA Text */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + circleSize + 30,
          bottom: bottomOffset + (circleSize - barHeight) / 2,
          width: barWidth - circleSize,
          height: barHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 52,
            color: 'white',
            letterSpacing: 5,
          }}
        >
          {ctaText}
        </span>
      </div>

      {/* Circle Badge with Counter */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          backgroundColor: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'center center',
          transform: `scale(${circleScale})`,
          boxShadow: `0 15px 40px rgba(0,0,0,0.5), 0 0 30px ${accentColor}60`,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 46,
            color: 'white',
          }}
        >
          {formattedCount}
        </span>
      </div>
    </AbsoluteFill>
  );
};
