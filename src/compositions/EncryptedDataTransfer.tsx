import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { DeviceNodeIcon, ServerNodeIcon, GateLockIcon, ShieldGateWatermark } from '../components/TransferIcons';
import { DataPacketCard } from '../components/DataPacketCard';

export interface EncryptedDataTransferProps {
  packetCount?: number;
  gateLabel?: string;
  accentColor?: string;
  direction?: 'left-to-right' | 'right-to-left';
}

const RAW_TEXTS = ['8f#2@x', '9$kL%1', 'x7&p#q', 'm3*v!9', 'p4#9$a', 'k8!2%x', 'q9#4@v', 't1&m*8'];

export const EncryptedDataTransfer: React.FC<EncryptedDataTransferProps> = ({
  packetCount = 6,
  gateLabel = 'AES-256 Encryption',
  accentColor = '#2563EB',
  direction = 'left-to-right',
}) => {
  const frame = useCurrentFrame();

  const leftNodeX = 540;
  const rightNodeX = 3300;
  const gateX = 1920;
  const lineY = 1080;

  // Gate Idle Border Pulse (0.75 -> 1.0 -> 0.75 every 40 frames)
  const borderPulseOpacity = 0.78 + Math.sin(frame * 0.15) * 0.22;

  // Detect if any packet is currently crossing the gate X position to trigger Micro-Flash & Lock Scale Pop
  let isGateFlashing = false;
  for (let i = 0; i < packetCount; i++) {
    const pStartFrame = i * 25;
    const pActiveFrame = frame - pStartFrame;
    if (pActiveFrame >= 0 && pActiveFrame <= 280) {
      const travelProgress = interpolate(pActiveFrame, [0, 280], [0, 1], { extrapolateRight: 'clamp' });
      const currentX = interpolate(travelProgress, [0, 1], [leftNodeX, rightNodeX]);
      if (Math.abs(currentX - gateX) < 85) {
        isGateFlashing = true;
        break;
      }
    }
  }

  const gateFlashBgOpacity = isGateFlashing ? 0.25 : 0.04;
  const lockIconScale = isGateFlashing ? 1.12 : 1;

  // Signal Trail Dots along line
  const signalDotPos1 = ((frame * 6) % (rightNodeX - leftNodeX - 200)) + leftNodeX + 100;
  const signalDotPos2 = (((frame + 120) * 6) % (rightNodeX - leftNodeX - 200)) + leftNodeX + 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* SVG Connecting Path Dashed Line & Signal Trail Dots */}
      <svg width="3840" height="2160" viewBox="0 0 3840 2160" style={{ position: 'absolute', inset: 0 }}>
        {/* Connecting Dashed Line (Static, Thin 3.5px, Muted Slate Gray) */}
        <line
          x1={leftNodeX + 120}
          y1={lineY}
          x2={rightNodeX - 120}
          y2={lineY}
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeDasharray="18 18"
        />

        {/* Dynamic Moving Signal Dots Along Path Line */}
        <circle cx={signalDotPos1} cy={lineY} r="5" fill={accentColor} opacity="0.6" />
        <circle cx={signalDotPos2} cy={lineY} r="5" fill={accentColor} opacity="0.6" />

        {/* Left Endpoint Node Graphic Group */}
        <g transform={`translate(${leftNodeX}, ${lineY})`}>
          <g transform="translate(-120, -120)">
            <DeviceNodeIcon size={240} color="#334155" />
          </g>
        </g>

        {/* Right Endpoint Node Graphic Group */}
        <g transform={`translate(${rightNodeX}, ${lineY})`}>
          <g transform="translate(-120, -120)">
            <ServerNodeIcon size={240} color="#334155" />
          </g>
        </g>
      </svg>

      {/* Left Node Metadata Card Badge */}
      <div
        style={{
          position: 'absolute',
          left: `${leftNodeX}px`,
          top: `${lineY + 160}px`,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          border: '2px solid #E2E8F0',
          borderRadius: '16px',
          padding: '12px 24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
          CLIENT / ENDPOINT
        </span>
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748B' }}>
          IP: 192.168.1.10 • PORT 443
        </span>
      </div>

      {/* Right Node Metadata Card Badge */}
      <div
        style={{
          position: 'absolute',
          left: `${rightNodeX}px`,
          top: `${lineY + 160}px`,
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.94)',
          border: '2px solid #E2E8F0',
          borderRadius: '16px',
          padding: '12px 24px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
          SECURE SERVER / CLOUD
        </span>
        <span style={{ fontSize: '16px', fontWeight: 600, color: '#16A34A' }}>
          IP: 10.0.4.82 • SSL ACTIVE
        </span>
      </div>

      {/* Encryption Gate in Center (X = 1920px) — 320px x 480px 4K Scale */}
      <div
        style={{
          position: 'absolute',
          left: `${gateX}px`,
          top: `${lineY}px`,
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '480px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: `3.5px solid ${accentColor}`,
          opacity: borderPulseOpacity,
          boxShadow: isGateFlashing
            ? `0 20px 60px ${accentColor}44, 0 0 30px ${accentColor}33`
            : '0 20px 60px rgba(0, 0, 0, 0.09), 0 4px 18px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '28px 20px',
          zIndex: 8,
          transition: 'box-shadow 0.15s ease, background-color 0.15s ease',
          overflow: 'hidden',
        }}
      >
        {/* Gate Shield Watermark Background Graphic */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <ShieldGateWatermark size={260} color={accentColor} />
        </div>

        {/* Gate Micro-Flash Background Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '28px',
            backgroundColor: accentColor,
            opacity: gateFlashBgOpacity,
            transition: 'opacity 0.1s linear',
            pointerEvents: 'none',
          }}
        />

        {/* Gate Top Header Badge */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1.5px solid #BFDBFE',
            borderRadius: '10px',
            padding: '6px 14px',
            fontSize: '14px',
            fontWeight: 800,
            color: accentColor,
            letterSpacing: '0.8px',
          }}
        >
          256-BIT ENGINE
        </div>

        {/* Gate Lock Icon with Dynamic Pop Scale */}
        <div style={{ transform: `scale(${lockIconScale})`, transition: 'transform 0.15s ease' }}>
          <GateLockIcon size={96} color={accentColor} />
        </div>

        {/* Gate Center Label Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.3px',
              textTransform: 'uppercase',
            }}
          >
            {gateLabel}
          </span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A', letterSpacing: '0.6px' }}>
            ● HARDWARE SECURITY MODULE
          </span>
        </div>

        {/* Gate Bottom Status Footer */}
        <div style={{ borderTop: '1.5px solid #F1F5F9', width: '100%', paddingTop: '12px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
            LATENCY: &lt;1ms • 0 PACKET LOSS
          </span>
        </div>
      </div>

      {/* Staggered Data Packets Floating along Path */}
      {Array.from({ length: packetCount }).map((_, idx) => {
        const startFrame = idx * 25; // 25 frames staggered delay
        const rawText = RAW_TEXTS[idx % RAW_TEXTS.length];

        return (
          <DataPacketCard
            key={idx}
            index={idx}
            frame={frame}
            startFrame={startFrame}
            rawText={rawText}
            startX={leftNodeX + 120}
            endX={rightNodeX - 120}
            gateX={gateX}
            accentColor={accentColor}
            direction={direction}
          />
        );
      })}
    </AbsoluteFill>
  );
};
