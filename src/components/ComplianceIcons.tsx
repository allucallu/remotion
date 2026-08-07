import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  opacity?: number;
  strokeDashoffset?: number;
}

// 1. Generic Official Circle Seal SVG with Double Concentric Rings & Notches (240px 4K Scale)
export const GenericCircleCheckSealIcon: React.FC<IconProps> = ({
  size = 240,
  color = '#2563EB',
  opacity = 1,
  strokeDashoffset = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
    {/* Outer Notched Stamp Rim */}
    <circle cx="50" cy="50" r="46" fill="rgba(255, 255, 255, 0.98)" stroke={color} strokeWidth="3.2" />
    <circle
      cx="50"
      cy="50"
      r="41"
      stroke={color}
      strokeWidth="1.8"
      strokeDasharray="4 4"
      opacity="0.65"
    />

    {/* Dynamic Draw Ring */}
    <circle
      cx="50"
      cy="50"
      r="36"
      stroke={color}
      strokeWidth="2.8"
      strokeDasharray="226"
      strokeDashoffset={strokeDashoffset * 226}
    />

    {/* Inner Radial Tint Circle */}
    <circle cx="50" cy="50" r="31" fill={color} fillOpacity="0.08" />

    {/* Subtle Star Notches (4 Points) */}
    <circle cx="50" cy="10" r="1.5" fill={color} opacity="0.7" />
    <circle cx="50" cy="90" r="1.5" fill={color} opacity="0.7" />
    <circle cx="10" cy="50" r="1.5" fill={color} opacity="0.7" />
    <circle cx="90" cy="50" r="1.5" fill={color} opacity="0.7" />
  </svg>
);

// 2. Generic Shield Seal SVG (240px 4K Scale)
export const GenericShieldSealIcon: React.FC<IconProps> = ({
  size = 240,
  color = '#2563EB',
  opacity = 1,
  strokeDashoffset = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ opacity }}>
    <path
      d="M50 8L82 22V48C82 70 50 92 50 92C50 92 18 70 18 48V22L50 8Z"
      fill="rgba(255, 255, 255, 0.98)"
      stroke={color}
      strokeWidth="3.8"
      strokeLinejoin="round"
    />
    <path
      d="M50 14L76 26V48C76 66 50 84 50 84C50 84 24 66 24 48V26L50 14Z"
      stroke={color}
      strokeWidth="2"
      strokeDasharray="210"
      strokeDashoffset={strokeDashoffset * 210}
      fill={color}
      fillOpacity="0.08"
      strokeLinejoin="round"
    />
  </svg>
);

// 3. Center Solid Checkmark Graphic
export const ComplianceCheckmarkGraphic: React.FC<{ size?: number; color?: string; scale?: number; opacity?: number }> = ({
  size = 96,
  color = '#2563EB',
  scale = 1,
  opacity = 1,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: `scale(${scale})`, opacity, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' }}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// 4. Header Title Shield Icon
export const TitleShieldIcon: React.FC<{ size?: number; color?: string }> = ({ size = 48, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.16" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
  </svg>
);

// 5. Verified Pill Check Icon
export const VerifiedPillCheckIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#15803D' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
