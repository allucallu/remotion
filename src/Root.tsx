import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdShardAssemble } from './LowerThirdShardAssemble';
import { LowerThirdOrigamiUnfold } from './LowerThirdOrigamiUnfold';
import { LowerThirdJaggedTear } from './LowerThirdJaggedTear';
import { LowerThirdInterlockingSlits } from './LowerThirdInterlockingSlits';
import { LowerThirdKineticSlatRotator } from './LowerThirdKineticSlatRotator';
import { LowerThirdApertureExpand } from './LowerThirdApertureExpand';
import { LowerThirdLiquidWaveExpand } from './LowerThirdLiquidWaveExpand';
import { LowerThirdElasticRibbonUnroll } from './LowerThirdElasticRibbonUnroll';
import { LowerThirdVoxelDropConstruct } from './LowerThirdVoxelDropConstruct';
import { LowerThirdPrismSlantShift } from './LowerThirdPrismSlantShift';

const compositions = [
  { id: 'LowerThird-01-ShardAssemble', component: LowerThirdShardAssemble, dur: 180 },
  { id: 'LowerThird-02-OrigamiUnfold', component: LowerThirdOrigamiUnfold, dur: 180 },
  { id: 'LowerThird-03-JaggedTear', component: LowerThirdJaggedTear, dur: 210 },
  { id: 'LowerThird-04-InterlockingSlits', component: LowerThirdInterlockingSlits, dur: 180 },
  { id: 'LowerThird-05-KineticSlatRotator', component: LowerThirdKineticSlatRotator, dur: 180 },
  { id: 'LowerThird-06-ApertureExpand', component: LowerThirdApertureExpand, dur: 210 },
  { id: 'LowerThird-07-LiquidWaveExpand', component: LowerThirdLiquidWaveExpand, dur: 180 },
  { id: 'LowerThird-08-ElasticRibbonUnroll', component: LowerThirdElasticRibbonUnroll, dur: 180 },
  { id: 'LowerThird-09-VoxelDropConstruct', component: LowerThirdVoxelDropConstruct, dur: 180 },
  { id: 'LowerThird-10-PrismSlantShift', component: LowerThirdPrismSlantShift, dur: 180 },
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
