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
import { NEON_VARIANTS } from '@/types/ui/neonVariant';
import UserInfo from '@/components/user/UserInfo';
import { useAlert } from '@/providers/AlertProvider';
import clsx from 'clsx';
import {FriendWithUser} from "@/types/dto/friends";
import dayjs from 'dayjs';

type RequestTab = 'received' | 'sent';

const FriendRequests = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [activeTab, setActiveTab] = useState<RequestTab>('received');
  const { showAlert } = useAlert();
  
  const { data: friendRequests, isLoading: isRequestsLoading, error: requestsError } = useFriendRequests();
  const { mutate: respondToRequest, isPending: isResponding } = useRespondToFriendRequest();
  const { mutate: deleteFriendRelation, isPending: isDeleting } = useDeleteFriendRelation();

  // UI 상태 관리
  const [localRequests, setLocalRequests] = useState<{
    received: FriendWithUser[];
    sent: FriendWithUser[];
  } | null>(null);

  // 현재 표시할 요청 목록 (로컬 상태 우선, 없으면 서버 상태)
  const currentRequests = localRequests ?? friendRequests;
  const requests: FriendWithUser[] =
      activeTab === 'received'
          ? currentRequests?.received ?? []
          : currentRequests?.sent ?? [];

  const handleRespond = async (requestId: string, status: FriendStatus) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: status === FriendStatus.Accepted ? '친구 요청 수락' : '친구 요청 거절',
      message: status === FriendStatus.Accepted 
        ? '친구 요청을 수락하시겠습니까?' 
        : '친구 요청을 거절하시겠습니까?'
    });
    
    if (confirmed) {
      // UI에서 즉시 제거
      setLocalRequests(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          received: prev.received.filter(req => req.id !== requestId)
        };
      });
      
      // API 호출
      respondToRequest(
        { friendId: requestId, status },
        {
          onError: () => {
            // 실패 시 롤백
            setLocalRequests(prev => {
              if (!prev) return prev;
              const originalRequest = friendRequests?.received.find(req => req.id === requestId);
              if (!originalRequest) return prev;
              return {
                ...prev,
                received: [...prev.received, originalRequest]
              };
            });
          }
        }
      );
    }
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

      // UI에서 즉시 제거
      setLocalRequests(prev => {
        if (!prev) return prev;
        if (request.isMyRequest) {
          return {
            ...prev,
            sent: prev.sent.filter(req => req.id !== requestId)
          };
        } else {
          return {
            ...prev,
            received: prev.received.filter(req => req.id !== requestId)
          };
        }
      });

      // API 호출
      if (request.isMyRequest) {
        deleteFriendRelation(
          { requestId: request.id, status: request.status },
          {
            onError: () => {
              // 실패 시 롤백
              setLocalRequests(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  sent: [...prev.sent, request]
                };
              });
            }
          }
        );
      } else {
        deleteFriendRelation(
          { targetId: request.counterpartUserId },
          {
            onError: () => {
              // 실패 시 롤백
              setLocalRequests(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  received: [...prev.received, request]
                };
              });
            }
          }
        );
      }
    }
  };

  if (isRequestsLoading) {
    return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>친구 요청을 불러오는 중...</p>
        </div>
    );
  }

  if (requestsError) {
    return (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">친구 요청을 불러오는데 실패했습니다.</p>
          <Button onClick={() => window.location.reload()} theme="dark">
            다시시도
          </Button>
        </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('received')}
          theme={theme === "normal" ? "dark" : theme}
          light={activeTab !== 'received'}
          padding="py-0.5"
          fontSize='text-xs sm:text-sm'
          className="flex-1 font-semibold"
          on={activeTab === 'received'}
          neonVariant={NEON_VARIANTS.BLUE}
        >
          받은 요청 ({friendRequests?.received.length ?? 0})
        </Button>
        <Button
          onClick={() => setActiveTab('sent')}
          theme={theme === "normal" ? "dark" : theme}
          light={activeTab !== 'sent'}
          padding="py-0.5"
          fontSize='text-xs sm:text-sm'
          className="flex-1 font-semibold"
          on={activeTab === 'sent'}
          neonVariant={NEON_VARIANTS.BLUE}
        >
          보낸 요청 ({friendRequests?.sent.length ?? 0})
        </Button>
      </div>

      {/* 요청 목록 */}
      {!requests || requests.length === 0 ? (
        <div className="text-center">
          <div className="mt-8 mb-6 mb:mt-12">
            <div className="relative mx-auto w-24 h-24">
              {/* 아이콘 배경 */}
              <div className={clsx(
                "absolute inset-0 rounded-full opacity-20",
                theme === "normal" ? "bg-blue-100" : "bg-[var(--neon-blue)]/20"
              )}></div>
              {/* 아이콘 */}
              <div className={clsx(
                "absolute inset-2 rounded-full flex items-center justify-center",
                theme === "normal" ? "bg-blue-50" : "bg-[var(--neon-blue)]/30"
              )}>
                {activeTab === 'received' ? (
                  <InboxIcon size={32} className="opacity-60" />
                ) : (
                  <PaperAirplaneIcon size={32} className="opacity-60" />
                )}
              </div>
            </div>
          </div>
          <h3 className="text-base md:text-xl font-bold mb-2">
            {activeTab === 'received' ? '받은 친구 요청이 없어요' : '보낸 친구 요청이 없어요'}
          </h3>
          <p className="text-sm opacity-70 mb-2 leading-relaxed">
            {activeTab === 'received' 
              ? '새로운 친구 요청이 오면 표시할게요!'
              : '친구 요청을 보내면 확인할 수 있어요!'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <ThemeDiv 
              key={request.id} 
              className={clsx(
                "px-4 py-3 rounded-lg border transition-all duration-200",
              )} 
              isChildren
            >
              <div className="flex items-center justify-between gap-3">
                {/* 사용자 정보 */}
                <UserInfo
                  name={request.counterpartName}
                  email={request.counterpartEmail}
                  subtitle={`${dayjs(request.createdAt).format('YYYY.MM.DD.')} 요청`}
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
                        statusType="friend"
                      />
                    ) : null
                  }
                />

                {/* 액션 버튼 */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {activeTab === 'received' ? (
                    // 받은 요청: 수락/거절 버튼
                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleRespond(request.id, FriendStatus.Accepted)}
                        theme="dark"
                        fontSize='text-xs'
                        padding="px-2 py-1"
                        className="bg-green-500 hover:bg-green-600 whitespace-nowrap font-semibold"
                        disabled={isResponding}
                      >
                        수락
                      </Button>
                      <Button
                        onClick={() => handleRespond(request.id, FriendStatus.Rejected)}
                        theme="dark"
                        fontSize='text-xs'
                        padding="px-2 py-1"
                        className="bg-red-500 hover:bg-red-600 whitespace-nowrap font-semibold"
                        disabled={isResponding}
                      >
                        거절
                      </Button>
                    </div>
                  ) : (
                    // 보낸 요청: 상태에 따른 버튼 (거절된 요청은 삭제버튼 표시)
                    request.status === FriendStatus.Pending ? (
                      <Button
                        onClick={() => handleCancel(request.id, request.status)}
                        theme="dark"
                        fontSize='text-xs'
                        padding="px-2 py-1"
                        className="bg-gray-500 hover:bg-gray-600 whitespace-nowrap font-semibold"
                        disabled={isDeleting}
                      >
                        취소
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleCancel(request.id, request.status)}
                        theme="dark"
                        fontSize='text-xs'
                        padding="px-2 py-1"
                        className="bg-red-500 hover:bg-red-600 whitespace-nowrap font-semibold"
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