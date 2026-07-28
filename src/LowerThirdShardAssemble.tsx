import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 1. LowerThirdShardAssemble (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Empat pecahan polygon shard konvergen meluncur dari LUAR FRAME 4K (top-left, top-right, bottom-left, bottom-right)
 * dengan rotasi spin lalu menyatu mengunci rapat. Saat exit, seluruh 4 pecahan terpental keluar melintasi batas layar 4K.
 *
 * GERAKAN SEKUNDER:
 * Garis kawat aksen neon diagonal menyambar melintasi sambungan pecahan (frame 32) dan keluar melintasi frame saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1690px, Width = 1800px, Height = 70px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdShardAssembleProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdShardAssemble: React.FC<LowerThirdShardAssembleProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#38BDF8',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Springs (4 shards)
  const s1Spring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const s2Spring = spring({ frame: localFrame - 3, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const s3Spring = spring({ frame: localFrame - 6, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const s4Spring = spring({ frame: localFrame - 9, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });

  // Secondary Wire Slash Spring
  const wireSpring = spring({ frame: localFrame - 32, fps, config: { damping: 14, stiffness: 180, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen offsets to guarantee start & end OUTSIDE 3840x2160 frame
  // Shard 1 (Top-Left): Enters from (-2600px, -1800px), Exits to (-2600px, -1800px)
  const s1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2600])
    : interpolate(s1Spring, [0, 1], [-2600, 0]);
  const s1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(s1Spring, [0, 1], [-1800, 0]);

  // Shard 2 (Top-Right): Enters from (+3500px, -1800px), Exits to (+3500px, -1800px)
  const s2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(exitSpring, [0, 1], [0, 3500]);
  const s2InX = interpolate(s2Spring, [0, 1], [3500, 0]);
  const finalS2X = isExiting ? s2X : s2InX;
  const s2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(s2Spring, [0, 1], [-1800, 0]);

  // Shard 3 (Bottom-Left): Enters from (-2600px, +1800px), Exits to (-2600px, +1800px)
  const s3X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2600])
    : interpolate(s3Spring, [0, 1], [-2600, 0]);
  const s3Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(s3Spring, [0, 1], [1800, 0]);

  // Shard 4 (Bottom-Right): Enters from (+3500px, +1800px), Exits to (+3500px, +1800px)
  const s4X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(s4Spring, [0, 1], [3500, 0]);
  const s4Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(s4Spring, [0, 1], [1800, 0]);

  // Secondary Wire: Enters from scale 0, Exits to offscreen right +3500px
  const wireScale = interpolate(wireSpring, [0, 1], [0, 1]);
  const wireExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3500]) : 0;

  const baseLeft = 200;
  const baseTop = 1540;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2300,
          height: 250,
        }}
      >
        {/* Shard 1: Top-Left Segment */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1200,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
            transform: `translate3d(${s1X}px, ${s1Y}px, 0)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            borderTop: `4px solid ${accentColor}`,
          }}
        />

        {/* Shard 2: Top-Right Segment */}
        <div
          style={{
            position: 'absolute',
            left: 1140,
            top: 0,
            width: 1160,
            height: 140,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translate3d(${finalS2X}px, ${s2Y}px, 0)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        />

        {/* Shard 3: Bottom-Left Sub-segment */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1000,
            height: 95,
            backgroundColor: '#0284C7',
            clipPath: 'polygon(0 0, 95% 0, 85% 100%, 0 100%)',
            transform: `translate3d(${s3X}px, ${s3Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Shard 4: Bottom-Right Sub-segment */}
        <div
          style={{
            position: 'absolute',
            left: 980,
            top: 145,
            width: 1250,
            height: 95,
            backgroundColor: primaryColor,
            clipPath: 'polygon(4% 0, 100% 0, 95% 100%, 0 100%)',
            transform: `translate3d(${s4X}px, ${s4Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            borderBottom: `3px solid ${accentColor}`,
          }}
        />

        {/* SECONDARY MOTION: Neon Wire Slash */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 138,
            width: 2100,
            height: 6,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${wireExitX}px, 0, 0) scaleX(${isExiting ? 1 : wireScale})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            zIndex: 10,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1690px, Width = 1800px, Height = 70px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
