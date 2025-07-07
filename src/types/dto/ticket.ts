import { TicketStatus } from "../model/ticket";
import { Events } from "../model/events";

export interface TicketGroupDto {
	eventName: string;
	totalCount: number;
	activeCount: number;
	usedCount: number;
	cancelledCount: number;
	latestCreatedAt: string;
}

export interface TicketWithEventDto {
	id: string;
	reservationId: string;
	eventId: string;
	ownerId: string;
	status: TicketStatus;
	transferredAt: string | null;
	createdAt: string;
	updatedAt: string;
	color: string;
	isRare: boolean;
	ticketNumber: number;
	event: Events;
}