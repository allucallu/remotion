import React from 'react';
import { Easing, interpolate, interpolateColors } from 'remotion';
import { getCategoryIcon, KnobCheckIcon, KnobMinusIcon } from './PrivacyIcons';

export interface PrivacyPermission {
  label: string;
  sublabel?: string;
  iconType: 'location' | 'camera' | 'microphone' | 'data';
  initialState: boolean;
  targetState: boolean;
}

export interface PrivacyRowItemProps {
  permission: PrivacyPermission;
  index: number;
  frame: number;
  startFrame: number;
  accentColor?: string;
  isLast?: boolean;
}

export const PrivacyRowItem: React.FC<PrivacyRowItemProps> = ({
  permission,
  frame,
  startFrame,
  accentColor = '#2563EB',
  isLast = false,
}) => {
  const { label, sublabel, iconType, initialState, targetState } = permission;

  // 1. Calculate Transition Progress over 15 Frames
  const transitionLength = 15;
  const isTransitioning = frame >= startFrame && frame <= startFrame + transitionLength;
  const isCompleted = frame > startFrame + transitionLength;

  const rawProgress = isCompleted
    ? 1
    : isTransitioning
    ? (frame - startFrame) / transitionLength
    : 0;

  const easedProgress = interpolate(rawProgress, [0, 1], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
  });

  // 2. Determine Toggle Active State Value (0 = OFF, 1 = ON)
  const fromVal = initialState ? 1 : 0;
  const toVal = targetState ? 1 : 0;
  const currentActiveVal = interpolate(easedProgress, [0, 1], [fromVal, toVal]);

  // 3. Knob Position X Translation (5px for OFF, 59px for ON)
  const knobX = interpolate(currentActiveVal, [0, 1], [5, 59]);

  // 4. Smooth Pill Background Color Interpolation (#D1D5DB for OFF -> accentColor for ON)
  const pillBgColor = interpolateColors(currentActiveVal, [0, 1], ['#D1D5DB', accentColor]);

  // 5. Elastic Knob Squeeze Effect (scaleX 1 -> 0.85 -> 1 at midpoint of motion)
  const knobSqueeze = isTransitioning
    ? interpolate(Math.sin(rawProgress * Math.PI), [0, 1], [1, 0.85])
    : 1;

  // 6. Category Icon Opacity Micro-Fade (0.55 for OFF -> 1.0 for ON)
  const iconOpacity = interpolate(currentActiveVal, [0, 1], [0.55, 1]);

  const defaultSub = sublabel || (currentActiveVal > 0.5 ? 'Access Granted' : 'Access Denied');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        backgroundColor: isTransitioning ? '#F0F9FF' : 'transparent',
        borderRadius: '20px',
        transition: 'background-color 0.15s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '26px 12px',
          width: '100%',
        }}
      >
        {/* Left Category Icon & Label Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '22px',
              backgroundColor: '#F8FAFC',
              border: '2px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            }}
          >
            {getCategoryIcon(iconType, 46, iconOpacity)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: '#1F2937', letterSpacing: '-0.4px' }}>
              {label}
            </span>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 600,
                color: currentActiveVal > 0.5 ? accentColor : '#9CA3AF',
                transition: 'color 0.15s ease',
              }}
            >
              {defaultSub}
            </span>
          </div>
        </div>

        {/* Right Native Pill Toggle Switch */}
        <div
          style={{
            width: '120px', // Extra Large 4K Pill Width
            height: '66px', // Extra Large 4K Pill Height
            borderRadius: '9999px',
            backgroundColor: pillBgColor,
            padding: '5px',
            boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            transition: 'background-color 0.1s linear',
          }}
        >
          {/* White Solid Knob with Inner Check/Minus Icon */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16), 0 1px 3px rgba(0, 0, 0, 0.08)',
              transform: `translateX(${knobX}px) scaleX(${knobSqueeze})`,
              transition: 'transform 0.05s linear',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentActiveVal > 0.5 ? (
              <KnobCheckIcon size={24} color={accentColor} />
            ) : (
              <KnobMinusIcon size={22} color="#9CA3AF" />
            )}
          </div>
        </div>
      </div>

      {/* Divider Line between items */}
      {!isLast && (
        <div style={{ width: '100%', height: '1.5px', backgroundColor: '#F1F5F9', margin: '0' }} />
      )}
    </div>
  );
};
