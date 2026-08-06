import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { WireframeObject } from '../components/WireframeObject';
import { TypewriterText } from '../components/TypewriterText';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface HolographicWireframePanelProps {
  color?: string;
}

export const HolographicWireframePanel: React.FC<HolographicWireframePanelProps> = ({ color = '#00F0FF' }) => {
  const frame = useCurrentFrame();

  const rotY = (frame * 1.5) % 360;

  const typewriterLinesRight = [
    'INITIALIZING HOLOGRAPHIC PROJECTION...',
    'RENDER ENGINE: VECTOR-3D',
    'STATUS: STREAMING LIVE DATA',
  ];

  const typewriterLinesLeft = [
    'QUANTUM MATRIX ACTIVE',
    'GEOMETRY: SPHERICAL MESH',
    'SYNC STABILITY: 99.9%',
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
        {/* Connecting Lines between Left and Right Hologram Panels */}
        <line x1="880" y1="300" x2="2960" y2="300" stroke={color} strokeWidth="2" strokeDasharray="10 10" opacity="0.4" />
        <line x1="880" y1="1860" x2="2960" y2="1860" stroke={color} strokeWidth="2" strokeDasharray="10 10" opacity="0.4" />
      </svg>

      {/* NEW Left Side Secondary Hologram Panel */}
      <div
        style={{
          position: 'absolute',
          left: '240px',
          top: '240px',
          width: '640px',
          height: '1680px',
          backgroundColor: 'rgba(0, 240, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: `2px solid ${color}40`,
          borderRadius: '24px',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
          boxShadow: `0 0 30px ${color}15`,
        }}
      >
        <div style={{ fontSize: '18px', color, fontWeight: 800, letterSpacing: '0.15em' }}>
          PRIMARY NODE MATRIX
        </div>

        <WireframeObject size={380} rotationY={-rotY} color={color} />

        <TypewriterText lines={typewriterLinesLeft} frame={frame + 30} color={color} fontSize={18} />
      </div>

      {/* Right Side Primary Hologram Panel */}
      <div
        style={{
          position: 'absolute',
          right: '240px',
          top: '240px',
          width: '640px',
          height: '1680px',
          backgroundColor: 'rgba(0, 240, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          border: `2px solid ${color}40`,
          borderRadius: '24px',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '48px',
          boxShadow: `0 0 30px ${color}15`,
        }}
      >
        <div style={{ fontSize: '18px', color, fontWeight: 800, letterSpacing: '0.15em' }}>
          3D VECTOR WIREFRAME
        </div>

        <WireframeObject size={380} rotationY={rotY} color={color} />

        <TypewriterText lines={typewriterLinesRight} frame={frame} color={color} fontSize={18} />
      </div>

      {/* NEW Top Center Projector Status Banner */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          display: 'flex',
          gap: '32px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '18px',
          fontWeight: 700,
        }}
      >
        <span>PROJECTOR: HOLO-NODE 04</span>
        <span>|</span>
        <span>RESOLUTION: 4K ULTRA</span>
      </div>
    </AbsoluteFill>
  );
};
