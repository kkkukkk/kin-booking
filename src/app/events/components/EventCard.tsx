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
import { StatusBadge } from "@/components/status/StatusBadge";
import EventPosterWrapper from "../[eventId]/components/EventPosterWrapper";
import clsx from "clsx";

interface EventCardProps {
	event: EventWithCurrentStatus;
	index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
	const router = useRouter();
	const theme = useAppSelector(state => state.theme.current);

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
				className={clsx(
					"p-3 md:p-4 rounded-lg border transition-all duration-500 h-full md:hover:scale-[0.99] will-change-transform backface-visibility-hidden",
					theme === "normal" && "md:hover:shadow-lg md:hover:shadow-black/10",
					theme === "dark" && "md:hover:shadow-lg md:hover:shadow-white/10",
					theme === "neon" && "md:hover:shadow-lg md:hover:shadow-white/10"
				)}
			>
				<div className="relative w-full rounded-lg overflow-hidden mb-2 md:mb-3">
					<EventPosterWrapper
						eventName={event.eventName}
						posterData={posterData}
						theme={theme}
						isLoading={isLoading}
						priority={index === 0}
						loading={index === 0 ? undefined : 'lazy'}
						showPlaceholderText={false}
						variant="card"
					/>
				</div>
				<div className="space-y-2 md:space-y-3">
					<div className="flex items-start justify-between">
						<h3 className={clsx(
							"text-base md:text-lg font-semibold line-clamp-2 transition-colors flex-1 mr-2",
						)}>
							{event.eventName}
						</h3>
						<StatusBadge status={event.status} theme={theme} className="flex-shrink-0" statusType="event" />
					</div>

					<div className="flex items-center text-xs md:text-sm">
						<CalendarIcon className="w-3 h-3 md:w-4 md:h-4" />
						<span className="ml-1 md:ml-2 line-clamp-1">
							{dayjs(event.eventDate).format('YYYY년 MM월 DD일 HH:mm')}
						</span>
					</div>

					<div className="flex items-center text-xs md:text-sm">
						<LocationIcon className="w-3 h-3 md:w-4 md:h-4" />
						<span className="ml-1 md:ml-2 line-clamp-1">
							{event.location}
						</span>
					</div>

					<div className="flex items-center justify-between text-xs md:text-sm">
						<div className="flex items-center">
							<ChairIcon className="w-3 h-3 md:w-4 md:h-4" />
							<span className="ml-1 md:ml-2">
								{event.isSoldOut ? (
									<span className="text-red-500 font-medium">매진</span>
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
						<div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
							<div 
								className="bg-green-500 h-1.5 md:h-2 rounded-full transition-all duration-300"
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