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
    : "w-20 h-24 md:w-24 md:h-32";
  
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
      className={`p-3 flex flex-col items-center shadow-lg rounded-lg mb-2 ${isHero ? "w-full" : isLarge ? "w-full" : ""}`}
      isChildren
    >
      <div className={`${posterContainerSize} mb-2 flex justify-center`}>
        <EventPoster
          eventName={event.eventName}
          posterData={posterData}
          theme={theme}
          isLoading={isLoading}
          variant="card"
          overlay={
            isSmall && hasPoster
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
          <div className={`${titleSize} mb-2 truncate w-full text-center`}>
            {event.eventName}
          </div>
          <div className={`${dateSize} mb-4 text-center`}>
            {dayjs(event.eventDate).format('YYYY년 MM월 DD일 HH:mm')}
          </div>
          <div className="flex gap-2">
            <Button
              theme="dark"
              padding="px-4 py-2"
              onClick={handleDetailClick}
            >
              상세보기
            </Button>
          </div>
        </>
      ) : (
        /* large일 때만 아래에 텍스트 표시 */
        isLarge && (
          <>
            <div className={`${titleSize} mb-1 truncate w-full text-center`}>
              {event.eventName}
            </div>
            <div className={`${dateSize} text-center`}>
              {dayjs(event.eventDate).format('MM/DD HH:mm')}
            </div>
          </>
        )
      )}
    </ThemeDiv>
  );
};

export default MainEventCard; 