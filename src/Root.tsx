import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdRefractivePrismUnfold } from './LowerThirdRefractivePrismUnfold';
import { LowerThirdFrostedLiquidSlide } from './LowerThirdFrostedLiquidSlide';
import { LowerThirdHardOffsetSnap } from './LowerThirdHardOffsetSnap';
import { LowerThirdAsymmetricalStaggerGrid } from './LowerThirdAsymmetricalStaggerGrid';
import { LowerThirdTargetReticleExpand } from './LowerThirdTargetReticleExpand';
import { LowerThirdQuantumCircuitReveal } from './LowerThirdQuantumCircuitReveal';
import { LowerThirdElasticVectorSweep } from './LowerThirdElasticVectorSweep';
import { LowerThirdStaggeredRuleCascade } from './LowerThirdStaggeredRuleCascade';
import { LowerThirdBeveledGoldShimmer } from './LowerThirdBeveledGoldShimmer';
import { LowerThirdMetallicInsetSlide } from './LowerThirdMetallicInsetSlide';

const compositions = [
  { id: 'LowerThird-01-RefractivePrismUnfold', component: LowerThirdRefractivePrismUnfold, dur: 180 },
  { id: 'LowerThird-02-FrostedLiquidSlide', component: LowerThirdFrostedLiquidSlide, dur: 180 },
  { id: 'LowerThird-03-HardOffsetSnap', component: LowerThirdHardOffsetSnap, dur: 180 },
  { id: 'LowerThird-04-AsymmetricalStaggerGrid', component: LowerThirdAsymmetricalStaggerGrid, dur: 180 },
  { id: 'LowerThird-05-TargetReticleExpand', component: LowerThirdTargetReticleExpand, dur: 180 },
  { id: 'LowerThird-06-QuantumCircuitReveal', component: LowerThirdQuantumCircuitReveal, dur: 180 },
  { id: 'LowerThird-07-ElasticVectorSweep', component: LowerThirdElasticVectorSweep, dur: 180 },
  { id: 'LowerThird-08-StaggeredRuleCascade', component: LowerThirdStaggeredRuleCascade, dur: 180 },
  { id: 'LowerThird-09-BeveledGoldShimmer', component: LowerThirdBeveledGoldShimmer, dur: 180 },
  { id: 'LowerThird-10-MetallicInsetSlide', component: LowerThirdMetallicInsetSlide, dur: 180 },
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
