"use client";

import { useRef,  useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface KinAnimationSectionProps {
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const KinAnimationSection = ({ scrollContainerRef }: KinAnimationSectionProps = {}) => {
    const kinSectionRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
  
    // 디버깅용 ref 확인
    useEffect(() => {
      console.log("KIN Section Ref:", kinSectionRef.current);
    }, []);

    // KIN 스크롤 인터랙션 - 컨테이너 스크롤 사용
    const { scrollYProgress } = useScroll({
      container: scrollContainerRef,
      target: kinSectionRef,
      offset: ["start start", "end end"],
      layoutEffect: false
    });

  // 애니메이션 활성화 상태
  const isAnimationActive = scrollProgress > 0 && scrollProgress < 1.0;
  
  // 실시간 스크롤 진행도 업데이트
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  // K 글자 애니메이션
  const kOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const kY = useTransform(scrollYProgress, [0, 0.12], [50, 0]);
  const kX = useTransform(scrollYProgress, [0, 0.7], [0, -60]); // 최종 KIN 위치로 이동
  const kEnglishOpacity = useTransform(scrollYProgress, [0.12, 0.16, 0.28, 0.32], [0, 1, 1, 0]);
  const kEnglishY = useTransform(scrollYProgress, [0.12, 0.16, 0.28, 0.32], [30, 0, 0, -30]);
  const kKoreanOpacity = useTransform(scrollYProgress, [0.16, 0.2, 0.26, 0.3], [0, 1, 1, 0]);
  const kKoreanY = useTransform(scrollYProgress, [0.16, 0.2, 0.26, 0.3], [30, 0, 0, -30]);

  // I 글자 애니메이션
  const iOpacity = useTransform(scrollYProgress, [0.32, 0.44], [0, 1]);
  const iY = useTransform(scrollYProgress, [0.32, 0.44], [50, 0]);
  const iX = useTransform(scrollYProgress, [0.32, 0.7], [0, 0]); // 최종 KIN 위치로 이동
  const iEnglishOpacity = useTransform(scrollYProgress, [0.44, 0.48, 0.6, 0.64], [0, 1, 1, 0]);
  const iEnglishY = useTransform(scrollYProgress, [0.44, 0.48, 0.6, 0.64], [30, 0, 0, -30]);
  const iKoreanOpacity = useTransform(scrollYProgress, [0.48, 0.52, 0.58, 0.62], [0, 1, 1, 0]);
  const iKoreanY = useTransform(scrollYProgress, [0.48, 0.52, 0.58, 0.62], [30, 0, 0, -30]);

  // N 글자 애니메이션
  const nOpacity = useTransform(scrollYProgress, [0.64, 0.76], [0, 1]);
  const nY = useTransform(scrollYProgress, [0.64, 0.76], [50, 0]);
  const nX = useTransform(scrollYProgress, [0.64, 0.7], [0, 60]); // 최종 KIN 위치로 이동
  const nEnglishOpacity = useTransform(scrollYProgress, [0.76, 0.8, 0.92, 0.96], [0, 1, 1, 0]);
  const nEnglishY = useTransform(scrollYProgress, [0.76, 0.8, 0.92, 0.96], [30, 0, 0, -30]);
  const nKoreanOpacity = useTransform(scrollYProgress, [0.8, 0.84, 0.9, 0.94], [0, 1, 1, 0]);
  const nKoreanY = useTransform(scrollYProgress, [0.8, 0.84, 0.9, 0.94], [30, 0, 0, -30]);

  return (
    <div 
      className="relative h-[300vh] flex items-center justify-center" 
      ref={kinSectionRef}
      data-kin-section
      style={{ position: 'relative' }}
    >
      
      {/* KIN 이니셜 라인 */}
      <div className={`${isAnimationActive ? 'fixed inset-0' : 'relative'} flex items-center justify-center ${isAnimationActive ? 'pointer-events-none' : ''}`}>
            {/* K */}
            <motion.div
            className="absolute text-center"
            style={{
                opacity: kOpacity,
                y: kY,
                x: kX,
            }}
            >
            <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-white mb-6">K</h3>
            <motion.div
                className="space-y-2"
                style={{
                opacity: kEnglishOpacity,
                y: kEnglishY,
                }}
            >
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Keep the bond
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                that started in our university days
                </p>
            </motion.div>
            <motion.p 
                className="text-sm md:text-base text-white/60 leading-relaxed max-w-xs mt-4"
                style={{
                opacity: kKoreanOpacity,
                y: kKoreanY,
                }}
            >
                대학 시절 시작된 우리의 유대를 유지해요
            </motion.p>
            </motion.div>

            {/* I */}
            <motion.div 
            className="absolute text-center"
            style={{
                opacity: iOpacity,
                y: iY,
                x: iX,
            }}
            >
            <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-white mb-6">I</h3>
            <motion.div
                className="space-y-2"
                style={{
                opacity: iEnglishOpacity,
                y: iEnglishY,
                }}
            >
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Invite you to share
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                our musical journey
                </p>
            </motion.div>
            <motion.p 
                className="text-sm md:text-base text-white/60 leading-relaxed max-w-xs mt-4"
                style={{
                opacity: iKoreanOpacity,
                y: iKoreanY,
                }}
            >
                저희의 음악 여정에 당신을 초대합니다
            </motion.p>
            </motion.div>

            {/* N */}
            <motion.div 
            className="absolute text-center"
            style={{
                opacity: nOpacity,
                y: nY,
                x: nX,
            }}
            >
            <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-white mb-6">N</h3>
            <motion.div
                className="space-y-2"
                style={{
                opacity: nEnglishOpacity,
                y: nEnglishY,
                }}
            >
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xs">
                Now let's become
                </p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-xs">
                one big family through music
                </p>
            </motion.div>
            <motion.p 
                className="text-sm md:text-base text-white/60 leading-relaxed max-w-xs mt-4"
                style={{
                opacity: nKoreanOpacity,
                y: nKoreanY,
                }}
            >
                이제 음악으로 하나의 큰 가족이 되어요
            </motion.p>
            </motion.div>
        </div>
    </div>
  );
};

export default KinAnimationSection; 