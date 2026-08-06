import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { HexGridPattern } from '../components/HexGridPattern';
import { scrambleHex } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface ScanningGridFrameProps {
  color?: string;
}

export const ScanningGridFrame: React.FC<ScanningGridFrameProps> = ({ color = '#00FF66' }) => {
  const frame = useCurrentFrame();

  // Scan laser line sweeping left to right across 80-frame cycles
  const cycleFrame = frame % 80;
  const scanX = interpolate(cycleFrame, [0, 80], [0, 3840]);

  // Flash vertical detection line when laser passes center (x = 1920, around cycleFrame 40)
  const isDetecting = cycleFrame >= 38 && cycleFrame <= 42;

  // Counter number resetting per 80-frame cycle
  const counterValue = (cycleFrame * 12.5).toFixed(1);

  const rulerMarks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];

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
        <defs>
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Minimalist Border Line */}
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />

        {/* Inner Corner Accent Cuts */}
        <path d="M 140 220 L 140 140 L 220 140" fill="none" stroke={color} strokeWidth="3" />
        <path d="M 3700 220 L 3700 140 L 3620 140" fill="none" stroke={color} strokeWidth="3" />
        <path d="M 140 1940 L 140 2020 L 220 2020" fill="none" stroke={color} strokeWidth="3" />
        <path d="M 3700 1940 L 3700 2020 L 3620 2020" fill="none" stroke={color} strokeWidth="3" />

        {/* Sweeping Vertical Laser Scan Line */}
        <line x1={scanX} y1="0" x2={scanX} y2="2160" stroke={color} strokeWidth="3" filter="url(#glowGreen)" opacity="0.9" />

        {/* Brief Center Detection Flash Vertical Line */}
        {isDetecting && (
          <line x1="1920" y1="100" x2="1920" y2="2060" stroke="#FFFFFF" strokeWidth="6" filter="url(#glowGreen)" />
        )}
      </svg>

      {/* Hexagonal Grid Patterns at 4 Corners */}
      <div style={{ position: 'absolute', left: '120px', top: '120px' }}>
        <HexGridPattern width={400} height={400} color={color} />
      </div>
      <div style={{ position: 'absolute', right: '120px', top: '120px' }}>
        <HexGridPattern width={400} height={400} color={color} />
      </div>
      <div style={{ position: 'absolute', left: '120px', bottom: '120px' }}>
        <HexGridPattern width={400} height={400} color={color} />
      </div>
      <div style={{ position: 'absolute', right: '120px', bottom: '120px' }}>
        <HexGridPattern width={400} height={400} color={color} />
      </div>

      {/* Top Edge Horizontal Meter Ruler */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '400px',
          right: '400px',
          display: 'flex',
          justifyContent: 'space-between',
          color,
          fontSize: '14px',
          opacity: 0.6,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        {rulerMarks.map((m) => (
          <span key={m}>| SCALE: {m.toFixed(1)}</span>
        ))}
      </div>

      {/* Bottom Edge Horizontal Meter Ruler */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '400px',
          right: '400px',
          display: 'flex',
          justifyContent: 'space-between',
          color,
          fontSize: '14px',
          opacity: 0.6,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        {rulerMarks.map((m) => (
          <span key={m}>| METRIC: {m.toFixed(1)}</span>
        ))}
      </div>

      {/* NEW Top Left Telemetry Card */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '12px',
          padding: '16px 24px',
          color,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>FREQUENCY SPECTRUM</div>
        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: jetBrainsMonoFontFamily }}>
          440.8 MHz SCANNING
        </div>
      </div>

      {/* NEW Top Right Coordinates Card */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '12px',
          padding: '16px 24px',
          color,
          textAlign: 'right',
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>GRID COORDINATES</div>
        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: jetBrainsMonoFontFamily }}>
          34.0522° N, 118.2437° W
        </div>
      </div>

      {/* NEW Bottom Left Security Status Card */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '12px',
          padding: '16px 24px',
          color,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>FIREWALL MONITOR</div>
        <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: jetBrainsMonoFontFamily }}>
          PACKETS/SEC: 14,800
        </div>
      </div>

      {/* Bottom Right Fast Counter & Data Stream */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
          color,
          textShadow: `0 0 12px ${color}`,
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.7 }}>SCAN CYCLE METRICS</div>
        <div style={{ fontFamily: jetBrainsMonoFontFamily, fontSize: '38px', fontWeight: 800 }}>
          COUNT: {counterValue}
        </div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>
          HASH: 0x{scrambleHex(8, frame, 33)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
