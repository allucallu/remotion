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
 * 10. LowerThirdCyberTech (MASSIVE 4K BROADCAST SCALE)
 * Mood: Gaming / Cyberpunk — Bilah multi-segment futuristik dengan aksen garis neon berdenyut & HUD corner brackets.
 * Ukuran 4K Gagah: Height = 285px, Width = 2500px (~65% lebar layar)
 * Text-Safe Zone:
 *   - Gamer Tag / Title Area: Left = leftOffset + 80px, Bottom = bottomOffset + 110px, Width = barWidth - 160px, Height = 95px
 *   - Sub Streamer / Role Area: Left = leftOffset + 80px, Bottom = bottomOffset + 20px, Width = barWidth * 0.75, Height = 65px
 */
export const LowerThirdCyberTech: React.FC<LowerThirdProps> = ({
  primaryColor = '#09090B', // Cyber black
  accentColor = '#22C55E',  // Neon cyber green
  delayFrame = 0,
  exitStartFrame = 135,
  barHeight = 285,
  leftOffset = 200,
  bottomOffset = 260,
  barWidth = 2500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Futuristic tech wipe springs
  const lineIn = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 220, mass: 0.5 } });
  const barIn = spring({ frame: localFrame - 3, fps, config: { damping: 15, stiffness: 180, mass: 0.6 } });
  const subIn = spring({ frame: localFrame - 6, fps, config: { damping: 17, stiffness: 150, mass: 0.7 } });

  const lineOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 250, mass: 0.4 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 250, mass: 0.4 } });
  const subOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 250, mass: 0.4 } });

  const lineScaleX = isExiting ? interpolate(lineOut, [0, 1], [1, 0]) : interpolate(lineIn, [0, 1], [0, 1]);
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const subScaleX = isExiting ? interpolate(subOut, [0, 1], [1, 0]) : interpolate(subIn, [0, 1], [0, 1]);

  const mainHeight = 130;
  const subHeight = 75;

  return (
    <AbsoluteFill>
      {/* Top Neon Accent Line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + barHeight + 8,
          width: barWidth * 0.45,
          height: 6,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${lineScaleX})`,
          boxShadow: `0 0 20px ${accentColor}`,
        }}
      />

      {/* Main Cyber Bar Container */}
      {/* 
        TEXT-SAFE ZONE (GAMER TAG / STREAMER NAME / TITLE):
        Left = leftOffset + 80px, Bottom = bottomOffset + 110px, Width = barWidth - 160px, Height = 95px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + subHeight + 12,
          width: barWidth,
          height: mainHeight,
          backgroundColor: primaryColor,
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          borderRadius: '0 16px 0 16px',
          borderLeft: `10px solid ${accentColor}`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.75), inset 0 0 25px rgba(34,197,94,0.2)',
        }}
      />

      {/* Sub Streamer / Role Segment */}
      {/* 
        TEXT-SAFE ZONE (SUB STREAMER / ROLE / STAT):
        Left = leftOffset + 80px, Bottom = bottomOffset + 20px, Width = barWidth * 0.75, Height = 65px
      */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: barWidth * 0.78,
          height: subHeight,
          backgroundColor: '#18181B',
          transformOrigin: 'left center',
          transform: `scaleX(${subScaleX})`,
          borderRadius: '0 10px 0 10px',
          borderLeft: `6px solid ${accentColor}80`,
          boxShadow: '0 10px 25px rgba(0,0,0,0.45)',
        }}
      />

      {/* Bottom Tech Corner Notch */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + barWidth - 60,
          bottom: bottomOffset - 8,
          width: 60,
          height: 8,
          backgroundColor: accentColor,
          transformOrigin: 'right center',
          transform: `scaleX(${lineScaleX})`,
          boxShadow: `0 0 16px ${accentColor}`,
        }}
      />
    </AbsoluteFill>
  );
};
