import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
}

// 1. Weak Cross Icon (Red)
export const WeakCrossIcon: React.FC<IconProps> = ({ size = 48, color = '#DC2626' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.12" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// 2. Fair Alert Warning Icon (Orange)
export const FairAlertIcon: React.FC<IconProps> = ({ size = 48, color = '#EA580C' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill={color} fillOpacity="0.12" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
  </svg>
);

// 3. Strong Shield Icon (Dark Yellow / Amber)
export const StrongShieldIcon: React.FC<IconProps> = ({ size = 48, color = '#CA8A04' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.15" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
  </svg>
);

// 4. Very Strong Verified Checkmark Icon (Green)
export const VeryStrongCheckIcon: React.FC<IconProps> = ({ size = 48, color = '#16A34A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.18" />
    <polyline points="8.5 12 11 14.5 15.5 9.5" strokeWidth="2.8" />
  </svg>
);

// Eye Show/Hide Password Toggle Icon Mockup
export const EyeShowIcon: React.FC<IconProps> = ({ size = 26, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const getPasswordIcon = (step: 'weak' | 'fair' | 'strong' | 'very-strong', size: number = 48) => {
  switch (step) {
    case 'weak':
      return <WeakCrossIcon size={size} color="#DC2626" />;
    case 'fair':
      return <FairAlertIcon size={size} color="#EA580C" />;
    case 'strong':
      return <StrongShieldIcon size={size} color="#CA8A04" />;
    case 'very-strong':
      return <VeryStrongCheckIcon size={size} color="#16A34A" />;
    default:
      return <WeakCrossIcon size={size} color="#DC2626" />;
  }
};
