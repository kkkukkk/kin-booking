export enum FriendStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Blocked = 'blocked',
  ReceivedForUI = 'received_for_ui'  // UI 전용 상태: 요청 받음
}

export const FriendStatusKo: Record<FriendStatus, string> = {
  [FriendStatus.Pending]: '대기중',
  [FriendStatus.Accepted]: '친구',
  [FriendStatus.Rejected]: '거절됨',
  [FriendStatus.Blocked]: '차단됨',
  [FriendStatus.ReceivedForUI]: '요청 받음'
};

export interface Friends {
  id: string;
  userId: string;
  friendId: string;
  status: FriendStatus;
  createdAt: string;
  updatedAt?: string;
}