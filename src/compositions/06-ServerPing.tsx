import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { shareTechMonoFontFamily } from '../utils/fonts';

export interface ServerPingProps {
  background?: 'alpha' | 'solid';
}

interface ServerRegion {
  code: string;
  name: string;
  basePing: number;
  spikeFrame: number;
}

const regions: ServerRegion[] = [
  { code: 'US-EAST-1', name: 'N. Virginia', basePing: 12, spikeFrame: 180 },
  { code: 'EU-CENTRAL-1', name: 'Frankfurt', basePing: 34, spikeFrame: 180 },
  { code: 'AP-SOUTHEAST-1', name: 'Singapore', basePing: 85, spikeFrame: 70 },
  { code: 'SA-EAST-1', name: 'São Paulo', basePing: 142, spikeFrame: 110 },
];

export const ServerPing: React.FC<ServerPingProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  const bgColor = background === 'solid' ? '#121212' : 'transparent';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: shareTechMonoFontFamily,
      }}
    >
      <div
        style={{
          width: '1400px',
          backgroundColor: '#1A1A1A',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Title Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '20px', color: '#90CAF9', letterSpacing: '0.2em', fontWeight: 'bold' }}>
              GLOBAL INFRASTRUCTURE LATENCY MONITOR
            </div>
            <div style={{ fontSize: '30px', color: '#FFFFFF', fontWeight: 'bold', marginTop: '4px' }}>
              Real-Time Edge Health Diagnostics
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#66BB6A' }} />
            <span style={{ color: '#CCCCCC', fontSize: '20px' }}>GLOBAL AVG: 42 MS</span>
          </div>
        </div>

        {/* Server Regions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {regions.map((region, idx) => {
            // Random noise fluctuation around base ping
            const noise = (random(frame + idx * 50) - 0.5) * 6;
            const isSpiking = frame >= region.spikeFrame && frame <= region.spikeFrame + 40;
            const spikeVal = isSpiking
              ? interpolate(frame, [region.spikeFrame, region.spikeFrame + 20, region.spikeFrame + 40], [0, 110, 0])
              : 0;

            const currentPing = Math.max(8, Math.round(region.basePing + noise + spikeVal));

            // Dynamic color threshold
            const pingColor = currentPing > 100 ? '#EF5350' : currentPing > 50 ? '#FFA726' : '#66BB6A';
            const statusLabel = currentPing > 100 ? 'HIGH LATENCY' : currentPing > 50 ? 'MODERATE' : 'OPTIMAL';

            return (
              <div
                key={region.code}
                style={{
                  backgroundColor: '#242424',
                  borderRadius: '16px',
                  padding: '28px 36px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: `1px solid ${currentPing > 100 ? 'rgba(239, 83, 80, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#90CAF9' }}>{region.code}</span>
                  <span style={{ fontSize: '20px', color: '#888888' }}>{region.name}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: pingColor }}>
                    {currentPing} <span style={{ fontSize: '24px' }}>MS</span>
                  </div>
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: pingColor,
                      letterSpacing: '0.15em',
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
