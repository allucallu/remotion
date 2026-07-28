import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 6. SocialCtaLikeEngage (COMPACT CTA SIZE)
 * Mood: Casual engagement — Hati geometris + counter + "LIKE".
 * Ukuran Kompak CTA: Width = 1300px (~34%), Height = 110px
 */

interface SocialCtaLikeEngageProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  likeTarget?: number;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaLikeEngage: React.FC<SocialCtaLikeEngageProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#E11D48',
  ctaText = 'LIKE',
  likeTarget = 5200,
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1300,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const heartIn = spring({ frame: localFrame, fps, config: { damping: 8, stiffness: 170, mass: 0.6 } });
  const barIn = spring({ frame: localFrame - 4, fps, config: { damping: 12, stiffness: 130, mass: 0.8 } });
  const textIn = spring({ frame: localFrame - 7, fps, config: { damping: 14, stiffness: 110, mass: 0.9 } });

  const heartOut = spring({ frame: exitLocalFrame - 4, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const barOut = spring({ frame: exitLocalFrame - 2, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame, fps, config: { damping: 20, stiffness: 220, mass: 0.5 } });

  const heartScale = isExiting ? interpolate(heartOut, [0, 1], [1, 0]) : heartIn;
  const barScaleX = isExiting ? interpolate(barOut, [0, 1], [1, 0]) : interpolate(barIn, [0, 1], [0, 1]);
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const counterProgress = interpolate(localFrame, [12, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayCount = Math.floor(counterProgress * likeTarget);
  const formattedCount = displayCount >= 1000
    ? `${(displayCount / 1000).toFixed(1)}K`
    : displayCount.toString();

  const heartSize = 155;
  const barHeight = 110;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: leftOffset + heartSize * 0.5,
          bottom: bottomOffset + (heartSize - barHeight) / 2,
          width: barWidth,
          height: barHeight,
          backgroundColor: primaryColor,
          borderRadius: '0 16px 16px 0',
          transformOrigin: 'left center',
          transform: `scaleX(${barScaleX})`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: leftOffset + heartSize + 25,
          bottom: bottomOffset + (heartSize - barHeight) / 2,
          width: barWidth - heartSize,
          height: barHeight,
          display: 'flex',
          alignItems: 'center',
          gap: 30,
          opacity: textOpacity,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 56, color: 'white', letterSpacing: 5 }}>
          {ctaText}
        </span>
        <span style={{ fontFamily: 'sans-serif', fontWeight: 700, fontSize: 48, color: '#FB923C', letterSpacing: 2 }}>
          {formattedCount}
        </span>
      </div>

      {/* Abstract Heart */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: heartSize,
          height: heartSize,
          transformOrigin: 'center center',
          transform: `scale(${heartScale})`,
          zIndex: 10,
        }}
      >
        <div style={{ position: 'absolute', left: 14, top: 16, width: 65, height: 65, borderRadius: '50%', backgroundColor: accentColor }} />
        <div style={{ position: 'absolute', right: 14, top: 16, width: 65, height: 65, borderRadius: '50%', backgroundColor: accentColor }} />
        <div style={{ position: 'absolute', left: 14, top: 46, width: 0, height: 0, borderLeft: '63px solid transparent', borderRight: '63px solid transparent', borderTop: `78px solid ${accentColor}` }} />
        <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', boxShadow: `0 0 35px ${accentColor}50` }} />
      </div>
    </AbsoluteFill>
  );
};
