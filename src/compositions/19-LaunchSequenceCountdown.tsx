import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SegmentedCountdownRing } from '../components/SegmentedCountdownRing';
import { GlitchText } from '../components/GlitchText';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface LaunchSequenceCountdownProps {
  color?: string;
  accentColor?: string;
}

export const LaunchSequenceCountdown: React.FC<LaunchSequenceCountdownProps> = ({
  color = '#FF3300',
  accentColor = '#FF9900',
}) => {
  const frame = useCurrentFrame();

  const cycleFrame = frame % 240;

  // Remaining ratio 1 to 0 across 200 frames
  const remainingRatio = interpolate(cycleFrame, [0, 200], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const countNumber = Math.max(0, Math.ceil(remainingRatio * 10));
  const isLaunch = cycleFrame >= 200;
  const isFlashing = cycleFrame >= 200 && cycleFrame <= 203;

  // Ignition Check Indicators (5 dots)
  const activeIgnitionDots = Math.floor(interpolate(cycleFrame, [0, 180], [0, 5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: spaceMonoFontFamily,
      }}
    >
      {/* Ignition Flash White Opacity */}
      {isFlashing && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#FFFFFF', opacity: 0.35 }} />
      )}

      {/* Central Segmented Countdown Ring */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SegmentedCountdownRing size={540} remainingRatio={remainingRatio} totalSegments={40} color={color} />

        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontFamily: jetBrainsMonoFontFamily, fontSize: '130px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
            {countNumber}
          </div>
          <GlitchText
            text={isLaunch ? 'IGNITION LAUNCH' : 'SEQUENCE COUNTDOWN'}
            isGlitching={isFlashing}
            color={isLaunch ? '#FFFFFF' : accentColor}
            fontSize={22}
          />
        </div>
      </div>

      {/* Top Left Ignition System Status Row */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
        }}
      >
        <div style={{ fontSize: '14px', color, fontWeight: 700 }}>IGNITION CHECKS</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: i < activeIgnitionDots ? accentColor : '#334155',
                boxShadow: i < activeIgnitionDots ? `0 0 10px ${accentColor}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Screen Header */}
      <div style={{ position: 'absolute', top: '100px', color, fontSize: '24px', fontWeight: 800 }}>
        LAUNCH SEQUENCE COUNTDOWN // AUTOMATED TIMING
      </div>
    </AbsoluteFill>
  );
};
