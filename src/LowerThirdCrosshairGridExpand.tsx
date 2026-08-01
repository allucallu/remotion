import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 3: KINETIC GRID & SWISS DESIGN
 * Konsep 5: LowerThirdCrosshairGridExpand (Bentuk Visual Target Reticle Crosshair Swiss Grid)
 *
 * MEKANISME REVEAL UTAMA:
 * Dimulai dari titik silang aksen target reticle crosshair (+) yang meledak mekar membentuk kisi geometris asimetris bertingkat (grid Swiss).
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Bracket HUD aksen L-corner mekar menancap di sudut kisi (frame 30) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Kisi-kisi geometris menyusut cepat kembali ke titik silang crosshair dan menghilang sempurna.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1560px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1670px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdCrosshairGridExpand: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#6366F1',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springSnappy = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroBracket = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Scale & Expand Interpolations
  const gridScaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(springSnappy, [0, 1], [0.01, 1]);

  const gridScaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(springSnappy, [0, 1], [0.01, 1]);

  const bracketScale = interpolate(springMicroBracket, [0, 1], [0, 1]);
  const bracketExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3500]) : 0;

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
        {/* Main Target Reticle Swiss Grid Slate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            transformOrigin: 'left center',
            transform: `scale(${gridScaleX}, ${gridScaleY})`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}60`,
          }}
        />

        {/* Subtier Swiss Grid Slate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#1E1B4B',
            borderRadius: '0 0 12px 12px',
            transformOrigin: 'left center',
            transform: `scale(${gridScaleX}, ${gridScaleY})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Corner L-Bracket HUD Crosshair */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
            width: 60,
            height: 60,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `translate3d(${bracketExitX}px, 0, 0) scale(${isExiting ? 1 : bracketScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '4px solid #0F172A',
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1560px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1670px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
