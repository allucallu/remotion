import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { TerminalWindow } from '../components/TerminalWindow';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface AiModelTrainingProps {
  background?: 'alpha' | 'solid';
}

export const AiModelTraining: React.FC<AiModelTrainingProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  const startFrame = 15;
  const endFrame = 170;

  // Epoch counter 1 -> 20
  const currentEpoch = Math.min(
    20,
    Math.max(
      1,
      Math.floor(
        interpolate(frame, [startFrame, endFrame], [1, 20], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      )
    )
  );

  // Progress fraction 0 -> 1 across training frames
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Dynamic Metrics
  const currentLoss = (0.842 * Math.exp(-2.5 * progress) + 0.048 * progress).toFixed(4);
  const currentAccuracy = (68.2 + (99.4 - 68.2) * (1 - Math.exp(-3 * progress))).toFixed(1);

  // Background must be pure solid black #000000 when solid
  const bgColor = background === 'solid' ? '#000000' : 'transparent';

  // SVG dimensions for dual metric trend curves
  const graphWidth = 1200;
  const graphHeight = 220;
  const paddingX = 60;
  const paddingY = 25;
  const usableWidth = graphWidth - paddingX * 2;
  const usableHeight = graphHeight - paddingY * 2;

  // Generate 21 data points for Loss & Accuracy across Epoch 0..20
  const pointsCount = 21;
  const lossPoints: { x: number; y: number }[] = [];
  const accPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const p = i / (pointsCount - 1);
    const x = paddingX + p * usableWidth;

    // Loss exponential decay (1.0 -> 0.0)
    const valLoss = 0.842 * Math.exp(-2.5 * p) + 0.048 * p;
    // Map Loss [0.0, 1.0] to Y [usableHeight + paddingY, paddingY]
    const yLoss = paddingY + (1 - valLoss) * usableHeight;
    lossPoints.push({ x, y: yLoss });

    // Accuracy logarithmic growth (50% -> 100%)
    const valAcc = 68.2 + (99.4 - 68.2) * (1 - Math.exp(-3 * p));
    // Map Accuracy [50, 100] to Y [usableHeight + paddingY, paddingY]
    const normAcc = (valAcc - 50) / 50;
    const yAcc = paddingY + (1 - normAcc) * usableHeight;
    accPoints.push({ x, y: yAcc });
  }

  // Convert points to SVG polyline string
  const lossPathString = lossPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');
  const accPathString = accPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');

  // Current active tip point position on graph based on progress
  const currentTipX = paddingX + progress * usableWidth;
  const currentValLoss = 0.842 * Math.exp(-2.5 * progress) + 0.048 * progress;
  const currentTipYLoss = paddingY + (1 - currentValLoss) * usableHeight;

  const currentValAcc = 68.2 + (99.4 - 68.2) * (1 - Math.exp(-3 * progress));
  const currentNormAcc = (currentValAcc - 50) / 50;
  const currentTipYAcc = paddingY + (1 - currentNormAcc) * usableHeight;

  // Path stroke dashoffset animation (total path length approx 1250)
  const pathLength = 1250;
  const dashOffset = pathLength * (1 - progress);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFontFamily,
      }}
    >
      <TerminalWindow
        title="python3 — PyTorch LLM Fine-Tuning Console"
        width="1450px"
        height="890px"
        backgroundColor="#0A0E17"
        borderColor="rgba(143, 188, 187, 0.2)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Header Command Prompt */}
          <div style={{ fontSize: '26px', color: '#D8DEE9', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#81A1C1', fontWeight: 'bold' }}>$</span>
            <span>python train.py --model llama-3-7b --epochs 20 --batch-size 32</span>
          </div>

          {/* Current Metrics Dashboard Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '20px',
              backgroundColor: '#111726',
              padding: '24px 32px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <div style={{ fontSize: '18px', color: '#A3BE8C', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                EPOCH PROGRESS
              </div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#D8DEE9', marginTop: '4px' }}>
                {currentEpoch} / 20
              </div>
            </div>

            <div>
              <div style={{ fontSize: '18px', color: '#BF616A', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                LOSS (DECAY)
              </div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#BF616A', marginTop: '4px' }}>
                {currentLoss}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '18px', color: '#8FBCBB', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                ACCURACY (GROWTH)
              </div>
              <div style={{ fontSize: '42px', fontWeight: 'bold', color: '#8FBCBB', marginTop: '4px' }}>
                {currentAccuracy}%
              </div>
            </div>
          </div>

          {/* Dual Loss & Accuracy Interactive SVG Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '20px', color: '#8892B0', fontWeight: 'bold', letterSpacing: '0.1em' }}>
                REAL-TIME METRICS TENSORBOARD GRAPH
              </div>
              <div style={{ display: 'flex', gap: '24px', fontSize: '16px', fontWeight: 'bold' }}>
                <span style={{ color: '#BF616A' }}>━ Training Loss</span>
                <span style={{ color: '#8FBCBB' }}>━ Model Accuracy</span>
              </div>
            </div>

            <div
              style={{
                width: '100%',
                backgroundColor: '#111726',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <svg width={graphWidth} height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
                <defs>
                  {/* Loss Gradient Fill */}
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#BF616A" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#BF616A" stopOpacity="0" />
                  </linearGradient>
                  {/* Accuracy Gradient Fill */}
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8FBCBB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8FBCBB" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={graphWidth - paddingX} y2={paddingY} stroke="#1E293B" strokeDasharray="4 4" />
                <line x1={paddingX} y1={graphHeight / 2} x2={graphWidth - paddingX} y2={graphHeight / 2} stroke="#1E293B" strokeDasharray="4 4" />
                <line x1={paddingX} y1={graphHeight - paddingY} x2={graphWidth - paddingX} y2={graphHeight - paddingY} stroke="#1E293B" strokeDasharray="4 4" />

                {/* X-Axis Epoch Labels */}
                <text x={paddingX} y={graphHeight - 5} fill="#64748B" fontSize="14" fontFamily={jetBrainsMonoFontFamily}>Ep 0</text>
                <text x={paddingX + usableWidth * 0.25} y={graphHeight - 5} fill="#64748B" fontSize="14" fontFamily={jetBrainsMonoFontFamily}>Ep 5</text>
                <text x={paddingX + usableWidth * 0.5} y={graphHeight - 5} fill="#64748B" fontSize="14" fontFamily={jetBrainsMonoFontFamily}>Ep 10</text>
                <text x={paddingX + usableWidth * 0.75} y={graphHeight - 5} fill="#64748B" fontSize="14" fontFamily={jetBrainsMonoFontFamily}>Ep 15</text>
                <text x={graphWidth - paddingX - 35} y={graphHeight - 5} fill="#64748B" fontSize="14" fontFamily={jetBrainsMonoFontFamily}>Ep 20</text>

                {/* 1. Accuracy Growth Path (Blue) */}
                <path
                  d={accPathString}
                  fill="none"
                  stroke="#8FBCBB"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={dashOffset}
                />

                {/* 2. Loss Decay Path (Red) */}
                <path
                  d={lossPathString}
                  fill="none"
                  stroke="#BF616A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={dashOffset}
                />

                {/* Live Active Tip Dots */}
                {frame >= startFrame && (
                  <>
                    {/* Loss Active Point Dot */}
                    <circle
                      cx={currentTipX}
                      cy={currentTipYLoss}
                      r="7"
                      fill="#BF616A"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    {/* Accuracy Active Point Dot */}
                    <circle
                      cx={currentTipX}
                      cy={currentTipYAcc}
                      r="7"
                      fill="#8FBCBB"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};
