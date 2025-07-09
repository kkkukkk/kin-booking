'use client'

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { useFriends, useDeleteFriendRelation } from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friends';
import { useAlert } from '@/providers/AlertProvider';
import { UsersIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/base/UserInfo';
import clsx from 'clsx';

const FriendList = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showAlert } = useAlert();
  const { data: friends, isLoading, error } = useFriends();
  const { mutate: deleteFriendRelation, isPending: isDeleting } = useDeleteFriendRelation();

  const handleDeleteFriend = async (friendName: string, friendId: string) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 삭제',
      message: `${friendName}님과 친구 관계를 끊을까요?`,
    });

    if (confirmed) {
      deleteFriendRelation({ targetId: friendId });
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
              name={friend.counterpartName}
              email={friend.counterpartEmail}
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
            
            {/* 액션 버튼 */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleDeleteFriend(friend.counterpartName, friend.counterpartUserId)}
                theme="dark"
                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                끊기
              </Button>
            </div>
          </div>
        </ThemeDiv>
      ))}
    </div>
  );
};

export default FriendList; 