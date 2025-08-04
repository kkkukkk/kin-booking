import { useState, useEffect, useCallback } from 'react';

export const useTutorial = (key: string = 'tutorial-seen') => {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // 로컬 스토리지에서 튜토리얼 상태 확인
  useEffect(() => {
    const seen = localStorage.getItem(key);
    setHasSeenTutorial(seen === 'true');
  }, [key]);

  const openTutorial = useCallback(() => {
    setIsTutorialOpen(true);
  }, []);

  const closeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
  }, []);

  const completeTutorial = useCallback(() => {
    setIsTutorialOpen(false);
    localStorage.setItem(key, 'true');
    setHasSeenTutorial(true);
  }, [key]);

  const dontShowAgain = useCallback(() => {
    setIsTutorialOpen(false);
    localStorage.setItem(key, 'true');
    setHasSeenTutorial(true);
  }, [key]);

  const resetTutorial = useCallback(() => {
    localStorage.removeItem(key);
    setHasSeenTutorial(false);
  }, [key]);

  return {
    isTutorialOpen,
    hasSeenTutorial,
    openTutorial,
    closeTutorial,
    completeTutorial,
    dontShowAgain,
    resetTutorial,
  };
}; 