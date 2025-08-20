'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';

import Button from '@/components/base/Button';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import CheckCircleIcon from '@/components/icon/CheckCircleIcon';
import XCircleIcon from '@/components/icon/XCircleIcon';
import Spinner from '@/components/spinner/Spinner';
import { useEntrySession, useUpdateEntrySessionStatus } from '@/hooks/api/useEntry';
import { useUpdateTicketStatusByReservation } from '@/hooks/api/useTickets';
import { TicketStatus } from '@/types/model/ticket';
import { EntrySessionStatus } from '@/types/model/entry';

const EntryCheckPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useSession();
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const theme = useAppSelector((state: RootState) => state.theme.current);
  
  const [entrySessionId, setEntrySessionId] = useState<string>('');

  // Entry Session 조회 훅
  const { data: entrySession, isLoading: isLoadingSession, error: sessionError } = useEntrySession(entrySessionId);
  
  // 티켓 상태 업데이트 훅
  const { mutate: updateTicketStatus, isPending: isUpdatingTickets } = useUpdateTicketStatusByReservation();
  
  // Entry Session 상태 업데이트 훅
  const { mutate: updateEntrySessionStatus, isPending: isUpdatingSession } = useUpdateEntrySessionStatus();

  // URL 파라미터에서 entry 세션 ID 처리
  useEffect(() => {
    const entry = searchParams.get('entry');
    
    if (entry) {
      setEntrySessionId(entry);
    }
  }, [searchParams]);

  // 세션 에러 처리
  useEffect(() => {
    if (sessionError && entrySessionId) {
      showToast({
        message: '입장 세션을 찾을 수 없습니다. QR코드를 다시 확인해주세요.',
        iconType: 'error',
        autoCloseTime: 5000,
      });
    }
  }, [sessionError, entrySessionId, showToast]);

  // 입장확정 처리
  const handleConfirmEntry = async () => {
    if (!entrySession) {
      showToast({
        message: '입장 세션 정보가 없습니다.',
        iconType: 'error',
        autoCloseTime: 3000,
      });
      return;
    }

    // 입장확정 확인 Alert
    const confirmed = await showAlert({
      type: 'confirm',
      title: '입장확정',
      message: '정말 입장을 확정하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
    });

    if (confirmed) {
      // 1. 티켓 상태를 'used'로 업데이트
      updateTicketStatus({
        eventId: entrySession.eventId,
        reservationId: entrySession.reservationId,
        ownerId: entrySession.userId,
        status: TicketStatus.Used,
      }, {
        onSuccess: () => {
          // 2. Entry Session 상태도 'used'로 업데이트
          updateEntrySessionStatus({
            sessionId: entrySession.id,
            status: EntrySessionStatus.Used,
          }, {
            onSuccess: () => {
              showToast({
                message: '입장이 성공적으로 확정되었습니다.',
                iconType: 'success',
                autoCloseTime: 3000,
              });
            },
            onError: () => {
              showToast({
                message: '티켓은 업데이트되었지만 세션 상태 업데이트에 실패했습니다.',
                iconType: 'warning',
                autoCloseTime: 5000,
              });
            }
          });
        },
        onError: () => {
          showToast({
            message: '입장확정에 실패했습니다. 다시 시도해주세요.',
            iconType: 'error',
            autoCloseTime: 3000,
          });
        }
      });
    }
  };

  // 입장 가능 여부 확인
  const canConfirmEntry = entrySession && 
    entrySession.status === 'pending' && 
    !isUpdatingTickets && 
    !isUpdatingSession;

  // 테마별 텍스트 색상 함수
  const getTextColor = (type: 'label' | 'description' | 'secondary') => {
    switch (theme) {
      case 'neon':
        return type === 'label' ? 'text-cyan-300' : 
               type === 'description' ? 'text-cyan-200' : 'text-cyan-100';
      case 'dark':
        return type === 'label' ? 'text-gray-300' : 
               type === 'description' ? 'text-gray-400' : 'text-gray-500';
      default: // normal
        return type === 'label' ? 'text-gray-600' : 
               type === 'description' ? 'text-gray-500' : 'text-gray-400';
    }
  };

  // 세션 정보 렌더링 함수
  const renderSessionInfo = () => {
    if (!entrySession) return null;

    const infoData = [
      { label: '공연명', value: entrySession.events?.eventName || 'N/A' },
      { 
        label: '공연일', 
        value: entrySession.events?.eventDate ? 
          dayjs(entrySession.events.eventDate).format('YYYY년 MM월 DD일') : 'N/A',
        className: 'text-sm'
      },
      { label: '티켓 소유자', value: entrySession.reservations?.ticketHolder || 'N/A' },
      { label: '사용자', value: entrySession.users?.name || 'N/A' },
      { label: '티켓 수량', value: `${entrySession.reservations?.quantity || 'N/A'}장` },
      { 
        label: '상태', 
        value: entrySession.status === 'pending' ? '대기 중' : 
               entrySession.status === 'used' ? '사용됨' : entrySession.status,
        className: `font-semibold ${
          entrySession.status === 'pending' ? 'text-blue-600' : 
          entrySession.status === 'used' ? 'text-green-600' : 'text-gray-600'
        }`
      },
      ...(entrySession.createdAt ? [{
        label: '생성 시간',
        value: dayjs(entrySession.createdAt).format('YYYY년 MM월 DD일 HH:mm'),
        className: 'text-sm'
      }] : [])
    ];

    return infoData.map((item, index) => (
      <div key={index} className="flex justify-between">
        <span className={getTextColor('label')}>{item.label}:</span>
        <span className={item.className || 'font-semibold'}>{item.value}</span>
      </div>
    ));
  };

  if (!session?.user) {
    return (
      <ThemeDiv className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">관리자 로그인이 필요합니다.</p>
          <Button
            theme="normal"
            onClick={() => router.push('/login')}
            padding='px-6 py-2'
          >
            로그인하기
          </Button>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="h-full p-6">
      {/* 페이지 제목 - 좌상단 */}
      {/* <div>
        <h1 className="text-lg md:text-xl font-bold">입장 확인</h1>
      </div> */}

      {/* 콘텐츠 영역 */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full mb-8">

            {/* 안내 메시지 */}
            {!entrySessionId && (
              <div className="text-center space-y-4">
                <ThemeDiv className="rounded-lg p-6" isChildren>
                  <CheckCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-6">입장 확인 페이지입니다.</h2>
                  <p className={`${getTextColor('description')} mb-6`}>
                    QR 코드 스캔 후 링크를 통해 접속하세요
                  </p>
                  
                  <div className={`text-sm ${getTextColor('secondary')} text-left`}>
                    <p className="font-semibold mb-2">사용 방법:</p>
                    <ul className="space-y-1">
                      <li>• <strong>앱 스캔:</strong> 카메라 앱 등으로 스캔 후 링크 접속</li>
                      <li>• <strong>QR 스캔:</strong> 사이드바의 "QR 스캔" 메뉴 사용</li>
                    </ul>
                  </div>
                </ThemeDiv>
              </div>
            )}

            {/* 로딩 중 */}
            {isLoadingSession && (
              <ThemeDiv className="rounded-lg p-6 shadow-lg" isChildren>
                <div className="text-center py-8">
                  <Spinner size={48} />
                  <p className={getTextColor('description')}>입장 세션 정보를 불러오는 중...</p>
                  <p className={`text-sm ${getTextColor('secondary')} mt-2`}>Session ID: {entrySessionId}</p>
                </div>
              </ThemeDiv>
            )}

            {/* 세션 에러 */}
            {sessionError && (
              <ThemeDiv className="rounded-lg p-6" isChildren>
                <div className="text-center">
                  <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2 text-red-700">세션 오류</h2>
                  <p className="text-red-600 mb-4">
                    입장 세션을 찾을 수 없습니다.
                  </p>
                  <p className="text-sm text-red-500 mb-4">
                    Session ID: {entrySessionId}
                  </p>
                  <Button
                    theme="dark"
                    onClick={() => setEntrySessionId('')}
                    padding='px-6 py-2'
                  >
                    다시 시도
                  </Button>
                </div>
              </ThemeDiv>
            )}

            {/* 입장 세션 정보 표시 */}
            {entrySession && !isLoadingSession && (
              <ThemeDiv className="rounded-lg p-6 shadow-lg" isChildren>
                <div className="text-center mb-6">
                  <CheckCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-8">입장 확인</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {renderSessionInfo()}
                </div>

                {/* 입장확정 버튼 */}
                {canConfirmEntry && (
                  <div className="mb-6">
                    <Button
                      theme="neon"
                      onClick={handleConfirmEntry}
                      disabled={isUpdatingTickets || isUpdatingSession}
                      padding='px-8 py-3 w-full'
                      className="text-lg font-semibold"
                    >
                      {isUpdatingTickets || isUpdatingSession ? '처리 중...' : '입장확정'}
                    </Button>
                    <p className={`text-xs ${getTextColor('secondary')} text-center mt-2`}>
                      해당 예매의 모든 티켓이 '사용됨' 상태로 변경됩니다.
                    </p>
                  </div>
                )}

                {/* 이미 사용된 경우 */}
                {entrySession.status === 'used' && (
                  <div>
                    <div className={`${
                      theme === 'dark' ? 'bg-green-900/20 border-green-700' :
                      theme === 'neon' ? 'bg-green-900/30 border-green-500' :
                      'bg-green-50 border-green-200'
                    } border rounded-lg p-4 text-center`}>
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <p className={`font-semibold text-lg ${
                          theme === 'dark' ? 'text-green-300' :
                          theme === 'neon' ? 'text-green-200' :
                          'text-green-700'
                        }`}>
                          입장이 이미 확정되었습니다
                        </p>
                      </div>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-green-400' :
                        theme === 'neon' ? 'text-green-300' :
                        'text-green-600'
                      }`}>
                        모든 티켓이 이미 사용되었습니다.
                      </p>
                    </div>
                  </div>
                )}
              </ThemeDiv>
            )}
          </div>
        </div>
    </ThemeDiv>
  );
};

export default EntryCheckPage;