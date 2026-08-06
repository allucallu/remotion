import React from 'react';
import { CornerBracket } from './CornerBracket';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface TrackingBoxProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  labels?: string[];
}

export const TrackingBox: React.FC<TrackingBoxProps> = ({
  x,
  y,
  width = 240,
  height = 240,
  color = '#CCFF00',
  labels = ['ALT: 450m', 'SPD: 72km/h', 'GPS: 34.052, -118.243'],
}) => {
  return (
    <div style={{ position: 'absolute', left: `${x - width / 2}px`, top: `${y - height / 2}px` }}>
      {/* 4 Corner Brackets forming a full tracking box */}
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <CornerBracket size={40} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', right: 0, top: 0, transform: 'scaleX(-1)' }}>
        <CornerBracket size={40} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, transform: 'scaleY(-1)' }}>
        <CornerBracket size={40} color={color} strokeWidth={3} />
      </div>
      <div style={{ position: 'absolute', right: 0, bottom: 0, transform: 'scale(-1)' }}>
        <CornerBracket size={40} color={color} strokeWidth={3} />
      </div>

      {/* Leader Line extending to Telemetry Labels */}
      <svg width="400" height="200" viewBox="0 0 400 200" style={{ position: 'absolute', left: `${width}px`, top: '0px', overflow: 'visible', pointerEvents: 'none' }}>
        <polyline points={`0, ${height / 2} 40, ${height / 2 - 30} 120, ${height / 2 - 30}`} fill="none" stroke={color} strokeWidth="2" />
        <circle cx="0" cy={height / 2} r="4" fill={color} />
      </svg>

      {/* Telemetry Labels Display */}
      <div
        style={{
          position: 'absolute',
          left: `${width + 130}px`,
          top: `${height / 2 - 60}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          color,
          fontFamily: jetBrainsMonoFontFamily,
          fontSize: '16px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          textShadow: `0 0 10px ${color}`,
        }}
      >
        {labels.map((lbl, idx) => (
          <div key={idx}>[ {lbl} ]</div>
        ))}
      </div>
    </div>
  );
};
