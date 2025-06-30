'use client'

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { EventWithCurrentStatus } from "@/types/dto/events";
import dayjs from "dayjs";
import { LocationIcon } from "@/components/icon/LocationIcon";
import ThemeDiv from "@/components/base/ThemeDiv";
import { CalendarIcon } from "@/components/icon/CalendarIcon";
import { TicketIcon } from "@/components/icon/TicketIcon";
import { useEventMedia } from "@/hooks/api/useEventMedia";
import { getStorageUrl } from "@/util/storage";
import Skeleton from "@/components/base/Skeleton";
import { ChairIcon } from "@/components/icon/ChairIcon";
import clsx from "clsx";
import { useAppSelector } from "@/redux/hooks";
import { StatusBadge } from "@/components/base/StatusBadge";
import Image from "next/image";

interface EventCardProps {
	event: EventWithCurrentStatus;
	index: number;
}

const EventCard = ({ event, index }: EventCardProps) => {
	const router = useRouter();
	const { data: posterData, isLoading } = useEventMedia(event.eventId);
	const theme = useAppSelector(state => state.theme.current);

	const handleClick = () => {
		router.push(`/events/${event.eventId}`);
	};

	const getStatusBadgeClass = (status: EventStatus, theme: string) => {
		switch (status) {
			case EventStatus.Ongoing:
				return theme === "normal"
					? "bg-green-100 text-green-800"
					: "bg-green-900/30 text-green-300";
			case EventStatus.Pending:
				return theme === "normal"
					? "bg-yellow-100 text-yellow-800"
					: "bg-yellow-900/30 text-yellow-300";
			case EventStatus.Completed:
				return theme === "normal"
					? "bg-blue-100 text-blue-800"
					: "bg-blue-900/30 text-blue-300";
			case EventStatus.SoldOut:
				return theme === "normal"
					? "bg-red-100 text-red-800"
					: "bg-red-900/30 text-red-300";
			default:
				return theme === "normal"
					? "bg-gray-100 text-gray-800"
					: "bg-gray-900/30 text-gray-300";
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
				{/* 포스터 이미지 */}
				<div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
					{isLoading ? (
						<Skeleton className="w-full h-full rounded-lg" />
					) : posterData && posterData.length > 0 ? (
						<Image
							src={getStorageUrl(posterData[0].url)}
							alt={`${event.eventName} 포스터`}
							width={400}
							height={160}
							className="w-full h-full object-cover rounded-lg"
							style={{ objectFit: 'cover' }}
							{...(index < 2 ? { priority: true } : { loading: 'lazy' })}
						/>
					) : (
						<div className={clsx(
							"w-full h-full flex items-center justify-center border-2 border-dashed",
							theme === "normal"
								? "bg-gray-50 border-gray-200 text-gray-500"
								: "bg-gray-800 border-gray-700 text-gray-400"
						)}>
							<div className="text-center">
								<p className="text-lg font-medium mb-2">포스터 준비중</p>
							</div>
						</div>
					)}
				</div>
				<div className="space-y-3">
					{/* 공연 제목 */}
					<div className="flex items-start justify-between">
						<h3 className="text-lg font-semibold line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
							{event.eventName}
						</h3>
						<StatusBadge status={event.status} theme={theme} className="ml-2" />
					</div>

					{/* 날짜 */}
					<div className="flex items-center text-sm">
						<CalendarIcon />
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
							<ChairIcon />
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
								className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
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