import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import { C, ci, SPRING, EaseOutBack, EaseOutExpo, EaseOut, EaseInOut, W, H } from "./utils";

// ─── Phone Frame ──────────────────────────────────────────────────────────────
const PHONE = {
  w: 840,
  h: 1680,
  radius: 80,
  bezelTop: 80,
  bezelBottom: 80,
  bezelSide: 20,
  screenRadius: 60,
  notchW: 240,
  notchH: 50,
};

const PhoneFrame: React.FC<{
  children: React.ReactNode;
  frameColor?: string;
  glowColor?: string;
  glowOpacity?: number;
}> = ({
  children,
  frameColor = "#1A1A2E",
  glowColor = C.phoneBlue,
  glowOpacity = 0.4,
}) => {
  const screenW = PHONE.w - PHONE.bezelSide * 2;
  const screenH = PHONE.h - PHONE.bezelTop - PHONE.bezelBottom;

  return (
    <div style={{ position: "relative", width: PHONE.w, height: PHONE.h }}>
      {/* Glow shadow */}
      <div style={{
        position: "absolute",
        inset: -20,
        borderRadius: PHONE.radius + 20,
        boxShadow: `0 0 120px 40px ${glowColor}`,
        opacity: glowOpacity,
        pointerEvents: "none",
      }} />

      {/* Phone body */}
      <div style={{
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: PHONE.radius,
        background: `linear-gradient(145deg, #2A2A3E, ${frameColor}, #0D0D1A)`,
        border: "6px solid rgba(255,255,255,0.12)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.5)",
      }}>
        {/* Side buttons */}
        <div style={{
          position: "absolute",
          right: -12,
          top: 280,
          width: 10,
          height: 120,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "0 6px 6px 0",
        }} />
        <div style={{
          position: "absolute",
          left: -12,
          top: 220,
          width: 10,
          height: 80,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "6px 0 0 6px",
        }} />
        <div style={{
          position: "absolute",
          left: -12,
          top: 320,
          width: 10,
          height: 80,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: "6px 0 0 6px",
        }} />

        {/* Screen area */}
        <div style={{
          position: "absolute",
          top: PHONE.bezelTop,
          left: PHONE.bezelSide,
          width: screenW,
          height: screenH,
          borderRadius: PHONE.screenRadius,
          backgroundColor: "#0A0A1A",
          overflow: "hidden",
        }}>
          {/* Dynamic island / notch */}
          <div style={{
            position: "absolute",
            top: 18,
            left: "50%",
            transform: "translateX(-50%)",
            width: PHONE.notchW,
            height: PHONE.notchH,
            borderRadius: 25,
            backgroundColor: "#000",
            zIndex: 100,
          }} />
          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Feed Post Cards ──────────────────────────────────────────────────────────
const FeedPost: React.FC<{
  scrollY: number;
  yOffset: number;
  bgGrad: string[];
  likes: string;
  username: string;
}> = ({ scrollY, yOffset, bgGrad, likes, username }) => {
  const y = yOffset - scrollY;
  const visible = y > -600 && y < 1700;
  if (!visible) return null;

  return (
    <div style={{
      position: "absolute",
      top: y,
      left: 0,
      right: 0,
    }}>
      {/* Post image placeholder */}
      <div style={{
        height: 520,
        background: `linear-gradient(135deg, ${bgGrad[0]}, ${bgGrad[1]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.15)",
        }} />
      </div>
      {/* Post footer */}
      <div style={{
        padding: "20px 24px 16px",
        background: "rgba(10,10,26,0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${bgGrad[0]}, ${bgGrad[1]})`,
          }} />
          <span style={{ color: C.white, fontSize: 30, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" }}>
            {username}
          </span>
          <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Inter', system-ui, sans-serif" }}>
            Follow
          </span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <span style={{ color: C.white, fontSize: 28, fontFamily: "'Inter', system-ui, sans-serif" }}>❤ {likes}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 28, fontFamily: "'Inter', system-ui, sans-serif" }}>💬 Comment</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PM-FEEDSCROLL — Phone with scrolling social feed
// ═══════════════════════════════════════════════════════════════════════════════
export const PhoneFeedScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.7, to: 1, durationInFrames: 30 });
  const phoneOpacity = ci(frame, [0, 15, 160, 180], [0, 1, 1, 0]);

  const scrollY = ci(frame, [30, 160], [0, 1100], EaseInOut);

  const POSTS = [
    { yOffset: 90, bgGrad: [C.storyPurple, C.storyPink], likes: "12.4K", username: "@creator_1" },
    { yOffset: 700, bgGrad: [C.phoneBlue, C.storyBlue], likes: "8.7K", username: "@creator_2" },
    { yOffset: 1310, bgGrad: [C.heart, C.share], likes: "31.2K", username: "@creator_3" },
    { yOffset: 1920, bgGrad: [C.successGreen, C.phoneBlue2], likes: "5.3K", username: "@creator_4" },
  ];

  // Status bar
  const StatusBar = () => (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
      zIndex: 90,
    }}>
      <span style={{ color: C.white, fontSize: 26, fontWeight: 600, fontFamily: "'Inter', system-ui, sans-serif" }}>9:41</span>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {/* Signal bars */}
        {[10, 16, 22, 28].map((h, i) => (
          <div key={i} style={{
            width: 5,
            height: h,
            backgroundColor: C.white,
            borderRadius: 2,
            opacity: i < 3 ? 1 : 0.4,
          }} />
        ))}
        {/* Wifi */}
        <svg width={28} height={20} viewBox="0 0 24 17" fill="none">
          <path d="M1 6.3C5.1 2.1 10.3 0 12 0s6.9 2.1 11 6.3" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity={0.4} />
          <path d="M4 10.5C6.7 7.5 9.3 6 12 6s5.3 1.5 8 4.5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M7 14c1.5-1.5 3-2.5 5-2.5s3.5 1 5 2.5" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="17" r="2" fill={C.white} />
        </svg>
        {/* Battery */}
        <div style={{
          width: 40, height: 20, borderRadius: 4,
          border: "2px solid rgba(255,255,255,0.6)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ width: "80%", height: "100%", backgroundColor: C.white }} />
        </div>
      </div>
    </div>
  );

  // Top nav bar
  const TopNav = () => (
    <div style={{
      position: "absolute",
      top: 80,
      left: 0,
      right: 0,
      height: 80,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      zIndex: 90,
      backgroundColor: "rgba(10,10,26,0.92)",
      backdropFilter: "blur(10px)",
    }}>
      <span style={{ color: C.white, fontSize: 34, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>Home</span>
      <div style={{ display: "flex", gap: 28 }}>
        {["🔔", "✉️"].map((icon, i) => (
          <span key={i} style={{ fontSize: 34 }}>{icon}</span>
        ))}
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: phoneOpacity }}>
      {/* Background glow */}
      <div style={{
        position: "absolute",
        width: 2000,
        height: 2000,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(67,97,238,0.15) 0%, transparent 65%)`,
      }} />

      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame glowColor={C.phoneBlue} glowOpacity={0.35}>
          <StatusBar />
          <TopNav />
          {/* Scrollable feed */}
          <div style={{ position: "absolute", top: 160, bottom: 0, left: 0, right: 0, overflow: "hidden" }}>
            {POSTS.map((post, i) => (
              <FeedPost key={i} scrollY={scrollY} {...post} />
            ))}
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PM-CHATUI — Phone with chat messages
// ═══════════════════════════════════════════════════════════════════════════════

const ChatBubble: React.FC<{
  text: string;
  isOwn: boolean;
  frame: number;
  startFrame: number;
  color?: string;
}> = ({ text, isOwn, frame, startFrame, color = C.phoneBlue }) => {
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - startFrame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 18 });
  const opacity = ci(frame, [startFrame, startFrame + 10], [0, 1], EaseOutExpo);

  if (frame < startFrame) return null;

  return (
    <div style={{
      display: "flex",
      justifyContent: isOwn ? "flex-end" : "flex-start",
      paddingInline: 28,
      marginBottom: 16,
      transform: `scale(${appear}) translateY(${(1 - appear) * 20}px)`,
      transformOrigin: isOwn ? "bottom right" : "bottom left",
      opacity,
    }}>
      <div style={{
        maxWidth: "75%",
        backgroundColor: isOwn ? color : "rgba(255,255,255,0.1)",
        borderRadius: isOwn ? "24px 24px 6px 24px" : "24px 24px 24px 6px",
        padding: "18px 28px",
        boxShadow: isOwn ? `0 4px 20px ${color}55` : "none",
      }}>
        <span style={{
          color: C.white,
          fontSize: 30,
          fontFamily: "'Inter', system-ui, sans-serif",
          lineHeight: 1.5,
        }}>
          {text}
        </span>
      </div>
    </div>
  );
};

export const PhoneChatUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.7, to: 1, durationInFrames: 30 });
  const phoneOpacity = ci(frame, [0, 15, 160, 180], [0, 1, 1, 0]);

  const MESSAGES = [
    { text: "Hey! Did you see the new update? 🔥", isOwn: false, startFrame: 20 },
    { text: "Yes! It looks amazing 😍", isOwn: true, startFrame: 45 },
    { text: "The animations are so smooth!", isOwn: false, startFrame: 70 },
    { text: "Totally agree 🙌", isOwn: true, startFrame: 95 },
    { text: "Should we try it out together?", isOwn: false, startFrame: 115 },
  ];

  // Typing indicator
  const typingVisible = frame > 130 && frame < 180;
  const typingOpacity = ci(frame, [130, 140], [0, 1]);
  const dotAnim = (i: number) => {
    const cycle = ((frame - 130 - i * 10) % 30 + 30) % 30;
    return ci(cycle, [0, 10, 20, 30], [0, -10, 0, 0]);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: phoneOpacity }}>
      <div style={{
        position: "absolute",
        width: 2000,
        height: 2000,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(76,201,240,0.12) 0%, transparent 65%)",
      }} />

      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame glowColor={C.comment} glowOpacity={0.3}>
          {/* Chat header */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 160,
            display: "flex",
            alignItems: "flex-end",
            padding: "0 28px 20px",
            background: "linear-gradient(to bottom, #0A0A1A, rgba(10,10,26,0.9))",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            zIndex: 90,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
              {/* Back arrow */}
              <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l7 7M5 12l7-7" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${C.comment}, ${C.phoneBlue})`,
              }} />
              <div>
                <div style={{ color: C.white, fontSize: 32, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>
                  Alex Creator
                </div>
                <div style={{ color: C.successGreen, fontSize: 24, fontFamily: "'Inter', system-ui, sans-serif" }}>
                  ● Online
                </div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.35a16 16 0 0 0 6.07 6.07l.951-1.85a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 14.9" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            position: "absolute",
            top: 160,
            bottom: 100,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 10,
          }}>
            {MESSAGES.map((msg, i) => (
              <ChatBubble key={i} frame={frame} color={C.phoneBlue2} {...msg} />
            ))}

            {/* Typing indicator */}
            {typingVisible && (
              <div style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingInline: 28,
                opacity: typingOpacity,
              }}>
                <div style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "24px 24px 24px 6px",
                  padding: "18px 28px",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.6)",
                      transform: `translateY(${dotAnim(i)}px)`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 100,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 16,
            backgroundColor: "rgba(10,10,26,0.95)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{
              flex: 1,
              height: 60,
              borderRadius: 30,
              backgroundColor: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
            }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 28, fontFamily: "'Inter', system-ui, sans-serif" }}>
                Message...
              </span>
            </div>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: C.phoneBlue2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 2L15 22 11 13 2 9l20-7z" stroke={C.white} strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PM-CHECKOUTPAGE — Phone with e-commerce checkout UI
