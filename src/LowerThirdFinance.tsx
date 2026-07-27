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
 * 8. LowerThirdFinance (MASSIVE 4K BROADCAST SCALE)
 * Mood: Finance / Business — Bingkai L-shape ganda tebal dengan aksen indikator tren & wadah 2 tingkat.
 * Ukuran 4K Gagah: Height = 280px, Width = 2450px (~64% lebar layar)
 * Text-Safe Zone:
 *   - Finance Executive Title: Left = leftOffset + 50px, Bottom = bottomOffset + 110px, Width = barWidth - 120px, Height = 95px
 *   - Market / Company Subtitle: Left = leftOffset + 50px, Bottom = bottomOffset + 20px, Width = barWidth * 0.75, Height = 65px
 */
export const LowerThirdFinance: React.FC<LowerThirdProps> = ({
  primaryColor = '#064E3B', // Emerald green finance
  accentColor = '#34D399',  // Bright mint green accent
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 280,
  leftOffset = 200,
  bottomOffset = 260,
  barWidth = 2450,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Professional crisp spring physics
  const frameIn = spring({ frame: localFrame, fps, config: { damping: 15, stiffness: 160, mass: 0.7 } });
  const cardIn = spring({ frame: localFrame - 4, fps, config: { damping: 17, stiffness: 130, mass: 0.8 } });
  const subIn = spring({ frame: localFrame - 7, fps, config: { damping: 18, stiffness: 110, mass: 0.9 } });

  const frameOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const cardOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const subOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });

  const offX = -(barWidth + leftOffset + 120);

  const frameX = isExiting ? interpolate(frameOut, [0, 1], [0, offX]) : interpolate(frameIn, [0, 1], [offX, 0]);
  const cardX = isExiting ? interpolate(cardOut, [0, 1], [0, offX]) : interpolate(cardIn, [0, 1], [offX, 0]);
  const subX = isExiting ? interpolate(subOut, [0, 1], [0, offX]) : interpolate(subIn, [0, 1], [offX, 0]);

  const mainHeight = 120;
  const subHeight = 80;

  return (
    <AbsoluteFill>
      {/* Heavy L-Shape Accent Frame Corner */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + frameX,
          bottom: bottomOffset - 15,
          width: 16,
          height: barHeight + 30,
          backgroundColor: accentColor,
          borderRadius: 4,
          boxShadow: '0 0 25px rgba(52,211,153,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: leftOffset + frameX,
          bottom: bottomOffset - 15,
          width: barWidth * 0.45,
          height: 16,
          backgroundColor: accentColor,
          borderRadius: 4,
          boxShadow: '0 0 25px rgba(52,211,153,0.6)',
        }}
      />

      {/* Main Primary Finance Container */}
      {/* 
        TEXT-SAFE ZONE (EXECUTIVE / STOCK / COMPANY NAME):
        Left = leftOffset + 50px, Bottom = bottomOffset + 110px, Width = barWidth - 120px, Height = 95px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 32 + cardX,
          bottom: bottomOffset + subHeight + 12,
          width: barWidth,
          height: mainHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 12px 12px 0',
          boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
          borderLeft: `6px solid ${accentColor}`,
        }}
      />

      {/* Sub Title Container */}
      {/* 
        TEXT-SAFE ZONE (MARKET ROLE / FINANCIAL STATS):
        Left = leftOffset + 50px, Bottom = bottomOffset + 20px, Width = barWidth * 0.75, Height = 65px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 32 + subX,
          bottom: bottomOffset,
          width: barWidth * 0.78,
          height: subHeight,
          backgroundColor: '#0F172A',
          borderRadius: '0 8px 8px 0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      />
    </AbsoluteFill>
  );
};
