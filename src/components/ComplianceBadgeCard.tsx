import React from 'react';
import { Easing, interpolate, spring, useVideoConfig } from 'remotion';
import {
  GenericCircleCheckSealIcon,
  GenericShieldSealIcon,
  ComplianceCheckmarkGraphic,
  VerifiedPillCheckIcon,
} from './ComplianceIcons';

export interface ComplianceBadgeItem {
  label: string;
  subtext?: string;
  iconType?: 'circle' | 'shield';
}

export interface ComplianceBadgeCardProps {
  badge: ComplianceBadgeItem;
  index: number;
  frame: number;
  startFrame: number;
  accentColor?: string;
  layout?: 'horizontal-row' | 'grid-2x2';
}

export const ComplianceBadgeCard: React.FC<ComplianceBadgeCardProps> = ({
  badge,
  frame,
  startFrame,
  accentColor = '#2563EB',
  layout = 'horizontal-row',
}) => {
  const { fps } = useVideoConfig();
  const { label, subtext, iconType = 'circle' } = badge;

  if (frame < startFrame) {
    return null;
  }

  // 1. Stamp Impact Scale Phase (0 -> 6 frames: scale 1.4 -> 0.9, opacity 0 -> 1)
  const impactProgress = Math.max(0, Math.min(1, (frame - startFrame) / 6));
  const impactScale = interpolate(impactProgress, [0, 1], [1.4, 0.9], {
    easing: Easing.out(Easing.quad),
  });
  const impactOpacity = interpolate(impactProgress, [0, 1], [0, 1]);

  // 2. Scale Settle Spring Phase (6 -> 16 frames: scale 0.9 -> 1.0)
  const settleSpring = spring({
    frame: Math.max(0, frame - (startFrame + 6)),
    fps,
    config: {
      damping: 200,
      stiffness: 240,
    },
  });
  const settleScale = interpolate(settleSpring, [0, 1], [0.9, 1.0]);

  const currentScale = frame < startFrame + 6 ? impactScale : settleScale;

  // 3. Ground Shockwave Ripple & Card Recoil Micro-Shake on Stamp Impact
  const isPostImpact = frame >= startFrame + 6;
  const rippleProgress = isPostImpact ? Math.max(0, Math.min(1, (frame - (startFrame + 6)) / 15)) : 0;
  const rippleScale = interpolate(rippleProgress, [0, 1], [1, 1.4]);
  const rippleOpacity = interpolate(rippleProgress, [0, 1], [0.6, 0]);

  const recoilProgress = isPostImpact ? Math.max(0, Math.min(1, (frame - (startFrame + 6)) / 8)) : 0;
  const recoilTranslateY = interpolate(recoilProgress, [0, 0.5, 1], [0, 5, 0]);

  // 4. Ring Stroke-Dashoffset Draw-In (5 -> 25 frames post start: 1.0 -> 0.0)
  const ringProgress = Math.max(0, Math.min(1, (frame - (startFrame + 5)) / 20));
  const strokeDashoffset = interpolate(ringProgress, [0, 1], [1.0, 0.0], {
    easing: Easing.out(Easing.cubic),
  });

  // 5. Center Checkmark Pop-In (25 -> 37 frames post start: scale 0 -> 1.15 -> 1.0)
  const checkSpring = spring({
    frame: Math.max(0, frame - (startFrame + 25)),
    fps,
    config: {
      damping: 14,
      stiffness: 220,
    },
  });
  const checkmarkScale = frame >= startFrame + 25 ? interpolate(checkSpring, [0, 1], [0, 1]) : 0;
  const checkmarkOpacity = frame >= startFrame + 25 ? interpolate(frame - (startFrame + 25), [0, 6], [0, 1], { extrapolateRight: 'clamp' }) : 0;

  const cardWidth = layout === 'grid-2x2' ? '720px' : '640px';

  return (
    <div style={{ position: 'relative' }}>
      {/* Ground Impact Shockwave Ripple Ring Behind Card */}
      {isPostImpact && rippleOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '42px',
            border: `3px solid ${accentColor}`,
            transform: `scale(${rippleScale})`,
            opacity: rippleOpacity,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Main 4K Compliance Card Container */}
      <div
        style={{
          width: cardWidth,
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '36px',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.08), 0 4px 18px rgba(0, 0, 0, 0.03)',
          padding: '52px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          opacity: impactOpacity,
          transform: `translateY(${recoilTranslateY}px) scale(${currentScale})`,
          transition: 'transform 0.05s linear',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* Stamp Seal Outer SVG Container (240px Scale) */}
        <div
          style={{
            width: '240px',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {iconType === 'shield' ? (
            <GenericShieldSealIcon size={240} color={accentColor} strokeDashoffset={strokeDashoffset} />
          ) : (
            <GenericCircleCheckSealIcon size={240} color={accentColor} strokeDashoffset={strokeDashoffset} />
          )}

          {/* Center Checkmark Graphic */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ComplianceCheckmarkGraphic size={96} color={accentColor} scale={checkmarkScale} opacity={checkmarkOpacity} />
          </div>
        </div>

        {/* Label Text & Subtext */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
          <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
            {label}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748B' }}>
            {subtext || 'Verified Compliance Seal'}
          </span>
        </div>

        {/* Bottom Verified Status Badge Pill */}
        <div
          style={{
            marginTop: '4px',
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '12px',
            padding: '6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)',
          }}
        >
          <VerifiedPillCheckIcon size={18} color="#15803D" />
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#15803D', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            AUDITED & VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};
