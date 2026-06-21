import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, ci, getGlow, getGlowClimax, springPop, springOrganic, springBouncy, idlePulse, textFlicker, pseudoRandom, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 01: LIVE ODDS FLUCTUATOR
// ═══════════════════════════════════════════════════════════════════════════════
export const LiveOddsFluctuator: React.FC = () => {
  const frame = useCurrentFrame();

  // Logic: 0-90 fluctuator, 90+ locked
  const isLocked = frame >= 90;
  
  // Random fluctuation values
  const currentOdds = useMemo(() => {
    if (isLocked) return 1.85; // Final locked value
    // Generate chaotic value between 1.50 and 2.10
    const raw = 1.50 + pseudoRandom(frame) * 0.60;
    return Number(raw.toFixed(2));
  }, [frame, isLocked]);
  
  const previousOdds = useMemo(() => {
    if (isLocked) return 1.85;
    if (frame === 0) return 1.75;
    const raw = 1.50 + pseudoRandom(frame - 1) * 0.60;
    return Number(raw.toFixed(2));
  }, [frame, isLocked]);

  // Color logic
  let color = C.white;
  if (!isLocked) {
    if (currentOdds > previousOdds) color = C.lime;
    else if (currentOdds < previousOdds) color = C.red;
  } else {
    color = C.gold; // Lock color
  }

  // Climax Pop at lock
  const textScale = isLocked ? springPop(frame, 90, 1.3, 1) : 1;
  const glow = isLocked ? getGlowClimax(color) : getGlow(color);

  // Label
  const labelScale = springBouncy(frame, 0, 0, 1);
  const labelText = isLocked ? "MARKET SHIFT SECURED" : "LIVE ODDS UPDATING...";
  const labelPulse = idlePulse(frame, 120, 0);

  // Flash
  const flash = frame >= 90 && frame <= 93 ? ci(frame, [90, 91, 93], [0, 1, 0]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {flash > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: C.white, opacity: flash, zIndex: 100 }} />}
      
      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: 320, fontWeight: 700,
        color, filter: glow,
        transform: `scale(${textScale})`
      }}>
        {currentOdds.toFixed(2)}
      </div>

      <div style={{
        position: "absolute", top: CY + 240,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 48, fontWeight: 600,
        color: isLocked ? C.gold : C.textDim,
        letterSpacing: "0.4em",
        transform: `scale(${labelScale})`,
        opacity: labelPulse * textFlicker(frame, 120, 85),
        filter: isLocked ? getGlow(C.gold) : "none"
      }}>
        {labelText}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 02: SAFE PARLAY BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
