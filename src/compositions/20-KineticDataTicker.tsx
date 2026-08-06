import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DataTicker } from '../components/DataTicker';
import { CornerBracket } from '../components/CornerBracket';
import { spaceMonoFontFamily } from '../utils/fonts';

export interface KineticDataTickerProps {
  color?: string;
  accentColor?: string;
}

export const KineticDataTicker: React.FC<KineticDataTickerProps> = ({
  color = '#00FF66',
  accentColor = '#FFB700',
}) => {
  const frame = useCurrentFrame();

  const topItems = [
    'SYS.01: OK',
    'PACKET: 0x99A',
    'NODE_SYNC: 99.8%',
    'BANDWIDTH: 10GB/S',
    'FIREWALL: ENFORCED',
    'BUFFER: READY',
  ];

  const bottomItems = [
    'LATENCY: 1.2MS',
    'MEMORY: 64GB',
    'CPU_LOAD: 42%',
    'VOLTAGE: 3.3V',
    'HASH: 0x44BC',
    'LINK: ACTIVE',
  ];

  const highlightIdx = Math.floor(frame / 75) % topItems.length;

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
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.3" strokeDasharray="16 16" />
      </svg>

      {/* Top Border Kinetic Data Ticker Scrolling Left */}
      <div style={{ position: 'absolute', top: '140px', left: '0px' }}>
        <DataTicker
          items={topItems}
          frame={frame}
          speed={5}
          direction="left"
          color={color}
          accentColor={accentColor}
          highlightIndex={highlightIdx}
        />
      </div>

      {/* Bottom Border Kinetic Data Ticker Scrolling Right */}
      <div style={{ position: 'absolute', bottom: '140px', left: '0px' }}>
        <DataTicker
          items={bottomItems}
          frame={frame}
          speed={5}
          direction="right"
          color={color}
          accentColor={accentColor}
          highlightIndex={highlightIdx}
        />
      </div>

      {/* Subtle Corner Brackets */}
      <div style={{ position: 'absolute', left: '120px', top: '120px' }}>
        <CornerBracket size={120} color={color} strokeWidth={2.5} />
      </div>
      <div style={{ position: 'absolute', right: '120px', top: '120px', transform: 'scaleX(-1)' }}>
        <CornerBracket size={120} color={color} strokeWidth={2.5} />
      </div>
      <div style={{ position: 'absolute', left: '120px', bottom: '120px', transform: 'scaleY(-1)' }}>
        <CornerBracket size={120} color={color} strokeWidth={2.5} />
      </div>
      <div style={{ position: 'absolute', right: '120px', bottom: '120px', transform: 'scale(-1)' }}>
        <CornerBracket size={120} color={color} strokeWidth={2.5} />
      </div>

      {/* Screen Header */}
      <div style={{ position: 'absolute', top: '220px', color, fontSize: '24px', fontWeight: 800 }}>
        KINETIC DATA TICKER // SEAMLESS CONTINUOUS SCROLL
      </div>
    </AbsoluteFill>
  );
};
