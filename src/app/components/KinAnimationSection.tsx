"use client";

import { useRef,  useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import KinStaticContent from "./KinStaticContent";
import KinRotationContent from "./KinRotationContent";

interface KinAnimationSectionProps {
    scrollContainerRef?: React.RefObject<HTMLDivElement | null> | undefined;
}

const KinAnimationSection = ({ scrollContainerRef }: KinAnimationSectionProps = {}) => {
    const kinSectionRef = useRef<HTMLDivElement>(null);
    const rotationSectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [rotationProgress, setRotationProgress] = useState(0);
  
    // 디버깅용 ref 확인
    useEffect(() => {
      console.log("KIN Section Ref:", kinSectionRef.current);
      console.log("Rotation Section Ref:", rotationSectionRef.current);
    }, []);

    // 기존 KIN 스크롤 인터랙션 (0 ~ 1.0 = 0 ~ 400vh)
    const { scrollYProgress } = useScroll({
      container: scrollContainerRef?.current ? scrollContainerRef : undefined,
      target: kinSectionRef,
      offset: ["start start", "end end"],
      layoutEffect: false,
    });

    // 새로운 회전 스크롤 인터랙션 (400 ~ 600vh)
    const { scrollYProgress: rotationScrollYProgress } = useScroll({
      container: scrollContainerRef?.current ? scrollContainerRef : undefined,
      target: rotationSectionRef,
      offset: ["start start", "end end"],
      layoutEffect: false,
    });

    // 애니메이션 활성화 상태
    const isAnimationActive = scrollProgress > 0 && scrollProgress < 1.0;
    const isRotationActive = rotationProgress > 0 && rotationProgress < 1.0;
    
    // 기존 애니메이션이 완료되었지만 회전 애니메이션이 아직 시작되지 않은 상태
    const isAnimationCompleted = scrollProgress >= 1.0 && rotationProgress === 0;
    
    // fixed가 유지되는 조건: 기존 애니메이션이나 회전 애니메이션이 활성화되어 있을 때, 또는 기존 애니메이션이 완료된 상태
    const isFixedActive = isAnimationActive || isRotationActive || isAnimationCompleted;
    
    // 실시간 스크롤 진행도 업데이트
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      setScrollProgress(latest);
    });

    useMotionValueEvent(rotationScrollYProgress, "change", (latest) => {
      setRotationProgress(latest);
    });

    // 기존 애니메이션 구간 (0 ~ 1.0 = 0 ~ 400vh)
    const isOriginalAnimation = scrollProgress > 0 && scrollProgress < 1.0;

    // K 글자 애니메이션 (0 ~ 0.33 구간)
    const kOpacity = useTransform(scrollYProgress, [0, 0.1, 1.0], [0, 1, 1]);
    const kY = useTransform(scrollYProgress, [0, 0.1, 1.0], [40, 0, 0]);
    const kX = useTransform(scrollYProgress, [0, 0.15, 1.0], [0, -60, -60]);
    const kEnglishOpacity = useTransform(scrollYProgress, [0.1, 0.15, 0.28, 0.32, 1.0], [0, 1, 1, 0, 0]); // 0.13 구간 유지
    const kEnglishY = useTransform(scrollYProgress, [0.1, 0.15, 0.28, 0.32, 1.0], [30, 0, 0, -30, -30]);
    const kKoreanOpacity = useTransform(scrollYProgress, [0.15, 0.2, 0.25, 0.29, 1.0], [0, 1, 1, 0, 0]); // 0.10 구간 유지
    const kKoreanY = useTransform(scrollYProgress, [0.15, 0.2, 0.25, 0.29, 1.0], [30, 0, 0, -30, -30]);

    // I 글자 애니메이션 (0.33 ~ 0.66 구간)
    const iOpacity = useTransform(scrollYProgress, [0.33, 0.43, 1.0], [0, 1, 1]);
    const iY = useTransform(scrollYProgress, [0.33, 0.43, 1.0], [50, 0, 0]);
    const iX = useTransform(scrollYProgress, [0.33, 0.48, 1.0], [0, 0, 0]);
    const iEnglishOpacity = useTransform(scrollYProgress, [0.43, 0.48, 0.61, 0.65, 1.0], [0, 1, 1, 0, 0]); // 0.13 구간 유지
    const iEnglishY = useTransform(scrollYProgress, [0.43, 0.48, 0.61, 0.65, 1.0], [30, 0, 0, -30, -30]);
    const iKoreanOpacity = useTransform(scrollYProgress, [0.48, 0.53, 0.58, 0.62, 1.0], [0, 1, 1, 0, 0]); // 0.10 구간 유지
    const iKoreanY = useTransform(scrollYProgress, [0.48, 0.53, 0.58, 0.62, 1.0], [30, 0, 0, -30, -30]);

    // N 글자 애니메이션 (0.66 ~ 1.0 구간)
    const nOpacity = useTransform(scrollYProgress, [0.66, 0.76, 1.0], [0, 1, 1]);
    const nY = useTransform(scrollYProgress, [0.66, 0.76, 1.0], [40, 0, 0]);
    const nX = useTransform(scrollYProgress, [0.66, 0.81, 1.0], [20, 60, 60]);
    const nEnglishOpacity = useTransform(scrollYProgress, [0.76, 0.81, 0.94, 0.98, 1.0], [0, 1, 1, 0, 0]); // 0.13 구간 유지
    const nEnglishY = useTransform(scrollYProgress, [0.76, 0.81, 0.94, 0.98, 1.0], [30, 0, 0, -30, -30]);
    const nKoreanOpacity = useTransform(scrollYProgress, [0.81, 0.86, 0.91, 0.95, 1.0], [0, 1, 1, 0, 0]); // 0.10 구간 유지
    const nKoreanY = useTransform(scrollYProgress, [0.81, 0.86, 0.91, 0.95, 1.0], [30, 0, 0, -30, -30]);

    return (
      <div className="relative">
        {/* 1. 기존 애니메이션 섹션 (0 ~ 400vh) */}
        <div 
          className="relative h-[400vh]" 
          ref={kinSectionRef}
          data-kin-section
          style={{ position: 'relative' }}
        >
          {/* 고정 애니메이션 영역 */}
          {(isAnimationActive || isAnimationCompleted) && (
            <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="flex items-center justify-center">
                {/* K */}
                <motion.div
                  className="absolute flex flex-col items-start"
                  style={{
                    opacity: kOpacity,
                    y: kY,
                    x: kX,
                  }}
                >
                  <Image
                    src="/images/logo_dark_K.webp"
                    alt="K"
                    width={120}
                    height={120}
                    className="w-24 md:w-32 h-auto mb-6"
                  />
                  <motion.div
                    className={"mb-2"}
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
                  className="absolute flex flex-col items-center"
                  style={{
                    opacity: iOpacity,
                    y: iY,
                    x: iX,
                  }}
                >
                  <Image
                    src="/images/logo_dark_I.webp"
                    alt="I"
                    width={120}
                    height={120}
                    className="w-24 md:w-32 h-auto mb-6"
                  />
                  <motion.div
                    className={"mb-2"}
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
                  className="absolute flex flex-col items-end"
                  style={{
                    opacity: nOpacity,
                    y: nY,
                    x: nX,
                  }}
                >
                  <Image
                    src="/images/logo_dark_N.webp"
                    alt="N"
                    width={120}
                    height={120}
                    className="w-24 md:w-32 h-auto mb-6"
                  />
                  <motion.div
                    className={"mb-2"}
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
          )}
        </div>

        {/* 2. 회전 애니메이션 섹션 (400 ~ 600vh) */}
        <div 
          className="relative h-[200vh]" 
          ref={rotationSectionRef}
          data-rotation-section
          style={{ position: 'relative' }}
        >
          {/* 고정 회전 애니메이션 영역 */}
          {isRotationActive && (
            <div className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none">
              <KinRotationContent scrollYProgress={rotationScrollYProgress} />
            </div>
          )}
        </div>

        {/* 3. 정적 컨텐츠 섹션 (600vh 이후) - sticky로 이어받기 */}
        {!isFixedActive && (
          <div className="sticky top-0 h-screen flex items-center justify-center z-0">
            <KinStaticContent />
          </div>
        )}
        
        {/* 스크롤 기준점 - 100% 지점 (완전히 끝난 지점) */}
        <div 
          id="kin-animation-end-marker"
          className="absolute left-1/2 transform -translate-x-1/2 w-1 h-1 opacity-0"
          style={{ 
            pointerEvents: 'none',
            top: '600vh' // 100% 지점 (완전히 끝난 지점)
          }}
        />
      </div>
    );
  };

export default KinAnimationSection; 