import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { SecurityToastCard, ToastItem } from '../components/SecurityToastCard';

export interface SecurityToastStackProps {
  toasts?: ToastItem[];
  position?: 'top-right' | 'bottom-left';
  accentColor?: string;
}

const DEFAULT_TOASTS: ToastItem[] = [
  {
    icon: 'lock',
    title: 'Encryption Active (256-bit)',
    subtitle: 'End-to-End AES Encryption Enabled',
    badge: 'ACTIVE',
    accentColor: '#2563EB',
  },
  {
    icon: 'ip',
    title: 'IP Masked',
    subtitle: 'Virtual IP Address Protected (192.168.x.x)',
    badge: 'PROTECTED',
    accentColor: '#2563EB',
  },
  {
    icon: 'firewall',
    title: 'Firewall Blocked',
    subtitle: 'Unauthorized Intrusion Attempt Mitigated',
    badge: 'BLOCKED',
    accentColor: '#DC2626',
  },
  {
    icon: 'ssl',
    title: 'SSL Certificate Verified',
    subtitle: 'TLS 1.3 Handshake Successful',
    badge: 'VERIFIED',
    accentColor: '#16A34A',
  },
];

export const SecurityToastStack: React.FC<SecurityToastStackProps> = ({
  toasts = DEFAULT_TOASTS,
  position = 'top-right',
  accentColor = '#2563EB',
}) => {
  const frame = useCurrentFrame();

  const isTopRight = position === 'top-right';

  const positionStyles: React.CSSProperties = isTopRight
    ? { top: '100px', right: '100px', alignItems: 'flex-end' }
    : { bottom: '100px', left: '100px', alignItems: 'flex-start' };

  return (
    <AbsoluteFill style={{ backgroundColor: 'transparent' }}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          ...positionStyles,
        }}
      >
        {toasts.map((toast, index) => {
          const startFrame = index * 60; // Staggered delay 60 frames per toast
          return (
            <SecurityToastCard
              key={index}
              toast={toast}
              frame={frame}
              startFrame={startFrame}
              position={position}
              accentColor={accentColor}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
