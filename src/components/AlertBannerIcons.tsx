import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  opacity?: number;
  scale?: number;
}

// 1. Solid White Warning Triangle Icon (Danger State)
export const WarningTriangleIcon: React.FC<IconProps> = ({ size = 64, color = '#FFFFFF', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill={color} fillOpacity="0.22" />
    <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.6" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3.2" />
  </svg>
);

// 2. Solid White Shield Check Icon (Resolved State)
export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 64, color = '#FFFFFF', scale = 1, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `scale(${scale})`, opacity }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.22" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.8" />
  </svg>
);

// 3. Close / Dismiss Cross Icon
export const CloseDismissIcon: React.FC<IconProps> = ({ size = 28, color = '#FFFFFF', opacity = 0.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// 4. Server Vector Telemetry Icon
export const ServerVectorIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', opacity = 0.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <rect x="2" y="2" width="20" height="8" rx="2" fill={color} fillOpacity="0.16" />
    <rect x="2" y="14" width="20" height="8" rx="2" fill={color} fillOpacity="0.16" />
    <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" />
    <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" />
  </svg>
);

// 5. Shield Lock Badge Icon
export const ShieldLockBadgeIcon: React.FC<IconProps> = ({ size = 24, color = '#FFFFFF', opacity = 0.9 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.16" />
  </svg>
);
