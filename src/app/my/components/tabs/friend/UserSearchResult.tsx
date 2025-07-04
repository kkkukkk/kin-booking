'use client'

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { StatusBadge } from '@/components/base/StatusBadge';
import Button from '@/components/base/Button';
import UserInfo from '@/components/base/UserInfo';
import { useCheckFriendStatus } from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friend';

interface UserSearchResultProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onSendRequest: (friendId: string) => void;
  isPending: boolean;
}

const UserSearchResult = ({ user, onSendRequest, isPending }: UserSearchResultProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { data: friendStatus } = useCheckFriendStatus(user.id);

  const getActionButton = () => {
    if (friendStatus === FriendStatus.Accepted) {
      return (
        <StatusBadge 
          status={FriendStatus.Accepted} 
          theme={theme} 
          variant="badge" 
          size="sm"
        />
      );
    }
    if (friendStatus === FriendStatus.Pending) {
      return (
        <StatusBadge 
          status={FriendStatus.Pending} 
          theme={theme} 
          variant="badge" 
          size="sm"
        />
      );
    }
    if (friendStatus === FriendStatus.Blocked) {
      return (
        <StatusBadge 
          status={FriendStatus.Blocked} 
          theme={theme} 
          variant="badge" 
          size="sm"
        />
      );
    }
    return (
      <Button
        onClick={() => onSendRequest(user.id)}
        theme="dark"
        className="px-3 py-1 text-xs"
        disabled={isPending}
      >
        친구 요청
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {/* 사용자 정보 (아바타 포함) */}
      <UserInfo 
        name={user.name}
        email={user.email}
        theme={theme}
        avatarSize="sm"
      />
      
      {/* 액션 버튼/뱃지 */}
      <div>
        {getActionButton()}
      </div>
    </div>
  );
};

export default UserSearchResult; 