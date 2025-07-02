'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { TicketIcon } from '@/components/icon/TicketIcon';

interface ReservationsTabProps {
	reservations: any;
}

const ReservationsTab = ({ reservations }: ReservationsTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	
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
	
	return (
		<div className="space-y-3">
			{displayReservations.map((reservation: any) => (
				<ThemeDiv key={reservation.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" isChildren>
					<div className="flex items-start justify-between mb-3">
						<div className="flex-1">
							<h4 className="text-lg font-semibold mb-1">{reservation.eventName}</h4>
							<div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
								<span className="flex items-center gap-1">
									<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
									{new Date(reservation.reservedAt).toLocaleDateString('ko-KR')}
								</span>
								<span className="flex items-center gap-1">
									<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
									{reservation.quantity}매
								</span>
								<span className="flex items-center gap-1">
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									{reservation.ticketHolder}
								</span>
							</div>
						</div>
						<div className="flex flex-col items-end gap-2">
							<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
								reservation.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
								reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
								'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
							}`}>
								{reservation.status === 'confirmed' ? '확정' :
								 reservation.status === 'pending' ? '대기중' : '취소'}
							</span>
						</div>
					</div>
					
					{/* 상태별 추가 정보 */}
					{reservation.status === 'confirmed' && (
						<div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
							<div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
								<span className="w-2 h-2 bg-green-500 rounded-full"></span>
								티켓이 발급되었습니다. 티켓 관리 탭에서 확인하세요.
							</div>
						</div>
					)}
					
					{reservation.status === 'pending' && (
						<div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
							<div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
								<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
								예매 승인을 기다리고 있습니다.
							</div>
						</div>
					)}
				</ThemeDiv>
			))}
		</div>
	);
};

export default ReservationsTab; 