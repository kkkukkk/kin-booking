"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import clsx from "clsx";

interface KinAnimationSectionProps {
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const KinAnimationSection = ({ scrollContainerRef }: KinAnimationSectionProps) => {
  const kinSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: kinSectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  const kOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const kY = useTransform(scrollYProgress, [0, 0.08], [50, 0]);
  const kEnglishOpacity = useTransform(scrollYProgress, [0.08, 0.12, 0.16, 0.2], [0, 1, 1, 0]);
  const kEnglishY = useTransform(scrollYProgress, [0.08, 0.12, 0.16, 0.2], [30, 0, 0, -30]);
  const kKoreanOpacity = useTransform(scrollYProgress, [0.12, 0.16, 0.2, 0.24], [0, 1, 1, 0]);
  const kKoreanY = useTransform(scrollYProgress, [0.12, 0.16, 0.2, 0.24], [30, 0, 0, -30]);

  const iOpacity = useTransform(scrollYProgress, [0.24, 0.32], [0, 1]);
  const iY = useTransform(scrollYProgress, [0.24, 0.32], [50, 0]);
  const iEnglishOpacity = useTransform(scrollYProgress, [0.32, 0.36, 0.4, 0.44], [0, 1, 1, 0]);
  const iEnglishY = useTransform(scrollYProgress, [0.32, 0.36, 0.4, 0.44], [30, 0, 0, -30]);
  const iKoreanOpacity = useTransform(scrollYProgress, [0.36, 0.4, 0.44, 0.48], [0, 1, 1, 0]);
  const iKoreanY = useTransform(scrollYProgress, [0.36, 0.4, 0.44, 0.48], [30, 0, 0, -30]);

  const nOpacity = useTransform(scrollYProgress, [0.48, 0.56], [0, 1]);
  const nY = useTransform(scrollYProgress, [0.48, 0.56], [50, 0]);
  const nEnglishOpacity = useTransform(scrollYProgress, [0.56, 0.6, 0.64, 0.68], [0, 1, 1, 0]);
  const nEnglishY = useTransform(scrollYProgress, [0.56, 0.6, 0.64, 0.68], [30, 0, 0, -30]);
  const nKoreanOpacity = useTransform(scrollYProgress, [0.6, 0.64, 0.68, 0.72], [0, 1, 1, 0]);
  const nKoreanY = useTransform(scrollYProgress, [0.6, 0.64, 0.68, 0.72], [30, 0, 0, -30]);

  return (
    <div
      ref={kinSectionRef}
      className={clsx("relative h-[400vh] bg-gray-100 flex items-center justify-center")}
    >
      <div className="fixed top-4 right-4 z-50 bg-black text-white p-2 rounded text-sm">
        {Math.round(scrollProgress * 100)}%
      </div>

      <div className="flex items-center justify-center space-x-16 md:space-x-24">
        {/* 각 글자: K */}
        <motion.div className="text-center" style={{ opacity: kOpacity, y: kY }}>
          <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-black mb-6">K</h3>
          <motion.div className="space-y-2" style={{ opacity: kEnglishOpacity, y: kEnglishY }}>
            <p className="text-lg md:text-xl text-black font-medium leading-relaxed max-w-xs">
              Keep the bond
            </p>
            <p className="text-sm md:text-base text-black/70 leading-relaxed max-w-xs">
              that started in our university days
            </p>
          </motion.div>
          <motion.p
            className="text-sm md:text-base text-black/50 leading-relaxed max-w-xs mt-4"
            style={{ opacity: kKoreanOpacity, y: kKoreanY }}
          >
            대학 시절 시작된 우리의 유대를 유지해요
          </motion.p>
        </motion.div>

        {/* I */}
        <motion.div className="text-center" style={{ opacity: iOpacity, y: iY }}>
          <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-black mb-6">I</h3>
          <motion.div className="space-y-2" style={{ opacity: iEnglishOpacity, y: iEnglishY }}>
            <p className="text-lg md:text-xl text-black font-medium leading-relaxed max-w-xs">
              Invite you to share
            </p>
            <p className="text-sm md:text-base text-black/70 leading-relaxed max-w-xs">
              our musical journey
            </p>
          </motion.div>
          <motion.p
            className="text-sm md:text-base text-black/50 leading-relaxed max-w-xs mt-4"
            style={{ opacity: iKoreanOpacity, y: iKoreanY }}
          >
            저희의 음악 여정에 당신을 초대합니다
          </motion.p>
        </motion.div>

        {/* N */}
        <motion.div className="text-center" style={{ opacity: nOpacity, y: nY }}>
          <h3 className="text-6xl md:text-8xl font-bold tracking-wide text-black mb-6">N</h3>
          <motion.div className="space-y-2" style={{ opacity: nEnglishOpacity, y: nEnglishY }}>
            <p className="text-lg md:text-xl text-black font-medium leading-relaxed max-w-xs">
              Now let's become
            </p>
            <p className="text-sm md:text-base text-black/70 leading-relaxed max-w-xs">
              one big family through music
            </p>
          </motion.div>
          <motion.p
            className="text-sm md:text-base text-black/50 leading-relaxed max-w-xs mt-4"
            style={{ opacity: nKoreanOpacity, y: nKoreanY }}
          >
            이제 음악으로 하나의 큰 가족이 되어요
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default KinAnimationSection;