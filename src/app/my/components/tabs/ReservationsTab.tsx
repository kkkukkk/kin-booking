'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
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
import { ReservationStatus} from '@/types/model/reservation';
import { FetchReservationResponseDto } from '@/types/dto/reservation';

interface ReservationsTabProps {
	reservations: FetchReservationResponseDto | undefined;
}

const FILTERS = [
	{ key: 'all', label: '전체', icon: MenuIcon },
	{ key: ReservationStatus.Confirmed, label: '확정', icon: CheckCircleIcon },
	{ key: ReservationStatus.Pending, label: '대기', icon: ClockIcon },
	{ key: ReservationStatus.Cancelled, label: '취소', icon: XCircleIcon },
];

const ReservationsTab = ({ reservations }: ReservationsTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const { mutate: cancelReservation, isPending: isCancelling } = useCancelPendingReservation();
	const { showAlert } = useAlert();
	const [activeFilter, setActiveFilter] = useState('all');
	
	// 실제 데이터가 없으면 테스트 데이터 사용
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
			<ThemeDiv className="p-8 text-center rounded-lg">
				<TicketIcon />
				<h3 className="text-lg font-semibold mb-2">예매 내역이 없어요</h3>
				<p className="text-sm opacity-70 mb-4">새로운 공연을 예매해보세요!</p>
				<Button
					onClick={() => router.push('/events')}
					theme="dark"
				>
					공연 보러 가기
				</Button>
			</ThemeDiv>
		);
	}

	// 필터링된 리스트
	const filteredReservations = activeFilter === 'all'
		? displayReservations
		: displayReservations.filter((r: any) => r.status === activeFilter);

	return (
		<div>
			{/* 통계 필터 버튼 */}
			<div className="flex gap-2 mb-4 items-center">
				{FILTERS.map(({ key, label, icon: Icon }) => (
					<Button
						key={key}
						theme={theme}
						padding={"py-2"}
						onClick={() => setActiveFilter(key)}
						className={clsx(
							'flex flex-col items-center justify-center transition font-semibold flex-1 md:flex-row md:gap-1.5',
						)}
						reverse={theme === 'normal'}
						light={activeFilter !== key}
						on={activeFilter === key}
					>
						<Icon className="w-5 h-5 mb-1 flex items-center justify-center md:m-0" />
						<span className="text-xs md:text-sm">{label}</span>
						<span className="text-base font-bold mt-0.5">
							{key === ReservationStatus.Confirmed && stats.confirmedCount}
							{key === ReservationStatus.Pending && stats.pendingCount}
							{key === ReservationStatus.Cancelled && stats.cancelledCount}
							{key === 'all' && displayReservations.length}
						</span>
					</Button>
				))}
			</div>
			<Accordion title="예매 안내" className="mb-4">
				<ul className="list-disc pl-4 space-y-1">
					<li>예매 승인 완료 후에 티켓이 발급됩니다.</li>
					<li>예매 취소는 <b>예매 대기</b> 상태일 때만 가능합니다.</li>
					<li>티켓 취소는 <b>티켓 관리 탭</b>을 이용해 주세요.</li>
				</ul>
			</Accordion>
			{/* 예매 리스트 */}
			<div className="space-y-3">
				<AnimatePresence>
					{filteredReservations.length > 0
						? filteredReservations.map((reservation: any) => (
							<motion.div
								key={reservation.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								transition={{ duration: 0.25, ease: 'easeInOut' }}
							>
								<ThemeDiv 
									className={clsx(
										"p-4 rounded-xl transition-all duration-200"
									)} 
									isChildren
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
													{new Date(reservation.reservedAt).toLocaleDateString('ko-KR')}
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
													예매 취소
												</Button>
											)}
										</div>
									</div>
									
									{/* 상태별 안내 메시지 */}
									{reservation.status === ReservationStatus.Confirmed && (
										<div className={clsx(
											"mt-3 p-3 rounded-lg",
											theme === 'normal' ? 'bg-green-50' : 'bg-green-900/20'
										)}>
											<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors(ReservationStatus.Confirmed, theme))}>
												<span className="w-2 h-2 bg-green-500 rounded-full"></span>
												{"티켓이 발급되었어요!"}
											</div>
										</div>
									)}
									{reservation.status === ReservationStatus.Pending && (
										<div className={clsx(
											"mt-3 p-3 rounded-lg",
											theme === 'normal' ? 'bg-yellow-50' : 'bg-yellow-900/20'
										)}>
											<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors(ReservationStatus.Pending, theme))}>
												<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
												{"예매 승인을 기다리고 있어요!"}
											</div>
										</div>
									)}
									{reservation.status === ReservationStatus.Cancelled && (
										<div className={clsx(
											"mt-3 p-3 rounded-lg",
											theme === 'normal' ? 'bg-red-50' : 'bg-red-900/20'
										)}>
											<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors(ReservationStatus.Cancelled, theme))}>
												<span className="w-2 h-2 bg-red-500 rounded-full"></span>
												{"취소된 예매에요."}
											</div>
										</div>
									)}
								</ThemeDiv>
							</motion.div>
						))
						: null}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default ReservationsTab; 