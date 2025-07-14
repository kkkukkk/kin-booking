"use client";

import { motion, useTransform } from "framer-motion";
import Image from "next/image";

interface KinRotationContentProps {
  scrollYProgress: any;
}

const KinRotationContent = ({ scrollYProgress }: KinRotationContentProps) => {
  // 새로운 회전 애니메이션 (400 ~ 600vh 구간 = 0 ~ 1)
  // 0 ~ 0.1: 대기 (기존 애니메이션의 마지막 상태 유지)
  // 0.1 ~ 0.4: KIN 단어 모임
  // 0.4 ~ 0.7: 모인 상태 유지
  // 0.7 ~ 0.9: 90도 회전
  // 0.9 ~ 1.0: 유지 및 static 전환
  
  // 기존 애니메이션의 마지막 상태를 정확히 이어받기:
  // K: text-left + x(-60) + 설명 텍스트 (왼쪽 정렬)
  // I: text-center + x(0) + 설명 텍스트 (중앙 정렬)
  // N: text-right + x(60) + 설명 텍스트 (오른쪽 정렬)
  
  // 설명 텍스트 투명도 (회전 애니메이션에서는 숨김)
  const textOpacity = useTransform(scrollYProgress, [0, 0], [0, 0]); // 시작부터 바로 숨김
  
  // KIN 단어 모임 애니메이션 (0 ~ 0.4)
  // 기존 애니메이션의 마지막 위치에서 시작하여 I를 기준으로 모임
  const centerX = useTransform(scrollYProgress, [0, 0.4], [-60, 0]); // K: -60에서 0으로 (I 위치로)
  const centerX2 = useTransform(scrollYProgress, [0, 0.4], [0, 0]);   // I: 0에서 0으로 (기준점 유지)
  const centerX3 = useTransform(scrollYProgress, [0, 0.4], [60, 0]);  // N: 60에서 0으로 (I 위치로)
  
  // 모임 애니메이션 추가
  const gatheringScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.2]); // 모일 때 살짝 확대
  const gatheringOpacity = useTransform(scrollYProgress, [0, 1.0], [1, 1]); // 투명도 유지
  
  // 90도 회전 (0.7 ~ 0.9) - 각 글자를 개별적으로 회전하여 세로로 배치
  const letterRotation = useTransform(scrollYProgress, [0.7, 0.9], [0, 90]);

  return (
    <div className="flex items-center justify-center">
      {/* K - 기존: text-left + x(-60) + 설명 텍스트 */}
      <motion.div
        className="absolute flex flex-col items-start"
        style={{
          opacity: gatheringOpacity,
          x: centerX,
          y: 0,
          scale: gatheringScale,
        }}
      >
        {/* 글자만을 위한 회전 컨테이너 */}
        <motion.div
          style={{
            rotate: letterRotation,
            transformOrigin: "center center",
          }}
        >
          <Image
            src="/images/logo_dark_K.webp"
            alt="K"
            width={120}
            height={120}
            className="w-24 md:w-32 h-auto"
          />
        </motion.div>
        {/* 설명 텍스트는 회전하지 않음 */}
        <motion.div
          className="mb-2"
          style={{
            opacity: textOpacity,
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
            opacity: textOpacity,
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

      {/* I - 기존: text-center + x(0) + 설명 텍스트 */}
      <motion.div 
        className="absolute flex flex-col items-center"
        style={{
          opacity: gatheringOpacity,
          x: centerX2,
          y: 0,
          scale: gatheringScale,
        }}
      >
        {/* 글자만을 위한 회전 컨테이너 */}
        <motion.div
          style={{
            rotate: letterRotation,
            transformOrigin: "center center",
          }}
        >
          <Image
            src="/images/logo_dark_I.webp"
            alt="I"
            width={120}
            height={120}
            className="w-24 md:w-32 h-auto"
          />
        </motion.div>
        {/* 설명 텍스트는 회전하지 않음 */}
        <motion.div
          className="mb-2"
          style={{
            opacity: textOpacity,
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
            opacity: textOpacity,
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

      {/* N - 기존: text-right + x(60) + 설명 텍스트 */}
      <motion.div 
        className="absolute flex flex-col items-end"
        style={{
          opacity: gatheringOpacity,
          x: centerX3,
          y: 0,
          scale: gatheringScale,
        }}
      >
        {/* 글자만을 위한 회전 컨테이너 */}
        <motion.div
          style={{
            rotate: letterRotation,
            transformOrigin: "center center",
          }}
        >
          <Image
            src="/images/logo_dark_N.webp"
            alt="N"
            width={120}
            height={120}
            className="w-24 md:w-32 h-auto"
          />
        </motion.div>
        {/* 설명 텍스트는 회전하지 않음 */}
        <motion.div
          className="mb-2"
          style={{
            opacity: textOpacity,
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
            opacity: textOpacity,
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
  );
};

export default KinRotationContent; 