import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTransferHistory,
  getTransferHistoryByTicketId,
  getReceivedTransferHistory,
  getSentTransferHistory,
  getTransferredTicketsByReservation,
  getTransferHistoryWithDetails,
  getAllTransferHistoryWithDetails,
  getAllTransferHistoryGroups,
} from '@/api/ticketTransferHistory';
import { CreateTransferHistoryRequest } from '@/types/model/ticketTransferHistory';

// 티켓 ID로 양도 이력 조회
export const useTransferHistoryByTicketId = (ticketId: string) => {
  return useQuery({
    queryKey: ['transferHistory', 'ticket', ticketId],
    queryFn: () => getTransferHistoryByTicketId(ticketId),
    enabled: !!ticketId,
    retry: 1,
  });
};

// 사용자가 받은 양도 이력 조회
export const useReceivedTransferHistory = (userId: string) => {
  return useQuery({
    queryKey: ['transferHistory', 'received', userId],
    queryFn: () => getReceivedTransferHistory(userId),
    enabled: !!userId,
    retry: 1,
  });
};

// 사용자가 보낸 양도 이력 조회
export const useSentTransferHistory = (userId: string) => {
  return useQuery({
    queryKey: ['transferHistory', 'sent', userId],
    queryFn: () => getSentTransferHistory(userId),
    enabled: !!userId,
  });
};

// 예약 ID로 양도된 티켓들 조회 (롤백용)
export const useTransferredTicketsByReservation = (reservationId: string) => {
  return useQuery({
    queryKey: ['transferredTickets', 'reservation', reservationId],
    queryFn: () => getTransferredTicketsByReservation(reservationId),
    enabled: !!reservationId,
    retry: 1,
  });
};

// 양도 이력 상세 조회
export const useTransferHistoryWithDetails = (historyId: string) => {
  return useQuery({
    queryKey: ['transferHistory', 'details', historyId],
    queryFn: () => getTransferHistoryWithDetails(historyId),
    enabled: !!historyId,
    retry: 1,
  });
};

// 관리자용 전체 양도 이력 조회
export const useAllTransferHistoryWithDetails = () => {
  return useQuery({
    queryKey: ['transferHistory', 'all'],
    queryFn: () => getAllTransferHistoryWithDetails(),
    retry: 1,
  });
};

// 관리자용 양도 이력 그룹 조회 (뷰 테이블 사용)
export const useAllTransferHistoryGroups = (params: {
  page?: number;
  size?: number;
  startDate?: string;
  endDate?: string;
  keyword?: string;
} = {}) => {
  return useQuery({
    queryKey: ['transferHistory', 'groups', params],
    queryFn: () => getAllTransferHistoryGroups(params),
    retry: 1,
  });
};

// 양도 이력 생성
export const useCreateTransferHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyData: CreateTransferHistoryRequest) => createTransferHistory(historyData),
    onSuccess: (data) => {
      // 관련 쿼리들 무효화
      queryClient.invalidateQueries({ queryKey: ['transferHistory', 'ticket', data.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['transferHistory', 'received', data.toUserId] });
      queryClient.invalidateQueries({ queryKey: ['transferHistory', 'sent', data.fromUserId] });
      queryClient.invalidateQueries({ queryKey: ['transferHistory', 'all'] });
    },
  });
}; 