'use client'

import { useRouter } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import UserInfo from '@/components/user/UserInfo';
import { FriendWithUser } from '@/types/dto/friends';
import { TicketWithEventDto } from '@/types/dto/ticket';
import { Theme } from '@/types/ui/theme';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useAlert } from '@/providers/AlertProvider';

interface ConfirmationStepProps {
  selectedFriend: FriendWithUser | undefined;
  transferCount: number;
  transferReason: string;
  targetTickets: TicketWithEventDto[];
  onTransfer: () => void;
  onBack: () => void;
  isTransferring: boolean;
  theme: Theme;
}

const ConfirmationStep = ({ 
  selectedFriend, 
  transferCount, 
  transferReason,
  targetTickets, 
  onTransfer, 
  onBack, 
  isTransferring, 
  theme 
}: ConfirmationStepProps) => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const eventInfo = targetTickets[0]?.event;
  
  const formatEventDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      full: date.format('YYYY년 M월 D일 dddd'),
      time: date.format('HH:mm'),
      short: date.format('M월 D일'),
      detailed: date.format('YYYY년 M월 D일'),
      weekday: date.format('ddd')
    };
  };

  const handleCancel = () => {
    router.push('/my?tab=tickets');
  };

  const handleTransfer = async () => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '티켓 양도 확인',
      message: `티켓 양도 시 소유권이 상실됩니다.\n\n양도하시겠습니까?`,
    });
    
    if (confirmed) {
      onTransfer();
    }
  };

  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-base md:text-lg font-bold mb-4">양도 정보 확인</h2>
      
      <div className="space-y-4 mb-6">
        {/* 양도 대상 */}
        <div className={`p-3 rounded-lg border ${
          theme === 'normal' 
            ? 'border-gray-200' 
            : theme === 'dark' 
              ? 'border-gray-600' 
              : 'border-gray-600'
        }`}>
          <h3 className="text-sm font-semibold mb-3 opacity-70">양도 대상</h3>
          <UserInfo
            name={selectedFriend?.counterpartName || '이름 없음'}
            email={selectedFriend?.counterpartEmail || ''}
            theme={theme}
            avatarSize="sm"
            className="min-w-0"
          />
        </div>

        {/* 양도 정보 */}
        <div className={`p-3 rounded-lg border ${
          theme === 'normal' 
            ? 'border-gray-200' 
            : theme === 'dark' 
              ? 'border-gray-600' 
              : 'border-gray-600'
        }`}>
          <h3 className="text-sm font-semibold mb-3 opacity-70">양도 정보</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="opacity-70">공연명:</span>
              <span className="font-medium text-right max-w-[200px] line-clamp-2">
                {eventInfo?.eventName || '공연명 없음'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">공연일시:</span>
              <span className="font-medium text-right">
                {eventInfo?.eventDate ? 
                  `${formatEventDate(eventInfo.eventDate).detailed} ${formatEventDate(eventInfo.eventDate).time}` : 
                  '미정'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-70">양도 매수:</span>
              <span className="font-semibold text-base">{transferCount}장</span>
            </div>
          </div>
        </div>

        {/* 양도 사유 */}
        {transferReason && (
          <div className={`p-3 rounded-lg border ${
            theme === 'normal' 
              ? 'border-gray-200' 
              : theme === 'dark' 
                ? 'border-gray-600' 
                : 'border-gray-600'
          }`}>
            <h3 className="text-sm font-semibold mb-3 opacity-70">양도 사유</h3>
            <p className={clsx("text-sm", theme === 'normal' ? 'text-gray-700' : 'text-gray-300')}>
              {transferReason}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleTransfer}
          disabled={isTransferring}
          theme={theme === "normal" ? "dark" : theme}
          padding="py-3"
          fontSize='text-sm'
          className="font-semibold w-full"
          reverse={theme === 'normal'}
        >
          {isTransferring ? '양도 중...' : '양도하기'}
        </Button>
        <Button
          onClick={handleCancel}
          theme={theme === "normal" ? "dark" : theme}
          padding="py-3"
          fontSize='text-sm'
          className="font-semibold w-full"
          reverse={theme === 'normal'}
        >
          취소
        </Button>
      </div>
    </ThemeDiv>
  );
};

export default ConfirmationStep; 