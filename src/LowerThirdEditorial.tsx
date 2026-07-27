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
 * 4. LowerThirdEditorial (MASSIVE 4K BROADCAST SCALE)
 * Mood: Editorial / Majalah — Minimalis ultra-sleek dengan bingkai ganda, aksen silver, & dual-tier container.
 * Ukuran 4K Gagah: Height = 270px, Width = 2400px (~63% lebar layar)
 * Text-Safe Zone:
 *   - Category Tag: Left = leftOffset + 50px, Bottom = bottomOffset + 195px, Width = 480px, Height = 55px
 *   - Main Title: Left = leftOffset + 50px, Bottom = bottomOffset + 95px, Width = barWidth - 100px, Height = 90px
 *   - Subtitle/Author: Left = leftOffset + 50px, Bottom = bottomOffset + 18px, Width = barWidth * 0.78, Height = 65px
 */
export const LowerThirdEditorial: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B', // Dark zinc slate
  accentColor = '#E4E4E7',  // Silver metallic
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 270,
  leftOffset = 220,
  bottomOffset = 260,
  barWidth = 2400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Ultra-smooth glide entrance
  const lineIn = spring({ frame: localFrame, fps, config: { damping: 18, stiffness: 100, mass: 1 } });
  const tagIn = spring({ frame: localFrame - 4, fps, config: { damping: 19, stiffness: 95, mass: 1 } });
  const mainIn = spring({ frame: localFrame - 7, fps, config: { damping: 20, stiffness: 90, mass: 1 } });
  const subIn = spring({ frame: localFrame - 10, fps, config: { damping: 21, stiffness: 85, mass: 1 } });

  const lineOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 22, stiffness: 180, mass: 0.5 } });
  const tagOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 22, stiffness: 180, mass: 0.5 } });
  const mainOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 22, stiffness: 180, mass: 0.5 } });
  const subOut = spring({ frame: exitLocalFrame, fps, config: { damping: 22, stiffness: 180, mass: 0.5 } });

  const lineScaleY = isExiting ? interpolate(lineOut, [0, 1], [1, 0]) : interpolate(lineIn, [0, 1], [0, 1]);
  const tagScaleX = isExiting ? interpolate(tagOut, [0, 1], [1, 0]) : interpolate(tagIn, [0, 1], [0, 1]);
  const mainScaleX = isExiting ? interpolate(mainOut, [0, 1], [1, 0]) : interpolate(mainIn, [0, 1], [0, 1]);
  const subScaleX = isExiting ? interpolate(subOut, [0, 1], [1, 0]) : interpolate(subIn, [0, 1], [0, 1]);

  const mainHeight = 115;
  const subHeight = 75;
  const tagHeight = 55;

  return (
    <AbsoluteFill>
      {/* Sleek Vertical Accent Line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset - 15,
          width: 8,
          height: barHeight + 30,
          backgroundColor: accentColor,
          transformOrigin: 'bottom center',
          transform: `scaleY(${lineScaleY})`,
          borderRadius: 4,
          boxShadow: '0 0 20px rgba(228,228,231,0.6)',
        }}
      />

      {/* Category / Topic Small Tag */}
      {/* 
        TEXT-SAFE ZONE (EDITORIAL TOPIC / SECTION):
        Left = leftOffset + 50px, Bottom = bottomOffset + 200px, Width = 480px, Height = 55px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 30,
          bottom: bottomOffset + barHeight - tagHeight,
          width: 500,
          height: tagHeight,
          backgroundColor: accentColor,
          borderRadius: '6px 6px 0 0',
          transformOrigin: 'left center',
          transform: `scaleX(${tagScaleX})`,
        }}
      />

      {/* Main Editorial Container */}
      {/* 
        TEXT-SAFE ZONE (ARTICLE / AUTHOR NAME):
        Left = leftOffset + 50px, Bottom = bottomOffset + 98px, Width = barWidth - 100px, Height = 90px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 30,
          bottom: bottomOffset + subHeight + 12,
          width: barWidth,
          height: mainHeight,
          backgroundColor: `${primaryColor}F8`,
          borderRadius: '0 8px 8px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${mainScaleX})`,
          boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
          borderBottom: `3px solid ${accentColor}50`,
        }}
      />

      {/* Subtitle / Publication Bar */}
      {/* 
        TEXT-SAFE ZONE (PUBLICATION / DATE / ROLE):
        Left = leftOffset + 50px, Bottom = bottomOffset + 18px, Width = barWidth * 0.78, Height = 65px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 30,
          bottom: bottomOffset,
          width: barWidth * 0.80,
          height: subHeight,
          backgroundColor: `${primaryColor}D8`,
          borderRadius: '0 6px 6px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${subScaleX})`,
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        }}
      />
    </AbsoluteFill>
  );
};
