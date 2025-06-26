'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect } from "react";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Button from "@/components/base/Button";
import { motion } from "framer-motion";
import { fadeSlideLeft, bottomUp } from "@/types/ui/motionVariants";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { HomeIcon } from "@/components/icon/HomeIcon";
import { FlagIcon } from "@/components/icon/FlagIcon";
import { WritingIcon } from "@/components/icon/WritingIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";
import Skeleton from "@/components/base/Skeleton";
import clsx from "clsx";
import { EventStatus, EventStatusKo } from "@/types/model/events";

const EventDetailClient = () => {
	const router = useRouter();
	const eventId = useParams().eventId as string;
	const theme = useAppSelector((state: RootState) => state.theme.current);

	const { data, isLoading, error } = useEventById(eventId);
	const { showSpinner, hideSpinner } = useSpinner();

	useEffect(() => {
		if (isLoading) showSpinner();
		else hideSpinner();
	}, [isLoading, showSpinner, hideSpinner]);

	// 로딩 상태
	if (isLoading) {
		return (
			<div className="p-4 space-y-4">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-12 w-full" />
			</div>
		);
	}

	// 에러 상태
	if (error) {
		return (
			<div className="p-4 text-center">
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					className="space-y-4"
				>
					<AnimatedTextWithIcon
						fontSize="text-xl md:text-2xl"
						text="공연 정보를 불러올 수 없어요"
						leftIcon={<FlagIcon />}
					/>
					<p className="text-sm md:text-base opacity-70">
						잠시 후 다시 시도해주세요
					</p>
					<Button
						theme="dark"
						padding="px-4 py-2"
						onClick={() => router.push("/events")}
						reverse={theme === "normal"}
						light={theme !== "normal"}
					>
						공연 목록으로 돌아가기
					</Button>
				</motion.div>
			</div>
		);
	}

	if (!data) return null;

	const event = data;

	return (
		<div className="p-4">
			{/* 뒤로가기 버튼 */}
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				className="mb-6"
			>
				<Button
					theme="dark"
					padding="px-3 py-1.5"
					onClick={() => router.push("/events")}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					<HomeIcon />
					공연 목록으로
				</Button>
			</motion.div>

			{/* 공연 정보 */}
			<div className="space-y-6">
				{/* 제목 */}
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.1 }}
				>
					<AnimatedTextWithIcon
						fontSize="text-2xl md:text-3xl font-bold"
						text={event.eventName}
						leftIcon={<WritingIcon />}
					/>
				</motion.div>

				{/* 공연 상세 정보 */}
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.2 }}
					className={clsx(
						"p-6 rounded-lg border",
						theme === "normal" 
							? "bg-white border-gray-200 shadow-sm" 
							: "bg-gray-800 border-gray-700"
					)}
				>
					<div className="space-y-4">
						{/* 날짜 */}
						<div className="flex items-center space-x-3">
							<div className={clsx(
								"w-2 h-2 rounded-full",
								theme === "normal" ? "bg-blue-500" : "bg-blue-400"
							)} />
							<div>
								<p className="text-sm opacity-70">공연 날짜</p>
								<p className="font-medium">
									{dayjs(event.eventDate).format("YYYY년 MM월 DD일 HH:mm")}
								</p>
							</div>
						</div>

						{/* 상태 */}
						<div className="flex items-center space-x-3">
							<div className={clsx(
								"w-2 h-2 rounded-full",
								event.status === EventStatus.Ongoing 
									? (theme === "normal" ? "bg-green-500" : "bg-green-400")
									: (theme === "normal" ? "bg-gray-500" : "bg-gray-400")
							)} />
							<div>
								<p className="text-sm opacity-70">상태</p>
								<p className="font-medium">
									{EventStatusKo[event.status]}
								</p>
							</div>
						</div>

						{/* 좌석 정보 */}
						<div className="flex items-center space-x-3">
							<div className={clsx(
								"w-2 h-2 rounded-full",
								theme === "normal" ? "bg-purple-500" : "bg-purple-400"
							)} />
							<div>
								<p className="text-sm opacity-70">좌석 현황</p>
								<p className="font-medium">
									총 {event.seatCapacity}석 / 예약 {event.reservedQuantity}석
								</p>
								<p className={clsx(
									"text-sm font-medium",
									event.isSoldOut 
										? "text-red-600" 
										: (theme === "normal" ? "text-green-600" : "text-green-400")
								)}>
									잔여 {event.remainingQuantity}석
									{event.isSoldOut && " (매진)"}
								</p>
							</div>
						</div>

						{/* 장소 */}
						<div className="flex items-center space-x-3">
							<div className={clsx(
								"w-2 h-2 rounded-full",
								theme === "normal" ? "bg-orange-500" : "bg-orange-400"
							)} />
							<div>
								<p className="text-sm opacity-70">장소</p>
								<p className="font-medium">{event.location}</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* 설명 */}
				{event.description && (
					<motion.div
						variants={fadeSlideLeft}
						initial="hidden"
						animate="visible"
						transition={{ delay: 0.3 }}
						className="space-y-2"
					>
						<AnimatedTextWithIcon
							fontSize="text-lg md:text-xl"
							text="공연 소개"
							leftIcon={<BulbIcon />}
						/>
						<div className={clsx(
							"p-4 rounded-lg",
							theme === "normal" 
								? "bg-gray-50 border border-gray-200" 
								: "bg-gray-800 border border-gray-700"
						)}>
							<p className="text-sm md:text-base leading-relaxed">
								{event.description}
							</p>
						</div>
					</motion.div>
				)}

				{/* 예매 버튼 */}
				<motion.div
					variants={bottomUp}
					initial="initial"
					animate="animate"
					transition={{ delay: 0.4 }}
					className="pt-4"
				>
					{!event.isSoldOut ? (
						<Button
							theme="dark"
							width="w-full"
							fontSize="text-lg md:text-xl"
							padding="px-6 py-3"
							onClick={() => router.push(`/events/${event.eventId}/reservation`)}
							reverse={theme === "normal"}
							light={theme !== "normal"}
						>
							예매하기
						</Button>
					) : (
						<div className={clsx(
							"p-4 rounded-lg text-center border-2 border-dashed",
							theme === "normal" 
								? "bg-red-50 border-red-200 text-red-700" 
								: "bg-red-900/20 border-red-700 text-red-300"
						)}>
							<p className="font-medium">매진되었습니다</p>
							<p className="text-sm opacity-70 mt-1">
								다른 공연을 확인해보세요
							</p>
						</div>
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default EventDetailClient;