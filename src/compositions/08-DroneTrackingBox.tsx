import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { TrackingBox } from '../components/TrackingBox';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface DroneTrackingBoxProps {
  color?: string;
}

export const DroneTrackingBox: React.FC<DroneTrackingBoxProps> = ({ color = '#CCFF00' }) => {
  const frame = useCurrentFrame();

  // Smooth Noise trajectory calculation using layered sin/cos
  const angle = (frame * 360) / 300;
  const rad = (angle * Math.PI) / 180;

  const trackX = 1920 + Math.sin(rad) * 450 + Math.cos(rad * 2) * 150;
  const trackY = 1080 + Math.cos(rad) * 250 + Math.sin(rad * 3) * 100;

  const altValue = Math.floor(420 + Math.sin(rad) * 30);
  const spdValue = Math.floor(68 + Math.cos(rad * 2) * 12);
  const gpsLat = (34.0522 + Math.sin(rad) * 0.005).toFixed(4);
  const gpsLng = (-118.2437 + Math.cos(rad) * 0.005).toFixed(4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: spaceMonoFontFamily,
      }}
    >
      <svg width="3840" height="2160" viewBox="0 0 3840 2160" style={{ position: 'absolute', inset: 0 }}>
        {/* Outer Inset Frame Lines */}
        <rect x="120" y="120" width="3600" height="1920" fill="none" stroke={color} strokeWidth="2" opacity="0.3" strokeDasharray="20 20" />
      </svg>

      {/* Target Motion Tracking Box */}
      <TrackingBox
        x={trackX}
        y={trackY}
        width={260}
        height={260}
        color={color}
        labels={[`ALT: ${altValue}m`, `SPD: ${spdValue}km/h`, `GPS: ${gpsLat}, ${gpsLng}`]}
      />

      {/* NEW Top-Right Battery & Sensor Panel */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>DRONE SENSOR STATUS</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>BATTERY: 88%</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>CAMERA: FLIR INFRARED</div>
      </div>

      {/* NEW Bottom-Left Compass Heading Card */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>COMPASS HEADING</div>
        <div style={{ fontSize: '28px', fontWeight: 800 }}>HEADING: 315° NW</div>
      </div>

      {/* Header Label */}
      <div style={{ position: 'absolute', top: '160px', left: '160px', color, fontSize: '22px', fontWeight: 800 }}>
        DRONE TARGET TRACKING // SMOOTH MOTION NOISE
      </div>
    </AbsoluteFill>
  );
};
