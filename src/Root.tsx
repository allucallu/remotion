import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { W4K, H4K, FPS } from "./UIElements/utils";

// ─── PART 1: Existential Tech Errors ─────────────────────────────
import {
  WillToLive404,
  BrainExeError,
  OverthinkingBuffer,
  SocialBatteryWarning,
  BlueScreenOfBurnout,
} from "./UIElements/BrainrotPart1";

// ─── PART 2: Anti-Hustle & Slow Living ───────────────────────────
import {
  SlowLivingProtocol,
  MeetingToEmailConverter,
  HustleModeFailed,
  CopingMechanismUpdate,
  BareMinimumAchievement,
} from "./UIElements/BrainrotPart2";

// ─── PART 3: Dopamine Hooks ──────────────────────────────────────
import {
  DopamineRestockingBar,
  DelusionRecaptcha,
  DownloadingSerotonin,
  AreYouStillDoomscrolling,
  AttentionSpanCheckpoint,
} from "./UIElements/BrainrotPart3";

// ─── PART 4: Sarcastic Notifications ─────────────────────────────
import {
  ThoughtsAndPrayers,
  TermsOfAnxiety,
  DelusionRadarPing,
  UnsubscribeAdulthood,
  VibeCheckTerminal,
} from "./UIElements/BrainrotPart4";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* PART 1 */}
      <Composition id="WillToLive404" component={WillToLive404} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="BrainExeError" component={BrainExeError} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="OverthinkingBuffer" component={OverthinkingBuffer} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SocialBatteryWarning" component={SocialBatteryWarning} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="BlueScreenOfBurnout" component={BlueScreenOfBurnout} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />

      {/* PART 2 */}
      <Composition id="SlowLivingProtocol" component={SlowLivingProtocol} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="MeetingToEmailConverter" component={MeetingToEmailConverter} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="HustleModeFailed" component={HustleModeFailed} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="CopingMechanismUpdate" component={CopingMechanismUpdate} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="BareMinimumAchievement" component={BareMinimumAchievement} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />

      {/* PART 3 */}
      <Composition id="DopamineRestockingBar" component={DopamineRestockingBar} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="DelusionRecaptcha" component={DelusionRecaptcha} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="DownloadingSerotonin" component={DownloadingSerotonin} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="AreYouStillDoomscrolling" component={AreYouStillDoomscrolling} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="AttentionSpanCheckpoint" component={AttentionSpanCheckpoint} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />

      {/* PART 4 */}
      <Composition id="ThoughtsAndPrayers" component={ThoughtsAndPrayers} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="TermsOfAnxiety" component={TermsOfAnxiety} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="DelusionRadarPing" component={DelusionRadarPing} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="UnsubscribeAdulthood" component={UnsubscribeAdulthood} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="VibeCheckTerminal" component={VibeCheckTerminal} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    </>
  );
};
