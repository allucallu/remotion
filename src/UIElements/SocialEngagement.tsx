import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import {
  C, ci, SPRING,
  EaseOutBack, EaseOutExpo, EaseOut,
  HEART_PARTICLES,
  CX, CY,
} from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED SUBCOMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const HeartPath: React.FC<{ size: number; color: string; opacity?: number }> = ({
  size, color, opacity = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 95" fill="none" style={{ opacity }}>
    <path
      d="M50 90C50 90 8 58 8 32C8 18 18 8 32 8C40 8 47 12 50 18C53 12 60 8 68 8C82 8 92 18 92 32C92 58 50 90 50 90Z"
      fill={color}
    />
  </svg>
);

const GlowCircle: React.FC<{ size: number; color: string; opacity: number }> = ({
  size, color, opacity,
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      transform: "translate(-50%, -50%)",
      left: "50%",
      top: "50%",
      pointerEvents: "none",
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1A — HEART BURST
// ═══════════════════════════════════════════════════════════════════════════════

const HeartParticle: React.FC<{
  frame: number;
  angle: number;
  delay: number;
  size: number;
  dist: number;
  color: string;
}> = ({ frame, angle, delay, size, dist, color }) => {
  const f = frame - delay;
  if (f < 0) return null;
  const rad = (angle * Math.PI) / 180;
  const progress = ci(f, [0, 45], [0, 1], EaseOutExpo);
  const x = Math.cos(rad) * dist * progress;
  const y = Math.sin(rad) * dist * progress;
  const opacity = ci(f, [0, 8, 40, 45], [0, 1, 0.8, 0]);
  const scale = ci(f, [0, 10, 45], [0, 1, 0.4], EaseOutExpo);
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
        left: "50%",
        top: "50%",
        opacity,
      }}
    >
      <HeartPath size={size} color={color} />
    </div>
  );
};

export const HeartBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main heart
  const heartScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 25 });
  const heartScale2 = spring({ frame: frame - 80, fps, config: SPRING.wobbly, from: 0, to: 0.7, durationInFrames: 20 });
  const heartPulse = Math.sin((frame / fps) * Math.PI * 4) * 0.04;
  const finalScale = frame < 80 ? heartScale : heartScale2 + heartPulse;
  const heartOpacity = ci(frame, [140, 170], [1, 0]);

  // Glow
  const glowOpacity1 = ci(frame, [0, 12, 50, 80], [0, 0.9, 0.4, 0]);
  const glowSize1 = ci(frame, [0, 50], [300, 1200], EaseOutExpo);
  const glowOpacity2 = ci(frame, [80, 90, 130, 160], [0, 0.7, 0.4, 0]);
  const glowSize2 = ci(frame, [80, 160], [200, 900], EaseOutExpo);

  // +1 counter
  const counterY = ci(frame, [15, 60, 100, 140], [0, -180, -260, -340]);
  const counterOpacity = ci(frame, [15, 25, 90, 130], [0, 1, 1, 0]);
  const counterScale = ci(frame, [15, 28], [0.3, 1], EaseOutBack);

  // Expand rings
  const ring1Scale = ci(frame, [5, 45], [0.1, 2.2], EaseOutExpo);
  const ring1Opacity = ci(frame, [5, 15, 45], [0, 0.6, 0]);
  const ring2Scale = ci(frame, [10, 55], [0.1, 2.5], EaseOutExpo);
  const ring2Opacity = ci(frame, [10, 20, 55], [0, 0.4, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Expanding rings */}
      {[{ s: ring1Scale, o: ring1Opacity }, { s: ring2Scale, o: ring2Opacity }].map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          border: `6px solid ${C.heart}`,
          opacity: r.o,
          transform: `scale(${r.s})`,
        }} />
      ))}

      {/* Glow layers */}
      <div style={{ position: "absolute", inset: 0 }}>
        <GlowCircle size={glowSize1} color={C.heartGlow} opacity={glowOpacity1} />
        <GlowCircle size={glowSize2} color={C.heartGlow} opacity={glowOpacity2} />
      </div>

      {/* Heart Particles */}
      {HEART_PARTICLES.map((p, i) => (
        <HeartParticle key={i} frame={frame} angle={p.angle} delay={p.delay}
          size={p.size} dist={p.dist} color={i % 2 === 0 ? C.heart : C.heartLight} />
      ))}

      {/* Main Heart */}
      <div style={{ transform: `scale(${finalScale})`, opacity: heartOpacity, position: "relative", zIndex: 10 }}>
        <HeartPath size={500} color={C.heart} />
      </div>

      {/* +1 Counter */}
      <div style={{
        position: "absolute",
        opacity: counterOpacity,
        transform: `translateY(${counterY}px) scale(${counterScale})`,
        color: C.white,
        fontSize: 160,
        fontWeight: 900,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        letterSpacing: "-4px",
        textShadow: `0 0 60px ${C.heart}, 0 0 120px ${C.heart}`,
        userSelect: "none",
      }}>
        +1
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1B — COMMENT BUBBLE
// ═══════════════════════════════════════════════════════════════════════════════

