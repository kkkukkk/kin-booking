'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ReservationStatus } from '@/types/model/reservation';
import { ReservationWithEventDto } from '@/types/dto/reservation';
import { PaymentAccount } from '@/types/model/paymentAccount';
import { NeonVariant, NEON_VARIANTS } from '@/types/ui/neonVariant';
import { Theme } from '@/types/ui/theme';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { getStatusTextColors } from '@/components/status/StatusBadge';
import { useEventById } from '@/hooks/api/useEvents';
import { EventStatus } from '@/types/model/events';
import useToast from '@/hooks/useToast';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface ReservationCardProps {
	reservation: ReservationWithEventDto;
	index: number;
	totalCount: number;
	theme: Theme;
	paymentAccounts: PaymentAccount[];
	expandedPaymentInfo: string | null;
	setExpandedPaymentInfo: (id: string | null) => void;
	handleCancelReservation: (id: string) => void;
	isCancelling: boolean;
}

const ReservationCard = ({
	reservation,
	index,
	totalCount,
	theme,
	paymentAccounts,
	expandedPaymentInfo,
	setExpandedPaymentInfo,
	handleCancelReservation,
	isCancelling
}: ReservationCardProps) => {
	const { showToast } = useToast();
	// 공연 매진 상태 확인
	const [isCheckingStatus, setIsCheckingStatus] = useState(false);
	const [hasCheckedStatus, setHasCheckedStatus] = useState(false); // 상태 확인 여부

	// 실시간 공연 상태 조회
	const { data: currentEvent, refetch: refetchEvent } = useEventById(
		reservation.events?.eventId || reservation.eventId || ''
	);

	// 공연 매진 상태를 이중으로 관리
	// 1. 기본 조회 (마이페이지 접근)
	const initialEventStatus = reservation.events?.status;

	// 2. 실시간 조회 (사용자 버튼 클릭)
	const currentEventStatus = currentEvent?.status;

	// 3. 최종 (실시간 > 기본 순서)
	const finalEventStatus = currentEventStatus || initialEventStatus;
	const isEventSoldOut = finalEventStatus === EventStatus.SoldOut;



	const checkEventStatus = async () => {
		const targetEventId = reservation.events?.eventId || reservation.eventId;

		if (!targetEventId) return;

		setIsCheckingStatus(true);

		try {
			const result = await refetchEvent();

			if (result.data) {
				setHasCheckedStatus(true);
			}
		} catch (error) {
			console.error('공연 상태 확인 실패:', error);
		} finally {
			setIsCheckingStatus(false);
		}
	};

	const getStatusNeonVariant = (status: ReservationStatus): NeonVariant => {
		switch (status) {
			case ReservationStatus.Confirmed:
				return NEON_VARIANTS.CYAN;
			case ReservationStatus.Pending:
				return NEON_VARIANTS.YELLOW;
			case ReservationStatus.Voided:
				return NEON_VARIANTS.PINK;
			default:
				return NEON_VARIANTS.GREEN;
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.25, ease: 'easeInOut' }}
			className={clsx(
				"relative",
				index === 0 && "rounded-t",
				index === totalCount - 1 && "rounded-b",
				index !== totalCount - 1 && "border-b border-gray-200/20"
			)}
		>
			<ThemeDiv
				className={clsx(
					"p-4 transition-all duration-200",
					index === 0 && "rounded-t",
					index === totalCount - 1 && "rounded-b"
				)}
				isChildren
				neonVariant={getStatusNeonVariant(reservation.status)}
			>
				{/* 헤더: 공연명 + 취소버튼 */}
				<div className="flex items-start justify-between mb-4">
					<div className="flex-1 pr-4">
						<h4 className={clsx(
							"text-lg md:text-xl font-bold",
							theme === "normal" ? "text-gray-900" : "text-white"
						)}>
							{reservation.events?.eventName || '공연명 없음'}
						</h4>
						{/* 매진 상태 표시 (대기중인 예매만) */}
						{isEventSoldOut && reservation.status === ReservationStatus.Pending && (
							<div className={clsx(
								"text-sm font-medium mt-1",
								theme === "normal" ? "text-red-600" :
									theme === "dark" ? "text-red-400" :
										"text-red-300"
							)}>
								매진된 공연입니다
							</div>
						)}
					</div>
					{reservation.status === ReservationStatus.Pending && (
						<Button
							onClick={() => handleCancelReservation(reservation.id)}
							theme="dark"
							padding={"px-3 py-1"}
							disabled={isCancelling}
							reverse={theme === 'normal'}
							fontSize='text-xs md:text-sm'
							className="flex-shrink-0 transition-all duration-200 font-semibold"
						>
							취소
						</Button>
					)}
				</div>

				<div className={clsx(
					"mb-4 p-4 rounded-lg",
					theme === "normal" ? "bg-gray-50 border border-gray-200" :
						theme === "dark" ? "bg-gray-800 border border-gray-600" :
							"bg-gray-900/80 border border-gray-600/80"
				)}>
					{/* 정보 그리드 레이아웃 */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* 공연 일시 */}
						<div className="space-y-1">
							<div className={clsx(
								"text-xs font-medium uppercase tracking-wide",
								theme === "normal" ? "text-gray-500" :
									theme === "dark" ? "text-gray-300" :
										"text-gray-200"
							)}>
								공연 일시
							</div>
							<div className={clsx(
								"text-sm",
								theme === "normal" ? "text-gray-700" :
									theme === "dark" ? "text-white" :
										"text-white"
							)}>
								{reservation.events?.eventDate ? dayjs(reservation.events.eventDate).format('YYYY년 MM월 DD일 HH:mm') : '일정 미정'}
							</div>
						</div>

						{/* 예매자 */}
						<div className="space-y-1">
							<div className={clsx(
								"text-xs font-medium uppercase tracking-wide",
								theme === "normal" ? "text-gray-500" :
									theme === "dark" ? "text-gray-300" :
										"text-gray-200"
							)}>
								예매자
							</div>
							<div className={clsx(
								"text-sm font-medium",
								theme === "normal" ? "text-gray-700" :
									theme === "dark" ? "text-white" :
										"text-white"
							)}>
								{reservation.ticketHolder}
							</div>
						</div>

						{/* 매수 */}
						<div className="space-y-1">
							<div className={clsx(
								"text-xs font-medium uppercase tracking-wide",
								theme === "normal" ? "text-gray-500" :
									theme === "dark" ? "text-gray-300" :
										"text-gray-200"
							)}>
								매수
							</div>
							<div className={clsx(
								"text-sm font-medium",
								theme === "normal" ? "text-gray-700" :
									theme === "dark" ? "text-white" :
										"text-white"
							)}>
								{reservation.quantity}매
							</div>
						</div>
					</div>
				</div>

				{/* 상태별 안내 메시지 */}
				{(() => {
					const statusConfig = {
						[ReservationStatus.Confirmed]: {
							message: "티켓이 발급되었어요!",
							dotColor: "bg-green-500",
							normalBg: "bg-green-50",
							darkBg: "bg-green-900/20"
						},
						[ReservationStatus.Pending]: {
							message: "예매 승인을 기다리고 있어요!",
							dotColor: "bg-yellow-500",
							normalBg: "bg-yellow-50",
							darkBg: "bg-yellow-900/20"
						},
						[ReservationStatus.Voided]: {
							message: "취소된 예매에요!",
							dotColor: "bg-red-500",
							normalBg: "bg-red-50",
							darkBg: "bg-red-900/20"
						}
					};

					const config = statusConfig[reservation.status];
					if (!config) return null;

					return (
						<>
							<ThemeDiv
								className={clsx(
									"mt-3 p-3 rounded-lg",
									theme === 'normal' ? config.normalBg : config.darkBg,
									theme === 'neon' ? '' : 'border-transparent shadow-none'
								)}
								neonVariant={getStatusNeonVariant(reservation.status)}
								isChildren
							>
								<div className={clsx(
									"flex items-center gap-2 text-sm",
									getStatusTextColors(reservation.status, theme)
								)}>
									<span className={clsx("w-2 h-2 rounded-full", config.dotColor)}></span>
									{config.message}
								</div>
							</ThemeDiv>



							{/* 대기중인 예매의 경우 입금 정보 표시 */}
							{reservation.status === ReservationStatus.Pending && paymentAccounts && paymentAccounts.length > 0 && (
								<div className="mt-3">
									<div className="flex justify-center gap-2 mt-3">
										{/* 입금 안내 버튼 */}
										<Button
											onClick={() => {
												if (expandedPaymentInfo === reservation.id) {
													// 접기 버튼 클릭 시 상태 초기화
													setExpandedPaymentInfo(null);
													setHasCheckedStatus(false);
												} else {
													// 매진된 공연인지 확인
													if (isEventSoldOut) {
														showToast({
															message: '매진된 공연입니다',
															iconType: 'warning',
															autoCloseTime: 3000
														});
														return;
													}
													setExpandedPaymentInfo(reservation.id);
												}
											}}
											theme={theme}
											padding="px-3 py-1.5"
											fontSize='text-sm'
										>
											{expandedPaymentInfo === reservation.id ? '접기' : '입금 안내'}
										</Button>
									</div>

									{expandedPaymentInfo === reservation.id && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.2 }}
											className="mt-3 space-y-3"
										>

											{/* 공연 상태 확인 안내 및 버튼 */}
											{!isEventSoldOut && (
												<div className={clsx(
													"px-3 py-2 rounded-lg text-sm",
													theme === "normal" ? "bg-orange-50 border border-orange-200 text-orange-800" :
														theme === "dark" ? "bg-orange-900/20 border border-orange-700/50 text-orange-200" :
															"bg-orange-950/20 border border-orange-600/50 text-orange-200"
												)}>
													<div className="flex items-center justify-between text-xs md:text-sm">
														<span>입금 전 공연 상태를 다시 한번 확인해주세요!</span>
														<Button
															onClick={checkEventStatus}
															theme={theme === 'normal' ? 'dark' : theme}
															padding="px-3 py-1"
															fontSize='text-xs md:text-sm'
															reverse={theme === 'normal'}
															className="font-semibold whitespace-nowrap ml-2"
															disabled={isCheckingStatus}
														>
															{isCheckingStatus ? '확인 중...' : '확인'}
														</Button>
													</div>
												</div>
											)}

											{/* 공연 상태 확인 결과 표시 */}
											{hasCheckedStatus && !isEventSoldOut && (
												<div className={clsx(
													"px-3 py-2 rounded-lg text-sm text-center",
													theme === "normal" ? "bg-green-50 border border-green-200 text-green-800" :
														theme === "dark" ? "bg-green-900/20 border border-green-700/50 text-green-200" :
															"bg-green-950/20 border border-green-600/50 text-green-200"
												)}>
													공연이 매진되지 않았어요! 입금을 진행해주세요.
												</div>
											)}

											{/* 입금해야 할 금액 */}
											<ThemeDiv isChildren className="p-3 rounded-lg">
												<div className="text-center text-sm">
													<div className={clsx(
														"text-xs font-medium uppercase tracking-wide mb-1",
														theme === "normal" ? "text-gray-500" :
															theme === "dark" ? "text-gray-300" :
																"text-gray-200"
													)}>
														입금해야 할 금액
													</div>
													<div className={clsx(
														"font-bold",
														theme === "normal" ? "text-gray-900" :
															theme === "dark" ? "text-white" :
																"text-white"
													)}>
														{((reservation.events?.ticketPrice || 0) * reservation.quantity).toLocaleString()}원
													</div>
												</div>
											</ThemeDiv>

											{/* 입금 계좌 정보 */}
											{paymentAccounts.map((account, index) => (
												<ThemeDiv key={account.id} isChildren className="p-3 rounded-lg">
													{index > 0 && (
														<div className="border-t border-gray-200/20 pt-3 mb-3">
															<p className="text-xs opacity-50 text-center">또는</p>
														</div>
													)}
													<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
														<div className="space-y-1 text-xs">
															<div className={clsx(
																"font-medium uppercase tracking-wide",
																theme === "normal" ? "text-gray-500" :
																	theme === "dark" ? "text-gray-300" :
																		"text-gray-200"
															)}>
																은행
															</div>
															<div className={clsx(
																"font-medium",
																theme === "normal" ? "text-gray-700" :
																	theme === "dark" ? "text-white" :
																		"text-white"
															)}>
																{account.bankName}
															</div>
														</div>
														<div className="space-y-1 text-xs">
															<div className={clsx(
																"font-medium uppercase tracking-wide",
																theme === "normal" ? "text-gray-500" :
																	theme === "dark" ? "text-gray-300" :
																		"text-gray-200"
															)}>
																계좌번호
															</div>
															<div className={clsx(
																"font-mono font-medium",
																theme === "normal" ? "text-gray-700" :
																	theme === "dark" ? "text-white" :
																		"text-white"
															)}>
																{account.accountNumber}
															</div>
														</div>
													</div>
													<div className="mt-3 space-y-1 text-xs">
														<div className={clsx(
															"text-xs font-medium uppercase tracking-wide",
															theme === "normal" ? "text-gray-500" :
																theme === "dark" ? "text-gray-300" :
																	"text-gray-200"
														)}>
															예금주
														</div>
														<div className={clsx(
															"font-medium",
															theme === "normal" ? "text-gray-700" :
																theme === "dark" ? "text-white" :
																	"text-white"
														)}>
															{account.accountHolder}
														</div>
													</div>
													{account.description && (
														<div className={clsx(
															"mt-3 p-3 rounded-lg",
															theme === "normal" ? "bg-gray-50 border border-gray-200" :
																theme === "dark" ? "bg-gray-800/50 border border-gray-600/50" :
																	"bg-gray-900/50 border border-gray-600/50"
														)}>
															<p className={clsx(
																"text-xs",
																theme === "normal" ? "text-gray-700" :
																	theme === "dark" ? "text-gray-300" :
																		"text-gray-300"
															)}>
																{account.description}
															</p>
														</div>
													)}
												</ThemeDiv>
											))}
										</motion.div>
									)}
								</div>
							)}
						</>
					);
				})()}
			</ThemeDiv>
		</motion.div>
	);
};

export default ReservationCard;
