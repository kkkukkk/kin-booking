import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFriends,
  getReceivedFriendRequests,
  getSentFriendRequests,
  sendFriendRequest,
  respondToFriendRequest,
  deleteFriend,
  blockFriend,
  searchUsers,
  checkFriendStatus,
  cancelFriendRequest
} from '@/api/friend';
import { CreateFriendRequest, FriendStatus } from '@/types/model/friend';
import useToast from '@/hooks/useToast';
import { useSession } from '@/hooks/useSession';

// 친구 목록 조회
export const useFriends = () => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friends'],
    queryFn: () => getFriends(session?.user?.id || ''),
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 받은 친구 요청 목록 조회
export const useReceivedFriendRequests = () => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friendRequests', 'received'],
    queryFn: () => getReceivedFriendRequests(session?.user?.id || ''),
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 보낸 친구 요청 목록 조회
export const useSentFriendRequests = () => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friendRequests', 'sent'],
    queryFn: () => getSentFriendRequests(session?.user?.id || ''),
    enabled: !!session?.user?.id,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000,
  });
};

// 친구 요청 보내기
export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: (request: CreateFriendRequest) => sendFriendRequest(request, session?.user?.id || ''),
    onMutate: async (variables) => {
      // 낙관적 업데이트: 즉시 pending 상태로 변경
      await queryClient.setQueryData(['friendStatus', variables.friendId], FriendStatus.Pending);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
      showToast({ message: '친구 요청을 보냈어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: async (error: Error, variables) => {
      // 실패 시 롤백: friendStatus를 null로
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
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      
      const message = status === FriendStatus.Accepted 
        ? '친구 요청을 수락했어요!' 
        : '친구 요청을 거절했어요.';
      showToast({ message, iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      showToast({ message: '친구 요청 처리에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 삭제
export const useDeleteFriend = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: (friendId: string) => deleteFriend(friendId, session?.user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      showToast({ message: '친구를 삭제했어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      showToast({ message: '친구 삭제에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 차단
export const useBlockFriend = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: (friendId: string) => blockFriend(friendId, session?.user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      showToast({ message: '차단을 완료했어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      showToast({ message: '차단에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 친구 요청 취소
export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useSession();

  return useMutation({
    mutationFn: (requestId: string) => cancelFriendRequest(requestId, session?.user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
      showToast({ message: '친구 요청을 취소했어요.', iconType: 'success', autoCloseTime: 3000 });
    },
    onError: (error: Error) => {
      showToast({ message: '친구 요청 취소에 실패했어요. 잠시 후 다시 시도해주세요.', iconType: 'error', autoCloseTime: 3000 });
    },
  });
};

// 사용자 검색
export const useSearchUsers = (query: string) => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query, session?.user?.id || ''),
    enabled: query.length >= 2 && !!session?.user?.id, // 2글자 이상, 세션이 있을 때만 검색
    staleTime: 5 * 60 * 1000, // 5분 캐시
    retry: 1,
    retryDelay: 1000,
  });
};

// 친구 관계 확인
export const useCheckFriendStatus = (friendId: string) => {
  const { session } = useSession();
  
  return useQuery({
    queryKey: ['friendStatus', friendId],
    queryFn: () => checkFriendStatus(friendId, session?.user?.id || ''),
    enabled: !!friendId && !!session?.user?.id,
  });
}; 