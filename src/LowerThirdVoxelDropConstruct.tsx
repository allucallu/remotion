import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 9. LowerThirdVoxelDropConstruct (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Enam blok modul persegi (voxel blocks) jatuh DARI LUAR FRAME ATAS (-2200px) secara bertahap dengan gaya gravitasi spring berat dan tersusun rapat.
 * Saat exit, seluruh 6 blok jatuh runtuh melintasi luar frame bawah (+2200px).
 *
 * GERAKAN SEKUNDER:
 * Neon dot aksen jatuh dari luar frame atas (-2200px) mengunci ke dalam takik sudut (frame 34) dan jatuh keluar frame bawah (+2200px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1675px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdVoxelDropConstructProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdVoxelDropConstruct: React.FC<LowerThirdVoxelDropConstructProps> = ({
  primaryColor = '#18181B',
  accentColor = '#06B6D4',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // 6 Staggered Heavy Gravity Drop Springs
  const b1Spring = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const b2Spring = spring({ frame: localFrame - 3, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const b3Spring = spring({ frame: localFrame - 6, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const b4Spring = spring({ frame: localFrame - 9, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const b5Spring = spring({ frame: localFrame - 12, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const b6Spring = spring({ frame: localFrame - 15, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
  const dotSpring = spring({ frame: localFrame - 34, fps, config: { damping: 8, stiffness: 200, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Y-drop interpolations (Start: -2200px top, End: +2200px bottom)
  const getDropY = (bSpring: number) => {
    return isExiting
      ? interpolate(exitSpring, [0, 1], [0, 2200])
      : interpolate(bSpring, [0, 1], [-2200, 0]);
  };

  const dotY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(dotSpring, [0, 1], [-2200, 0]);

  const baseLeft = 200;
  const baseTop = 1530;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2250,
          height: 250,
        }}
      >
        {/* Block 1 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 700,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: '10px 0 0 0',
            transform: `translateY(${getDropY(b1Spring)}px)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Block 2 */}
        <div
          style={{
            position: 'absolute',
            left: 705,
            top: 10,
            width: 750,
            height: 140,
            backgroundColor: '#27272A',
            transform: `translateY(${getDropY(b2Spring)}px)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        />

        {/* Block 3 */}
        <div
          style={{
            position: 'absolute',
            left: 1460,
            top: 10,
            width: 740,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: '0 10px 0 0',
            transform: `translateY(${getDropY(b3Spring)}px)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        />

        {/* Block 4 */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 155,
            width: 600,
            height: 85,
            backgroundColor: '#0284C7',
            borderRadius: '0 0 0 10px',
            transform: `translateY(${getDropY(b4Spring)}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Block 5 */}
        <div
          style={{
            position: 'absolute',
            left: 645,
            top: 155,
            width: 700,
            height: 85,
            backgroundColor: '#3F3F46',
            transform: `translateY(${getDropY(b5Spring)}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Block 6 */}
        <div
          style={{
            position: 'absolute',
            left: 1350,
            top: 155,
            width: 750,
            height: 85,
            backgroundColor: '#27272A',
            borderRadius: '0 0 10px 0',
            transform: `translateY(${getDropY(b6Spring)}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Neon Accent Dot Drop */}
        <div
          style={{
            position: 'absolute',
            left: 2150,
            top: 180,
            width: 35,
            height: 35,
            backgroundColor: accentColor,
            borderRadius: 6,
            transform: `translateY(${dotY}px)`,
            boxShadow: `0 0 25px ${accentColor}, 0 0 45px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1675px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
