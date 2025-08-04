import { useContext, useEffect } from 'react';
import { SpinnerContext } from '@/providers/SpinnerProvider';

export const useSpinner = () => {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('useSpinner must be used within a SpinnerProvider');
  }
  return context;
};

export const useSpinnerLoading = (isLoading: boolean, withBackgroundImage?: boolean) => {
  const { showSpinner, hideSpinner } = useSpinner();

  useEffect(() => {
    if (isLoading) {
      showSpinner(withBackgroundImage);
    } else {
      hideSpinner();
    }
  }, [isLoading, showSpinner, hideSpinner, withBackgroundImage]);
}; 