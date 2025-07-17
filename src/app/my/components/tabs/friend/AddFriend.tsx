'use client'

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Input from '@/components/base/Input';
import { useSearchUsers } from '@/hooks/api/useUsers';
import { useSendFriendRequest } from '@/hooks/api/useFriends';
import useDebounce from '@/hooks/useDebounce';
import { MagnifyingGlassIcon } from '@/components/icon/FriendIcons';
import { useAlert } from '@/providers/AlertProvider';
import clsx from 'clsx';
import UserSearchResult from './UserSearchResult';
import { BulbIcon } from '@/components/icon/BulbIcon';

const AddFriend = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedQuery);
  const { mutate: sendFriendRequest, isPending } = useSendFriendRequest();
  const { showAlert } = useAlert();

  const handleSendRequest = async (friendId: string, userName: string) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '친구 요청 보내기',
      message: `${userName}님에게 친구 요청을 보낼까요?`
    });
    
    if (confirmed) {
      sendFriendRequest({ friendId });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      {/* 검색 입력 */}
      <div>
        <label className={clsx(
          "block text-sm font-medium mb-2",
          theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
        )}>
          사용자 검색
        </label>
        <Input
          type="text"
          placeholder="이름 또는 이메일로 검색..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {/* 검색 결과 */}
      {debouncedQuery.length >= 2 && (
        <ThemeDiv className="rounded-lg" isChildren>
          {isSearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm">검색 중...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium p-3 border-b border-gray-200 dark:border-gray-700">
                검색 결과 ({searchResults.length}명)
              </h4>
              {searchResults.map((user) => (
                <UserSearchResult 
                  key={user.id} 
                  user={user} 
                  onSendRequest={handleSendRequest}
                  isPending={isPending}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm opacity-70">검색 결과가 없습니다.</p>
            </div>
          )}
        </ThemeDiv>
      )}

      {/* 검색 안내 */}
      {searchQuery.length === 0 && (
        <ThemeDiv className="p-6 text-center rounded-lg" isChildren>
          <div className="flex justify-center mb-4">
            <MagnifyingGlassIcon size={64} className="opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">친구 찾기</h3>
          <p className="text-sm opacity-70 mb-2">
            이름이나 이메일로 사용자를 검색하세요!
          </p>
          <div className="text-xs opacity-70 flex gap-1 item-center justify-center">
            <BulbIcon />
            {"정확하게 입력하면 더 쉽게 찾을 수 있어요!"}
          </div>
        </ThemeDiv>
      )}
    </div>
  );
};

export default AddFriend; 