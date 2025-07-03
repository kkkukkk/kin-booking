import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTicket,
  getTicketsByReservationId,
  getTicketsByOwnerId,
  getTicketsByEventId,
  getTicketById,
  updateTicket,
  deleteTicket,
  deleteTicketsByReservationId,
  cancelAllTicketsByEvent,
  requestCancelTicket,
  getTicketsWithEventByOwnerId,
} from '@/api/ticket';
import { createTransferHistory } from '@/api/ticketTransferHistory';
import { CreateTicketRequest, UpdateTicketRequest, TransferTicketRequest, Ticket, TicketStatus } from '@/types/model/ticket';
import { TicketGroupDto, TicketWithEventDto } from '@/types/dto/ticket';

// 예약 ID로 티켓 조회
export const useTicketsByReservationId = (reservationId: string) => {
  return useQuery({
    queryKey: ['tickets', 'reservation', reservationId],
    queryFn: () => getTicketsByReservationId(reservationId),
    enabled: !!reservationId,
  });
};

// 사용자 ID로 티켓 조회
export const useTicketsByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['tickets', 'owner', ownerId],
    queryFn: () => getTicketsByOwnerId(ownerId),
    enabled: !!ownerId,
  });
};

// 사용자 ID로 티켓 그룹 조회 (프론트에서 그룹화)
export const useTicketGroupsByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['ticketGroups', 'owner', ownerId],
    queryFn: async () => {
      const tickets = await getTicketsByOwnerId(ownerId);
      // 그룹화 및 통계 계산
      const grouped = tickets.reduce((acc: { [key: string]: TicketGroupDto & { eventId: string; tickets: Ticket[] } }, ticket: Ticket) => {
        const eventId = ticket.eventId;
        if (!acc[eventId]) {
          acc[eventId] = {
            eventId,
            eventName: `공연 ${eventId}`,
            totalCount: 0,
            activeCount: 0,
            usedCount: 0,
            cancelledCount: 0,
            latestCreatedAt: ticket.createdAt,
            tickets: [],
          };
        }
        acc[eventId].tickets.push(ticket);
        acc[eventId].totalCount++;
        if (ticket.status === TicketStatus.Active) acc[eventId].activeCount++;
        else if (ticket.status === TicketStatus.Used) acc[eventId].usedCount++;
        else if (ticket.status === TicketStatus.Cancelled) acc[eventId].cancelledCount++;
        else if (ticket.status === TicketStatus.Transferred) acc[eventId].cancelledCount++;
        else if (ticket.status === TicketStatus.CancelRequested) acc[eventId].cancelledCount++;
        if (new Date(ticket.createdAt) > new Date(acc[eventId].latestCreatedAt)) {
          acc[eventId].latestCreatedAt = ticket.createdAt;
        }
        return acc;
      }, {});
      return Object.values(grouped) as (TicketGroupDto & { eventId: string; tickets: Ticket[] })[];
    },
    enabled: !!ownerId,
  });
};

// 이벤트 ID로 티켓 조회
export const useTicketsByEventId = (eventId: string) => {
  return useQuery({
    queryKey: ['tickets', 'event', eventId],
    queryFn: () => getTicketsByEventId(eventId),
    enabled: !!eventId,
  });
};

// 티켓 ID로 티켓 조회
export const useTicketById = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId,
  });
};

