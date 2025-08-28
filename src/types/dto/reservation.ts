import { Reservation, ReservationStatus } from "@/types/model/reservation";
import { EventStatus } from "@/types/model/events";

export interface CreateReservationDto {
	userId: string;
	eventId: string;
	quantity: number;
	ticketHolder: string;
	status?: ReservationStatus;
}

export interface FetchReservationDto {
	id?: string;
	userId?: string;
	eventId?: string;
	reservedFrom?: string;
	reservedTo?: string;
	status?: ReservationStatus;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

export interface FetchReservationResponseDto {
	data: Reservation[];
	totalCount: number;
}

// 예매 정보와 이벤트 정보, 사용자 정보를 함께 포함하는 DTO
export interface ReservationWithEventDto extends Reservation {
	users?: {
		name: string;
	} | null;
	events?: {
		eventId: string;
		eventName: string;
		eventDate: string;
		location?: string;
		ticketPrice?: number;
		status: EventStatus; // 공연 상태 추가
	} | null;
}

export interface FetchReservationWithEventResponseDto {
	data: ReservationWithEventDto[];
	totalCount: number;
}