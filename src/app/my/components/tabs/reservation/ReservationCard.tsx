'use client'

import { motion } from 'framer-motion';
import { ReservationStatus } from '@/types/model/reservation';
import { ReservationWithEventDto } from '@/types/dto/reservation';
import { PaymentAccount } from '@/types/model/paymentAccount';
import { NeonVariant, NEON_VARIANTS } from '@/types/ui/neonVariant';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { getStatusTextColors } from '@/components/status/StatusBadge';
import clsx from 'clsx';
import dayjs from 'dayjs';

interface ReservationCardProps {
	reservation: ReservationWithEventDto;
	index: number;
	totalCount: number;
	theme: string;
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
					<h4 className={clsx(
						"text-lg md:text-xl font-bold flex-1 pr-4",
						theme === "normal" ? "text-gray-900" : "text-white"
					)}>
						{reservation.events?.eventName || '공연명 없음'}
					</h4>
					{reservation.status === ReservationStatus.Pending && (
						<Button
							onClick={() => handleCancelReservation(reservation.id)}
							theme="dark"
							padding={"px-3 py-1"}
							disabled={isCancelling}
							reverse={theme === 'normal'}
							className="flex-shrink-0 transition-all duration-200 text-xs md:text-sm"
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
									<Button
										onClick={() => setExpandedPaymentInfo(
											expandedPaymentInfo === reservation.id ? null : reservation.id
										)}
										theme="dark"
										padding="px-3 py-1.5"
										reverse={theme === 'normal'}
										className="w-full"
										fontSize='text-sm'
									>
										{expandedPaymentInfo === reservation.id ? '입금 정보 닫기' : '입금 정보 확인'}
									</Button>
									
									{expandedPaymentInfo === reservation.id && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.2 }}
											className="mt-3 space-y-3"
										>
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
														<div className={`mt-3 p-3 rounded-lg ${
															theme === 'normal' 
																? 'bg-amber-50 border border-amber-200' 
																: theme === 'neon'
																? 'bg-amber-950/20 border border-amber-400/50'
																: 'bg-amber-950/30 border border-amber-800/50'
														}`}>
															<p className={`text-xs ${
																theme === 'normal'
																	? 'text-amber-800'
																	: theme === 'neon'
																	? 'text-amber-200'
																	: 'text-amber-200'
															}`}>
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
