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

// 예매 정보와 이벤트 정보를 함께 포함하는 DTO
export interface ReservationWithEventDto extends Reservation {
	event?: {
		eventId: string;
		eventName: string;
		eventDate: string;
		location?: string;
		price?: number;
	};
}

export interface FetchReservationWithEventResponseDto {
	data: ReservationWithEventDto[];
	totalCount: number;
}