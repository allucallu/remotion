import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 3. LowerThirdPortalApertureSlice (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME TOP-RIGHT (+3500px, -2500px), pisau guillotine polygon miring 60 derajat menyambar jatuh, lalu kedua belahan topeng terbelah vertikal membuka kontainer utama.
 * Saat exit, kedua belahan topeng merapat kembali dan meluncur keluar melintasi frame top-right (+3500px, -2500px).
 *
 * GERAKAN SEKUNDER:
 * Garis aksen ganda menggambar dirinya menyusuri 2 tepi potongan (frame 35) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1550px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1665px, Width = 1850px, Height = 65px
 *
 * DURASI: 210 frames (7.0s @ 30fps)
 */

interface LowerThirdPortalApertureSliceProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdPortalApertureSlice: React.FC<LowerThirdPortalApertureSliceProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#F43F5E',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 170;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Blade Slash Spring (from +3500px, -2500px)
  const slashSpring = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 180, mass: 0.6 } });
  // Split Halves Opening Spring
  const splitSpring = spring({ frame: localFrame - 8, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  // Secondary Motion Spring: Twin Edge Lines Draw (Delayed frame 35)
  const lineSpring = spring({ frame: localFrame - 35, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations
  const bladeX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(slashSpring, [0, 1], [3500, 0]);

  const bladeY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2500])
    : interpolate(slashSpring, [0, 1], [-2500, 0]);

  const splitGap = interpolate(splitSpring, [0, 1], [0, 120]);

  const lineScaleX = interpolate(lineSpring, [0, 1], [0, 1]);
  const lineExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1520;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2300,
          height: 250,
          transform: `translate3d(${bladeX}px, ${bladeY}px, 0)`,
        }}
      >
        {/* Main Underneath Container Plate */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 10,
            width: 2200,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: 12,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Top Split Half Shroud (Splits Upward) */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: -splitGap,
            width: 2200,
            height: 115,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 40%)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        />

        {/* Bottom Split Half Shroud (Splits Downward) */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 115 + splitGap,
            width: 2200,
            height: 125,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Twin Accent Lines along Cut Seams */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 112 - splitGap,
            width: 2200,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${accentColor}, 0 0 35px ${accentColor}`,
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 118 + splitGap,
            width: 2200,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${accentColor}, 0 0 35px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1550px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1665px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
