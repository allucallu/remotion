import React from 'react';
import { interpolate } from 'remotion';
import { EncryptedPacketLockIcon } from './TransferIcons';

export interface DataPacketCardProps {
  index: number;
  frame: number;
  startFrame: number;
  rawText: string;
  startX?: number;
  endX?: number;
  gateX?: number;
  accentColor?: string;
  direction?: 'left-to-right' | 'right-to-left';
}

export const DataPacketCard: React.FC<DataPacketCardProps> = ({
  frame,
  startFrame,
  rawText,
  startX = 640,
  endX = 3200,
  gateX = 1920,
  accentColor = '#2563EB',
  direction = 'left-to-right',
}) => {
  const activeFrame = frame - startFrame;

  if (activeFrame < 0 || activeFrame > 280) return null;

  // 1. Linear Motion across X axis (280 frames travel duration)
  const travelProgress = interpolate(activeFrame, [0, 280], [0, 1], { extrapolateRight: 'clamp' });
  const fromX = direction === 'left-to-right' ? startX : endX;
  const toX = direction === 'left-to-right' ? endX : startX;
  const currentX = interpolate(travelProgress, [0, 1], [fromX, toX]);

  // 2. Detect Gate Passing Intersection & 3D Flip Shrink Scale (scale 1 -> 0.45 -> 1)
  const distToGate = Math.abs(currentX - gateX);
  const shrinkProgress = Math.max(0, 1 - distToGate / 120);
  const scale = interpolate(shrinkProgress, [0, 0.5, 1], [1, 0.45, 0.88]);

  // 3. Content State Swap (Before vs After Gate)
  const isEncrypted = direction === 'left-to-right' ? currentX >= gateX : currentX <= gateX;

  // Fade in / out at path ends
  const opacity = interpolate(activeFrame, [0, 15, 265, 280], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: `${currentX}px`,
        top: '1080px',
        width: '144px', // Enlarged 4K Legible Width
        height: '88px', // Enlarged 4K Legible Height
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderRadius: '18px',
        backgroundColor: isEncrypted ? accentColor : 'rgba(248, 250, 252, 0.98)',
        border: `2.5px solid ${isEncrypted ? '#1D4ED8' : '#CBD5E1'}`,
        boxShadow: isEncrypted
          ? `0 10px 24px ${accentColor}55, 0 3px 8px rgba(0, 0, 0, 0.08)`
          : '0 6px 16px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 12px',
        gap: '4px',
        transition: 'background-color 0.1s linear, border-color 0.1s linear',
        zIndex: 5,
      }}
    >
      {isEncrypted ? (
        /* Encrypted State: Solid Accent Badge + Top Header + Lock Icon + AES-256 Tag */
        <>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#93C5FD',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            ENCRYPTED
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <EncryptedPacketLockIcon size={30} color="#FFFFFF" />
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.6px' }}>
              AES-256
            </span>
          </div>
        </>
      ) : (
        /* Unencrypted Raw State: Gray Card + RAW DATA Header + Monospace Code Text */
        <>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#94A3B8',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            RAW PAYLOAD
          </span>

          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '18px',
              fontWeight: 700,
              color: '#334155',
              letterSpacing: '0.6px',
            }}
          >
            {rawText}
          </span>
        </>
      )}
    </div>
  );
};
