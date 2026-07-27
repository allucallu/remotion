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
 * 9. LowerThirdCreative (MASSIVE 4K BROADCAST SCALE)
 * Mood: Art / Portfolio — Kartu asimetris bertingkat 3-layer dengan rotasi mikro & depth shadow tebal.
 * Ukuran 4K Gagah: Height = 290px, Width = 2400px (~63% lebar layar)
 * Text-Safe Zone:
 *   - Category / Social Card: Left = leftOffset + 150px, Bottom = bottomOffset + 20px, Width = barWidth * 0.72, Height = 70px
 *   - Main Artist Name Card: Left = leftOffset + 50px, Bottom = bottomOffset + 115px, Width = barWidth - 150px, Height = 105px
 */
export const LowerThirdCreative: React.FC<LowerThirdProps> = ({
  primaryColor = '#312E81', // Deep indigo creative
  accentColor = '#F472B6',  // Modern pink accent
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 290,
  leftOffset = 200,
  bottomOffset = 240,
  barWidth = 2400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered smooth scale/translate springs
  const bg1In = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 140, mass: 0.7 } });
  const bg2In = spring({ frame: localFrame - 4, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });

  const bg1Out = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });
  const bg2Out = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 200, mass: 0.5 } });

  const offX = -(barWidth + leftOffset + 150);

  const x1 = isExiting ? interpolate(bg1Out, [0, 1], [0, offX]) : interpolate(bg1In, [0, 1], [offX, 0]);
  const x2 = isExiting ? interpolate(bg2Out, [0, 1], [0, offX]) : interpolate(bg2In, [0, 1], [offX, 0]);

  const mainHeight = 130;
  const subHeight = 85;

  return (
    <AbsoluteFill>
      {/* Offset Accent Sub Card */}
      {/* 
        TEXT-SAFE ZONE (CREATIVE INSTAGRAM / HANDLE / PORTFOLIO LINK):
        Left = leftOffset + 150px, Bottom = bottomOffset + 20px, Width = barWidth * 0.72, Height = 70px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 120 + x2,
          bottom: bottomOffset,
          width: barWidth * 0.75,
          height: subHeight,
          backgroundColor: accentColor,
          borderRadius: 16,
          boxShadow: '0 12px 35px rgba(244,114,182,0.45)',
        }}
      />

      {/* Main Primary Creative Card */}
      {/* 
        TEXT-SAFE ZONE (ARTIST / CREATIVE DIRECTOR NAME):
        Left = leftOffset + 50px, Bottom = bottomOffset + 115px, Width = barWidth - 150px, Height = 105px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + x1,
          bottom: bottomOffset + subHeight + 15,
          width: barWidth,
          height: mainHeight,
          backgroundColor: primaryColor,
          borderRadius: 18,
          boxShadow: '0 20px 50px rgba(0,0,0,0.55)',
          borderLeft: `8px solid ${accentColor}`,
        }}
      />
    </AbsoluteFill>
  );
};
