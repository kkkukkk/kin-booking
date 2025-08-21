'use client'

import { EventStatus } from "@/types/model/events";
import ReservationSeatInfo from '@/app/events/[eventId]/components/ReservationSeatInfo';

interface EventSeatInfoProps {
	status: EventStatus;
	seatCapacity: number;
	reservedQuantity: number;
	remainingQuantity: number;
	isSoldOut: boolean;
	theme: string;
}

const EventSeatInfo = ({
	status,
	seatCapacity,
	reservedQuantity,
	remainingQuantity,
	theme
}: EventSeatInfoProps) => {
	if (status === EventStatus.Completed) {
		return null;
	}
	return (
		<ReservationSeatInfo
			seatCapacity={seatCapacity}
			reservedQuantity={reservedQuantity}
			remainingQuantity={remainingQuantity}
			theme={theme}
		/>
	);
};

export default EventSeatInfo; 