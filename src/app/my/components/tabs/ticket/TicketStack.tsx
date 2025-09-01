'use client'

import React, { useState, useMemo } from 'react';
import { Ticket } from '@/types/model/ticket';
import { TicketStatus } from '@/types/model/ticket';
import { Events, EventStatus } from '@/types/model/events';
import TicketCard from '@/app/my/components/tabs/ticket/Ticket';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import { StatusBadge } from '@/components/status/StatusBadge';
import { useRequestCancelAllTicketsByEvent } from '@/hooks/api/useTickets';
import { useRefundAccountByUserId, useCreateRefundAccount } from '@/hooks/api/useRefundAccounts';
import { useCreateRefundRequestMapping } from '@/hooks/api/useRefundRequestMapping';
import { useAlert } from '@/providers/AlertProvider';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { CalendarIcon } from '@/components/icon/CalendarIcon';
import { LocationIcon } from '@/components/icon/LocationIcon';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { MapIcon } from '@/components/icon/MapIcon';
import TicketQRModal from '@/app/my/components/tabs/ticket/TicketQRModal';
import RefundAccountModal from '@/app/my/components/tabs/ticket/RefundAccountModal';

interface TicketStackProps {
	eventId: string;
	eventName: string;
	tickets: Ticket[];
	latestCreatedAt: string;
	eventInfo?: Events;
}

