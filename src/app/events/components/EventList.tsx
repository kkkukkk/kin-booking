'use client'

import { useEventsWithCurrentStatus } from "@/hooks/api/useEvents";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect } from "react";
import { EventStatus } from "@/types/model/events";
import { useRouter } from "next/navigation";
import EventCard from "./EventCard";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import AnimatedText from "@/components/base/AnimatedText";
import { BulbIcon } from "@/components/icon/BulbIcon";

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

	if (error) {
		return (
			<div className="text-center py-8">
				<AnimatedText
					fontSize="text-lg"
					text="공연 목록을 불러오는 중 오류가 발생했습니다."
				/>
			</div>
		);
	}

	const events = data?.data ?? [];

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			className={className}
		>
			{/* 헤더 */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-2">
					<BulbIcon />
					<AnimatedText
						fontSize="text-xl md:text-2xl"
						text={`공연 목록 (${data?.totalCount ?? 0}건)`}
					/>
				</div>
			</div>

			{/* 공연 목록 */}
			{events.length === 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-12"
				>
					<AnimatedText
						fontSize="text-lg"
						text="등록된 공연이 없습니다."
					/>
				</motion.div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{events.map((event, index) => (
						<EventCard
							key={event.eventId}
							event={event}
							index={index}
						/>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default EventList;