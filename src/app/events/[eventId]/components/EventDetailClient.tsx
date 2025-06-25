'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect } from "react";
import dayjs from "dayjs";

const EventDetailClient = () => {
	const router = useRouter();
	const eventId = useParams().eventId as string;

	const { data, isLoading, error } = useEventById(eventId);
	const { showSpinner, hideSpinner } = useSpinner();


	useEffect(() => {
		if (isLoading) showSpinner();
		else hideSpinner();
	}, [isLoading, showSpinner, hideSpinner]);

	if (error) throw error;
	if (!data) return null;

	const event = data;

	return (
		<div className="p-4">
			<button
				onClick={() => router.push("/events")}
				className="mb-4 text-blue-600 hover:underline text-sm"
			>
				← 공연 목록으로
			</button>

			<div className="p-6 max-w-xl mx-auto">
				<h1 className="text-2xl font-bold mb-4">{event.eventName}</h1>
				<p className="mb-2">
					날짜: {dayjs(event.eventDate).format("YYYY-MM-DD HH:mm")}
				</p>
				<p className="mb-2">상태: {event.status}</p>
				<p className="mb-2">
					좌석 수: {event.seatCapacity} / 예약됨: {event.reservedQuantity}
				</p>
				<p className="mb-4">
					잔여 좌석: {event.remainingQuantity}{" "}
					{event.isSoldOut && <span className="text-red-600 font-bold">매진</span>}
				</p>
				<p>
					{event.location}
					{event.description}
				</p>
				{/* 예매 버튼 */}
				{!event.isSoldOut && (
					<button
						onClick={() => router.push(`/events/${event.eventId}/reservation`)}
						className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						예매하기
					</button>
				)}
			</div>
		</div>
	);
};

export default EventDetailClient;