import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ARTagLabel } from '../components/ARTagLabel';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface ARMultiTagFrameProps {
  color?: string;
  accentColor?: string;
}

export const ARMultiTagFrame: React.FC<ARMultiTagFrameProps> = ({
  color = '#00F0FF',
  accentColor = '#FF6B00',
}) => {
  const frame = useCurrentFrame();

  const tags = [
    { x: 500, y: 400, text: 'TARGET_ALPHA', subtext: 'DIST: 4.2m | OK', depth: 1.1, cycle: 0 },
    { x: 3000, y: 500, text: 'OBJ_CONTAINER_02', subtext: 'STATUS: SECURE', depth: 0.9, cycle: 60 },
    { x: 600, y: 1600, text: 'NODE_BEACON_09', subtext: 'FREQ: 5.8 GHz', depth: 1.0, cycle: 120 },
    { x: 2900, y: 1550, text: 'ANOMALY_LOC_44', subtext: 'CONFIDENCE: 98%', depth: 1.15, cycle: 180 },
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
        {/* Subtle Outer Frame Grid Lines */}
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.3" strokeDasharray="16 16" />

        {/* Dynamic Tracking Laser Link connecting Tag 1 to Tag 2 */}
        <line x1="500" y1="400" x2="3000" y2="500" stroke={accentColor} strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
        <line x1="600" y1="1600" x2="2900" y2="1550" stroke={color} strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />

        {/* Target Reticle Box Corners for Tag 1 */}
        <g transform="translate(500, 400)" stroke={accentColor} strokeWidth="2" fill="none">
          <circle r="30" strokeDasharray="6 6" />
          <line x1="-40" y1="0" x2="40" y2="0" />
          <line x1="0" y1="-40" x2="0" y2="40" />
        </g>
      </svg>

      {/* NEW Top-Left AR Mode Status Banner */}
      <div
        style={{
          position: 'absolute',
          left: '160px',
          top: '160px',
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
        <span>AR HUD VIEW: TACTICAL TARGETING</span>
        <span>|</span>
        <span>SPATIAL SENSORS: ONLINE</span>
      </div>

      {/* 4 Staggered Floating AR Tag Labels */}
      {tags.map((tag, idx) => {
        const isVisible = (frame + tag.cycle) % 240 < 180;
        const opacity = isVisible ? 1.0 : 0.2;

        return (
          <ARTagLabel
            key={idx}
            x={tag.x}
            y={tag.y}
            text={tag.text}
            subtext={tag.subtext}
            color={color}
            accentColor={accentColor}
            depth={tag.depth}
            opacity={opacity}
          />
        );
      })}

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '100px', right: '160px', color, fontSize: '22px', fontWeight: 800 }}>
        AUGMENTED REALITY MULTI-TAG FRAME // 4K OVERLAY
      </div>
    </AbsoluteFill>
  );
};
