import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { W4K, H4K, FPS } from "./UIElements/utils";

// ─── Broadcast News Part 1 ───────────────────────────────────────────────────
import {
  BreakingNewsBanner,
  LowerThirdCorporate,
  NewsTicker,
  LiveBroadcastBadge,
  WorldMapIntro,
} from "./UIElements/BroadcastPackPart1";

// ─── Broadcast News Part 2 ───────────────────────────────────────────────────
import {
  WeatherGraphicTemplate,
  CountdownTimerBroadcast,
  SportsScoreboardBug,
  ElectionResultBar,
  StudioTransitionWipe,
} from "./UIElements/BroadcastPackPart2";

// ─── Broadcast News Part 3 ───────────────────────────────────────────────────
import {
  SocialMediaOverlay,
  EmergencyAlertBroadcast,
  SplitScreenLayout,
  PressConferenceBackdrop,
  NewsIntroStinger,
} from "./UIElements/BroadcastPackPart3";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Part 1 */}
    <Composition id="BreakingNewsBanner"       component={BreakingNewsBanner}       durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="LowerThirdCorporate"      component={LowerThirdCorporate}      durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="NewsTicker"               component={NewsTicker}               durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="LiveBroadcastBadge"       component={LiveBroadcastBadge}       durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="WorldMapIntro"            component={WorldMapIntro}            durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    
    {/* Part 2 */}
    <Composition id="WeatherGraphicTemplate"   component={WeatherGraphicTemplate}   durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="CountdownTimerBroadcast"  component={CountdownTimerBroadcast}  durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="SportsScoreboardBug"      component={SportsScoreboardBug}      durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="ElectionResultBar"        component={ElectionResultBar}        durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="StudioTransitionWipe"     component={StudioTransitionWipe}     durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    
    {/* Part 3 */}
    <Composition id="SocialMediaOverlay"       component={SocialMediaOverlay}       durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="EmergencyAlertBroadcast"  component={EmergencyAlertBroadcast}  durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="SplitScreenLayout"        component={SplitScreenLayout}        durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="PressConferenceBackdrop"  component={PressConferenceBackdrop}  durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
    <Composition id="NewsIntroStinger"         component={NewsIntroStinger}         durationInFrames={180} fps={FPS} width={W4K} height={H4K} />
  </>
);
