import React from 'react';
import {
  UserNodeIcon,
  FirewallNodeIcon,
  ServerNodeIcon,
  CloudNodeIcon,
} from './FirewallIcons';

export interface NetworkNodeCardProps {
  type: 'user' | 'firewall' | 'server' | 'cloud';
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  frame?: number;
  opacity?: number;
  scale?: number;
  borderColor?: string;
  accentColor?: string;
  isHealthyPulse?: boolean;
}

export const NetworkNodeCard: React.FC<NetworkNodeCardProps> = ({
  type,
  label,
  sublabel,
  x,
  y,
  frame = 0,
  opacity = 1,
  scale = 1,
  borderColor,
  accentColor = '#2563EB',
  isHealthyPulse = false,
}) => {
  const isFirewall = type === 'firewall';
  const nodeDiameter = isFirewall ? 300 : 200; // Extra Large 4K Node Diameter
  const defaultBorderColor = isFirewall ? accentColor : '#374151';
  const activeBorderColor = isHealthyPulse ? '#16A34A' : (borderColor || defaultBorderColor);

  // Animated Server LED Blinking (0.4 to 1.0 opacity oscillation)
  const serverLedOpacity = 0.4 + Math.sin(frame * 0.2) * 0.6;

  // Animated Cloud Ring Rotation (0deg to 360deg over time)
  const cloudRingRotation = (frame * 0.8) % 360;

  // Animated User Outer Ring Pulse (0deg to 360deg)
  const userRingRotation = (-frame * 0.6) % 360;

  let iconComponent = <UserNodeIcon size={96} color="#1F2937" />;
  if (type === 'firewall') {
    iconComponent = <FirewallNodeIcon size={130} color={activeBorderColor} />;
  } else if (type === 'server') {
    iconComponent = <ServerNodeIcon size={96} color="#1F2937" ledOpacity={serverLedOpacity} />;
  } else if (type === 'cloud') {
    iconComponent = <CloudNodeIcon size={96} color="#1F2937" />;
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        zIndex: isFirewall ? 10 : 5,
        transition: 'transform 0.1s ease, opacity 0.1s ease',
      }}
    >
      {/* Circle Outer Node Shield Body */}
      <div
        style={{
          width: `${nodeDiameter}px`,
          height: `${nodeDiameter}px`,
          borderRadius: '50%',
          backgroundColor: isFirewall
            ? 'rgba(239, 246, 255, 0.98)'
            : isHealthyPulse
            ? 'rgba(240, 253, 244, 0.98)'
            : 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          border: `${isFirewall ? '4px' : '3px'} solid ${activeBorderColor}`,
          boxShadow: isHealthyPulse
            ? '0 18px 52px rgba(22, 163, 74, 0.22), 0 6px 20px rgba(0,0,0,0.04)'
            : isFirewall
            ? `0 20px 60px rgba(37, 99, 235, 0.22), 0 6px 20px rgba(0,0,0,0.04)`
            : '0 12px 32px rgba(0, 0, 0, 0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.15s ease, background-color 0.15s ease',
          position: 'relative',
        }}
      >
        {/* Firewall Inner Dash Ring */}
        {isFirewall && (
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              border: `1.5px dashed ${activeBorderColor}`,
              opacity: 0.4,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* User Outer Breathing Rotating Ring */}
        {type === 'user' && (
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px dashed #64748B',
              opacity: 0.35,
              transform: `rotate(${userRingRotation}deg)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Cloud Outer Mechanical Sync Rotating Ring */}
        {type === 'cloud' && (
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px dashed #0284C7',
              opacity: 0.4,
              transform: `rotate(${cloudRingRotation}deg)`,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Server Active Glow Border Effect when Healthy Pulse */}
        {type === 'server' && isHealthyPulse && (
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '2px solid #16A34A',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />
        )}

        {iconComponent}
      </div>

      {/* Reassuring Text Label Badge below Node */}
      <div
        style={{
          backgroundColor: isHealthyPulse ? '#F0FDF4' : 'rgba(255, 255, 255, 0.95)',
          border: `2px solid ${isHealthyPulse ? '#BBF7D0' : '#E2E8F0'}`,
          borderRadius: '16px',
          padding: '10px 24px',
          boxShadow: '0 8px 22px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          whiteSpace: 'nowrap',
          transition: 'background-color 0.15s ease, border-color 0.15s ease',
        }}
      >
        <span style={{ fontSize: isFirewall ? '26px' : '22px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
          {label}
        </span>
        {sublabel && (
          <span style={{ fontSize: '15px', fontWeight: 600, color: isHealthyPulse ? '#15803D' : (isFirewall ? accentColor : '#64748B') }}>
            {isHealthyPulse ? '● TRAFFIC VERIFIED & CLEAN' : sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
