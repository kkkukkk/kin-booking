'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Button from '@/components/base/Button';
import { createPortal } from 'react-dom';
import AnimatedText from "@/components/base/AnimatedText";
import { tabs } from '@/types/ui/motionVariants';

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
  onComplete: () => void;
}

const TutorialOverlay = ({ 
  steps, 
  isOpen, 
  onComplete, 
}: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

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

  useEffect(() => {
    function updateRect() {
      if (targetElement) {
        setHighlightRect(targetElement.getBoundingClientRect());
      } else {
        setHighlightRect(null);
      }
    }
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => {
      window.removeEventListener('resize', updateRect);
    };
  }, [targetElement]);

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

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/50"
      >
        {/* 타겟 요소 하이라이트 */}
        {highlightRect && currentStepData.target !== 'body' && (
          <div
            className="absolute border-2 border-white/60 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
            style={{
              top: highlightRect.top - 4,
              left: highlightRect.left - 4,
              width: highlightRect.width + 8,
              height: highlightRect.height + 8,
            }}
          />
        )}

        {/* 말풍선 */}
        <motion.div
          key={currentStep}
          ref={tooltipRef}
          variants={tabs}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded-lg shadow-lg p-4 md:p-6 max-w-xs md:max-w-xl w-[90vw] md:w-[28rem]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 제목 */}
          {currentStepData.title && (
            <h3 className="font-bold text-base mb-5 text-gray-800 text-center">
              {currentStepData.title}
            </h3>
          )}

          {/* 메시지 */}
          <div className="my-4">
            {(() => {
              let accDelay = 0.2;
              return (currentStepData.message ?? "").split('\n').map((line, idx, arr) => {
                const delay = accDelay;
                accDelay += line.length * 0.05;
                return (
                  <AnimatedText
                    key={currentStep + '-' + idx}
                    text={line}
                    fontSize="text-sm md:text-base"
                    delay={delay}
                  />
                );
              });
            })()}
          </div>

          {/* 버튼들 */}
          <div className="flex items-center justify-end">
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
          </div>

          {/* 진행 표시 */}
          <div className="flex justify-center">
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
    </AnimatePresence>,
    document.body
  );
};

export default TutorialOverlay; 