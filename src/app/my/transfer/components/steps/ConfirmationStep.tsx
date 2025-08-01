'use client'

import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import clsx from 'clsx';
import { FriendWithUser } from '@/types/dto/friends';
import { TicketWithEventDto } from '@/types/dto/ticket';

interface ConfirmationStepProps {
  selectedFriend: FriendWithUser | undefined;
  transferCount: number;
  targetTickets: TicketWithEventDto[];
  onTransfer: () => void;
  onBack: () => void;
  isTransferring: boolean;
  theme: string;
}

const ConfirmationStep = ({ 
  selectedFriend, 
  transferCount, 
  targetTickets, 
  onTransfer, 
  onBack, 
  isTransferring, 
  theme 
}: ConfirmationStepProps) => {
  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-xl font-bold mb-4">양도 정보 확인</h2>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">양도 대상</h3>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedFriend?.counterpartName?.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{selectedFriend?.counterpartName}</p>
              <p className="text-sm text-gray-500">{selectedFriend?.counterpartEmail}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium mb-2">양도 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>양도 매수:</span>
              <span className="font-medium">{transferCount}장</span>
            </div>
            <div className="flex justify-between">
              <span>공연명:</span>
              <span className="font-medium">{targetTickets[0]?.event?.eventName || '공연명 없음'}</span>
            </div>
            <div className="flex justify-between">
              <span>공연일:</span>
              <span className="font-medium">
                {targetTickets[0]?.event?.eventDate ? 
                  new Date(targetTickets[0].event.eventDate).toLocaleDateString('ko-KR') : 
                  '미정'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onTransfer}
          disabled={isTransferring}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {isTransferring ? '양도 중...' : '양도 실행'}
        </Button>
        <Button
          onClick={onBack}
          className="w-full"
        >
          뒤로가기
        </Button>
      </div>
    </ThemeDiv>
  );
};

export default ConfirmationStep; 