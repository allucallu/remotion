import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { C, ci, SPRING, EaseOutBack, EaseOutExpo, EaseOut, EaseInOut, CONFETTI_PARTICLES } from "./utils";

// ─── Shared ───────────────────────────────────────────────────────────────────
const GlowRing: React.FC<{ size: number; color: string; opacity: number }> = ({ size, color, opacity }) => (
  <div style={{
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    border: `6px solid ${color}`,
    opacity,
    transform: "translate(-50%, -50%)",
    left: "50%",
    top: "50%",
  }} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// LB-SPINNER — Modern gradient spinning loader
// ═══════════════════════════════════════════════════════════════════════════════
export const LoadingSpinner: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 25 });
  const overallOpacity = ci(frame, [0, 12, 155, 180], [0, 1, 1, 0]);

  // Rotation
  const outerRot = (frame / fps) * 360 * 1.2;
  const innerRot = (frame / fps) * 360 * -0.8;
  const dotRot = (frame / fps) * 360 * 0.5;

  // Pulsing inner circle
  const innerPulse = 1 + Math.sin((frame / fps) * Math.PI * 3) * 0.06;

  // Outer glow pulse
  const glowOpacity = 0.3 + (Math.sin((frame / fps) * Math.PI * 2) + 1) / 2 * 0.4;

  const SPINNER_R = 280;
  const INNER_R = 200;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 1200,
        height: 1200,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.commentGlow} 0%, transparent 60%)`,
        opacity: glowOpacity,
      }} />

      <div style={{ transform: `scale(${appearScale})`, position: "relative", width: SPINNER_R * 2 + 40, height: SPINNER_R * 2 + 40 }}>
        {/* Outer arc ring */}
        <svg
          width={SPINNER_R * 2 + 40}
          height={SPINNER_R * 2 + 40}
          viewBox={`0 0 ${SPINNER_R * 2 + 40} ${SPINNER_R * 2 + 40}`}
          style={{ position: "absolute", top: 0, left: 0, transform: `rotate(${outerRot}deg)` }}
        >
          <defs>
            <linearGradient id="spinnerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={C.progressCyan} stopOpacity="0" />
              <stop offset="50%"  stopColor={C.progressCyan} stopOpacity="0.6" />
              <stop offset="100%" stopColor={C.progressCyan} stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx={SPINNER_R + 20}
            cy={SPINNER_R + 20}
            r={SPINNER_R}
            fill="none"
            stroke="url(#spinnerGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${SPINNER_R * 2 * Math.PI * 0.75} ${SPINNER_R * 2 * Math.PI * 0.25}`}
          />
          {/* Leading dot */}
          <circle
            cx={SPINNER_R + 20 + SPINNER_R}
            cy={SPINNER_R + 20}
            r="14"
            fill={C.progressCyan}
          />
        </svg>

        {/* Inner arc ring */}
        <svg
          width={INNER_R * 2 + 40}
          height={INNER_R * 2 + 40}
          viewBox={`0 0 ${INNER_R * 2 + 40} ${INNER_R * 2 + 40}`}
          style={{
            position: "absolute",
            top: (SPINNER_R - INNER_R),
            left: (SPINNER_R - INNER_R),
            transform: `rotate(${innerRot}deg)`,
          }}
        >
          <defs>
            <linearGradient id="innerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={C.storyPurple} stopOpacity="0" />
              <stop offset="100%" stopColor={C.storyPurple} stopOpacity="1" />
            </linearGradient>
          </defs>
          <circle
            cx={INNER_R + 20}
            cy={INNER_R + 20}
            r={INNER_R}
            fill="none"
            stroke="url(#innerGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${INNER_R * 2 * Math.PI * 0.6} ${INNER_R * 2 * Math.PI * 0.4}`}
          />
        </svg>

        {/* Center core */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${innerPulse})`,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(76,201,240,0.3) 0%, transparent 70%)`,
          border: "4px solid rgba(76,201,240,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Spinner dots orbiting */}
          <div style={{
            position: "absolute",
            width: 140,
            height: 140,
            transform: `rotate(${dotRot}deg)`,
          }}>
            {[0, 120, 240].map((angle, i) => (
              <div key={i} style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: C.progressCyan,
                transform: `rotate(${angle}deg) translateX(60px) translateY(-50%)`,
                opacity: 0.5 + (i / 3) * 0.5,
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Loading label */}
      <div style={{
        position: "absolute",
        bottom: "28%",
        color: "rgba(255,255,255,0.5)",
        fontSize: 70,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        letterSpacing: "8px",
        fontWeight: 300,
      }}>
        LOADING
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LB-PROGRESSBAR — Progress bar filling 0% to 100%
// ═══════════════════════════════════════════════════════════════════════════════
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearY = ci(frame, [0, 18], [60, 0], EaseOutBack);
  const overallOpacity = ci(frame, [0, 12, 155, 180], [0, 1, 1, 0]);

  // Progress: 0% at frame 20, 100% at frame 140
  const progressValue = ci(frame, [20, 140], [0, 1], EaseInOut);
  const progressPercent = Math.round(progressValue * 100);

  const BAR_W = 1800;
  const BAR_H = 40;
  const filledW = progressValue * BAR_W;

  // Shimmer on filled bar
  const shimmerX = ci(frame, [20, 140], [-200, BAR_W + 200]);

  // Percentage text spring
  const numScale = spring({ frame: frame - 130, fps, config: SPRING.bouncy, from: 1, to: 1.3, durationInFrames: 15 });
  const finalNumScale = progressPercent === 100 ? numScale : 1;

  // Completion effects
  const completedOpacity = ci(frame, [145, 160], [0, 1]);
  const completedScale = spring({ frame: frame - 145, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 20 });

  // Milestone pulses at 25%, 50%, 75%, 100%
  const milestones = [0.25, 0.5, 0.75, 1.0];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Background glow under bar */}
      <div style={{
        position: "absolute",
        width: BAR_W + 200,
        height: 200,
        borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.commentGlow} 0%, transparent 70%)`,
        opacity: progressValue * 0.6,
      }} />

      <div style={{ transform: `translateY(${appearY}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
        {/* Title */}
        <div style={{
          color: C.white,
          fontSize: 80,
          fontWeight: 700,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          opacity: 0.9,
        }}>
          Processing...
        </div>

        {/* Progress bar track */}
        <div style={{ position: "relative", width: BAR_W }}>
          {/* Track */}
          <div style={{
            width: BAR_W,
            height: BAR_H,
            borderRadius: BAR_H / 2,
            backgroundColor: "rgba(255,255,255,0.08)",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Filled portion */}
            <div style={{
              width: filledW,
              height: "100%",
              borderRadius: BAR_H / 2,
              background: `linear-gradient(90deg, ${C.storyPurple}, ${C.progressCyan})`,
              position: "relative",
              overflow: "hidden",
              transition: "none",
            }}>
              {/* Shimmer */}
              <div style={{
                position: "absolute",
                top: 0,
                left: shimmerX - filledW,
                width: 200,
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transform: "skewX(-20deg)",
              }} />
            </div>
          </div>

          {/* Glow under filled end */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: filledW,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: C.progressCyan,
            transform: "translate(-50%, -50%)",
            boxShadow: `0 0 40px ${C.progressCyan}`,
            opacity: progressValue > 0.02 ? 1 : 0,
          }} />

          {/* Milestone dots */}
          {milestones.map((m, i) => {
            const reached = progressValue >= m;
            const dotScale = reached
              ? spring({ frame: frame - Math.round(20 + m * 120), fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 15 })
              : 0.6;
            return (
              <div key={i} style={{
                position: "absolute",
                top: "50%",
                left: m * BAR_W,
                transform: `translate(-50%, -50%) scale(${dotScale})`,
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: reached ? C.white : "rgba(255,255,255,0.2)",
                boxShadow: reached ? `0 0 20px ${C.progressCyan}` : "none",
                zIndex: 10,
              }} />
            );
          })}
        </div>

        {/* Percentage number */}
        <div style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          transform: `scale(${finalNumScale})`,
        }}>
          <span style={{
            color: C.progressCyan,
            fontSize: 200,
            fontWeight: 900,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            lineHeight: 1,
            textShadow: `0 0 80px ${C.progressCyan}`,
          }}>
            {progressPercent}
          </span>
          <span style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 100,
            fontWeight: 300,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          }}>
            %
          </span>
        </div>

        {/* Completed label */}
        <div style={{
          opacity: completedOpacity,
          transform: `scale(${completedScale})`,
          color: C.successGreen,
          fontSize: 72,
          fontWeight: 700,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          letterSpacing: "4px",
          textShadow: `0 0 50px ${C.successGreen}`,
        }}>
          ✓ COMPLETE
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LB-BADGEREVEAL — Badge/Award reveal with confetti burst
// ═══════════════════════════════════════════════════════════════════════════════
const ConfettiParticle: React.FC<{
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
  const progress = ci(f, [0, 50], [0, 1], EaseOutExpo);
  const x = Math.cos(rad) * dist * progress;
  const y = Math.sin(rad) * dist * progress - f * 1.2; // gravity
  const opacity = ci(f, [0, 8, 40, 60], [0, 1, 0.8, 0]);
  const rot = f * (angle % 2 === 0 ? 6 : -5);
  return (
    <div style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width: size,
      height: size * 0.6,
      backgroundColor: color,
      borderRadius: 3,
      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`,
      opacity,
    }} />
  );
};

export const BadgeReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = ci(frame, [0, 12, 155, 180], [0, 1, 1, 0]);

  // Badge appearance
  const badgeScale = spring({ frame, fps, config: SPRING.wobbly, from: 0, to: 1, durationInFrames: 30 });
  const badgeRot = ci(frame, [0, 30], [-15, 0], EaseOutBack);
  const badgeGlow = ci(frame, [0, 30, 100, 160], [0, 1, 0.7, 0]);

  // Star burst scale
  const starScale = spring({ frame: frame - 5, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 28 });

  // Text reveal
  const titleY = ci(frame, [35, 55], [40, 0], EaseOutBack);
  const titleOpacity = ci(frame, [35, 55], [0, 1]);
  const subtitleY = ci(frame, [45, 65], [30, 0], EaseOutBack);
  const subtitleOpacity = ci(frame, [45, 65], [0, 1]);

  // Pulse rings
  const ringScale1 = ci(frame, [15, 80], [0.8, 2.2], EaseOutExpo);
  const ringOpacity1 = ci(frame, [15, 30, 80], [0, 0.5, 0]);
  const ringScale2 = ci(frame, [25, 100], [0.8, 2.5], EaseOutExpo);
  const ringOpacity2 = ci(frame, [25, 40, 100], [0, 0.3, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Glow */}
      <div style={{
        position: "absolute",
        width: 1500,
        height: 1500,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.badgeShadow} 0%, transparent 60%)`,
        opacity: badgeGlow * 0.8,
      }} />

      {/* Pulse rings */}
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: `8px solid ${C.badgeGold}`, opacity: ringOpacity1, transform: `scale(${ringScale1})` }} />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", border: `6px solid ${C.badgeGold}`, opacity: ringOpacity2, transform: `scale(${ringScale2})` }} />

      {/* Confetti */}
      {CONFETTI_PARTICLES.map((p, i) => (
        <ConfettiParticle key={i} frame={frame} angle={p.angle} delay={p.delay}
          size={p.size} dist={p.dist} color={p.color} />
      ))}

      {/* Badge body */}
      <div style={{ transform: `scale(${badgeScale}) rotate(${badgeRot}deg)`, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Outer badge ring */}
        <div style={{
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${C.badgeGold}, #FFF0A0, ${C.badgeGold}, #FFA500, ${C.badgeGold})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 100px ${C.badgeShadow}, 0 0 200px ${C.badgeShadow}`,
          position: "relative",
        }}>
          {/* Inner badge */}
          <div style={{
            width: 430,
            height: 430,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, #FFF0A0, ${C.badgeGold} 60%, #B8860B)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
          }}>
            {/* Star symbol */}
            <svg width={180} height={180} viewBox="0 0 24 24" fill="none" style={{ transform: `scale(${starScale})` }}>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill="#B8860B"
                stroke="#7A5C00"
                strokeWidth="0.5"
              />
            </svg>
            <div style={{
              color: "#7A5C00",
              fontSize: 36,
              fontWeight: 900,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.1,
            }}>
              TOP
            </div>
          </div>

          {/* Ribbon tabs at bottom */}
          {[-1, 1].map((dir) => (
            <div key={dir} style={{
              position: "absolute",
              bottom: -60,
              left: dir < 0 ? "25%" : "auto",
              right: dir > 0 ? "25%" : "auto",
              width: 0,
              height: 0,
              borderLeft: "40px solid transparent",
              borderRight: "40px solid transparent",
              borderTop: `80px solid ${C.badgeGold}`,
            }} />
          ))}
        </div>
      </div>

      {/* Text below badge */}
      <div style={{
        position: "absolute",
        top: "62%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{
          color: C.white,
          fontSize: 100,
          fontWeight: 900,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          letterSpacing: "3px",
          textShadow: `0 0 60px ${C.badgeGold}`,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}>
          ACHIEVEMENT
        </div>
        <div style={{
          color: C.badgeGold,
          fontSize: 60,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          fontWeight: 600,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
        }}>
          Unlocked!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LB-CHECKMARKSTAMP — Checkmark stamp effect
// ═══════════════════════════════════════════════════════════════════════════════
export const CheckmarkStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = ci(frame, [0, 10, 155, 180], [0, 1, 1, 0]);

  // Circle fill from 0 to full
  const circleFill = ci(frame, [10, 50], [0, 1], EaseOutExpo);
  const circleScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 30 });

  // Checkmark draws in after circle fills
  const checkDraw = ci(frame, [45, 80], [0, 1], EaseOutExpo);
  const checkOpacity = ci(frame, [42, 55], [0, 1]);

  // Stamp impact effect
  const impactScale = spring({ frame: frame - 75, fps, config: SPRING.wobbly, from: 1.3, to: 1, durationInFrames: 20 });
  const finalScale = frame > 75 ? impactScale : circleScale;

  // Impact flash
  const flashOpacity = ci(frame, [75, 80, 90], [0, 0.3, 0]);

  // Text reveal
  const textY = ci(frame, [80, 100], [40, 0], EaseOutBack);
  const textOpacity = ci(frame, [80, 100], [0, 1]);

  // Stamp border lines
  const stampLineOpacity = ci(frame, [75, 90], [1, 0.3]);

  const CIRCLE_R = 280;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      {/* Impact flash */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundColor: C.successGreen,
        opacity: flashOpacity,
      }} />

      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 1400,
        height: 1400,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${C.successGlow} 0%, transparent 60%)`,
        opacity: ci(frame, [40, 100], [0, 0.6]),
      }} />

      {/* Expansion rings */}
      {[0, 1].map((i) => {
        const delay = i * 15 + 75;
        return (
          <div key={i} style={{
            position: "absolute",
            width: CIRCLE_R * 2,
            height: CIRCLE_R * 2,
            borderRadius: "50%",
            border: `6px solid ${C.successGreen}`,
            opacity: ci(frame - delay, [0, 5, 50], [0, 0.6, 0]),
            transform: `scale(${ci(frame - delay, [0, 50], [1, 2.5], EaseOutExpo)})`,
          }} />
        );
      })}

      <div style={{ transform: `scale(${finalScale})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Stamp border decoration */}
        <div style={{
          position: "absolute",
          width: CIRCLE_R * 2 + 40,
          height: CIRCLE_R * 2 + 40,
          borderRadius: "50%",
          border: `8px dashed ${C.successGreen}`,
          opacity: stampLineOpacity * 0.5,
        }} />

        {/* SVG: Circle arc that fills + checkmark */}
        <svg
          width={CIRCLE_R * 2 + 20}
          height={CIRCLE_R * 2 + 20}
          viewBox={`0 0 ${CIRCLE_R * 2 + 20} ${CIRCLE_R * 2 + 20}`}
          style={{ overflow: "visible" }}
        >
          {/* Background circle stroke */}
          <circle
            cx={CIRCLE_R + 10}
            cy={CIRCLE_R + 10}
            r={CIRCLE_R}
            fill="none"
            stroke="rgba(6,214,160,0.1)"
            strokeWidth="25"
          />
          {/* Filled arc (animates from 0 to full) */}
          <circle
            cx={CIRCLE_R + 10}
            cy={CIRCLE_R + 10}
            r={CIRCLE_R}
            fill="none"
            stroke={C.successGreen}
            strokeWidth="25"
            strokeLinecap="round"
            strokeDasharray={`${CIRCLE_R * 2 * Math.PI}`}
            strokeDashoffset={CIRCLE_R * 2 * Math.PI * (1 - circleFill)}
            transform={`rotate(-90 ${CIRCLE_R + 10} ${CIRCLE_R + 10})`}
          />
          {/* Inner filled circle (appears after arc completes) */}
          <circle
            cx={CIRCLE_R + 10}
            cy={CIRCLE_R + 10}
            r={CIRCLE_R - 25}
            fill={`rgba(6,214,160,${ci(frame, [48, 65], [0, 0.15])})`}
          />
          {/* Checkmark */}
          <path
            d={`M ${CIRCLE_R - 130} ${CIRCLE_R + 10} l ${100} ${100} l ${180} ${-180}`}
            fill="none"
            stroke={C.successGreen}
            strokeWidth="40"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={380}
            strokeDashoffset={380 * (1 - checkDraw)}
            opacity={checkOpacity}
          />
        </svg>

        {/* Label text */}
        <div style={{
          marginTop: 40,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          textAlign: "center",
        }}>
          <div style={{
            color: C.white,
            fontSize: 100,
            fontWeight: 800,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            letterSpacing: "4px",
          }}>
            COMPLETED
          </div>
          <div style={{
            color: C.successGreen,
            fontSize: 56,
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            fontWeight: 400,
            marginTop: 16,
            opacity: 0.8,
          }}>
            Task finished successfully
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LB-SKELETONLOAD — Skeleton shimmer → content reveal
// ═══════════════════════════════════════════════════════════════════════════════

