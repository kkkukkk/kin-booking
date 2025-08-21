'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { StatusBadge } from '@/components/status/StatusBadge';
import Button from '@/components/base/Button';
import UserInfo from '@/components/user/UserInfo';
import { useCheckFriendStatus, useSendFriendRequest } from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friends';
import { useState } from 'react';
import { useAlert } from '@/providers/AlertProvider';

interface UserSearchResultProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

const UserSearchResult = ({ user }: UserSearchResultProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { data: friendStatusData, isPending: isFriendStatusPending } = useCheckFriendStatus(user.id);
  const { mutate: sendRequest, isPending: isSending } = useSendFriendRequest();
  const { showAlert } = useAlert();

  // UI 상태 관리
  const [localStatus, setLocalStatus] = useState<FriendStatus | null>(null);
  const [isMyRequest, setIsMyRequest] = useState<boolean | null>(null);

  // 현재 상태 결정 (로컬 상태 우선, 없으면 서버 상태)
  const currentStatus = localStatus ?? friendStatusData?.status;
  const currentIsMyRequest = isMyRequest ?? friendStatusData?.isMyRequest;

  const handleSendRequest = async () => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 요청 보내기',
      message: `${user.name}님에게 친구 요청을 보낼까요?`
    });

    if (confirmed) {
      // UI 즉시 변경
      setLocalStatus(FriendStatus.Pending);
      setIsMyRequest(true);

      // API 호출
      sendRequest(
        { friendId: user.id },
        {
          onError: () => {
            // 실패 시 롤백
            setLocalStatus(null);
            setIsMyRequest(null);
          }
        }
      );
    }
  };

  const getActionButton = () => {
    if (isFriendStatusPending && !localStatus) {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      );
    }

    if (currentStatus === FriendStatus.Accepted) {
      return (
        <StatusBadge
          status={FriendStatus.Accepted}
          theme={theme}
          variant="badge"
          size="sm"
          statusType="friend"
        />
      );
    }

    if (currentStatus === FriendStatus.Pending) {
      if (currentIsMyRequest) {
        return (
          <StatusBadge
            status={FriendStatus.Pending}
            theme={theme}
            variant="badge"
            size="sm"
            statusType="friend"
          />
        );
      } else {
        return (
          <StatusBadge
            status={FriendStatus.ReceivedForUI}
            theme={theme}
            variant="badge"
            size="sm"
            statusType="friend"
          />
        );
      }
    }

    if (currentStatus === FriendStatus.Blocked) {
      return (
        <StatusBadge
          status={FriendStatus.Blocked}
          theme={theme}
          variant="badge"
          size="sm"
          statusType="friend"
        />
      );
    }

    return (
      <Button
        onClick={handleSendRequest}
        theme="dark"
        padding="px-2 py-1.5"
        fontSize="text-xs"
        className="font-semibold"
        disabled={isSending}
      >
        친구 신청
      </Button>
    );
  };

  return (
    <div className="flex items-center justify-between rounded-lg p-3 transition-colors">
      {/* 사용자 정보 */}
      <UserInfo
        name={user.name}
        email={user.email}
        theme={theme}
        avatarSize="sm"
        maskEmail={true}
      />

      {/* 액션 버튼/뱃지 */}
      <div>
        {getActionButton()}
      </div>
    </div>
  );
};

export default UserSearchResult; 