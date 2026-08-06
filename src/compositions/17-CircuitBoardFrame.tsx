import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CircuitTrace, CircuitNode } from '../components/CircuitTrace';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface CircuitBoardFrameProps {
  color?: string;
}

export const CircuitBoardFrame: React.FC<CircuitBoardFrameProps> = ({ color = '#00FF66' }) => {
  const frame = useCurrentFrame();

  const progress1 = (frame / 300) % 1;
  const progress2 = ((frame + 75) / 300) % 1;
  const progress3 = ((frame + 150) / 300) % 1;
  const progress4 = ((frame + 225) / 300) % 1;

  // 4 PCB 90-degree right-angle trace paths
  const traces = [
    'M 160 160 L 600 160 L 600 360 L 1400 360 L 1400 160 L 2200 160',
    'M 3680 160 L 3200 160 L 3200 460 L 2400 460 L 2400 160',
    'M 160 2000 L 800 2000 L 800 1800 L 1600 1800 L 1600 2000',
    'M 3680 2000 L 3000 2000 L 3000 1700 L 2200 1700 L 2200 2000',
  ];

  // 8 Square Electronic Chip Nodes
  const nodes = [
    { x: 600, y: 160, triggerProgress: 0.15 },
    { x: 600, y: 360, triggerProgress: 0.30 },
    { x: 1400, y: 360, triggerProgress: 0.60 },
    { x: 1400, y: 160, triggerProgress: 0.80 },

    { x: 3200, y: 160, triggerProgress: 0.20 },
    { x: 3200, y: 460, triggerProgress: 0.45 },
    { x: 2400, y: 460, triggerProgress: 0.70 },
    { x: 2400, y: 160, triggerProgress: 0.90 },
  ];

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
          <filter id="glowPCB" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 4 PCB Right-Angle Electric Circuit Traces */}
        <g filter="url(#glowPCB)">
          <CircuitTrace d={traces[0]} progress={progress1} color={color} />
          <CircuitTrace d={traces[1]} progress={progress2} color={color} />
          <CircuitTrace d={traces[2]} progress={progress3} color={color} />
          <CircuitTrace d={traces[3]} progress={progress4} color={color} />

          {/* 8 Electronic Chip Nodes */}
          {nodes.map((n, idx) => {
            const isActive = Math.abs(progress1 - n.triggerProgress) < 0.08;
            return <CircuitNode key={idx} x={n.x} y={n.y} isActive={isActive} color={color} size={16} />;
          })}
        </g>
      </svg>

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '100px', left: '160px', color, fontSize: '24px', fontWeight: 800 }}>
        PCB CIRCUIT BOARD FRAME // 90° TRACE PULSES
      </div>

      {/* Telemetry Card Right */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '14px',
          padding: '20px 28px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>CHIP BUS VOLTAGE</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>3.3V DC STABLE</div>
      </div>
    </AbsoluteFill>
  );
};
