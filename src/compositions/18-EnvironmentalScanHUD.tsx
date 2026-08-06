import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CompassRing } from '../components/CompassRing';
import { DriftLine } from '../components/DriftLine';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface EnvironmentalScanHUDProps {
  color?: string;
}

export const EnvironmentalScanHUD: React.FC<EnvironmentalScanHUDProps> = ({ color = '#38BDF8' }) => {
  const frame = useCurrentFrame();

  const compassRotation = (frame * 0.8) % 360;

  // 5 Atmospheric Drift Line paths with smooth horizontal drift offset
  const driftLines = [
    { d: 'M -200 400 Q 1200 300 2400 450 T 4000 350', speed: 6 },
    { d: 'M -200 800 Q 1400 900 2600 750 T 4000 850', speed: 8 },
    { d: 'M -200 1200 Q 1000 1100 2200 1300 T 4000 1150', speed: 5 },
    { d: 'M -200 1600 Q 1600 1700 2800 1550 T 4000 1650', speed: 7 },
    { d: 'M -200 1900 Q 1200 1800 2400 1950 T 4000 1850', speed: 9 },
  ];

  const tempVal = (24.5 + Math.sin(frame * 0.05) * 0.8).toFixed(1);
  const pressVal = Math.floor(1013 + Math.cos(frame * 0.04) * 4);
  const windVal = (14.8 + Math.sin(frame * 0.08) * 2.2).toFixed(1);

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
        {/* Outer Minimalist Border Line */}
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.35" />

        {/* 5 Atmospheric Weather Drift Lines */}
        {driftLines.map((l, i) => {
          const shift = (frame * l.speed) % 800;
          return <DriftLine key={i} d={l.d} xShift={shift} color={color} opacity={0.4} />;
        })}
      </svg>

      {/* Top Left Rotating Compass Ring */}
      <div style={{ position: 'absolute', left: '160px', top: '160px' }}>
        <CompassRing size={220} rotation={compassRotation} color={color} />
      </div>

      {/* Top Right Environmental Telemetry Card */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.7 }}>ENVIRONMENTAL SENSOR READINGS</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>TEMP: {tempVal}°C</div>
        <div style={{ fontSize: '22px', fontWeight: 700 }}>BARO: {pressVal} hPa</div>
        <div style={{ fontSize: '18px', opacity: 0.9 }}>WIND: {windVal} km/h</div>
      </div>

      {/* Screen Title */}
      <div style={{ position: 'absolute', bottom: '160px', left: '160px', color, fontSize: '22px', fontWeight: 800 }}>
        ATMOSPHERIC WEATHER SCANNER // SENSOR SUITE
      </div>
    </AbsoluteFill>
  );
};
