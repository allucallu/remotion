import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NetworkNode, NetworkLink } from '../components/NetworkNode';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface NeuralNetworkFrameProps {
  color?: string;
  accentColor?: string;
}

export const NeuralNetworkFrame: React.FC<NeuralNetworkFrameProps> = ({
  color = '#0088FF',
  accentColor = '#00F0FF',
}) => {
  const frame = useCurrentFrame();

  // 12 Peripheral Network Nodes
  const nodes = [
    { x: 300, y: 300, label: 'N01' },
    { x: 900, y: 200, label: 'N02' },
    { x: 1920, y: 150, label: 'N03' },
    { x: 2940, y: 200, label: 'N04' },
    { x: 3540, y: 300, label: 'N05' },

    { x: 3640, y: 1080, label: 'N06' },
    { x: 3540, y: 1860, label: 'N07' },
    { x: 2940, y: 1960, label: 'N08' },

    { x: 1920, y: 2010, label: 'N09' },
    { x: 900, y: 1960, label: 'N10' },
    { x: 300, y: 1860, label: 'N11' },
    { x: 200, y: 1080, label: 'N12' },
  ];

  // 14 Links connecting adjacent nodes around border
  const links = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [10, 11], [11, 0], [1, 11], [3, 5],
  ];

  // Active signal pulse path calculation
  const activePathStep = Math.floor(frame / 15) % nodes.length;

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
          <filter id="glowNetwork" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 14 Network Links */}
        <g filter="url(#glowNetwork)">
          {links.map(([fromIdx, toIdx], i) => {
            const isLinkActive =
              (activePathStep === fromIdx && (activePathStep + 1) % nodes.length === toIdx) ||
              (activePathStep === toIdx && (activePathStep + 1) % nodes.length === fromIdx);

            return (
              <NetworkLink
                key={i}
                x1={nodes[fromIdx].x}
                y1={nodes[fromIdx].y}
                x2={nodes[toIdx].x}
                y2={nodes[toIdx].y}
                isActive={isLinkActive}
                color={color}
              />
            );
          })}
        </g>

        {/* 12 Network Nodes */}
        <g filter="url(#glowNetwork)">
          {nodes.map((n, idx) => {
            const isNodeActive = idx === activePathStep;
            return (
              <NetworkNode
                key={idx}
                x={n.x}
                y={n.y}
                isActive={isNodeActive}
                color={color}
                label={n.label}
              />
            );
          })}
        </g>
      </svg>

      {/* NEW Top-Left Topology Legend Panel */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${accentColor}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color: accentColor,
          fontFamily: jetBrainsMonoFontFamily,
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>SYNAPSE MESH TOPOLOGY</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>12 NODES | 24 SYNAPSES</div>
        <div style={{ fontSize: '15px', opacity: 0.8 }}>ACTIVE NODE: N0{activePathStep + 1}</div>
      </div>

      {/* NEW Bottom-Right Packet Loss Monitoring Card */}
      <div
        style={{
          position: 'absolute',
          right: '160px',
          bottom: '160px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${accentColor}40`,
          borderRadius: '16px',
          padding: '24px 32px',
          color: accentColor,
          fontFamily: jetBrainsMonoFontFamily,
          textAlign: 'right',
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.7 }}>LATENCY & LOSS METRICS</div>
        <div style={{ fontSize: '24px', fontWeight: 800 }}>PACKET LOSS: 0.00%</div>
        <div style={{ fontSize: '15px', opacity: 0.8 }}>LATENCY: 1.2 MS</div>
      </div>

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '80px', color: accentColor, fontSize: '24px', fontWeight: 800 }}>
        NEURAL NETWORK FRAME // CONSTELLATION TOPOLOGY
      </div>
    </AbsoluteFill>
  );
};
