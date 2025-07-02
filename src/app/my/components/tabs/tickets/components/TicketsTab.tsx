'use client'

import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { useTicketGroupsByOwnerId, useCancelAllTicketsByEvent } from '@/hooks/api/useTickets';
import { TicketGroupDto } from '@/types/dto/ticket';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { TicketStatus } from '@/types/model/ticket';
import TicketCard from '@/components/base/Ticket';

interface TicketsTabProps {
	userId: string;
}

// 티켓 타입 정의 (필요시 실제 모델 import)
interface TicketItem {
	id: string;
	status: TicketStatus;
	seatNumber?: string;
	qrCode?: string;
}

const TicketsTab = ({ userId }: TicketsTabProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { session } = useSession();
	const { showToast } = useToast();
	const { mutate: cancelAllTickets } = useCancelAllTicketsByEvent();

	// API로 티켓 그룹 조회
	const { data: ticketGroups, isLoading, error } = useTicketGroupsByOwnerId(userId);
	
	// 테스트용 하드코딩 데이터 (API 데이터가 없을 때 사용)
	const testTicketGroups: (TicketGroupDto & { eventId: string; tickets: TicketItem[] })[] = [
		{
			eventId: 'test-1',
			eventName: "2024 봄맞이 클래식 콘서트",
			totalCount: 2,
			activeCount: 2,
			usedCount: 0,
			cancelledCount: 0,
			latestCreatedAt: "2024-03-15T10:30:00Z",
			tickets: [
				{ id: 't1', status: TicketStatus.Active },
				{ id: 't2', status: TicketStatus.Active },
			],
		},
		{
			eventId: 'test-2',
			eventName: "오페라 갈라 공연 - 라 트라비아타",
			totalCount: 1,
			activeCount: 0,
			usedCount: 1,
			cancelledCount: 0,
			latestCreatedAt: "2024-03-25T19:30:00Z",
			tickets: [
				{ id: 't3', status: TicketStatus.Used },
			],
		},
		{
			eventId: 'test-3',
			eventName: "K-POP 스타 라이브",
			totalCount: 1,
			activeCount: 1,
			usedCount: 0,
			cancelledCount: 0,
			latestCreatedAt: "2024-03-10T09:00:00Z",
			tickets: [
				{ id: 't4', status: TicketStatus.Active },
			],
		},
		{
			eventId: 'test-4',
			eventName: "재즈 나이트 - 스윙의 밤",
			totalCount: 1,
			activeCount: 0,
			usedCount: 0,
			cancelledCount: 1,
			latestCreatedAt: "2024-03-20T14:15:00Z",
			tickets: [
				{ id: 't5', status: TicketStatus.Cancelled },
			],
		},
	];
	
	// 실제 데이터가 없으면 테스트 데이터 사용
	const displayTicketGroups = (ticketGroups && ticketGroups.length > 0) ? ticketGroups : testTicketGroups;
	const safeTicketGroups = Array.isArray(displayTicketGroups) ? displayTicketGroups : testTicketGroups;

	const handleCancelAll = (eventId: string) => {
		if (!session?.user?.id) return;
		if (window.confirm('티켓을 취소 신청하시겠습니까?')) {
			cancelAllTickets(
				{ eventId, userId: session.user.id },
				{
					onSuccess: () => showToast({ message: '모든 티켓이 취소되었습니다.', iconType: 'success' }),
					onError: (err: any) => showToast({ message: err.message, iconType: 'error' }),
				}
			);
		}
	};

	if (isLoading) {
		return (
			<ThemeDiv className="p-8 text-center rounded-lg">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<p className="text-sm text-gray-600 dark:text-gray-300">티켓 정보를 불러오는 중...</p>
			</ThemeDiv>
		);
	}
	if (error) {
		console.warn('TicketsTab error:', error);
	}
	if (safeTicketGroups.length === 0) {
		return (
			<ThemeDiv className="p-8 text-center rounded-lg">
				<TicketIcon />
				<h3 className="text-lg font-semibold mb-2">보유한 티켓이 없습니다</h3>
				<p className="text-sm opacity-70">승인된 예매의 티켓이 여기에 표시됩니다.</p>
			</ThemeDiv>
		);
	}
	return (
		<div className="space-y-3">
			{safeTicketGroups.map((group, groupIdx) => {
				// 그룹 상태 결정: 여러 상태가 섞일 일 없으니 우선순위대로 체크
				const cancelRequestedCount = group.tickets.filter(t => t.status === TicketStatus.CancelRequested).length;
				let status = TicketStatus.Active;
				if (cancelRequestedCount > 0) status = TicketStatus.CancelRequested;
				else if (group.cancelledCount && group.cancelledCount > 0) status = TicketStatus.Cancelled;
				else if (group.usedCount && group.usedCount > 0) status = TicketStatus.Used;
				// (추가: transferredCount 등 필요시 확장)
				return (
					<TicketCard
						key={group.eventId || `ticket-group-${groupIdx}`}
						eventName={group.eventName || '알 수 없는 공연'}
						ticketCount={group.totalCount || 0}
						status={status}
						latestCreatedAt={group.latestCreatedAt}
					/>
				);
			})}
		</div>
	);
};

export default TicketsTab; 