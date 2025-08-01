'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useSession } from '@/hooks/useSession';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { calculateReservationStats } from '@/util/reservationStats';
import clsx from 'clsx';
import { getStatusInfoColors } from '@/components/status/StatusBadge';
import { useCancelPendingReservation } from '@/hooks/api/useReservations';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon';
import ClockIcon from '@/components/icon/ClockIcon';
import XCircleIcon from '@/components/icon/XCircleIcon';
import MenuIcon from '@/components/icon/MenuIcon';
import { useAlert } from '@/providers/AlertProvider';
import Accordion from '@/components/base/Accordion';
import { AnimatePresence, motion } from 'framer-motion';
import { ReservationStatus, Reservation } from '@/types/model/reservation';
import dayjs from 'dayjs';
import { NeonVariant, NEON_VARIANTS } from '@/types/ui/neonVariant';

interface ReservationsTabProps {}

const FILTERS = [
	{ key: 'all', label: '전체', icon: MenuIcon },
	{ key: ReservationStatus.Confirmed, label: '확정', icon: CheckCircleIcon, neonColor: 'cyan' as const },
	{ key: ReservationStatus.Pending, label: '대기', icon: ClockIcon, neonColor: 'yellow' as const },
	{ key: ReservationStatus.Voided, label: '취소', icon: XCircleIcon, neonColor: 'pink' as const },
];

// 상태별 neonVariant 매핑
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

