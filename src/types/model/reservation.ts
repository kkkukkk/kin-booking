export enum ReservationStatus {
	Pending = 'pending',       // 대기 (예매 신청)
	Confirmed = 'confirmed',   // 확정 (예매 확정)
	Voided = 'voided',         // 취소 (예매 취소)
}

export const ReservationStatusKo: Record<ReservationStatus, string> = {
	[ReservationStatus.Pending]: '대기',
	[ReservationStatus.Confirmed]: '확정',
	[ReservationStatus.Voided]: '취소',
};

export interface Reservation {
	id: string;
	userId: string;
	eventId: string;
	reservedAt: string;
	quantity: number;
	status: ReservationStatus;
	ticketHolder: string;
}