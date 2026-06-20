import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, ci, EaseOutBack, EaseOutExpo, SPRING, W4K, H4K } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M4: 45-MINUTE MATCH TIMER
// ═══════════════════════════════════════════════════════════════════════════════
export const MatchTimer45Mins: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide down animation
  const slideY = ci(frame, [0, 20], [-200, 40], EaseOutBack);

  // Time logic (let's start at 44:50 to show it crossing to 45:00)
  const baseSeconds = 44 * 60 + 50;
  const currentSeconds = baseSeconds + Math.floor(frame / fps);
  
  const m = Math.floor(currentSeconds / 60);
  const s = currentSeconds % 60;
  const timeStr = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <div style={{
        position: "absolute", top: 0, left: 100,
        transform: `translateY(${slideY}px)`,
        display: "flex", alignItems: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
      }}>
        {/* Match Info Box */}
        <div style={{
          backgroundColor: C.white,
          padding: "20px 40px",
          color: C.sportBlue, fontFamily: "'Inter', sans-serif",
          fontSize: 60, fontWeight: 900,
          borderTopLeftRadius: 20, borderBottomLeftRadius: 20
        }}>
          1ST HALF
        </div>
        
        {/* Timer Box */}
        <div style={{
          backgroundColor: C.sportBlue,
          padding: "20px 50px",
          color: C.white, fontFamily: "'Inter', sans-serif",
          fontSize: 60, fontWeight: 900,
          borderTopRightRadius: 20, borderBottomRightRadius: 20
        }}>
          {timeStr}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M4: VAR (VIDEO ASSISTANT REFEREE) SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export const VARReviewScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: SPRING.snappy, from: 0, to: 1, durationInFrames: 20 });
  
  // Phase logic
  const isChecking = frame < 120;
  
  const text1 = isChecking ? "VAR REVIEW IN PROGRESS" : "DECISION";
  const text2 = isChecking ? "CHECKING GOAL..." : "NO GOAL";
  const color = isChecking ? C.white : C.termRed;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        transform: `scale(${scale})`,
        backgroundColor: "rgba(0, 29, 74, 0.8)", // Semi-transparent sport blue
        border: `8px solid ${C.termCyan}`,
        borderRadius: 40,
        padding: "80px 150px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 30,
        boxShadow: `0 0 100px ${C.termCyanGlow}`,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{
          color: C.white, fontFamily: "'Inter', sans-serif",
          fontSize: 80, fontWeight: 700, letterSpacing: "5px"
        }}>
          {text1}
        </div>
        <div style={{
          color: color, fontFamily: "'Inter', sans-serif",
          fontSize: 140, fontWeight: 900, letterSpacing: "10px",
          textShadow: `0 0 30px ${color}`
        }}>
          {text2}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M4: INJURY / STOPPAGE TIME BOARD
// ═══════════════════════════════════════════════════════════════════════════════
export const InjuryTimeBoard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pop up animation from center bottom
  const popScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 30 });
  const translateY = ci(frame, [0, 30], [800, 0], EaseOutBack);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Board Base */}
      <div style={{
        transform: `translateY(${translateY}px) scale(${popScale})`,
        backgroundColor: "#111",
        border: "15px solid #222",
        borderRadius: 40,
        padding: "60px 120px",
        boxShadow: "0 50px 100px rgba(0,0,0,0.8), inset 0 0 50px rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {/* LED Text */}
        <div style={{
          color: C.termGreen,
          fontFamily: "'Teko', sans-serif",
          fontSize: 350, fontWeight: 700,
          lineHeight: 1,
          textShadow: `0 0 40px ${C.termGreen}, 0 0 80px ${C.termGreen}`,
          // Optional: A slight dot-matrix background to sell the LED look
          backgroundImage: "radial-gradient(circle, rgba(0,255,0,0.2) 20%, transparent 20%)",
          backgroundSize: "10px 10px"
        }}>
          +3 MINS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M4: MILLISECOND RACE STOPWATCH
// ═══════════════════════════════════════════════════════════════════════════════
export const MsRaceStopwatch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate actual elapsed time based on frame and 30fps
  const totalMs = Math.floor((frame / fps) * 1000);
  
  const m = Math.floor(totalMs / 60000);
  const s = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  const mStr = m.toString().padStart(2, "0");
  const sStr = s.toString().padStart(2, "0");
  const msStr = ms.toString().padStart(3, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        color: C.sportNeonGreen,
        fontFamily: "'Teko', sans-serif",
        fontSize: 400, fontWeight: 600,
        display: "flex", gap: 20,
        textShadow: `0 0 50px ${C.sportNeonGreen}80`
      }}>
        <span>{mStr}</span>
        <span>:</span>
        <span>{sStr}</span>
        <span style={{ opacity: 0.5 }}>.</span>
        <span style={{ color: C.white, fontSize: 300, marginTop: 80 }}>{msStr}</span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M4: MATCH STATUS BANNERS
// ═══════════════════════════════════════════════════════════════════════════════
export const MatchStatusBanners: React.FC = () => {
  const frame = useCurrentFrame();

  // Slide in from left
  const slideX1 = ci(frame, [0, 20], [-1000, 0], EaseOutExpo);
  const slideX2 = ci(frame, [5, 25], [-1500, 0], EaseOutExpo);

  // Parallelogram shape
  const clipPathStyle = { clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)" };

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, justifyContent: "center" }}>
      <div style={{ position: "relative", width: 1200, height: 300, marginLeft: 200 }}>
        
        {/* Background Accent Layer */}
        <div style={{
          ...clipPathStyle,
          position: "absolute", inset: 0,
          backgroundColor: C.sportNeonGreen,
          transform: `translateX(${slideX1}px)`
        }} />

        {/* Foreground Main Layer */}
        <div style={{
          ...clipPathStyle,
          position: "absolute", inset: 0, top: 10, left: 10,
          backgroundColor: C.sportBlue,
          transform: `translateX(${slideX2}px)`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            color: C.white,
            fontFamily: "'Teko', sans-serif",
            fontSize: 180, fontWeight: 600,
            textTransform: "uppercase",
            transform: "skewX(-5deg)" // Counter the skew visually
          }}>
            KICK OFF
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
