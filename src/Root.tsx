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
  { id: 'LowerThird-01-SpatialOrigamiFold', component: LowerThirdSpatialOrigamiFold, dur: 180 },
  { id: 'LowerThird-02-DepthSlateDrop', component: LowerThirdDepthSlateDrop, dur: 180 },
  { id: 'LowerThird-03-ShardPolygonFusion', component: LowerThirdShardPolygonFusion, dur: 180 },
  { id: 'LowerThird-04-TectonicBlockShift', component: LowerThirdTectonicBlockShift, dur: 180 },
  { id: 'LowerThird-05-CrosshairGridExpand', component: LowerThirdCrosshairGridExpand, dur: 180 },
  { id: 'LowerThird-06-ModularStackingRatio', component: LowerThirdModularStackingRatio, dur: 180 },
  { id: 'LowerThird-07-ViscousElastomerTear', component: LowerThirdViscousElastomerTear, dur: 180 },
  { id: 'LowerThird-08-AlgorithmicNoiseSweep', component: LowerThirdAlgorithmicNoiseSweep, dur: 180 },
  { id: 'LowerThird-09-ScanlineFracture', component: LowerThirdScanlineFracture, dur: 180 },
  { id: 'LowerThird-10-SlitScanCascade', component: LowerThirdSlitScanCascade, dur: 180 },
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
