import React from 'react';

export interface HexGridPatternProps {
  width?: number;
  height?: number;
  color?: string;
}

export const HexGridPattern: React.FC<HexGridPatternProps> = ({
  width = 400,
  height = 400,
  color = '#00FF66',
}) => {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <pattern id="hexGrid" width="40" height="69.282" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 20 11.547 L 0 0 L 0 23.094 L 20 34.641 L 40 23.094 Z M 0 34.641 L 20 46.188 L 0 57.735 L 0 80.829 L 20 92.376 L 40 80.829 Z"
            fill="none"
            stroke={color}
            strokeWidth="1"
            strokeOpacity="0.3"
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#hexGrid)" />
    </svg>
  );
};
