import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  rotation?: number;
}

// 1. Two-Factor Authentication Shield Icon (Header)
export const TwoFactorShieldIcon: React.FC<IconProps> = ({ size = 60, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.14" />
    <circle cx="12" cy="11" r="2.5" />
    <path d="M12 13.5v3" strokeWidth="2.2" />
  </svg>
);

// 2. Simple Arc Loading Spinner (NO Neon Glow, Pure Arc Stroke)
export const ArcSpinnerIcon: React.FC<IconProps> = ({ size = 76, color = '#2563EB', rotation = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

// 3. Verified Green Checkmark Circle Icon (Spring Pop-In)
export const VerifiedCheckmarkIcon: React.FC<IconProps> = ({ size = 96, color = '#16A34A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" fill={color} fillOpacity="0.16" />
    <polyline points="8.5 12 11 14.5 15.5 9.5" strokeWidth="2.8" />
  </svg>
);

// 4. Tiny OTP Lock Icon (Top right corner of filled OTP box)
export const TinyOtpLockIcon: React.FC<IconProps> = ({ size = 16, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" fill={color} fillOpacity="0.15" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
