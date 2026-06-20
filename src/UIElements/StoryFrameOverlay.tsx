import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { C, ci, SPRING, EaseOutBack, EaseOutExpo, EaseOut, EaseInOut, W, H } from "./utils";

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const Avatar: React.FC<{ size: number; label: string; gradient?: string[] }> = ({
  size, label, gradient = [C.storyGrad1, C.storyGrad2],
}) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.white,
    fontSize: size * 0.4,
    fontWeight: 700,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    flexShrink: 0,
  }}>
    {label}
  </div>
);

// ─── Story UI Icons ───────────────────────────────────────────────────────────
const CloseIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MoreIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="2" fill={C.white} />
    <circle cx="12" cy="12" r="2" fill={C.white} />
    <circle cx="19" cy="12" r="2" fill={C.white} />
  </svg>
);

const HeartIconOutline: React.FC<{ size: number; filled?: boolean }> = ({ size, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? C.heart : "none"}
      stroke={filled ? C.heart : C.white}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CommentIconOutline: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
      stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
    />
  </svg>
);

const ShareIconOutline: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
    <polyline points="16 6 12 2 8 6" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="12" y1="2" x2="12" y2="15" stroke={C.white} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BookmarkIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const SendIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <line x1="22" y1="2" x2="11" y2="13" stroke={C.white} strokeWidth="2" strokeLinecap="round" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SF-STORYUI — Instagram Story-style overlay
// ═══════════════════════════════════════════════════════════════════════════════
export const StoryUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = ci(frame, [0, 15], [0, 1], EaseOutExpo);
  const fadeOut = ci(frame, [155, 180], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  // Progress bar fills over time (stories)
  const NUM_STORIES = 5;
  const ACTIVE_IDX = 2; // 3rd story is active

  // Top bar elements slide down
  const topBarY = ci(frame, [0, 20], [-60, 0], EaseOutExpo);

  // Bottom bar slides up
  const bottomBarY = ci(frame, [0, 20], [80, 0], EaseOutExpo);

  // Username area
  const userScale = spring({ frame, fps, config: SPRING.gentle, from: 0.8, to: 1, durationInFrames: 20 });

  const progressFill = ci(frame, [20, 160], [0, 1]); // active story progress

  // "View More" chevron pulse
  const chevronY = Math.sin((frame / fps) * Math.PI * 2) * 8;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, opacity }}>
      {/* Center zone stays black (placeholder for creator content) */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Subtle vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ─── TOP BAR ─────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "60px 80px 0",
        transform: `translateY(${topBarY}px)`,
      }}>
        {/* Story progress bars */}
        <div style={{ display: "flex", gap: 16, marginBottom: 50 }}>
          {Array.from({ length: NUM_STORIES }).map((_, i) => {
            const fillW = i < ACTIVE_IDX ? 1 : i === ACTIVE_IDX ? progressFill : 0;
            return (
              <div key={i} style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                backgroundColor: "rgba(255,255,255,0.3)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${fillW * 100}%`,
                  background: C.white,
                  borderRadius: 4,
                }} />
              </div>
            );
          })}
        </div>

        {/* Username row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          transform: `scale(${userScale})`,
          transformOrigin: "left center",
        }}>
          <Avatar size={100} label="U" gradient={[C.storyGrad1, C.storyGrad2]} />
          <div>
            <div style={{
              color: C.white,
              fontSize: 52,
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            }}>
              @username
            </div>
            <div style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 40,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            }}>
              2h ago · ●
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 30 }}>
            <MoreIcon size={60} />
            <CloseIcon size={60} />
          </div>
        </div>
      </div>

      {/* ─── BOTTOM BAR ──────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0 80px 80px",
        transform: `translateY(${bottomBarY}px)`,
      }}>
        {/* Reply input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          background: "rgba(255,255,255,0.08)",
          border: "2px solid rgba(255,255,255,0.25)",
          borderRadius: 60,
          padding: "28px 50px",
          backdropFilter: "blur(10px)",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 50,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            flex: 1,
          }}>
            Send message...
          </span>
          <div style={{ display: "flex", gap: 40 }}>
            <HeartIconOutline size={68} />
            <SendIcon size={68} />
          </div>
        </div>

        {/* "View More" indicator */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 30,
          transform: `translateY(${chevronY}px)`,
        }}>
          <svg width={60} height={40} viewBox="0 0 24 16" fill="none">
            <path d="M2 2l10 10L22 2" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" opacity={0.7} />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SF-POSTUI — Social Media Post overlay (action bar)
