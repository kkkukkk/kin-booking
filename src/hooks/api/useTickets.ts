import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useToast from '@/hooks/useToast';
import {
  getTicketsByReservationId,
  getTicketsByOwnerId,
  getTicketsByEventId,
  getTicketById,
  requestCancelAllTicketsByEvent,
  approveCancelRequest,
  getTicketsWithEventByOwnerId,
  getTicketGroups,
  getTicketGroupsByOwnerId,
  transferTicketsByReservation,
  updateTicketStatusByReservation,
} from '@/api/ticket';
import {
  Ticket,
  TicketStatus
} from '@/types/model/ticket';
import {
  TicketGroupApiResponse,
  FetchTicketGroupDto,
  TransferTicketsRequestDto,
  TicketGroupDto
} from '@/types/dto/ticket';
import { getAllTicketsForStats } from '@/api/ticket';

// 예약 ID로 티켓 조회
export const useTicketsByReservationId = (reservationId: string) => {
  return useQuery({
    queryKey: ['tickets', 'reservation', reservationId],
    queryFn: () => getTicketsByReservationId(reservationId),
    enabled: !!reservationId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 사용자 ID로 티켓 조회
export const useTicketsByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['tickets', 'owner', ownerId],
    queryFn: () => getTicketsByOwnerId(ownerId),
    enabled: !!ownerId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 사용자 ID로 티켓 그룹 조회 (DB에서 그룹화)
export const useTicketGroupsByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['ticketGroups', ownerId],
    queryFn: () => getTicketGroupsByOwnerId(ownerId),
    select: (data) => {
      if (!data) return [];

      // 그룹핑 처리
      const groupedTickets: { [key: string]: TicketGroupDto } = {};

      data.forEach((ticket: TicketGroupApiResponse) => {
        const groupKey = `${ticket.eventId}_${ticket.reservationId}_${ticket.ownerId}`;

        if (!groupedTickets[groupKey]) {
          groupedTickets[groupKey] = {
            eventId: ticket.eventId,
            reservationId: ticket.reservationId,
            ownerId: ticket.ownerId,
            eventName: ticket.event.eventName,
            eventDate: ticket.event.eventDate,
            userName: ticket.user.name,
            status: ticket.status,
            ticketCount: 0,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
          };
        }

        groupedTickets[groupKey].ticketCount++;
      });

      return Object.values(groupedTickets);
    },
    enabled: !!ownerId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
  });
};