const TypingDot: React.FC<{ frame: number; index: number }> = ({ frame, index }) => {
  const delay = index * 12;
  const cycle = ((frame - delay) % 40 + 40) % 40;
  const y = ci(cycle, [0, 12, 24, 36], [0, -28, 0, 0]);
  const opacity = ci(cycle, [0, 8, 24, 36], [0.4, 1, 1, 0.4]);
  return (
    <div style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      backgroundColor: C.comment,
      transform: `translateY(${y}px)`,
      opacity,
    }} />
  );
};

export const CommentBubble: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubbleScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 28 });
  const bubbleOriginY = ci(frame, [0, 28], [60, 0], EaseOutExpo);
  const glowOpacity = ci(frame, [0, 20, 130, 170], [0, 0.7, 0.7, 0]);
  const glowSize = ci(frame, [0, 30], [200, 1400], EaseOutExpo);
  const bubbleOpacity = ci(frame, [150, 180], [1, 0]);

  // Second bubble (reply)
  const bubble2Scale = spring({ frame: frame - 50, fps, config: SPRING.bouncy, from: 0, to: 0.65, durationInFrames: 22 });
  const bubble2Opacity = ci(frame, [50, 65, 160, 180], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <GlowCircle size={glowSize} color={C.commentGlow} opacity={glowOpacity} />

      <div style={{ position: "relative" }}>
        {/* Main comment bubble */}
        <div style={{
          transform: `scale(${bubbleScale}) translateY(${bubbleOriginY}px)`,
          transformOrigin: "bottom left",
          opacity: bubbleOpacity,
        }}>
          {/* Bubble body */}
          <div style={{
            width: 860,
            padding: "50px 60px",
            background: "rgba(255,255,255,0.08)",
            border: `4px solid ${C.comment}`,
            borderRadius: "60px 60px 60px 12px",
            boxShadow: `0 0 80px ${C.commentGlow}, inset 0 0 40px rgba(77,204,189,0.05)`,
            backdropFilter: "blur(8px)",
          }}>
            {/* Typing dots */}
            <div style={{ display: "flex", gap: 24, alignItems: "center", justifyContent: "center" }}>
              {[0, 1, 2].map((i) => <TypingDot key={i} frame={frame} index={i} />)}
            </div>
          </div>
          {/* Bubble tail */}
          <div style={{
            width: 0, height: 0,
            borderLeft: "30px solid transparent",
            borderRight: "30px solid transparent",
            borderTop: `42px solid ${C.comment}`,
            marginLeft: 70,
            marginTop: -4,
            opacity: 0.8,
          }} />
        </div>

        {/* Reply bubble (smaller, top-right) */}
        <div style={{
          position: "absolute",
          top: -200,
          right: -100,
          transform: `scale(${bubble2Scale})`,
          transformOrigin: "bottom right",
          opacity: bubble2Opacity,
        }}>
          <div style={{
            width: 480,
            padding: "40px 50px",
            background: "rgba(255,255,255,0.06)",
            border: `3px solid rgba(77,204,189,0.5)`,
            borderRadius: "60px 60px 12px 60px",
            boxShadow: `0 0 60px ${C.commentGlow}`,
          }}>
            <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center" }}>
              {[0, 1, 2].map((i) => <TypingDot key={i} frame={frame - 20} index={i} />)}
            </div>
          </div>
          <div style={{
            width: 0, height: 0,
            borderLeft: "24px solid transparent",
            borderRight: "24px solid transparent",
            borderTop: `34px solid rgba(77,204,189,0.5)`,
            marginLeft: "auto",
            marginRight: 60,
            marginTop: -3,
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1C — FOLLOW NOTIFICATION
// ═══════════════════════════════════════════════════════════════════════════════

export const FollowNotif: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideY = spring({ frame, fps, config: SPRING.bouncy, from: -300, to: 0, durationInFrames: 28 });
  const slideYOut = ci(frame, [140, 170], [0, -300], EaseOut);
  const finalY = frame < 140 ? slideY : slideYOut;
  const opacity = ci(frame, [0, 10, 140, 170], [0, 1, 1, 0]);

  // Avatar pulse
  const avatarPulse = Math.sin((frame / fps) * Math.PI * 2) * 0.06;
  const avatarScale = 1 + (frame > 28 ? avatarPulse : 0);

  // "Follow" button fill
  const btnFillW = ci(frame, [40, 70], [0, 320], EaseOutExpo);
  const btnTextOpacity = ci(frame, [50, 70], [0, 1]);

  // User icon SVG (generic)
  const UserIcon = () => (
    <svg width={70} height={70} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={C.white} />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );

  const PlusIcon = () => (
    <svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        transform: `translateY(${finalY}px)`,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 40,
        background: "rgba(255,255,255,0.07)",
        border: `2px solid rgba(76,201,240,0.4)`,
        borderRadius: 60,
        padding: "36px 56px",
        boxShadow: `0 0 100px rgba(76,201,240,0.2), 0 30px 80px rgba(0,0,0,0.6)`,
        backdropFilter: "blur(20px)",
        minWidth: 900,
      }}>
        {/* Avatar */}
        <div style={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.follow}, ${C.storyPurple})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 40px ${C.followGlow}`,
          transform: `scale(${avatarScale})`,
          flexShrink: 0,
        }}>
          <UserIcon />
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{
            color: C.white,
            fontSize: 56,
            fontWeight: 700,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            lineHeight: 1.2,
          }}>
            New Follower
          </div>
          <div style={{
            color: C.follow,
            fontSize: 44,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            marginTop: 8,
          }}>
            @creator_handle
          </div>
        </div>

        {/* Follow button */}
        <div style={{
          position: "relative",
          width: 320,
          height: 100,
          borderRadius: 50,
          border: `3px solid ${C.follow}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: btnFillW,
            height: "100%",
            background: `linear-gradient(90deg, ${C.follow}, ${C.storyPurple})`,
          }} />
          <div style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: btnTextOpacity,
          }}>
            <PlusIcon />
            <span style={{
              color: C.white,
              fontSize: 44,
              fontWeight: 700,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            }}>Follow</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1D — SHARE ICON RIPPLE