// ═══════════════════════════════════════════════════════════════════════════════
export const PhoneCheckout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneScale = spring({ frame, fps, config: SPRING.bouncy, from: 0.7, to: 1, durationInFrames: 30 });
  const phoneOpacity = ci(frame, [0, 15, 160, 180], [0, 1, 1, 0]);

  // "Add to Cart" button press at frame 90
  const isAdded = frame > 90;
  const btnScale = spring({ frame: frame - 90, fps, config: SPRING.bouncy, from: 1, to: isAdded ? 1 : 1, durationInFrames: 20 });
  const btnColor = frame < 90 ? C.phoneBlue : C.successGreen;
  const btnLabel = frame < 90 ? "Add to Cart" : "✓ Added!";
  const btnGlow = frame < 90 ? "rgba(67,97,238,0.5)" : "rgba(6,214,160,0.5)";

  // Ripple from button press
  const rippleScale = ci(frame - 90, [0, 45], [0, 2.5], EaseOutExpo);
  const rippleOpacity = ci(frame - 90, [0, 5, 45], [0, 0.5, 0]);

  // Cart count
  const cartCount = frame > 95 ? "1" : "0";

  const PRODUCT_ITEMS = [
    { label: "Premium Course", price: "$49", rating: "4.9" },
    { label: "Digital Bundle", price: "$29", rating: "4.7" },
  ];

  const screenW = PHONE.w - PHONE.bezelSide * 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", opacity: phoneOpacity }}>
      <div style={{
        position: "absolute",
        width: 2000,
        height: 2000,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(6,214,160,0.1) 0%, transparent 65%)",
      }} />

      <div style={{ transform: `scale(${phoneScale})` }}>
        <PhoneFrame glowColor={C.successGreen} glowOpacity={0.28}>
          {/* App bar */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 140,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 28px 18px",
            backgroundColor: "rgba(10,10,26,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            zIndex: 90,
          }}>
            <span style={{ color: C.white, fontSize: 34, fontWeight: 700, fontFamily: "'Inter', system-ui, sans-serif" }}>
              Shop
            </span>
            {/* Cart icon with badge */}
            <div style={{ position: "relative" }}>
              <svg width={44} height={44} viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="3" y1="6" x2="21" y2="6" stroke={C.white} strokeWidth="2" />
                <path d="M16 10a4 4 0 0 1-8 0" stroke={C.white} strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              {frame > 95 && (
                <div style={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  backgroundColor: C.heart,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.white,
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  {cartCount}
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div style={{ position: "absolute", top: 140, bottom: 0, left: 0, right: 0, overflowY: "hidden" }}>
            {/* Product image */}
            <div style={{
              height: 380,
              background: `linear-gradient(135deg, ${C.phoneBlue}, ${C.storyPurple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 80 }}>📦</div>
                <div style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 26,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  marginTop: 10,
                }}>
                  Product Preview
                </div>
              </div>
            </div>

            {/* Product info */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{
                color: C.white,
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "'Inter', system-ui, sans-serif",
                marginBottom: 8,
              }}>
                Premium Digital Product
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <span style={{ color: C.badgeGold, fontSize: 28, fontFamily: "'Inter', system-ui, sans-serif" }}>
                  ★ 4.9
                </span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 26, fontFamily: "'Inter', system-ui, sans-serif" }}>
                  (2,847 reviews)
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <span style={{
                  color: C.white,
                  fontSize: 48,
                  fontWeight: 900,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}>
                  $49.00
                </span>
                <span style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 32,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  textDecoration: "line-through",
                }}>
                  $99.00
                </span>
              </div>

              {/* Features */}
              {["Lifetime Access", "Certificate Included", "Money-back Guarantee"].map((feat, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 12,
                }}>
                  <span style={{ color: C.successGreen, fontSize: 24 }}>✓</span>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 28, fontFamily: "'Inter', system-ui, sans-serif" }}>
                    {feat}
                  </span>
                </div>
              ))}

              {/* Add to Cart button */}
              <div style={{ position: "relative", marginTop: 28, overflow: "hidden", borderRadius: 20 }}>
                {/* Ripple */}
                {isAdded && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 100,
                    height: 100,
                    marginLeft: -50,
                    marginTop: -50,
                    borderRadius: "50%",
                    backgroundColor: C.white,
                    transform: `scale(${rippleScale})`,
                    opacity: rippleOpacity,
                  }} />
                )}
                <div style={{
                  height: 90,
                  borderRadius: 20,
                  backgroundColor: btnColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 6px 30px ${btnGlow}`,
                  transform: `scale(${btnScale})`,
                }}>
                  <span style={{
                    color: C.white,
                    fontSize: 34,
                    fontWeight: 700,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}>
                    {btnLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
