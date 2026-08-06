import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CornerBracket } from '../components/CornerBracket';
import { GlitchText } from '../components/GlitchText';
import { GlitchBlock } from '../components/GlitchBlock';
import { seededRandom } from '../utils/random';
import { jetBrainsMonoFontFamily, spaceMonoFontFamily } from '../utils/fonts';

export interface GlitchDistortionFrameProps {
  color?: string;
  accentColor?: string;
}

export const GlitchDistortionFrame: React.FC<GlitchDistortionFrameProps> = ({
  color = '#00F0FF',
  accentColor = '#FF0055',
}) => {
  const frame = useCurrentFrame();

  // Glitch burst every 45 frames for 6 frames
  const isBursting = (frame % 45) < 6;

  // 4 Glitch Block positions when bursting
  const glitchBlocks = Array.from({ length: 4 }).map((_, i) => ({
    x: Math.floor(seededRandom(frame * 10 + i * 33) * 3400 + 200),
    y: Math.floor(seededRandom(frame * 10 + i * 77) * 1800 + 100),
    w: Math.floor(seededRandom(frame * 5 + i * 11) * 200 + 80),
    h: Math.floor(seededRandom(frame * 3 + i * 19) * 40 + 10),
  }));

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
        <rect x="100" y="100" width="3640" height="1960" fill="none" stroke={color} strokeWidth="2" opacity="0.4" />

        {/* Noise Horizontal Lines during Glitch Burst */}
        {isBursting && (
          <>
            <line x1="0" y1="350" x2="3840" y2="350" stroke={accentColor} strokeWidth="3" opacity="0.8" />
            <line x1="0" y1="1200" x2="3840" y2="1200" stroke={color} strokeWidth="2" opacity="0.8" />
            <line x1="0" y1="1800" x2="3840" y2="1800" stroke={accentColor} strokeWidth="4" opacity="0.8" />
          </>
        )}
      </svg>

      {/* 4 Corner Brackets */}
      <div style={{ position: 'absolute', left: '120px', top: '120px' }}>
        <CornerBracket size={140} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', right: '120px', top: '120px', transform: 'scaleX(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', left: '120px', bottom: '120px', transform: 'scaleY(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', right: '120px', bottom: '120px', transform: 'scale(-1)' }}>
        <CornerBracket size={140} color={color} strokeWidth={3} />
      </div>

      {/* Glitch Blocks popping up during burst */}
      {isBursting &&
        glitchBlocks.map((b, i) => (
          <GlitchBlock key={i} x={b.x} y={b.y} width={b.w} height={b.h} color={i % 2 === 0 ? accentColor : color} />
        ))}

      {/* Dynamic Status Display */}
      <div style={{ position: 'absolute', top: '160px', left: '200px' }}>
        <GlitchText
          text={isBursting ? '[ SIGNAL DISTORTION BURST ]' : '[ SIGNAL SYSTEM NORMAL ]'}
          isGlitching={isBursting}
          color={isBursting ? accentColor : color}
          fontSize={26}
        />
      </div>

      {/* Bottom Telemetry Line */}
      <div
        style={{
          position: 'absolute',
          bottom: '160px',
          right: '200px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '18px',
          fontWeight: 700,
        }}
      >
        FRAME BUFFER: {isBursting ? 'ERR_BURST_0x44' : 'STATUS_STABLE_OK'}
      </div>
    </AbsoluteFill>
  );
};
