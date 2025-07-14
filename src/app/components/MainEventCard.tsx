import React from "react";
import { EventWithCurrentStatus } from "@/types/dto/events";
import EventPoster from "@/app/events/[eventId]/components/EventPoster";
import { useEventMedia } from "@/hooks/api/useEventMedia";
import ThemeDiv from "@/components/base/ThemeDiv";
import Button from "@/components/base/Button";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface MainEventCardProps {
  event: EventWithCurrentStatus;
  theme: string;
  variant?: "large" | "small" | "hero";
}

const MainEventCard = ({ event, theme, variant = "large" }: MainEventCardProps) => {
  const { data: posterData, isLoading } = useEventMedia(event.eventId);
  const router = useRouter();

  const isLarge = variant === "large";
  const isHero = variant === "hero";
  const isSmall = variant === "small";
  
  // 포스터 컨테이너 크기 조정 - flex 기반
  const posterContainerSize = isHero 
    ? "w-full max-w-xs md:max-w-sm" 
    : isLarge 
    ? "w-32 h-40 md:w-40 md:h-52" 
    : "w-20 h-24 md:w-24 md:h-28";
  
  const titleSize = isHero 
    ? "text-xl font-bold" 
    : isLarge 
    ? "text-lg font-bold" 
    : "text-sm font-semibold";
  
  const dateSize = isHero 
    ? "text-base" 
    : isLarge 
    ? "text-sm" 
    : "text-xs";

  // 포스터가 있는지 확인
  const hasPoster = posterData && posterData.length > 0 && !isLoading;

  const handleDetailClick = () => {
    router.push(`/events/${event.eventId}`);
  };

  return (
    <ThemeDiv
      className={`p-4 flex flex-col items-center shadow-xl rounded-2xl mb-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isHero ? "w-full" : isLarge ? "w-full" : ""}`}
      isChildren
    >
      <div className={`${posterContainerSize} mb-2 flex justify-center overflow-hidden`}>
        <EventPoster
          eventName={event.eventName}
          posterData={posterData}
          theme={theme}
          isLoading={isLoading}
          variant="card"
          smallText={isSmall}
          overlay={
            isSmall
              ? {
                  title: event.eventName,
                  subtitle: dayjs(event.eventDate).format('MM/DD HH:mm'),
                  showOverlay: true,
                }
              : undefined
          }
        />
      </div>
      {/* hero일 때는 버튼과 함께 표시 */}
      {isHero ? (
        <>
          <div className={`${titleSize} mb-3 truncate w-full text-center text-gray-800 font-bold`}>
            {event.eventName}
          </div>
          <div className={`${dateSize} mb-6 text-center text-gray-600`}>
            {dayjs(event.eventDate).format('YYYY년 MM월 DD일 HH:mm')}
          </div>
          <div className="flex gap-3">
            <Button
              theme="dark"
              padding="px-6 py-3"
              className="text-base font-medium tracking-wide"
              onClick={handleDetailClick}
            >
              상세보기
            </Button>
          </div>
        </>
      ) : (
        /* large일 때만 텍스트 표시, small은 overlay로 대체 */
        isLarge && (
          <>
            <div className={`${titleSize} mb-2 truncate w-full text-center text-gray-800 font-semibold`}>
              {event.eventName}
            </div>
            <div className={`${dateSize} text-center text-gray-600`}>
              {dayjs(event.eventDate).format('MM/DD HH:mm')}
            </div>
          </>
        )
      )}
    </ThemeDiv>
  );
};

export default MainEventCard; 