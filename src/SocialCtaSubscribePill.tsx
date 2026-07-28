import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 1. SocialCtaSubscribePill (COMPACT CTA SIZE)
 * Mood: YouTuber santai / casual content — Kapsul rounded pill + segitiga play abstrak.
 * Ukuran Kompak CTA: Width = 1400px (~36% lebar layar), Height = 120px
 */

interface SocialCtaSubscribePillProps {
  primaryColor?: string;
  accentColor?: string;
  ctaText?: string;
  delayFrame?: number;
  exitStartFrame?: number;
  leftOffset?: number;
  bottomOffset?: number;
  barWidth?: number;
}

export const SocialCtaSubscribePill: React.FC<SocialCtaSubscribePillProps> = ({
  primaryColor = '#0D9488',
  accentColor = '#F97316',
  ctaText = 'SUBSCRIBE',
  delayFrame = 0,
  exitStartFrame = 135,
  leftOffset = 200,
  bottomOffset = 320,
  barWidth = 1400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  const pillIn = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const triangleIn = spring({ frame: localFrame - 5, fps, config: { damping: 8, stiffness: 160, mass: 0.6 } });
  const textIn = spring({ frame: localFrame - 8, fps, config: { damping: 10, stiffness: 120, mass: 0.7 } });

  const pillOut = spring({ frame: exitLocalFrame, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const triangleOut = spring({ frame: exitLocalFrame - 3, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });
  const textOut = spring({ frame: exitLocalFrame - 5, fps, config: { damping: 18, stiffness: 200, mass: 0.5 } });

  const pillScale = isExiting ? interpolate(pillOut, [0, 1], [1, 0]) : pillIn;
  const triScale = isExiting ? interpolate(triangleOut, [0, 1], [1, 0]) : triangleIn;
  const textOpacity = isExiting ? interpolate(textOut, [0, 1], [1, 0]) : interpolate(textIn, [0, 1], [0, 1]);

  const pillHeight = 120;
  const triSize = 55;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: leftOffset,
          bottom: bottomOffset,
          width: barWidth,
          height: pillHeight,
          backgroundColor: primaryColor,
          borderRadius: pillHeight / 2,
          transformOrigin: 'left center',
          transform: `scale(${pillScale})`,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 30,
          paddingRight: 40,
        }}
      >
        {/* Abstract Play Triangle */}
        <div
          style={{
            width: triSize + 24,
            height: triSize + 24,
            borderRadius: '50%',
            backgroundColor: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformOrigin: 'center center',
            transform: `scale(${triScale})`,
            boxShadow: `0 0 25px ${accentColor}80`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${triSize * 0.5}px solid white`,
              borderTop: `${triSize * 0.3}px solid transparent`,
              borderBottom: `${triSize * 0.3}px solid transparent`,
              marginLeft: 6,
            }}
          />
        </div>

        {/* CTA Text */}
        <div
          style={{
            marginLeft: 35,
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 58,
            color: 'white',
            letterSpacing: 6,
            opacity: textOpacity,
            textShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {ctaText}
        </div>
      </div>

      {/* Sub accent line */}
      <div
        style={{
          position: 'absolute',
          left: leftOffset + 50,
          bottom: bottomOffset - 20,
          width: barWidth * 0.45,
          height: 5,
          backgroundColor: accentColor,
          borderRadius: 3,
          transformOrigin: 'left center',
          transform: `scaleX(${pillScale})`,
          boxShadow: `0 0 15px ${accentColor}60`,
        }}
      />
    </AbsoluteFill>
  );
};
