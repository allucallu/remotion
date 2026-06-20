import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { W4K, H4K, FPS } from "./UIElements/utils";

// ─── M1: Terminal UI ──────────────────────────────────────────────────────────
import {
  BootSequenceTerminal,
  NeuralNetworkProcessing,
  CyberDataTransfer,
  FatalSystemCrash,
  SecurityPasswordCracker,
} from "./UIElements/TerminalUI";

// ─── M2: News Tickers ─────────────────────────────────────────────────────────
import {
  BreakingNewsTicker,
  EmergencyAlertSystem,
  TopSecretWipe,
  CyberLockdown,
  CrimeSceneLine,
} from "./UIElements/NewsTickers";

// ─── M3: Retro VHS ────────────────────────────────────────────────────────────
import {
  Camcorder90s,
  LowBatteryWarning,
  GlitchyNoSignal,
  VCRFastForward,
  SecurityCCTV,
} from "./UIElements/RetroVHS";

// ─── M4: Sports Overlays ──────────────────────────────────────────────────────
import {
  MatchTimer45Mins,
  VARReviewScreen,
  InjuryTimeBoard,
  MsRaceStopwatch,
  MatchStatusBanners,
} from "./UIElements/SportsOverlays";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          MODULE 1 — Terminal UI & Hacker
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="TU-BootSequence" component={BootSequenceTerminal} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TU-NeuralNetwork" component={NeuralNetworkProcessing} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TU-DataTransfer" component={CyberDataTransfer} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TU-FatalCrash" component={FatalSystemCrash} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TU-PasswordCracker" component={SecurityPasswordCracker} durationInFrames={240} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 2 — News Tickers & Peringatan
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="NT-BreakingNews" component={BreakingNewsTicker} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="NT-EmergencyAlert" component={EmergencyAlertSystem} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="NT-TopSecretWipe" component={TopSecretWipe} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="NT-CyberLockdown" component={CyberLockdown} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="NT-CrimeScene" component={CrimeSceneLine} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 3 — Retro Kamera & Efek VHS
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="RV-Camcorder90s" component={Camcorder90s} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="RV-LowBattery" component={LowBatteryWarning} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="RV-GlitchNoSignal" component={GlitchyNoSignal} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="RV-VCRFastForward" component={VCRFastForward} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="RV-SecurityCCTV" component={SecurityCCTV} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 4 — Hamparan Siaran Olahraga
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="SO-MatchTimer" component={MatchTimer45Mins} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SO-VARScreen" component={VARReviewScreen} durationInFrames={240} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SO-InjuryTime" component={InjuryTimeBoard} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SO-MsStopwatch" component={MsRaceStopwatch} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SO-MatchBanners" component={MatchStatusBanners} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    </>
  );
};
