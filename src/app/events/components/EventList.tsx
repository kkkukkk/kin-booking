'use client'

import { useEventsWithCurrentStatus } from "@/hooks/api/useEvents";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect } from "react";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface EventListProps {
	className?: string;
	keyword?: string;
	status?: EventStatus;
	from?: string;
	to?: string;
}

const EventList = ({ className, keyword, status, from, to }: EventListProps) => {
	const router = useRouter();

	const {data, isLoading: eventsLoading, error} = useEventsWithCurrentStatus({
		eventName: keyword,
		eventDateFrom: from,
		eventDateTo: to,
		status: status
	});
	const {showSpinner, hideSpinner} = useSpinner();

	useEffect(() => {
		if (eventsLoading) showSpinner();
		else hideSpinner();
	}, [eventsLoading, showSpinner, hideSpinner]);

	if (error) console.error(error);

	const events = data?.data ?? [];

	console.log(events);

	return (
		<div
			className={className}
		>
			<h1>공연 목록 (총 {data?.totalCount ?? 0}건)</h1>
			{events.length === 0 ? (
				<p>등록된 공연이 없습니다.</p>
			) : (
				<ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{events.map(event => (
						<li
							key={event.eventId}
							className="border p-4 rounded shadow hover:shadow-lg transition"
							onClick={() => router.push(`/events/${event.eventId}`)}
						>
							<h2>{event.eventName}</h2>
							<h2>{EventStatusKo[event.status]}</h2>
							<p>날짜: {dayjs(event.eventDate).format('YYYY-MM-DD HH:mm')}</p>
							{event.isSoldOut ? (<p>매진</p>) : (
								<p>잔여 좌석: {event.remainingQuantity} / {event.seatCapacity}</p>)}
							<h2>가격: {event.ticketPrice}</h2>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default EventList;