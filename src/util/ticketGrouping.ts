import { Ticket } from '@/types/model/ticket';

export interface TicketGroup {
	eventName: string;
	tickets: Ticket[];
	activeCount: number;
	usedCount: number;
	cancelledCount: number;
	totalCount: number;
	latestCreatedAt: string;
}

export const groupTicketsByEvent = (tickets: Ticket[] | undefined): TicketGroup[] => {
	if (!tickets || tickets.length === 0) {
		return [];
	}

	// 공연명별로 그룹화
	const grouped = tickets.reduce((acc: { [key: string]: Ticket[] }, ticket: Ticket) => {
		const eventName = ticket.eventName;
		if (!acc[eventName]) {
			acc[eventName] = [];
		}
		acc[eventName].push(ticket);
		return acc;
	}, {});

	// 그룹별 통계 계산
	return Object.entries(grouped).map(([eventName, eventTickets]) => {
		const activeCount = eventTickets.filter(t => t.status === 'active').length;
		const usedCount = eventTickets.filter(t => t.status === 'used').length;
		const cancelledCount = eventTickets.filter(t => t.status === 'cancelled').length;
		const totalCount = eventTickets.length;
		
		// 가장 최근 생성일 찾기
		const latestCreatedAt = eventTickets.reduce((latest, ticket) => {
			return new Date(ticket.createdAt) > new Date(latest) ? ticket.createdAt : latest;
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
	}).sort((a, b) => new Date(b.latestCreatedAt).getTime() - new Date(a.latestCreatedAt).getTime());
}; 