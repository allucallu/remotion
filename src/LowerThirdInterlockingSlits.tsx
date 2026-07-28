import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 4. LowerThirdInterlockingSlits (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME UTAMA 4K:
 *   - Slat 1 dari kiri (-3000px)
 *   - Slat 2 dari kanan (+3840px)
 *   - Pin 1 dari atas (-2000px)
 *   - Pin 2 dari bawah (+2000px)
 * Semua bilah meluncur dan saling mengunci rapat (mechanical puzzle lock).
 * Saat exit, seluruh 4 bilah mundur secara drastis keluar melintasi batas frame 4K ke arah asalnya masing-masing.
 *
 * GERAKAN SEKUNDER:
 * Garis aksen bawah memanjang dari pasak tengah (frame 32) dan menembak keluar ke kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1680px, Width = 1800px, Height = 60px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdInterlockingSlitsProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdInterlockingSlits: React.FC<LowerThirdInterlockingSlitsProps> = ({
  primaryColor = '#1E1B4B',
  accentColor = '#818CF8',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Interlocking Vectors Springs
  const slat1Spring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
  const slat2Spring = spring({ frame: localFrame - 4, fps, config: { damping: 11, stiffness: 160, mass: 0.7 } });
  const pin1Spring = spring({ frame: localFrame - 7, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const pin2Spring = spring({ frame: localFrame - 10, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  const lineSpring = spring({ frame: localFrame - 32, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen interpolations (Guarantee 100% offscreen start & end outside 3840x2160)
  // Slat 1: Top Bar from LEFT (-3000px)
  const slat1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(slat1Spring, [0, 1], [-3000, 0]);

  // Slat 2: Bottom Bar from RIGHT (+3840px)
  const slat2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(slat2Spring, [0, 1], [3840, 0]);

  // Pin 1: Left Key from TOP (-2000px)
  const pin1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2000])
    : interpolate(pin1Spring, [0, 1], [-2000, 0]);

  // Pin 2: Right Key from BOTTOM (+2000px)
  const pin2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2000])
    : interpolate(pin2Spring, [0, 1], [2000, 0]);

  // Underline Secondary
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
          width: 2250,
          height: 240,
        }}
      >
        {/* Slat 1 (Top Bar - Slides from LEFT) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2150,
            height: 130,
            backgroundColor: primaryColor,
            borderRadius: '10px 0 0 10px',
            transform: `translateX(${slat1X}px)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            borderTop: `4px solid ${accentColor}`,
          }}
        />

        {/* Slat 2 (Bottom Bar - Slides from RIGHT) */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 135,
            width: 2050,
            height: 85,
            backgroundColor: '#312E81',
            borderRadius: '0 10px 10px 0',
            transform: `translateX(${slat2X}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Pin 1 (Vertical Key - Drops from TOP) */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: -15,
            width: 35,
            height: 260,
            backgroundColor: accentColor,
            borderRadius: 6,
            transform: `translateY(${pin1Y}px)`,
            boxShadow: `0 0 25px ${accentColor}80`,
            zIndex: 10,
          }}
        />

        {/* Pin 2 (Vertical Key - Shoots up from BOTTOM) */}
        <div
          style={{
            position: 'absolute',
            left: 2120,
            top: -15,
            width: 35,
            height: 260,
            backgroundColor: accentColor,
            borderRadius: 6,
            transform: `translateY(${pin2Y}px)`,
            boxShadow: `0 0 25px ${accentColor}80`,
            zIndex: 10,
          }}
        />

        {/* SECONDARY MOTION: Accent Underline Extending from Pin 1 */}
        <div
          style={{
            position: 'absolute',
            left: 85,
            top: 228,
            width: 2030,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}90`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1680px, Width = 1800px, Height = 60px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
