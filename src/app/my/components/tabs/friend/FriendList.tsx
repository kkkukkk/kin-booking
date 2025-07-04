'use client'

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useFriends, useDeleteFriend, useBlockFriend } from '@/hooks/api/useFriends';
import { FriendWithUser, FriendStatus } from '@/types/model/friend';
import { useAlert } from '@/providers/AlertProvider';
import { UsersIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/base/UserInfo';
import clsx from 'clsx';

const FriendList = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showAlert } = useAlert();
  const { data: friends, isLoading, error } = useFriends();
  const { mutate: deleteFriend, isPending: isDeleting } = useDeleteFriend();
  const { mutate: blockFriend, isPending: isBlocking } = useBlockFriend();

  const handleDeleteFriend = async (friend: FriendWithUser) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 삭제',
      message: `${friend.friend.name}님을 친구 목록에서 삭제할까요?`,
    });

    if (confirmed) {
      deleteFriend(friend.friendId);
    }
  };

  const handleBlockFriend = async (friend: FriendWithUser) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 차단',
      message: `${friend.friend.name}님을 차단하시겠습니까?`,
    });

    if (confirmed) {
      blockFriend(friend.friendId);
    }
  };

  if (isLoading) {
    return (
      <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>친구 목록 불러오는 중...</p>
      </ThemeDiv>
    );
  }

  if (error) {
    console.error('FriendList error:', error);
    return (
      <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
        <p className="text-red-500 mb-4">친구 목록을 불러오는데 실패했어요.</p>
        <Button onClick={() => window.location.reload()} theme="dark">
          다시 시도
        </Button>
      </ThemeDiv>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
        <div className="flex justify-center mb-4">
          <UsersIcon size={64} className="opacity-50" />
        </div>
        <h3 className="text-lg font-semibold mb-2">지금은 친구가 없어요</h3>
        <p className="text-sm opacity-70 mb-4">새로운 친구를 추가해보세요!</p>
      </ThemeDiv>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <ThemeDiv 
          key={friend.id} 
          className={clsx(
            "p-4 rounded-lg border transition-all duration-200",
            theme === 'normal' ? 'border-gray-200' : 'border-gray-700'
          )} 
          isChildren
        >
          <div className="flex items-center justify-between">
            {/* 사용자 정보 (아바타+이름+뱃지) */}
            <UserInfo 
              name={friend.friend.name}
              email={friend.friend.email}
              subtitle={`${new Date(friend.updatedAt || friend.createdAt).toLocaleDateString('ko-KR')} 친구됨`}
              theme={theme}
              avatarSize="md"
              rightElement={
                <StatusBadge 
                  status={FriendStatus.Accepted} 
                  theme={theme} 
                  variant="badge" 
                  size="sm"
                />
              }
            />
            
            {/* 액션 버튼들 */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleDeleteFriend(friend)}
                theme="dark"
                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                삭제
              </Button>
              <Button
                onClick={() => handleBlockFriend(friend)}
                theme="dark"
                className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600"
                disabled={isBlocking}
              >
                차단
              </Button>
            </div>
          </div>
        </ThemeDiv>
      ))}
    </div>
  );
};

export default FriendList; 