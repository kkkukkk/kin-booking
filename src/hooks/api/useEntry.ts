import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  createEntrySession, 
  getEntrySession, 
  markEntryAsUsed,
  cleanupExpiredSessions,
} from '@/api/entry';
import useToast from '@/hooks/useToast';
import dayjs from 'dayjs';

// 입장 세션 생성 훅
export const useCreateEntrySession = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createEntrySession,
    onSuccess: () => {
      showToast({
        message: '입장 QR 코드가 생성되었습니다.',
        iconType: 'success',
        autoCloseTime: 3000,
      });
    },
    onError: (error: Error) => {
      console.error('입장 세션 생성 실패:', error);
      showToast({
        message: '입장 QR 코드 생성에 실패했습니다.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
    },
  });
};

// 입장 세션 조회 훅
export const useEntrySession = (entryId: string) => {
  return useQuery({
    queryKey: ['entrySession', entryId],
    queryFn: () => getEntrySession(entryId),
    enabled: !!entryId,
    staleTime: 0, // 항상 최신 데이터
    retry: 1,
    retryDelay: 1000,
  });
};

// 입장 처리 훅 (사용 완료)
export const useMarkEntryAsUsed = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: markEntryAsUsed,
    onSuccess: (_, entryId) => {
      // 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['entrySession', entryId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticketGroups'] });
      
      showToast({
        message: '입장이 성공적으로 처리되었습니다.',
        iconType: 'success',
        autoCloseTime: 3000,
      });
    },
    onError: (error: Error) => {
      console.error('입장 처리 실패:', error);
      showToast({
        message: '입장 처리에 실패했습니다.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
    },
  });
};

// 만료된 세션 정리 훅 (선택사항)
export const useCleanupExpiredSessions = () => {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: cleanupExpiredSessions,
    onSuccess: () => {
      showToast({
        message: '만료된 세션이 정리되었습니다.',
        iconType: 'success',
        autoCloseTime: 2000,
      });
    },
    onError: (error: Error) => {
      console.error('세션 정리 실패:', error);
      showToast({
        message: '세션 정리에 실패했습니다.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
    },
  });
};

// 입장 세션 상태별 유틸리티 훅
export const useEntrySessionStatus = (entryId: string) => {
  const { data: session, isLoading, error } = useEntrySession(entryId);

  const isExpired = session ? dayjs(session.expiresAt).isBefore(dayjs()) : false;
  const isUsed = session?.status === 'used';
  const isPending = session?.status === 'pending';
  const canUse = session && isPending && !isExpired;

  return {
    session,
    isLoading,
    error,
    isExpired,
    isUsed,
    isPending,
    canUse,
  };
};