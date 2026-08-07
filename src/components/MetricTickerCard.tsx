import React from 'react';
import { Easing, interpolate, spring, useVideoConfig } from 'remotion';
import { MiniSvgLineChart, LivePulseDot, MetricShieldIcon, BaselineCompareIcon } from './TickerIcons';

export interface MetricItem {
  label: string;
  startValue: number;
  endValue: number;
  unit?: string;
  changePercent?: string;
  dataVariant?: 1 | 2;
}

export interface MetricTickerCardProps {
  metric: MetricItem;
  index: number;
  frame: number;
  accentColor?: string;
  showMiniChart?: boolean;
}

export const MetricTickerCard: React.FC<MetricTickerCardProps> = ({
  metric,
  index,
  frame,
  accentColor = '#2563EB',
  showMiniChart = true,
}) => {
  const { fps } = useVideoConfig();
  const { label, startValue, endValue, unit = '', changePercent = '+12.4%', dataVariant = 1 } = metric;

  // 1. Frame 0-30: Card Entrance Spring (scale 0.96 -> 1.0, opacity 0 -> 1)
  const cardSpring = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 220,
    },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.96, 1.0]);
  const cardOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  // 2. Smooth Live Counter Counting (Frame 0-600 with Easing.out(Easing.cubic))
  const countProgress = interpolate(frame, [0, 600], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });

  const rawCurrentVal = startValue + (endValue - startValue) * countProgress;
  const isFloat = unit === 'TB' || unit === 'GB' || unit === 'MB' || unit === '%';

  const displayFormattedVal = isFloat
    ? rawCurrentVal.toFixed(1)
    : Math.floor(rawCurrentVal).toLocaleString('en-US');

  // 3. Micro-scale Pulse on Increment Steps (scale 1 -> 1.03 -> 1 over 6 frames)
  const stepThreshold = isFloat ? Math.floor(rawCurrentVal * 10) : Math.floor(rawCurrentVal);
  const isPulseFrame = stepThreshold % 4 === 0 && (frame % 10 < 5);
  const numberScalePulse = isPulseFrame ? 1.03 : 1.0;

  // 4. SVG Path Drawing (Frame 0-40: 1.0 -> 0.0)
  const strokeDashoffset = interpolate(frame, [0, 40], [1.0, 0.0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // 5. Seamless Loop Cyclical Modulo Mechanics (Frame 0 to 599 visual match)
  // Live End Dot Pulse (Every 30 frames cycle modulo)
  const pulseCycle = (frame % 30) / 30;
  const livePulseScale = 1 + Math.sin(pulseCycle * Math.PI) * 0.45;
  const livePulseOpacity = Math.sin(pulseCycle * Math.PI);

  // Border Opacity Breathing (Every 60 frames cycle modulo: 0.75 -> 1.0 -> 0.75)
  const breathingCycle = (frame % 60) / 60;
  const borderOpacity = 0.75 + Math.sin(breathingCycle * Math.PI * 2) * 0.25;

  return (
    <div
      style={{
        width: '1160px', // Extra Large 4K UHD Overhauled Card Width
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(20px)',
        borderRadius: '36px',
        border: `2.5px solid ${accentColor}`,
        borderColor: `rgba(37, 99, 235, ${borderOpacity})`,
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.09), 0 4px 18px rgba(0, 0, 0, 0.03)',
        padding: '56px 64px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        opacity: cardOpacity,
        transform: `scale(${cardScale})`,
        transition: 'border-color 0.1s linear',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Section: Label + Live Status Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: '2px solid #F1F5F9', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#EFF6FF',
              border: '1.5px solid #BFDBFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MetricShieldIcon size={34} color={accentColor} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.3px' }}>
              {label}
            </span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748B' }}>
              Real-Time Security Event Telemetry
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '14px',
            padding: '8px 20px',
            fontSize: '15px',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <LivePulseDot size={12} color={accentColor} pulseScale={livePulseScale} pulseOpacity={livePulseOpacity} />
          LIVE STREAMING
        </div>
      </div>

      {/* Center Section: Extra Large Live Counter Number + Unit + Trend Percent */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
          <span
            style={{
              fontSize: '76px', // Extra Large 4K Number Scale
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-1.8px',
              fontVariantNumeric: 'tabular-nums', // CRITICAL: Prevent digit wobble during counting!
              transform: `scale(${numberScalePulse})`,
              transition: 'transform 0.05s ease',
              display: 'inline-block',
            }}
          >
            {displayFormattedVal}
          </span>
          {unit && (
            <span style={{ fontSize: '36px', fontWeight: 800, color: '#475569' }}>
              {unit}
            </span>
          )}
        </div>

        {/* Change Percent Tag + Baseline Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#64748B' }}>
            <BaselineCompareIcon size={18} color="#64748B" />
            vs Baseline
          </div>

          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              borderRadius: '14px',
              padding: '10px 22px',
              fontSize: '22px',
              fontWeight: 800,
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)',
            }}
          >
            {changePercent}
          </div>
        </div>
      </div>

      {/* Bottom Section: Dual-Line Native Mini SVG Chart with Grid Background */}
      {showMiniChart && (
        <div style={{ position: 'relative', width: '100%', marginTop: '4px' }}>
          <MiniSvgLineChart width={1032} height={140} color={accentColor} strokeDashoffset={strokeDashoffset} dataVariant={dataVariant} />

          {/* Rightmost Pulsing Live End Dot */}
          <div
            style={{
              position: 'absolute',
              right: '2px',
              top: dataVariant === 1 ? '18px' : '28px',
              transform: 'translate(50%, -50%)',
              zIndex: 10,
            }}
          >
            <LivePulseDot size={16} color={accentColor} pulseScale={livePulseScale} pulseOpacity={livePulseOpacity} />
          </div>
        </div>
      )}

      {/* Bottom Footer Telemetry Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '12px', borderTop: '1.5px solid #F1F5F9' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          ● 99.99% TELEMETRY UPTIME • REAL-TIME AUDITED
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>
          LATENCY: 12ms
        </span>
      </div>
    </div>
  );
};
