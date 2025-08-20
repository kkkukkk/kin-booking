'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { StatusBadge } from '@/components/status/StatusBadge';
import { useFriends, useDeleteFriendRelation } from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friends';
import { FriendWithUser } from '@/types/dto/friends';
import { useAlert } from '@/providers/AlertProvider';
import { UsersIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/user/UserInfo';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';

const FriendList = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showAlert } = useAlert();
  const { data: friends, isLoading, error } = useFriends();
  const { mutate: deleteFriendRelation, isPending: isDeleting } = useDeleteFriendRelation();

  // UI 상태 관리
  const [localFriends, setLocalFriends] = useState<FriendWithUser[] | null>(null);

  // 현재 표시할 친구 목록
  const currentFriends = localFriends ?? (friends || []);

  const handleDeleteFriend = async (friendName: string, friendId: string) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 삭제',
      message: `${friendName}님과 친구 관계를 끊을까요?`,
    });

    if (confirmed) {
      // UI에서 즉시 제거
      setLocalFriends(prev => {
        if (!prev) return prev;
        return prev.filter(friend => friend.counterpartUserId !== friendId);
      });

      // API 호출
      deleteFriendRelation(
        { targetId: friendId },
        {
          onError: () => {
            // 실패 시 롤백
            setLocalFriends(prev => {
              if (!prev) return prev;
              const originalFriend = friends?.find(friend => friend.counterpartUserId === friendId);
              if (!originalFriend) return prev;
              return [...prev, originalFriend];
            });
          }
        }
      );
    }
  };



  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>친구 목록 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    console.error('FriendList error:', error);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">친구 목록을 불러오는데 실패했어요.</p>
        <Button onClick={() => window.location.reload()} theme="dark">
          다시 시도
        </Button>
      </div>
    );
  }

  if (!currentFriends || currentFriends.length === 0) {
    return (
      <div className="text-center">
        <div className="my-6">
          <div className="relative mx-auto w-24 h-24 mb-4">
            {/* 친구 아이콘 배경 */}
            <div className={clsx(
              "absolute inset-0 rounded-full opacity-20",
              theme === "normal" ? "bg-pink-100" : "bg-[var(--neon-pink)]/20"
            )}></div>
            {/* 친구 아이콘 */}
            <div className={clsx(
              "absolute inset-2 rounded-full flex items-center justify-center",
              theme === "normal" ? "bg-pink-50" : "bg-[var(--neon-pink)]/30"
            )}>
              <UsersIcon size={32} className="opacity-60" />
            </div>
          </div>
        </div>
        <h3 className="text-base md:text-xl font-bold mb-3">지금은 친구가 없어요</h3>
              <p className="text-sm opacity-70 mb-2 leading-relaxed">
                  새로운 친구를 추가해보세요!
              </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h3>친구({currentFriends.length}명)</h3>
      </div>
      {currentFriends.map((friend) => (
        <ThemeDiv 
          key={friend.id} 
          className={clsx(
            "px-4 py-3 rounded-lg border transition-all duration-200",
          )} 
          isChildren
        >
          <div className="flex items-center justify-between gap-3">
            {/* 사용자 정보 (아바타+이름+뱃지) */}
            <UserInfo 
              name={friend.counterpartName}
              email={friend.counterpartEmail}
              subtitle={`${dayjs(friend.updatedAt || friend.createdAt).format('YYYY.MM.DD')} 친구됨`}
              theme={theme}
              avatarSize="md"
              rightElement={
                <StatusBadge
                  status={FriendStatus.Accepted} 
                  theme={theme} 
                  variant="badge" 
                  size="sm"
                  statusType="friend"
                />
              }
            />
            
            {/* 액션 버튼 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => handleDeleteFriend(friend.counterpartName, friend.counterpartUserId)}
                theme="dark"
                fontSize={"text-sm"}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 font-semibold whitespace-nowrap"
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