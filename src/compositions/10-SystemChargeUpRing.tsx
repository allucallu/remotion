import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SegmentedProgressRing } from '../components/SegmentedProgressRing';
import { GlitchText } from '../components/GlitchText';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface SystemChargeUpRingProps {
  color?: string;
}

export const SystemChargeUpRing: React.FC<SystemChargeUpRingProps> = ({ color = '#FF9900' }) => {
  const frame = useCurrentFrame();

  // Progress 0 to 1 across 170 frames, hold for 20 frames, then reset
  const cycleFrame = frame % 210;

  const progress = interpolate(cycleFrame, [0, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const percentInt = Math.floor(progress * 100);
  const isCharged = percentInt >= 100;
  const isFlashing = cycleFrame >= 160 && cycleFrame <= 163;

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
      {/* Flash White Opacity 1-2 frames when fully charged */}
      {isFlashing && (
        <div style={{ position: 'absolute', inset: 0, backgroundColor: '#FFFFFF', opacity: 0.3 }} />
      )}

      {/* Central Segmented Progress Ring Group */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SegmentedProgressRing size={600} progress={progress} totalSegments={48} color={isCharged ? '#00FF66' : color} />

        {/* Central Counter Display */}
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontFamily: jetBrainsMonoFontFamily, fontSize: '110px', fontWeight: 800, color: isCharged ? '#00FF66' : '#FFFFFF', lineHeight: 1 }}>
            {percentInt}%
          </div>
          <GlitchText
            text={isCharged ? 'SYSTEM READY' : 'CHARGING OVERDRIVE...'}
            isGlitching={isFlashing}
            color={isCharged ? '#00FF66' : color}
            fontSize={24}
          />
        </div>
      </div>

      {/* Screen Header */}
      <div style={{ position: 'absolute', top: '100px', fontSize: '24px', color, fontWeight: 700 }}>
        SYSTEM CHARGE-UP RING // OVERPOWER CYCLES
      </div>
    </AbsoluteFill>
  );
};
