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
 * 1. LowerThirdCorporate (MASSIVE 4K BROADCAST SCALE)
 * Mood: Corporate Formal — Multi-layered glassmorphism dengan tag departemen terpisah & aksen garis bersinar.
 * Ukuran 4K Gagah: Height = 280px, Width = 2400px (~63% lebar layar)
 * Text-Safe Zone:
 *   - Department/Category Tag: Left = leftOffset + 32px, Bottom = bottomOffset + 210px, Width = 520px, Height = 60px
 *   - Main Name Bar: Left = leftOffset + 32px, Bottom = bottomOffset + 95px, Width = barWidth - 80px, Height = 105px (Fits 72-90px Font)
 *   - Subtitle/Role Bar: Left = leftOffset + 32px, Bottom = bottomOffset + 18px, Width = barWidth * 0.75, Height = 70px (Fits 48-60px Font)
 */
export const LowerThirdCorporate: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#38BDF8',
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 280,
  leftOffset = 200,
  bottomOffset = 260,
  barWidth = 2400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered physics for 4 layers
  const tagIn = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 160, mass: 0.6 } });
  const lineIn = spring({ frame: localFrame - 3, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
  const mainBarIn = spring({ frame: localFrame - 6, fps, config: { damping: 16, stiffness: 120, mass: 0.8 } });
  const subBarIn = spring({ frame: localFrame - 9, fps, config: { damping: 18, stiffness: 100, mass: 0.9 } });

  const tagOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const lineOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const mainBarOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const subBarOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });

  const offX = -(barWidth + leftOffset + 150);

  const tagX = isExiting ? interpolate(tagOut, [0, 1], [0, offX]) : interpolate(tagIn, [0, 1], [offX, 0]);
  const lineX = isExiting ? interpolate(lineOut, [0, 1], [0, offX]) : interpolate(lineIn, [0, 1], [offX, 0]);
  const mainX = isExiting ? interpolate(mainBarOut, [0, 1], [0, offX]) : interpolate(mainBarIn, [0, 1], [offX, 0]);
  const subX = isExiting ? interpolate(subBarOut, [0, 1], [0, offX]) : interpolate(subBarIn, [0, 1], [offX, 0]);

  const mainHeight = 120;
  const subHeight = 80;
  const tagHeight = 60;

  return (
    <AbsoluteFill>
      {/* Layer 1: Top Small Department/Category Tag */}
      {/* 
        TEXT-SAFE ZONE (DEPARTMENT / CATEGORY TAG):
        Left = leftOffset + 32px, Bottom = bottomOffset + 215px, Width = 520px, Height = 58px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 32 + tagX,
          bottom: bottomOffset + barHeight - tagHeight,
          width: 540,
          height: tagHeight,
          backgroundColor: accentColor,
          borderRadius: '10px 10px 0 0',
          boxShadow: '0 6px 20px rgba(56,189,248,0.45)',
        }}
      />

      {/* Layer 2: Accent Vertical Line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + lineX,
          bottom: bottomOffset,
          width: 18,
          height: barHeight + 18,
          backgroundColor: accentColor,
          borderRadius: 9,
          boxShadow: '0 0 25px rgba(56,189,248,0.7)',
        }}
      />

      {/* Layer 3: Main Name Bar (Glassmorphism + Metallic Border) */}
      {/* 
        TEXT-SAFE ZONE (MAIN NAME / EXECUTIVE TITLE):
        Left = leftOffset + 40px, Bottom = bottomOffset + 98px, Width = barWidth - 100px, Height = 105px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 32 + mainX,
          bottom: bottomOffset + subHeight + 12,
          width: barWidth,
          height: mainHeight,
          backgroundColor: `${primaryColor}F5`,
          backdropFilter: 'blur(20px)',
          borderRadius: '0 12px 12px 0',
          borderLeft: `6px solid ${accentColor}`,
          boxShadow: '0 20px 45px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.2)',
        }}
      />

      {/* Layer 4: Subtitle / Role Bar */}
      {/* 
        TEXT-SAFE ZONE (SUBTITLE / ROLE / COMPANY):
        Left = leftOffset + 40px, Bottom = bottomOffset + 18px, Width = barWidth * 0.75, Height = 68px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 32 + subX,
          bottom: bottomOffset,
          width: barWidth * 0.78,
          height: subHeight,
          backgroundColor: `${primaryColor}D9`,
          backdropFilter: 'blur(16px)',
          borderRadius: '0 10px 10px 0',
          boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        }}
      />
    </AbsoluteFill>
  );
};
