import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 8. LowerThirdSlantedBellowsExpand (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME BOTTOM-LEFT (-2800px, +800px), tiga pelat trapesium bertumpuk meluncur dan merekah mekar secara radial seperti kipas lipat dari titik engsel bawah-kiri.
 * Saat exit, seluruh kipas melipat kembali dan meluncur keluar melintasi frame bottom-right (+3840px, +800px).
 *
 * GERAKAN SEKUNDER:
 * Garis aksen tepi menggaris batas luar kipas (frame 36) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1580px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdSlantedBellowsExpandProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdSlantedBellowsExpand: React.FC<LowerThirdSlantedBellowsExpandProps> = ({
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

  // Entrance Springs
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const fan1Spring = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const fan2Spring = spring({ frame: localFrame - 8, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const strokeSpring = spring({ frame: localFrame - 36, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Translate (-2800px, +800px -> +3840px, +800px)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-2800, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 800])
    : interpolate(containerSpring, [0, 1], [800, 0]);

  const fan1Rot = interpolate(fan1Spring, [0, 1], [-20, 0]);
  const fan2Rot = interpolate(fan2Spring, [0, 1], [20, 0]);

  const strokeScaleX = interpolate(strokeSpring, [0, 1], [0, 1]);
  const strokeExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          height: 250,
          transform: `translate3d(${containerX}px, ${containerY}px, 0)`,
        }}
      >
        {/* Trapezoid Fan Plate 1 (Back Wing) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -10,
            width: 2200,
            height: 140,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)',
            transformOrigin: 'left bottom',
            transform: `rotate(${fan2Rot}deg)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }}
        />

        {/* Trapezoid Fan Plate 2 (Mid Main Wing) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
            transformOrigin: 'left bottom',
            transform: `rotate(${fan1Rot}deg)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Subtitle Lower Fan Plate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#854D0E',
            clipPath: 'polygon(4% 0, 100% 0, 90% 100%, 0 100%)',
            transformOrigin: 'left top',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Accent Border Stroke Tracing Outer Fan Edge */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -5,
            width: 2100,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${strokeExitX}px, 0, 0) scaleX(${isExiting ? 1 : strokeScaleX})`,
            borderRadius: 2,
            boxShadow: `0 0 20px ${accentColor}, 0 0 35px ${accentColor}`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1580px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
