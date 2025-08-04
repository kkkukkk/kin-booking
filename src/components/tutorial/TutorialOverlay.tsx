'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import AnimatedText from "@/components/base/AnimatedText";
import { tabs } from '@/types/ui/motionVariants';

export interface TutorialStep {
  id: string;
  target: string;
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
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xs md:max-w-xl w-[90vw] md:w-[28rem]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded border border-white/10 shadow-2xl" />

            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />
            
            {/* 메인 컨텐츠 */}
            <div className="relative px-6 py-4">
              {currentStepData.title && (
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-white text-center drop-shadow-sm">
                    {currentStepData.title}
                  </h3>
                  <div className="mt-3 h-px bg-white/20 rounded-full" />
                </div>
              )}

              <div className="my-6 flex flex-col gap-2">
                {(() => {
                  let accDelay = 0.2;
                  return (currentStepData.message ?? "").split('\n').map((line, idx, arr) => {
                    const delay = accDelay;
                    accDelay += line.length * 0.05;
                    return (
                      <div key={currentStep + '-' + idx} className="text-white/90 drop-shadow-sm">
                        <AnimatedText
                          text={line}
                          fontSize="text-sm md:text-base"
                          delay={delay}
                        />
                      </div>
                    );
                  });
                })()}
              </div>

              {/* 버튼들 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === currentStep 
                          ? "bg-white shadow-lg scale-110" 
                          : "bg-white/30"
                      )}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  {!isFirstStep && (
                    <button
                      onClick={handlePrev}
                      className="px-3 py-1 text-sm bg-white/20 text-white rounded transition-all duration-200 backdrop-blur-sm border border-white/30 cursor-pointer"
                    >
                      이전
                    </button>
                  )}

                  <button
                    onClick={handleNext}
                    className="px-3 py-1 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded transition-all duration-200 shadow-lg transform cursor-pointer"
                  >
                    {isLastStep ? '완료' : '다음'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default TutorialOverlay; 