export const SafeParlayBuilder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stairs / blocks
  const blocks = [
    { label: "LEG 1", color: C.cyan, width: 200 },
    { label: "LEG 2", color: C.cyan, width: 280 },
    { label: "LEG 3", color: C.cyan, width: 360 },
    { label: "LEG 4", color: C.cyan, width: 440 },
    { label: "BOOST", color: C.gold, width: 520 },
  ];

  const blocksContainerY = CY + 300;

  // Final popup
  const isFinal = frame >= 120;
  const finalScale = isFinal ? springBouncy(frame, 120, 0, 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {blocks.map((b, i) => {
        const appearFrame = i * 20;
        const scaleY = frame >= appearFrame ? springOrganic(frame, appearFrame, 0, 1) : 0;
        
        // Base block coords
        const blockH = 80;
        const blockW = b.width;
        // Stack bottom to top
        const offsetY = -(i * (blockH + 20));

        // Idle glow
        const glowOpacity = idlePulse(frame, 120, i * 15);

        return (
          <div key={i} style={{
            position: "absolute",
            bottom: H4K - blocksContainerY + offsetY,
            width: blockW, height: blockH,
            border: `3px solid ${b.color}`,
            backgroundColor: `${b.color}20`,
            transformOrigin: "bottom center",
            transform: `scaleY(${scaleY})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            filter: `drop-shadow(0 0 ${14 * glowOpacity}px ${b.color})`,
          }}>
            <div style={{
              fontFamily: "'Share Tech Mono', monospace", fontSize: 32, color: C.white,
              letterSpacing: "0.2em", opacity: scaleY
            }}>
              {b.label}
            </div>
          </div>
        );
      })}

      {/* Final Multiplier Text */}
      <div style={{
        position: "absolute", top: CY - 360,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: `scale(${finalScale})`,
        filter: getGlowClimax(C.gold)
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.gold, letterSpacing: "0.4em" }}>
          PARLAY ACTIVE
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 160, fontWeight: 700, color: C.white, marginTop: 20 }}>
          LOW RISK SECURED
        </div>
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 03: HEAD-TO-HEAD MOMENTUM
// ═══════════════════════════════════════════════════════════════════════════════
export const HeadToHeadMomentum: React.FC = () => {
  const frame = useCurrentFrame();

  // Tension animation using ci (sinusoidal push and pull before snapping)
  // 0-120: Tug of war. 120-150: Home dominance
  const phase1 = Math.sin(frame * 0.1) * 20; // -20 to 20
  const phase2 = ci(frame, [120, 150], [0, 80], Easing.easeOut); // Home pushes to 80%

  // Flex values
  let homeFlex = 50 + phase1;
  let awayFlex = 50 - phase1;
  if (frame >= 120) {
    homeFlex = 50 + phase1 + phase2;
    awayFlex = 50 - phase1 - phase2;
  }
  
  // Clamping just in case
  homeFlex = Math.max(0, Math.min(100, homeFlex));
  awayFlex = Math.max(0, Math.min(100, awayFlex));

  const homeColor = C.gold;
  const awayColor = C.red;

  // Flash when dominance occurs
  const dominanceFlash = frame >= 140 && frame <= 145 ? ci(frame, [140, 142, 145], [0, 1, 0]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: CY - 240,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.textDim, letterSpacing: "0.4em",
        opacity: textFlicker(frame, 30, 90)
      }}>
        HEAD TO HEAD MOMENTUM
      </div>

      {/* Tension Bar Container */}
      <div style={{
        width: 2400, height: 120, display: "flex", 
        border: `4px solid ${C.white}33`, borderRadius: 60, overflow: "hidden",
        boxShadow: `0 0 40px ${C.white}1A`
      }}>
        {/* Home Side */}
        <div style={{
          flex: `${homeFlex} 1 0`, backgroundColor: homeColor,
          display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 60,
          filter: getGlow(homeColor)
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 48, fontWeight: 700, color: C.black }}>
            HOME {Math.round(homeFlex)}%
          </div>
        </div>

        {/* Separator / Clash point */}
        <div style={{ width: 10, backgroundColor: C.white, zIndex: 10, filter: getGlow(C.white) }} />

        {/* Away Side */}
        <div style={{
          flex: `${awayFlex} 1 0`, backgroundColor: awayColor,
          display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 60,
          filter: getGlow(awayColor)
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 48, fontWeight: 700, color: C.black }}>
            {Math.round(awayFlex)}% AWAY
          </div>
        </div>
      </div>

      {/* Dominance Text */}
      <div style={{
        position: "absolute", top: CY + 160,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 120, fontWeight: 700,
        color: homeColor, letterSpacing: "0.2em",
        transform: `scale(${frame >= 140 ? springBouncy(frame, 140, 0, 1) : 0})`,
        filter: getGlowClimax(homeColor)
      }}>
        HOME DOMINANCE
      </div>

      {/* White Flash overlay */}
      {dominanceFlash > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: C.white, opacity: dominanceFlash, zIndex: 100 }} />}

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 04: OVER/UNDER LINE TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
export const OverUnderTracker: React.FC = () => {
  const frame = useCurrentFrame();

  const svgWidth = 2400;
  const svgHeight = 800;

  // Over/Under Line (Vertical threshold at x = 1600)
  const lineX = 1600;
  
  // Curve path: start left, dip, then spike past the line
  const startX = 200, startY = 600;
  const p1x = 800, p1y = 650;
  const p2x = 1400, p2y = 600;
  const spikeX = 1800, spikeY = 100; // Passes lineX
  const endX = 2200, endY = 50;

  const pathD = `M ${startX} ${startY} C ${p1x} ${p1y}, ${p2x} ${p2y}, ${spikeX} ${spikeY} S ${endX} ${endY}, ${endX} ${endY}`;
  const pathLength = 2600; // Approximate

  // Animate line draw
  const drawOffset = ci(frame, [0, 120], [pathLength, 0], Easing.easeOut);
  
  // Line crossed event (happens around frame 90 when curve passes lineX)
  const isCrossed = frame >= 90;
  const crossScale = isCrossed ? springPop(frame, 90, 0.5, 1) : 1;
  const crossColor = isCrossed ? C.cyan : C.textDim;

  // Pulse
  const p = idlePulse(frame, 120);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: 200, left: CX - 1200,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.textPrimary, letterSpacing: "0.3em",
      }}>
        TOTAL GOALS: OVER 2.5
      </div>

      <div style={{ position: "relative", width: svgWidth, height: svgHeight }}>
        
        {/* Vertical Threshold Line */}
        <div style={{
          position: "absolute", left: lineX, top: 0, bottom: 0, width: 6,
          backgroundColor: crossColor,
          borderLeft: `8px dashed ${C.black}`, // Hack for dashed line look
          opacity: isCrossed ? p : 0.5,
          filter: isCrossed ? getGlow(C.cyan) : "none",
          transform: `scaleY(${crossScale})`, transformOrigin: "bottom"
        }} />

        {/* SVG Curve */}
        <svg width={svgWidth} height={svgHeight} style={{ position: "absolute", inset: 0 }}>
          {/* Curve glow behind */}
          <path d={pathD} fill="none" stroke={C.magenta} strokeWidth="12" 
                strokeDasharray={pathLength} strokeDashoffset={drawOffset}
                style={{ filter: getGlow(C.magenta), opacity: p }} />
          {/* Main curve */}
          <path d={pathD} fill="none" stroke={C.white} strokeWidth="4" 
                strokeDasharray={pathLength} strokeDashoffset={drawOffset} />
        </svg>

        {/* Crossing Indicator */}
        {isCrossed && (
          <div style={{
            position: "absolute", left: spikeX, top: spikeY, transform: "translate(-50%, -50%)",
            width: 40, height: 40, borderRadius: "50%", backgroundColor: C.cyan,
            filter: getGlowClimax(C.cyan),
            opacity: ci(frame, [90, 100], [1, 0]) // Flash and fade
          }} />
        )}

      </div>

      {/* Alert Text */}
      <div style={{
        position: "absolute", top: CY + 400,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 120, fontWeight: 700,
        color: C.cyan, letterSpacing: "0.2em",
        transform: `scale(${isCrossed ? springBouncy(frame, 90, 0, 1) : 0})`,
        filter: getGlow(C.cyan)
      }}>
        LINE CROSSED
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 05: MATCH WIN PROBABILITY BAR
// ═══════════════════════════════════════════════════════════════════════════════
export const MatchWinProbability: React.FC = () => {
  const frame = useCurrentFrame();

  // Widths in percentages
  // Start: 33, 33, 34
  // End: 75, 15, 10
  const homeWidth = ci(frame, [20, 100], [33, 75], Easing.easeOut);
  const drawWidth = ci(frame, [20, 100], [33, 15], Easing.easeOut);
  const awayWidth = ci(frame, [20, 100], [34, 10], Easing.easeOut);

  // Colors
  const homeColor = C.cyan;
  const drawColor = C.textDim;
  const awayColor = C.magenta;

  // Title popup
  const titleScale = springPop(frame, 0, 0, 1);

  // Favorite Status Alert
  const showFavorite = frame >= 110;
  const favoriteScale = showFavorite ? springBouncy(frame, 110, 0, 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      <div style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, fontWeight: 600, color: C.textPrimary,
        letterSpacing: "0.4em", transform: `scale(${titleScale})`, marginBottom: 120
      }}>
        WIN PROBABILITY
      </div>

      {/* Bar Container */}
      <div style={{
        width: 2800, height: 80, display: "flex", gap: 8,
        padding: 8, border: `2px solid ${C.white}33`, borderRadius: 40
      }}>
        
        {/* Home */}
        <div style={{
          width: `${homeWidth}%`, height: "100%", backgroundColor: homeColor,
          borderRadius: "32px 0 0 32px", display: "flex", alignItems: "center", paddingLeft: 40,
          filter: getGlow(homeColor)
        }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 48, fontWeight: 700, color: C.black }}>HOME {Math.round(homeWidth)}%</span>
        </div>

        {/* Draw */}
        <div style={{
          width: `${drawWidth}%`, height: "100%", backgroundColor: drawColor,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 32, color: C.black }}>DRAW {Math.round(drawWidth)}%</span>
        </div>

        {/* Away */}
        <div style={{
          width: `${awayWidth}%`, height: "100%", backgroundColor: awayColor,
          borderRadius: "0 32px 32px 0", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 40,
          filter: getGlow(awayColor)
        }}>
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 48, fontWeight: 700, color: C.black }}>{Math.round(awayWidth)}% AWAY</span>
        </div>

      </div>

      {/* Favorite Alert */}
      <div style={{
        marginTop: 160,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 100, fontWeight: 700,
        color: C.cyan, letterSpacing: "0.2em",
        transform: `scale(${favoriteScale})`,
        filter: getGlowClimax(C.cyan),
        opacity: idlePulse(frame, 140, 0)
      }}>
        FAVORITE STATUS SECURED
      </div>

    </AbsoluteFill>
  );
};
