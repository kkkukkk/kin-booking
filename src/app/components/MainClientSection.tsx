"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/base/Button";
import { useRouter } from "next/navigation";
import { useTutorial } from "@/hooks/useTutorial";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";
import { mainPageTutorialSteps } from "@/components/tutorial/tutorialSteps";
import { useEventsWithCurrentStatus } from "@/hooks/api/useEvents";
import { EventStatus } from "@/types/model/events";
import MainEventSection from "./MainEventSection";
import { useSpinner } from "@/hooks/useSpinner";
import { useAppSelector } from "@/redux/hooks";
import { motion } from "framer-motion";
import ImageSlider from "@/components/slider/ImageSlider";
import { useLoginImages } from "@/hooks/api/useImages";
import { ArrowDownIcon } from "@/components/icon/ArrowIcons";
import KinAnimationSection from "@/app/components/KinAnimationSection";

const MainClientSection = () => {
  const { showSpinner, hideSpinner } = useSpinner();
  const router = useRouter();
  const theme = useAppSelector(state => state.theme.current);
  const { data: images = [], isPending: imagePending } = useLoginImages();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);

  // 스크롤 컨테이너 찾기
  useEffect(() => {
    const findScrollContainer = () => {
      const container = document.querySelector('.flex-1.overflow-y-auto.scrollbar-none') as HTMLDivElement;
      if (container) {
        scrollContainerRef.current = container;
        setIsContainerReady(true);
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

  const handleNavigateToEvents = (status: EventStatus) => {
    router.push(`/events?status=${status}`);
  };

  const handleScrollToKinSection = () => {
    const container = scrollContainerRef.current;
    const endMarker = document.getElementById('kin-animation-end-marker') as HTMLElement;
    
    if (container && endMarker) {
      const markerTop = endMarker.offsetTop;
      const targetScrollTop = markerTop - container.offsetTop;
      const startScrollTop = container.scrollTop;
      const distance = targetScrollTop - startScrollTop;
      const duration = 8000;
      const startTime = performance.now();
      
      const linear = (t: number) => {
        return t; // 일정한 속도로 움직임
      };
      
      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = linear(progress);
        
        container.scrollTop = startScrollTop + (distance * easedProgress);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // 로딩 상태 필터
  if (isLoading) {
    return (
      <>
        <div className="text-center py-8">
          <div className="text-lg mb-2">정보를 불러오는 중...</div>
          <div className="text-sm text-gray-500">잠시만 기다려주세요</div>
        </div>
        
        {/* 튜토리얼 오버레이 */}
        <TutorialOverlay
          steps={mainPageTutorialSteps}
          isOpen={isTutorialOpen}
          onComplete={completeTutorial}
        />
      </>
    );
  }

  // 에러 상태 필터
  if (error) {
    return (
      <>
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
        
        {/* 튜토리얼 오버레이 */}
        <TutorialOverlay
          steps={mainPageTutorialSteps}
          isOpen={isTutorialOpen}
          onComplete={completeTutorial}
        />
      </>
    );
  }

  return (
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
        {/* 슬라이더 오버레이 */}
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

      {/* 스크롤 화살표 */}
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

      {/* 2. KIN 애니메이션 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center py-4 relative"
      >
        {/* KIN 애니메이션 섹션 */}
        <KinAnimationSection 
          scrollContainerRef={isContainerReady ? scrollContainerRef : undefined} 
        />
      </motion.div>

      {/* 3. 현재 공연 현황 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* 섹션 헤더 */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-sm">
              공연 현황
            </h2>
          </div>

          {/* 통계 카드 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleNavigateToEvents(EventStatus.Ongoing)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm mb-2">
                      {openEvents?.length || 0}
                    </div>
                    <div className="text-base font-medium text-white tracking-wide">예매 진행 중인 공연</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-white/50 text-sm">
                  오래 기다렸어요! 이제 함께할 차례예요!
                </p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => handleNavigateToEvents(EventStatus.Pending)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm mb-2">
                      {waitingEvents?.length || 0}
                    </div>
                    <div className="text-base font-medium text-white tracking-wide">준비 중인 공연</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-teal-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-white/50 text-sm">
                  곧 만나게 될 특별한 순간을 기다리는 중...
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* 4. 공연 포스터들 */}
      <MainEventSection title="지금 공연 중" events={openEvents} theme={theme} variant="large" />
      <MainEventSection title="곧 만나볼 공연" events={waitingEvents} theme={theme} variant="small" />
      
      {(!openEvents || openEvents.length === 0) && (!waitingEvents || waitingEvents.length === 0) && (
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-black/40 to-green-900/30 rounded-xl shadow-lg">
          <div className="text-lg mb-2 text-white font-semibold">현재 준비 중인 공연이 없어요</div>
          <div className="text-sm text-white/70">곧 새로운 음악으로 찾아뵙겠습니다</div>
        </div>
      )}

      
      {/* 5. 유튜브 동영상 섹션 (임시 숨김) */}
      {/* <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-16"
      >
        <YouTubeVideoSection />
      </motion.div> */}

      {/* About us 섹션 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <h3
              className="text-2xl md:text-2xl font-bold text-white/80 mb-8 md:mb-10 tracking-wide drop-shadow-sm text-center"
            >저희가 궁금하시다면...</h3>
            <Button
              theme="dark"
              padding="px-6 py-3"
              fontSize="text-lg"
              width="w-full md:w-1/3"
              className="font-medium tracking-wide"
              onClick={() => router.push('/about')}
            >
              {'About us'}
            </Button>
          </div>
        </div>
      </motion.div>
      
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