// 이벤트 ID로 티켓 조회
export const useTicketsByEventId = (eventId: string) => {
  return useQuery({
    queryKey: ['tickets', 'event', eventId],
    queryFn: () => getTicketsByEventId(eventId),
    enabled: !!eventId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 티켓 ID로 티켓 조회
export const useTicketById = (ticketId: string) => {
  return useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => getTicketById(ticketId),
    enabled: !!ticketId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 티켓 취소 신청 (단일 티켓)
export const useRequestCancelTicket = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ ticketId, userId }: { ticketId: string; userId: string }) => {
      const { requestCancelTicket } = await import('@/api/ticket');
      return requestCancelTicket(ticketId, userId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      showToast({ message: '취소 신청이 완료되었습니다.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      console.error('취소 신청 실패:', error);
      showToast({ message: '취소 신청에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 티켓 양도 (예매 ID로)
export const useTransferTicketsByReservation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (request: TransferTicketsRequestDto) => {
      return transferTicketsByReservation(request);
    },
    onSuccess: (data) => {
      showToast({
        message: `${data.transferred}장의 티켓이 성공적으로 양도되었습니다.`,
        iconType: 'success',
        autoCloseTime: 3000
      });

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      queryClient.invalidateQueries({ queryKey: ['ticketStats'] });
    },
    onError: (error: Error) => {
      showToast({
        message: `양도 실패: ${error.message}`,
        iconType: 'error'
      });
    }
  });
};

// 티켓 묶음 취소 신청 훅
export const useRequestCancelAllTicketsByEvent = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId, userId, reservationId, tickets }: {
      eventId: string;
      userId: string;
      reservationId: string;
      tickets: Ticket[];
    }) => {
      // 활성 상태의 티켓만 필터링
      const activeTickets = tickets.filter(t => t.status === TicketStatus.Active);
      if (activeTickets.length === 0) {
        throw new Error('취소 신청할 수 있는 활성 티켓이 없습니다.');
      }

      return requestCancelAllTicketsByEvent(eventId, userId, reservationId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      showToast({ message: `취소 신청이 완료되었습니다. (${data.updated}장)`, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      console.error('취소 신청 실패:', error);
      showToast({ message: '취소 신청에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 이벤트 정보와 함께 사용자 티켓 조회
export const useTicketsWithEventByOwnerId = (ownerId: string) => {
  return useQuery({
    queryKey: ['tickets', 'withEvent', 'owner', ownerId],
    queryFn: () => getTicketsWithEventByOwnerId(ownerId),
    enabled: !!ownerId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
  });
};

// 티켓 통계 조회 훅
export const useTicketStats = () => {
  return useQuery({
    queryKey: ['ticketStats'],
    queryFn: () => getAllTicketsForStats(),
    select: (data) => {
      if (!data) return null;

      // 그룹별 통계 계산
      const groupStats: {
        [key: string]: {
          eventId: string;
          reservationId: string;
          ownerId: string;
          statuses: string[];
          ticketCount: number;
        }
      } = {};

      data.forEach((ticket: TicketGroupApiResponse) => {
        const groupKey = `${ticket.eventId}_${ticket.reservationId}_${ticket.ownerId}`;

        if (!groupStats[groupKey]) {
          groupStats[groupKey] = {
            eventId: ticket.eventId,
            reservationId: ticket.reservationId,
            ownerId: ticket.ownerId,
            statuses: [],
            ticketCount: 0
          };
        }

        groupStats[groupKey].statuses.push(ticket.status);
        groupStats[groupKey].ticketCount++;
      });

      // 상태별 통계 계산
      let totalGroups = 0;
      let totalTickets = 0;
      let activeGroups = 0;
      let activeTickets = 0;
      let cancelRequestedGroups = 0;
      let cancelRequestedTickets = 0;
      let cancelledGroups = 0;
      let cancelledTickets = 0;
      let usedGroups = 0;
      let usedTickets = 0;
      let transferredGroups = 0;
      let transferredTickets = 0;

      Object.values(groupStats).forEach(group => {
        totalGroups++;
        totalTickets += group.ticketCount;

        // 그룹의 주요 상태 결정 (우선순위: active > cancel_requested > used > transferred > cancelled)
        let groupStatus = 'cancelled';
        if (group.statuses.includes('active')) groupStatus = 'active';
        else if (group.statuses.includes('cancel_requested')) groupStatus = 'cancel_requested';
        else if (group.statuses.includes('used')) groupStatus = 'used';
        else if (group.statuses.includes('transferred')) groupStatus = 'transferred';

        // 상태별 그룹 수 카운트
        switch (groupStatus) {
          case 'active':
            activeGroups++;
            break;
          case 'cancel_requested':
            cancelRequestedGroups++;
            break;
          case 'cancelled':
            cancelledGroups++;
            break;
          case 'used':
            usedGroups++;
            break;
          case 'transferred':
            transferredGroups++;
            break;
        }

        // 상태별 티켓 수 카운트
        group.statuses.forEach(status => {
          switch (status) {
            case 'active':
              activeTickets++;
              break;
            case 'cancel_requested':
              cancelRequestedTickets++;
              break;
            case 'cancelled':
              cancelledTickets++;
              break;
            case 'used':
              usedTickets++;
              break;
            case 'transferred':
              transferredTickets++;
              break;
          }
        });
      });

      return {
        totalGroups,
        totalTickets,
        activeGroups,
        activeTickets,
        cancelRequestedGroups,
        cancelRequestedTickets,
        cancelledGroups,
        cancelledTickets,
        usedGroups,
        usedTickets,
        transferredGroups,
        transferredTickets,
        averageTicketsPerGroup: totalGroups > 0 ? Number((totalTickets / totalGroups).toFixed(1)) : 0
      };
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 티켓 그룹 조회 훅
export const useTicketGroups = (params?: FetchTicketGroupDto) => {
  return useQuery({
    queryKey: ['ticketGroups', params],
    queryFn: () => getTicketGroups(params),
    select: (data) => {
      if (!data) return [];

      // 그룹핑 처리
      const groupedTickets: { [key: string]: TicketGroupDto } = {};

      data.forEach((ticket: TicketGroupApiResponse) => {
        const groupKey = `${ticket.eventId}_${ticket.reservationId}_${ticket.ownerId}`;

        if (!groupedTickets[groupKey]) {
          groupedTickets[groupKey] = {
            eventId: ticket.eventId,
            reservationId: ticket.reservationId,
            ownerId: ticket.ownerId,
            eventName: ticket.event.eventName,
            eventDate: ticket.event.eventDate,
            userName: ticket.user.name,
            status: ticket.status,
            ticketCount: 0,
            createdAt: ticket.createdAt,
            updatedAt: ticket.updatedAt
          };
        }

        groupedTickets[groupKey].ticketCount++;
      });

      return Object.values(groupedTickets);
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
  });
};

// 취소 신청 승인 훅
export const useApproveCancelRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId, reservationId, ownerId }: {
      eventId: string;
      reservationId: string;
      ownerId: string;
    }) => {
      return approveCancelRequest(eventId, reservationId, ownerId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      showToast({ message: `취소 신청이 승인되었습니다. (${data.updated}장)`, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      console.error('취소 신청 승인 실패:', error);
      showToast({ message: '취소 신청 승인에 실패했습니다.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 티켓 상태 업데이트 훅 (입장확정용)
export const useUpdateTicketStatusByReservation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async ({
      eventId,
      reservationId,
      ownerId,
      status
    }: {
      eventId: string;
      reservationId: string;
      ownerId: string;
      status: string;
    }) => {
      return updateTicketStatusByReservation(eventId, reservationId, ownerId, status);
    },
    onSuccess: (data, variables) => {
      const { eventId, ownerId } = variables;

      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'withEvent', 'owner', ownerId] });
      queryClient.invalidateQueries({ queryKey: ['tickets', 'event', eventId] });

      showToast({
        message: `${data.updated}장의 티켓이 성공적으로 업데이트되었습니다.`,
        iconType: 'success',
        autoCloseTime: 3000
      });
    },
    onError: (error: Error) => {
      console.error('티켓 상태 업데이트 실패:', error);
      showToast({
        message: '티켓 상태 업데이트에 실패했습니다.',
        iconType: 'error',
        autoCloseTime: 3000
      });
    },
  });
}; 