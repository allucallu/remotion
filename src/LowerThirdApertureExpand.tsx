import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 6. LowerThirdApertureExpand (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME 4K:
 *   - Anchor circle dari kiri (-1200px)
 *   - Base container dari bawah (+1200px)
 *   - Twin rails dari kiri (-3000px)
 * Diafragma polygon iris segi-delapan merekah melingkar meluaskan wadah.
 * Saat exit, seluruh elemen mundur keluar melintasi frame 4K (kiri, bawah, dan kanan +3840px).
 *
 * GERAKAN SEKUNDER:
 * Rel aksen ganda menembak keluar secara horizontal (frame 32) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1550px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1665px, Width = 1800px, Height = 65px
 *
 * DURASI: 210 frames (7.0s @ 30fps)
 */

interface LowerThirdApertureExpandProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdApertureExpand: React.FC<LowerThirdApertureExpandProps> = ({
  primaryColor = '#064E3B',
  accentColor = '#34D399',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 170;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Springs
  const anchorSpring = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });
  const irisSpring = spring({ frame: localFrame - 6, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const railSpring = spring({ frame: localFrame - 32, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations
  const anchorX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1200])
    : interpolate(anchorSpring, [0, 1], [-1200, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1200])
    : interpolate(irisSpring, [0, 1], [1200, 0]);

  const irisProgress = interpolate(irisSpring, [0, 1], [0, 1]);

  const railX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(railSpring, [0, 1], [-3000, 0]);

  // Compute octagonal polygon inset percentages
  const invP = (1 - irisProgress) * 50;
  const clipString = `polygon(${invP}% 0%, ${100 - invP}% 0%, 100% ${invP}%, 100% ${100 - invP}%, ${100 - invP}% 100%, ${invP}% 100%, 0% ${100 - invP}%, 0% ${invP}%)`;

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
        }}
      >
        {/* Main Base Slate with Radial Polygon Clip-Path */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 10,
            width: 2200,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: 12,
            clipPath: clipString,
            transform: `translateY(${containerY}px)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
          }}
        />

        {/* Anchor Circle Icon Base on Left */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 75,
            width: 100,
            height: 100,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transform: `translateX(${anchorX}px)`,
            boxShadow: `0 0 35px ${accentColor}90`,
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: primaryColor,
            }}
          />
        </div>

        {/* SECONDARY MOTION: Twin Accent Rails Shooting Out Horizontally */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 60,
            width: 2100,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translateX(${railX}px)`,
            borderRadius: 2,
            boxShadow: `0 0 15px ${accentColor}`,
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 185,
            width: 1900,
            height: 4,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translateX(${railX}px)`,
            borderRadius: 2,
            boxShadow: `0 0 15px ${accentColor}`,
            zIndex: 10,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1550px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1665px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
