'use client'

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { EventWithCurrentStatus } from "@/types/dto/events";
import dayjs from "dayjs";
import { LocationIcon } from "@/components/icon/LocationIcon";
import { HomeIcon } from "@/components/icon/HomeIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";
import ThemeDiv from "@/components/base/ThemeDiv";

interface EventCardProps {
	event: EventWithCurrentStatus;
	index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/events/${event.eventId}`);
	};

	const getStatusColor = (status: EventStatus) => {
		switch (status) {
			case EventStatus.Pending:
				return 'text-blue-500 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
			case EventStatus.Ongoing:
				return 'text-green-500 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
			case EventStatus.Completed:
				return 'text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
			case EventStatus.SoldOut:
				return 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
			default:
				return 'text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			className="cursor-pointer group"
			onClick={handleClick}
		>
			<ThemeDiv 
				isChildren 
				className="p-4 rounded-lg border hover:border-2 hover:shadow-lg transition-all duration-300 h-full"
			>
				<div className="space-y-3">
					{/* 공연 제목 */}
					<div className="flex items-start justify-between">
						<h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
							{event.eventName}
						</h3>
						<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
							{EventStatusKo[event.status]}
						</span>
					</div>

					{/* 날짜 */}
					<div className="flex items-center text-sm">
						<HomeIcon />
						<span className="ml-2">
							{dayjs(event.eventDate).format('YYYY년 MM월 DD일 HH:mm')}
						</span>
					</div>

					{/* 장소 */}
					<div className="flex items-center text-sm">
						<LocationIcon />
						<span className="ml-2 line-clamp-1">
							{event.location}
						</span>
					</div>

					{/* 좌석 정보 */}
					<div className="flex items-center justify-between text-sm">
						<div className="flex items-center">
							<BulbIcon />
							<span className="ml-2">
								{event.isSoldOut ? (
									<span className="text-red-500 dark:text-red-400 font-medium">매진</span>
								) : (
									`${event.remainingQuantity} / ${event.seatCapacity}`
								)}
							</span>
						</div>
						<div className="text-right">
							<span className="font-semibold text-lg">
								{event.ticketPrice.toLocaleString()}원
							</span>
						</div>
					</div>

					{/* 진행률 바 (매진이 아닌 경우) */}
					{!event.isSoldOut && (
						<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
							<div 
								className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
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