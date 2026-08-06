import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { MiniWidget } from '../components/MiniWidget';
import { RotatingDial } from '../components/RotatingDial';
import { spaceMonoFontFamily } from '../utils/fonts';

export interface CommandConsoleFrameProps {
  color?: string;
  accentColor?: string;
}

export const CommandConsoleFrame: React.FC<CommandConsoleFrameProps> = ({
  color = '#00F0FF',
  accentColor = '#FFB700',
}) => {
  const frame = useCurrentFrame();

  const dialRotation = (frame * 1.5) % 360;

  // 6 Mini Widgets Configuration along Bottom & Right Borders
  const widgets: Array<{
    variant: 'bargraph' | 'toggle' | 'slider';
    title: string;
    value: number;
    x: number;
    y: number;
    highlightCycle: number;
  }> = [
    // Bottom Border Widgets
    { variant: 'bargraph', title: 'CPU LOAD', value: 0.5 + Math.sin(frame * 0.1) * 0.4, x: 800, y: 1940, highlightCycle: 0 },
    { variant: 'slider', title: 'BANDWIDTH', value: 0.6 + Math.cos(frame * 0.08) * 0.3, x: 1060, y: 1940, highlightCycle: 100 },
    { variant: 'toggle', title: 'FIREWALL', value: (frame % 200) < 100 ? 1 : 0, x: 1320, y: 1940, highlightCycle: 200 },
    { variant: 'bargraph', title: 'MEM USAGE', value: 0.7 + Math.sin(frame * 0.12) * 0.25, x: 1580, y: 1940, highlightCycle: 300 },

    // Right Border Widgets
    { variant: 'slider', title: 'POWER OSC', value: 0.5 + Math.sin(frame * 0.15) * 0.4, x: 3500, y: 1400, highlightCycle: 50 },
    { variant: 'toggle', title: 'LINK STED', value: (frame % 180) < 90 ? 1 : 0, x: 3500, y: 1540, highlightCycle: 250 },
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
        {/* Outer Inset Frame Border */}
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      </svg>

      {/* Top Left Focal Point Panel */}
      <div
        style={{
          position: 'absolute',
          left: '140px',
          top: '140px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${color}40`,
          borderRadius: '20px',
          padding: '24px 32px',
        }}
      >
        <RotatingDial size={140} rotation={dialRotation} color={accentColor} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '14px', color, fontWeight: 700 }}>COMMAND CONSOLE MAIN NODE</span>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF' }}>STATUS: ONLINE</span>
        </div>
      </div>

      {/* Array of 6 Peripheral Console Mini Widgets */}
      {widgets.map((w, i) => {
        const isHighlighted = (frame + w.highlightCycle) % 300 < 30;

        return (
          <div key={i} style={{ position: 'absolute', left: `${w.x}px`, top: `${w.y}px` }}>
            <MiniWidget
              variant={w.variant}
              title={w.title}
              value={w.value}
              color={color}
              accentColor={accentColor}
              isHighlighted={isHighlighted}
            />
          </div>
        );
      })}

      {/* Screen Title */}
      <div style={{ position: 'absolute', top: '100px', right: '140px', color, fontSize: '22px', fontWeight: 800 }}>
        COMMAND CONSOLE HUD // PERIPHERY DASHBOARD
      </div>
    </AbsoluteFill>
  );
};
