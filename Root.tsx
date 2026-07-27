import React from 'react';
import { Composition } from 'remotion';
import { LowerThird } from './LowerThird';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LowerThird"
      component={LowerThird}
      durationInFrames={150} // 5 seconds at 30fps: in -> hold -> out
      fps={30}
      width={3840}
      height={2160}
      defaultProps={{
        primaryColor: '#1B1F3B',
        accentColor: '#3DDC97',
        delayFrame: 10,
        exitStartFrame: 110,
        barHeight: 90,
        leftOffset: 120,
        bottomOffset: 320,
        barWidth: 960,
      }}
    />
  );
};
