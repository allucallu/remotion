import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Sequence } from "remotion";
import { C, ci, EaseOutExpo, EaseOutBack, SPRING, pseudoRandom, W4K, H4K } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M1: BOOT SEQUENCE TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════
const BOOT_LOGS = [
  "SYSTEM BOOT INITIATED...",
  "CHECKING MEMORY... OK (64TB REGISTERED)",
  "LOADING KERNEL MODULES... DONE",
  "INITIALIZING CORE PROCESSORS [1-128]... ONLINE",
  "ESTABLISHING SECURE CONNECTION...",
  "HANDSHAKE PROTOCOL: ACCEPTED",
  "BYPASSING FIREWALL PROXIES... SUCCESS",
  "DECRYPTING ENCRYPTED DATA STREAMS...",
  "ACCESSING MAINFRAME DIRECTORY...",
  "LOADING AI NEURAL NET ENGINES...",
  "SYSTEM READY. WAITING FOR COMMAND...",
  "> _",
];

export const BootSequenceTerminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lines appear every 6 frames
  const visibleLines = Math.floor(frame / 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, padding: 120 }}>
      {/* Scanline overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 2px, transparent 2px, transparent 4px)",
        pointerEvents: "none", zIndex: 10
      }} />

      <div style={{
        color: C.termGreen,
        fontFamily: "'Share Tech Mono', 'VT323', monospace",
        fontSize: 72,
        lineHeight: 1.5,
        textShadow: `0 0 20px ${C.termGreenGlow}`,
      }}>
        {BOOT_LOGS.map((log, i) => {
          if (i > visibleLines) return null;
          const isBlinkingCursor = log === "> _";
          const cursorOpacity = isBlinkingCursor ? (Math.floor(frame / 10) % 2 === 0 ? 1 : 0) : 1;
          return (
            <div key={i} style={{ opacity: cursorOpacity, marginBottom: 20 }}>
              {log}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: NEURAL NETWORK / AI PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════
export const NeuralNetworkProcessing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate stable nodes
  const nodes = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      x: pseudoRandom(i * 10) * W4K * 0.8 + W4K * 0.1,
      y: pseudoRandom(i * 10 + 1) * H4K * 0.8 + H4K * 0.1,
      size: pseudoRandom(i * 10 + 2) * 20 + 10,
      delay: pseudoRandom(i * 10 + 3) * 60,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Edges */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n1, i) =>
          nodes.slice(i + 1).map((n2, j) => {
            const dist = Math.hypot(n1.x - n2.x, n1.y - n2.y);
            if (dist > 600) return null; // Only connect close nodes

            const edgeDelay = Math.max(n1.delay, n2.delay) + 10;
            const drawProgress = ci(frame - edgeDelay, [0, 20], [0, 1], EaseOutExpo);
            if (drawProgress <= 0) return null;

            // Pulse effect moving along the edge
            const pulse = ((frame - edgeDelay) % 60) / 60;
            const isPulsing = Math.abs(pulse - 0.5) < 0.1;

            return (
              <line
                key={`${i}-${j}`}
                x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke={C.termCyan}
                strokeWidth={isPulsing ? 6 : 2}
                strokeOpacity={isPulsing ? 0.8 : 0.2 * drawProgress}
              />
            );
          })
        )}
      </svg>

      {/* Nodes */}
      {nodes.map((n, i) => {
        const appearScale = spring({ frame: frame - n.delay, fps, config: SPRING.wobbly, from: 0, to: 1, durationInFrames: 20 });
        const blink = Math.sin(frame * 0.1 + n.delay) > 0.8 ? 1.5 : 1;
        return (
          <div key={i} style={{
            position: "absolute",
            left: n.x, top: n.y,
            width: n.size, height: n.size,
            borderRadius: "50%",
            backgroundColor: C.termCyan,
            transform: `translate(-50%, -50%) scale(${appearScale * blink})`,
            boxShadow: `0 0 30px ${C.termCyanGlow}, 0 0 60px ${C.termCyanGlow}`,
          }} />
        );
      })}

      {/* Overlay Status Text */}
      <div style={{
        position: "absolute", bottom: 100, right: 100,
        color: C.termCyan,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 60, textAlign: "right",
        textShadow: `0 0 20px ${C.termCyanGlow}`
      }}>
        <div style={{ opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0.5 }}>● AI MODEL ONLINE</div>
        <div>PROCESSING NEURAL NET...</div>
        <div>OPTIMIZING PATHWAYS: {Math.min(100, Math.floor((frame / 180) * 100))}%</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: CYBERNETIC DATA TRANSFER (HUD BAR)
