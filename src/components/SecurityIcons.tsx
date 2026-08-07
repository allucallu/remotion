import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
}

// 1. Lock Icon (256-bit Encryption)
export const LockIcon: React.FC<IconProps> = ({ size = 76, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill={color} fillOpacity="0.15" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1.5" fill={color} />
  </svg>
);

// 2. IP Masked / Network Eye-Slash Icon
export const IpMaskedIcon: React.FC<IconProps> = ({ size = 76, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" fill={color} fillOpacity="0.12" />
    <circle cx="12" cy="12" r="3" />
    <line x1="3" y1="3" x2="21" y2="21" stroke="#DC2626" strokeWidth="2.5" />
  </svg>
);

// 3. Firewall Shield with Cross Icon
export const FirewallShieldIcon: React.FC<IconProps> = ({ size = 76, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.15" />
    <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" stroke="#DC2626" strokeWidth="2.2" />
    <line x1="14.5" y1="9.5" x2="9.5" y2="14.5" stroke="#DC2626" strokeWidth="2.2" />
  </svg>
);

// 4. SSL Certificate Verified Checkmark Circle Icon
export const SslVerifiedIcon: React.FC<IconProps> = ({ size = 76, color = '#16A34A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.18" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.8" />
  </svg>
);

// Close 'X' Dismiss Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 30, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Security Shield Watermark
export const ShieldWatermark: React.FC<{ size?: number; color?: string }> = ({ size = 280, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" opacity="0.04">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} />
  </svg>
);

export const getSecurityIcon = (type: string, size: number = 76, defaultColor: string = '#2563EB') => {
  switch (type) {
    case 'lock':
      return <LockIcon size={size} color={defaultColor} />;
    case 'ip':
      return <IpMaskedIcon size={size} color={defaultColor} />;
    case 'firewall':
      return <FirewallShieldIcon size={size} color={defaultColor} />;
    case 'ssl':
      return <SslVerifiedIcon size={size} color="#16A34A" />;
    default:
      return <LockIcon size={size} color={defaultColor} />;
  }
};
