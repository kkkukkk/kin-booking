import { supabase } from '@/lib/supabaseClient';
import { Friends, FriendStatus } from '@/types/model/friends';
import { CreateFriendRequest, FriendWithUser } from '@/types/dto/friends';
import { toCamelCaseKeys } from '@/util/case/case';

// 친구 목록 조회 (view 단에서 status='active' 만 보여줌)
export const getFriends = async (): Promise<FriendWithUser[]> => {
  const { data, error } = await supabase
  .from('friend_with_user_view')
  .select('*')
  .eq('status', 'accepted');

  if (error) {
    console.error('Get friends error:', error);
    return [];
  }

  return toCamelCaseKeys<FriendWithUser[]>(data || []);
};

// 친구 요청 목록 조회 (view 단에서 status='active' 만 보여줌)
export const getFriendRequests = async (): Promise<FriendWithUser[]> => {
  const { data, error } = await supabase
  .from('friend_with_user_view')
  .select('*')
  .in('status', ['pending', 'rejected']);
  if (error) {
    console.error('getFriendRequests error:', error);
    return [];
  }

  return toCamelCaseKeys<FriendWithUser[]>(data || []);
};

// 친구 요청 보내기
export const sendFriendRequest = async (
    request: CreateFriendRequest,
    userId: string
): Promise<Friends> => {
  const requestData = {
    user_id: userId,
    friend_id: request.friendId,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('friends')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return toCamelCaseKeys<Friends>(data);
};

// 친구 요청 응답 (수락/거절)
export const respondToFriendRequest = async (friendId: string, status: FriendStatus, userId: string): Promise<Friends> => {
  const { data, error } = await supabase
    .from('friends')
    .update({ status })
    .eq('id', friendId)
    .eq('friend_id', userId)
    .select()
    .single();
  if (error) {
    console.error('Respond to friend request error:', error);
    throw error;
  }

  return toCamelCaseKeys<Friends>(data);
};

// 친구 관계 삭제 (친구 삭제, 요청 취소, 거절된 요청 삭제)
export const deleteFriendRelation = async (
  userId: string, 
  targetId?: string, 
  status?: FriendStatus
): Promise<void> => {
  if (!userId) throw new Error('userId is required');

  let query = supabase.from('friends').delete();

  if (targetId) {
    // 특정 사용자와의 관계 삭제 (친구 삭제, 요청 취소 등)
    // 양방향 관계 모두 삭제: (user → friend) OR (friend → user)
    query = query.or(
        `and(user_id.eq.${userId},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${userId})`
    );
  } else if (status) {
    // 내가 보낸 특정 상태의 요청들만 삭제
    query = query.eq('user_id', userId).eq('status', status);
  } else {
    // 이도저도 아닐 경우
    throw new Error('Either targetId or status must be provided');
  }

  const { error } = await query;

  if (error) {
    console.error('Delete friend relation error:', error);
    throw error;
  }
};

// 친구 관계 상태 확인
export const checkFriendStatus = async (friendId: string, userId: string): Promise<{ status: FriendStatus | null; isMyRequest: boolean }> => {
  const { data, error } = await supabase
    .from("friend_with_user_view")
    .select("status, is_my_request")
    .or(
      `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
    )
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Check friend status error:', error);
    throw error;
  }

  return {
    status: data?.status || null,
    isMyRequest: data?.is_my_request || false
  };
};

 