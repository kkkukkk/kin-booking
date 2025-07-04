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
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        users!friend_id(
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (error) {
      console.error('Get friends error:', error);
      return [];
    }
    
    const friendsWithUserData = (data || []).map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      friendId: item.friend_id,
      status: item.status,
      createdAt: item.created_at,
      friend: {
        id: item.users?.id || item.friend_id,
        name: item.users?.name || '친구',
        email: '',
        avatar: undefined
      }
    }));
    
    return toCamelCaseKeys<FriendWithUser[]>(friendsWithUserData);
  } catch (error) {
    console.error('getFriends error:', error);
    return [];
  }
};

// 받은 친구 요청 목록 조회
export const getReceivedFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        users!user_id(
          id,
          name
        )
      `)
      .eq('friend_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Get received friend requests error:', error);
      return [];
    }
    
    const requestsWithUserData = (data || []).map((item: any) => ({
      ...item,
      fromUser: {
        id: item.users?.id || item.user_id,
        name: item.users?.name || '요청자',
        email: '',
        avatar: undefined
      },
      toUser: {
        id: userId,
        name: '',
        email: '',
        avatar: undefined
      }
    }));
    
    return toCamelCaseKeys<FriendRequest[]>(requestsWithUserData);
  } catch (error) {
    console.error('getReceivedFriendRequests error:', error);
    return [];
  }
};

// 보낸 친구 요청 목록 조회
export const getSentFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        id,
        user_id,
        friend_id,
        status,
        created_at,
        users!friend_id(
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Get sent friend requests error:', error);
      return [];
    }
    
    const requestsWithUserData = (data || []).map((item: any) => ({
      ...item,
      fromUser: {
        id: userId,
        name: '',
        email: '',
        avatar: undefined
      },
      toUser: {
        id: item.users?.id || item.friend_id,
        name: item.users?.name || '받는 사람',
        email: '',
        avatar: undefined
      }
    }));
    
    return toCamelCaseKeys<FriendRequest[]>(requestsWithUserData);
  } catch (error) {
    console.error('getSentFriendRequests error:', error);
    return [];
  }
};

// 친구 삭제
export const deleteFriend = async (friendId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId);

    if (error) {
      console.error('Delete friend error:', error);
      throw error;
    }
  } catch (error) {
    console.error('deleteFriend error:', error);
    throw error;
  }
};

// 친구 차단
export const blockFriend = async (friendId: string, userId: string): Promise<Friend> => {
  try {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'blocked' })
      .eq('user_id', userId)
      .eq('friend_id', friendId)
      .select()
      .single();

    if (error) {
      console.error('Block friend error:', error);
      throw error;
    }
    
    return toCamelCaseKeys<Friend>(data);
  } catch (error) {
    console.error('blockFriend error:', error);
    throw error;
  }
};

// 사용자 검색 (친구 추가용)
export const searchUsers = async (query: string, currentUserId: string): Promise<any[]> => {
  try {
    // users 검색
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .neq('id', currentUserId)
      .limit(10);

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
      .from('friends')
      .select('status')
      .eq('user_id', userId)
      .eq('friend_id', friendId)
      .single();

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

// 친구 요청 취소
export const cancelFriendRequest = async (requestId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', requestId)
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (error) {
      console.error('Cancel friend request error:', error);
      throw error;
    }
  } catch (error) {
    console.error('cancelFriendRequest error:', error);
    throw error;
  }
}; 