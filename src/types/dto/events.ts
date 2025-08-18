import { EventStatus } from "@/types/model/events";
import { Events } from "@/types/model/events";

export interface CreateEventDto {
	eventName: string;
	eventDate: string;
	location: string;
	description?: string | null;
	seatCapacity: number;
	ticketPrice: number;
	status: EventStatus;
	ticketColor: string;
}

export interface UpdateEventDto {
	eventName?: string;
	eventDate?: string;
	location?: string;
	description?: string | null;
	seatCapacity?: number;
	status?: EventStatus;
	ticketPrice?: number;
	ticketColor?: string;
}

export interface FetchEventDto {
	id?: string;
	eventName?: string;
	eventDateFrom?: string;
	eventDateTo?: string;
	status?: EventStatus | EventStatus[];
}

export interface FetchEventResponseDto {
	data: Events[];
	totalCount: number;
}

export interface EventWithCurrentStatus {
	eventId: string;
	eventName: string;
	eventDate: string;
	seatCapacity: number;
	reservedQuantity: number;
	remainingQuantity: number;
	isSoldOut: boolean;
	status: EventStatus;
	ticketPrice: number;
	location: string;
	description: string;
}

export interface FetchEventWithCurrentStatusResponseDto {
	data: EventWithCurrentStatus[];
	totalCount: number;
}