import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DataStreamColumn } from '../components/DataStreamColumn';
import { CornerBracket } from '../components/CornerBracket';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';
import { scrambleHex, seededRandom } from '../utils/random';

export interface MultiLayerDataStreamProps {
  color?: string;
}

export const MultiLayerDataStream: React.FC<MultiLayerDataStreamProps> = ({ color = '#00F0FF' }) => {
  const frame = useCurrentFrame();

  const columns = [
    // Left Edge Data Streams
    { x: 120, y: 100, speed: 2.5, opacity: 0.3 }, // Background Layer
    { x: 240, y: -200, speed: 4.0, opacity: 0.6 }, // Midground Layer
    { x: 360, y: 50, speed: 6.0, opacity: 0.85 }, // Foreground Layer

    // Right Edge Data Streams
    { x: 3360, y: -100, speed: 3.0, opacity: 0.3 }, // Background Layer
    { x: 3480, y: 150, speed: 5.0, opacity: 0.6 }, // Midground Layer
    { x: 3600, y: -50, speed: 7.0, opacity: 0.85 }, // Foreground Layer
  ];

  const pulseDots = [
    { x: 180, y: 300, seed: 10 },
    { x: 300, y: 900, seed: 20 },
    { x: 180, y: 1500, seed: 30 },
    { x: 3540, y: 400, seed: 40 },
    { x: 3660, y: 1100, seed: 50 },
    { x: 3540, y: 1700, seed: 60 },
  ];

  // Frequency spectrum bars (16 bars)
  const spectrumBars = Array.from({ length: 16 }).map((_, i) =>
    Math.floor(seededRandom(frame * 5 + i * 23) * 40 + 10)
  );

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
        {/* Outer Inset Frame Line */}
        <rect x="80" y="80" width="3680" height="2000" fill="none" stroke={color} strokeWidth="2" opacity="0.3" strokeDasharray="16 16" />

        {/* Pulsing Dots along periphery */}
        {pulseDots.map((d, i) => {
          const opacity = 0.3 + Math.sin(frame * 0.15 + d.seed) * 0.7;
          return <circle key={i} cx={d.x} cy={d.y} r="6" fill={color} opacity={opacity} />;
        })}
      </svg>

      {/* 6 Multi-Layer Data Stream Columns */}
      {columns.map((col, idx) => (
        <DataStreamColumn
          key={idx}
          x={col.x}
          y={col.y}
          speed={col.speed}
          opacity={col.opacity}
          color={color}
          frame={frame}
        />
      ))}

      {/* NEW Top-Center Stream Sync Status Card */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          display: 'flex',
          gap: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '12px',
          padding: '16px 28px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '18px',
          fontWeight: 700,
        }}
      >
        <span>STREAM SYNC: ACTIVE</span>
        <span>|</span>
        <span>BANDWIDTH: 10.4 GB/S</span>
        <span>|</span>
        <span>HEX: 0x{scrambleHex(4, frame, 99)}</span>
      </div>

      {/* NEW Bottom-Center Spectrum Frequency Bar Visualizer */}
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '16px',
          padding: '16px 32px',
        }}
      >
        <div style={{ fontSize: '13px', color, fontWeight: 700, fontFamily: jetBrainsMonoFontFamily }}>
          FREQUENCY ANALYZER [ 0Hz - 20kHz ]
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '50px' }}>
          {spectrumBars.map((h, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: `${h}px`,
                backgroundColor: color,
                borderRadius: '2px',
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlapping Corner Panel Top Left */}
      <div style={{ position: 'absolute', left: '100px', top: '100px' }}>
        <CornerBracket size={160} color={color} strokeWidth={3} />
      </div>

      {/* Overlapping Corner Panel Bottom Right */}
      <div style={{ position: 'absolute', right: '100px', bottom: '100px', transform: 'scale(-1)' }}>
        <CornerBracket size={160} color={color} strokeWidth={3} />
      </div>
    </AbsoluteFill>
  );
};
