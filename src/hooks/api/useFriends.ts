import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  deleteFriendRelation,
  checkFriendStatus, getFriends
} from '@/api/friends';
import { Friends, FriendStatus } from '@/types/model/friends';
import {CreateFriendRequest, FriendResponse, FriendWithUser} from "@/types/dto/friends";
import useToast from '@/hooks/useToast';
import { useSession } from '@/hooks/useSession';

// 친구 목록 조회
export const useFriends = () => {
  const { session } = useSession();
  
  return useQuery<FriendWithUser[]>({
    queryKey: ['friends', session?.user?.id],
    queryFn: () => getFriends(),
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
  });
};

// 요청(보낸/받은) 목록 조회
export const useFriendRequests = () => {
  const { session } = useSession();

  return useQuery<FriendWithUser[], Error, FriendResponse>({
    queryKey: ['friendRequests', session?.user?.id],
    queryFn: () => getFriendRequests(),
    enabled: !!session?.user?.id,
    staleTime: 0,
    gcTime: 1000 * 60,
    retry: 1,
    select: (raw: FriendWithUser[]): FriendResponse => {
      if (!raw || !Array.isArray(raw)) {
        return { sent: [], received: [] };
      }
      const sent = raw.filter(req => req.isMyRequest);
      const received = raw.filter(
        req => !req.isMyRequest && req.status === 'pending'
      );
      return { sent, received };
    }
  });
};

// 친구 요청 보내기
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<Friends, Error, CreateFriendRequest>({
    mutationFn: (request) => {
      if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
      if (!request.friendId) throw new Error('친구 ID가 필요합니다.');
      return sendFriendRequest(request, session.user.id);
    },
    onSuccess: () => {
      // 성공 시에만 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['searchUsers'] });
      showToast({ message: '친구 요청을 보냈어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: () => {
      showToast({ message: '친구 요청에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 요청 응답 (수락/거절)
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<Friends, Error, { friendId: string; status: FriendStatus }>({
    mutationFn: ({ friendId, status }) => {
      if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
      return respondToFriendRequest(friendId, status, session.user.id);
    },
    onSuccess: (_, { status }) => {
      // 성공 시에만 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['friends', session?.user?.id] });

      const message = status === FriendStatus.Accepted
        ? '친구 요청을 수락했어요!'
        : '친구 요청을 거절했어요.';
      showToast({ message, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: () => {
      showToast({ message: '친구 요청 처리에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 관계 삭제 (친구 삭제, 요청 취소, 거절된 요청 삭제)
export const useDeleteFriendRelation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<unknown, Error, { targetId?: string; status?: FriendStatus; requestId?: string }>({
    mutationFn: ({ targetId, status, requestId }) =>
      deleteFriendRelation(session?.user?.id || '', targetId, status, requestId),
    onSuccess: (_, { targetId, status }) => {
      // 성공 시에만 캐시 무효화 (UI는 컴포넌트에서 관리)
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: ['friends', session?.user?.id] });
        showToast({ message: '친구를 삭제했어요.', iconType: 'success', autoCloseTime: 3000 });
      } else {
        queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
        const message = status === FriendStatus.Pending ? '요청을 취소했어요.' : '요청을 삭제했어요.';
        showToast({ message, iconType: 'success', autoCloseTime: 3000 });
      }
    },
    onError: () => {
      showToast({ message: '작업에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 관계 확인
export const useCheckFriendStatus = (friendId: string) => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friendStatus', friendId],
    queryFn: () => checkFriendStatus(friendId, session?.user?.id || ''),
    enabled: !!friendId && !!session?.user?.id,
    staleTime: 30000, // 30초간 캐시 (UI 상태 관리로 인해 더 오래 캐시 가능)
    retry: 1,
  });
}; 