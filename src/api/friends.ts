import { supabase } from '@/lib/supabaseClient';
import { Friends, FriendStatus } from '@/types/model/friends';
import { FriendWithUser, CreateFriendRequest, FriendRequest } from '@/types/dto/friends';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { User } from '@/types/model/user';

// 친구 요청 보내기
export const sendFriendRequest = async (request: CreateFriendRequest, userId: string): Promise<Friends> => {
  try {
    const requestData = {
      user_id: userId,
      friend_id: request.friendId,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('friends')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Friends request error:', error);
      throw error;
    }
    
    return toCamelCaseKeys<Friends>(data);
  } catch (error) {
    console.error('sendFriendRequest error:', error);
    throw error;
  }
};

// 친구 요청 응답 (수락/거절)
export const respondToFriendRequest = async (friendId: string, status: FriendStatus, userId: string): Promise<Friends> => {
  try {
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
  } catch (error) {
    console.error('respondToFriendRequest error:', error);
    throw error;
  }
};

// 친구 목록 조회
export const getFriends = async (userId: string): Promise<FriendWithUser[]> => {
  try {
    // friends 테이블만 조회 (users 테이블 조인 없이)
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at
      `)
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      console.error('Get friends error:', error);
      return [];
    }

    // 친구들의 ID 수집 (내가 user_id인 경우 friend_id가 친구, 내가 friend_id인 경우 user_id가 친구)
    const friendIds = (data || []).map((item: { user_id: string; friend_id: string }) => 
      item.user_id === userId ? item.friend_id : item.user_id
    );
    
    let usersData: Array<{ id: string; name: string; email: string }> = [];

    // 사용자 정보를 별도로 조회
    if (friendIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .rpc('get_users_by_ids', {
          user_ids: friendIds
        });

      if (!usersError) {
        usersData = users || [];
      }
    }

    // 사용자 정보를 Map으로 변환
    const usersMap = new Map(usersData.map((user: { id: string; name: string; email: string }) => [user.id, user]));
    
    const friendsWithUserData = (data || []).map((item: { id: string; user_id: string; friend_id: string; status: string; created_at: string }) => {
      const isMyRequest = item.user_id === userId;
      const friendId = isMyRequest ? item.friend_id : item.user_id;
      const friendUser = usersMap.get(friendId);
      
      return {
        id: item.id,
        userId: item.user_id,
        friendId: item.friend_id,
        status: item.status,
        createdAt: item.created_at,
        friend: {
          id: friendUser?.id || friendId,
          name: friendUser?.name || `사용자 ${friendId.slice(0, 8)}`,
          email: friendUser?.email || '',
        }
      };
    });
    
    return toCamelCaseKeys<FriendWithUser[]>(friendsWithUserData);
  } catch (error) {
    console.error('getFriends error:', error);
    return [];
  }
};

// 친구 관계 삭제 (친구 삭제, 요청 취소, 거절된 요청 삭제)
export const deleteFriendRelation = async (
  userId: string, 
  targetId?: string, 
  status?: FriendStatus
): Promise<void> => {
  try {
    let query = supabase.from('friends').delete().eq('user_id', userId);
    
    if (targetId) {
      // 특정 친구와의 관계 삭제 (친구 삭제)
      query = query.or(`and(user_id.eq.${userId},friend_id.eq.${targetId}),and(user_id.eq.${targetId},friend_id.eq.${userId})`);
    } else if (status) {
      // 특정 상태의 요청 삭제 (요청 취소, 거절된 요청 삭제)
      query = query.eq('status', status);
    }

    const { error } = await query;

    if (error) {
      console.error('Delete friend relation error:', error);
      throw error;
    }
  } catch (error) {
    console.error('deleteFriendRelation error:', error);
    throw error;
  }
};

// 친구 요청 목록 조회 (raw 데이터만 반환)
export const getFriendRequests = async (userId: string): Promise<{
  friends: Friends[];
  users: User[];
}> => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at
      `)
      .or(`friend_id.eq.${userId},user_id.eq.${userId}`)
      .in('status', ['pending', 'rejected']);
    if (error) return { friends: [], users: [] };
    const friends = toCamelCaseKeys<Friends[]>(data || []);
    const receivedUserIds = friends.filter(item => item.friendId === userId).map(item => item.userId);
    const sentUserIds = friends.filter(item => item.userId === userId).map(item => item.friendId);
    const allUserIds = [...new Set([...receivedUserIds, ...sentUserIds])];
    let users: User[] = [];
    if (allUserIds.length > 0) {
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users_by_ids', { user_ids: allUserIds });
      if (!usersError) users = toCamelCaseKeys<User[]>(usersData || []);
    }
    return { friends, users };
  } catch (error) {
    console.error('getFriendRequests error:', error);
    return { friends: [], users: [] };
  }
};

// 사용자 검색 (친구 추가용)
export const searchUsers = async (query: string, currentUserId: string): Promise<any[]> => {
  try {
    // Supabase Function을 사용하여 사용자 검색
    const { data, error } = await supabase
      .rpc('search_users_for_friends', {
        search_query: query,
        current_user_id: currentUserId
      });

    if (error) {
      console.error('Search users error:', error);
      return [];
    }
    
    return toCamelCaseKeys<any[]>(data || []);
  } catch (error) {
    console.error('searchUsers error:', error);
    return [];
  }
};

// 친구 관계 확인
export const checkFriendStatus = async (friendId: string, userId: string): Promise<FriendStatus | null> => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("status")
      .or(
        `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
      )
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Check friend status error:', error);
      throw error;
    }
    
    return data?.status || null;
  } catch (error) {
    console.error('checkFriendStatus error:', error);
    throw error;
  }
};

 