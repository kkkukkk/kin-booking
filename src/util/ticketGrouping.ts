import { TicketWithEventDto } from '@/types/dto/ticket';
import dayjs from 'dayjs';

export interface TicketGroup {
	eventName: string;
	tickets: TicketWithEventDto[];
	activeCount: number;
	usedCount: number;
	cancelledCount: number;
	totalCount: number;
	latestCreatedAt: string;
}

export const groupTicketsByEvent = (tickets: TicketWithEventDto[] | undefined): TicketGroup[] => {
	if (!tickets || tickets.length === 0) {
		return [];
	}

	// 공연명별로 그룹화
	const grouped = tickets.reduce((acc: { [key: string]: TicketWithEventDto[] }, ticket: TicketWithEventDto) => {
		const eventName = ticket.event?.eventName || '알 수 없는 공연';
		if (!acc[eventName]) {
			acc[eventName] = [];
		}
		acc[eventName].push(ticket);
		return acc;
	}, {});

	// 그룹별 통계 계산
	const groupedTickets = Object.entries(grouped).map(([eventName, eventTickets]) => {
		const activeCount = eventTickets.filter(t => t.status === 'active').length;
		const usedCount = eventTickets.filter(t => t.status === 'used').length;
		const cancelledCount = eventTickets.filter(t => t.status === 'cancelled').length;
		const totalCount = eventTickets.length;
		
		// 각 그룹의 최신 생성일 찾기
		const latestCreatedAt = eventTickets.reduce((latest, ticket) => {
			return dayjs(ticket.createdAt).isAfter(dayjs(latest)) ? ticket.createdAt : latest;
		}, eventTickets[0].createdAt);

		return {
			eventName,
			tickets: eventTickets,
			activeCount,
			usedCount,
			cancelledCount,
			totalCount,
			latestCreatedAt
		};
	});

	// 최신 생성일 기준으로 정렬
	return groupedTickets.sort((a, b) => 
		dayjs(b.latestCreatedAt).valueOf() - dayjs(a.latestCreatedAt).valueOf()
	);
}; 