// ═══════════════════════════════════════════════════════════════════════════════
export const CyberDataTransfer: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Progress 0 to 100 over 120 frames
  const rawProgress = ci(frame, [20, 140], [0, 100]);
  const progress = Math.min(100, Math.floor(rawProgress));
  const isComplete = progress === 100;

  const barWidth = 2400;
  const filledWidth = (progress / 100) * barWidth;

  const textLabel = isComplete ? "TRANSFER COMPLETE" : "UPLOADING DATA...";
  const textColor = isComplete ? C.termGreen : C.termCyan;
  const barColor = isComplete ? C.termGreen : C.termCyan;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: barWidth }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 30 }}>
          <div style={{
            color: textColor,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 70,
            textShadow: `0 0 20px ${textColor}`
          }}>
            {textLabel}
          </div>
          <div style={{
            color: textColor,
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 70,
            textShadow: `0 0 20px ${textColor}`
          }}>
            {progress}%
          </div>
        </div>

        {/* Outer HUD Box */}
        <div style={{
          width: barWidth, height: 100,
          border: `4px solid ${textColor}`,
          padding: 8,
          position: "relative",
          boxShadow: `0 0 30px ${textColor}40, inset 0 0 20px ${textColor}40`
        }}>
          {/* Inner Filled Bar */}
          <div style={{
            width: filledWidth, height: "100%",
            backgroundColor: barColor,
            boxShadow: `0 0 40px ${barColor}`,
            display: "flex", gap: 10, overflow: "hidden"
          }}>
            {/* Segmentation stripes inside the bar */}
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} style={{ width: 40, height: "100%", backgroundColor: "rgba(0,0,0,0.3)", transform: "skewX(-20deg)" }} />
            ))}
          </div>

          {/* Target Brackets */}
          <div style={{ position: "absolute", top: -20, left: -20, width: 40, height: 40, borderLeft: `6px solid ${textColor}`, borderTop: `6px solid ${textColor}` }} />
          <div style={{ position: "absolute", bottom: -20, right: -20, width: 40, height: 40, borderRight: `6px solid ${textColor}`, borderBottom: `6px solid ${textColor}` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: FATAL ERROR / SYSTEM CRASH
// ═══════════════════════════════════════════════════════════════════════════════
export const FatalSystemCrash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Flash red background for the first 10 frames
  const bgFlash = ci(frame, [0, 5, 15], [1, 0, 0]);
  
  // Dialog pop-up
  const dialogScale = spring({ frame: frame - 15, fps, config: SPRING.snappy, from: 0, to: 1, durationInFrames: 15 });
  
  // Glitch effect on dialog
  const isGlitching = Math.random() > 0.8 && frame > 30 && frame < 90;
  const glitchX = isGlitching ? pseudoRandom(frame) * 40 - 20 : 0;
  const glitchY = isGlitching ? pseudoRandom(frame + 1) * 20 - 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Red Flash Overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: C.termRed, opacity: bgFlash }} />

      {/* Warning Dialog */}
      <div style={{
        transform: `scale(${dialogScale}) translate(${glitchX}px, ${glitchY}px)`,
        width: 1400,
        backgroundColor: C.black,
        border: `8px solid ${C.termRed}`,
        boxShadow: `0 0 100px ${C.termRedGlow}`,
        padding: 60,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 40,
        filter: isGlitching ? "invert(1) hue-rotate(180deg)" : "none"
      }}>
        {/* Warning Icon SVG */}
        <svg width={200} height={200} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 20H2L12 2Z" fill={C.termRed} />
          <path d="M12 8V14M12 18H12.01" stroke={C.black} strokeWidth="2" strokeLinecap="round" />
        </svg>

        <div style={{
          color: C.termRed,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 100, fontWeight: "bold",
          textAlign: "center", textShadow: `0 0 30px ${C.termRedGlow}`
        }}>
          FATAL ERROR 404
        </div>
        
        <div style={{
          color: C.white,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 60, textAlign: "center"
        }}>
          SYSTEM CORRUPTED.<br/>
          MEMORY LEAK DETECTED AT 0x000F8A.
        </div>

        {/* Rebooting countdown */}
        <div style={{
          color: C.termRed,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 80, marginTop: 40,
          animation: "blink 1s infinite"
        }}>
          REBOOTING IN {Math.max(0, 3 - Math.floor((frame - 60) / fps))}...
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: SECURITY ACCESS / PASSWORD CRACKER
// ═══════════════════════════════════════════════════════════════════════════════
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

export const SecurityPasswordCracker: React.FC<{ granted?: boolean }> = ({ granted = true }) => {
  const frame = useCurrentFrame();
  const targetWord = granted ? "ACCESS GRANTED" : "ACCESS DENIED";
  const finalColor = granted ? C.termGreen : C.termRed;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 180, fontWeight: "bold",
        letterSpacing: "10px",
        display: "flex", gap: 20
      }}>
        {targetWord.split("").map((char, i) => {
          if (char === " ") return <span key={i} style={{ width: 60 }} />;
          
          // Character locks one by one
          const lockFrame = 30 + i * 5;
          const isLocked = frame >= lockFrame;
          const displayChar = isLocked ? char : CHARS[Math.floor(pseudoRandom(frame * i) * CHARS.length)];
          
          // Color turns from white/cyan to green/red once entirely unlocked
          const allLocked = frame >= 30 + targetWord.length * 5;
          const color = allLocked ? finalColor : (isLocked ? C.white : C.termCyan);
          const glow = allLocked ? `0 0 40px ${finalColor}80` : `0 0 20px ${color}80`;

          return (
            <span key={i} style={{ color, textShadow: glow, width: 120, textAlign: "center" }}>
              {displayChar}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", bottom: 300,
        color: C.gray,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 60, letterSpacing: "5px",
        opacity: frame >= 30 + targetWord.length * 5 ? 1 : 0,
      }}>
        {granted ? "AUTHORIZATION PROTOCOL COMPLETE" : "SECURITY LOCKDOWN INITIATED"}
      </div>
    </AbsoluteFill>
  );
};
