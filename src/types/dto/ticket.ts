import { TicketStatus } from "../model/ticket";
import { Events } from "../model/events";

export interface TicketGroupDto {
  eventId: string;
  reservationId: string;
  ownerId: string;
  eventName: string;
  eventDate: string;
  userName: string;
  status: string;
  ticketCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTicketGroupDto {
  keyword?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface TicketGroupApiResponse {
  eventId: string;
  reservationId: string;
  ownerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  event: {
    eventName: string;
    eventDate: string;
  };
  user: {
    name: string;
  };
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