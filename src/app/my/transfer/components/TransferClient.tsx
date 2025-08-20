'use client'

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useTransferTicketsByReservation, useTicketsWithEventByOwnerId } from '@/hooks/api/useTickets';
import { useEventById } from '@/hooks/api/useEvents';
import { useFriends } from '@/hooks/api/useFriends';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { AnimatePresence, motion } from 'framer-motion';
import FriendSelectionStep from './steps/FriendSelectionStep';
import CountSelectionStep from './steps/CountSelectionStep';
import ConfirmationStep from './steps/ConfirmationStep';
import TransferProgress from './TransferProgress';
import TransferTicketInfo from './TransferTicketInfo';
import Button from '@/components/base/Button';

const TransferClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session } = useSession();
  const theme = useAppSelector((state: RootState) => state.theme.current);

  // URL 파라미터
  const eventId = searchParams.get('eventId');
  const reservationId = searchParams.get('reservationId');

  // 상태
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [transferCount, setTransferCount] = useState<number>(1);
  const [transferReason, setTransferReason] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'friend' | 'count' | 'confirm'>('friend');

  // 데이터 조회
  const { data: friends, isLoading: friendsLoading } = useFriends();
  const { data: userTickets, isLoading: ticketsLoading } = useTicketsWithEventByOwnerId(session?.user?.id || '');
  const { data: eventData } = useEventById(eventId || '');
  const { mutate: transferTickets, isPending: isTransferring } = useTransferTicketsByReservation();

  // 실제 보유 매수에 맞게 transferCount 초기화
  useEffect(() => {
    if (userTickets) {
      const targetTickets = userTickets.filter(ticket => 
        ticket.eventId === eventId && 
        ticket.reservationId === reservationId &&
        ticket.status === 'active'
      );
      if (targetTickets.length > 0) {
        setTransferCount(prevCount => Math.min(prevCount, targetTickets.length));
      }
    }
  }, [userTickets, eventId, reservationId]);

  // 유효성 검사
  useEffect(() => {
    if (!eventId || !reservationId) {
      router.push('/my');
      return;
    }
  }, [eventId, reservationId, router]);

  // 친구 선택
  const handleFriendSelect = (friendId: string) => {
    setSelectedFriendId(friendId);
    setCurrentStep('count');
  };

  // 매수 선택
  const handleCountConfirm = () => {
    setCurrentStep('confirm');
  };

  // 양도 실행
  const handleTransfer = async () => {
    if (!session?.user?.id || !selectedFriendId || !reservationId || !eventId) return;

    // 실제 양도할 티켓 수 확인
    const actualTransferCount = Math.min(transferCount, targetTickets.length);
    if (actualTransferCount === 0) {
      return;
    }

    transferTickets({
      reservationId,
      eventId,
      toUserId: selectedFriendId,
      fromUserId: session.user.id,
      transferCount: actualTransferCount,
      reason: transferReason || null
    }, {
      onSuccess: () => {
        // 양도 성공 후 잠시 대기 후 마이페이지로 이동
        setTimeout(() => {
          router.push('/my?tab=tickets');
        }, 1500); // 1.5초 후 이동
      }
    });
  };

  // 뒤로가기
  const handleBack = () => {
    if (currentStep === 'count') {
      setCurrentStep('friend');
    } else if (currentStep === 'confirm') {
      setCurrentStep('count');
    } else {
      router.push('/my');
    }
  };

  if (friendsLoading || ticketsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!eventId || !reservationId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThemeDiv className="p-6 text-center rounded-lg" isChildren>
          <h3 className="text-lg font-semibold mb-2">티켓 정보가 올바르지 않아요</h3>
          <p className="text-sm opacity-70">올바른 티켓 정보인지 확인해주세요.</p>
        </ThemeDiv>
      </div>
    );
  }

  // 해당 예매의 사용자 티켓 필터링
  const targetTickets = userTickets?.filter(ticket => 
    ticket.eventId === eventId && 
    ticket.reservationId === reservationId &&
    ticket.status === 'active'
  ) || [];

  if (targetTickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThemeDiv className="p-6 text-center rounded-lg" isChildren>
          <h3 className="text-lg font-semibold mb-2">양도할 수 있는 티켓이 없어요</h3>
          <p className="text-sm opacity-70">이미 양도되었거나 취소된 티켓일 수 있습니다.</p>
        </ThemeDiv>
      </div>
    );
  }

  // 실제 보유 매수로 업데이트
  const actualTicketCount = targetTickets.length;

  const selectedFriend = friends?.find(f => f.counterpartUserId === selectedFriendId);

  	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* 헤더 */}
      <Button
        onClick={handleBack}
        theme="dark"
        padding="px-3 py-1.5"
        reverse={theme === 'normal'}
        light={theme !== 'normal'}
        className='font-semibold'
      >
        {currentStep === 'friend' 
          ? '뒤로가기' 
          : '이전'
        }
      </Button>

			<div className="space-y-6">
        {/* 단계 표시 */}
        <TransferProgress currentStep={currentStep} theme={theme} />

        {/* 양도할 티켓 정보 */}
        <TransferTicketInfo
          tickets={targetTickets}
          eventInfo={eventData}
          theme={theme}
        />

        {/* 단계별 컴포넌트 */}
        <AnimatePresence mode="wait">
          {currentStep === 'friend' && (
            <motion.div
              key="friend"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <FriendSelectionStep
                friends={friends}
                onFriendSelect={handleFriendSelect}
                theme={theme}
              />
            </motion.div>
          )}

          {currentStep === 'count' && (
            <motion.div
              key="count"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CountSelectionStep
                selectedFriend={selectedFriend}
                transferCount={transferCount}
                setTransferCount={setTransferCount}
                transferReason={transferReason}
                setTransferReason={setTransferReason}
                actualTicketCount={actualTicketCount}
                onConfirm={handleCountConfirm}
                theme={theme}
              />
            </motion.div>
          )}

          {currentStep === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ConfirmationStep
                selectedFriend={selectedFriend}
                transferCount={transferCount}
                transferReason={transferReason}
                targetTickets={targetTickets}
                onTransfer={handleTransfer}
                onBack={handleBack}
                isTransferring={isTransferring}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TransferClient; 