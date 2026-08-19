import React from 'react';
import { Composition } from 'remotion';
import './index.css';
import { CountdownTimer_FilmLeader } from './compositions/CountdownTimer_FilmLeader';
import { CountdownTimer_CyberHUD } from './compositions/CountdownTimer_CyberHUD';
import { CountdownTimer_MinimalLuxury } from './compositions/CountdownTimer_MinimalLuxury';
import { CountdownTimer_SwissEditorial } from './compositions/CountdownTimer_SwissEditorial';
import { CountdownTimer_FluidOrganic } from './compositions/CountdownTimer_FluidOrganic';
import { CountdownTimer_TerminalBoot } from './compositions/CountdownTimer_TerminalBoot';
import { CountdownTimer_ChronometerVintage } from './compositions/CountdownTimer_ChronometerVintage';
import { CountdownTimer_TerminalSplitGrid } from './compositions/CountdownTimer_TerminalSplitGrid';
import { CountdownTimer_FlipClock } from './compositions/CountdownTimer_FlipClock';
import { CountdownTimer_FlipClockAviation } from './compositions/CountdownTimer_FlipClockAviation';
import { CountdownTimer_RadialEnergy } from './compositions/CountdownTimer_RadialEnergy';
import { CountdownTimer_PortalEnergy } from './compositions/CountdownTimer_PortalEnergy';
import { CountdownTimer_TitaniumCore } from './compositions/CountdownTimer_TitaniumCore';
import { CountdownTimer_SolarLoom } from './compositions/CountdownTimer_SolarLoom';
import { CountdownTimer_PaperCutout } from './compositions/CountdownTimer_PaperCutout';
import { CountdownTimer_InkWash } from './compositions/CountdownTimer_InkWash';
import { CountdownTimer_ShatterGrid } from './compositions/CountdownTimer_ShatterGrid';
import { CountdownTimer_CrystalShard } from './compositions/CountdownTimer_CrystalShard';
import { CountdownTimer_SundialShadow } from './compositions/CountdownTimer_SundialShadow';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Varian 1: Vintage 35mm Celluloid Film Leader Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerFilmLeader"
        component={CountdownTimer_FilmLeader}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Whiteout Reel Tail)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#E5DCB6', // Warm Vintage Sepia Cream
          backgroundColor: 'black',
        }}
      />

      {/* Varian 2: Cyberpunk Sci-Fi HUD & Digital Glitch Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerCyberHUD"
        component={CountdownTimer_CyberHUD}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Laser Beam Implosion)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FF0055', // Hot Cyber Pink
          accentGradientEnd: '#00F0FF', // Electric Cyan
          backgroundColor: 'black',
        }}
      />

      {/* Varian 3: Luxury Editorial & Minimalist Champagne Gold Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerMinimalLuxury"
        component={CountdownTimer_MinimalLuxury}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Golden Bloom Dissolve)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#D4AF37', // Champagne Gold
          accentGradientEnd: '#FEF3C7', // Soft Light Platinum
          backgroundColor: 'black',
        }}
      />

      {/* Varian 4: Swiss International Typographic & Architectural Grid Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerSwissEditorial"
        component={CountdownTimer_SwissEditorial}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Shutter Collapse)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#0F382C', // Emerald Forest Green
          accentGradientEnd: '#E05A47', // Warm Coral Ochre
          backgroundColor: 'black',
        }}
      />

      {/* Varian 5: Organic Fluid & Liquid Bio-Tech Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerFluidOrganic"
        component={CountdownTimer_FluidOrganic}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Liquid Ripple Dissolve)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#10B981', // Emerald Mint
          accentGradientEnd: '#06B6D4', // Ocean Turquoise
          backgroundColor: 'black',
        }}
      />

      {/* Varian 6: Hacking Command-Line & CRT Terminal Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerTerminalBoot"
        component={CountdownTimer_TerminalBoot}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + CRT Dot Collapse)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#00FF41', // Phosphor CRT Green
          backgroundColor: 'black',
        }}
      />

      {/* Varian 7: Vintage Astronomical Chronometer & Clockwork Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerChronometerVintage"
        component={CountdownTimer_ChronometerVintage}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Mechanical Iris Shut)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#E6C594', // Warm Parchment Brass
          accentGradientEnd: '#C87D55', // Aged Copper Rose
          backgroundColor: 'black',
        }}
      />

      {/* Varian 8: Multi-Pane Asymmetric Command Grid Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerTerminalSplitGrid"
        component={CountdownTimer_TerminalSplitGrid}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Asymmetric Shutter Collapse)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FFB000', // Luminous Phosphor Amber
          accentGradientEnd: '#10B981', // Emerald Mint
          backgroundColor: 'black',
        }}
      />

      {/* Varian 9: Authentic Mechanical Airport/Railway Split-Flap Flip Clock (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerFlipClock"
        component={CountdownTimer_FlipClock}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Mechanical Split Door Open)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#F5F5F5', // Crisp Off-White Text
          cardColor: '#2A2A2E', // Metallic Dark Charcoal
          backgroundColor: 'black',
        }}
      />

      {/* Varian 10: Vintage Aviation Solari Split-Flap Board (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerFlipClockAviation"
        component={CountdownTimer_FlipClockAviation}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Chassis Shutter Split)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FFFDFA', // Luminous Warm Parchment
          cardColor: '#1C2026', // Matte Graphite Carbon
          chassisColor: '#15181C', // Industrial Aviation Slate
          backgroundColor: 'black',
        }}
      />

      {/* Varian 11: High-Energy Radial Charging Ring & Solar Plasma Explosion (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerRadialEnergy"
        component={CountdownTimer_RadialEnergy}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Supernova Climax Explosion)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#DC2626', // Crimson Red
          accentOrange: '#F97316', // Solar Orange
          accentYellow: '#FBBF24', // Golden Amber
          backgroundColor: 'black',
        }}
      />

      {/* Varian 12: Quantum Arc Portal & Counter-Rotating Energy Ring Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerPortalEnergy"
        component={CountdownTimer_PortalEnergy}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Quantum Singularity Portal Warp)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#06B6D4', // Electric Cyan
          accentSecondary: '#2563EB', // Deep Cobalt Blue
          accentMint: '#10B981', // Luminous Emerald Mint
          backgroundColor: 'black',
        }}
      />

      {/* Varian 13: High-Tech Aerospace Titanium Gauge & Segmented Arc Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerTitaniumCore"
        component={CountdownTimer_TitaniumCore}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Electromagnetic Core Dissolve)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#3B82F6', // Sapphire Blue
          accentPlatinum: '#F8FAFC', // Platinum White
          titaniumColor: '#2B303A', // Titanium Graphite
          backgroundColor: 'black',
        }}
      />

      {/* Varian 14: Non-Generic Interlaced Kineto-Filament Solar Weave & Eclipse Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerSolarLoom"
        component={CountdownTimer_SolarLoom}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Solar Filament Unravel & Eclipse Collapse)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#F59E0B', // Solar Amber Gold
          accentSecondary: '#C87D55', // Terracotta Copper
          accentCream: '#FEF3C7', // Luminous Champagne Cream
          backgroundColor: 'black',
        }}
      />

      {/* Varian 15: Authentic Paper-Craft / Scrapbook Peel-Off & Stack Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerPaperCutout"
        component={CountdownTimer_PaperCutout}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Paper Layer Scatter Burst)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FF6F61', // Coral
          layerDark1: '#E85A4F', // Deep Coral Dark
          layerDark2: '#C94A3F', // Crimson Shadow
          paperBg: '#FFF8ED', // Soft Warm Cream
          backgroundColor: 'black',
        }}
      />

      {/* Varian 16: Organic Monochrome Ink Wash & Fluid Paper Diffusion Countdown (8.5s = 255 frames @ 30fps) */}
      <Composition
        id="CountdownTimerInkWash"
        component={CountdownTimer_InkWash}
        durationInFrames={255} // 8.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1.5s + Ink Spill & Fade White Exit)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          inkColor: '#0D0D0D', // Deep Ink Black
          paperBg: '#FAF7F2', // Soft Ivory White
          backgroundColor: 'black',
        }}
      />

      {/* Varian 17: Percussive Glitch-Art Fragment Shatter & Assembly Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerShatterGrid"
        component={CountdownTimer_ShatterGrid}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Climax Explosion & Strobe Flash)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          neonCyan: '#00F0FF', // Electric Cyan
          neonMagenta: '#FF00E5', // Hot Magenta
          neonYellow: '#FFE600', // Cyber Yellow
          backgroundColor: 'black',
        }}
      />

      {/* Varian 18: Vortex Hexagonal & Diamond Crystal Shard Shatter Countdown (5.5s = 165 frames @ 30fps) */}
      <Composition
        id="CountdownTimerCrystalShard"
        component={CountdownTimer_CrystalShard}
        durationInFrames={165} // 5.5 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Crystal Supernova & Strobe Flash)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          neonUltraviolet: '#9D00FF', // Electric Ultraviolet
          neonMint: '#00FF9D', // Laser Mint Green
          neonPink: '#FF007F', // Bright Neon Pink
          backgroundColor: 'black',
        }}
      />

      {/* Varian 19: Cinematic Continuous Accelerating Sundial Sweep Countdown (6.0s = 180 frames @ 30fps) */}
      <Composition
        id="CountdownTimerSundialShadow"
        component={CountdownTimer_SundialShadow}
        durationInFrames={180} // 6.0 detik pada 30fps (Angka 5, 4, 3, 2, 1 @ 1s + Hyper-Sweep & Sunset Fade-Out)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          shadowColor: '#3A4A5C', // Translucent Slate Blue
          digitColor: '#FFFFFF', // Pure Clean White
          centerBgColor: '#131313', // Very Dark Slate Charcoal
          backgroundColor: 'black',
        }}
      />
    </>
  );
};
