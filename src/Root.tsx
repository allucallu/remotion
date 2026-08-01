import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdViscousVectorWave } from './LowerThirdViscousVectorWave';
import { LowerThirdSplineExpansion } from './LowerThirdSplineExpansion';
import { LowerThirdAsymmetricalRibbonFold } from './LowerThirdAsymmetricalRibbonFold';
import { LowerThirdDiagonalSlateShear } from './LowerThirdDiagonalSlateShear';
import { LowerThirdDeconstructedVectorSlice } from './LowerThirdDeconstructedVectorSlice';
import { LowerThirdFluidMaskReveal } from './LowerThirdFluidMaskReveal';
import { LowerThirdBezierPathTracer } from './LowerThirdBezierPathTracer';
import { LowerThirdPolygonalMeshUnfold } from './LowerThirdPolygonalMeshUnfold';
import { LowerThirdMetallicLiquidRibbon } from './LowerThirdMetallicLiquidRibbon';
import { LowerThirdChiseledPrismUnravel } from './LowerThirdChiseledPrismUnravel';

const compositions = [
  { id: 'LowerThird-01-ViscousVectorWave', component: LowerThirdViscousVectorWave, dur: 180 },
  { id: 'LowerThird-02-SplineExpansion', component: LowerThirdSplineExpansion, dur: 180 },
  { id: 'LowerThird-03-AsymmetricalRibbonFold', component: LowerThirdAsymmetricalRibbonFold, dur: 180 },
  { id: 'LowerThird-04-DiagonalSlateShear', component: LowerThirdDiagonalSlateShear, dur: 180 },
  { id: 'LowerThird-05-DeconstructedVectorSlice', component: LowerThirdDeconstructedVectorSlice, dur: 180 },
  { id: 'LowerThird-06-FluidMaskReveal', component: LowerThirdFluidMaskReveal, dur: 180 },
  { id: 'LowerThird-07-BezierPathTracer', component: LowerThirdBezierPathTracer, dur: 180 },
  { id: 'LowerThird-08-PolygonalMeshUnfold', component: LowerThirdPolygonalMeshUnfold, dur: 180 },
  { id: 'LowerThird-09-MetallicLiquidRibbon', component: LowerThirdMetallicLiquidRibbon, dur: 180 },
  { id: 'LowerThird-10-ChiseledPrismUnravel', component: LowerThirdChiseledPrismUnravel, dur: 180 },
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
