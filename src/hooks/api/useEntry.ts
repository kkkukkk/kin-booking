import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEntrySession, processEntrySession, updateEntrySessionStatus } from '@/api/entry';

// 입장 세션 처리
export const useProcessEntrySession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processEntrySession,
    onSuccess: (data) => {
      console.log('세션 처리 성공:', data);
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['entrySessions'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      console.error('세션 처리 실패:', error);
    }
  });
};

// 입장 세션 조회
export const useEntrySession = (sessionId: string) => {
  return useQuery({
    queryKey: ['entrySession', sessionId],
    queryFn: () => getEntrySession(sessionId),
    enabled: !!sessionId,
  });
};

// 입장 세션 상태 업데이트 훅
export const useUpdateEntrySessionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, status }: { sessionId: string; status: string }) => {
      return updateEntrySessionStatus(sessionId, status);
    },
    onSuccess: (_, { sessionId }) => {
      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['entrySession', sessionId] });
    },
    onError: (error) => {
      console.error('Entry session 상태 업데이트 실패:', error);
    }
  });
};