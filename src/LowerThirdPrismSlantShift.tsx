import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 10. LowerThirdPrismSlantShift (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME 4K:
 *   - Prism 1 meluncur sepanjang sudut 45 derajat dari luar frame top-left (-2800px, -2800px)
 *   - Prism 2 meluncur sepanjang sudut 45 derajat dari luar frame bottom-right (+3500px, +3500px)
 * Dua prisma saling menumpuk dan mengunci rapat.
 * Saat exit, kedua prisma mundur drastis melintasi luar frame 4K ke posisi asal masing-masing.
 *
 * GERAKAN SEKUNDER:
 * Garis aksen bawah menembak keluar secara horizontal (frame 28) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdPrismSlantShiftProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdPrismSlantShift: React.FC<LowerThirdPrismSlantShiftProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#EAB308',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Prism 1 (Top Rhombus) Spring
  const prism1Spring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  // Prism 2 (Bottom Rhombus) Spring
  const prism2Spring = spring({ frame: localFrame - 4, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  // Secondary Motion Spring: Underline Shot (Delayed frame 28)
  const lineSpring = spring({ frame: localFrame - 28, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (45-degree angle vectors outside 3840x2160 frame)
  // Prism 1: Starts at (-2800px, -2800px), Exits to (-2800px, -2800px)
  const p1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(prism1Spring, [0, 1], [-2800, 0]);
  const p1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(prism1Spring, [0, 1], [-2800, 0]);

  // Prism 2: Starts at (+3500px, +3500px), Exits to (+3500px, +3500px)
  const p2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(prism2Spring, [0, 1], [3500, 0]);
  const p2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(prism2Spring, [0, 1], [3500, 0]);

  // Secondary Underline
  const lineScaleX = interpolate(lineSpring, [0, 1], [0, 1]);
  const lineExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        {/* Prism 1 (Top Slanted Rhombus - Slides from Top-Left at 45deg) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2150,
            height: 135,
            backgroundColor: primaryColor,
            clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translate3d(${p1X}px, ${p1Y}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderTop: `4px solid ${accentColor}`,
          }}
        />

        {/* Prism 2 (Bottom Slanted Rhombus - Slides from Bottom-Right at 45deg) */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 140,
            width: 1950,
            height: 90,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
            transform: `translate3d(${p2X}px, ${p2Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Horizontal Underline Shot to the Right */}
        <div
          style={{
            position: 'absolute',
            left: 150,
            top: 233,
            width: 1900,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 35px ${accentColor}`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1570px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1680px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
