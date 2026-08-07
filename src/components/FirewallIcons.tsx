import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  isBlinking?: boolean;
}

// 1. User / Client Endpoint Node Icon (4K UHD 200px Scale)
export const UserNodeIcon: React.FC<IconProps> = ({ size = 96, color = '#1F2937' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" fill={color} fillOpacity="0.1" />
  </svg>
);

// 2. Firewall Shield Center Node Icon (4K UHD 300px Scale)
export const FirewallNodeIcon: React.FC<IconProps> = ({ size = 130, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.16" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
  </svg>
);

// 3. App Server Node Icon (with Live Blinking Status LEDs)
export const ServerNodeIcon: React.FC<IconProps & { ledOpacity?: number }> = ({
  size = 96,
  color = '#1F2937',
  ledOpacity = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="6" rx="2" fill={color} fillOpacity="0.1" />
    <rect x="2" y="14" width="20" height="6" rx="2" fill={color} fillOpacity="0.1" />
    {/* Animated Active Green Status LEDs */}
    <circle cx="6" cy="7" r="1.2" fill="#16A34A" stroke="none" opacity={ledOpacity} />
    <circle cx="6" cy="17" r="1.2" fill="#16A34A" stroke="none" opacity={ledOpacity * 0.8} />
    <line x1="10" y1="7" x2="15" y2="7" strokeWidth="1.8" />
    <line x1="10" y1="17" x2="15" y2="17" strokeWidth="1.8" />
  </svg>
);

// 4. Cloud Storage Node Icon
export const CloudNodeIcon: React.FC<IconProps> = ({ size = 96, color = '#1F2937' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill={color} fillOpacity="0.1" />
  </svg>
);

// 5. Threat Dot Graphic (Solid Danger Color Circle with Shadow)
export const ThreatDotGraphic: React.FC<{ size?: number; color?: string }> = ({ size = 32, color = '#DC2626' }) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0 4px 14px ${color}77, 0 0 6px ${color}`,
      transform: 'translate(-50%, -50%)',
    }}
  />
);

// 6. Shield Block X Symbol
export const ShieldBlockXIcon: React.FC<IconProps> = ({ size = 48, color = '#DC2626' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// 7. Legitimate User Traffic Data Packet Dot (Blue/Green)
export const UserTrafficDotGraphic: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#2563EB' }) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: color,
      boxShadow: `0 2px 8px ${color}66`,
      transform: 'translate(-50%, -50%)',
    }}
  />
);
