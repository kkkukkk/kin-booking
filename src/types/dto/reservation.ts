import { Reservation, ReservationStatus } from "@/types/model/reservation";

export interface CreateReservationDto {
	userId: string;
	eventId: string;
	quantity: number;
}

export interface FetchReservationDto {
	id?: number;
	userId?: string;
	eventId?: string;
	reservedFrom?: string;
	reservedTo?: string;
	status?: ReservationStatus;
}

export interface FetchReservationResponseDto {
	data: Reservation[];
	totalCount: number;
}