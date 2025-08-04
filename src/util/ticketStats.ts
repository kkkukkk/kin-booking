import { Ticket, TicketStatus } from '@/types/model/ticket';

export interface TicketStats {
	activeCount: number;
	usedCount: number;
	cancelledCount: number;
}

export const calculateTicketStats = (tickets: Ticket[] | undefined): TicketStats => {
	if (!tickets) {
		return {
			activeCount: 0,
			usedCount: 0,
			cancelledCount: 0,
		};
	}

	const activeCount = tickets.filter(ticket => ticket.status === TicketStatus.Active).length;
	const usedCount = tickets.filter(ticket => ticket.status === TicketStatus.Used).length;
	const cancelledCount = tickets.filter(ticket => ticket.status === TicketStatus.Cancelled).length;

	return {
		activeCount,
		usedCount,
		cancelledCount,
	};
}; 