import React from 'react';

export interface CyberIconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

// 1. Shield Lock Icon
export const ShieldLockIcon: React.FC<CyberIconProps> = ({ size = 38, color = '#60A5FA', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.2" />
    <rect x="9" y="10" width="6" height="5" rx="1" strokeWidth="1.8" />
    <path d="M10 10V8.5a2 2 0 1 1 4 0V10" strokeWidth="1.8" />
  </svg>
);

// 2. Terminal Bug / Vulnerability Icon
export const CodeBugIcon: React.FC<CyberIconProps> = ({ size = 38, color = '#60A5FA', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <rect x="8" y="6" width="8" height="14" rx="4" fill={color} fillOpacity="0.2" />
    <line x1="6" y1="9" x2="2" y2="7" />
    <line x1="18" y1="9" x2="22" y2="7" />
    <line x1="6" y1="13" x2="1" y2="13" />
    <line x1="18" y1="13" x2="23" y2="13" />
    <line x1="6" y1="17" x2="2" y2="19" />
    <line x1="18" y1="17" x2="22" y2="19" />
  </svg>
);

// 3. Database Security Icon
export const DatabaseCyberIcon: React.FC<CyberIconProps> = ({ size = 38, color = '#60A5FA', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <ellipse cx="12" cy="5" rx="9" ry="3" fill={color} fillOpacity="0.2" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

// 4. Firewall Gateway Icon
export const FirewallGateIcon: React.FC<CyberIconProps> = ({ size = 38, color = '#60A5FA', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <rect x="3" y="3" width="18" height="18" rx="2" fill={color} fillOpacity="0.15" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="10" y1="3" x2="10" y2="9" />
    <line x1="14" y1="9" x2="14" y2="15" />
    <line x1="8" y1="15" x2="8" y2="21" />
  </svg>
);

// 5. Biometric Fingerprint / Key Icon
export const BiometricKeyIcon: React.FC<CyberIconProps> = ({ size = 38, color = '#60A5FA', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.15" />
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <line x1="12" y1="15" x2="12" y2="18" />
  </svg>
);

// 6. Rotating Target Lock Crosshair Bracket Ring (Enlarged size=110)
export const TargetReticleRing: React.FC<{ size?: number; color?: string; rotationDeg?: number }> = ({
  size = 110,
  color = '#60A5FA',
  rotationDeg = 0,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    style={{ transform: `rotate(${rotationDeg}deg)`, transition: 'transform 0.1s linear' }}
  >
    {/* 4 Corner Target Brackets */}
    <path d="M 6 18 V 10 A 4 4 0 0 1 10 6 H 18" />
    <path d="M 42 6 H 50 A 4 4 0 0 1 54 10 V 18" />
    <path d="M 54 42 V 50 A 4 4 0 0 1 50 54 H 42" />
    <path d="M 18 54 H 10 A 4 4 0 0 1 6 50 V 42" />

    {/* Center Tick Marks */}
    <line x1="30" y1="2" x2="30" y2="8" />
    <line x1="30" y1="52" x2="30" y2="58" />
    <line x1="2" y1="30" x2="8" y2="30" />
    <line x1="52" y1="30" x2="58" y2="30" />
  </svg>
);
