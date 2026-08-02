import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { interFontFamily } from '../utils/fonts';

export interface BuildSuccessBadgeProps {
  background?: 'alpha' | 'solid';
}

export const BuildSuccessBadge: React.FC<BuildSuccessBadgeProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring scale overshoot entrance
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 120 },
  });

  // Animated checkmark SVG stroke dashoffset draw-in
  const checkDashoffset = interpolate(frame, [15, 45], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Duration text fade-in
  const durationOpacity = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgColor = background === 'solid' ? '#0A0A0A' : 'transparent';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: interFontFamily,
      }}
    >
      {/* Floating Badge Card Container */}
      <div
        style={{
          backgroundColor: '#161616',
          borderRadius: '32px',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.2)',
          padding: '48px 80px',
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          transform: `scale(${badgeSpring})`,
        }}
      >
        {/* Emerald Checkmark Circle Icon */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid #10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" strokeDasharray="60" strokeDashoffset={checkDashoffset} />
          </svg>
        </div>

        {/* Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '42px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.05em' }}>
            BUILD SUCCESSFUL
          </div>
          <div style={{ opacity: durationOpacity, fontSize: '24px', color: '#9CA3AF', fontWeight: 500 }}>
            Compiled 142 modules in <span style={{ color: '#10B981', fontWeight: 700 }}>14.2s</span> • 0 errors
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
