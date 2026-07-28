import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 1. LowerThirdChronoDialUnmask (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Dua busur lingkaran meluncur memutar 270 derajat dari LUAR FRAME TOP-LEFT (-2600px, -1800px) sambil membentangkan sektor topeng melingkar-ke-persegi di sekeliling titik pusat.
 * Saat exit, seluruh struktur berputar dan meluncur keluar melintasi frame top-right (+3840px, -1800px).
 *
 * GERAKAN SEKUNDER:
 * Bar aksen ticker menyambar keluar secara horizontal dari titik pusat (frame 34) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1690px, Width = 1800px, Height = 70px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdChronoDialUnmaskProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdChronoDialUnmask: React.FC<LowerThirdChronoDialUnmaskProps> = ({
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

  // Entrance Springs
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const arcSpring = spring({ frame: localFrame - 4, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const tickerSpring = spring({ frame: localFrame - 34, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (Start: -2600px top-left, End: +3840px top-right)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-2600, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(containerSpring, [0, 1], [-1800, 0]);

  const arcRotate = interpolate(arcSpring, [0, 1], [-270, 0]);
  const maskWidth = interpolate(containerSpring, [0, 1], [0, 2200]);

  const tickerScaleX = interpolate(tickerSpring, [0, 1], [0, 1]);
  const tickerExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(${containerX}px, ${containerY}px, 0)`,
        }}
      >
        {/* Main Base Card with Expanding Width */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 10,
            width: maskWidth,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: '12px 0 0 12px',
            boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
            borderLeft: `6px solid ${accentColor}`,
            overflow: 'hidden',
          }}
        />

        {/* Concentric Rotating Dial Arc Center */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 70,
            width: 110,
            height: 110,
            borderRadius: '50%',
            border: `5px solid ${accentColor}`,
            borderTopColor: 'transparent',
            transformOrigin: 'center center',
            transform: `rotate(${arcRotate}deg)`,
            boxShadow: `0 0 25px ${accentColor}80`,
            zIndex: 15,
          }}
        />

        {/* Inner Counter-Rotating Dial Circle */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 90,
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: '#1E293B',
            border: '3px solid white',
            transformOrigin: 'center center',
            transform: `rotate(${-arcRotate * 1.5}deg)`,
            zIndex: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: accentColor,
              borderRadius: '50%',
            }}
          />
        </div>

        {/* SECONDARY MOTION: Ticker Bar Sweeping Out Horizontally */}
        <div
          style={{
            position: 'absolute',
            left: 120,
            top: 135,
            width: 2050,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${tickerExitX}px, 0, 0) scaleX(${isExiting ? 1 : tickerScaleX})`,
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
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1690px, Width = 1800px, Height = 70px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
