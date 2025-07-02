export enum ReservationStatus {
	Pending = 'pending',       // 대기
	Confirmed = 'confirmed',   // 확정
	Cancelled = 'cancelled',   // 취소
}

export const ReservationStatusKo: Record<ReservationStatus, string> = {
	[ReservationStatus.Pending]: '대기',
	[ReservationStatus.Confirmed]: '확정',
	[ReservationStatus.Cancelled]: '취소',
};

export interface Reservation {
	id: number;
	userId: string;
	eventId: string;
	reservedAt: string;
	quantity: number;
	status: ReservationStatus;
	ticketHolder: string;
}