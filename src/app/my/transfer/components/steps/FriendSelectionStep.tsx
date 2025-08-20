'use client'

import { useRouter } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { UsersIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/user/UserInfo';
import clsx from 'clsx';
import { FriendWithUser } from '@/types/dto/friends';

interface FriendSelectionStepProps {
  friends: FriendWithUser[] | undefined;
  onFriendSelect: (friendId: string) => void;
  theme: string;
}

const FriendSelectionStep = ({ friends, onFriendSelect, theme }: FriendSelectionStepProps) => {
  const router = useRouter();

  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-base md:text-lg font-bold mb-4">양도할 친구를 선택해주세요</h2>
      
      {!friends || friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className={clsx(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
            theme === 'normal' 
              ? "bg-gray-100" 
              : theme === 'dark' 
                ? "bg-gray-700" 
                : "bg-gray-800"
          )}>
            <UsersIcon className={clsx(
              "w-8 h-8",
              theme === 'normal' 
                ? "text-gray-400" 
                : theme === 'dark' 
                  ? "text-gray-300" 
                  : "text-gray-400"
            )} />
          </div>
          <h3 className="text-lg font-semibold mb-2">친구가 없어요</h3>
          <p className="text-sm mb-4 opacity-70">티켓 양도는 친구에게만 가능해요!</p>
          <Button
            theme="dark"
            fontSize="text-xs md:text-sm"
            padding="px-4 py-2"
            className="font-semibold"
            onClick={() => router.push('/my?tab=friends&section=add')}
          >
            친구 추가하러 가기
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map(friend => (
            <button
              key={friend.id}
              onClick={() => onFriendSelect(friend.counterpartUserId)}
              className={clsx(
                "w-full p-3 rounded-lg border transition-all text-left hover:shadow-sm",
                theme === 'normal'
                  ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  : "border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
              )}
            >
              <UserInfo
                name={friend.counterpartName || '이름 없음'}
                email={friend.counterpartEmail || ''}
                theme={theme === 'normal' ? 'normal' : 'dark'}
                avatarSize="sm"
                className="min-w-0"
              />
            </button>
          ))}
        </div>
      )}
    </ThemeDiv>
  );
};

export default FriendSelectionStep; 