const SkeletonBlock: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  shimmerX: number;
}> = ({ width, height, borderRadius = 12, shimmerX }) => (
  <div style={{
    width,
    height,
    borderRadius,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
    position: "relative",
  }}>
    <div style={{
      position: "absolute",
      top: 0,
      left: shimmerX,
      width: 300,
      height: "100%",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
      transform: "skewX(-20deg)",
    }} />
  </div>
);

export const SkeletonLoad: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = ci(frame, [0, 12, 155, 180], [0, 1, 1, 0]);

  // Transition from skeleton to content at frame 90
  const revealProgress = ci(frame, [90, 130], [0, 1], EaseOutExpo);
  const skeletonOpacity = 1 - revealProgress;
  const contentOpacity = revealProgress;

  // Shimmer sweep (cycles back and forth during skeleton phase)
  const shimmerCycle = frame % 60;
  const shimmerX = ci(shimmerCycle, [0, 60], [-300, 1200]);

  // Content reveal with stagger
  const titleReveal = ci(frame, [90, 115], [0, 1], EaseOutBack);
  const line1Reveal = ci(frame, [100, 120], [0, 1], EaseOutBack);
  const line2Reveal = ci(frame, [108, 128], [0, 1], EaseOutBack);
  const cardReveal = ci(frame, [100, 125], [0, 1], EaseOutBack);

  const CARD_W = 1600;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: overallOpacity }}>
      <div style={{ width: CARD_W }}>

        {/* ─── SKELETON LAYER ─── */}
        <div style={{ opacity: skeletonOpacity, position: "absolute", width: CARD_W }}>
          {/* Avatar skeleton */}
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 60 }}>
            <SkeletonBlock width={130} height={130} borderRadius={65} shimmerX={shimmerX} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
              <SkeletonBlock width="60%" height={48} shimmerX={shimmerX} />
              <SkeletonBlock width="40%" height={36} shimmerX={shimmerX} />
            </div>
          </div>
          {/* Image skeleton */}
          <SkeletonBlock width="100%" height={500} borderRadius={24} shimmerX={shimmerX} />
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 20 }}>
            <SkeletonBlock width="80%" height={44} shimmerX={shimmerX} />
            <SkeletonBlock width="100%" height={36} shimmerX={shimmerX} />
            <SkeletonBlock width="65%" height={36} shimmerX={shimmerX} />
          </div>
          {/* Action buttons skeleton */}
          <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
            {["30%", "30%", "20%"].map((w, i) => (
              <SkeletonBlock key={i} width={w} height={52} borderRadius={26} shimmerX={shimmerX} />
            ))}
          </div>
        </div>

        {/* ─── CONTENT LAYER ─── */}
        <div style={{ opacity: contentOpacity }}>
          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginBottom: 60 }}>
            <div style={{
              width: 130, height: 130, borderRadius: 65,
              background: `linear-gradient(135deg, ${C.phoneBlue}, ${C.storyPurple})`,
              transform: `scale(${cardReveal})`,
            }} />
            <div style={{ flex: 1, transform: `translateX(${(1 - titleReveal) * -30}px)`, opacity: titleReveal }}>
              <div style={{ color: C.white, fontSize: 56, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>
                @content_creator
              </div>
              <div style={{ color: C.gray, fontSize: 42, fontFamily: "'Inter', system-ui, sans-serif" }}>
                Just posted · 2m ago
              </div>
            </div>
          </div>

          {/* Image placeholder (real content) */}
          <div style={{
            width: "100%", height: 500,
            borderRadius: 24,
            background: `linear-gradient(135deg, ${C.storyPurple}, ${C.storyPink}, ${C.phoneBlue})`,
            transform: `scale(${cardReveal})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: 120 }}>🎬</span>
          </div>

          {/* Caption */}
          <div style={{ marginTop: 40, opacity: line1Reveal, transform: `translateY(${(1 - line1Reveal) * 20}px)` }}>
            <span style={{ color: C.white, fontSize: 46, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>
              content_creator{" "}
            </span>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 46, fontFamily: "'Inter', system-ui, sans-serif" }}>
              Amazing video content that keeps you engaged! ✨🔥
            </span>
          </div>

          {/* Action row */}
          <div style={{ display: "flex", gap: 50, marginTop: 36, opacity: line2Reveal, transform: `translateY(${(1 - line2Reveal) * 20}px)` }}>
            {["❤ 12.4K", "💬 284", "↗ Share"].map((action, i) => (
              <div key={i} style={{
                color: C.gray,
                fontSize: 42,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
