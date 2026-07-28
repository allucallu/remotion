import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 7. SocialCtaJoinCommunity (COMPACT CTA SIZE)
 * Mood: Community / Membership — 3 lingkaran overlapping + "JOIN US".
 * Ukuran Kompak CTA: Width = 1400px (~36%), Height = 115px
 */

interface SocialCtaJoinCommunityProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaJoinCommunity: React.FC<SocialCtaJoinCommunityProps> = ({
  primaryColor = '#475569',
  accentColor = '#0F766E',
  ctaText = 'JOIN US',
  delayFrame = 0,
  exitStartFrame = 165,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const c1In = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 160, mass: 0.6 } });
  const c2In = spring({ frame: localFrame - 4, fps, config: { damping: 9, stiffness: 150, mass: 0.7 } });
  const c3In = spring({ frame: localFrame - 8, fps, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const barIn = spring({ frame: localFrame - 6, fps, config: { damping: 14, stiffness: 120, mass: 0.9 } });
  const textIn = spring({ frame: localFrame - 10, fps, config: { damping: 16, stiffness: 100, mass: 1.0 } });

  const c1Out = spring({ frame: exitLocalFrame - 8, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const c2Out = spring({ frame: exitLocalFrame - 5, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const c3Out = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const barOut = spring({ frame: exitLocalFrame, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame - 3, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });

  const s1 = isExiting ? interpolate(c1Out, [0, 1], [1, 0]) : c1In;
  const s2 = isExiting ? interpolate(c2Out, [0, 1], [1, 0]) : c2In;
  const s3 = isExiting ? interpolate(c3Out, [0, 1], [1, 0]) : c3In;
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const circleSize = 105;
  const barHeight = 115;
  const groupWidth = circleSize * 2.2;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: leftOffset + groupWidth * 0.55,
          bottom: bottomOffset + (circleSize - barHeight) / 2 + 5,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          borderRadius: 18,
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: leftOffset + groupWidth + 30,
          bottom: bottomOffset + (circleSize - barHeight) / 2 + 5,
          width: barWidth - groupWidth,
          height: barHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 56, color: 'white', letterSpacing: 6 }}>
          {ctaText}
        </span>
      </div>

      {[
        { offset: 0, scale: s1, color: accentColor, z: 3 },
        { offset: circleSize * 0.55, scale: s2, color: '#14B8A6', z: 2 },
        { offset: circleSize * 1.1, scale: s3, color: '#2DD4BF', z: 1 },
      ].map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: leftOffset + c.offset,
            bottom: bottomOffset,
            width: circleSize,
            height: circleSize,
            borderRadius: '50%',
            backgroundColor: c.color,
            border: '4px solid rgba(255,255,255,0.3)',
            transformOrigin: 'center center',
            transform: `scale(${c.scale})`,
            zIndex: c.z + 10,
            boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