const ReservationsTab = ({}: ReservationsTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { session } = useSession();
	const { data: reservations, isLoading: reservationsLoading } = useReservationsByUserId(session?.user?.id || '');
	const { mutate: cancelReservation, isPending: isCancelling } = useCancelPendingReservation();
	const { showAlert } = useAlert();
	const [activeFilter, setActiveFilter] = useState('all');

	// URL 파라미터에서 필터 설정
	useEffect(() => {
		const filterParam = searchParams.get('filter');
		if (filterParam && ['all', ReservationStatus.Confirmed, ReservationStatus.Pending, ReservationStatus.Voided].includes(filterParam)) {
			setActiveFilter(filterParam);
		}
	}, [searchParams]);
	
	// 실제 데이터가 없으면 빈 배열 사용
	const displayReservations = reservations?.data || [];

	const stats = calculateReservationStats(displayReservations);

	const handleCancelReservation = async (reservationId: string) => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '예매 취소',
			message: '정말 예매 신청을 취소하시겠습니까?'
		});
		if (confirmed) {
			cancelReservation(reservationId);
		}
	};

	if (displayReservations.length === 0) {
		return (
			<>
				{/* 예매 안내 */}
				<Accordion 
					title=" 예매 안내" 
					className="rounded shadow-inner mb-4"
				>
					<div>
						<ul className="text-xs md:text-sm space-y-1.5">
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>예매 승인 완료 후에 티켓이 발급됩니다.</span>
							</li>
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>예매 취소는 <b>예매 대기</b> 상태일 때만 가능합니다.</span>
							</li>
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>티켓 취소는 <b>티켓 관리 탭</b>을 이용해 주세요.</span>
							</li>
						</ul>
					</div>
				</Accordion>

				{/* 빈 상태 */}
				<ThemeDiv className="p-8 text-center rounded flex flex-col items-center justify-center" isChildren>
					<div className="mb-6">
						<div className="relative mx-auto w-24 h-24 mb-4">
							{/* 티켓 아이콘 배경 */}
							<div className={clsx(
								"absolute inset-0 rounded-full opacity-20",
								theme === "normal" ? "bg-cyan-100" : "bg-[var(--neon-cyan)]/20"
							)}></div>
							{/* 티켓 아이콘 */}
							<div className={clsx(
								"absolute inset-2 rounded-full flex items-center justify-center",
								theme === "normal" ? "bg-cyan-50" : "bg-[var(--neon-cyan)]/30"
							)}>
								<TicketIcon className="w-8 h-8 opacity-60" />
							</div>
						</div>
					</div>
					<h3 className="text-base font-bold mb-3">예매 내역이 없어요</h3>
					<p className="text-sm opacity-70 mb-6 md:mb-10 leading-relaxed">
						아직 예매한 공연이 없어요<br />
						멋진 공연을 찾아보세요!
					</p>
					<Button
						onClick={() => router.push('/events')}
						theme="dark"
						padding="px-6 py-2"
						className="w-full md:w-auto"
					>
						공연 보러 가기
					</Button>
				</ThemeDiv>
			</>
		);
	}

	// 필터링된 리스트 (날짜 내림차순 정렬)
	const filteredReservations = (activeFilter === 'all'
		? displayReservations
		: displayReservations.filter((r: Reservation & { eventName?: string }) => r.status === activeFilter)
	).sort((a: Reservation & { eventName?: string }, b: Reservation & { eventName?: string }) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime());

	return (
		<>
			{/* 통계 필터 버튼 */}
			<div className="flex gap-1 mb-4 items-center">
				{FILTERS.map(({ key, label, icon: Icon, neonColor }) => (
					<Button
						key={key}
						theme={theme}
						padding={"px-3 py-2 md:px-4"}
						onClick={() => {
							setActiveFilter(key);
							// URL 업데이트 (필터 변경 시)
							const newUrl = new URL(window.location.href);
							newUrl.searchParams.set('filter', key);
							router.replace(newUrl.pathname + newUrl.search);
						}}
						className={clsx(
							'flex flex-col items-center justify-center md:flex-row md:gap-2 transition-all duration-200 font-medium flex-1 md:flex-none',
						)}
						reverse={theme === 'normal'}
						on={activeFilter === key}
						neonVariant={neonColor}
					>
						<Icon className="w-4 h-4 mb-1 md:mb-0" />
						<span className="text-xs md:text-sm">{label}</span>
						<span className={clsx(
							"mt-0.5 md:mt-0 md:ml-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full text-xs font-bold",
							theme === "normal" && "bg-blue-100 text-blue-700",
							theme === "dark" && "bg-gray-600 text-gray-200",
							theme === "neon" && "bg-cyan-900/50 text-cyan-300"
						)}>
							{key === ReservationStatus.Confirmed && stats.confirmedCount}
							{key === ReservationStatus.Pending && stats.pendingCount}
							{key === ReservationStatus.Voided && stats.voidedCount}
							{key === 'all' && displayReservations.length}
						</span>
					</Button>
				))}
			</div>
			<div className="mb-4">
				<Accordion 
					title=" 예매 안내" 
					className="rounded shadow-inner p-1"
				>
					<div>
						<ul className="text-xs md:text-sm space-y-1.5">
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>예매 승인 완료 후에 티켓이 발급됩니다.</span>
							</li>
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>예매 취소는 <b>예매 대기</b> 상태일 때만 가능합니다.</span>
							</li>
							<li className="flex items-center gap-2">
								<div className={clsx(
									"w-1.5 h-1.5 rounded-full flex-shrink-0",
									theme === "normal" ? "bg-black/60" : "bg-white/60"
								)}></div>
								<span>티켓 취소는 <b>티켓 관리 탭</b>을 이용해 주세요.</span>
							</li>
						</ul>
					</div>
				</Accordion>
			</div>
			{/* 예매 리스트 */}
			<div className="space-y-0">
				<AnimatePresence>
					{filteredReservations.length > 0
						? filteredReservations.map((reservation: Reservation & { eventName?: string }, index: number) => (
							<motion.div
								key={reservation.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.25, ease: 'easeInOut' }}
								className={clsx(
									"relative",
									index === 0 && "rounded-t",
									index === filteredReservations.length - 1 && "rounded-b",
									index !== filteredReservations.length - 1 && "border-b border-gray-200/20"
								)}
							>
								<ThemeDiv 
									className={clsx(
										"p-4 transition-all duration-200",
										index === 0 && "rounded-t",
										index === filteredReservations.length - 1 && "rounded-b"
									)} 
									isChildren
									neonVariant={getStatusNeonVariant(reservation.status)}
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<h4 className="text-lg font-semibold mb-1">{reservation.eventName}</h4>
											<div className={clsx(
												"flex items-center gap-4 text-sm",
												theme === 'normal' ? 'text-gray-600' : 'text-gray-300'
											)}>
												<span className="flex items-center gap-1">
													<span className="w-2 h-2 bg-green-500 rounded-full"></span>
													{reservation.ticketHolder}
												</span>
												<span className="flex items-center gap-1">
													<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
													{`${reservation.quantity}매`}
												</span>
												<span className="flex items-center gap-1">
													<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
													{dayjs(reservation.reservedAt).format('YYYY년 MM월 DD일')}
												</span>
											</div>
										</div>
										<div className="flex flex-col items-center gap-2">
											{reservation.status === ReservationStatus.Pending && (
												<Button
													onClick={() => handleCancelReservation(reservation.id)}
													theme="dark"
													padding={"px-1.5 py-0.5"}
													disabled={isCancelling}
												>
													취소
												</Button>
											)}
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
											<ThemeDiv
												className={clsx(
													"mt-3 p-3 rounded-lg",
													theme === 'normal' ? config.normalBg : config.darkBg,
													theme === 'neon' ? '' : 'border-none shadow-none'
												)}
												neonVariant={getStatusNeonVariant(reservation.status)}
												isChildren
											>
												<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors(reservation.status, theme))}>
													<span className={clsx("w-2 h-2 rounded-full", config.dotColor)}></span>
													{config.message}
												</div>
											</ThemeDiv>
										);
									})()}
								</ThemeDiv>
							</motion.div>
						))
						: null}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ReservationsTab; 