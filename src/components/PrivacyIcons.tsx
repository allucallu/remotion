import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

// 1. Location Pin Icon SVG
export const LocationPinIcon: React.FC<IconProps> = ({ size = 48, color = '#374151', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M12 21.7C17.3 17 20 13 20 9.5a8 8 0 1 0-16 0c0 3.5 2.7 7.5 8 12.2z" fill={color} fillOpacity="0.14" />
    <circle cx="12" cy="9.5" r="3" />
  </svg>
);

// 2. Camera Icon SVG
export const CameraIcon: React.FC<IconProps> = ({ size = 48, color = '#374151', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill={color} fillOpacity="0.14" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// 3. Microphone Icon SVG
export const MicrophoneIcon: React.FC<IconProps> = ({ size = 48, color = '#374151', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <rect x="9" y="2" width="6" height="12" rx="3" fill={color} fillOpacity="0.14" />
    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" strokeWidth="2.2" />
    <line x1="8" y1="22" x2="16" y2="22" strokeWidth="2.2" />
  </svg>
);

// 4. Data Sharing / Database Icon SVG
export const DataSharingIcon: React.FC<IconProps> = ({ size = 48, color = '#374151', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <ellipse cx="12" cy="5" rx="9" ry="3" fill={color} fillOpacity="0.14" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

// 5. Privacy Settings Shield Header Icon
export const PrivacyShieldHeaderIcon: React.FC<IconProps> = ({ size = 60, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.14" />
    <circle cx="12" cy="11.5" r="3" />
    <path d="M12 14.5v2" strokeWidth="2" />
  </svg>
);

// 6. Settings Updated Checkmark Icon
export const SettingsCheckIcon: React.FC<IconProps> = ({ size = 32, color = '#16A34A' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9.5" fill={color} fillOpacity="0.16" />
    <polyline points="8.5 12 11 14.5 15.5 9.5" strokeWidth="2.8" />
  </svg>
);

// 7. Tiny Inner Knob Checkmark (ON State)
export const KnobCheckIcon: React.FC<IconProps> = ({ size = 22, color = '#2563EB' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// 8. Tiny Inner Knob Minus/Cross (OFF State)
export const KnobMinusIcon: React.FC<IconProps> = ({ size = 20, color = '#9CA3AF' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const getCategoryIcon = (iconType: string, size: number = 48, opacity: number = 1) => {
  switch (iconType) {
    case 'location':
      return <LocationPinIcon size={size} color="#374151" opacity={opacity} />;
    case 'camera':
      return <CameraIcon size={size} color="#374151" opacity={opacity} />;
    case 'microphone':
      return <MicrophoneIcon size={size} color="#374151" opacity={opacity} />;
    case 'data':
      return <DataSharingIcon size={size} color="#374151" opacity={opacity} />;
    default:
      return <LocationPinIcon size={size} color="#374151" opacity={opacity} />;
  }
};
