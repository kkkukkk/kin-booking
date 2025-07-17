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
    staleTime: 0, // 캐시하지 않음 - 실시간 데이터
  });
};

// 요청(보낸/받은) 목록 조회
export const useFriendRequests = () => {
  const { session } = useSession();

  return useQuery<FriendWithUser[], Error, FriendResponse>({
    queryKey: ['friendRequests', session?.user?.id],
    queryFn: () => getFriendRequests(), // 뷰에서 is_my_request 포함
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
        req => !req.isMyRequest && req.status === 'pending' // 받은 요청: 거절된 건 제외
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
    onMutate: async (variables) => {
      await queryClient.setQueryData(['friendStatus', variables.friendId], FriendStatus.Pending);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
      showToast({ message: '친구 요청을 보냈어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: async (error: Error, variables) => {
      await queryClient.setQueryData(['friendStatus', variables.friendId], null);
      console.error('Failed to send friend request:', error);
      showToast({ message: '친구 요청에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 요청 응답 (수락/거절)
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<Friends, Error, { friendId: string; status: FriendStatus }, { previousRequests?: FriendResponse }>({
    mutationFn: ({ friendId, status }) => {
      if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
      return respondToFriendRequest(friendId, status, session.user.id);
    },
    onMutate: async ({ friendId }) => {
      // 낙관적 업데이트: 즉시 요청 목록에서 제거
      await queryClient.cancelQueries({ queryKey: ['friendRequests', session?.user?.id] });

      const previousRequests = queryClient.getQueryData<FriendResponse>(['friendRequests', session?.user?.id]);

      queryClient.setQueryData<FriendResponse>(['friendRequests', session?.user?.id], (old) => {
        if (!old) return old;
        return {
          received: old.received?.filter(req => req.id !== friendId) ?? [],
          sent: old.sent ?? [],
        };
      });

      return { previousRequests };
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
      queryClient.invalidateQueries({ queryKey: ['friends', session?.user?.id] });

      const message = status === FriendStatus.Accepted
        ? '친구 요청을 수락했어요!'
        : '친구 요청을 거절했어요.';
      showToast({ message, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error, variables, context) => {
      console.log('error', error);
      console.log('variables', variables);
      console.log('context', context);
      // 실패 시 롤백
      if (context?.previousRequests) {
        queryClient.setQueryData(['friendRequests', session?.user?.id], context.previousRequests);
      }
      showToast({ message: '친구 요청 처리에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 관계 삭제 (친구 삭제, 요청 취소, 거절된 요청 삭제)
export const useDeleteFriendRelation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<unknown, Error, { targetId?: string; status?: FriendStatus }, { previousFriends?: FriendWithUser[] }>({
    mutationFn: ({ targetId, status }) =>
      deleteFriendRelation(session?.user?.id || '', targetId, status),
    onMutate: async ({ targetId }) => {
      if (targetId) {
        // 친구 삭제인 경우 낙관적 업데이트
        await queryClient.cancelQueries({ queryKey: ['friends', session?.user?.id] });

        const previousFriends = queryClient.getQueryData<FriendWithUser[]>(['friends', session?.user?.id]);

        queryClient.setQueryData<FriendWithUser[]>(['friends', session?.user?.id], (old) => {
          if (!old) return old;
          return old.filter(friend => friend.counterpartUserId !== targetId);
        });
        
        return { previousFriends };
      }
      return {};
    },
    onSuccess: (_, { targetId, status }) => {
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: ['friends', session?.user?.id] });
        showToast({ message: '친구를 삭제했어요.', iconType: 'success', autoCloseTime: 3000 });
      } else {
        queryClient.invalidateQueries({ queryKey: ['friendRequests', session?.user?.id] });
        const message = status === FriendStatus.Pending ? '요청을 취소했어요.' : '요청을 삭제했어요.';
        showToast({ message, iconType: 'success', autoCloseTime: 3000 });
      }
    },
    onError: (error: Error, variables, context) => {
      // 실패 시 롤백 (친구 삭제인 경우만)
      if (variables.targetId && context?.previousFriends) {
        queryClient.setQueryData(['friends', session?.user?.id], context.previousFriends);
      }
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
    staleTime: 0, // 캐시하지 않음
    retry: 1,
  });
}; 