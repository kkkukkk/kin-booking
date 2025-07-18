'use client'

import React, { useState, useMemo } from 'react';
import { Ticket } from '@/types/model/ticket';
import { TicketStatus } from '@/types/model/ticket';
import { Events } from '@/types/model/events';
import TicketCard from '@/components/Ticket';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import { getStatusInfoColors } from '@/components/status/StatusBadge';

interface TicketStackProps {
	eventId: string;
	eventName: string;
	tickets: Ticket[];
	latestCreatedAt: string;
	ticketColor?: string;
	eventInfo?: Events;
	onCancelRequest?: (eventId: string) => void;
	onTicketAction?: (ticketIds: string[], action: 'enter' | 'transfer') => void;
	key?: React.Key;
}

const TicketStack = ({
	eventId,
	eventName,
	tickets,
	latestCreatedAt,
	ticketColor,
	eventInfo,
	onCancelRequest,
	onTicketAction,
}: TicketStackProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const theme = useAppSelector((state: RootState) => state.theme.current);

	// 티켓 상태별 통계 계산
	const statusStats = useMemo(() => {
		const stats = {
			active: 0,
			cancelRequested: 0,
			cancelled: 0,
			used: 0,
			transferred: 0,
		};

		tickets.forEach(ticket => {
			switch (ticket.status) {
				case TicketStatus.Active:
					stats.active++;
					break;
				case TicketStatus.CancelRequested:
					stats.cancelRequested++;
					break;
				case TicketStatus.Cancelled:
					stats.cancelled++;
					break;
				case TicketStatus.Used:
					stats.used++;
					break;
				case TicketStatus.Transferred:
					stats.transferred++;
					break;
			}
		});

		return stats;
	}, [tickets]);

	// 티켓 스택의 통합 상태 (양도는 별도 고려)
	const stackStatus = useMemo(() => {
		if (statusStats.transferred > 0) return TicketStatus.Transferred;
		if (statusStats.used > 0) return TicketStatus.Used;
		if (statusStats.cancelled > 0) return TicketStatus.Cancelled;
		if (statusStats.cancelRequested > 0) return TicketStatus.CancelRequested;
		return TicketStatus.Active;
	}, [statusStats]);

	// 입장 가능 여부 확인 (공연 일자/시간 기준)
	const canEnter = useMemo(() => {
		if (stackStatus !== TicketStatus.Active) return false;
		if (!eventInfo?.eventDate) return true; // 이벤트 정보가 없으면 기본적으로 활성화

		const now = new Date();
		const eventDate = new Date(eventInfo.eventDate);

		// 공연 시작 30분 전부터 입장 가능
		const entryStartTime = new Date(eventDate.getTime() - 30 * 60 * 1000);
		// 공연 종료 후 2시간까지 입장 가능
		const entryEndTime = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

		return now >= entryStartTime && now <= entryEndTime;
	}, [stackStatus, eventInfo]);

	// 양도 가능 여부 확인
	const canTransfer = useMemo(() => {
		return stackStatus === TicketStatus.Active && statusStats.active > 0;
	}, [stackStatus, statusStats.active]);

	// 취소 가능 여부 확인
	const canCancel = useMemo(() => {
		return stackStatus === TicketStatus.Active && statusStats.active > 0;
	}, [stackStatus, statusStats.active]);

	// 기본 표시 레이어 수 (펼치지 않았을 때)
	const DEFAULT_VISIBLE_LAYERS = 3;
	const getVisibleTickets = (tickets: Ticket[], isExpanded: boolean) => {
		if (isExpanded) return tickets; // 펼치면 모든 티켓 표시
		return tickets.slice(0, Math.min(tickets.length, DEFAULT_VISIBLE_LAYERS));
	};

	// 펼치기/접기 토글
	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	// 티켓 액션 처리
	const handleTicketAction = (action: 'enter' | 'transfer') => {
		const activeTicketIds = tickets
			.filter(ticket => ticket.status === TicketStatus.Active)
			.map(ticket => ticket.id);

		if (onTicketAction) {
			onTicketAction(activeTicketIds, action);
		} else {
			// 기본 동작
			if (action === 'enter') {
				alert(`입장 처리 실행! (${activeTicketIds.length}장)`);
			} else if (action === 'transfer') {
				alert(`양도 처리 실행! (${activeTicketIds.length}장)`);
			}
		}
	};

	const visibleTickets = Array.isArray(tickets) ? getVisibleTickets(tickets, isExpanded) : [];

	// 그룹의 실제 높이 계산
	const headerHeight = 120; // 헤더 높이 증가
	const ticketHeight = 200; // 기본 티켓 높이
	const ticketSpacing = 16; // 티켓 간격
	const actionBarHeight = 60; // 액션 바 높이

	let groupHeight;
	if (isExpanded) {
		// 펼친 상태: 세로 배치
		groupHeight = headerHeight + actionBarHeight + (visibleTickets.length * ticketHeight) + ((visibleTickets.length - 1) * ticketSpacing) + 20;
	} else {
		// 기본 상태: 겹침 배치
		const overlapOffset = (visibleTickets.length - 1) * 8; // 겹침으로 인한 추가 높이
		groupHeight = headerHeight + actionBarHeight + ticketHeight + overlapOffset + 20;
	}

	// 공연 일자 포맷팅
	const formatEventDate = (dateString: string) => {
		const date = new Date(dateString);
		return {
			full: date.toLocaleDateString('ko-KR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				weekday: 'long'
			}),
			time: date.toLocaleTimeString('ko-KR', {
				hour: '2-digit',
				minute: '2-digit'
			}),
			short: date.toLocaleDateString('ko-KR', {
				month: 'short',
				day: 'numeric'
			})
		};
	};

	const eventDateInfo = eventInfo?.eventDate ? formatEventDate(eventInfo.eventDate) : null;

	return (
		<ThemeDiv
			className="rounded-xl shadow-lg border border-gray-200 overflow-hidden"
			style={{ minHeight: `${groupHeight}px` }}
			isChildren
		>
			<div className={clsx(
				"p-6 border-b",
				theme === 'normal' ? 'border-gray-200' : 'border-gray-700'
			)}>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="flex-1">
						<div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
							<h3 className="text-xl font-bold">{eventName}</h3>
							{eventDateInfo && (
								<div className="flex items-center gap-2 text-sm">
									<span className="hidden md:inline">•</span>
									<span className="font-medium">{eventDateInfo.short}</span>
									<span>{eventDateInfo.time}</span>
								</div>
							)}
						</div>

						{/* 티켓 정보 */}
						<div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
							<p className="text-sm">
								총 {tickets.length}장 • {new Date(latestCreatedAt).toLocaleDateString('ko-KR')} 예약
							</p>
							{eventDateInfo && (
								<div className="text-xs">
									{canEnter ? '입장 가능' : '입장 대기'}
								</div>
							)}
						</div>

						{/* 상태별 통계 */}
						<div className="flex flex-wrap gap-2">
							{statusStats.active > 0 && (
								<span className={clsx(
									"px-3 py-1.5 rounded-full border text-xs font-medium",
									getStatusInfoColors(TicketStatus.Active, theme)
								)}>
									사용가능 {statusStats.active}장
								</span>
							)}
							{statusStats.cancelRequested > 0 && (
								<span className={clsx(
									"px-3 py-1.5 rounded-full border text-xs font-medium",
									getStatusInfoColors(TicketStatus.CancelRequested, theme)
								)}>
									취소신청 {statusStats.cancelRequested}장
								</span>
							)}
							{statusStats.cancelled > 0 && (
								<span className={clsx(
									"px-3 py-1.5 rounded-full border text-xs font-medium",
									getStatusInfoColors(TicketStatus.Cancelled, theme)
								)}>
									취소완료 {statusStats.cancelled}장
								</span>
							)}
							{statusStats.used > 0 && (
								<span className={clsx(
									"px-3 py-1.5 rounded-full border text-xs font-medium",
									getStatusInfoColors(TicketStatus.Used, theme)
								)}>
									사용완료 {statusStats.used}장
								</span>
							)}
							{statusStats.transferred > 0 && (
								<span className={clsx(
									"px-3 py-1.5 rounded-full border text-xs font-medium",
									getStatusInfoColors(TicketStatus.Transferred, theme)
								)}>
									양도완료 {statusStats.transferred}장
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{(canEnter || canTransfer || canCancel) && (
				<div className={clsx(
					"px-6 py-4 border-b",
					theme === 'normal'
						? 'bg-gray-50 border-gray-200'
						: 'bg-gray-700/50 border-gray-600'
				)}>
					<div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
						{/* 입장  */}
						{canEnter && (
							<button
								onClick={() => handleTicketAction('enter')}
								className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
									canEnter 
										? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl' 
										: 'bg-gray-300 text-gray-500 cursor-not-allowed'
								}`}
								disabled={!canEnter}
							>
								{canEnter ? '🎫 입장하기' : '⏰ 입장 대기'}
							</button>
						)}

						{/* 양도 */}
						{canTransfer && (
							<button
								onClick={() => handleTicketAction('transfer')}
								className="flex-1 md:flex-none px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-all shadow-lg hover:shadow-xl"
							>
								🔄 양도하기
							</button>
						)}

						{/* 취소 신청 */}
						{canCancel && onCancelRequest && (
							<button
								onClick={() => onCancelRequest(eventId)}
								className="flex-1 md:flex-none px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg text-sm transition-all shadow-lg hover:shadow-xl"
							>
								❌ 취소 신청
							</button>
						)}
					</div>
				</div>
			)}

			{/* 티켓 스택/리스트 */}
			<div className="p-6">
				{visibleTickets.length > 0 ? (
					<AnimatePresence initial={false}>
						{isExpanded ? (
							<motion.div
								key="expanded"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.35, ease: 'easeInOut' }}
								className="space-y-4"
							>
								{visibleTickets.map((ticket) => (
									<motion.div
										key={ticket.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.2, ease: 'easeInOut' }}
										className="relative"
									>
										<TicketCard
											eventName={eventName}
											status={stackStatus}
											latestCreatedAt={ticket.createdAt}
											eventId={ticket.eventId}
											ticketColor={ticketColor}
											isRare={ticket.isRare}
											eventDate={eventInfo?.eventDate}
											location={eventInfo?.location}
											ticketId={ticket.id}
											ticketNumber={ticket.ticketNumber}
											ticketPrice={eventInfo?.ticketPrice}
										/>
									</motion.div>
								))}
								{/* 펼치기/접기 버튼 */}
								{tickets.length > 1 && (
									<div className="flex justify-center">
										<Button
											theme="dark"
											fontWeight="font-semibold"
											fontSize="text-base"
											padding="px-6 py-3"
											className={clsx(
												"border shadow-sm hover:shadow-md",
												theme === 'normal'
													? 'border-blue-200'
													: 'border-blue-700'
											)}
											onClick={toggleExpanded}
										>
											{isExpanded ? '접기' : `펼치기 (${tickets.length}장)`}
										</Button>
									</div>
								)}
							</motion.div>
						) : (
							<motion.div
								key="collapsed"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="space-y-4"
							>
								<div className="relative" style={{ minHeight: '220px' }}>
									{visibleTickets.map((ticket, ticketIdx) => {
										const isTopTicket = ticketIdx === 0;
										const zIndex = visibleTickets.length - ticketIdx;
										const translateX = ticketIdx * 8; // 우측으로
										const translateY = -(ticketIdx * 8); // 위로 (음수)
										const opacity = isTopTicket ? 1 : Math.max(0.2, 1 - (ticketIdx * 0.2));

										return (
											<div
												key={ticket.id}
												className="absolute top-0 left-0 w-full"
												style={{
													zIndex,
													transform: `translate(${translateX}px, ${translateY}px)`,
													opacity,
													pointerEvents: isTopTicket ? 'auto' : 'none',
												}}
											>
												<TicketCard
													eventName={eventName}
													status={stackStatus}
													latestCreatedAt={ticket.createdAt}
													eventId={ticket.eventId}
													ticketColor={ticketColor}
													isRare={ticket.isRare}
													eventDate={eventInfo?.eventDate}
													location={eventInfo?.location}
													ticketId={ticket.id}
													ticketNumber={ticket.ticketNumber}
													ticketPrice={eventInfo?.ticketPrice}
												/>
											</div>
										);
									})}
								</div>
								{/* 펼치기/접기 버튼 */}
								{tickets.length > 1 && (
									<div className="flex justify-center">
										<Button
											theme="dark"
											fontWeight="font-semibold"
											fontSize="text-base"
											padding="px-6 py-3"
											className={clsx(
												"border shadow-sm hover:shadow-md",
												theme === 'normal'
													? 'border-blue-200'
													: 'border-blue-700'
											)}
											onClick={toggleExpanded}
										>
											{isExpanded ? '접기' : `펼치기 (${tickets.length}장)`}
										</Button>
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>
				) : (
					<div className="text-center text-gray-400 py-8">티켓이 없습니다.</div>
				)}
			</div>
		</ThemeDiv>
	);
};

export default TicketStack; 