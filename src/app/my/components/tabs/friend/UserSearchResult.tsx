'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { StatusBadge } from '@/components/status/StatusBadge';
import Button from '@/components/base/Button';
import UserInfo from '@/components/user/UserInfo';
import { useCheckFriendStatus } from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friends';

interface UserSearchResultProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onSendRequest: (friendId: string, userName: string) => void;
  isPending: boolean;
}

const UserSearchResult = ({ user, onSendRequest, isPending }: UserSearchResultProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { data: friendStatusData, isPending: isFriendStatusPending } = useCheckFriendStatus(user.id);

  const getActionButton = () => {
    if (isFriendStatusPending) return;
    if (friendStatusData?.status === FriendStatus.Accepted) {
      return (
        <StatusBadge 
          status={FriendStatus.Accepted} 
          theme={theme} 
          variant="badge" 
          size="sm"
        />
      );
    }
    if (friendStatusData?.status === FriendStatus.Pending) {
      if (friendStatusData.isMyRequest) {
        return (
          <StatusBadge 
            status={FriendStatus.Pending} 
            theme={theme} 
            variant="badge" 
            size="sm"
          />
        );
      } else {
        return (
          <StatusBadge 
            status={FriendStatus.ReceivedForUI} 
            theme={theme} 
            variant="badge" 
            size="sm"
          />
        );
      }
    }
    if (friendStatusData?.status === FriendStatus.Blocked) {
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
        onClick={() => onSendRequest(user.id, user.name)}
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