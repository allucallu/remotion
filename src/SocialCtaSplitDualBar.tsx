import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 8. SocialCtaSplitDualBar (COMPACT CTA SIZE)
 * Mood: Multi-platform handle — 2 bar split slide dari arah berlawanan.
 * Ukuran Kompak CTA: Width = 1500px (~39%), topHeight = 100px, botHeight = 85px
 */

interface SocialCtaSplitDualBarProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  subText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaSplitDualBar: React.FC<SocialCtaSplitDualBarProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#D97706',
  ctaText = 'FOLLOW US',
  subText = '@yourhandle',
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 300,
  barWidth = 1500,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const topIn = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 150, mass: 0.7 } });
  const lineIn = spring({ frame: localFrame - 4, fps, config: { damping: 12, stiffness: 180, mass: 0.5 } });
  const botIn = spring({ frame: localFrame - 6, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });

  const topOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const lineOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const botOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });

  const offLeft = -(barWidth + leftOffset + 200);
  const offRight = 3840 + 200;

  const topX = isExiting ? interpolate(topOut, [0, 1], [0, offLeft]) : interpolate(topIn, [0, 1], [offLeft, 0]);
  const botX = isExiting ? interpolate(botOut, [0, 1], [0, offRight - leftOffset]) : interpolate(botIn, [0, 1], [offRight - leftOffset, 0]);
  const lineScaleX = isExiting ? interpolate(lineOut, [0, 1], [1, 0]) : interpolate(lineIn, [0, 1], [0, 1]);

  const topHeight = 100;
  const botHeight = 85;
  const gap = 8;

  return (
    <AbsoluteFill>
      {/* Top Bar — slides from LEFT */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + topX,
          bottom: bottomOffset + botHeight + gap,
          width: barWidth,
          height: topHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 12px 12px 0',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 40,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 54, color: 'white', letterSpacing: 6 }}>
          {ctaText}
        </span>
      </div>

      {/* Accent Divider */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 25,
          bottom: bottomOffset + botHeight + gap / 2 - 2,
          width: barWidth * 0.85,
          height: 4,
          backgroundColor: accentColor,
          transformOrigin: 'left center',
          transform: `scaleX(${lineScaleX})`,
          borderRadius: 2,
          boxShadow: `0 0 12px ${accentColor}80`,
        }}
      />

      {/* Bottom Bar — slides from RIGHT */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + botX,
          bottom: bottomOffset,
          width: barWidth * 0.78,
          height: botHeight,
          backgroundColor: '#1E293B',
          borderRadius: '0 10px 10px 0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 40,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 46, color: accentColor, letterSpacing: 3 }}>
          {subText}
        </span>
      </div>
    </AbsoluteFill>
  );
};
