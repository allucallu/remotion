import React from 'react';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface MiniWidgetProps {
  variant: 'bargraph' | 'toggle' | 'slider';
  title: string;
  value: number; // 0 to 1
  color?: string;
  accentColor?: string;
  isHighlighted?: boolean;
}

export const MiniWidget: React.FC<MiniWidgetProps> = ({
  variant,
  title,
  value,
  color = '#00F0FF',
  accentColor = '#FFB700',
  isHighlighted = false,
}) => {
  return (
    <div
      style={{
        width: '220px',
        height: '110px',
        backgroundColor: isHighlighted ? 'rgba(255, 183, 0, 0.15)' : 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isHighlighted ? accentColor : color}50`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isHighlighted ? `0 0 20px ${accentColor}40` : `0 0 10px ${color}20`,
        transition: 'all 0.2s ease-out',
      }}
    >
      <div style={{ fontSize: '12px', color: isHighlighted ? accentColor : color, fontWeight: 700, fontFamily: jetBrainsMonoFontFamily }}>
        [ {title} ]
      </div>

      {variant === 'bargraph' && (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '40px' }}>
          {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((hMult, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: `${value * hMult * 40}px`,
                backgroundColor: i % 2 === 0 ? color : accentColor,
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}

      {variant === 'toggle' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '24px',
              borderRadius: '100px',
              backgroundColor: value > 0.5 ? color : '#334155',
              padding: '3px',
              display: 'flex',
              justifyContent: value > 0.5 ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
          </div>
          <span style={{ fontSize: '14px', color: '#FFFFFF', fontFamily: jetBrainsMonoFontFamily }}>
            {value > 0.5 ? 'ACTIVE' : 'STANDBY'}
          </span>
        </div>
      )}

      {variant === 'slider' && (
        <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '100px', position: 'relative' }}>
          <div style={{ width: `${value * 100}%`, height: '100%', backgroundColor: color, borderRadius: '100px' }} />
          <div
            style={{
              position: 'absolute',
              left: `${value * 90}%`,
              top: '-4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
};
