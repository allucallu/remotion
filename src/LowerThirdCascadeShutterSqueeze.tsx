import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 6. LowerThirdCascadeShutterSqueeze (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME BAWAH LAYAR 4K (+2200px), 4 panel shutter horizontal mekar membesar secara vertikal dari satu garis lipatan tengah seperti akordeon.
 * Saat exit, seluruh 4 panel mengatup kembali dan meluncur jatuh keluar melintasi frame bawah 4K (+2200px).
 *
 * GERAKAN SEKUNDER:
 * Pasak aksen vertikal di kedua ujung samping menembak mengunci (frame 34) dan meluncur keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1570px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1680px, Width = 1800px, Height = 60px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdCascadeShutterSqueezeProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdCascadeShutterSqueeze: React.FC<LowerThirdCascadeShutterSqueezeProps> = ({
  primaryColor = '#18181B',
  accentColor = '#F97316',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Springs
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 140, mass: 0.8 } });
  const shutterSpring = spring({ frame: localFrame - 6, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const railSpring = spring({ frame: localFrame - 34, fps, config: { damping: 12, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Translate (+2200px bottom drop)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(containerSpring, [0, 1], [2200, 0]);

  // Shutter Vertical Scale
  const shutterScaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(shutterSpring, [0, 1], [0, 1]);

  const railScaleY = interpolate(railSpring, [0, 1], [0, 1]);
  const railExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {/* Shutter Panel Container (Accordian Expand from Center Y) */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 0,
            width: 2150,
            height: 240,
            transformOrigin: 'center center',
            transform: `scaleY(${shutterScaleY})`,
          }}
        >
          {/* Shutter Panel 1 (Top) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 2150,
              height: 60,
              backgroundColor: primaryColor,
              borderRadius: '10px 10px 0 0',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
              borderTop: `4px solid ${accentColor}`,
            }}
          />

          {/* Shutter Panel 2 (Upper-Mid) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 60,
              width: 2150,
              height: 60,
              backgroundColor: '#27272A',
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            }}
          />

          {/* Shutter Panel 3 (Lower-Mid) */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 120,
              width: 2150,
              height: 60,
              backgroundColor: primaryColor,
              boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            }}
          />

          {/* Shutter Panel 4 (Bottom Subtier) */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 180,
              width: 1850,
              height: 55,
              backgroundColor: '#EA580C',
              borderRadius: '0 0 10px 10px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* SECONDARY MOTION: Vertical Side-Rail Caps Shooting Down */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: -10,
            width: 15,
            height: 255,
            backgroundColor: accentColor,
            borderRadius: 4,
            transformOrigin: 'center top',
            transform: `translate3d(${railExitX}px, 0, 0) scaleY(${isExiting ? 1 : railScaleY})`,
            boxShadow: `0 0 20px ${accentColor}90`,
            zIndex: 20,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 2210,
            top: -10,
            width: 15,
            height: 255,
            backgroundColor: accentColor,
            borderRadius: 4,
            transformOrigin: 'center top',
            transform: `translate3d(${railExitX}px, 0, 0) scaleY(${isExiting ? 1 : railScaleY})`,
            boxShadow: `0 0 20px ${accentColor}90`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1570px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1680px, Width = 1800px, Height = 60px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
