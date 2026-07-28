import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 5. LowerThirdHelixRibbonWeave (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME (Ribbon 1 dari -3000px kiri, Ribbon 2 dari +3840px kanan), dua untai pita lengkung sinusoidal meluncur berpintal dan saling menjalin membentuk bingkai geometris.
 * Saat exit, kedua untai pita meluncur mundur keluar frame 4K ke arah asalnya masing-masing.
 *
 * GERAKAN SEKUNDER:
 * Garis pembagi tengah neon menyala secara horizontal di antara dua untai (frame 32) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1560px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdHelixRibbonWeaveProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdHelixRibbonWeave: React.FC<LowerThirdHelixRibbonWeaveProps> = ({
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

  // Ribbon 1 (from LEFT -3000px) & Ribbon 2 (from RIGHT +3840px) Springs
  const r1Spring = spring({ frame: localFrame, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const r2Spring = spring({ frame: localFrame - 4, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  // Secondary Motion Spring: Center Divider Line (Delayed frame 32)
  const lineSpring = spring({ frame: localFrame - 32, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (-3000px left, +3840px right)
  const r1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(r1Spring, [0, 1], [-3000, 0]);

  const r2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(r2Spring, [0, 1], [3840, 0]);

  const r1RotZ = interpolate(r1Spring, [0, 1], [-45, 0]);
  const r2RotZ = interpolate(r2Spring, [0, 1], [45, 0]);

  const lineScaleX = interpolate(lineSpring, [0, 1], [0, 1]);
  const lineExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1530;

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
        {/* Upper Strand (Ribbon 1 - Slides from LEFT) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 135,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
            transformOrigin: 'left center',
            transform: `translate3d(${r1X}px, 0, 0) rotate(${r1RotZ}deg)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Lower Strand (Ribbon 2 - Slides from RIGHT) */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 140,
            width: 1950,
            height: 90,
            backgroundColor: '#0284C7',
            clipPath: 'polygon(4% 0, 100% 0, 94% 100%, 0 100%)',
            transformOrigin: 'right center',
            transform: `translate3d(${r2X}px, 0, 0) rotate(${r2RotZ}deg)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Center Divider Line Igniting Horizontally */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 135,
            width: 2000,
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
        - Primary Name Line: Left = 250px, Top = 1560px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
