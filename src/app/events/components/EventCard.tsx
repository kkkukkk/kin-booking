'use client'

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventWithCurrentStatus } from "@/types/dto/events";
import dayjs from "dayjs";
import { LocationIcon } from "@/components/icon/LocationIcon";
import ThemeDiv from "@/components/base/ThemeDiv";
import { CalendarIcon } from "@/components/icon/CalendarIcon";
import { useEventMedia } from "@/hooks/api/useEventMedia";
import { ChairIcon } from "@/components/icon/ChairIcon";
import { useAppSelector } from "@/redux/hooks";
import { StatusBadge } from "@/components/base/StatusBadge";
import EventPoster from "../[eventId]/components/EventPoster";

interface EventCardProps {
	event: EventWithCurrentStatus;
	index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
	const router = useRouter();
	const theme = useAppSelector(state => state.theme.current);

	// 항상 실제 데이터만 사용
	const { data: posterData, isLoading } = useEventMedia(event.eventId);

	const handleClick = () => {
		router.push(`/events/${event.eventId}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			className="cursor-pointer group touch-manipulation"
			onClick={handleClick}
		>
			<ThemeDiv 
				isChildren 
				className="p-3 md:p-4 rounded-lg border hover:border-2 hover:shadow-lg transition-all duration-300 h-full active:scale-[0.98]"
			>
				<div className="relative w-full rounded-lg overflow-hidden mb-2 md:mb-3">
					<EventPoster
						eventName={event.eventName}
						posterData={posterData}
						theme={theme}
						isLoading={isLoading}
						priority={index < 2}
						loading={index < 2 ? undefined : 'lazy'}
						showPlaceholderText={false}
						variant="card"
					/>
				</div>
				<div className="space-y-2 md:space-y-3">
					<div className="flex items-start justify-between">
						<h3 className="text-base md:text-lg font-semibold line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors flex-1 mr-2">
							{event.eventName}
						</h3>
						<StatusBadge status={event.status} theme={theme} className="flex-shrink-0" />
					</div>

					<div className="flex items-center text-xs md:text-sm">
						<CalendarIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
						<span className="ml-1 md:ml-2 line-clamp-1">
							{dayjs(event.eventDate).format('YYYY년 MM월 DD일 HH:mm')}
						</span>
					</div>

					<div className="flex items-center text-xs md:text-sm">
						<LocationIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
						<span className="ml-1 md:ml-2 line-clamp-1">
							{event.location}
						</span>
					</div>

					<div className="flex items-center justify-between text-xs md:text-sm">
						<div className="flex items-center">
							<ChairIcon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
							<span className="ml-1 md:ml-2">
								{event.isSoldOut ? (
									<span className="text-red-500 dark:text-red-400 font-medium">매진</span>
								) : (
									`${event.remainingQuantity} / ${event.seatCapacity}`
								)}
							</span>
						</div>
						<div className="text-right">
							<span className="font-semibold text-sm md:text-lg">
								{event.ticketPrice.toLocaleString()}원
							</span>
						</div>
					</div>

					{!event.isSoldOut && (
						<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 md:h-2">
							<div 
								className="bg-green-500 dark:bg-green-400 h-1.5 md:h-2 rounded-full transition-all duration-300"
								style={{ 
									width: `${((event.seatCapacity - event.remainingQuantity) / event.seatCapacity) * 100}%` 
								}}
							/>
						</div>
					)}
				</div>
			</ThemeDiv>
		</motion.div>
	);
};

export default EventCard; 