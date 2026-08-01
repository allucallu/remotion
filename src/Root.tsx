import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdSpatialOrigamiFold } from './LowerThirdSpatialOrigamiFold';
import { LowerThirdDepthSlateDrop } from './LowerThirdDepthSlateDrop';
import { LowerThirdShardPolygonFusion } from './LowerThirdShardPolygonFusion';
import { LowerThirdTectonicBlockShift } from './LowerThirdTectonicBlockShift';
import { LowerThirdCrosshairGridExpand } from './LowerThirdCrosshairGridExpand';
import { LowerThirdModularStackingRatio } from './LowerThirdModularStackingRatio';
import { LowerThirdViscousElastomerTear } from './LowerThirdViscousElastomerTear';
import { LowerThirdAlgorithmicNoiseSweep } from './LowerThirdAlgorithmicNoiseSweep';
import { LowerThirdScanlineFracture } from './LowerThirdScanlineFracture';
import { LowerThirdSlitScanCascade } from './LowerThirdSlitScanCascade';

const compositions = [
  { id: 'LowerThird-01-HexPrismOrigamiFold', component: LowerThirdSpatialOrigamiFold, dur: 180 },
  { id: 'LowerThird-02-TrapezoidPedestalDrop', component: LowerThirdDepthSlateDrop, dur: 180 },
  { id: 'LowerThird-03-RazorCrystalShardFusion', component: LowerThirdShardPolygonFusion, dur: 180 },
  { id: 'LowerThird-04-DiagonalChevronTectonicShift', component: LowerThirdTectonicBlockShift, dur: 180 },
  { id: 'LowerThird-05-ReticleSwissGridExpand', component: LowerThirdCrosshairGridExpand, dur: 180 },
  { id: 'LowerThird-06-GoldenRatioModularStack', component: LowerThirdModularStackingRatio, dur: 180 },
  { id: 'LowerThird-07-OrganicLiquidPodTear', component: LowerThirdViscousElastomerTear, dur: 180 },
  { id: 'LowerThird-08-TornEdgeNoiseSweep', component: LowerThirdAlgorithmicNoiseSweep, dur: 180 },
  { id: 'LowerThird-09-DualScannerCyberMatrix', component: LowerThirdScanlineFracture, dur: 180 },
  { id: 'LowerThird-10-SlantedParallelogramCascade', component: LowerThirdSlitScanCascade, dur: 180 },
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
