import { supabase } from '@/lib/supabaseClient';
import { Friend, FriendWithUser, CreateFriendRequest, UpdateFriendRequest, FriendRequest, FriendStatus } from '@/types/model/friend';
import { toCamelCaseKeys } from '@/util/case/case';

// 친구 요청 보내기
export const sendFriendRequest = async (request: CreateFriendRequest, userId: string): Promise<Friend> => {
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
      console.error('Friend request error:', error);
      throw error;
    }
    
    return toCamelCaseKeys<Friend>(data);
  } catch (error) {
    console.error('sendFriendRequest error:', error);
    throw error;
  }
};

// 친구 요청 응답 (수락/거절)
export const respondToFriendRequest = async (friendId: string, status: FriendStatus, userId: string): Promise<Friend> => {
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
    
    return toCamelCaseKeys<Friend>(data);
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
    const friendIds = (data || []).map((item: any) => 
      item.user_id === userId ? item.friend_id : item.user_id
    );
    
    let usersData: any[] = [];

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
    const usersMap = new Map(usersData.map((user: any) => [user.id, user]));
    
    const friendsWithUserData = (data || []).map((item: any) => {
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



// 받은/보낸 친구 요청을 한번에 조회 (pending, rejected 포함)
export const getFriendRequests = async (userId: string): Promise<{
  received: FriendRequest[];
  sent: FriendRequest[];
}> => {
  try {
    // 받은 요청과 보낸 요청을 동시에 조회 (pending, rejected 상태 포함)
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

    if (error) {
      console.error('Get friend requests error:', error);
      return { received: [], sent: [] };
    }

    const received: FriendRequest[] = [];
    const sent: FriendRequest[] = [];

    // 받은 요청의 user_id들 수집
    const receivedUserIds = (data || [])
      .filter((item: any) => item.friend_id === userId)
      .map((item: any) => item.user_id);

    // 보낸 요청의 friend_id들 수집
    const sentUserIds = (data || [])
      .filter((item: any) => item.user_id === userId)
      .map((item: any) => item.friend_id);

    // 사용자 정보를 별도로 조회
    const allUserIds = [...new Set([...receivedUserIds, ...sentUserIds])];
    let usersData: any[] = [];
    
    if (allUserIds.length > 0) {
      // Supabase Function을 사용하여 사용자 정보 조회
      const { data: users, error: usersError } = await supabase
        .rpc('get_users_by_ids', {
          user_ids: allUserIds
        });

      if (!usersError) {
        usersData = users || [];
      }
    }

    // 사용자 정보를 Map으로 변환
    const usersMap = new Map(usersData.map((user: any) => [user.id, user]));

    (data || []).forEach((item: any) => {
      if (item.friend_id === userId) {
        // 받은 요청 (내가 friend_id)
        const fromUser = usersMap.get(item.user_id);
        received.push({
          id: item.id,
          fromUserId: item.user_id,
          toUserId: item.friend_id,
          status: item.status,
          createdAt: item.created_at,
                  fromUser: {
          id: fromUser?.id || item.user_id,
          name: fromUser?.name || `사용자 ${item.user_id.slice(0, 8)}`,
          email: fromUser?.email || '',
        },
          toUser: {
            id: userId,
            name: '',
            email: '',
          }
        });
      } else if (item.user_id === userId) {
        // 보낸 요청 (내가 user_id)
        const toUser = usersMap.get(item.friend_id);
        sent.push({
          id: item.id,
          fromUserId: item.user_id,
          toUserId: item.friend_id,
          status: item.status,
          createdAt: item.created_at,
          fromUser: {
            id: userId,
            name: '',
            email: '',
          },
          toUser: {
            id: toUser?.id || item.friend_id,
            name: toUser?.name || `사용자 ${item.friend_id.slice(0, 8)}`,
            email: toUser?.email || '',
          }
        });
      }
    });

    return {
      received: toCamelCaseKeys<FriendRequest[]>(received),
      sent: toCamelCaseKeys<FriendRequest[]>(sent)
    };
  } catch (error) {
    console.error('getFriendRequests error:', error);
    return { received: [], sent: [] };
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

 