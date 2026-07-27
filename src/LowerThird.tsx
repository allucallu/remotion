import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface LowerThirdProps {
  /** Main bar color (the "name" bar) */
  primaryColor?: string;
  /** Accent color (the thin line/tab) */
  accentColor?: string;
  /** Frame at which the entrance animation starts */
  delayFrame?: number;
  /** Frame at which the exit animation starts (relative to timeline, not delayFrame) */
  exitStartFrame?: number;
  /** Overall bar height in px */
  barHeight?: number;
  /** Position from left edge in px */
  leftOffset?: number;
  /** Position from bottom in px (distance from bottom of frame) */
  bottomOffset?: number;
  /** Width of the main bar in px (this is the "container" buyers will key text into) */
  barWidth?: number;
}

/**
 * SHAPE-ONLY lower third — no text is rendered here on purpose.
 *
 * This component is meant to be rendered with an alpha channel
 * (ProRes 4444 / PNG sequence), so the buyer can key it over their own
 * footage and add their own text on top in Premiere/DaVinci/After Effects.
 *
 * Nothing here represents a real object (no icons), so every shape is
 * pure geometry — safe from "AI drew the wrong thing" problems.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  primaryColor = '#1B1F3B',
  accentColor = '#3DDC97',
  delayFrame = 0,
  exitStartFrame = 120,
  barHeight = 90,
  leftOffset = 80,
  bottomOffset = 220,
  barWidth = 640,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delayFrame;

  // --- Entrance: accent tab shoots in first, then the main bar follows ---
  const tabIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.6 },
  });

  const barIn = spring({
    frame: localFrame - 4, // slight stagger after the tab
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });

  // --- Exit: reverse wipe, slightly faster than the entrance ---
  const exitLocalFrame = frame - exitStartFrame;
  const barOut = spring({
    frame: exitLocalFrame,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.5 },
  });
  const tabOut = spring({
    frame: exitLocalFrame - 3,
    fps,
    config: { damping: 20, stiffness: 200, mass: 0.5 },
  });

  const isExiting = frame >= exitStartFrame;

  // Bar horizontal offset: off-screen (negative) -> in place (0) -> off-screen again on exit
  const barTranslateX = isExiting
    ? interpolate(barOut, [0, 1], [0, -(barWidth + leftOffset + 40)])
    : interpolate(barIn, [0, 1], [-(barWidth + leftOffset + 40), 0]);

  const tabTranslateX = isExiting
    ? interpolate(tabOut, [0, 1], [0, -(barWidth + leftOffset + 40)])
    : interpolate(tabIn, [0, 1], [-(barWidth + leftOffset + 40), 0]);

  // Accent tab is a bit narrower and sits slightly above/left of the main bar
  const tabWidth = barWidth * 0.35;
  const tabHeight = barHeight * 0.4;

  return (
    <AbsoluteFill>
      {/* Accent tab (thin line/label area) */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + tabTranslateX,
          bottom: bottomOffset + barHeight - tabHeight / 2,
          width: tabWidth,
          height: tabHeight,
          backgroundColor: accentColor,
          borderRadius: 6,
        }}
      />

      {/* Main bar — this empty rectangle is where the buyer keys their text */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + barTranslateX,
          bottom: bottomOffset,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}
      />
    </AbsoluteFill>
  );
};
