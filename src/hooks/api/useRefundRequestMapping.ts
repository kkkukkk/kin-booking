import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRefundRequestMapping,
  getRefundRequestMappingByReservation,
  getRefundRequestMappingsByUserId
} from '@/api/refundRequestMapping';

// 환불 요청 매핑 생성
export const useCreateRefundRequestMapping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRefundRequestMapping,
    onSuccess: () => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['refundRequestMapping'] });
    },
  });
};

// 예매 ID로 환불 요청 매핑 조회
export const useRefundRequestMappingByReservation = (
  reservationId: string,
  userId: string,
  eventId: string
) => {
  return useQuery({
    queryKey: ['refundRequestMapping', 'reservation', reservationId, userId, eventId],
    queryFn: () => getRefundRequestMappingByReservation(reservationId, userId, eventId),
    enabled: !!reservationId && !!userId && !!eventId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 사용자 ID로 환불 요청 매핑 목록 조회
export const useRefundRequestMappingsByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['refundRequestMapping', 'user', userId],
    queryFn: () => getRefundRequestMappingsByUserId(userId),
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};
