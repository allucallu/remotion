import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ComplianceBadgeCard, ComplianceBadgeItem } from '../components/ComplianceBadgeCard';
import { TitleShieldIcon } from '../components/ComplianceIcons';

export interface ComplianceBadgeRevealProps {
  badges?: ComplianceBadgeItem[];
  layout?: 'horizontal-row' | 'grid-2x2';
  accentColor?: string;
  titleText?: string;
}

const DEFAULT_BADGES: ComplianceBadgeItem[] = [
  {
    label: 'SOC 2 TYPE II',
    subtext: 'Certified Security Control',
    iconType: 'circle',
  },
  {
    label: 'ISO 27001',
    subtext: 'Information Security Standard',
    iconType: 'shield',
  },
  {
    label: 'GDPR COMPLIANT',
    subtext: 'Global Privacy Protection',
    iconType: 'circle',
  },
  {
    label: 'HIPAA READY',
    subtext: 'Healthcare Data Security',
    iconType: 'shield',
  },
];

export const ComplianceBadgeReveal: React.FC<ComplianceBadgeRevealProps> = ({
  badges = DEFAULT_BADGES,
  layout = 'horizontal-row',
  accentColor = '#2563EB',
  titleText = 'TRUSTED & COMPLIANT ENTERPRISE SECURITY',
}) => {
  const frame = useCurrentFrame();

  // Header Title Reveal (Frame 130-145: translateY -10px -> 0px, opacity 0 -> 1)
  const titleOpacity = interpolate(frame, [130, 145], [0, 1], { extrapolateRight: 'clamp' });
  const titleTranslateY = interpolate(frame, [130, 145], [-10, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '56px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header Section Banner */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleTranslateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          borderRadius: '28px',
          padding: '22px 52px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <TitleShieldIcon size={46} color={accentColor} />
          <span style={{ fontSize: '34px', fontWeight: 900, color: '#1F2937', letterSpacing: '-0.5px' }}>
            {titleText}
          </span>
        </div>
        <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748B' }}>
          Independently audited security controls and real-time compliance tracking
        </span>
      </div>

      {/* 4 Compliance Seal Badges Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: layout === 'grid-2x2' ? 'row' : 'row',
          flexWrap: layout === 'grid-2x2' ? 'wrap' : 'nowrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: layout === 'grid-2x2' ? '48px' : '40px',
          maxWidth: layout === 'grid-2x2' ? '1600px' : '2850px',
        }}
      >
        {badges.slice(0, 4).map((badge, idx) => {
          const startFrame = 30 + idx * 20; // Staggered delay 20 frames per badge

          return (
            <ComplianceBadgeCard
              key={idx}
              badge={badge}
              index={idx}
              frame={frame}
              startFrame={startFrame}
              accentColor={accentColor}
              layout={layout}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
