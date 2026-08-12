import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

// Load JetBrains Mono Google Font
const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export interface TreeNode {
  id: string;
  key: string;
  value?: string | number | boolean | null;
  type?: ValueType;
  collapsedCount?: number;
  level: number;
  expandFrame: number; // Frame when parent expands this node
  collapseFrame: number; // Frame when parent collapses this node
  children?: TreeNode[];
}

export interface JSONTreeThemeColors {
  panelBgColor: string;
  headerBgColor: string;
  borderColor: string;
  keyColor: string;
  stringValueColor: string;
  numberValueColor: string;
  booleanValueColor: string;
  punctuationColor: string;
  guideLineColor: string;
  badgeBgColor: string;
  badgeTextColor: string;
  ambientGlowColor: string;
}

export interface JSONTreeExpandCollapseProps {
  useGreenScreen?: boolean;
  panelWidthRatio?: number;
  panelBorderRadius?: number;
  fontSize?: number;
  lineHeight?: number;
  themeColors?: Partial<JSONTreeThemeColors>;
  treeData?: TreeNode;
}

const DEFAULT_THEME: JSONTreeThemeColors = {
  panelBgColor: '#0F0F13',
  headerBgColor: '#16161A',
  borderColor: 'rgba(255, 255, 255, 0.08)',
  keyColor: '#60A5FA', // Soft Blue
  stringValueColor: '#4ADE80', // Soft Green
  numberValueColor: '#FBBF24', // Soft Yellow
  booleanValueColor: '#A78BFA', // Soft Purple
  punctuationColor: '#E4E4E7', // Off-White
  guideLineColor: '#3F3F46', // Neutral Guide Line
  badgeBgColor: '#27272A',
  badgeTextColor: '#71717A',
  ambientGlowColor: '#3B82F6',
};

/**
 * Default Tree Data Structure with precalculated cascading Expand & Collapse timing.
 * Total Duration: 420 frames (7.0 seconds @ 60fps).
 */
const DEFAULT_TREE_DATA: TreeNode = {
  id: 'root',
  key: 'response',
  type: 'object',
  collapsedCount: 3,
  level: 0,
  expandFrame: 24,
  collapseFrame: 360,
  children: [
    {
      id: 'meta',
      key: 'meta',
      type: 'object',
      collapsedCount: 2,
      level: 1,
      expandFrame: 36,
      collapseFrame: 340,
      children: [
        {
          id: 'meta_status',
          key: 'status',
          value: 200,
          type: 'number',
          level: 2,
          expandFrame: 82,
          collapseFrame: 312,
        },
        {
          id: 'meta_server',
          key: 'server',
          value: 'cloud-us-east',
          type: 'string',
          level: 2,
          expandFrame: 90,
          collapseFrame: 300,
        },
      ],
    },
    {
      id: 'config',
      key: 'config',
      type: 'object',
      collapsedCount: 2,
      level: 1,
      expandFrame: 44,
      collapseFrame: 340,
      children: [
        {
          id: 'config_cache',
          key: 'cache_enabled',
          value: true,
          type: 'boolean',
          level: 2,
          expandFrame: 112,
          collapseFrame: 282,
        },
        {
          id: 'config_ttl',
          key: 'ttl',
          value: 3600,
          type: 'number',
          level: 2,
          expandFrame: 120,
          collapseFrame: 270,
        },
      ],
    },
    {
      id: 'records',
      key: 'records',
      type: 'array',
      collapsedCount: 2,
      level: 1,
      expandFrame: 52,
      collapseFrame: 340,
      children: [
        {
          id: 'rec_01',
          key: 'record_01',
          value: 'active_session',
          type: 'string',
          level: 2,
          expandFrame: 142,
          collapseFrame: 252,
        },
        {
          id: 'rec_02',
          key: 'record_02',
          value: 'synced',
          type: 'string',
          level: 2,
          expandFrame: 150,
          collapseFrame: 240,
        },
      ],
    },
  ],
};

/**
 * Chevron Icon Component with Smooth Easing Rotation
 */
