import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { TargetLockReticle } from './compositions/01-TargetLockReticle';
import { RotatingTechFrame } from './compositions/02-RotatingTechFrame';
import { IronmanStyleHUD } from './compositions/03-IronmanStyleHUD';
import { ScanningGridFrame } from './compositions/04-ScanningGridFrame';
import { CyberpunkCornerFrame } from './compositions/05-CyberpunkCornerFrame';

import { RadarSweepTracking } from './compositions/06-RadarSweepTracking';
import { SatelliteOrbitalLock } from './compositions/07-SatelliteOrbitalLock';
import { DroneTrackingBox } from './compositions/08-DroneTrackingBox';
import { HolographicWireframePanel } from './compositions/09-HolographicWireframePanel';
import { SystemChargeUpRing } from './compositions/10-SystemChargeUpRing';

import { MultiLayerDataStream } from './compositions/11-MultiLayerDataStream';
import { ParticleEnergyField } from './compositions/12-ParticleEnergyField';
import { CommandConsoleFrame } from './compositions/13-CommandConsoleFrame';
import { NeuralNetworkFrame } from './compositions/14-NeuralNetworkFrame';
import { ARMultiTagFrame } from './compositions/15-ARMultiTagFrame';

import { GlitchDistortionFrame } from './compositions/16-GlitchDistortionFrame';
import { CircuitBoardFrame } from './compositions/17-CircuitBoardFrame';
import { EnvironmentalScanHUD } from './compositions/18-EnvironmentalScanHUD';
import { LaunchSequenceCountdown } from './compositions/19-LaunchSequenceCountdown';
import { KineticDataTicker } from './compositions/20-KineticDataTicker';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 01. Target Lock Reticle (Full Alpha, 30 FPS, 5s / 150f) */}
      <Composition
        id="01-TargetLockReticle-Alpha"
        component={TargetLockReticle}
        durationInFrames={150}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#FF3300' }}
      />

      {/* 02. Rotating Tech Frame (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="02-RotatingTechFrame-Alpha"
        component={RotatingTechFrame}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF' }}
      />

      {/* 03. Iron Man Style HUD Overlay (Full Alpha, 30 FPS, 12s / 360f) */}
      <Composition
        id="03-IronmanStyleHUD-Alpha"
        component={IronmanStyleHUD}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF', accentColor: '#FFB700' }}
      />

      {/* 04. Scanning Grid Frame (Full Alpha, 30 FPS, 8s / 240f) */}
      <Composition
        id="04-ScanningGridFrame-Alpha"
        component={ScanningGridFrame}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00FF66' }}
      />

      {/* 05. Cyberpunk Corner Frame (Full Alpha, 30 FPS, 7s / 210f) */}
      <Composition
        id="05-CyberpunkCornerFrame-Alpha"
        component={CyberpunkCornerFrame}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#FF007F', accentColor: '#00F0FF' }}
      />

      {/* 06. Radar Sweep Tracking (Full Alpha, 30 FPS, 9s / 270f) */}
      <Composition
        id="06-RadarSweepTracking-Alpha"
        component={RadarSweepTracking}
        durationInFrames={270}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00FF66' }}
      />

      {/* 07. Satellite Orbital Lock (Full Alpha, 30 FPS, 8s / 240f) */}
      <Composition
        id="07-SatelliteOrbitalLock-Alpha"
        component={SatelliteOrbitalLock}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF', accentColor: '#FFB700' }}
      />

      {/* 08. Drone Tracking Box (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="08-DroneTrackingBox-Alpha"
        component={DroneTrackingBox}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#CCFF00' }}
      />

      {/* 09. Holographic Wireframe Panel (Full Alpha, 30 FPS, 11s / 330f) */}
      <Composition
        id="09-HolographicWireframePanel-Alpha"
        component={HolographicWireframePanel}
        durationInFrames={330}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF' }}
      />

      {/* 10. System Charge-Up Ring (Full Alpha, 30 FPS, 7s / 210f) */}
      <Composition
        id="10-SystemChargeUpRing-Alpha"
        component={SystemChargeUpRing}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#FF9900' }}
      />

      {/* 11. Multi-Layer Data Stream (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="11-MultiLayerDataStream-Alpha"
        component={MultiLayerDataStream}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF' }}
      />

      {/* 12. Particle Energy Field (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="12-ParticleEnergyField-Alpha"
        component={ParticleEnergyField}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#FF007F', accentColor: '#00F0FF' }}
      />

      {/* 13. Command Console Frame (Full Alpha, 30 FPS, 12s / 360f) */}
      <Composition
        id="13-CommandConsoleFrame-Alpha"
        component={CommandConsoleFrame}
        durationInFrames={360}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF', accentColor: '#FFB700' }}
      />

      {/* 14. Neural Network Frame (Full Alpha, 30 FPS, 11s / 330f) */}
      <Composition
        id="14-NeuralNetworkFrame-Alpha"
        component={NeuralNetworkFrame}
        durationInFrames={330}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#0088FF', accentColor: '#00F0FF' }}
      />

      {/* 15. AR Multi-Tag Frame (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="15-ARMultiTagFrame-Alpha"
        component={ARMultiTagFrame}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF', accentColor: '#FF6B00' }}
      />

      {/* 16. Glitch Distortion Frame (Full Alpha, 30 FPS, 8s / 240f) */}
      <Composition
        id="16-GlitchDistortionFrame-Alpha"
        component={GlitchDistortionFrame}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00F0FF', accentColor: '#FF0055' }}
      />

      {/* 17. Circuit Board Frame (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="17-CircuitBoardFrame-Alpha"
        component={CircuitBoardFrame}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00FF66' }}
      />

      {/* 18. Environmental Scan HUD (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="18-EnvironmentalScanHUD-Alpha"
        component={EnvironmentalScanHUD}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#38BDF8' }}
      />

      {/* 19. Launch Sequence Countdown (Full Alpha, 30 FPS, 8s / 240f) */}
      <Composition
        id="19-LaunchSequenceCountdown-Alpha"
        component={LaunchSequenceCountdown}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#FF3300', accentColor: '#FF9900' }}
      />

      {/* 20. Kinetic Data Ticker (Full Alpha, 30 FPS, 10s / 300f) */}
      <Composition
        id="20-KineticDataTicker-Alpha"
        component={KineticDataTicker}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ color: '#00FF66', accentColor: '#FFB700' }}
      />
    </>
  );
};
