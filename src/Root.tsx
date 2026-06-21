import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { W4K, H4K, FPS } from "./UIElements/utils";

// ─── PART 1: Odds & Probabilitas ───────────────────────────────────
import {
  LiveOddsFluctuator,
  SafeParlayBuilder,
  HeadToHeadMomentum,
  OverUnderTracker,
  MatchWinProbability,
} from "./UIElements/BettingPart1";

// ─── PART 2: Taktis & Tracker ──────────────────────────────────────
import {
  ExpectedGoalsDynamics,
  AsianHandicapIndicator,
  FormGuideTracker,
  SharpMoneyAlert,
  CleanSheetProbability,
} from "./UIElements/BettingPart2";

// ─── PART 3: Live Action & Emosi ───────────────────────────────────
import {
  LiveCashOutPulsar,
  InPlayPossession,
  BTTSRadar,
  InjuryTimeDrama,
  BankrollROITracker,
} from "./UIElements/BettingPart3";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          PART 1 (01-05)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="LiveOddsFluctuator" component={LiveOddsFluctuator} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SafeParlayBuilder" component={SafeParlayBuilder} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="HeadToHeadMomentum" component={HeadToHeadMomentum} durationInFrames={210} fps={FPS} width={W4K} height={H4K} />
      <Composition id="OverUnderTracker" component={OverUnderTracker} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="MatchWinProbability" component={MatchWinProbability} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          PART 2 (06-10)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="ExpectedGoalsDynamics" component={ExpectedGoalsDynamics} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="AsianHandicapIndicator" component={AsianHandicapIndicator} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="FormGuideTracker" component={FormGuideTracker} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="SharpMoneyAlert" component={SharpMoneyAlert} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="CleanSheetProbability" component={CleanSheetProbability} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />

      {/* ═══════════════════════════════════════════════════════════════
          PART 3 (11-15)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition id="LiveCashOutPulsar" component={LiveCashOutPulsar} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="InPlayPossession" component={InPlayPossession} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="BTTSRadar" component={BTTSRadar} durationInFrames={150} fps={FPS} width={W4K} height={H4K} />
      <Composition id="InjuryTimeDrama" component={InjuryTimeDrama} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
      <Composition id="BankrollROITracker" component={BankrollROITracker} durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    </>
  );
};
