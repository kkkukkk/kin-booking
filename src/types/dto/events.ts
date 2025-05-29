import { EventStatus } from "@/types/model/events";
import { Events } from "@/types/model/events";


export interface CreateEventDto {
	eventName: string;
	eventDate: string;
	location?: string | null;
	description?: string | null;
	setCapacity: number;
}

export interface UpdateEventDto {
	eventName?: string;
	eventDate?: string;
	location?: string;
	description?: string | null;
	setCapacity?: number;
	status?: EventStatus;
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
}

export interface FetchEventWithCurrentStatusResponseDto {
	data: EventWithCurrentStatus[];
	totalCount: number;
}