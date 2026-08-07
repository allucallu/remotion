import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  opacity?: number;
}

// 1. Metric Shield Header Icon
export const MetricShieldIcon: React.FC<IconProps> = ({ size = 32, color = '#2563EB', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={color} fillOpacity="0.16" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
  </svg>
);

// 2. Baseline Comparison Icon
export const BaselineCompareIcon: React.FC<IconProps> = ({ size = 20, color = '#64748B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

// 3. Native Dual-Line Smooth Bezier Chart with Background Grid Lines
export interface MiniSvgLineChartProps {
  width?: number;
  height?: number;
  color?: string;
  strokeDashoffset?: number;
  dataVariant?: 1 | 2;
}

export const MiniSvgLineChart: React.FC<MiniSvgLineChartProps> = ({
  width = 1030,
  height = 140,
  color = '#2563EB',
  strokeDashoffset = 0,
  dataVariant = 1,
}) => {
  // Primary Live Line Path
  const primaryPathD = dataVariant === 1
    ? 'M 0 100 C 180 110, 300 45, 480 75 C 660 105, 820 25, 1030 18'
    : 'M 0 85 C 200 60, 380 115, 600 50 C 780 15, 920 70, 1030 28';

  // Secondary Yesterday Baseline Dashed Path
  const baselinePathD = dataVariant === 1
    ? 'M 0 110 C 180 120, 300 70, 480 95 C 660 120, 820 50, 1030 40'
    : 'M 0 100 C 200 80, 380 125, 600 75 C 780 40, 920 90, 1030 50';

  const areaD = `${primaryPathD} L 1030 140 L 0 140 Z`;
  const gradientId = `chart-overhaul-grad-${dataVariant}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Background Dashed Grid Lines for Professional SIEM Analytics Vibe */}
      <line x1="0" y1="35" x2={width} y2="35" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1="0" y1="80" x2={width} y2="80" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />
      <line x1="0" y1="125" x2={width} y2="125" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="6 6" />

      {/* Secondary Yesterday Baseline Line (Gray Dashed) */}
      <path
        d={baselinePathD}
        stroke="#94A3B8"
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity="0.6"
      />

      {/* Primary Gradient Area Fill */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Primary Live Line Path with Draw-In Stroke */}
      <path
        d={primaryPathD}
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1200"
        strokeDashoffset={strokeDashoffset * 1200}
      />
    </svg>
  );
};

// 4. Live Updating Pulsing End Dot
export const LivePulseDot: React.FC<{ size?: number; color?: string; pulseScale?: number; pulseOpacity?: number }> = ({
  size = 16,
  color = '#2563EB',
  pulseScale = 1,
  pulseOpacity = 0.8,
}) => (
  <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Outer Expanding Pulse Ring */}
    <div
      style={{
        position: 'absolute',
        width: `${size * 2.4}px`,
        height: `${size * 2.4}px`,
        borderRadius: '50%',
        backgroundColor: color,
        transform: `scale(${pulseScale})`,
        opacity: pulseOpacity * 0.45,
        pointerEvents: 'none',
      }}
    />
    {/* Center Solid Dot */}
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}`,
      }}
    />
  </div>
);
