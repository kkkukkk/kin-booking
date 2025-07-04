'use client'

import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { StatusBadge } from '@/components/base/StatusBadge';
import { 
  useReceivedFriendRequests, 
  useSentFriendRequests, 
  useRespondToFriendRequest, 
  useCancelFriendRequest 
} from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friend';
import { InboxIcon, PaperAirplaneIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/base/UserInfo';
import clsx from 'clsx';

type RequestTab = 'received' | 'sent';

const FriendRequests = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [activeTab, setActiveTab] = useState<RequestTab>('received');
  
  const { data: receivedRequests, isLoading: isReceivedLoading, error: receivedError } = useReceivedFriendRequests();
  const { data: sentRequests, isLoading: isSentLoading, error: sentError } = useSentFriendRequests();
  const { mutate: respondToRequest, isPending: isResponding } = useRespondToFriendRequest();
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelFriendRequest();

  const handleRespond = (requestId: string, status: FriendStatus) => {
    respondToRequest({ friendId: requestId, status });
  };

  const handleCancel = (requestId: string) => {
    cancelRequest(requestId);
  };

  const isLoading = activeTab === 'received' ? isReceivedLoading : isSentLoading;
  const error = activeTab === 'received' ? receivedError : sentError;
  const requests = activeTab === 'received' ? receivedRequests : sentRequests;

  if (isLoading) {
    return (
      <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>친구 요청을 불러오는 중...</p>
      </ThemeDiv>
    );
  }

  if (error) {
    return (
      <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
        <p className="text-red-500 mb-4">친구 요청을 불러오는데 실패했습니다.</p>
        <Button onClick={() => window.location.reload()} theme="dark">
          다시 시도
        </Button>
      </ThemeDiv>
    );
  }

  return (
    <div className="space-y-4">
      {/* 탭 버튼들 */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('received')}
          theme="dark"
          light={activeTab !== 'received'}
          className="flex-1"
          on={activeTab === 'received'}
        >
          받은 요청 ({receivedRequests?.length || 0})
        </Button>
        <Button
          onClick={() => setActiveTab('sent')}
          theme="dark"
          light={activeTab !== 'sent'}
          className="flex-1"
          on={activeTab === 'sent'}
        >
          보낸 요청 ({sentRequests?.length || 0})
        </Button>
      </div>

      {/* 요청 목록 */}
      {!requests || requests.length === 0 ? (
        <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
          <div className="flex justify-center mb-4">
            {activeTab === 'received' ? (
              <InboxIcon size={64} className="opacity-50" />
            ) : (
              <PaperAirplaneIcon size={64} className="opacity-50" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {activeTab === 'received' ? '받은 친구 요청이 없습니다' : '보낸 친구 요청이 없습니다'}
          </h3>
          <p className="text-sm opacity-70">
            {activeTab === 'received' 
              ? '새로운 친구 요청이 오면 여기에 표시됩니다.' 
              : '친구 요청을 보내면 여기에 표시됩니다.'
            }
          </p>
        </ThemeDiv>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <ThemeDiv 
              key={request.id} 
              className={clsx(
                "p-4 rounded-lg border transition-all duration-200",
                theme === 'normal' ? 'border-gray-200' : 'border-gray-700'
              )} 
              isChildren
            >
              
              <div className="flex items-center justify-between mt-2">
                {/* 사용자 정보 */}
                <UserInfo 
                  name={activeTab === 'received' 
                    ? request.fromUser.name
                    : request.toUser.name
                  }
                  email={activeTab === 'received' 
                    ? request.fromUser.email
                    : request.toUser.email
                  }
                  subtitle={`${new Date(request.createdAt).toLocaleDateString('ko-KR')} 요청`}
                  theme={theme}
                  avatarSize="md"
                  rightElement={
                    <StatusBadge 
                      status={FriendStatus.Pending} 
                      theme={theme} 
                      variant="badge" 
                      size="sm"
                    />
                  }
                />

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2">
                  {activeTab === 'received' ? (
                    // 받은 요청: 수락/거절 버튼
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleRespond(request.id, FriendStatus.Accepted)}
                        theme="dark"
                        className="px-3 py-1 text-xs bg-green-500 hover:bg-green-600"
                        disabled={isResponding}
                      >
                        수락
                      </Button>
                      <Button
                        onClick={() => handleRespond(request.id, FriendStatus.Rejected)}
                        theme="dark"
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                        disabled={isResponding}
                      >
                        거절
                      </Button>
                    </div>
                  ) : (
                    // 보낸 요청: 취소 버튼
                    <Button
                      onClick={() => handleCancel(request.id)}
                      theme="dark"
                      className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600"
                      disabled={isCancelling}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </div>
            </ThemeDiv>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests; 