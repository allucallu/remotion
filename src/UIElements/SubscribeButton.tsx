import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { C, ci, SPRING, EaseOutBack, EaseOutExpo, EaseOut, W, H } from "./utils";

// ─── Shared Button Component ──────────────────────────────────────────────────
interface ButtonConfig {
  label: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  glowOpacity: number;
  scale: number;
  borderColor?: string;
}

const SubButton: React.FC<ButtonConfig> = ({
  label, bgColor, textColor, glowColor, glowOpacity, scale, borderColor,
}) => (
  <div style={{
    transform: `scale(${scale})`,
    width: 760,
    height: 160,
    borderRadius: 80,
    backgroundColor: bgColor,
    border: borderColor ? `5px solid ${borderColor}` : "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: `0 0 80px ${glowColor}`,
    opacity: glowOpacity > 0 ? 1 : 1,
    position: "relative",
    overflow: "hidden",
  }}>
    {/* Glow overlay */}
    <div style={{
      position: "absolute",
      inset: 0,
      borderRadius: 80,
      background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
      opacity: glowOpacity,
    }} />
    <span style={{
      color: textColor,
      fontSize: 80,
      fontWeight: 800,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      letterSpacing: "2px",
      position: "relative",
      zIndex: 1,
    }}>
      {label}
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SB-IDLE — Button with subtle breathing glow
// ═══════════════════════════════════════════════════════════════════════════════
export const SubscribeIdle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.6, to: 1, durationInFrames: 25 });
  const breathe = Math.sin((frame / fps) * Math.PI * 1.4) * 0.03;
  const glowPulse = (Math.sin((frame / fps) * Math.PI * 1.4) + 1) / 2;
  const glowOpacity = 0.3 + glowPulse * 0.4;

  const overallOpacity = ci(frame, [0, 10, 150, 180], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 1200,
        height: 400,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.subRedGlow} 0%, transparent 70%)`,
        opacity: glowOpacity,
        transform: `scale(${1 + glowPulse * 0.15})`,
      }} />
      <SubButton
        label="SUBSCRIBE"
        bgColor={C.subRed}
        textColor={C.white}
        glowColor={C.subRedGlow}
        glowOpacity={glowPulse * 0.6}
        scale={appearScale + breathe}
      />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SB-HOVERGLOW — Button with expanding halo on hover state
// ═══════════════════════════════════════════════════════════════════════════════
export const SubscribeHover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 0-30f: appear, 30-90f: hover effect intensifies, 90-150f: hold, 150-180f: fade
  const appearScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.7, to: 1, durationInFrames: 25 });
  const hoverScale = ci(frame, [25, 50], [1, 1.06], EaseOutExpo);
  const finalScale = frame < 25 ? appearScale : hoverScale;

  const haloScale = ci(frame, [20, 80], [0.8, 2.0], EaseOutExpo);
  const haloOpacity = ci(frame, [20, 40, 80, 150], [0, 0.6, 0.4, 0]);

  const innerGlow = ci(frame, [25, 60], [0.2, 0.8], EaseOutExpo);
  const overallOpacity = ci(frame, [0, 10, 150, 180], [0, 1, 1, 0]);

  // Scanline shimmer
  const shimmerX = ci(frame, [30, 80], [-200, 1000], EaseOutExpo);
  const shimmerOpacity = ci(frame, [30, 45, 75, 90], [0, 0.6, 0.6, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Halo ring */}
      <div style={{
        position: "absolute",
        width: 900,
        height: 260,
        borderRadius: "50%",
        border: `4px solid ${C.subRed}`,
        opacity: haloOpacity,
        transform: `scale(${haloScale})`,
      }} />
      {/* Outer glow */}
      <div style={{
        position: "absolute",
        width: 1400,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.subRedGlow} 0%, transparent 65%)`,
        opacity: haloOpacity * 1.5,
        transform: `scale(${haloScale * 0.7})`,
      }} />

      {/* Button */}
      <div style={{ transform: `scale(${finalScale})`, position: "relative" }}>
        <div style={{
          width: 760,
          height: 160,
          borderRadius: 80,
          backgroundColor: C.subRed,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 ${40 + innerGlow * 80}px ${C.subRedGlow}, 0 20px 60px rgba(0,0,0,0.5)`,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Shimmer */}
          <div style={{
            position: "absolute",
            top: 0,
            left: shimmerX,
            width: 160,
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            opacity: shimmerOpacity,
            transform: "skewX(-20deg)",
          }} />
          <span style={{
            color: C.white,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "2px",
            position: "relative",
            zIndex: 1,
          }}>
            SUBSCRIBE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SB-CLICKRIPPLE — Button click with ripple wave
// ═══════════════════════════════════════════════════════════════════════════════
export const SubscribeClick: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonScale = spring({ frame, fps, config: SPRING.snappy, from: 1, to: 0.92, durationInFrames: 10 });
  const buttonRebound = spring({ frame: frame - 10, fps, config: SPRING.bouncy, from: 0.92, to: 1, durationInFrames: 20 });
  const finalScale = frame < 10 ? buttonScale : buttonRebound;

  const overallOpacity = ci(frame, [0, 8, 160, 180], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Ripple waves */}
      {[0, 1, 2, 3].map((i) => {
        const delay = i * 10;
        const rScale = ci(frame - delay, [5, 70], [0, 3.5], EaseOutExpo);
        const rOpacity = ci(frame - delay, [5, 15, 70], [0, 0.7, 0]);
        return (
          <div key={i} style={{
            position: "absolute",
            width: 780,
            height: 180,
            borderRadius: 90,
            border: `6px solid ${C.subRed}`,
            opacity: rOpacity,
            transform: `scale(${rScale})`,
          }} />
        );
      })}

      {/* Flash overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: C.subRed,
        opacity: ci(frame, [0, 3, 12], [0, 0.12, 0]),
      }} />

      <div style={{ transform: `scale(${finalScale})` }}>
        <div style={{
          width: 760,
          height: 160,
          borderRadius: 80,
          backgroundColor: C.subRed,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${C.subRedGlow}`,
        }}>
          <span style={{
            color: C.white,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "2px",
          }}>
            SUBSCRIBE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SB-COUNTERRISE — Subscriber count incrementing
