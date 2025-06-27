'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useEventMediaByType } from "@/hooks/api/useEventMedia";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Button from "@/components/base/Button";
import { motion } from "framer-motion";
import { fadeSlideLeft, bottomUp } from "@/types/ui/motionVariants";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { HomeIcon } from "@/components/icon/HomeIcon";
import { WritingIcon } from "@/components/icon/WritingIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";
import Skeleton from "@/components/base/Skeleton";
import clsx from "clsx";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { ErrorIcon } from "@/components/icon/AlertIcons";
import AnimatedText from "@/components/base/AnimatedText";
import ThemeDiv from "@/components/base/ThemeDiv";
import { getStorageUrl } from "@/util/storage";
import ScrollBar from "@/components/base/ScrollBar";
import useNeedScrollBar from "@/hooks/useNeedScrollBar";

const EventDetailClient = () => {
	const router = useRouter();
	const eventId = useParams().eventId as string;
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, error } = useEventById(eventId);
	const { data: posterData } = useEventMediaByType(eventId, 'image');
	const { showSpinner, hideSpinner } = useSpinner();
	const needScrollBar = useNeedScrollBar(descriptionRef);

	// 디버깅용 로그
	console.log('Event ID:', eventId);
	console.log('Poster Data:', posterData);

	useEffect(() => {
		if (isLoading) showSpinner();
		else hideSpinner();
	}, [isLoading, showSpinner, hideSpinner]);

	// 데이터 로딩 완료 후 스크롤바 재계산 트리거
	useEffect(() => {
		if (!isLoading && data) {
			// 강제로 리사이즈 이벤트 발생시켜 스크롤바 재계산
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 100);
		}
	}, [isLoading, data]);

	// 에러 상태
	if (error) {
		return (
			<div className="p-4 text-center">
				<Button
					theme="dark"
					padding="px-4 py-2"
					onClick={() => router.push("/events")}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					{"목록으로"}
				</Button>

				<div className="mt-8">
					<AnimatedTextWithIcon
						fontSize="text-xl md:text-2xl"
						text="공연 정보를 불러올 수 없어요"
						leftIcon={<ErrorIcon />}
					/>

					<AnimatedText
						fontSize="text-sm md:text-base"
						text={"잠시 후 다시 시도해주세요!"}
						delay={0.8}
					/>
				</div>
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
					{'뒤로가기'}
				</Button>
			</motion.div>

			{/* 공연 정보 */}
			<div className="space-y-5 flex flex-col">
				{/* 제목 */}
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.1 }}
					className="flex justify-between items-center"
				>
					<h1 className="text-2xl md:text-3xl font-bold flex-1">
						{event.eventName}
					</h1>
					<div className={clsx(
						"inline-block px-2 py-1 rounded text-sm font-medium ml-4",
						event.status === EventStatus.Ongoing 
							? (theme === "normal" ? "bg-green-100 text-green-800" : "bg-green-900/30 text-green-300")
							: event.status === EventStatus.Pending
							? (theme === "normal" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-900/30 text-yellow-300")
							: event.status === EventStatus.Completed
							? (theme === "normal" ? "bg-gray-100 text-gray-800" : "bg-gray-900/30 text-gray-300")
							: (theme === "normal" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-300")
					)}>
						{EventStatusKo[event.status]}
					</div>
				</motion.div>

				{/* 포스터 */}
				{posterData && posterData.length > 0 && (
					<motion.div
						variants={fadeSlideLeft}
						initial="hidden"
						animate="visible"
						transition={{ delay: 0.15 }}
						className="flex justify-center"
					>
						<div className="relative w-full max-w-md">
							<img
								src={getStorageUrl(posterData[0].url)}
								alt={`${event.eventName} 포스터`}
								className="w-full h-auto rounded-lg shadow-lg"
								loading="lazy"
							/>
						</div>
					</motion.div>
				)}

				{/* 공연 상세 정보 */}
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.2 }}
				>
					<ThemeDiv isChildren className="p-4 rounded-lg border">
						<div className="space-y-3">
							{/* 날짜 */}
							<div>
								<p className="text-sm opacity-70">공연 날짜</p>
								<p className="text-sm font-medium">
									{dayjs(event.eventDate).format("YYYY년 MM월 DD일 HH:mm")}
								</p>
							</div>

							{/* 장소 */}
							<div>
								<p className="text-sm opacity-70">장소</p>
								<p className="text-sm font-medium">{event.location}</p>
							</div>

							{/* 좌석 정보 */}
							{event.status !== EventStatus.Completed && (
								<div>
									<p className="text-sm opacity-70 mb-2">좌석 현황</p>
									<div className={clsx(
										"p-3 rounded-lg border",
										theme === "normal" 
											? "bg-gray-50 border-gray-200" 
											: "bg-gray-800 border-gray-700"
									)}>
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm">총 좌석</span>
											<span className="font-semibold">{event.seatCapacity}석</span>
										</div>
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm">예약된 좌석</span>
											<span className="font-semibold">{event.reservedQuantity}석</span>
										</div>
										<div className="border-t pt-2">
											<div className="flex justify-between items-center">
												<span className="text-sm font-medium">잔여 좌석</span>
												{!event.isSoldOut ? (
													<span className={clsx(
														"font-bold text-lg",
														theme === "normal" ? "text-green-600" : "text-green-400"
													)}>
														{event.remainingQuantity}석
													</span>
												) : (
													<span className={clsx(
														"font-bold text-lg",
														theme === "normal" ? "text-red-600" : "text-red-400"
													)}>
														매진
													</span>
												)}
											</div>
										</div>
										{!event.isSoldOut && (
											<div className="mt-2">
												<div className="w-full bg-gray-200 rounded-full h-2">
													<div 
														className={clsx(
															"h-2 rounded-full transition-all duration-300",
															theme === "normal" ? "bg-green-500" : 
															theme === "dark" ? "bg-green-400" :
															"bg-gradient-to-r from-[#10b9ab] via-[#22c581] via-[#3dafec] via-[#70ffb8] to-[#50ea7c] animate-pulse"
														)}
														style={{ 
															width: `${(event.reservedQuantity / event.seatCapacity) * 100}%` 
														}}
													></div>
												</div>
												<p className="text-xs text-center mt-1 opacity-70">
													예약률 {Math.round((event.reservedQuantity / event.seatCapacity) * 100)}%
												</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</ThemeDiv>
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
							text="소개"
							leftIcon={<BulbIcon />}
						/>
						<ThemeDiv isChildren className="p-4 rounded-lg border">
							<div 
								ref={descriptionRef}
								className="max-h-32 overflow-y-auto"
							>
								<p className="text-sm md:text-base leading-relaxed">
									{event.description}
								</p>
							</div>
							{needScrollBar && <ScrollBar targetRef={descriptionRef} />}
						</ThemeDiv>
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
					{event.status === EventStatus.Completed ? (
						<div className={clsx(
							"p-4 rounded-lg text-center border-2 border-dashed",
							theme === "normal" 
								? "bg-gray-50 border-gray-200 text-gray-700" 
								: "bg-gray-800 border-gray-700 text-gray-300"
						)}>
							<p className="font-medium">완료된 공연입니다.</p>
						</div>
					) : event.status === EventStatus.Pending ? (
						<div className={clsx(
							"p-4 rounded-lg text-center border-2 border-dashed",
							theme === "normal" 
								? "bg-yellow-50 border-yellow-200 text-yellow-700" 
								: "bg-yellow-900/20 border-yellow-700 text-yellow-300"
						)}>
							<p className="font-medium">대기중인 공연입니다.</p>
						</div>
					) : event.isSoldOut ? (
						<div className={clsx(
							"p-4 rounded-lg text-center border-2 border-dashed",
							theme === "normal" 
								? "bg-red-50 border-red-200 text-red-700" 
								: "bg-red-900/20 border-red-700 text-red-300"
						)}>
							<p className="font-medium">매진되었습니다.</p>
						</div>
					) : (
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
					)}
				</motion.div>
			</div>
		</div>
	);
};

export default EventDetailClient;