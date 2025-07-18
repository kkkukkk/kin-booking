import MainEventCard from "./MainEventCard";
import { EventWithCurrentStatus } from "@/types/dto/events";

interface EventSectionProps {
  title: string;
  events: EventWithCurrentStatus[] | undefined;
  theme: string;
  variant?: "large" | "small";
}

const MainEventSection = ({ title, events, theme, variant = "large" }: EventSectionProps) => {
  if (!events || events.length === 0) return null;
  
  return (
    <section className="mb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-wide drop-shadow-sm">
            {title} 
          </h2>
        </div>

        {variant === "large" ? (
          // 진행 중인 공연: 히어로
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <MainEventCard event={events[0]} theme={theme} variant="hero" />
            </div>
          </div>
        ) : (
          // 대기 중인 공연
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {events.map((event) => (
              <div key={event.eventId} className="w-full flex justify-center">
                <MainEventCard event={event} theme={theme} variant="small" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MainEventSection;