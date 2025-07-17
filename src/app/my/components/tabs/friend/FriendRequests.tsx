'use client'

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { StatusBadge } from '@/components/status/StatusBadge';
import { 
  useFriendRequests,
  useRespondToFriendRequest, 
  useDeleteFriendRelation
} from '@/hooks/api/useFriends';
import { FriendStatus } from '@/types/model/friends';
import { InboxIcon, PaperAirplaneIcon } from '@/components/icon/FriendIcons';
import UserInfo from '@/components/user/UserInfo';
import { useAlert } from '@/providers/AlertProvider';
import clsx from 'clsx';
import {FriendWithUser} from "@/types/dto/friends";

type RequestTab = 'received' | 'sent';

const FriendRequests = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [activeTab, setActiveTab] = useState<RequestTab>('received');
  const { showAlert } = useAlert();
  
  const { data: friendRequests, isLoading: isRequestsLoading, error: requestsError } = useFriendRequests();
  const { mutate: respondToRequest, isPending: isResponding } = useRespondToFriendRequest();
  const { mutate: deleteFriendRelation, isPending: isDeleting } = useDeleteFriendRelation();

  const requests: FriendWithUser[] =
      activeTab === 'received'
          ? friendRequests?.received ?? []
          : friendRequests?.sent ?? [];

  const handleRespond = (requestId: string, status: FriendStatus) => {
    respondToRequest({ friendId: requestId, status });
  };

  const handleCancel = async (requestId: string, status: FriendStatus) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: status === FriendStatus.Pending ? '친구 요청 취소' : '거절된 요청 삭제',
      message:
          status === FriendStatus.Pending
              ? '친구 요청을 취소할까요?'
              : '거절된 요청을 삭제할까요?'
    });

    if (confirmed) {
      const request = requests.find(req => req.id === requestId);
      if (!request) return;

      if (request.isMyRequest) {
        // 내가 보낸 요청이면 status만 넘김
        deleteFriendRelation({ status: request.status });
      } else {
        // 받은 요청/친구면 targetId만 넘김
        deleteFriendRelation({ targetId: request.counterpartUserId });
      }
    }
  };

  if (isRequestsLoading) {
    return (
        <ThemeDiv className="p-8 text-center rounded-lg" isChildren>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>친구 요청을 불러오는 중...</p>
        </ThemeDiv>
    );
  }

  if (requestsError) {
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
          theme={theme === "normal" ? "dark" : theme}
          light={activeTab !== 'received'}
          className="flex-1"
          on={activeTab === 'received'}
        >
          받은 요청 ({friendRequests?.received.length ?? 0})
        </Button>
        <Button
          onClick={() => setActiveTab('sent')}
          theme={theme === "normal" ? "dark" : theme}
          light={activeTab !== 'sent'}
          className="flex-1"
          on={activeTab === 'sent'}
        >
          보낸 요청 ({friendRequests?.sent.length ?? 0})
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
            {activeTab === 'received' ? '받은 친구 요청이 없어요' : '보낸 친구 요청이 없어요'}
          </h3>
          <p className="text-sm opacity-70">
            {activeTab === 'received' 
              ? '새로운 친구 요청이 오면 여기에 표시할게요!' 
              : '친구 요청을 보내면 여기서 확인할 수 있어요!'
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
                  name={request.counterpartName}
                  email={request.counterpartEmail}
                  subtitle={`${new Date(request.createdAt).toLocaleDateString('ko-KR')} 요청`}
                  theme={theme}
                  avatarSize="md"
                  maskEmail={true}
                  rightElement={
                    activeTab === 'sent' ? (
                      <StatusBadge 
                        status={request.status} 
                        theme={theme} 
                        variant="badge" 
                        size="sm"
                      />
                    ) : null
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
                    // 보낸 요청: 상태에 따른 버튼
                    request.status === FriendStatus.Pending ? (
                      <Button
                        onClick={() => handleCancel(request.id, request.status)}
                        theme="dark"
                        className="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600"
                        disabled={isDeleting}
                      >
                        취소
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCancel(request.id, request.status)}
                        theme="dark"
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600"
                        disabled={isDeleting}
                      >
                        삭제
                      </Button>
                    )
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