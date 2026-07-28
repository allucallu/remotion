import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 5. SocialCtaPlayWatch (COMPACT CTA SIZE)
 * Mood: Video teaser / trailer — Lingkaran play + "WATCH NOW".
 * Ukuran Kompak CTA: Width = 1350px (~35%), Height = 115px
 */

interface SocialCtaPlayWatchProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaPlayWatch: React.FC<SocialCtaPlayWatchProps> = ({
  primaryColor = '#7C3AED',
  accentColor = '#06B6D4',
  ctaText = 'WATCH NOW',
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1350,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const circleIn = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 160, mass: 0.7 } });
  const barIn = spring({ frame: localFrame - 4, fps, config: { damping: 14, stiffness: 130, mass: 0.8 } });
  const textIn = spring({ frame: localFrame - 7, fps, config: { damping: 16, stiffness: 110, mass: 0.9 } });
  const lineIn = spring({ frame: localFrame - 10, fps, config: { damping: 12, stiffness: 180, mass: 0.5 } });

  const circleOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const lineOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });

  const circleScale = isExiting ? interpolate(circleOut, [0, 1], [1, 0]) : circleIn;
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);
  const lineScaleX = isExiting ? interpolate(lineOut, [0, 1], [1, 0]) : interpolate(lineIn, [0, 1], [0, 1]);

  const circleSize = 160;
  const barHeight = 115;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: leftOffset + circleSize * 0.5,
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
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 56, color: 'white', letterSpacing: 6 }}>
          {ctaText}
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: leftOffset + circleSize + 15,
          bottom: bottomOffset + (circleSize - barHeight) / 2 - 18,
          width: barWidth * 0.5,
          height: 4,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${lineScaleX})`,
          borderRadius: 2,
          boxShadow: `0 0 12px ${accentColor}60`,
        }}
      />

      {/* Play Circle */}
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
        <div style={{ width: 0, height: 0, borderLeft: '48px solid white', borderTop: '30px solid transparent', borderBottom: '30px solid transparent', marginLeft: 10 }} />
      </div>
    </AbsoluteFill>
  );
};
