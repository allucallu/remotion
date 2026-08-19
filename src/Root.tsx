import React from 'react';
import { Composition } from 'remotion';
import './index.css';
import { LowerThirdBroadcast } from './compositions/LowerThirdBroadcast';
import { LowerThirdMinimal } from './compositions/LowerThirdMinimal';
import { LowerThirdBold } from './compositions/LowerThirdBold';
import { LowerThirdFluid } from './compositions/LowerThirdFluid';
import { LowerThirdRetro } from './compositions/LowerThirdRetro';
import { LowerThirdAsymmetric } from './compositions/LowerThirdAsymmetric';
import { LowerThirdViewfinder } from './compositions/LowerThirdViewfinder';
import { LowerThirdAnchor } from './compositions/LowerThirdAnchor';
import { LowerThirdStack } from './compositions/LowerThirdStack';
import { LowerThirdMonolith } from './compositions/LowerThirdMonolith';
import { LowerThirdHexagon } from './compositions/LowerThirdHexagon';
import { LowerThirdGaming } from './compositions/LowerThirdGaming';
import { LowerThirdCorporate } from './compositions/LowerThirdCorporate';
import { LowerThird_ModularIDCard } from './compositions/LowerThird_ModularIDCard';
import { LowerThird_HUDBracket } from './compositions/LowerThird_HUDBracket';
import { LowerThirdHUDHexGrid } from './compositions/LowerThirdHUDHexGrid';
import { LowerThirdGlassPill } from './compositions/LowerThirdGlassPill';
import { LowerThird_TypewriterLedger } from './compositions/LowerThird_TypewriterLedger';
import { LowerThird_WaveformPulse } from './compositions/LowerThird_WaveformPulse';
import { LowerThirdAudioSpectrum } from './compositions/LowerThirdAudioSpectrum';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Varian 1: Broadcast-Quality Tech (Angular Geometry & Chamfer Cut) */}
      <Composition
        id="LowerThirdBroadcast"
        component={LowerThirdBroadcast}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#06B6D4',
          accentGradientEnd: '#3B82F6',
          backgroundColor: 'black',
        }}
      />

      {/* Varian 2: Minimalis-Elegan / Editorial Luxury (Champagne Gold Hairlines & Diamond Notch) */}
      <Composition
        id="LowerThirdMinimal"
        component={LowerThirdMinimal}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#D4AF37', // Champagne Gold
          accentGradientEnd: '#FEF3C7', // Soft Light Gold
          backgroundColor: 'black',
        }}
      />

      {/* Varian 3: Bold Cyber-Sport & Energetic Creator (Neon Violet/Pink & Dual Offset Cards) */}
      <Composition
        id="LowerThirdBold"
        component={LowerThirdBold}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#8B5CF6', // Neon Violet
          accentGradientEnd: '#EC4899', // Hot Electric Pink
          backgroundColor: 'black',
        }}
      />

      {/* Varian 4: Organic-Fluid / Liquid Bio & Lifestyle (Emerald Mint, Cyan Waves, & Floating Droplets) */}
      <Composition
        id="LowerThirdFluid"
        component={LowerThirdFluid}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#10B981', // Emerald Mint
          accentGradientEnd: '#06B6D4', // Vibrant Cyan
          backgroundColor: 'black',
        }}
      />

      {/* Varian 5: Retro-Futuristic Synthwave & Cyberpunk (Neon Magenta/Orange, Barcode Telemetry & Scanlines) */}
      <Composition
        id="LowerThirdRetro"
        component={LowerThirdRetro}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FF007A', // Neon Synthwave Magenta
          accentGradientEnd: '#FF8A00', // Sunburst Amber Orange
          backgroundColor: 'black',
        }}
      />

      {/* Varian 6: Asymmetric Folding Ribbon Shield (Split & Converge Collision & 3D Disperse Exit) */}
      <Composition
        id="LowerThirdAsymmetric"
        component={LowerThirdAsymmetric}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#F59E0B', // Warm Amber Gold
          accentGradientEnd: '#EF4444', // Crimson Red Accent
          backgroundColor: 'black',
        }}
      />

      {/* Varian 7: Cinematic Viewfinder & Documentarian HUD Frame (Zero Box, 4-Bracket Convergence) */}
      <Composition
        id="LowerThirdViewfinder"
        component={LowerThirdViewfinder}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#EF4444', // Crimson Rec Red
          accentGradientEnd: '#F8FAFC', // Pure Platinum Silver
          backgroundColor: 'black',
        }}
      />

      {/* Varian 8: Swiss Editorial Vertical Anchor & Floating Hairlines (Bold Pillar Anchor, Luminous Slate Glass) */}
      <Composition
        id="LowerThirdAnchor"
        component={LowerThirdAnchor}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#EAB308', // Electric Yellow
          accentGradientEnd: '#FACC15', // Bright Lime Yellow
          backgroundColor: 'black',
        }}
      />

      {/* Varian 9: Offset 3D Layered Card Stack (Rotated Cards -3.5° / +2.0° / 0°, Fanning Deck Deal) */}
      <Composition
        id="LowerThirdStack"
        component={LowerThirdStack}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#06B6D4', // Electric Cyan
          accentGradientEnd: '#3B82F6', // Royal Sapphire Blue
          backgroundColor: 'black',
        }}
      />

      {/* Varian 10: Architectural Glass Monolith & Split Capsule (220px Glass Tower, Mechanical Shutter Unfold) */}
      <Composition
        id="LowerThirdMonolith"
        component={LowerThirdMonolith}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#A855F7', // Electric Ultra-Violet Purple
          accentGradientEnd: '#06B6D4', // Cyber Turquoise Cyan
          backgroundColor: 'black',
        }}
      />

      {/* Varian 11: Tactical Cyber Hexagon & Dual Angled Ribbon (180px Hexagon Badge, Laser Wipe) */}
      <Composition
        id="LowerThirdHexagon"
        component={LowerThirdHexagon}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#F97316', // Sunset Neon Orange
          accentGradientEnd: '#84CC16', // Tactical Lime Green
          backgroundColor: 'black',
        }}
      />

      {/* Varian 12: Esports & Cyber Gaming Streamer Shield (200px Shield Badge, 8-bit Core, 5x3 Matrix) */}
      <Composition
        id="LowerThirdGaming"
        component={LowerThirdGaming}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#10B981', // Cyber Emerald Neon Green
          accentGradientEnd: '#EC4899', // Electric Hot Pink
          backgroundColor: 'black',
        }}
      />

      {/* Varian 13: Executive Corporate & High-Finance Wave (Midnight Navy & Luminous Cyan Bezier Wave) */}
      <Composition
        id="LowerThirdCorporate"
        component={LowerThirdCorporate}
        durationInFrames={180} // 6.0 detik pada 30fps
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#06B6D4', // Luminous Cyan
          accentGradientEnd: '#3B82F6', // Royal Sapphire Blue
          backgroundColor: 'black',
        }}
      />

      {/* Varian 14: Modular ID Card (2 Blocks, ±8px Gap, Slate & Amber Gold, 6s Duration) */}
      <Composition
        id="LowerThirdModularIDCard"
        component={LowerThird_ModularIDCard}
        durationInFrames={180} // Total 6.0s (In 0.8s, Hold 4.2s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#D4A857', // Golden Amber Accent
          accentGradientEnd: '#F59E0B',
          backgroundColor: 'black',
        }}
      />

      {/* Varian 15: HUD Bracket (Zero Box, 4 Corners, Fly-In Wobble, Line Draw, Shatter, 7s Duration) */}
      <Composition
        id="LowerThirdHUDBracket"
        component={LowerThird_HUDBracket}
        durationInFrames={210} // Total 7.0s (In 1.0s, Hold 5.0s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#00E5FF', // Electric Cyan
          accentGradientEnd: '#38BDF8',
          backgroundColor: 'black',
        }}
      />

      {/* Varian 16: Sci-Fi Hexagonal HUD Scope & Target Calibration Matrix (Zero Box, Rotating Hex Target, 7s Duration) */}
      <Composition
        id="LowerThirdHUDHexGrid"
        component={LowerThirdHUDHexGrid}
        durationInFrames={210} // Total 7.0s (In 1.0s, Hold 5.0s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#FF3366', // Hot Neon Crimson
          accentGradientEnd: '#00E5FF', // Electric Cyan
          backgroundColor: 'black',
        }}
      />

      {/* Varian 17: Futuristic Bio-Tech Glass Capsule & Laser Node Ring (Curved Capsule, Orbital DNA Atom, 7s Duration) */}
      <Composition
        id="LowerThirdGlassPill"
        component={LowerThirdGlassPill}
        durationInFrames={210} // Total 7.0s (In 1.0s, Hold 5.0s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#00F5A0', // Luminous Mint Emerald
          accentGradientEnd: '#00D9F5', // Electric Turquoise Cyan
          backgroundColor: 'black',
        }}
      />

      {/* Varian 18: Typewriter Ledger (Off-White Paper #EDE6D3, Ruled Lines, Stamp Box, Typing Shake, Organic Ink Wipe, 7s Duration) */}
      <Composition
        id="LowerThirdTypewriterLedger"
        component={LowerThird_TypewriterLedger}
        durationInFrames={210} // Total 7.0s (In 1.5s, Hold 4.5s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#1C1C1C', // Deep Ink Black
          accentGradientEnd: '#333333',
          backgroundColor: 'black',
        }}
      />

      {/* Varian 19: Waveform Pulse (Zero Box, 14-Bar Spectrum Clusters, Mint-Tosca & White, Center-Out Spread, 8s Duration) */}
      <Composition
        id="LowerThirdWaveformPulse"
        component={LowerThird_WaveformPulse}
        durationInFrames={240} // Total 8.0s (In 1.0s, Hold 6.0s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#00FFC2', // Mint-Tosca
          accentGradientEnd: '#FFFFFF', // Pure White
          backgroundColor: 'black',
        }}
      />

      {/* Varian 20: Radial Equalizer Ring & Dual Oscilloscope Horizon (Zero Box, 24-Bar Turbine Ring, Dual Oscilloscope Wave, 8s Duration) */}
      <Composition
        id="LowerThirdAudioSpectrum"
        component={LowerThirdAudioSpectrum}
        durationInFrames={240} // Total 8.0s (In 1.0s, Hold 6.0s, Out 1.0s)
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#8B5CF6', // Electric Violet
          accentGradientEnd: '#00E5FF', // Neon Cyan
          backgroundColor: 'black',
        }}
      />
    </>
  );
};
