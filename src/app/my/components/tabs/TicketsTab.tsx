'use client'

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { useTicketsWithEventByOwnerId, useCancelAllTicketsByEvent } from '@/hooks/api/useTickets';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { TicketWithEventDto } from '@/types/dto/ticket';
import { Events } from '@/types/model/events';
import TicketStack from '@/components/TicketStack';

interface TicketsTabProps {
	userId: string;
}

// 이벤트 별 그룹
interface EventTicketGroup {
	eventId: string;
	eventName: string;
	tickets: TicketWithEventDto[];
	latestCreatedAt: string;
	eventInfo?: Events;
}

const TicketsTab = ({ userId }: TicketsTabProps) => {
	const { session } = useSession();
	const { showToast } = useToast();
	const { mutate: cancelAllTickets } = useCancelAllTicketsByEvent();

	// 개별 티켓
	const { data: tickets, isLoading, error } = useTicketsWithEventByOwnerId(userId);

	// 데이터가 없으면 빈 배열
	const safeTickets = Array.isArray(tickets) ? tickets : [];

	// 이벤트별로 그룹화
	const eventGroups: EventTicketGroup[] = safeTickets.reduce((groups: EventTicketGroup[], ticket: TicketWithEventDto) => {
		const existingGroup = groups.find(g => g.eventId === ticket.eventId);
		if (existingGroup) {
			existingGroup.tickets.push(ticket);
			if (new Date(ticket.createdAt) > new Date(existingGroup.latestCreatedAt)) {
				existingGroup.latestCreatedAt = ticket.createdAt;
			}
		} else {
			groups.push({
				eventId: ticket.eventId,
				eventName: ticket.event?.eventName || `공연 ${ticket.eventId}`,
				tickets: [ticket],
				latestCreatedAt: ticket.createdAt,
				eventInfo: ticket.event, // 이벤트 정보 추가
			});
		}
		return groups;
	}, []);

	const handleCancelAll = (eventId: string) => {
		if (!session?.user?.id) return;
		if (window.confirm('티켓을 취소 신청하시겠습니까?')) {
			cancelAllTickets(
				{ eventId, userId: session.user.id },
				{
					onSuccess: () => showToast({ message: '모든 티켓이 취소 신청 되었습니다.', iconType: 'success' }),
					onError: (err: any) => showToast({ message: err.message, iconType: 'error' }),
				}
			);
		}
	};

	// 티켓 액션 핸들러
	const handleTicketAction = (ticketIds: string[], action: 'enter' | 'transfer') => {
		if (action === 'enter') {
			// 입장 처리 로직
			showToast({ 
				message: `${ticketIds.length}장의 티켓으로 입장 처리되었습니다.`, 
				iconType: 'success' 
			});
			console.log('입장 처리:', ticketIds);
		} else if (action === 'transfer') {
			// 양도 처리 로직
			showToast({ 
				message: `${ticketIds.length}장의 티켓 양도가 시작되었습니다.`, 
				iconType: 'info' 
			});
			console.log('양도 처리:', ticketIds);
		}
	};

	if (isLoading) {
		return (
			<ThemeDiv className="p-6 text-center rounded-lg" isChildren>
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<p className="text-sm text-gray-600 dark:text-gray-300">티켓 정보를 불러오는 중...</p>
			</ThemeDiv>
		);
	}
	if (error) {
		console.warn('TicketsTab error:', error);
	}
	if (eventGroups.length === 0) {
		return (
			<ThemeDiv className="p-6 text-center rounded-lg" isChildren>
				<h3 className="text-lg font-semibold mb-2">보유한 티켓이 없어요!</h3>
				<p className="text-sm opacity-70">승인된 예매의 티켓이 여기에 표시돼요!</p>
			</ThemeDiv>
		);
	}

	return (
		<div className="space-y-6">
			{eventGroups.map((group, groupIdx) => (
				<TicketStack
					key={group.eventId || `ticket-group-${groupIdx}`}
					eventId={group.eventId}
					eventName={group.eventName}
					tickets={group.tickets}
					latestCreatedAt={group.latestCreatedAt}
					ticketColor={group.eventInfo?.ticketColor || group.tickets[0]?.color || '#3b82f6'} // 이벤트 색상 우선, 없으면 티켓 색상, 없으면 기본색
					eventInfo={group.eventInfo}
					onCancelRequest={handleCancelAll}
					onTicketAction={handleTicketAction}
				/>
			))}
		</div>
	);
};

export default TicketsTab; 