// 티켓 생성
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketData: CreateTicketRequest) => createTicket(ticketData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

// 티켓 업데이트
export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, updateData }: { ticketId: string; updateData: UpdateTicketRequest }) =>
      updateTicket(ticketId, updateData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

// 티켓 양도 (비즈니스 로직)
export const transferTicket = async (ticketId: string, transferData: TransferTicketRequest): Promise<Ticket> => {
  // 1. 현재 티켓 정보 조회
  const currentTicket = await getTicketById(ticketId);

  // 2. 기존 티켓 상태를 transferred로 변경
  await updateTicket(ticketId, {
    status: TicketStatus.Transferred,
    transferredAt: new Date().toISOString(),
  });

  // 3. 양도 이력 기록
  await createTransferHistory({
    ticketId: ticketId,
    fromUserId: currentTicket.ownerId,
    toUserId: transferData.newOwnerId,
    reason: transferData.reason || '티켓 양도',
  });

  // 4. 새 active 티켓 생성 (ownerId: 양도받는 사람, eventId/reservationId 등 복사)
  const newTicket = await createTicket({
    reservationId: currentTicket.reservationId,
    eventId: currentTicket.eventId,
    ownerId: transferData.newOwnerId,
    // 필요하다면 qrCode 등 추가 필드 복사
  });

  return newTicket;
};

// 여러 티켓 동시 양도 (각각 새 active 티켓 생성)
export const transferMultipleTickets = async (
  ticketIds: string[],
  transferData: TransferTicketRequest
): Promise<Ticket[]> => {
  const transferPromises = ticketIds.map(ticketId =>
    transferTicket(ticketId, transferData)
  );
  return Promise.all(transferPromises);
};

// useTransferTicket, useTransferMultipleTickets에서 위 로직을 직접 사용하도록 수정
export const useTransferTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, transferData }: { ticketId: string; transferData: TransferTicketRequest }) =>
      transferTicket(ticketId, transferData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['ticket', data.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', data.reservationId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', data.ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', data.eventId] });
    },
  });
};

export const useTransferMultipleTickets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketIds, transferData }: { ticketIds: string[]; transferData: TransferTicketRequest }) =>
      transferMultipleTickets(ticketIds, transferData),
    onSuccess: (data) => {
      data.forEach(ticket => {
        queryClient.invalidateQueries({ queryKey: ['ticket', ticket.id] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', ticket.reservationId] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'owner', ticket.ownerId] });
        queryClient.invalidateQueries({ queryKey: ['tickets', 'event', ticket.eventId] });
      });
    },
  });
};

// 티켓 삭제
export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: (_, ticketId) => {
      // 티켓 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.removeQueries({ queryKey: ['ticket', ticketId] });
    },
  });
};

// 예약 ID로 모든 티켓 삭제
export const useDeleteTicketsByReservationId = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteTicketsByReservationId,
    onSuccess: (_, reservationId) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets', 'reservation', reservationId] });
    },
  });
};

// 공연별 전체 티켓 취소 훅 (비즈니스 로직 포함)
export const useCancelAllTicketsByEvent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { eventId: string; userId: string; tickets?: any[] }>({
    mutationFn: async ({ eventId, userId, tickets }) => {
      // 프론트에서 티켓 리스트를 받아서 직접 체크(권한/상태 등)
      if (tickets && tickets.length > 0) {
        const activeTickets = tickets.filter(t => t.ownerId === userId && t.status !== TicketStatus.Cancelled);
        if (activeTickets.length === 0) throw new Error('이미 모든 티켓이 취소되었습니다.');
      }
      const result = await cancelAllTicketsByEvent(eventId, userId);
      if (!result.updated) throw new Error('취소할 티켓이 없습니다.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
    },
  });
};

// 티켓 취소 신청 훅 (비즈니스 로직 포함)
export const useRequestCancelTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { ticketId: string; userId: string; ticket?: any }>({
    mutationFn: async ({ ticketId, userId, ticket }) => {
      // 프론트에서 티켓 정보로 권한/상태 체크
      if (ticket) {
        if (ticket.ownerId !== userId) throw new Error('본인 소유 티켓만 취소 신청할 수 있습니다.');
        if (ticket.status !== TicketStatus.Active) throw new Error('취소 신청은 사용 가능한 티켓만 가능합니다.');
      }
      const result = await requestCancelTicket(ticketId, userId);
      if (!result.updated) throw new Error('취소 신청에 실패했습니다.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
    },
  });
};

export const useTicketsWithEventByOwnerId = (ownerId: string) => {
  return useQuery<TicketWithEventDto[]>({
    queryKey: ['tickets-with-event', ownerId],
    queryFn: () => getTicketsWithEventByOwnerId(ownerId),
    enabled: !!ownerId,
    staleTime: 1000 * 60,
  });
}; 