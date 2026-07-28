import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 2. LowerThirdMatrixGlitchShift (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME (Situs 1 & 3 dari -3000px kiri, Situs 2 & 4 dari +3840px kanan), 4 bilah horizontal meluncur melompat dalam offset selang-seling sebelum mengunci rapat.
 * Saat exit, seluruh 4 bilah terbelah dan meluncur kembali keluar frame 4K ke arah asalnya.
 *
 * GERAKAN SEKUNDER:
 * Corner bracket neon melompat keluar di sudut kanan-atas pada frame 36 dan meluncur keluar frame atas (-1500px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1570px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdMatrixGlitchShiftProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdMatrixGlitchShift: React.FC<LowerThirdMatrixGlitchShiftProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#22C55E',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // 4 Horizontal Slice Springs
  const s1Spring = spring({ frame: localFrame, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const s2Spring = spring({ frame: localFrame - 3, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const s3Spring = spring({ frame: localFrame - 6, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });
  const s4Spring = spring({ frame: localFrame - 9, fps, config: { damping: 9, stiffness: 170, mass: 0.7 } });

  // Secondary Motion Spring: Corner Bracket Pop (Delayed frame 36)
  const bracketSpring = spring({ frame: localFrame - 36, fps, config: { damping: 9, stiffness: 180, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Slice Offscreen Interpolations (Odd slices from -3000px left, Even slices from +3840px right)
  const s1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(s1Spring, [0, 1], [-3000, 0]);

  const s2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(s2Spring, [0, 1], [3840, 0]);

  const s3X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(s3Spring, [0, 1], [-3000, 0]);

  const s4X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(s4Spring, [0, 1], [3840, 0]);

  const bracketScale = interpolate(bracketSpring, [0, 1], [0, 1]);
  const bracketExitY = isExiting ? interpolate(exitSpring, [0, 1], [0, -1500]) : 0;

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
        {/* Slice 1 (Top Strip) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 60,
            backgroundColor: primaryColor,
            borderRadius: '10px 10px 0 0',
            transform: `translateX(${s1X}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Slice 2 (Upper-Mid Strip) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 60,
            width: 2200,
            height: 60,
            backgroundColor: '#1E293B',
            transform: `translateX(${s2X}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Slice 3 (Lower-Mid Strip) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 120,
            width: 2200,
            height: 60,
            backgroundColor: primaryColor,
            transform: `translateX(${s3X}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Slice 4 (Bottom Subtier Strip) */}
        <div
          style={{
            position: 'absolute',
            left: 30,
            top: 180,
            width: 1900,
            height: 60,
            backgroundColor: '#15803D',
            borderRadius: '0 0 10px 10px',
            transform: `translateX(${s4X}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Neon Corner Bracket Pop-Out */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -10,
            width: 60,
            height: 60,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `translate3d(0, ${bracketExitY}px, 0) scale(${isExiting ? 1 : bracketScale})`,
            boxShadow: `0 0 30px ${accentColor}90`,
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
              border: '3px solid #0F172A',
              borderRadius: 3,
            }}
          />
        </div>
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1570px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
