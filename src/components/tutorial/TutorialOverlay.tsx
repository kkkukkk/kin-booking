'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Button from '@/components/base/Button';

export interface TutorialStep {
  id: string;
  target: string; // CSS 선택자
  message: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  title?: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onDontShowAgain: () => void;
}

const TutorialOverlay = ({ 
  steps, 
  isOpen, 
  onClose, 
  onComplete, 
  onDontShowAgain 
}: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // 현재 단계의 타겟 요소 찾기
  useEffect(() => {
    if (isOpen && currentStepData) {
      const element = document.querySelector(currentStepData.target) as HTMLElement;
      setTargetElement(element);
    }
  }, [isOpen, currentStep, currentStepData]);

  // 툴팁 위치 계산
  const getTooltipPosition = () => {
    if (!targetElement || !tooltipRef.current) return { top: 0, left: 0 };

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const positions = {
      'top': {
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      },
      'bottom': {
        top: targetRect.bottom + 10,
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2)
      },
      'left': {
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
        left: targetRect.left - tooltipRect.width - 10
      },
      'right': {
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2),
        left: targetRect.right + 10
      },
      'top-left': {
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.left
      },
      'top-right': {
        top: targetRect.top - tooltipRect.height - 10,
        left: targetRect.right - tooltipRect.width
      },
      'bottom-left': {
        top: targetRect.bottom + 10,
        left: targetRect.left
      },
      'bottom-right': {
        top: targetRect.bottom + 10,
        left: targetRect.right - tooltipRect.width
      }
    };

    return positions[currentStepData.position] || positions.bottom;
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    onClose();
  };

  const handleDontShowAgain = () => {
    onDontShowAgain();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/70"
        onClick={handleClose}
      >
        {/* 타겟 요소 하이라이트 */}
        {targetElement && (
          <div
            className="absolute border-2 border-white/50 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
            style={{
              top: targetElement.offsetTop - 4,
              left: targetElement.offsetLeft - 4,
              width: targetElement.offsetWidth + 8,
              height: targetElement.offsetHeight + 8,
            }}
          />
        )}

        {/* 말풍선 */}
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-white rounded-lg shadow-lg p-4 max-w-sm"
          style={getTooltipPosition()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 제목 */}
          {currentStepData.title && (
            <h3 className="font-bold text-lg mb-2 text-gray-800">
              {currentStepData.title}
            </h3>
          )}

          {/* 메시지 */}
          <p className="text-gray-700 mb-4">
            {currentStepData.message}
          </p>

          {/* 버튼들 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {/* 이전 버튼 */}
              {!isFirstStep && (
                <Button
                  onClick={handlePrev}
                  theme="dark"
                  fontSize="text-xs"
                  padding="px-3 py-1"
                >
                  이전
                </Button>
              )}

              {/* 다음/완료 버튼 */}
              <Button
                onClick={handleNext}
                theme="dark"
                fontSize="text-xs"
                padding="px-3 py-1"
              >
                {isLastStep ? '완료' : '다음'}
              </Button>
            </div>

            <div className="flex gap-2">
              {/* 다시 보지 않기 버튼 */}
              <Button
                onClick={handleDontShowAgain}
                theme="normal"
                fontSize="text-xs"
                padding="px-2 py-1"
                className="text-gray-500 hover:text-gray-700"
              >
                다시 보지 않기
              </Button>

              {/* 닫기 버튼 */}
              <Button
                onClick={handleClose}
                theme="normal"
                fontSize="text-xs"
                padding="px-2 py-1"
                className="text-gray-500 hover:text-gray-700"
              >
                닫기
              </Button>
            </div>
          </div>

          {/* 진행 표시 */}
          <div className="flex justify-center mt-3">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentStep 
                      ? "bg-blue-500" 
                      : "bg-gray-300"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay; 