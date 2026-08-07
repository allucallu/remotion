import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
}

// 1. Client / User Device Node SVG Icon (240px 4K Scale)
export const DeviceNodeIcon: React.FC<IconProps> = ({ size = 240, color = '#334155' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer Node Outer Ring */}
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="12" cy="12" r="9.5" fill="rgba(255,255,255,0.96)" stroke={color} strokeWidth="1.8" />
    
    {/* Device Screen & Laptop Mockup Graphic */}
    <rect x="7" y="6.5" width="10" height="7.2" rx="1.2" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6" />
    <path d="M9.5 10h5" strokeWidth="1.4" opacity="0.6" />
    <path d="M9.5 11.8h3" strokeWidth="1.4" opacity="0.6" />
    
    <path d="M6 16.2h12a1 1 0 0 0 1-1v-0.5H5v0.5a1 1 0 0 0 1 1z" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.6" />
    <line x1="11" y1="14" x2="13" y2="14" strokeWidth="1.8" />
  </svg>
);

// 2. Server / Cloud Node SVG Icon (240px 4K Scale)
export const ServerNodeIcon: React.FC<IconProps> = ({ size = 240, color = '#334155' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {/* Outer Node Outer Ring */}
    <circle cx="12" cy="12" r="10.5" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
    <circle cx="12" cy="12" r="9.5" fill="rgba(255,255,255,0.96)" stroke={color} strokeWidth="1.8" />

    {/* Server Stack Mockup Inner Graphic */}
    <rect x="6.2" y="5.8" width="11.6" height="3.6" rx="1" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6" />
    <circle cx="8.8" cy="7.6" r="0.7" fill="#16A34A" stroke="none" />
    <line x1="11.5" y1="7.6" x2="15" y2="7.6" strokeWidth="1.5" />

    <rect x="6.2" y="10.2" width="11.6" height="3.6" rx="1" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6" />
    <circle cx="8.8" cy="12" r="0.7" fill="#16A34A" stroke="none" />
    <line x1="11.5" y1="12" x2="15" y2="12" strokeWidth="1.5" />

    <rect x="6.2" y="14.6" width="11.6" height="3.6" rx="1" fill={color} fillOpacity="0.08" stroke={color} strokeWidth="1.6" />
    <circle cx="8.8" cy="16.4" r="0.7" fill="#16A34A" stroke="none" />
    <line x1="11.5" y1="16.4" x2="15" y2="16.4" strokeWidth="1.5" />
  </svg>
);

// 3. Gate Lock Icon
export const GateLockIcon: React.FC<IconProps> = ({ size = 84, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2.5" ry="2.5" fill={color} fillOpacity="0.16" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1.6" fill={color} />
    <path d="M12 17.6v2" strokeWidth="2" />
  </svg>
);

// 4. Encrypted Packet Inner Lock Icon
export const EncryptedPacketLockIcon: React.FC<IconProps> = ({ size = 32, color = '#FFFFFF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" ry="2" fill={color} fillOpacity="0.22" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <circle cx="12" cy="16" r="1.2" fill={color} />
  </svg>
);

// 5. Shield Gate Watermark Pattern
export const ShieldGateWatermark: React.FC<IconProps> = ({ size = 180, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" opacity="0.06">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} />
  </svg>
);
