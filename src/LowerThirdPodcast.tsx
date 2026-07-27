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
 * 5. LowerThirdPodcast (MASSIVE 4K BROADCAST SCALE)
 * Mood: YouTube / Podcast — 3-layer bouncy stacked cards dengan avatar circle holder & deep 3D drop-shadow.
 * Ukuran 4K Gagah: Height = 310px, Width = 2450px (~64% lebar layar)
 * Text-Safe Zone:
 *   - Avatar Circle Holder (Left): Left = leftOffset + 24px, Bottom = bottomOffset + 50px, Size = 210px
 *   - Main Card (Host/Guest): Left = leftOffset + 270px, Bottom = bottomOffset + 130px, Width = barWidth - 300px, Height = 105px
 *   - Sub Card (Handle/Channel): Left = leftOffset + 270px, Bottom = bottomOffset + 24px, Width = barWidth * 0.65, Height = 75px
 */
export const LowerThirdPodcast: React.FC<LowerThirdProps> = ({
  primaryColor = '#7C3AED', // Vibrant Purple
  accentColor = '#F43F5E',  // Bouncy Rose Pink
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 310,
  leftOffset = 200,
  bottomOffset = 240,
  barWidth = 2450,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Playful bouncy spring overshoot physics
  const avatarIn = spring({ frame: localFrame, fps, config: { damping: 8, stiffness: 160, mass: 0.7 } });
  const card1In = spring({ frame: localFrame - 4, fps, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const card2In = spring({ frame: localFrame - 8, fps, config: { damping: 10, stiffness: 120, mass: 0.8 } });

  const avatarOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 16, stiffness: 220, mass: 0.5 } });
  const card1Out = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 16, stiffness: 220, mass: 0.5 } });
  const card2Out = spring({ frame: exitLocalFrame, fps, config: { damping: 16, stiffness: 220, mass: 0.5 } });

  const scaleAvatar = isExiting ? interpolate(avatarOut, [0, 1], [1, 0]) : avatarIn;
  const scale1 = isExiting ? interpolate(card1Out, [0, 1], [1, 0]) : card1In;
  const scale2 = isExiting ? interpolate(card2Out, [0, 1], [1, 0]) : card2In;

  const avatarSize = 220;
  const mainHeight = 135;
  const subHeight = 90;

  return (
    <AbsoluteFill>
      {/* Sub Handle Card */}
      {/* 
        TEXT-SAFE ZONE (PODCAST HANDLE / CHANNEL / SOCIAL):
        Left = leftOffset + 270px, Bottom = bottomOffset + 24px, Width = barWidth * 0.65, Height = 75px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 220,
          bottom: bottomOffset,
          width: barWidth * 0.70,
          height: subHeight,
          backgroundColor: accentColor,
          borderRadius: 22,
          transformOrigin: 'left bottom',
          transform: `scale(${scale2})`,
          boxShadow: '0 12px 30px rgba(244,63,94,0.45)',
        }}
      />

      {/* Main Host Name Card */}
      {/* 
        TEXT-SAFE ZONE (HOST / GUEST NAME):
        Left = leftOffset + 270px, Bottom = bottomOffset + 130px, Width = barWidth - 300px, Height = 105px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 220,
          bottom: bottomOffset + subHeight + 15,
          width: barWidth - 220,
          height: mainHeight,
          backgroundColor: primaryColor,
          borderRadius: 24,
          transformOrigin: 'left bottom',
          transform: `scale(${scale1})`,
          boxShadow: '0 20px 45px rgba(124,58,237,0.5)',
        }}
      />

      {/* Avatar Circle Holder (Buyer can key photo/logo inside) */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + 20,
          width: avatarSize,
          height: avatarSize,
          borderRadius: '50%',
          backgroundColor: '#0F172A',
          border: `8px solid ${accentColor}`,
          transformOrigin: 'center center',
          transform: `scale(${scaleAvatar})`,
          boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
          zIndex: 10,
        }}
      />
    </AbsoluteFill>
  );
};
