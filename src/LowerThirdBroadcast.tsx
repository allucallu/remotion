import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  barHeight?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

/**
 * 2. LowerThirdBroadcast (MASSIVE 4K BROADCAST SCALE)
 * Mood: Broadcast News — 3-layer angled slant blocks tegas dengan top ticker tag & gerakan wipe kencang.
 * Ukuran 4K Gagah: Height = 300px, Width = 2500px (~65% lebar layar)
 * Text-Safe Zone:
 *   - Breaking / Location Tag: Left = leftOffset + 60px, Bottom = bottomOffset + 225px, Width = 550px, Height = 60px
 *   - Primary News Title: Left = leftOffset + 80px, Bottom = bottomOffset + 105px, Width = barWidth - 140px, Height = 110px
 *   - Secondary Subtitle: Left = leftOffset + 80px, Bottom = bottomOffset + 20px, Width = barWidth * 0.78, Height = 72px
 */
export const LowerThirdBroadcast: React.FC<LowerThirdProps> = ({
  primaryColor = '#DC2626', // Bold News Red
  accentColor = '#FACC15',  // Vibrant News Gold Accent
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 300,
  leftOffset = 220,
  bottomOffset = 240,
  barWidth = 2500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Snappy news spring physics
  const tagIn = spring({ frame: localFrame, fps, config: { damping: 13, stiffness: 220, mass: 0.5 } });
  const bgIn = spring({ frame: localFrame - 3, fps, config: { damping: 15, stiffness: 190, mass: 0.6 } });
  const mainIn = spring({ frame: localFrame - 6, fps, config: { damping: 17, stiffness: 160, mass: 0.7 } });
  const subIn = spring({ frame: localFrame - 9, fps, config: { damping: 18, stiffness: 140, mass: 0.8 } });

  const tagOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 22, stiffness: 240, mass: 0.4 } });
  const bgOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 22, stiffness: 240, mass: 0.4 } });
  const mainOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 22, stiffness: 240, mass: 0.4 } });
  const subOut = spring({ frame: exitLocalFrame, fps, config: { damping: 22, stiffness: 240, mass: 0.4 } });

  const offX = -(barWidth + leftOffset + 180);

  const tagX = isExiting ? interpolate(tagOut, [0, 1], [0, offX]) : interpolate(tagIn, [0, 1], [offX, 0]);
  const bgX = isExiting ? interpolate(bgOut, [0, 1], [0, offX]) : interpolate(bgIn, [0, 1], [offX, 0]);
  const mainX = isExiting ? interpolate(mainOut, [0, 1], [0, offX]) : interpolate(mainIn, [0, 1], [offX, 0]);
  const subX = isExiting ? interpolate(subOut, [0, 1], [0, offX]) : interpolate(subIn, [0, 1], [offX, 0]);

  const tagHeight = 68;
  const mainHeight = 125;
  const subHeight = 82;

  return (
    <AbsoluteFill>
      {/* Top News Ticker / Location Tag */}
      {/* 
        TEXT-SAFE ZONE (LOCATION / BREAKING TAG):
        Left = leftOffset + 60px, Bottom = bottomOffset + 225px, Width = 550px, Height = 60px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 40 + tagX,
          bottom: bottomOffset + barHeight - tagHeight,
          width: 580,
          height: tagHeight,
          backgroundColor: accentColor,
          transform: 'skewX(-20deg)',
          boxShadow: '0 8px 24px rgba(250,204,21,0.45)',
        }}
      />

      {/* Background Accent Slant Layer */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + bgX,
          bottom: bottomOffset - 12,
          width: barWidth + 50,
          height: barHeight + 24,
          backgroundColor: '#0F172A',
          transform: 'skewX(-20deg)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        }}
      />

      {/* Primary News Slant Block */}
      {/* 
        TEXT-SAFE ZONE (PRIMARY NEWS HEADLINE):
        Left = leftOffset + 80px, Bottom = bottomOffset + 105px, Width = barWidth - 140px, Height = 110px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 24 + mainX,
          bottom: bottomOffset + subHeight + 12,
          width: barWidth,
          height: mainHeight,
          backgroundColor: primaryColor,
          transform: 'skewX(-20deg)',
          boxShadow: '0 18px 45px rgba(220,38,38,0.5)',
        }}
      />

      {/* Subtitle / Reporter Name Bar */}
      {/* 
        TEXT-SAFE ZONE (REPORTER / SUBTITLE):
        Left = leftOffset + 80px, Bottom = bottomOffset + 20px, Width = barWidth * 0.78, Height = 72px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 24 + subX,
          bottom: bottomOffset,
          width: barWidth * 0.82,
          height: subHeight,
          backgroundColor: '#1E293B',
          transform: 'skewX(-20deg)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        }}
      />
    </AbsoluteFill>
  );
};