// ═══════════════════════════════════════════════════════════════════════════════

const FlipDigit: React.FC<{ value: string; flip: number }> = ({ value, flip }) => {
  const rotateX = ci(flip, [0, 0.5, 1], [0, -90, 0]);
  return (
    <div style={{
      display: "inline-block",
      color: C.white,
      fontFamily: "'Inter', 'Segoe UI', monospace",
      fontSize: 130,
      fontWeight: 900,
      transform: `rotateX(${rotateX}deg)`,
      perspective: "600px",
      minWidth: 80,
      textAlign: "center",
      textShadow: `0 0 40px ${C.subRed}`,
    }}>
      {value}
    </div>
  );
};

export const SubscribeCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.7, to: 1, durationInFrames: 25 });
  const overallOpacity = ci(frame, [0, 10, 150, 180], [0, 1, 1, 0]);

  // Counter goes from 12.4K to 12.5K at frame 60
  const countProgress = ci(frame, [50, 80], [0, 1], EaseOutExpo);
  const isFlipping = frame >= 50 && frame < 90;
  const flipProgress = ci(frame, [50, 80], [0, 1]);

  const displayCount = countProgress < 1 ? "12.4K" : "12.5K";
  const kCount = frame < 80 ? "12.4K" : "12.5K";

  // Confetti burst at transition
  const confettiOpacity = ci(frame, [60, 75, 100], [0, 1, 0]);
  const MINI_CONF = [
    { x: -200, y: -120 }, { x: 200, y: -140 }, { x: -160, y: 80 },
    { x: 220, y: 100 }, { x: 0, y: -160 }, { x: -300, y: 20 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 1400,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.subRedGlow} 0%, transparent 65%)`,
        opacity: 0.35,
      }} />

      <div style={{ transform: `scale(${appearScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        {/* Main button */}
        <div style={{
          width: 760,
          height: 160,
          borderRadius: 80,
          backgroundColor: C.subRed,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 60px ${C.subRedGlow}`,
        }}>
          <span style={{
            color: C.white,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "2px",
          }}>
            SUBSCRIBE
          </span>
        </div>

        {/* Counter display */}
        <div style={{ position: "relative" }}>
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            background: "rgba(255,255,255,0.05)",
            border: `2px solid rgba(255,59,48,0.3)`,
            borderRadius: 30,
            padding: "20px 60px",
          }}>
            <span style={{
              color: C.gray,
              fontSize: 70,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              fontWeight: 500,
            }}>
              Subscribers
            </span>
            <div style={{ overflow: "hidden", perspective: "600px" }}>
              <FlipDigit value={kCount} flip={flipProgress} />
            </div>
          </div>

          {/* Confetti dots */}
          {MINI_CONF.map((c, i) => (
            <div key={i} style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: [C.heart, C.follow, C.badgeGold, C.successGreen, C.storyPurple, C.share][i],
              transform: `translate(calc(-50% + ${c.x}px), calc(-50% + ${c.y}px))`,
              opacity: confettiOpacity,
            }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SB-SUBSCRIBEDCHECK — Button morphs to "Subscribed ✓"
// ═══════════════════════════════════════════════════════════════════════════════
export const SubscribeConfirmed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = ci(frame, [0, 10, 150, 180], [0, 1, 1, 0]);

  // Phase 1: Show "Subscribe" (0-40f)
  // Phase 2: Morph to green "Subscribed ✓" (40-80f)
  const morphProgress = ci(frame, [40, 70], [0, 1], EaseOutExpo);
  const bgColor = frame < 40 ? C.subRed : `rgb(${
    Math.round(255 + (52 - 255) * morphProgress)
  }, ${
    Math.round(59 + (199 - 59) * morphProgress)
  }, ${
    Math.round(48 + (89 - 48) * morphProgress)
  })`;

  // Check mark draw
  const checkDraw = ci(frame, [65, 100], [0, 1], EaseOutExpo);
  const checkOpacity = ci(frame, [60, 75], [0, 1]);

  // Text swap
  const subTextOpacity = ci(frame, [38, 52], [1, 0]);
  const confirmedOpacity = ci(frame, [55, 75], [0, 1]);

  // Button scale bounce
  const morphScale = spring({ frame: frame - 40, fps, config: SPRING.bouncy, from: 1, to: 1, durationInFrames: 30 });
  const bounceScale = spring({ frame: frame - 60, fps, config: SPRING.wobbly, from: 0.92, to: 1, durationInFrames: 25 });
  const finalScale = frame < 40 ? 1 : frame < 60 ? 1 - morphProgress * 0.08 : bounceScale;

  // Glow transition
  const glowColor = frame < 40 ? C.subRedGlow : C.subGreenGlow;

  // Bell icon
  const bellScale = spring({ frame: frame - 80, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 20 });
  const bellOpacity = ci(frame, [80, 100], [0, 1]);

  const BellIcon = () => (
    <svg width={65} height={65} viewBox="0 0 24 24" fill="none">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={C.white} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 1400,
        height: 500,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${glowColor} 0%, transparent 65%)`,
        opacity: 0.5,
      }} />

      <div style={{ transform: `scale(${finalScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        {/* Main button */}
        <div style={{
          width: 760,
          height: 160,
          borderRadius: 80,
          backgroundColor: bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 80px ${glowColor}`,
          overflow: "hidden",
          position: "relative",
        }}>
          {/* "SUBSCRIBE" text */}
          <span style={{
            position: "absolute",
            color: C.white,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "2px",
            opacity: subTextOpacity,
          }}>
            SUBSCRIBE
          </span>

          {/* "SUBSCRIBED ✓" text */}
          <div style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: confirmedOpacity,
          }}>
            {/* Animated checkmark */}
            <svg width={70} height={70} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
              <path
                d="M5 12l5 5L20 7"
                stroke={C.white}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={30}
                strokeDashoffset={30 * (1 - checkDraw)}
                opacity={checkOpacity}
              />
            </svg>
            <span style={{
              color: C.white,
              fontSize: 72,
              fontWeight: 800,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              letterSpacing: "1px",
            }}>
              SUBSCRIBED
            </span>
          </div>
        </div>

        {/* Bell notification */}
        <div style={{
          transform: `scale(${bellScale})`,
          opacity: bellOpacity,
          display: "flex",
          alignItems: "center",
          gap: 20,
          color: C.gray,
          fontSize: 52,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}>
          <BellIcon />
          <span>Get notified for new videos</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
