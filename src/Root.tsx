import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdChronoDialUnmask } from './LowerThirdChronoDialUnmask';
import { LowerThirdMatrixGlitchShift } from './LowerThirdMatrixGlitchShift';
import { LowerThirdPortalApertureSlice } from './LowerThirdPortalApertureSlice';
import { LowerThirdCubePerspectiveUnfold } from './LowerThirdCubePerspectiveUnfold';
import { LowerThirdHelixRibbonWeave } from './LowerThirdHelixRibbonWeave';
import { LowerThirdCascadeShutterSqueeze } from './LowerThirdCascadeShutterSqueeze';
import { LowerThirdOrbitalRingConstruct } from './LowerThirdOrbitalRingConstruct';
import { LowerThirdSlantedBellowsExpand } from './LowerThirdSlantedBellowsExpand';
import { LowerThirdSplitCrosshatchSnap } from './LowerThirdSplitCrosshatchSnap';
import { LowerThirdConcentricRingBurst } from './LowerThirdConcentricRingBurst';

const compositions = [
  { id: 'LowerThird-01-ChronoDialUnmask', component: LowerThirdChronoDialUnmask, dur: 180 },
  { id: 'LowerThird-02-MatrixGlitchShift', component: LowerThirdMatrixGlitchShift, dur: 180 },
  { id: 'LowerThird-03-PortalApertureSlice', component: LowerThirdPortalApertureSlice, dur: 210 },
  { id: 'LowerThird-04-CubePerspectiveUnfold', component: LowerThirdCubePerspectiveUnfold, dur: 180 },
  { id: 'LowerThird-05-HelixRibbonWeave', component: LowerThirdHelixRibbonWeave, dur: 180 },
  { id: 'LowerThird-06-CascadeShutterSqueeze', component: LowerThirdCascadeShutterSqueeze, dur: 180 },
  { id: 'LowerThird-07-OrbitalRingConstruct', component: LowerThirdOrbitalRingConstruct, dur: 210 },
  { id: 'LowerThird-08-SlantedBellowsExpand', component: LowerThirdSlantedBellowsExpand, dur: 180 },
  { id: 'LowerThird-09-SplitCrosshatchSnap', component: LowerThirdSplitCrosshatchSnap, dur: 180 },
  { id: 'LowerThird-10-ConcentricRingBurst', component: LowerThirdConcentricRingBurst, dur: 180 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          durationInFrames={comp.dur}
          fps={30}
          width={3840}
          height={2160}
        />
      ))}
    </>
  );
};
