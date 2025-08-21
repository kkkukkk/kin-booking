'use client'

import ProgressBar from '@/components/base/ProgressBar';
import { Theme } from '@/types/ui/theme';

interface TransferProgressProps {
  currentStep: 'friend' | 'count' | 'confirm';
  theme: Theme;
}

const TransferProgress = ({ currentStep, theme }: TransferProgressProps) => {
  const steps = ['친구 선택', '매수 선택', '확인'];

  const getCurrentStepIndex = () => {
    switch (currentStep) {
      case 'friend': return 0;
      case 'count': return 1;
      case 'confirm': return 2;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <>
      <ProgressBar
        steps={steps}
        currentStep={currentStepIndex}
        theme={theme}
      />
    </>
  );
};

export default TransferProgress;
