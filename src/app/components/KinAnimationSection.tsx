"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface KinAnimationSectionProps {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const KinAnimationSection = ({ scrollContainerRef }: KinAnimationSectionProps = {}) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // useScroll을 사용하여 MotionValue로 scrollYProgress 생성
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef?.current ? scrollContainerRef : undefined,
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 애니메이션 완료 상태 감지
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsAnimationCompleted(latest >= 0.95);
  });

  // 반응형 위치 상수
  const K_START_X = isDesktop ? -80 : -60;
  const K_FINAL_X = isDesktop ? -40 : -18;
  const N_START_X = isDesktop ? 30 : 20;
  const N_MID_X = isDesktop ? 60 : 45;
  const N_FINAL_X = isDesktop ? 14 : -7;

  // 전체 애니메이션 단계 정의
  // 0 ~ 0.3: K 애니메이션
  // 0.3 ~ 0.6: I 애니메이션
  // 0.6 ~ 0.9: N 애니메이션
  // 0.9 ~ 0.99: 모임 애니메이션
  // 0.99 ~ 1.0: z-index, opacity 변환

  // KIN 애니메이션 (0 ~ 0.67 구간)
  const kOpacity = useTransform(scrollYProgress, [0, 0.07, 1.0], [0, 1, 1]);
  const kY = useTransform(scrollYProgress, [0, 0.07, 1.0], [40, 0, 0]);
  const kX = useTransform(scrollYProgress, [0, 0.9, 0.95, 1.0], [K_START_X, K_START_X, K_FINAL_X, K_FINAL_X]);
  const kEnglishOpacity = useTransform(scrollYProgress, [0.07, 0.1, 0.26, 0.29, 1.0], [0, 1, 1, 0, 0]);
  const kEnglishY = useTransform(scrollYProgress, [0.07, 0.1, 0.26, 0.29, 1.0], [30, 0, 0, -30, -30]);
  const kKoreanOpacity = useTransform(scrollYProgress, [0.1, 0.13, 0.22, 0.25, 1.0], [0, 1, 1, 0, 0]);
  const kKoreanY = useTransform(scrollYProgress, [0.1, 0.13, 0.22, 0.25, 1.0], [30, 0, 0, -30, -30]);

  const iOpacity = useTransform(scrollYProgress, [0.3, 0.37, 1.0], [0, 1, 1]);
  const iY = useTransform(scrollYProgress, [0.3, 0.37, 1.0], [40, 0, 0]);
  const iX = useTransform(scrollYProgress, [0.3, 1.0], [0, 0]);
  const iEnglishOpacity = useTransform(scrollYProgress, [0.32, 0.35, 0.56, 0.59, 1.0], [0, 1, 1, 0, 0]);
  const iEnglishY = useTransform(scrollYProgress, [0.32, 0.35, 0.56, 0.59, 1.0], [30, 0, 0, -30, -30]);
  const iKoreanOpacity = useTransform(scrollYProgress, [0.35, 0.38, 0.52, 0.55, 1.0], [0, 1, 1, 0, 0]);
  const iKoreanY = useTransform(scrollYProgress, [0.35, 0.38, 0.52, 0.55, 1.0], [30, 0, 0, -30, -30]);

  const nOpacity = useTransform(scrollYProgress, [0.6, 0.67, 1.0], [0, 1, 1]);
  const nY = useTransform(scrollYProgress, [0.6, 0.67, 1.0], [40, 0, 0]);
  const nX = useTransform(scrollYProgress, [0.6, 0.7, 0.9, 0.95, 1.0], [N_START_X, N_MID_X, N_MID_X, N_FINAL_X, N_FINAL_X]);
  const nEnglishOpacity = useTransform(scrollYProgress, [0.62, 0.65, 0.86, 0.89, 1.0], [0, 1, 1, 0, 0]);
  const nEnglishY = useTransform(scrollYProgress, [0.62, 0.65, 0.86, 0.89, 1.0], [30, 0, 0, -30, -30]);
  const nKoreanOpacity = useTransform(scrollYProgress, [0.65, 0.68, 0.82, 0.85, 1.0], [0, 1, 1, 0, 0]);
  const nKoreanY = useTransform(scrollYProgress, [0.65, 0.68, 0.82, 0.85, 1.0], [30, 0, 0, -30, -30]);

  return (
    <div className="relative h-[600vh]" ref={containerRef} data-scroll-container="true">
      {/* 고정 영역 */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none transition-all duration-500"
        style={{
          zIndex: isAnimationCompleted ? 0 : 10,
          opacity: isAnimationCompleted ? 0.2 : 1,
        }}
      >
        <div className="flex items-center justify-center">
          {/* K */}
          <motion.div
            className="absolute flex flex-col items-start text-left justify-start"
            style={{
              opacity: kOpacity,
              y: kY,
              x: kX,
            }}
          >
            <Image
              src="/images/logo_dark_K.webp"
              alt="K"
              width={100}
              height={100}
              className="w-24 md:w-32 h-auto mb-6"
            />
            <motion.div
              className="mb-2"
              style={{
                opacity: kEnglishOpacity,
                y: kEnglishY,
              }}
            >
              <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Keep on looking!
              </p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                something amazing awaits you
              </p>
            </motion.div>
            <motion.div
              style={{
                opacity: kKoreanOpacity,
                y: kKoreanY,
              }}
            >
              <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-xs">
                눈을 떼지 말아요!
              </p>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xs">
                놀라운 순간이 기다리고 있어요.
              </p>
            </motion.div>
          </motion.div>

          {/* I */}
          <motion.div
            className="absolute flex flex-col items-center text-center justify-start"
            style={{
              opacity: iOpacity,
              y: iY,
              x: iX,
            }}
          >
            <Image
              src="/images/logo_dark_I.webp"
              alt="I"
              width={100}
              height={100}
              className="w-24 md:w-32 h-auto mb-6"
            />
            <motion.div
              className="mb-2"
              style={{
                opacity: iEnglishOpacity,
                y: iEnglishY,
              }}
            >
              <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Inviting you
              </p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                to experience a day like no other
              </p>
            </motion.div>
            <motion.div
              style={{
                opacity: iKoreanOpacity,
                y: iKoreanY,
              }}
            >
              <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-xs">
                잊지 못할 특별한 하루에
              </p>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xs">
                당신을 초대할게요!
              </p>
            </motion.div>
          </motion.div>

          {/* N */}
          <motion.div
            className="absolute flex flex-col items-end text-right justify-start"
            style={{
              opacity: nOpacity,
              y: nY,
              x: nX,
            }}
          >
            <Image
              src="/images/logo_dark_N.webp"
              alt="N"
              width={100}
              height={100}
              className="w-24 md:w-32 h-auto mb-6"
            />
            <motion.div
              className="mb-2"
              style={{
                opacity: nEnglishOpacity,
                y: nEnglishY,
              }}
            >
              <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Now,
              </p>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                please be a part of our musical journey
              </p>
            </motion.div>
            <motion.div
              style={{
                opacity: nKoreanOpacity,
                y: nKoreanY,
              }}
            >
              <p className="text-sm md:text-base text-white/90 font-medium leading-relaxed max-w-xs">
                이제,
              </p>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-xs">
                저희의 음악 여정에 함께해주세요!
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 스크롤 기준점 */}
      <div
        id="kin-animation-end-marker"
        className="absolute left-1/2 transform -translate-x-1/2 w-1 h-1 opacity-0"
        style={{
          pointerEvents: 'none',
          top: '600vh'
        }}
      />
    </div>
  );
};

export default KinAnimationSection; 