import { Composition } from 'remotion';
import './index.css';

import { CorporateGradientFlow } from './CorporateGradientFlow';
import { CorporateAuroraWave } from './CorporateAuroraWave';
import { CorporateBlobMorph } from './CorporateBlobMorph';
import { CorporateParticleDrift } from './CorporateParticleDrift';
import { CorporateGeometricPulse } from './CorporateGeometricPulse';
import { CorporateNoiseField } from './CorporateNoiseField';
import { CorporateWaveStack } from './CorporateWaveStack';
import { CorporateRadialBreath } from './CorporateRadialBreath';
import { CorporateLiquidMetal } from './CorporateLiquidMetal';
import { CorporateDiamondGrid } from './CorporateDiamondGrid';

const compositions = [
  { id: 'Corporate-01-GradientFlow', component: CorporateGradientFlow, duration: 240 },
  { id: 'Corporate-02-AuroraWave', component: CorporateAuroraWave, duration: 300 },
  { id: 'Corporate-03-BlobMorph', component: CorporateBlobMorph, duration: 240 },
  { id: 'Corporate-04-ParticleDrift', component: CorporateParticleDrift, duration: 180 },
  { id: 'Corporate-05-GeometricPulse', component: CorporateGeometricPulse, duration: 180 },
  { id: 'Corporate-06-NoiseField', component: CorporateNoiseField, duration: 300 },
  { id: 'Corporate-07-WaveStack', component: CorporateWaveStack, duration: 240 },
  { id: 'Corporate-08-RadialBreath', component: CorporateRadialBreath, duration: 240 },
  { id: 'Corporate-09-LiquidMetal', component: CorporateLiquidMetal, duration: 300 },
  { id: 'Corporate-10-DiamondGrid', component: CorporateDiamondGrid, duration: 180 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          durationInFrames={comp.duration}
          fps={30}
          width={3840}
          height={2160}
        />
      ))}
    </>
  );
};
