import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { PrivacyRowItem, PrivacyPermission } from '../components/PrivacyRowItem';
import { PrivacyShieldHeaderIcon, SettingsCheckIcon } from '../components/PrivacyIcons';

export interface PrivacyToggleSwitcherProps {
  permissions?: PrivacyPermission[];
  accentColor?: string;
  panelTitle?: string;
}

const DEFAULT_PERMISSIONS: PrivacyPermission[] = [
  {
    label: 'Location Services',
    sublabel: 'Allow precise GPS location access',
    iconType: 'location',
    initialState: false,
    targetState: true,
  },
  {
    label: 'Camera Access',
    sublabel: 'Allow photo and video capture',
    iconType: 'camera',
    initialState: true,
    targetState: false,
  },
  {
    label: 'Microphone Access',
    sublabel: 'Allow voice audio recording',
    iconType: 'microphone',
    initialState: false,
    targetState: true,
  },
  {
    label: 'Data & Analytics Sharing',
    sublabel: 'Share anonymous usage metrics',
    iconType: 'data',
    initialState: true,
    targetState: false,
  },
];

export const PrivacyToggleSwitcher: React.FC<PrivacyToggleSwitcherProps> = ({
  permissions = DEFAULT_PERMISSIONS,
  accentColor = '#2563EB',
  panelTitle = 'Privacy Settings',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Frame 0-20: Panel Card Entry Spring Reveal (scale 0.97 -> 1, opacity 0 -> 1)
  const cardSpring = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 180,
    },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.97, 1]);
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Frame 320-340: Bottom "Settings Updated" Banner Reveal
  const showBanner = frame >= 320;
  const bannerOpacity = interpolate(frame, [320, 340], [0, 1], { extrapolateRight: 'clamp' });
  const bannerTranslateY = interpolate(frame, [320, 340], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Centered 4K Privacy Panel Card (1280px Width) */}
      <div
        style={{
          width: '1280px', // Extra Large 4K Legible Width
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '36px',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.09), 0 4px 18px rgba(0, 0, 0, 0.03)',
          padding: '60px 72px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top System Privacy Pill Badge */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '12px',
            padding: '6px 18px',
            fontSize: '14px',
            fontWeight: 800,
            color: '#1E40AF',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accentColor }} />
          SYSTEM PRIVACY & SECURITY CONTROLS • ENCRYPTED STORAGE
        </div>

        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: '2px solid #F1F5F9', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '24px',
                backgroundColor: '#EFF6FF',
                border: '2.5px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.12)',
              }}
            >
              <PrivacyShieldHeaderIcon size={56} color={accentColor} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                {panelTitle}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 500, color: '#6B7280' }}>
                Manage application permissions and real-time data access controls
              </span>
            </div>
          </div>
        </div>

        {/* 4 Permission Rows (Staggered Delay 70 Frames) */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {permissions.map((item, idx) => {
            const startFrame = 30 + idx * 70; // Toggle 1 at f=30, Toggle 2 at f=100, etc.

            return (
              <PrivacyRowItem
                key={idx}
                permission={item}
                index={idx}
                frame={frame}
                startFrame={startFrame}
                accentColor={accentColor}
                isLast={idx === permissions.length - 1}
              />
            );
          })}
        </div>

        {/* Bottom "Settings Updated" Status Banner */}
        {showBanner && (
          <div
            style={{
              marginTop: '12px',
              backgroundColor: '#F0FDF4',
              border: '2px solid #BBF7D0',
              borderRadius: '18px',
              padding: '16px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              opacity: bannerOpacity,
              transform: `translateY(${bannerTranslateY}px)`,
            }}
          >
            <SettingsCheckIcon size={32} color="#16A34A" />
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#15803D', letterSpacing: '0.2px' }}>
              Privacy Preferences Saved & Applied (4 Permissions Updated)
            </span>
          </div>
        )}

        {/* Bottom Progress Completion Bar Line */}
        {showBanner && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              backgroundColor: '#16A34A',
              boxShadow: '0 0 12px rgba(22, 163, 74, 0.4)',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
