import { TicketStatus } from "../model/ticket";

export interface TicketGroupDto {
	eventName: string;
	totalCount: number;
	activeCount: number;
	usedCount: number;
	cancelledCount: number;
	latestCreatedAt: string;
}

export interface TicketEventInfoDto {
	eventName: string;
	eventDate: string;
	ticketPrice: number;
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
	event: TicketEventInfoDto;
}