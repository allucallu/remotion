import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 9. SocialCtaSwipeUp (COMPACT CTA SIZE)
 * Mood: E-commerce / promo — Chevron ganda ke atas + pill "SWIPE UP".
 * Ukuran Kompak CTA: Width = 1200px (~31%), Height = 115px
 */

interface SocialCtaSwipeUpProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaSwipeUp: React.FC<SocialCtaSwipeUpProps> = ({
  primaryColor = '#059669',
  accentColor = '#34D399',
  ctaText = 'SWIPE UP',
  delayFrame = 0,
  exitStartFrame = 170,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const pillIn = spring({ frame: localFrame, fps, config: { damping: 14, stiffness: 140, mass: 0.8 } });
  const chevron1In = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const chevron2In = spring({ frame: localFrame - 7, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const textIn = spring({ frame: localFrame - 8, fps, config: { damping: 16, stiffness: 110, mass: 0.9 } });

  const pillOut = spring({ frame: exitLocalFrame, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const chevronOut = spring({ frame: exitLocalFrame - 3, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame - 5, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });

  const pillScaleX = isExiting ? interpolate(pillOut, [0, 1], [1, 0]) : interpolate(pillIn, [0, 1], [0, 1]);
  const c1Scale = isExiting ? interpolate(chevronOut, [0, 1], [1, 0]) : chevron1In;
  const c2Scale = isExiting ? interpolate(chevronOut, [0, 1], [1, 0]) : chevron2In;
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const holdPhase = localFrame > 15 && !isExiting;
  const floatY = holdPhase ? Math.sin(localFrame * 0.12) * 8 : 0;

  const pillHeight = 115;
  const chevronContainerW = 110;
  const chevronW = 40;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: leftOffset + chevronContainerW * 0.55,
          bottom: bottomOffset,
          width: barWidth,
          height: pillHeight,
          backgroundColor: primaryColor,
          borderRadius: pillHeight / 2,
          transformOrigin: 'left center',
          transform: `scaleX(${pillScaleX})`,
          boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: leftOffset + chevronContainerW + 30,
          bottom: bottomOffset,
          width: barWidth - chevronContainerW,
          height: pillHeight,
          display: 'flex',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span style={{ fontFamily: 'sans-serif', fontWeight: 900, fontSize: 56, color: 'white', letterSpacing: 6 }}>
          {ctaText}
        </span>
      </div>

      {/* Double Chevron Up */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset + pillHeight + 12 + floatY,
          width: chevronContainerW,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div
          style={{
            width: 0, height: 0,
            borderLeft: `${chevronW * 0.65}px solid transparent`,
            borderRight: `${chevronW * 0.65}px solid transparent`,
            borderBottom: `${chevronW * 0.55}px solid ${accentColor}`,
            transform: `scale(${c2Scale})`,
            filter: `drop-shadow(0 0 8px ${accentColor}80)`,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            width: 0, height: 0,
            borderLeft: `${chevronW}px solid transparent`,
            borderRight: `${chevronW}px solid transparent`,
            borderBottom: `${chevronW * 0.65}px solid ${accentColor}`,
            transform: `scale(${c1Scale})`,
            filter: `drop-shadow(0 0 12px ${accentColor}80)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
