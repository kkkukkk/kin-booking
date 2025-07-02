import { Reservation, ReservationStatus } from '@/types/model/reservation';

export interface ReservationStats {
	confirmedCount: number;
	pendingCount: number;
	cancelledCount: number;
}

export const calculateReservationStats = (reservations: Reservation[] | undefined): ReservationStats => {
	if (!reservations) {
		return {
			confirmedCount: 0,
			pendingCount: 0,
			cancelledCount: 0,
		};
	}

	const confirmedCount = reservations.filter(reservation => reservation.status === ReservationStatus.Confirmed).length;
	const pendingCount = reservations.filter(reservation => reservation.status === ReservationStatus.Pending).length;
	const cancelledCount = reservations.filter(reservation => reservation.status === ReservationStatus.Cancelled).length;

	return {
		confirmedCount,
		pendingCount,
		cancelledCount,
	};
}; 