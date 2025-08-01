'use client'

import { useRouter } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { UsersIcon } from '@/components/icon/FriendIcons';
import clsx from 'clsx';
import { FriendWithUser } from '@/types/dto/friends';
import { FriendStatus } from '@/types/model/friends';

interface FriendSelectionStepProps {
  friends: FriendWithUser[] | undefined;
  onFriendSelect: (friendId: string) => void;
  theme: string;
}

const FriendSelectionStep = ({ friends, onFriendSelect, theme }: FriendSelectionStepProps) => {
  const router = useRouter();

  // 테스트 데이터 (실제 데이터가 없을 때 사용)
  const testFriends: FriendWithUser[] = [
    {
      id: '1',
      userId: 'user1',
      friendId: 'friend1',
      counterpartUserId: 'friend1',
      counterpartName: '김철수',
      counterpartEmail: 'kim@example.com',
      status: FriendStatus.Accepted,
      isMyRequest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2', 
      userId: 'user1',
      friendId: 'friend2',
      counterpartUserId: 'friend2',
      counterpartName: '이영희',
      counterpartEmail: 'lee@example.com',
      status: FriendStatus.Accepted,
      isMyRequest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      userId: 'user1',
      friendId: 'friend3',
      counterpartUserId: 'friend3',
      counterpartName: '박민수',
      counterpartEmail: 'park@example.com',
      status: FriendStatus.Accepted,
      isMyRequest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // 실제 데이터가 없으면 테스트 데이터 사용
  const displayFriends = friends && friends.length > 0 ? friends : testFriends;

  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-xl font-bold mb-4">양도할 친구를 선택해주세요</h2>
      
      {displayFriends.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">친구가 없어요</h3>
          <p className="text-sm text-gray-500 mb-4">
            티켓 양도는 친구에게만 가능합니다.<br />
            친구를 추가해주세요.
          </p>
          <Button
            theme="dark"
            onClick={() => router.push('/my?tab=friends&section=add')}
          >
            친구 추가하러 가기
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayFriends.map(friend => (
            <button
              key={friend.id}
              onClick={() => onFriendSelect(friend.counterpartUserId)}
              className={clsx(
                "w-full p-4 rounded-lg border transition-all text-left",
                theme === 'normal'
                  ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  : "border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {friend.counterpartName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{friend.counterpartName}</p>
                  <p className="text-sm text-gray-500">{friend.counterpartEmail}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </ThemeDiv>
  );
};

export default FriendSelectionStep; 