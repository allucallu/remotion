import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 3. LowerThirdJaggedTear (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME (Top flap dari -1800px atas, Bottom flap dari +1800px bawah, Container dari -3000px kiri).
 * Dua bilah clip-path polygon bergigi robek menutup lalu terbuka secara vertikal mengungkapkan kontainer utama.
 * Saat exit, seluruh elemen terpental keluar melintasi batas frame 4K (atas, bawah, dan kanan +3840px).
 *
 * GERAKAN SEKUNDER:
 * Aksen laser bar meluncur di sepanjang torehan bergerigi (frame 25) dan menembak keluar ke kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1560px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
 *
 * DURASI: 210 frames (7.0s @ 30fps)
 */

interface LowerThirdJaggedTearProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdJaggedTear: React.FC<LowerThirdJaggedTearProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#10B981',
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
  const topTearSpring = spring({ frame: localFrame - 3, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const botTearSpring = spring({ frame: localFrame - 5, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const laserSpring = spring({ frame: localFrame - 25, fps, config: { damping: 14, stiffness: 180, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen interpolations (-3000px left, -1800px top, +1800px bottom, +3840px right)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-3000, 0]);

  const topY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(topTearSpring, [0, 1], [-1800, 0]);

  const botY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(botTearSpring, [0, 1], [1800, 0]);

  const laserScaleX = interpolate(laserSpring, [0, 1], [0, 1]);
  const laserExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        {/* Background Reveal Plate (Container) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 2250,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: 10,
            transform: `translateX(${containerX}px)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Top Torn Shroud */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -20,
            width: 2280,
            height: 140,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 90% 95%, 80% 65%, 70% 90%, 60% 60%, 50% 100%, 40% 70%, 30% 95%, 20% 60%, 10% 90%, 0 70%)',
            transform: `translateY(${topY}px)`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        />

        {/* Bottom Torn Shroud */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: 130,
            width: 2280,
            height: 140,
            backgroundColor: '#1E293B',
            clipPath: 'polygon(0 30%, 10% 10%, 20% 40%, 30% 5%, 40% 30%, 50% 0%, 60% 40%, 70% 10%, 80% 35%, 90% 5%, 100% 30%, 100% 100%, 0 100%)',
            transform: `translateY(${botY}px)`,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Laser Bar Sweeping along central seam */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 125,
            width: 2200,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${laserExitX}px, 0, 0) scaleX(${isExiting ? 1 : laserScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1560px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
