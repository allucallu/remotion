import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 7. LowerThirdOrbitalRingConstruct (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME TOP-LEFT (-2600px, -1800px), tiga cincin elips 3D berputar di ruang `rotateZ/X`, mengencang dan mengunci pada jangkar membuat kontainer utama.
 * Saat exit, seluruh struktur berputar dan meluncur keluar melintasi frame top-right (+3840px, -1800px).
 *
 * GERAKAN SEKUNDER:
 * Balok aksen horizontal menembak ke kanan dari jangkar (frame 35) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1550px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1665px, Width = 1850px, Height = 65px
 *
 * DURASI: 210 frames (7.0s @ 30fps)
 */

interface LowerThirdOrbitalRingConstructProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdOrbitalRingConstruct: React.FC<LowerThirdOrbitalRingConstructProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#06B6D4',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 170;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Springs
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const ring1Spring = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const ring2Spring = spring({ frame: localFrame - 8, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const beamSpring = spring({ frame: localFrame - 35, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Translate (-2600px, -1800px -> +3840px, -1800px)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-2600, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(containerSpring, [0, 1], [-1800, 0]);

  const r1RotZ = interpolate(ring1Spring, [0, 1], [-360, 0]);
  const r2RotZ = interpolate(ring2Spring, [0, 1], [360, 0]);

  const beamScaleX = interpolate(beamSpring, [0, 1], [0, 1]);
  const beamExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(${containerX}px, ${containerY}px, 0)`,
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

        {/* Orbital Ring 1 (Outer 3D Ellipse) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 60,
            width: 130,
            height: 130,
            borderRadius: '50%',
            border: `4px dashed ${accentColor}`,
            transformOrigin: 'center center',
            transform: `rotateZ(${r1RotZ}deg) rotateX(60deg)`,
            boxShadow: `0 0 25px ${accentColor}80`,
            zIndex: 15,
          }}
        />

        {/* Orbital Ring 2 (Inner Counter-Rotating 3D Ellipse) */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 80,
            width: 90,
            height: 90,
            borderRadius: '50%',
            border: '3px solid white',
            transformOrigin: 'center center',
            transform: `rotateZ(${r2RotZ}deg) rotateY(60deg)`,
            zIndex: 16,
          }}
        />

        {/* Center Anchor Point */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 110,
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: accentColor,
            boxShadow: `0 0 20px ${accentColor}`,
            zIndex: 17,
          }}
        />

        {/* SECONDARY MOTION: Horizontal Beam Extending to the Right */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 123,
            width: 2100,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${beamExitX}px, 0, 0) scaleX(${isExiting ? 1 : beamScaleX})`,
            borderRadius: 3,
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
