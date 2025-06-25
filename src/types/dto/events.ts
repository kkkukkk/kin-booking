import { EventStatus } from "@/types/model/events";
import { Events } from "@/types/model/events";

export interface CreateEventDto {
	eventName: string;
	eventDate: string;
	location: string;
	description?: string | null;
	setCapacity: number;
	ticketPrice: number;
}

export interface UpdateEventDto {
	eventName?: string;
	eventDate?: string;
	location?: string;
	description?: string | null;
	setCapacity?: number;
	status?: EventStatus;
	ticketPrice?: number;
}

export interface FetchEventDto {
	id?: string;
	eventName?: string;
	eventDateFrom?: string;
	eventDateTo?: string;
	status?: EventStatus;
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