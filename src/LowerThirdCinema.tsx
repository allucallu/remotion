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
 * 6. LowerThirdCinema (MASSIVE 4K BROADCAST SCALE)
 * Mood: Dokumenter / Film — Frame garis ganda elegan dengan bilah kaca es transparan & corner brackets.
 * Ukuran 4K Gagah: Height = 290px, Width = 2500px (~65% lebar layar)
 * Text-Safe Zone:
 *   - Film Speaker Title: Left = leftOffset + 80px, Bottom = bottomOffset + 115px, Width = barWidth - 160px, Height = 100px
 *   - Film Subtitle/Role: Left = leftOffset + 80px, Bottom = bottomOffset + 28px, Width = barWidth * 0.78, Height = 68px
 */
export const LowerThirdCinema: React.FC<LowerThirdProps> = ({
  primaryColor = 'rgba(15, 23, 42, 0.88)', // Dark frosted glass
  accentColor = '#EAB308',                 // Metallic Cinema Gold
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 290,
  leftOffset = 200,
  bottomOffset = 260,
  barWidth = 2500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Elegant cinematographic springs
  const topIn = spring({ frame: localFrame, fps, config: { damping: 16, stiffness: 110, mass: 1 } });
  const glassIn = spring({ frame: localFrame - 4, fps, config: { damping: 18, stiffness: 90, mass: 1 } });
  const botIn = spring({ frame: localFrame - 8, fps, config: { damping: 16, stiffness: 110, mass: 1 } });

  const topOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 180, mass: 0.5 } });
  const glassOut = spring({ frame: exitLocalFrame - 3, fps, config: { damping: 20, stiffness: 180, mass: 0.5 } });
  const botOut = spring({ frame: exitLocalFrame - 6, fps, config: { damping: 20, stiffness: 180, mass: 0.5 } });

  const topScaleX = isExiting ? interpolate(topOut, [0, 1], [1, 0]) : interpolate(topIn, [0, 1], [0, 1]);
  const glassOpacity = isExiting ? interpolate(glassOut, [0, 1], [1, 0]) : interpolate(glassIn, [0, 1], [0, 1]);
  const botScaleX = isExiting ? interpolate(botOut, [0, 1], [1, 0]) : interpolate(botIn, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      {/* Top Gold Framing Line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + barHeight + 14,
          width: barWidth,
          height: 4,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${topScaleX})`,
          boxShadow: '0 0 16px rgba(234,179,8,0.6)',
        }}
      />

      {/* Main Frosted Glass Container */}
      {/* 
        TEXT-SAFE ZONE (FILM SUBJECT / INTERVIEWEE NAME):
        Left = leftOffset + 80px, Bottom = bottomOffset + 115px, Width = barWidth - 160px, Height = 100px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          backdropFilter: 'blur(24px)',
          borderRadius: 8,
          opacity: glassOpacity,
          boxShadow: '0 20px 50px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.2)',
          borderLeft: `6px solid ${accentColor}`,
        }}
      />

      {/* Bottom Gold Framing Line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset - 16,
          width: barWidth * 0.78,
          height: 4,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${botScaleX})`,
          boxShadow: '0 0 16px rgba(234,179,8,0.6)',
        }}
      />
    </AbsoluteFill>
  );
};
