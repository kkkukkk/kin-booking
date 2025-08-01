import { Reservation, ReservationStatus } from '@/types/model/reservation';

export interface ReservationStats {
	confirmedCount: number;
	pendingCount: number;
	voidedCount: number;
}

export const calculateReservationStats = (reservations: Reservation[] | undefined): ReservationStats => {
	if (!reservations) {
		return {
			confirmedCount: 0,
			pendingCount: 0,
			voidedCount: 0,
		};
	}

	const confirmedCount = reservations.filter(reservation => reservation.status === ReservationStatus.Confirmed).length;
	const pendingCount = reservations.filter(reservation => reservation.status === ReservationStatus.Pending).length;
	const voidedCount = reservations.filter(reservation => reservation.status === ReservationStatus.Voided).length;

	return {
		confirmedCount,
		pendingCount,
		voidedCount,
	};
}; 