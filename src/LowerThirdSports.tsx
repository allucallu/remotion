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
 * 7. LowerThirdSports (MASSIVE 4K BROADCAST SCALE)
 * Mood: Olahraga / Action — Parallelogram tajam & agresif dengan tag stat terpisah & gerakan staggered kencang.
 * Ukuran 4K Gagah: Height = 310px, Width = 2600px (~68% lebar layar)
 * Text-Safe Zone:
 *   - Athlete Stat / Jersey Tag: Left = leftOffset + 80px, Bottom = bottomOffset + 225px, Width = 520px, Height = 65px
 *   - Primary Athlete Name: Left = leftOffset + 100px, Bottom = bottomOffset + 115px, Width = barWidth - 160px, Height = 100px
 *   - Secondary Team / Position: Left = leftOffset + 100px, Bottom = bottomOffset + 24px, Width = barWidth * 0.78, Height = 72px
 */
export const LowerThirdSports: React.FC<LowerThirdProps> = ({
  primaryColor = '#1E1B4B', // Aggressive deep indigo
  accentColor = '#FACC15',  // Energetic electric yellow
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 310,
  leftOffset = 240,
  bottomOffset = 220,
  barWidth = 2600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // High-stiffness aggressive sports springs
  const tagIn = spring({ frame: localFrame, fps, config: { damping: 13, stiffness: 250, mass: 0.4 } });
  const bg1In = spring({ frame: localFrame - 3, fps, config: { damping: 14, stiffness: 230, mass: 0.5 } });
  const bg2In = spring({ frame: localFrame - 6, fps, config: { damping: 15, stiffness: 210, mass: 0.6 } });
  const subIn = spring({ frame: localFrame - 9, fps, config: { damping: 16, stiffness: 190, mass: 0.7 } });

  const tagOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 20, stiffness: 260, mass: 0.4 } });
  const bg1Out = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 260, mass: 0.4 } });
  const bg2Out = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 260, mass: 0.4 } });
  const subOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 260, mass: 0.4 } });

  const offX = -(barWidth + leftOffset + 200);

  const tagX = isExiting ? interpolate(tagOut, [0, 1], [0, offX]) : interpolate(tagIn, [0, 1], [offX, 0]);
  const x1 = isExiting ? interpolate(bg1Out, [0, 1], [0, offX]) : interpolate(bg1In, [0, 1], [offX, 0]);
  const x2 = isExiting ? interpolate(bg2Out, [0, 1], [0, offX]) : interpolate(bg2In, [0, 1], [offX, 0]);
  const x3 = isExiting ? interpolate(subOut, [0, 1], [0, offX]) : interpolate(subIn, [0, 1], [offX, 0]);

  const tagHeight = 72;
  const mainHeight = 130;
  const subHeight = 85;

  return (
    <AbsoluteFill>
      {/* Top Jersey / Stat Slant Tag */}
      {/* 
        TEXT-SAFE ZONE (JERSEY NUMBER / PLAYER STAT):
        Left = leftOffset + 80px, Bottom = bottomOffset + 225px, Width = 520px, Height = 65px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 50 + tagX,
          bottom: bottomOffset + barHeight - tagHeight,
          width: 550,
          height: tagHeight,
          backgroundColor: accentColor,
          transform: 'skewX(-25deg)',
          boxShadow: '0 8px 24px rgba(250,204,21,0.45)',
        }}
      />

      {/* Accent Slant Bar */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + x1,
          bottom: bottomOffset - 10,
          width: barWidth + 50,
          height: barHeight + 20,
          backgroundColor: accentColor,
          transform: 'skewX(-25deg)',
          boxShadow: '0 12px 35px rgba(250,204,21,0.35)',
        }}
      />

      {/* Main Action Parallelogram Bar */}
      {/* 
        TEXT-SAFE ZONE (ATHLETE NAME):
        Left = leftOffset + 100px, Bottom = bottomOffset + 115px, Width = barWidth - 160px, Height = 100px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 28 + x2,
          bottom: bottomOffset + subHeight + 14,
          width: barWidth,
          height: mainHeight,
          backgroundColor: primaryColor,
          transform: 'skewX(-25deg)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        }}
      />

      {/* Subtitle Team / Stat Bar */}
      {/* 
        TEXT-SAFE ZONE (TEAM / ROLE / STAT):
        Left = leftOffset + 100px, Bottom = bottomOffset + 24px, Width = barWidth * 0.78, Height = 72px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 28 + x3,
          bottom: bottomOffset,
          width: barWidth * 0.82,
          height: subHeight,
          backgroundColor: '#020617',
          transform: 'skewX(-25deg)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
        }}
      />
    </AbsoluteFill>
  );
};