const TicketStack = ({
	eventId,
	eventName,
	tickets,
	latestCreatedAt,
	eventInfo,
}: TicketStackProps) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [showQRModal, setShowQRModal] = useState(false);
	const [showRefundAccountModal, setShowRefundAccountModal] = useState(false);
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { mutate: requestCancelAllTickets, isPending: isCancelling } = useRequestCancelAllTicketsByEvent();
	const { mutate: createRefundAccount, isPending: isCreatingAccount } = useCreateRefundAccount();
	const { mutate: createRefundRequestMapping, isPending: isCreatingMapping } = useCreateRefundRequestMapping();
	const { showAlert } = useAlert();
	const { session } = useSession();
	const router = useRouter();

	// 기존 환불계좌 조회
	const { data: existingRefundAccounts } = useRefundAccountByUserId(session?.user?.id || '');

	// 티켓 스택의 통합 상태 (첫 번째 티켓의 상태를 기준으로 함)
	const stackStatus = useMemo(() => {
		if (tickets.length === 0) return TicketStatus.Active;
		return tickets[0].status;
	}, [tickets]);

	// 양도 받은 티켓인지 확인
	const isReceivedTicket = useMemo(() => {
		if (tickets.length === 0 || !session?.user?.id) return false;
		const firstTicket = tickets[0];
		return firstTicket.transferredAt && firstTicket.ownerId === session.user.id;
	}, [tickets, session?.user?.id]);

	// 상태별 스타일 클래스
	const getStatusStyle = () => {
		switch (stackStatus) {
			case TicketStatus.Active:
				return theme !== 'neon' ? theme === 'dark' ? 'border-gray-500' : 'border-gray-200' : 'border-green-600';
			case TicketStatus.CancelRequested:
				return theme === 'normal' 
					? 'bg-yellow-50 border-yellow-200' 
					: 'bg-yellow-800/20 border-yellow-600 text-white/90';
			case TicketStatus.Used:
				return theme === 'normal' 
					? 'bg-green-50 border-green-200' 
					: 'bg-green-800/20 border-green-600 text-white/90';
			case TicketStatus.Transferred:
				return theme === 'normal' 
					? 'bg-blue-50 border-blue-200' 
					: 'bg-blue-800/20 border-blue-600 text-white/90';
			case TicketStatus.Cancelled:
				return theme === 'normal' 
					? 'bg-red-50 border-red-200' 
					: 'bg-red-800/20 border-red-600 text-white/90';
			default:
				return theme === 'normal' ? 'border-gray-200' : 'border-gray-600';
		}
	};

	// 상태별 제목
	const getStatusTitle = () => {
		switch (stackStatus) {
			case TicketStatus.Active:
				return null;
			case TicketStatus.CancelRequested:
				return { text: '취소 신청 대기중', count: tickets.length };
			case TicketStatus.Used:
				return { text: '사용 완료', count: tickets.length };
			case TicketStatus.Transferred:
				return { text: '양도 완료', count: tickets.length };
			case TicketStatus.Cancelled:
				return { text: '취소 완료', count: tickets.length };
			default:
				return null;
		}
	};

	// 입장 가능 여부 확인 (공연 일자/시간 기준)
	const canEnter = useMemo(() => {
		if (stackStatus !== TicketStatus.Active) return false;
		if (!eventInfo?.eventDate) return false; // 이벤트 정보가 없으면 기본적으로 비활성화

		const now = dayjs();
		const eventDate = dayjs(eventInfo.eventDate);

		// 공연 시작 30분 전부터 입장 가능
		const entryStartTime = eventDate.subtract(30, 'minute');
		// 공연 시작 후 2시간까지 입장 가능
		const entryEndTime = eventDate.add(2, 'hour');

		return now.isAfter(entryStartTime) && now.isBefore(entryEndTime);
	}, [stackStatus, eventInfo]);

	// 입장 대기 여부 확인 (Active 상태이지만 입장 시간이 아닌 경우)
	const isWaitingForEntry = useMemo(() => {
		return stackStatus === TicketStatus.Active && !canEnter;
	}, [stackStatus, canEnter]);

	// 양도 가능 여부 확인
	const canTransfer = useMemo(() => {
		return stackStatus === TicketStatus.Active && tickets.length > 0;
	}, [stackStatus, tickets.length]);

	// 취소 가능 여부 확인
	const canCancel = useMemo(() => {
		return stackStatus === TicketStatus.Active && tickets.length > 0;
	}, [stackStatus, tickets.length]);

	// 기본 표시 레이어 수 (펼치지 않았을 때)
	const DEFAULT_VISIBLE_LAYERS = 3;
	const getVisibleTickets = (tickets: Ticket[], isExpanded: boolean) => {
		// 티켓 번호 순으로 정렬 (낮은 번호가 앞으로)
		const sortedTickets = [...tickets].sort((a, b) => a.ticketNumber - b.ticketNumber);
		
		if (isExpanded) return sortedTickets; // 펼치면 모든 티켓 표시
		return sortedTickets.slice(0, Math.min(sortedTickets.length, DEFAULT_VISIBLE_LAYERS));
	};

	// 펼치기/접기 토글
	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	// QR코드 모달 열기
	const handleShowQRCode = () => {
		if (tickets.length > 0) {
			setShowQRModal(true); // 모달 열기
		}
	};

	// 티켓 액션 처리
	const handleTicketAction = (action: 'transfer') => {
		if (action === 'transfer') {
			// 양도 페이지로 이동 (핵심 정보만)
			const params = new URLSearchParams({
				eventId,
				reservationId: tickets[0].reservationId
			});
			router.push(`/my/transfer?${params.toString()}`);
		}
	};

	// 취소 신청 처리
	const handleCancelRequest = async () => {
		if (!session?.user?.id) return;

		const activeTickets = tickets.filter(ticket => ticket.status === TicketStatus.Active);
		if (activeTickets.length === 0) return;

		// 양도받은 티켓인지 확인
		if (isReceivedTicket) {
			// 양도받은 티켓은 환불계좌 입력 모달 표시
			setShowRefundAccountModal(true);
			return;
		}

		// 일반 티켓은 바로 취소 신청
		const confirmed = await showAlert({
			type: 'confirm',
			title: '티켓 취소 신청',
			message: `정말 ${activeTickets.length}장의 티켓을 취소 신청하시겠습니까?\n\n관리자 확인 후 환불이 진행됩니다.`,
		});

		if (confirmed) {
			requestCancelAllTickets({
				eventId,
				userId: session.user.id,
				reservationId: activeTickets[0].reservationId,
				tickets: activeTickets,
			});
		}
	};

	// 환불계좌 입력 후 취소 신청 처리
	const handleRefundAccountSubmit = async (accountInfo: { bankName: string; accountNumber: string; accountHolder: string; id?: string }) => {
		if (!session?.user?.id) return;

		const activeTickets = tickets.filter(ticket => ticket.status === TicketStatus.Active);
		if (activeTickets.length === 0) return;

		// 모달 먼저 닫기
		setShowRefundAccountModal(false);

		try {
			let refundAccountId: string;

			if (accountInfo.id) {
				// 기존 계좌 사용 - 새로 생성하지 않음
				refundAccountId = accountInfo.id;
			} else {
				// 새 계좌 생성
				createRefundAccount({
					userId: session.user.id,
					bankName: accountInfo.bankName,
					accountNumber: accountInfo.accountNumber,
					accountHolder: accountInfo.accountHolder
				}, {
					onSuccess: (newAccount) => {
						refundAccountId = newAccount.id;
						// 취소 신청 확인 후 환불 요청 매핑 생성
						showAlert({
							type: 'confirm',
							title: '티켓 취소 신청',
							message: `양도받은 티켓 ${activeTickets.length}장을 취소 신청하시겠습니까?\n\n입력하신 계좌로 환불이 진행됩니다.`,
						}).then((confirmed) => {
							if (confirmed) {
								// 환불 요청 매핑 생성
								createRefundRequestMapping({
									userId: session.user.id,
									refundAccountId: newAccount.id,
									reservationId: activeTickets[0].reservationId,
									eventId: activeTickets[0].eventId
								}, {
									onSuccess: () => {
										// 매핑 생성 성공 후 취소 신청
										requestCancelAllTickets({
											eventId,
											userId: session.user.id,
											reservationId: activeTickets[0].reservationId,
											tickets: activeTickets,
										});
									},
									onError: (error) => {
										console.error('환불 요청 매핑 생성 실패:', error);
										showAlert({
											type: 'confirm',
											title: '오류',
											message: '환불 요청 매핑 생성 중 오류가 발생했습니다.',
										});
									}
								});
							}
						});
					},
					onError: (error) => {
						console.error('환불계좌 생성 실패:', error);
						showAlert({
							type: 'confirm',
							title: '오류',
							message: '환불계좌 생성 중 오류가 발생했습니다.',
						});
					}
				});
				return; // 비동기 처리이므로 여기서 종료
			}

			// 기존 계좌 사용 시 - 취소 신청 확인 후 환불 요청 매핑 생성
			showAlert({
				type: 'confirm',
				title: '티켓 취소 신청',
				message: `양도받은 티켓 ${activeTickets.length}장을 취소 신청하시겠습니까?\n\n입력하신 계좌로 환불이 진행됩니다.`,
			}).then((confirmed) => {
				if (confirmed) {
					// 환불 요청 매핑 생성
					createRefundRequestMapping({
						userId: session.user.id,
						refundAccountId,
						reservationId: activeTickets[0].reservationId,
						eventId: activeTickets[0].eventId
					}, {
						onSuccess: () => {
							// 매핑 생성 성공 후 취소 신청
							requestCancelAllTickets({
								eventId,
								userId: session.user.id,
								reservationId: activeTickets[0].reservationId,
								tickets: activeTickets,
							});
						},
						onError: (error) => {
							console.error('환불 요청 매핑 생성 실패:', error);
							showAlert({
								type: 'confirm',
								title: '오류',
								message: '환불 요청 매핑 생성 중 오류가 발생했습니다.',
							});
						}
					});
				}
			});
		} catch (error) {
			console.error('환불계좌 처리 실패:', error);
			showAlert({
				type: 'confirm',
				title: '오류',
				message: '환불계좌 정보 처리 중 오류가 발생했습니다.',
			});
		}
	};

	const visibleTickets = getVisibleTickets(tickets, isExpanded);

	// 공연 일자 포맷팅
	const formatEventDate = (dateString: string) => {
		const date = dayjs(dateString);
		return {
			full: date.format('YYYY년 M월 D일 dddd'),
			time: date.format('HH:mm'),
			short: date.format('M월 D일'),
			detailed: date.format('YYYY년 M월 D일'),
			weekday: date.format('ddd')
		};
	};

	const eventDateInfo = eventInfo?.eventDate ? formatEventDate(eventInfo.eventDate) : null;

	const statusTitle = getStatusTitle();
	
	return (
		<ThemeDiv
			className={clsx(
				"rounded-lg shadow-lg border overflow-visible",
				getStatusStyle()
			)}
			isChildren
		>
			{/* 상태 표시 */}
			{statusTitle && (
				<div className={clsx(
					"px-4 py-2 border-b text-sm font-medium",
					stackStatus === TicketStatus.CancelRequested && (
						theme === 'normal' 
							? "bg-yellow-100 border-yellow-200 text-yellow-800" 
							: "bg-yellow-900/30 border-yellow-800 text-yellow-200"
					),
					stackStatus === TicketStatus.Used && (
						theme === 'normal' 
							? "bg-green-100 border-green-200 text-green-800" 
							: "bg-green-900/30 border-green-800 text-green-200"
					),
					stackStatus === TicketStatus.Transferred && (
						theme === 'normal' 
							? "bg-blue-100 border-blue-200 text-blue-800" 
							: "bg-blue-900/30 border-blue-800 text-blue-200"
					),
					stackStatus === TicketStatus.Cancelled && (
						theme === 'normal' 
							? "bg-red-100 border-red-200 text-red-800" 
							: "bg-red-900/30 border-red-800 text-red-200"
					)
				)}>
					{statusTitle.text} ({statusTitle.count}장)
				</div>
			)}
			<div className={clsx(
				"p-6 border-b",
				theme === 'normal' ? 'border-gray-200' : 'border-gray-700'
			)}>
				<div className="space-y-3">
					{/* 공연명 + 상태뱃지 */}
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<h3 className="text-lg md:text-xl font-bold">{eventName}</h3>
							{eventInfo?.status === EventStatus.Completed && (
								<div className={clsx(
									"px-2 py-1 rounded text-xs font-semibold",
									theme === 'normal'
										? 'bg-gray-100 border border-gray-300 text-gray-700'
										: 'bg-gray-600 text-white'
								)}>
									공연 완료
								</div>
							)}
						</div>
						<StatusBadge 
							status={stackStatus} 
							theme={theme} 
							variant="badge"
							size="sm"
							className="w-fit"
							statusType="ticket"
						/>
					</div>

					{/* 공연일, 티켓 장수, 예매일 */}
					<div className="flex flex-col gap-2 text-xs">
						{eventDateInfo && (
							<div className="flex items-center gap-2">
								<CalendarIcon className="w-4 h-4 text-gray-400" />
								<span>{eventDateInfo.detailed}</span>
								<span className="text-gray-400">({eventDateInfo.weekday})</span>
								<span className="text-gray-400">{eventDateInfo.time}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<TicketIcon className="w-4 h-4 text-gray-400" />
							<span>{tickets.length}장</span>
						</div>
						{/* 위치 */}
						{eventInfo?.location && (
							<div className="flex items-center gap-2">
								<MapIcon className="w-4 h-4 text-gray-400" />
								<span className="text-xs">{eventInfo.location}</span>
								<a
									href={`https://map.kakao.com/link/search/${encodeURIComponent(eventInfo.location)}`}
									target="_blank"
									rel="noopener noreferrer"
									className={clsx(
										"inline-flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors border",
										theme === "normal"
											? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300 hover:border-blue-500"
											: "bg-blue-900/30 text-blue-300 hover:bg-blue-900/50 border-blue-600 hover:border-blue-400"
									)}
								>
									<LocationIcon className="w-3 h-3"/>
									<span className="whitespace-nowrap">카카오맵</span>
								</a>
							</div>
						)}
					</div>

					{/* 양도 받은 티켓 정보 */}
					{isReceivedTicket && (
						<div className={clsx(
							"p-3 rounded-lg text-sm",
							theme === 'normal'
								? "bg-blue-50 border border-blue-200 text-blue-800"
								: theme === 'dark'
									? "bg-blue-900/20 border border-blue-600 text-blue-200"
									: "bg-blue-900/20 border border-blue-500 text-blue-200"
						)}>
							<div className="flex items-center gap-2">
								<span className="font-medium">양도 받은 티켓</span>
								{/* TODO: 양도한 사람 정보 표시 */}
							</div>
							{tickets[0].transferredAt && (
								<div className="text-xs opacity-70 mt-1">
									양도일: {dayjs(tickets[0].transferredAt).format('YYYY년 M월 D일')}
								</div>
							)}
						</div>
					)}

					{/* 취소 신청중 안내 문구 */}
					{stackStatus === TicketStatus.CancelRequested && (
						<div className={clsx(
							"mt-3 p-3 rounded-lg text-xs",
							theme === 'normal'
								? "bg-amber-50 border border-amber-200 text-amber-700"
								: "bg-amber-900/20 border border-amber-600/50 text-amber-200"
						)}>
							<div className="flex items-start gap-2">
								<div className={clsx(
									"w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
									theme === 'normal' ? "bg-amber-400" : "bg-amber-300"
								)} />
								<div>
									<span className="font-medium">취소 신청이 접수되었습니다.</span>
									<br />
									<span>관리자 확인 후 입금하신 계좌로 환불이 진행됩니다.</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{(canEnter || canTransfer || canCancel) && eventInfo?.status !== EventStatus.Completed && (
				<div className={clsx(
					"px-6 py-4 border-b",
					theme === 'normal'
						? 'bg-gray-50 border-gray-200'
						: 'bg-gray-700/50 border-gray-600'
				)}>
					<div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
						{/* 입장  */}
						{(canEnter || isWaitingForEntry) && (
							<button
								onClick={handleShowQRCode}
								className={`flex-1 md:flex-none px-6 py-3 rounded font-semibold text-sm transition-all cursor-pointer ${
									canEnter 
										? theme === 'normal'
											? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-[0_2px_8px_rgba(34,197,94,0.3)]'
											: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-[0_2px_8px_rgba(34,197,94,0.4)]'
										: theme === 'normal'
											? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
											: 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
								}`}
								disabled={!canEnter}
							>
								{canEnter ? '입장하기' : '입장 대기'}
							</button>
						)}

						{/* 양도 */}
						{canTransfer && (
							<button
								onClick={() => handleTicketAction('transfer')}
								className={`flex-1 md:flex-none px-6 py-3 rounded font-semibold text-sm transition-all cursor-pointer ${
									theme === 'normal'
										? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
										: 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
								}`}
							>
								양도하기
							</button>
						)}

						{/* 취소 신청 */}
						{canCancel && (
							<button
								onClick={handleCancelRequest}
								disabled={isCancelling}
								className={`flex-1 md:flex-none px-6 py-3 rounded font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
									theme === 'normal'
										? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-[0_2px_8px_rgba(239,68,68,0.3)]'
										: 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
								}`}
							>
								{isCancelling ? '처리 중...' : '취소 신청'}
							</button>
						)}
					</div>
				</div>
			)}

			{/* 티켓 스택/리스트 */}
			<div className={clsx(
				"py-6",
				isExpanded ? "px-6" : "pl-4 md:pl-6 pr-8 md:pr-8"
			)}>
				{visibleTickets.length > 0 ? (
					<>
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
												ticketColor={ticket.color || undefined}
												isRare={ticket.isRare}
												eventDate={eventInfo?.eventDate}
												ticketNumber={ticket.ticketNumber}
												ticketPrice={eventInfo?.ticketPrice}
											/>
										</motion.div>
									))}
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
									<div className="relative overflow-visible" style={{ minHeight: '220px' }}>
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
														// iOS Safari 최적화를 위한 추가 속성
														willChange: 'transform, opacity',
														backfaceVisibility: 'hidden',
													}}
												>
													<TicketCard
														eventName={eventName}
														status={stackStatus}
														ticketColor={ticket.color || undefined}
														isRare={ticket.isRare}
														eventDate={eventInfo?.eventDate}
														ticketNumber={ticket.ticketNumber}
														ticketPrice={eventInfo?.ticketPrice}
													/>
												</div>
											);
										})}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
						
						{/* 펼치기/접기 버튼 - 통합 */}
						{tickets.length > 1 && (
							<div className="flex justify-center mt-6">
								<Button
									theme="dark"
									fontWeight="font-semibold"
									fontSize="text-sm"
									padding="px-4 py-2"
									reverse={theme === 'normal'}
									onClick={toggleExpanded}
								>
									{isExpanded ? '접기' : `펼치기 (${tickets.length}장)`}
								</Button>
							</div>
						)}
					</>
				) : (
					<div className="text-center text-gray-400 py-8">티켓이 없습니다.</div>
				)}
			</div>

			{/* QR코드 모달 */}
			{showQRModal && tickets.length > 0 && (
				<TicketQRModal
					isOpen={showQRModal}
					onClose={() => setShowQRModal(false)}
					ticketNumbers={tickets.map(ticket => ticket.ticketNumber)}
					eventName={eventName}
					eventId={eventId}
					userId={session?.user?.id || ''}
					reservationId={tickets[0].reservationId}
				/>
			)}

			{/* 환불계좌 입력 모달 */}
			{showRefundAccountModal && (
				<RefundAccountModal
					isOpen={showRefundAccountModal}
					onClose={() => setShowRefundAccountModal(false)}
					onSubmit={handleRefundAccountSubmit}
					existingAccounts={existingRefundAccounts}
					isSubmitting={isCreatingAccount || isCreatingMapping}
					theme={theme}
				/>
			)}
		</ThemeDiv>
	);
};

export default TicketStack;