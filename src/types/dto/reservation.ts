import { Reservation, ReservationStatus } from "@/types/model/reservation";

export interface CreateReservationDto {
	userId: string;
	eventId: string;
	quantity: number;
	ticketHolder: string;
}

export interface FetchReservationDto {
	id?: number;
	userId?: string;
	eventId?: string;
	reservedFrom?: string;
	reservedTo?: string;
	status?: ReservationStatus;
	ticketHolder?: string;
}

export interface FetchReservationResponseDto {
	data: Reservation[];
	totalCount: number;
}