import React from 'react';

export interface WireframeObjectProps {
  size?: number;
  rotationY?: number;
  color?: string;
}

export const WireframeObject: React.FC<WireframeObjectProps> = ({
  size = 300,
  rotationY = 0,
  color = '#00F0FF',
}) => {
  const radius = size / 2;
  const rotRad = (rotationY * Math.PI) / 180;

  // Latitude Circles
  const latitudes = [-60, -30, 0, 30, 60];
  // Longitude Meridians
  const longitudes = [0, 30, 60, 90, 120, 150];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${radius}, ${radius})`}>
        {/* Outer Sphere Boundary */}
        <circle r={radius - 4} fill="none" stroke={color} strokeWidth="2" opacity="0.6" />

        {/* Latitude Horizontal Ellipses */}
        {latitudes.map((lat, idx) => {
          const latRad = (lat * Math.PI) / 180;
          const rLat = radius * Math.cos(latRad);
          const yLat = -radius * Math.sin(latRad);

          return (
            <ellipse
              key={idx}
              cx="0"
              cy={yLat}
              rx={rLat}
              ry={rLat * 0.3}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.5"
            />
          );
        })}

        {/* Longitude Rotating Ellipses */}
        {longitudes.map((lng, idx) => {
          const angle = rotRad + (lng * Math.PI) / 180;
          const rx = radius * Math.abs(Math.sin(angle));

          return (
            <ellipse
              key={idx}
              cx="0"
              cy="0"
              rx={rx}
              ry={radius - 4}
              fill="none"
              stroke={color}
              strokeWidth="1.5"
              opacity="0.5"
            />
          );
        })}
      </g>
    </svg>
  );
};
