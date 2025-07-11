import React from "react";
import MainEventCard from "./MainEventCard";
import { EventWithCurrentStatus } from "@/types/dto/events";

interface EventSectionProps {
  title: string;
  events: EventWithCurrentStatus[] | undefined;
  theme: string;
  variant?: "large" | "small";
}

const EventSection = ({ title, events, theme, variant = "large" }: EventSectionProps) => {
  if (!events || events.length === 0) return null;
  
  return (
    <section className="mb-8">
      <h2 className={`font-bold mb-4 ${variant === "large" ? "text-xl" : "text-lg"}`}>
        {title}
      </h2>
      {variant === "large" ? (
        // 진행 중인 공연: 히어로 섹션 (첫 번째만 표시)
        <div className="flex justify-center">
          <div className="w-64 md:w-80">
            <MainEventCard event={events[0]} theme={theme} variant="hero" />
          </div>
        </div>
      ) : (
        // 대기 중인 공연: 작게, 그리드
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {events.map((event) => (
            <MainEventCard key={event.eventId} event={event} theme={theme} variant="small" />
          ))}
        </div>
      )}
    </section>
  );
};

export default EventSection; 