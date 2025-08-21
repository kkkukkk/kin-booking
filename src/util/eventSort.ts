import { EventWithCurrentStatus } from "@/types/dto/events";
import { EventStatus } from "@/types/model/events";
import { SortConfig } from "@/types/ui/sort";
import dayjs from "dayjs";

// 상태별 우선순위
const statusPriority: Record<EventStatus, number> = {
  [EventStatus.Ongoing]: 1,
  [EventStatus.Pending]: 2,
  [EventStatus.SoldOut]: 3,
  [EventStatus.Completed]: 4,
};


export const sortEvents = (
  events: EventWithCurrentStatus[],
  config: SortConfig
): EventWithCurrentStatus[] => {
  const { field, direction } = config;

  return [...events].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'date':
        comparison = dayjs(a.eventDate).valueOf() - dayjs(b.eventDate).valueOf();
        break;

      case 'price':
        comparison = a.ticketPrice - b.ticketPrice;
        break;

      case 'name':
        comparison = a.eventName.localeCompare(b.eventName, 'ko');
        break;

      case 'status':
        comparison = statusPriority[a.status] - statusPriority[b.status];
        break;

      default:
        comparison = 0;
    }

    // 내림차순인 경우 비교 결과를 반전
    return direction === 'desc' ? -comparison : comparison;
  });
};

export const sortEventsByDefault = (events: EventWithCurrentStatus[]): EventWithCurrentStatus[] => {
  return sortEvents(events, { field: 'date', direction: 'asc' });
}; 