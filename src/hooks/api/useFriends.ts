import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  deleteFriendRelation,
  searchUsers,
  checkFriendStatus
} from '@/api/friends';
import {Friends, FriendStatus} from '@/types/model/friends';
import {CreateFriendRequest, FriendRequest} from "@/types/dto/friends";
import useToast from '@/hooks/useToast';
import { useSession } from '@/hooks/useSession';
import { useMemo } from 'react';

// 친구 목록 조회
export const useFriends = () => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends(session?.user?.id || ''),
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0, // 캐시하지 않음 - 실시간 데이터
  });
};

// 받은/보낸 친구 요청을 한번에 조회 (프론트에서 가공)
export const useFriendRequests = () => {
  const { session } = useSession();
  const userId = session?.user?.id || '';

  const { data, ...rest } = useQuery({
    queryKey: ['friendRequests', 'all'],
    queryFn: () => getFriendRequests(userId),
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 0,
    select: (raw) => {
      // 프론트에서 received/sent FriendRequest[]로 가공
      const usersMap = new Map((raw.users || []).map(user => [user.id, user]));
      const received: FriendRequest[] = [];
      const sent: FriendRequest[] = [];
      (raw.friends || []).forEach(item => {
        if (item.friendId === userId) {
          const fromUser = usersMap.get(item.userId);
          received.push({
            id: item.id,
            fromUserId: item.userId,
            toUserId: item.friendId,
            status: item.status,
            createdAt: item.createdAt,
            fromUser: {
              id: fromUser?.id || item.userId,
              name: fromUser?.name || `사용자 ${item.userId.slice(0, 8)}`,
              email: fromUser?.email || '',
            },
            toUser: {
              id: userId,
              name: '',
              email: '',
            }
          });
        } else if (item.userId === userId) {
          const toUser = usersMap.get(item.friendId);
          sent.push({
            id: item.id,
            fromUserId: item.userId,
            toUserId: item.friendId,
            status: item.status,
            createdAt: item.createdAt,
            fromUser: {
              id: userId,
              name: '',
              email: '',
            },
            toUser: {
              id: toUser?.id || item.friendId,
              name: toUser?.name || `사용자 ${item.friendId.slice(0, 8)}`,
              email: toUser?.email || '',
            }
          });
        }
      });
      return { received, sent };
    }
  });
  return { ...rest, data };
};

// 친구 요청 보내기
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation<Friends, Error, CreateFriendRequest>({
    mutationFn: (request) => {
      if (!session?.user?.id) throw new Error('로그인이 필요합니다.');
      return sendFriendRequest(request, session.user.id);
    },
    onMutate: async (variables) => {
      await queryClient.setQueryData(['friendStatus', variables.friendId], FriendStatus.Pending);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
      showToast({ message: '친구 요청을 보냈어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: async (error: Error, variables) => {
      await queryClient.setQueryData(['friendStatus', variables.friendId], null);
      showToast({ message: '친구 요청에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 요청 응답 (수락/거절)
export const useRespondToFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: ({ friendId, status }: { friendId: string; status: FriendStatus }) =>
      respondToFriendRequest(friendId, status, session?.user?.id || ''),
    onMutate: async ({ friendId, status }) => {
      // 낙관적 업데이트: 즉시 요청 목록에서 제거
      await queryClient.cancelQueries({ queryKey: ['friendRequests', 'all'] });

      const previousRequests = queryClient.getQueryData(['friendRequests', 'all']);

      queryClient.setQueryData(['friendRequests', 'all'], (old: any) => {
        if (!old) return old;
        return {
          received: old.received.filter((req: any) => req.fromUserId !== friendId),
          sent: old.sent
        };
      });

      return { previousRequests };
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });

      const message = status === FriendStatus.Accepted
        ? '친구 요청을 수락했어요!'
        : '친구 요청을 거절했어요.';
      showToast({ message, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error, variables, context) => {
      // 실패 시 롤백
      if (context?.previousRequests) {
        queryClient.setQueryData(['friendRequests', 'all'], context.previousRequests);
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

  return useMutation({
    mutationFn: ({ targetId, status }: { targetId?: string; status?: FriendStatus }) => 
      deleteFriendRelation(session?.user?.id || '', targetId, status),
    onMutate: async ({ targetId }) => {
      if (targetId) {
        // 친구 삭제인 경우 낙관적 업데이트
        await queryClient.cancelQueries({ queryKey: ['friends'] });
        
        const previousFriends = queryClient.getQueryData(['friends']);
        
        queryClient.setQueryData(['friends'], (old: any) => {
          if (!old) return old;
          return old.filter((friend: any) => friend.friend.id !== targetId);
        });
        
        return { previousFriends };
      }
    },
    onSuccess: (_, { targetId, status }) => {
      if (targetId) {
        queryClient.invalidateQueries({ queryKey: ['friends'] });
        showToast({ message: '친구를 삭제했어요.', iconType: 'success', autoCloseTime: 3000 });
      } else {
        queryClient.invalidateQueries({ queryKey: ['friendRequests', 'all'] });
        const message = status === FriendStatus.Pending ? '요청을 취소했어요.' : '요청을 삭제했어요.';
        showToast({ message, iconType: 'success', autoCloseTime: 3000 });
      }
    },
    onError: (error: Error, variables, context) => {
      // 실패 시 롤백 (친구 삭제인 경우만)
      if (variables.targetId && context?.previousFriends) {
        queryClient.setQueryData(['friends'], context.previousFriends);
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
    staleTime: 0, // 캐시하지 않음 - 실시간 데이터
  });
}; 