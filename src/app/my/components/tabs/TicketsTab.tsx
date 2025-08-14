'use client'

import { useSession } from '@/hooks/useSession';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useTicketsWithEventByOwnerId } from '@/hooks/api/useTickets';
import { TicketWithEventDto } from '@/types/dto/ticket';
import TicketStack from '@/components/TicketStack';
import { TicketIcon } from '@/components/icon/TicketIcon';
import clsx from 'clsx';

const TicketsTab = () => {
	const { session } = useSession();
	const theme = useAppSelector((state: RootState) => state.theme.current);

	// 개별 티켓 조회 (rare 티켓 정보 포함)
	const { data: tickets, isLoading, error } = useTicketsWithEventByOwnerId(session?.user?.id || '');

	// 데이터가 없으면 빈 배열
	const safeTickets = Array.isArray(tickets) ? tickets : [];

	if (isLoading) {
		return (
			<ThemeDiv className="p-6 text-center rounded-lg" isChildren>
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<p className={clsx(
					"text-sm",
					theme === "normal" ? "text-gray-600" : "text-gray-400"
				)}>티켓 정보를 불러오는 중...</p>
			</ThemeDiv>
		);
	}
	if (error) {
		console.error('TicketsTab error:', error);
	}
	if (safeTickets.length === 0) {
		return (
			<ThemeDiv className="p-8 text-center rounded" isChildren>
				<div className="mb-6">
					<div className="relative mx-auto w-24 h-24 mb-4">
						{/* 티켓 아이콘 배경 */}
						<div className={clsx(
							"absolute inset-0 rounded-full opacity-20",
							theme === "normal" ? "bg-green-100" : "bg-[var(--neon-green)]/20"
						)}></div>
						{/* 티켓 아이콘 */}
						<div className={clsx(
							"absolute inset-2 rounded-full flex items-center justify-center",
							theme === "normal" ? "bg-green-50" : "bg-[var(--neon-green)]/30"
						)}>
							<TicketIcon className="w-8 h-8 opacity-60" />
						</div>
					</div>
				</div>
				<h3 className="text-base md:text-xl font-bold mb-3">보유한 티켓이 없어요</h3>
				<p className="text-sm opacity-70 mb-6 leading-relaxed">
					예매가 승인되면 티켓이 생성 될거에요!
				</p>
			</ThemeDiv>
		);
	}

	// 그룹화: eventId + reservationId 조합으로 그룹 키 생성
	const groupMap = new Map<string, TicketWithEventDto[]>();
	
	safeTickets.forEach(ticket => {
		const groupKey = `${ticket.eventId}-${ticket.reservationId}`;
		if (!groupMap.has(groupKey)) {
			groupMap.set(groupKey, []);
		}
		groupMap.get(groupKey)!.push(ticket);
	});

	// 그룹을 상태별로 정렬 (Active 우선)
	const sortedGroups = Array.from(groupMap.entries()).sort(([, ticketsA], [, ticketsB]) => {
		// 각 그룹의 주요 상태 결정
		const getGroupStatus = (tickets: TicketWithEventDto[]) => {
			const statusCounts = tickets.reduce((acc, ticket) => {
				acc[ticket.status] = (acc[ticket.status] || 0) + 1;
				return acc;
			}, {} as Record<string, number>);
			
			// 우선순위: Active > CancelRequested > Used > Transferred > Cancelled
			if (statusCounts['active'] > 0) return 0;
			if (statusCounts['cancel_requested'] > 0) return 1;
			if (statusCounts['used'] > 0) return 2;
			if (statusCounts['transferred'] > 0) return 3;
			if (statusCounts['cancelled'] > 0) return 4;
			return 5;
		};
		
		return getGroupStatus(ticketsA) - getGroupStatus(ticketsB);
	});

	return (
		<div className="space-y-6">
			{/* 이벤트 + 예매별로 그룹화 */}
			{sortedGroups.map(([groupKey, groupTickets]) => {
				const firstTicket = groupTickets[0];
				
				// 안전성 검사
				if (!firstTicket || !firstTicket.event) {
					return null;
				}
				
				return (
					<TicketStack
						key={groupKey}
						eventId={firstTicket.eventId}
						eventName={firstTicket.event.eventName || '알 수 없는 공연'}
						tickets={groupTickets}
						latestCreatedAt={firstTicket.createdAt}
						eventInfo={firstTicket.event}
					/>
				);
			})}
		</div>
	);
};

export default TicketsTab; 