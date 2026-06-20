import "./index.css";
import { Composition } from "remotion";

// ─── Module 1: Social Engagement Pop-ups ─────────────────────────────────────
import {
  HeartBurst,
  CommentBubble,
  FollowNotif,
  ShareRipple,
} from "./UIElements/SocialEngagement";

// ─── Module 2: Subscribe & Follow Button States ───────────────────────────────
import {
  SubscribeIdle,
  SubscribeHover,
  SubscribeClick,
  SubscribeCounter,
  SubscribeConfirmed,
} from "./UIElements/SubscribeButton";

// ─── Module 3: Story & Post Frame Overlay ────────────────────────────────────
import {
  StoryUI,
  PostUI,
  ReelUI,
} from "./UIElements/StoryFrameOverlay";

// ─── Module 4: Phone Screen UI Mockup Scene ──────────────────────────────────
import {
  PhoneFeedScroll,
  PhoneChatUI,
  PhoneCheckout,
} from "./UIElements/PhoneMockup";

// ─── Module 5: Loading, Progress & Badge Reveal Pack ─────────────────────────
import {
  LoadingSpinner,
  ProgressBar,
  BadgeReveal,
  CheckmarkStamp,
  SkeletonLoad,
} from "./UIElements/LoadingBadgePack";

// ─── Canvas constants ─────────────────────────────────────────────────────────
const W4K = 3840;
const H4K = 2160;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          MODULE 1 — Social Engagement Pop-ups
          Background: #000000 | Blend mode: Screen
          ═══════════════════════════════════════════════════════════════ */}
      <Composition
        id="SE-HeartBurst"
        component={HeartBurst}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SE-CommentBubble"
        component={CommentBubble}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SE-FollowNotif"
        component={FollowNotif}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SE-ShareRipple"
        component={ShareRipple}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 2 — Subscribe & Follow Button States
          Background: #000000 | Blend mode: Screen
          ═══════════════════════════════════════════════════════════════ */}
      <Composition
        id="SB-Idle"
        component={SubscribeIdle}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SB-HoverGlow"
        component={SubscribeHover}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SB-ClickRipple"
        component={SubscribeClick}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SB-CounterRise"
        component={SubscribeCounter}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SB-SubscribedCheck"
        component={SubscribeConfirmed}
        durationInFrames={240}
        fps={FPS}
        width={W4K}
        height={H4K}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 3 — Story & Post Frame Overlay
          Background: #000000 | Center zone = placeholder (black = transparent on Screen)
          ═══════════════════════════════════════════════════════════════ */}
      <Composition
        id="SF-StoryUI"
        component={StoryUI}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SF-PostUI"
        component={PostUI}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="SF-ReelUI"
        component={ReelUI}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 4 — Phone Screen UI Mockup Scene
          Background: #000000 | Flat render, no alpha needed
          ═══════════════════════════════════════════════════════════════ */}
      <Composition
        id="PM-FeedScroll"
        component={PhoneFeedScroll}
        durationInFrames={300}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="PM-ChatUI"
        component={PhoneChatUI}
        durationInFrames={240}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="PM-CheckoutPage"
        component={PhoneCheckout}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />

      {/* ═══════════════════════════════════════════════════════════════
          MODULE 5 — Loading, Progress & Badge Reveal Pack
          Background: #000000 | Blend mode: Screen
          ═══════════════════════════════════════════════════════════════ */}
      <Composition
        id="LB-Spinner"
        component={LoadingSpinner}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="LB-ProgressBar"
        component={ProgressBar}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="LB-BadgeReveal"
        component={BadgeReveal}
        durationInFrames={210}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="LB-CheckmarkStamp"
        component={CheckmarkStamp}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
      <Composition
        id="LB-SkeletonLoad"
        component={SkeletonLoad}
        durationInFrames={180}
        fps={FPS}
        width={W4K}
        height={H4K}
      />
    </>
  );
};
