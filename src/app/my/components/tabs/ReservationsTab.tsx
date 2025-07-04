'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { calculateReservationStats } from '@/util/reservationStats';
import clsx from 'clsx';
import { getStatusInfoColors } from '@/components/base/StatusBadge';
import { useCancelPendingReservation } from '@/hooks/api/useReservations';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon';
import ClockIcon from '@/components/icon/ClockIcon';
import XCircleIcon from '@/components/icon/XCircleIcon';
import MenuIcon from '@/components/icon/MenuIcon';

interface ReservationsTabProps {
	reservations: any;
}

const FILTERS = [
	{ key: 'all', label: '전체', icon: MenuIcon },
	{ key: 'confirmed', label: '확정', icon: CheckCircleIcon },
	{ key: 'pending', label: '대기', icon: ClockIcon },
	{ key: 'cancelled', label: '취소', icon: XCircleIcon },
];

const ReservationsTab = ({ reservations }: ReservationsTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const { mutate: cancelReservation, isPending: isCancelling } = useCancelPendingReservation();
	const [activeFilter, setActiveFilter] = useState('all');
	
	// 테스트용 하드코딩 데이터
	const testReservations = [
		{
			id: 1,
			eventName: "2024 봄맞이 클래식 콘서트",
			status: "confirmed",
			reservedAt: "2024-03-15T10:30:00Z",
			quantity: 2,
			ticketHolder: "김철수"
		},
		{
			id: 2,
			eventName: "재즈 나이트 - 스윙의 밤",
			status: "pending",
			reservedAt: "2024-03-20T14:15:00Z",
			quantity: 1,
			ticketHolder: "김철수"
		},
		{
			id: 3,
			eventName: "K-POP 스타 라이브",
			status: "cancelled",
			reservedAt: "2024-03-10T09:00:00Z",
			quantity: 3,
			ticketHolder: "김철수"
		},
		{
			id: 4,
			eventName: "오페라 갈라 공연 - 라 트라비아타",
			status: "confirmed",
			reservedAt: "2024-03-25T19:30:00Z",
			quantity: 1,
			ticketHolder: "김철수"
		}
	];
	
	// 실제 데이터가 없으면 테스트 데이터 사용
	const displayReservations = reservations?.data && reservations.data.length > 0 ? reservations.data : testReservations;

	const stats = calculateReservationStats(displayReservations);

	const handleCancelReservation = (reservationId: string) => {
		if (window.confirm('정말 이 예매를 취소하시겠습니까?')) {
			cancelReservation(reservationId);
		}
	};

	if (displayReservations.length === 0) {
		return (
			<ThemeDiv className="p-8 text-center rounded-lg">
				<TicketIcon />
				<h3 className="text-lg font-semibold mb-2">예매 내역이 없습니다</h3>
				<p className="text-sm opacity-70 mb-4">첫 번째 공연을 예매해보세요!</p>
				<Button
					onClick={() => router.push('/events')}
					theme="dark"
				>
					공연 보기
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
			<div className="flex gap-2 mb-4">
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
							{key === 'confirmed' && stats.confirmedCount}
							{key === 'pending' && stats.pendingCount}
							{key === 'cancelled' && stats.cancelledCount}
							{key === 'all' && displayReservations.length}
						</span>
					</Button>
				))}
			</div>
			{/* 예매 리스트 */}
			<div className="space-y-3">
				{filteredReservations.map((reservation: any) => (
					<ThemeDiv 
						key={reservation.id} 
						className={clsx(
							"p-5 rounded-xl border hover:shadow-md transition-all duration-200",
							theme === 'normal' ? 'border-gray-200' : 'border-gray-700'
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
										<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
										{new Date(reservation.reservedAt).toLocaleDateString('ko-KR')}
									</span>
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
										{reservation.quantity}
									</span>
									<span className="flex items-center gap-1">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
										{reservation.ticketHolder}
									</span>
								</div>
							</div>
							<div className="flex flex-col items-center gap-2">
								{reservation.status === 'pending' && (
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
						
						{/* 상태별 안내 메시지: 아래에 항상 표시 */}
						{reservation.status === 'confirmed' && (
							<div className={clsx(
								"mt-3 p-3 rounded-lg",
								theme === 'normal' ? 'bg-green-50' : 'bg-green-900/20'
							)}>
								<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors('confirmed', theme))}>
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									티켓이 발급되었어요! 티켓 관리 탭에서 확인하세요.
								</div>
							</div>
						)}
						{reservation.status === 'pending' && (
							<div className={clsx(
								"mt-3 p-3 rounded-lg",
								theme === 'normal' ? 'bg-yellow-50' : 'bg-yellow-900/20'
							)}>
								<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors('pending', theme))}>
									<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
									예매 승인을 기다리고 있어요!
								</div>
							</div>
						)}
						{reservation.status === 'cancelled' && (
							<div className={clsx(
								"mt-3 p-3 rounded-lg",
								theme === 'normal' ? 'bg-gray-100' : 'bg-gray-800/40'
							)}>
								<div className={clsx("flex items-center gap-2 text-sm", getStatusInfoColors('cancelled', theme))}>
									<span className="w-2 h-2 bg-gray-400 rounded-full"></span>
									예매가 취소되었습니다.
								</div>
							</div>
						)}
					</ThemeDiv>
				))}
			</div>
		</div>
	);
};

export default ReservationsTab; 