// ═══════════════════════════════════════════════════════════════════════════════

const NODE_POSITIONS = [
  { angle: -50, dist: 480 },
  { angle: 30,  dist: 520 },
  { angle: -10, dist: 540 },
];

export const ShareRipple: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const centerScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 25 });
  const centerRotate = ci(frame, [0, 30], [180, 0], EaseOutExpo);

  const glowOpacity = ci(frame, [0, 20, 120, 160], [0, 0.8, 0.6, 0]);
  const glowSize = ci(frame, [0, 30], [200, 1100], EaseOutExpo);

  const overallOpacity = ci(frame, [150, 180], [1, 0]);

  // Share icon SVG (generic up-and-out arrow)
  const ShareIcon = () => (
    <svg width={200} height={200} viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" fill={C.share} />
      <circle cx="18" cy="19" r="3" fill={C.share} />
      <circle cx="6"  cy="12" r="3" fill={C.share} />
      <line x1="6"  y1="12" x2="18" y2="5"  stroke={C.share} strokeWidth="2" />
      <line x1="6"  y1="12" x2="18" y2="19" stroke={C.share} strokeWidth="2" />
    </svg>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      <GlowCircle size={glowSize} color={C.shareGlow} opacity={glowOpacity} />

      {/* Lines & target nodes */}
      <div style={{ position: "absolute", inset: 0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${3840} ${2160}`}>
          {NODE_POSITIONS.map((node, i) => {
            const lineDelay = 20 + i * 8;
            const rad = (node.angle * Math.PI) / 180;
            const tx = CX + Math.cos(rad) * node.dist;
            const ty = CY + Math.sin(rad) * node.dist;

            // Animated line length
            const lineProgress = ci(frame, [lineDelay, lineDelay + 30], [0, 1], EaseOutExpo);
            const lx = CX + Math.cos(rad) * node.dist * lineProgress;
            const ly = CY + Math.sin(rad) * node.dist * lineProgress;

            const nodeScale = spring({ frame: frame - lineDelay - 25, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 20 });
            const nodeOpacity = ci(frame, [lineDelay, lineDelay + 10], [0, 1]);
            const nodePulse = 1 + Math.sin((frame / fps) * Math.PI * 2 + i) * 0.12;

            return (
              <g key={i}>
                <line
                  x1={CX} y1={CY} x2={lx} y2={ly}
                  stroke={C.share} strokeWidth={5} opacity={0.7}
                  strokeDasharray="none"
                />
                <circle
                  cx={tx} cy={ty}
                  r={45 * nodeScale * (frame > lineDelay + 30 ? nodePulse : 1)}
                  fill={C.share}
                  opacity={nodeOpacity}
                />
                <circle
                  cx={tx} cy={ty}
                  r={80 * nodeScale}
                  fill="none"
                  stroke={C.share}
                  strokeWidth="3"
                  opacity={nodeOpacity * 0.35}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Center share icon */}
      <div style={{
        transform: `scale(${centerScale}) rotate(${centerRotate}deg)`,
        position: "relative",
        zIndex: 10,
        filter: `drop-shadow(0 0 30px ${C.share})`,
      }}>
        <ShareIcon />
      </div>

      {/* Ripple rings from center */}
      {[0, 1, 2].map((i) => {
        const delay = i * 15;
        const rScale = ci(frame - delay, [0, 60], [0, 3], EaseOutExpo);
        const rOpacity = ci(frame - delay, [0, 10, 60], [0, 0.5, 0]);
        return (
          <div key={i} style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `5px solid ${C.share}`,
            opacity: rOpacity,
            transform: `scale(${rScale})`,
          }} />
        );
      })}
    </AbsoluteFill>
  );
};
