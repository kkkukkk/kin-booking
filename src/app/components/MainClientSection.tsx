"use client";

import React, { useEffect, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import Button from "@/components/base/Button";
import { useRouter } from "next/navigation";
import { useTutorial } from "@/hooks/useTutorial";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { mainPageTutorialSteps } from "@/data/tutorialSteps";
import { useEventsWithCurrentStatus } from "@/hooks/api/useEvents";
import { EventStatus } from "@/types/model/events";
import EventSection from "./EventSection";
import { useSpinner } from "@/hooks/useSpinner";
import { useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import ImageSlider from "@/components/slider/ImageSlider";
import { useLoginImages } from "@/hooks/api/useImages";
import KinAnimationSection from "@/components/KinAnimationSection";
import { ArrowDownIcon } from "@/components/icon/ArrowIcons";

const MainClientSection = () => {
  const { session } = useSession();
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const theme = useAppSelector(state => state.theme.current);
  const { data: images = [], isPending: imagePending } = useLoginImages();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 스크롤 컨테이너 찾기
  useEffect(() => {
    const findScrollContainer = () => {
      const container = document.querySelector('.flex-1.overflow-y-auto.scrollbar-none') as HTMLDivElement;
      if (container) {
        scrollContainerRef.current = container;
        console.log("Found scroll container:", container);
      }
    };

    // 컴포넌트 마운트 후 컨테이너 찾기
    const timer = setTimeout(findScrollContainer, 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    isTutorialOpen,
    hasSeenTutorial,
    openTutorial,
    completeTutorial,
  } = useTutorial("main-page-tutorial-seen");

  const params = {
    status: [EventStatus.Ongoing, EventStatus.Pending],
    page: undefined,
    size: undefined
  };
  const { data, isLoading, isFetching, error } = useEventsWithCurrentStatus(params);

  const openEvents = data?.data.filter((event) => event.status === EventStatus.Ongoing);
  const waitingEvents = data?.data.filter((event) => event.status === EventStatus.Pending);

  const prevIsFetching = useRef(false);

  useEffect(() => {
    if (!prevIsFetching.current && isFetching) {
      showSpinner();
    }
    if (prevIsFetching.current && !isFetching) {
      hideSpinner();
    }
    prevIsFetching.current = isFetching;
  }, [isFetching, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!hasSeenTutorial) {
      const timer = setTimeout(() => {
        openTutorial();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTutorial, openTutorial]);

  const handleExploreEvents = () => {
    router.push('/events');
  };

  const handleScrollToKinSection = () => {
    const container = scrollContainerRef.current;
    const kinSection = document.querySelector('[data-kin-section]') as HTMLElement;
    if (container && kinSection) {
      // KIN 애니메이션이 완전히 끝난 후까지 스크롤
      const scrollTop = kinSection.offsetTop + (kinSection.offsetHeight) - container.offsetHeight;
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-lg mb-2">정보를 불러오는 중...</div>
          <div className="text-sm text-gray-500">잠시만 기다려주세요</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-lg mb-2 text-red-500">정보를 불러올 수 없어요</div>
          <div className="text-sm text-gray-500 mb-4">잠시 후 다시 시도해주세요</div>
          <Button
            onClick={() => window.location.reload()}
            theme="dark"
            padding="px-4 py-2"
          >
            다시 시도
          </Button>
        </div>
      ) : (
        <>
          {/* 1. 이미지 슬라이더 (히어로 섹션) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 md:h-96 mb-4 overflow-hidden"
          >
            <ImageSlider
              images={images}
              width="w-full"
              height="h-full"
              interval={4000}
              priority={true}
              noRounded
            />
            {/* 슬라이더 위 오버레이 */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="flex flex-col justify-center items-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  KIN
                </h1>
                <p className="text-lg md:text-xl mb-8 font-light tracking-wide">
                  일상의 흐름 속 특별한 하루를 함께...
                </p>
                <Button
                  onClick={handleExploreEvents}
                  theme="dark"
                  padding="px-8 py-3"
                  className="text-lg font-medium tracking-wide"
                >
                  공연 둘러보기
                </Button>
              </div>
            </div>
          </motion.div>

          {/* 스크롤 안내 화살표 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ 
                y: [0, 8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              onClick={handleScrollToKinSection}
            >
              <ArrowDownIcon className="w-8 h-8" />
            </motion.div>
          </motion.div>

          {/* 2. KIN 스토리 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-4 relative"
          >
            {/* KIN 애니메이션 섹션 */}
            <KinAnimationSection scrollContainerRef={scrollContainerRef} />
          </motion.div>

          {/* 3. 현재 공연 현황 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-center mb-8 tracking-wide">현재 공연 현황</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className={`p-6 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white' 
                    : theme === 'neon'
                    ? 'bg-gradient-to-br from-gray-800 to-black text-green-400 border border-green-400'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'
                }`}
              >
                <div className="text-3xl font-bold mb-2">{openEvents?.length || 0}</div>
                <div className="text-sm font-medium tracking-wide">진행 중</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className={`p-6 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-600 to-gray-700 text-white' 
                    : theme === 'neon'
                    ? 'bg-gradient-to-br from-gray-800 to-black text-green-400 border border-green-400'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700'
                }`}
              >
                <div className="text-3xl font-bold mb-2">{waitingEvents?.length || 0}</div>
                <div className="text-sm font-medium tracking-wide">준비 중</div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className={`p-6 rounded-lg md:block hidden ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' 
                    : theme === 'neon'
                    ? 'bg-gradient-to-br from-gray-800 to-black text-green-400 border border-green-400'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                }`}
              >
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-sm font-medium tracking-wide">음악의 꿈</div>
              </motion.div>
            </div>
          </motion.div>

          {/* 4. 공연 포스터들 */}
          <EventSection title="지금 공연 중" events={openEvents} theme={theme} variant="large" />
          <EventSection title="곧 만나볼 공연" events={waitingEvents} theme={theme} variant="small" />
          
          {(!openEvents || openEvents.length === 0) && (!waitingEvents || waitingEvents.length === 0) && (
            <div className="text-center py-8">
              <div className="text-lg mb-2">현재 준비 중인 공연이 없어요</div>
              <div className="text-sm text-gray-500">곧 새로운 음악으로 찾아뵙겠습니다</div>
            </div>
          )}
        </>
      )}
      
      {/* 튜토리얼 오버레이 */}
      <TutorialOverlay
        steps={mainPageTutorialSteps}
        isOpen={isTutorialOpen}
        onComplete={completeTutorial}
      />
    </>
  );
};

export default MainClientSection; 