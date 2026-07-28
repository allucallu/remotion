import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 8. LowerThirdElasticRibbonUnroll (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME BOTTOM-LEFT (-2800px, +800px), pita polygon terpintal membentang meregang keluar dengan rotasi 3D (`rotateZ: -35deg -> 0deg`) dan membal elastis spring.
 * Saat exit, seluruh pita meluncur keluar melintasi frame bottom-right (+3840px, +800px).
 *
 * GERAKAN SEKUNDER:
 * Garis kilau tepi (glowing edge trim) meluncur dari luar frame kiri (-2800px) pada frame 28 dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdElasticRibbonUnrollProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdElasticRibbonUnroll: React.FC<LowerThirdElasticRibbonUnrollProps> = ({
  primaryColor = '#4C1D95',
  accentColor = '#C084FC',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Ribbon Coil Unroll & Translate Springs
  const ribbonSpring = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 150, mass: 0.7 } });
  const subSpring = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 140, mass: 0.8 } });
  const trimSpring = spring({ frame: localFrame - 28, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (-2800px left, +800px bottom -> +3840px right, +800px bottom)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(ribbonSpring, [0, 1], [-2800, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 800])
    : interpolate(ribbonSpring, [0, 1], [800, 0]);

  const scaleX = interpolate(ribbonSpring, [0, 1], [0, 1]);
  const rotateZ = interpolate(ribbonSpring, [0, 1], [-35, 0]);
  const subScaleX = interpolate(subSpring, [0, 1], [0, 1]);

  const trimX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(trimSpring, [0, 1], [-2800, 0]);
  const trimScaleX = interpolate(trimSpring, [0, 1], [0, 1]);

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
        {/* Main Upper Ribbon Segment */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
            transformOrigin: 'left center',
            transform: `scaleX(${scaleX}) rotate(${rotateZ}deg)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Subordinate Lower Ribbon Segment */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#6B21A8',
            clipPath: 'polygon(0 0, 96% 0, 90% 100%, 0 100%)',
            transformOrigin: 'left center',
            transform: `scaleX(${subScaleX})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Glowing Edge Trim Draw */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -2,
            width: 2100,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${trimX}px, 0, 0) scaleX(${trimScaleX})`,
            borderRadius: 2,
            boxShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}`,
            zIndex: 15,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 233,
            width: 1750,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${trimX}px, 0, 0) scaleX(${trimScaleX})`,
            borderRadius: 2,
            boxShadow: `0 0 15px ${accentColor}, 0 0 30px ${accentColor}`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1570px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1680px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
