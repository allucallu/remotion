import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PasswordStrengthCard, LabelTexts } from '../components/PasswordStrengthCard';

export interface PasswordStrengthMeterProps {
  steps?: Array<'weak' | 'fair' | 'strong' | 'very-strong'>;
  showInputField?: boolean;
  labelTexts?: LabelTexts;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  showInputField = true,
  labelTexts = {
    weak: 'Weak Password',
    fair: 'Fair Password',
    strong: 'Strong Password',
    veryStrong: 'Very Strong Password',
  },
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PasswordStrengthCard
        frame={frame}
        showInputField={showInputField}
        labelTexts={labelTexts}
      />
    </AbsoluteFill>
  );
};
