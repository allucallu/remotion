import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { W4K, H4K, FPS } from "./UIElements/utils";

// ─── M1: Tactical HUD ─────────────────────────────────────────────────────────
import {
  HexagonGridExpansion,
  AutoTurretRange,
  TechTreeNode,
  GeometrySpawnRadar,
  EnergyShieldBar,
} from "./UIElements/TacticalHUD";

// ─── M2: Progression HUD ──────────────────────────────────────────────────────
import {
  EndlessWaveProgress,
  IdleResourceGenerator,
  FloatingDamageNumbers,
  MinimalistUpgradePanel,
  IdleMultiplierMeter,
} from "./UIElements/ProgressionHUD";

// ─── M3: System Events ────────────────────────────────────────────────────────
import {
  SystemPrestigeRebirth,
  BossEncounterWarning,
  OfflineEarningsPopup,
  CoreOverclock,
  NeonParticleLootDrop,
} from "./UIElements/SystemEvents";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          MODULE 1 — Tactical HUD (Geometry & Range)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="TH-HexagonGrid" component={HexagonGridExpansion} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TH-AutoTurret" component={AutoTurretRange} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TH-TechTree" component={TechTreeNode} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TH-SpawnRadar" component={GeometrySpawnRadar} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TH-ShieldBar" component={EnergyShieldBar} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 2 — Progression HUD (Numbers & Multipliers)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="PH-EndlessWave" component={EndlessWaveProgress} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="PH-IdleResource" component={IdleResourceGenerator} durationInFrames={300} fps={FPS} width={W4K} height={H4K} />
      <Composition id="PH-DamageNumbers" component={FloatingDamageNumbers} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="PH-UpgradePanel" component={MinimalistUpgradePanel} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="PH-IdleMultiplier" component={IdleMultiplierMeter} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 3 — System Events (Alerts & Loot)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="SE-PrestigeRebirth" component={SystemPrestigeRebirth} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SE-BossWarning" component={BossEncounterWarning} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SE-OfflineEarnings" component={OfflineEarningsPopup} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SE-CoreOverclock" component={CoreOverclock} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SE-ParticleLoot" component={NeonParticleLootDrop} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
    </>
  );
};
