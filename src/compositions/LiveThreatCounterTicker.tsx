import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MetricTickerCard, MetricItem } from '../components/MetricTickerCard';
import { MetricShieldIcon } from '../components/TickerIcons';

export interface LiveThreatCounterTickerProps {
  metrics?: MetricItem[];
  accentColor?: string;
  showMiniChart?: boolean;
}

const DEFAULT_METRICS: MetricItem[] = [
  {
    label: 'Threats Blocked Today',
    startValue: 12800,
    endValue: 12847,
    unit: '',
    changePercent: '▲ +14.2%',
    dataVariant: 1,
  },
  {
    label: 'Encrypted Data Traffic',
    startValue: 3.2,
    endValue: 3.8,
    unit: 'TB',
    changePercent: '▲ +8.5%',
    dataVariant: 2,
  },
];

export const LiveThreatCounterTicker: React.FC<LiveThreatCounterTickerProps> = ({
  metrics = DEFAULT_METRICS,
  accentColor = '#2563EB',
  showMiniChart = true,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '48px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header Command Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          borderRadius: '24px',
          padding: '18px 44px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
          zIndex: 10,
        }}
      >
        <MetricShieldIcon size={40} color={accentColor} />
        <span style={{ fontSize: '30px', fontWeight: 900, color: '#1F2937', letterSpacing: '-0.4px' }}>
          REAL-TIME SECURITY METRICS & TELEMETRY MONITOR
        </span>
      </div>

      {/* 2 Horizontal Metric Cards Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '48px',
          width: '100%',
          maxWidth: '2450px',
        }}
      >
        {metrics.slice(0, 2).map((item, idx) => (
          <MetricTickerCard
            key={idx}
            metric={item}
            index={idx}
            frame={frame}
            accentColor={accentColor}
            showMiniChart={showMiniChart}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
