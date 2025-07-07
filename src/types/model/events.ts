export enum EventStatus {
	Pending = 'pending',      // 대기
	Ongoing = 'ongoing',      // 오픈
	SoldOut = 'soldout',      // 매진
	Completed = 'completed',  // 완료
}

export const EventStatusKo: Record<EventStatus, string> = {
	[EventStatus.Pending]: '대기',
	[EventStatus.Ongoing]: '오픈',
	[EventStatus.SoldOut]: '매진',
	[EventStatus.Completed]: '완료',
};

export interface Events {
	id: number;
	eventName: string;
	eventDate: string;
	location: string;
	description?: string | null;
	createdAt: string;
	status: EventStatus;
	seatCapacity: number;
	ticketPrice: number;
	ticketColor: string | null;
}