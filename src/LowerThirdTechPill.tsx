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
 * 3. LowerThirdTechPill (MASSIVE 4K BROADCAST SCALE)
 * Mood: Modern Tech / Startup — Kapsul kaca tebal dengan gradien neon, dot berdenyut, dan sub-pill status tag.
 * Ukuran 4K Gagah: Height = 270px, Width = 2400px (~63% lebar layar)
 * Text-Safe Zone:
 *   - Main Pill Title: Left = leftOffset + 180px, Bottom = bottomOffset + 110px, Width = barWidth - 280px, Height = 105px
 *   - Sub Pill Handle: Left = leftOffset + 180px, Bottom = bottomOffset + 24px, Width = barWidth * 0.65, Height = 60px
 */
export const LowerThirdTechPill: React.FC<LowerThirdProps> = ({
  primaryColor = '#0284C7', // Deep Tech Cyan
  accentColor = '#38BDF8',  // Glowing Light Cyan
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 270,
  leftOffset = 200,
  bottomOffset = 260,
  barWidth = 2400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Elastic pill entrance
  const mainPillIn = spring({ frame: localFrame, fps, config: { damping: 13, stiffness: 140, mass: 0.7 } });
  const subPillIn = spring({ frame: localFrame - 4, fps, config: { damping: 15, stiffness: 120, mass: 0.8 } });
  const dotIn = spring({ frame: localFrame - 7, fps, config: { damping: 10, stiffness: 180, mass: 0.5 } });

  const mainPillOut = spring({ frame: exitLocalFrame - 3, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const subPillOut = spring({ frame: exitLocalFrame, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const dotOut = spring({ frame: exitLocalFrame - 5, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });

  const scaleMainX = isExiting ? interpolate(mainPillOut, [0, 1], [1, 0]) : interpolate(mainPillIn, [0, 1], [0, 1]);
  const scaleSubX = isExiting ? interpolate(subPillOut, [0, 1], [1, 0]) : interpolate(subPillIn, [0, 1], [0, 1]);
  const dotScale = isExiting ? interpolate(dotOut, [0, 1], [1, 0]) : interpolate(dotIn, [0, 1], [0, 1]);

  const mainHeight = 150;
  const subHeight = 85;

  return (
    <AbsoluteFill>
      {/* Sub Pill / Status Tag (Sits Below Main Pill) */}
      {/* 
        TEXT-SAFE ZONE (SUB PILL / HANDLE / ROLE):
        Left = leftOffset + 180px, Bottom = bottomOffset + 24px, Width = barWidth * 0.65, Height = 60px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 30,
          bottom: bottomOffset,
          width: barWidth * 0.72,
          height: subHeight,
          backgroundColor: '#0F172A',
          border: `3px solid ${accentColor}80`,
          borderRadius: subHeight / 2,
          transformOrigin: 'left center',
          transform: `scaleX(${scaleSubX})`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        }}
      />

      {/* Main Pill Container (Glassmorphism + Glow Rim) */}
      {/* 
        TEXT-SAFE ZONE (MAIN TECH TITLE / SPEAKER NAME):
        Left = leftOffset + 180px, Bottom = bottomOffset + 110px, Width = barWidth - 280px, Height = 105px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + subHeight + 15,
          width: barWidth,
          height: mainHeight,
          background: `linear-gradient(135deg, ${primaryColor}F5 0%, #0369A1 100%)`,
          borderRadius: mainHeight / 2,
          transformOrigin: 'left center',
          transform: `scaleX(${scaleMainX})`,
          boxShadow: '0 18px 45px rgba(2,132,199,0.5), inset 0 2px 0 rgba(255,255,255,0.35)',
        }}
      >
        {/* Floating Pulsing Accent Dot inside the left edge */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 30,
            width: mainHeight - 60,
            height: mainHeight - 60,
            borderRadius: '50%',
            backgroundColor: accentColor,
            transform: `scale(${dotScale})`,
            boxShadow: '0 0 30px rgba(56,189,248,0.9), inset 0 0 12px #FFFFFF',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
