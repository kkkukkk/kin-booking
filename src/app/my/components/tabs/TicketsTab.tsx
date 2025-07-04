'use client'

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { useTicketsWithEventByOwnerId, useCancelAllTicketsByEvent } from '@/hooks/api/useTickets';
import { Ticket } from '@/types/model/ticket';
import { Events } from '@/types/model/events';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { TicketStatus } from '@/types/model/ticket';
import TicketStack from '@/components/TicketStack';

interface TicketsTabProps {
	userId: string;
}

// 이벤트별로 그룹화된 티켓들
interface EventTicketGroup {
	eventId: string;
	eventName: string;
	tickets: Ticket[];
	latestCreatedAt: string;
	eventInfo?: Events; // 이벤트 정보 추가
}

const TicketsTab = ({ userId }: TicketsTabProps) => {
	const { session } = useSession();
	const { showToast } = useToast();
	const { mutate: cancelAllTickets } = useCancelAllTicketsByEvent();

	// 개별 티켓들을 가져옴
	const { data: tickets, isLoading, error } = useTicketsWithEventByOwnerId(userId);
	
	// 테스트용 이벤트 정보 (실제로는 API에서 가져와야 함)
	const testEventInfo: Record<string, Events> = {
		'test-1': {
			id: 1,
			eventName: '봄맞이 클래식 콘서트',
			eventDate: '2024-04-15T19:30:00Z',
			location: '예술의전당',
			description: '봄을 맞이하는 특별한 클래식 공연',
			createdAt: '2024-03-01T00:00:00Z',
			status: 'ongoing' as any,
			seatCapacity: 1000,
			ticketPrice: 50000,
			ticketColor: 'linear-gradient(135deg, #4fc3f7 0%, #29b6f6 50%, #0288d1 100%)',
		},
		'test-2': {
			id: 2,
			eventName: '재즈 나이트',
			eventDate: '2024-03-25T20:00:00Z',
			location: '블루노트',
			description: '즐거운 재즈 공연',
			createdAt: '2024-02-15T00:00:00Z',
			status: 'completed' as any,
			seatCapacity: 200,
			ticketPrice: 30000,
			ticketColor: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 50%, #388e3c 100%)',
		},
		'test-3': {
			id: 3,
			eventName: '팝스 오케스트라',
			eventDate: '2024-05-10T14:00:00Z',
			location: '세종문화회관',
			description: '대중음악을 클래식으로',
			createdAt: '2024-03-01T00:00:00Z',
			status: 'ongoing' as any,
			seatCapacity: 1500,
			ticketPrice: 40000,
			ticketColor: 'linear-gradient(135deg, #ab47bc 0%, #9c27b0 50%, #7b1fa2 100%)',
		},
		'test-4': {
			id: 4,
			eventName: '뮤지컬 갈라쇼',
			eventDate: '2024-03-20T15:00:00Z',
			location: '예술의전당',
			description: '최고의 뮤지컬 넘버들',
			createdAt: '2024-02-20T00:00:00Z',
			status: 'completed' as any,
			seatCapacity: 800,
			ticketPrice: 60000,
			ticketColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 50%, #ff5252 100%)',
		},
		'test-5': {
			id: 5,
			eventName: '서울 록 페스티벌',
			eventDate: '2024-06-15T18:00:00Z',
			location: '올림픽공원',
			description: '한국 최대 규모의 록 페스티벌',
			createdAt: '2024-02-01T00:00:00Z',
			status: 'ongoing' as any,
			seatCapacity: 5000,
			ticketPrice: 80000,
			ticketColor: 'linear-gradient(135deg, #ff7043 0%, #ff5722 50%, #d84315 100%)',
		},
		'test-6': {
			id: 6,
			eventName: '백조의 호수',
			eventDate: '2024-03-18T19:00:00Z',
			location: '예술의전당',
			description: '차이콥스키의 걸작 발레',
			createdAt: '2024-02-10T00:00:00Z',
			status: 'completed' as any,
			seatCapacity: 600,
			ticketPrice: 70000,
			ticketColor: 'linear-gradient(135deg, #26a69a 0%, #00897b 50%, #00695c 100%)',
		},
		'test-7': {
			id: 7,
			eventName: '라 트라비아타',
			eventDate: '2024-04-20T19:30:00Z',
			location: '예술의전당',
			description: '베르디의 대표 오페라',
			createdAt: '2024-03-05T00:00:00Z',
			status: 'ongoing' as any,
			seatCapacity: 1200,
			ticketPrice: 90000,
			ticketColor: 'linear-gradient(135deg, #8d6e63 0%, #6d4c41 50%, #4e342e 100%)',
		},
		'test-8': {
			id: 8,
			eventName: '국악의 밤',
			eventDate: '2024-03-22T20:00:00Z',
			location: '국립국악원',
			description: '전통 국악의 아름다움',
			createdAt: '2024-02-25T00:00:00Z',
			status: 'completed' as any,
			seatCapacity: 400,
			ticketPrice: 25000,
			ticketColor: 'linear-gradient(135deg, #ffeb3b 0%, #fdd835 50%, #f9a825 100%)',
		},
		'test-9': {
			id: 9,
			eventName: '챔버 음악회',
			eventDate: '2024-04-05T15:00:00Z',
			location: '세종문화회관',
			description: '소규모 실내악 공연',
			createdAt: '2024-03-10T00:00:00Z',
			status: 'ongoing' as any,
			seatCapacity: 300,
			ticketPrice: 35000,
			ticketColor: 'linear-gradient(135deg, #ffa726 0%, #ff9800 50%, #ff8f00 100%)',
		},
	};

	// 테스트용 하드코딩 데이터 (API 데이터가 없을 때 사용)
	const goldGradient = 'linear-gradient(135deg, #ffd700 0%, #fffbe6 100%)';
	const testTickets: Ticket[] = [
		// 봄맞이 클래식 콘서트 - 3장 (1장은 rare)
		{ id: 't1', eventId: 'test-1', status: TicketStatus.Active, ownerId: userId, reservationId: 'r1', createdAt: "2024-03-15T10:30:00Z", updatedAt: "2024-03-15T10:30:00Z", transferredAt: null, color: goldGradient, isRare: true },
		{ id: 't2', eventId: 'test-1', status: TicketStatus.Active, ownerId: userId, reservationId: 'r1', createdAt: "2024-03-15T10:30:00Z", updatedAt: "2024-03-15T10:30:00Z", transferredAt: null, color: testEventInfo['test-1'].ticketColor, isRare: false },
		{ id: 't3', eventId: 'test-1', status: TicketStatus.Active, ownerId: userId, reservationId: 'r1', createdAt: "2024-03-15T10:30:00Z", updatedAt: "2024-03-15T10:30:00Z", transferredAt: null, color: testEventInfo['test-1'].ticketColor, isRare: false },
		
		// 재즈 나이트 - 2장 (사용됨, 1장은 rare)
		{ id: 't4', eventId: 'test-2', status: TicketStatus.Used, ownerId: userId, reservationId: 'r2', createdAt: "2024-03-25T19:30:00Z", updatedAt: "2024-03-25T19:30:00Z", transferredAt: null, color: goldGradient, isRare: true },
		{ id: 't5', eventId: 'test-2', status: TicketStatus.Used, ownerId: userId, reservationId: 'r2', createdAt: "2024-03-25T19:30:00Z", updatedAt: "2024-03-25T19:30:00Z", transferredAt: null, color: testEventInfo['test-2'].ticketColor, isRare: false },
		
		// 팝스 오케스트라 - 1장 (일반)
		{ id: 't6', eventId: 'test-3', status: TicketStatus.Active, ownerId: userId, reservationId: 'r3', createdAt: "2024-03-10T09:00:00Z", updatedAt: "2024-03-10T09:00:00Z", transferredAt: null, color: testEventInfo['test-3'].ticketColor, isRare: false },
		
		// 뮤지컬 갈라쇼 - 1장 (취소됨, rare)
		{ id: 't7', eventId: 'test-4', status: TicketStatus.Cancelled, ownerId: userId, reservationId: 'r4', createdAt: "2024-03-20T14:15:00Z", updatedAt: "2024-03-20T14:15:00Z", transferredAt: null, color: goldGradient, isRare: true },
		
		// 록 페스티벌 - 4장 (취소 신청 중, 2장은 rare)
		{ id: 't8', eventId: 'test-5', status: TicketStatus.CancelRequested, ownerId: userId, reservationId: 'r5', createdAt: "2024-03-05T16:20:00Z", updatedAt: "2024-03-05T16:20:00Z", transferredAt: null, color: goldGradient, isRare: true },
		{ id: 't9', eventId: 'test-5', status: TicketStatus.CancelRequested, ownerId: userId, reservationId: 'r5', createdAt: "2024-03-05T16:20:00Z", updatedAt: "2024-03-05T16:20:00Z", transferredAt: null, color: goldGradient, isRare: true },
		{ id: 't10', eventId: 'test-5', status: TicketStatus.CancelRequested, ownerId: userId, reservationId: 'r5', createdAt: "2024-03-05T16:20:00Z", updatedAt: "2024-03-05T16:20:00Z", transferredAt: null, color: testEventInfo['test-5'].ticketColor, isRare: false },
		{ id: 't11', eventId: 'test-5', status: TicketStatus.CancelRequested, ownerId: userId, reservationId: 'r5', createdAt: "2024-03-05T16:20:00Z", updatedAt: "2024-03-05T16:20:00Z", transferredAt: null, color: testEventInfo['test-5'].ticketColor, isRare: false },
		
		// 발레 공연 - 2장 (양도됨, 일반)
		{ id: 't12', eventId: 'test-6', status: TicketStatus.Transferred, ownerId: userId, reservationId: 'r6', createdAt: "2024-03-12T11:45:00Z", updatedAt: "2024-03-12T11:45:00Z", transferredAt: "2024-03-18T14:30:00Z", color: testEventInfo['test-6'].ticketColor, isRare: false },
		{ id: 't13', eventId: 'test-6', status: TicketStatus.Transferred, ownerId: userId, reservationId: 'r6', createdAt: "2024-03-12T11:45:00Z", updatedAt: "2024-03-12T11:45:00Z", transferredAt: "2024-03-18T14:30:00Z", color: testEventInfo['test-6'].ticketColor, isRare: false },
		
		// 오페라 갈라 - 5장 (1장 rare)
		{ id: 't14', eventId: 'test-7', status: TicketStatus.Active, ownerId: userId, reservationId: 'r7', createdAt: "2024-03-08T13:15:00Z", updatedAt: "2024-03-08T13:15:00Z", transferredAt: null, color: goldGradient, isRare: true },
		{ id: 't15', eventId: 'test-7', status: TicketStatus.Active, ownerId: userId, reservationId: 'r7', createdAt: "2024-03-08T13:15:00Z", updatedAt: "2024-03-08T13:15:00Z", transferredAt: null, color: testEventInfo['test-7'].ticketColor, isRare: false },
		{ id: 't16', eventId: 'test-7', status: TicketStatus.Active, ownerId: userId, reservationId: 'r7', createdAt: "2024-03-08T13:15:00Z", updatedAt: "2024-03-08T13:15:00Z", transferredAt: null, color: testEventInfo['test-7'].ticketColor, isRare: false },
		{ id: 't17', eventId: 'test-7', status: TicketStatus.Active, ownerId: userId, reservationId: 'r7', createdAt: "2024-03-08T13:15:00Z", updatedAt: "2024-03-08T13:15:00Z", transferredAt: null, color: testEventInfo['test-7'].ticketColor, isRare: false },
		{ id: 't18', eventId: 'test-7', status: TicketStatus.Active, ownerId: userId, reservationId: 'r7', createdAt: "2024-03-08T13:15:00Z", updatedAt: "2024-03-08T13:15:00Z", transferredAt: null, color: testEventInfo['test-7'].ticketColor, isRare: false },
		
		// 국악 공연 - 1장 (rare)
		{ id: 't19', eventId: 'test-8', status: TicketStatus.Used, ownerId: userId, reservationId: 'r8', createdAt: "2024-03-22T20:00:00Z", updatedAt: "2024-03-22T20:00:00Z", transferredAt: null, color: goldGradient, isRare: true },
		
		// 챔버 음악회 - 2장 (일반)
		{ id: 't20', eventId: 'test-9', status: TicketStatus.Active, ownerId: userId, reservationId: 'r9', createdAt: "2024-03-14T15:30:00Z", updatedAt: "2024-03-14T15:30:00Z", transferredAt: null, color: testEventInfo['test-9'].ticketColor, isRare: false },
		{ id: 't21', eventId: 'test-9', status: TicketStatus.Active, ownerId: userId, reservationId: 'r9', createdAt: "2024-03-14T15:30:00Z", updatedAt: "2024-03-14T15:30:00Z", transferredAt: null, color: testEventInfo['test-9'].ticketColor, isRare: false },
	];

	// 실제 데이터가 없으면 테스트 데이터 사용
	const displayTickets = (tickets && tickets.length > 0) ? tickets : testTickets;
	const safeTickets = Array.isArray(displayTickets) ? displayTickets : testTickets;

	// 이벤트별로 그룹화
	const eventGroups: EventTicketGroup[] = safeTickets.reduce((groups: EventTicketGroup[], ticket: Ticket) => {
		const existingGroup = groups.find(g => g.eventId === ticket.eventId);
		if (existingGroup) {
			existingGroup.tickets.push(ticket);
			if (new Date(ticket.createdAt) > new Date(existingGroup.latestCreatedAt)) {
				existingGroup.latestCreatedAt = ticket.createdAt;
			}
		} else {
			groups.push({
				eventId: ticket.eventId,
				eventName: testEventInfo[ticket.eventId]?.eventName || `공연 ${ticket.eventId}`,
				tickets: [ticket],
				latestCreatedAt: ticket.createdAt,
				eventInfo: testEventInfo[ticket.eventId], // 이벤트 정보 추가
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
					onSuccess: () => showToast({ message: '모든 티켓이 취소되었습니다.', iconType: 'success' }),
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
			<ThemeDiv className="p-8 text-center rounded-lg">
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
			<ThemeDiv className="p-8 text-center rounded-lg">
				<TicketIcon />
				<h3 className="text-lg font-semibold mb-2">보유한 티켓이 없습니다</h3>
				<p className="text-sm opacity-70">승인된 예매의 티켓이 여기에 표시됩니다.</p>
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
					ticketColor={group.eventInfo?.ticketColor}
					eventInfo={group.eventInfo}
					onCancelRequest={handleCancelAll}
					onTicketAction={handleTicketAction}
				/>
			))}
		</div>
	);
};

export default TicketsTab; 