const ChevronIcon: React.FC<{ rotation: number; color?: string }> = ({
  rotation,
  color = '#A1A1AA',
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: `rotate(${rotation}deg)`,
      transformOrigin: 'center',
      transition: 'transform 0.1s ease',
      marginRight: '12px',
      display: 'inline-block',
      verticalAlign: 'middle',
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const JSONTreeExpandCollapse: React.FC<JSONTreeExpandCollapseProps> = ({
  useGreenScreen = false,
  panelWidthRatio = 0.7,
  panelBorderRadius = 24,
  fontSize = 32,
  lineHeight = 56,
  themeColors = {},
  treeData = DEFAULT_TREE_DATA,
}) => {
  const frame = useCurrentFrame();
  const theme: JSONTreeThemeColors = { ...DEFAULT_THEME, ...themeColors };

  // ==========================================
  // FASE 1: Window Entry Zoom-Through (Frame 0 - 24)
  // ==========================================
  const panelEasing = Easing.bezier(0.16, 1, 0.3, 1);

  const panelOpacity = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  const panelScale = interpolate(frame, [0, 24], [1.05, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: panelEasing,
  });

  // Helper pengambil warna berdasarkan tipe value
  const getValueColor = (type?: ValueType): string => {
    switch (type) {
      case 'string':
        return theme.stringValueColor;
      case 'number':
        return theme.numberValueColor;
      case 'boolean':
      case 'null':
        return theme.booleanValueColor;
      default:
        return theme.punctuationColor;
    }
  };

  /**
   * Recursive Node Renderer
   * Renders tree nodes with cascading reveal during EXPAND phase (0-180f), HOLD (180-240f), and COLLAPSE phase (240-420f).
   */
  const renderNode = (node: TreeNode): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;

    // ==========================================
    // ANIMASI 1: Chevron Rotation (0° -> 90° -> 0°)
    // Dynamic Rotation based on expand & collapse timeline
    // ==========================================
    let chevronRotation = 0;

    if (hasChildren) {
      // Determine expand start frame for this node's chevron
      const expandStart = node.level === 0 ? 24 : node.expandFrame + 24;
      const collapseStart = node.level === 0 ? 360 : node.collapseFrame;

      const expandRot = interpolate(
        frame,
        [expandStart, expandStart + 14],
        [0, 90],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.45, 0, 0.55, 1), // Smooth Curve ease-in-out
        }
      );

      const collapseRot = interpolate(
        frame,
        [collapseStart, collapseStart + 14],
        [90, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.45, 0, 0.55, 1),
        }
      );

      chevronRotation = frame < 240 ? expandRot : collapseRot;
    }

    // ==========================================
    // ANIMASI 2: Child Node Entrance / Exit Opacity & TranslateY
    // ==========================================
    let nodeOpacity = 1;
    let nodeTranslateY = 0;

    if (node.level > 0) {
      const expandOpacity = interpolate(
        frame,
        [node.expandFrame, node.expandFrame + 15],
        [0, 1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: panelEasing,
        }
      );

      const collapseOpacity = interpolate(
        frame,
        [node.collapseFrame, node.collapseFrame + 12],
        [1, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.7, 0, 0.84, 0), // Heavy Ease-In for collapse
        }
      );

      nodeOpacity = frame < 240 ? expandOpacity : collapseOpacity;

      nodeTranslateY = interpolate(
        frame,
        [node.expandFrame, node.expandFrame + 15],
        [6, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: panelEasing,
        }
      );
    }

    // Hide node completely if opacity is 0
    if (nodeOpacity <= 0.01 && node.level > 0) {
      return null;
    }

    const showCollapsedBadge = chevronRotation < 45 && hasChildren;

    return (
      <div
        key={node.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          opacity: nodeOpacity,
          transform: `translateY(${nodeTranslateY}px)`,
        }}
      >
        {/* Node Line Row */}
        <div
          style={{
            height: `${lineHeight}px`,
            display: 'flex',
            alignItems: 'center',
            fontSize: `${fontSize}px`,
            whiteSpace: 'pre',
          }}
        >
          {/* Chevron Icon if node has children */}
          {hasChildren ? (
            <ChevronIcon rotation={chevronRotation} />
          ) : (
            <div style={{ width: '28px' }} />
          )}

          {/* Node Key */}
          <span style={{ color: theme.keyColor, fontWeight: 500 }}>
            "{node.key}"
          </span>
          <span style={{ color: theme.punctuationColor, marginRight: '10px' }}>:</span>

          {/* Node Value (If primitive leaf node) */}
          {!hasChildren && node.value !== undefined && (
            <span style={{ color: getValueColor(node.type), fontWeight: 400 }}>
              {typeof node.value === 'string' ? `"${node.value}"` : String(node.value)}
            </span>
          )}

          {/* Collapsed Badge "N items" */}
          {hasChildren && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: theme.punctuationColor }}>
                {node.type === 'array' ? '[' : '{'}
              </span>
              {showCollapsedBadge && (
                <span
                  style={{
                    backgroundColor: theme.badgeBgColor,
                    color: theme.badgeTextColor,
                    fontSize: '14px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {node.collapsedCount} items
                </span>
              )}
            </div>
          )}
        </div>

        {/* Children Container with Vertical Guide Line */}
        {hasChildren && (
          <div
            style={{
              paddingLeft: '32px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Vertical Guide Line */}
            {chevronRotation > 10 && (
              <div
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '0px',
                  bottom: '16px',
                  width: '1.5px',
                  backgroundColor: theme.guideLineColor,
                  opacity: 0.6,
                }}
              />
            )}

            {/* Render Child Nodes recursively */}
            {node.children?.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LAYER 1: Ambient Background Glow & Tech Grid */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2400px',
              height: '1400px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse at center, ${theme.ambientGlowColor}14 0%, transparent 65%)`,
              filter: 'blur(100px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Tech Marks */}
          <div style={{ position: 'absolute', top: '48px', left: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            + 00:38:40 / 4K UHD
          </div>
          <div style={{ position: 'absolute', top: '48px', right: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            JSON TREE // CASCADING REVEAL (7.0s)
          </div>
        </>
      )}

      {/* LAYER 2: Glassmorphic Tree View Window Container */}
      <div
        style={{
          width: `${panelWidthRatio * 100}%`,
          backgroundColor: theme.panelBgColor,
          borderRadius: `${panelBorderRadius}px`,
          border: `1px solid ${theme.borderColor}`,
          boxShadow: '0 50px 120px rgba(0, 0, 0, 0.8), 0 16px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          opacity: panelOpacity,
          transform: `scale(${panelScale})`,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header Bar */}
        <div
          style={{
            height: '72px',
            backgroundColor: theme.headerBgColor,
            borderBottom: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '32px',
            paddingRight: '32px',
            position: 'relative',
          }}
        >
          {/* 3 Monochrome Window Controls */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#52525B' }} />
          </div>

          {/* Header Title */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#A1A1AA',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            DATA TREE VIEWER
          </div>

          {/* Status Tag */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#60A5FA',
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              padding: '6px 14px',
              borderRadius: '9999px',
              letterSpacing: '1px',
            }}
          >
            HIERARCHICAL
          </div>
        </div>

        {/* Body Panel: Tree View */}
        <div
          style={{
            padding: '48px',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderNode(treeData)}
        </div>

        {/* Footer Telemetry Status Bar */}
        <div
          style={{
            height: '44px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderTop: `1px solid ${theme.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '32px',
            paddingRight: '32px',
            fontSize: '14px',
            color: '#71717A',
          }}
        >
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Nodes: <span style={{ color: '#A1A1AA' }}>9 Total</span></span>
            <span>Depth: <span style={{ color: '#A1A1AA' }}>Level 2</span></span>
            <span>State: <span style={{ color: frame >= 180 && frame <= 240 ? '#4ADE80' : '#60A5FA', fontWeight: 600 }}>{frame < 180 ? 'EXPANDING' : frame <= 240 ? 'EXPANDED' : 'COLLAPSING'}</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#60A5FA' }} />
            <span>Format: <span style={{ color: '#A1A1AA' }}>Tree JSON</span></span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
