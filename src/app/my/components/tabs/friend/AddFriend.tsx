'use client'

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Input from '@/components/base/Input';
import { useSearchUsers } from '@/hooks/api/useUsers';
import useDebounce from '@/hooks/useDebounce';
import { SearchIcon } from '@/components/icon/FriendIcons';
import clsx from 'clsx';
import UserSearchResult from './UserSearchResult';

const AddFriend = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data: searchResults, isLoading: isSearching } = useSearchUsers(debouncedQuery);

  // 검색 상태 관리: 실제 검색 중이거나 debounce 대기 중일 때
  const isActuallySearching = isSearching || (searchQuery.length >= 2 && searchQuery !== debouncedQuery);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={clsx(
          "block text-sm font-medium mb-2",
          theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
        )}>
          사용자 검색
        </label>
        <Input
          type="text"
          theme={theme}
          placeholder="이름 또는 이메일로 검색..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </div>

      {searchQuery.length >= 2 && (
        <ThemeDiv className="rounded-lg" isChildren>
          {isActuallySearching ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm">검색 중...</p>
            </div>
          ) : debouncedQuery.length >= 2 && searchResults && searchResults.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium p-3 border-b border-gray-200 dark:border-gray-700">
                검색 결과 ({searchResults.length}명)
              </h4>
              {searchResults.map((user) => (
                <UserSearchResult 
                  key={user.id} 
                  user={user} 
                />
              ))}
            </div>
          ) : debouncedQuery.length >= 2 && searchResults && searchResults.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm opacity-70">검색 결과가 없어요!</p>
            </div>
          ) : null}
        </ThemeDiv>
      )}

      {searchQuery.length === 0 && (
        <ThemeDiv className="p-6 text-center rounded-lg" isChildren>
          <div className="flex justify-center mb-4">
            <SearchIcon size={64} className="opacity-50" />
          </div>
          <h3 className="text-base md:text-xl font-semibold mb-2">친구 찾기</h3>
          <p className="text-xs md:text-sm opacity-70 mb-2">
            이름이나 이메일로 사용자를 검색하세요!
          </p>
        </ThemeDiv>
      )}
    </div>
  );
};

export default AddFriend; 