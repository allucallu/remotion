import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 10. LowerThirdConcentricRingBurst (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME KIRI (-3000px), tiga segmen cincin konsentris meletup melingkar ke luar meninggalkan kontainer kapsul multi-layer di tengahnya.
 * Saat exit, seluruh kapsul dan cincin meluncur keluar melintasi batas frame kanan (+3840px).
 *
 * GERAKAN SEKUNDER:
 * Penanda aksen meluncur menyusuri busur cincin atas (frame 30) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdConcentricRingBurstProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdConcentricRingBurst: React.FC<LowerThirdConcentricRingBurstProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#10B981',
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
  const ringSpring = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 160, mass: 0.7 } });
  const markerSpring = spring({ frame: localFrame - 30, fps, config: { damping: 12, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (Start: -3000px left, End: +3840px right)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-3000, 0]);

  const ringScale = interpolate(ringSpring, [0, 1], [0.3, 1]);
  const ringOpacity = interpolate(ringSpring, [0, 1], [0, 1]);

  const markerProgress = interpolate(markerSpring, [0, 1], [0, 1]);
  const markerX = isExiting
    ? interpolate(exitSpring, [0, 1], [markerProgress * 2000, 3840])
    : markerProgress * 2000;

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
        {/* Main Base Pill Container */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 10,
            width: 2200,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: 70,
            transform: `translateX(${containerX}px)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Subordinate Pill Tier */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 145,
            width: 1800,
            height: 85,
            backgroundColor: '#047857',
            borderRadius: 42,
            transform: `translateX(${containerX}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Concentric Bursting Rings on Left Anchor */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: `4px solid ${accentColor}`,
            transformOrigin: 'center center',
            transform: `translateX(${containerX}px) scale(${ringScale})`,
            opacity: ringOpacity,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 15,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: 10,
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: `2px dashed ${accentColor}`,
            transformOrigin: 'center center',
            transform: `translateX(${containerX}px) scale(${ringScale * 1.1})`,
            opacity: ringOpacity * 0.7,
            zIndex: 14,
          }}
        />

        {/* SECONDARY MOTION: Glowing Edge Marker Sliding Along Top Arc */}
        <div
          style={{
            position: 'absolute',
            left: 100 + markerX,
            top: 5,
            width: 24,
            height: 24,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            opacity: markerProgress > 0.05 ? 1 : 0,
            zIndex: 20,
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
