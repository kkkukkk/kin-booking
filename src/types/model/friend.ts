export enum FriendStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Blocked = 'blocked'
}

export const FriendStatusKo: Record<FriendStatus, string> = {
  [FriendStatus.Pending]: '대기중',
  [FriendStatus.Accepted]: '친구',
  [FriendStatus.Rejected]: '거절됨',
  [FriendStatus.Blocked]: '차단됨'
};

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface FriendWithUser extends Friend {
  friend: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface CreateFriendRequest {
  friendId: string;
}

export interface UpdateFriendRequest {
  status: FriendStatus;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: FriendStatus;
  createdAt: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
  };
  toUser: {
    id: string;
    name: string;
    email: string;
  };
} 