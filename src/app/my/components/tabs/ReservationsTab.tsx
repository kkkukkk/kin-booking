'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useSession } from '@/hooks/useSession';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import { useActivePaymentAccounts } from '@/hooks/api/usePaymentAccounts';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { calculateReservationStats } from '@/util/reservationStats';
import clsx from 'clsx';
import { useCancelPendingReservation } from '@/hooks/api/useReservations';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon';
import ClockIcon from '@/components/icon/ClockIcon';
import XCircleIcon from '@/components/icon/XCircleIcon';
import MenuIcon from '@/components/icon/MenuIcon';
import { useAlert } from '@/providers/AlertProvider';
import { AnimatePresence } from 'framer-motion';
import { ReservationStatus } from '@/types/model/reservation';
import { ReservationWithEventDto } from '@/types/dto/reservation';
import ReservationsGuide from './reservation/ReservationsGuide';
import ReservationCard from './reservation/ReservationCard';

const FILTERS = [
	{ key: 'all', label: '전체', icon: MenuIcon },
	{ key: ReservationStatus.Confirmed, label: '확정', icon: CheckCircleIcon, neonColor: 'cyan' as const },
	{ key: ReservationStatus.Pending, label: '대기', icon: ClockIcon, neonColor: 'yellow' as const },
	{ key: ReservationStatus.Voided, label: '취소', icon: XCircleIcon, neonColor: 'pink' as const },
];

const ReservationsTab = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const searchParams = useSearchParams();
	const { session } = useSession();
	const { data: reservations, isLoading: reservationsLoading } = useReservationsByUserId(session?.user?.id || '');
	const { data: paymentAccounts } = useActivePaymentAccounts();
	const { mutate: cancelReservation, isPending: isCancelling } = useCancelPendingReservation();
	const { showAlert } = useAlert();
	const [activeFilter, setActiveFilter] = useState('all');
	const [expandedPaymentInfo, setExpandedPaymentInfo] = useState<string | null>(null);

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
				<ReservationsGuide />

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
		: displayReservations.filter((r: ReservationWithEventDto) => r.status === activeFilter)
	).sort((a: ReservationWithEventDto, b: ReservationWithEventDto) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime());

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
				<ReservationsGuide />
			</div>
			{/* 예매 리스트 */}
			<div className="space-y-0 md:space-y-0.5">
				<AnimatePresence>
					{filteredReservations.length > 0
						? filteredReservations.map((reservation: ReservationWithEventDto, index: number) => (
							<ReservationCard
								key={reservation.id}
								reservation={reservation}
								index={index}
								totalCount={filteredReservations.length}
								theme={theme}
								paymentAccounts={paymentAccounts || []}
								expandedPaymentInfo={expandedPaymentInfo}
								setExpandedPaymentInfo={setExpandedPaymentInfo}
								handleCancelReservation={handleCancelReservation}
								isCancelling={isCancelling}
							/>
						))
						: null}
				</AnimatePresence>
			</div>
		</>
	);
};

export default ReservationsTab; 