// ═══════════════════════════════════════════════════════════════════════════════
export const PostUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = ci(frame, [0, 15], [0, 1], EaseOutExpo);
  const fadeOut = ci(frame, [155, 180], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  const topY = ci(frame, [0, 20], [-80, 0], EaseOutBack);
  const bottomY = ci(frame, [0, 20], [100, 0], EaseOutBack);

  // Like animation at frame 60
  const isLiked = frame > 60;
  const heartBeat = spring({ frame: frame - 60, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 18 });
  const heartScale = isLiked ? (frame < 80 ? heartBeat : 1) : 1;

  // Like count
  const likeCount = frame > 60 ? "24,892" : "24,891";
  const likeCountOpacity = ci(frame, [58, 68], [1, 0.5]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, opacity }}>
      {/* Vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.8) 100%)",
        pointerEvents: "none",
      }} />

      {/* ─── TOP HEADER ──────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "60px 80px",
        display: "flex",
        alignItems: "center",
        gap: 30,
        transform: `translateY(${topY}px)`,
      }}>
        <Avatar size={110} label="U" gradient={[C.phoneBlue, C.storyPurple]} />
        <div style={{ flex: 1 }}>
          <div style={{
            color: C.white,
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          }}>
            username
          </div>
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 40,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          }}>
            Jakarta, Indonesia
          </div>
        </div>
        <div style={{
          paddingInline: 40,
          paddingBlock: 18,
          border: "2px solid rgba(255,255,255,0.6)",
          borderRadius: 30,
          color: C.white,
          fontSize: 46,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 600,
        }}>
          Follow
        </div>
        <MoreIcon size={64} />
      </div>

      {/* ─── BOTTOM ACTION BAR ───────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "0 80px 80px",
        transform: `translateY(${bottomY}px)`,
      }}>
        {/* Action row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
            {/* Heart */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ transform: `scale(${heartScale})` }}>
                <HeartIconOutline size={80} filled={isLiked} />
              </div>
              <span style={{
                color: C.white,
                fontSize: 38,
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                opacity: likeCountOpacity,
              }}>{likeCount}</span>
            </div>
            {/* Comment */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <CommentIconOutline size={80} />
              <span style={{ color: C.white, fontSize: 38, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>1,204</span>
            </div>
            {/* Share */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <ShareIconOutline size={80} />
              <span style={{ color: C.white, fontSize: 38, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>Share</span>
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <BookmarkIcon size={80} />
          </div>
        </div>

        {/* Caption */}
        <div style={{
          color: C.white,
          fontSize: 48,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 700 }}>username </span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>
            Your caption goes here — add your text overlay 🎬✨
          </span>
        </div>

        {/* Comments preview */}
        <div style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 42,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          marginTop: 16,
        }}>
          View all 284 comments
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SF-REELUI — Short-form video Reel overlay (vertical 9:16 in 4K canvas)
// ═══════════════════════════════════════════════════════════════════════════════

const MusicNote: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M9 18V5l12-2v13" stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="6" cy="18" r="3" fill={C.white} />
    <circle cx="18" cy="16" r="3" fill={C.white} />
  </svg>
);

export const ReelUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = ci(frame, [0, 15], [0, 1], EaseOutExpo);
  const fadeOut = ci(frame, [155, 180], [1, 0]);
  const opacity = Math.min(fadeIn, fadeOut);

  const rightBarX = ci(frame, [0, 22], [120, 0], EaseOutBack);
  const bottomY = ci(frame, [0, 22], [100, 0], EaseOutBack);

  // Music disc rotation
  const discRot = (frame / fps) * 180;

  // Like heart beat at frame 70
  const isLiked = frame > 70;
  const heartBeat = spring({ frame: frame - 70, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 18 });
  const heartIconScale = isLiked ? (frame < 90 ? heartBeat : 1) : 1;

  // Icon pulse for right bar items
  const iconPulse = (offset: number) => 1 + Math.sin((frame / fps) * Math.PI * 1.5 + offset) * 0.04;

  // Vertical content area definition (9:16 in center of 4K 16:9)
  // 9:16 at 4K height (2160): width = 2160 * 9/16 = 1215
  const REEL_W = 1215;
  const REEL_LEFT = (W - REEL_W) / 2; // 1312.5

  // Progress bar (short-form progress)
  const progressW = ci(frame, [15, 160], [0, REEL_W], EaseOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, opacity }}>
      {/* Vignette on reel area */}
      <div style={{
        position: "absolute",
        left: REEL_LEFT,
        top: 0,
        width: REEL_W,
        height: H,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.8) 100%)",
        pointerEvents: "none",
      }} />

      {/* ─── RIGHT SIDEBAR ICONS ─────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        right: W - REEL_LEFT - REEL_W + 60,
        bottom: 300,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 60,
        transform: `translateX(${rightBarX}px)`,
      }}>
        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <Avatar size={110} label="U" gradient={[C.storyGrad1, C.storyGrad2]} />
          <div style={{
            position: "absolute",
            bottom: -18,
            left: "50%",
            transform: "translateX(-50%)",
            width: 42,
            height: 42,
            borderRadius: "50%",
            backgroundColor: C.heart,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke={C.white} strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Heart */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${heartIconScale})` }}>
          <HeartIconOutline size={82} filled={isLiked} />
          <span style={{ color: C.white, fontSize: 38, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>24.8K</span>
        </div>

        {/* Comment */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${iconPulse(1)})` }}>
          <CommentIconOutline size={82} />
          <span style={{ color: C.white, fontSize: 38, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>1.2K</span>
        </div>

        {/* Share */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${iconPulse(2)})` }}>
          <ShareIconOutline size={82} />
          <span style={{ color: C.white, fontSize: 38, fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>Share</span>
        </div>

        {/* Spinning music disc */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `conic-gradient(from ${discRot}deg, ${C.storyPurple}, ${C.storyPink}, ${C.storyBlue}, ${C.storyPurple})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 30px ${C.storyPurple}`,
        }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: C.black,
          }} />
        </div>
      </div>

      {/* ─── BOTTOM TEXT AREA ────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: REEL_LEFT,
        width: REEL_W - 160,
        padding: "0 60px 120px",
        transform: `translateY(${bottomY}px)`,
      }}>
        {/* Username */}
        <div style={{
          color: C.white,
          fontSize: 56,
          fontWeight: 700,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          marginBottom: 16,
        }}>
          @username
        </div>
        {/* Caption */}
        <div style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 44,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          lineHeight: 1.5,
          marginBottom: 24,
        }}>
          Your reel caption here ✨ #trending
        </div>
        {/* Music bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          color: "rgba(255,255,255,0.75)",
          fontSize: 38,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}>
          <MusicNote size={48} />
          <span>Original Audio · @username</span>
        </div>
      </div>

      {/* ─── PROGRESS BAR ────────────────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: REEL_LEFT,
        width: REEL_W,
        height: 6,
        backgroundColor: "rgba(255,255,255,0.25)",
      }}>
        <div style={{
          height: "100%",
          width: progressW,
          background: C.white,
        }} />
      </div>
    </AbsoluteFill>
  );
};
