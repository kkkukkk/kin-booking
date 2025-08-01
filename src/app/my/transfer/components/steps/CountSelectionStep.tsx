'use client'

import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import clsx from 'clsx';
import { FriendWithUser } from '@/types/dto/friends';

interface CountSelectionStepProps {
  selectedFriend: FriendWithUser | undefined;
  transferCount: number;
  setTransferCount: (count: number) => void;
  actualTicketCount: number;
  onConfirm: () => void;
  theme: string;
}

const CountSelectionStep = ({ 
  selectedFriend, 
  transferCount, 
  setTransferCount, 
  actualTicketCount, 
  onConfirm, 
  theme 
}: CountSelectionStepProps) => {
  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-xl font-bold mb-4">양도할 매수를 선택해주세요</h2>
      
      {/* 선택된 친구 정보 */}
      <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
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

      {/* 매수 선택 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">양도할 매수</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTransferCount(Math.max(1, transferCount - 1))}
              className={clsx(
                "w-10 h-10 rounded-lg border flex items-center justify-center",
                theme === 'normal'
                  ? "border-gray-300 hover:bg-gray-100"
                  : "border-gray-600 hover:bg-gray-700"
              )}
            >
              -
            </button>
            <span className="text-2xl font-bold min-w-[3rem] text-center">
              {transferCount}
            </span>
            <button
              onClick={() => setTransferCount(Math.min(actualTicketCount, transferCount + 1))}
              className={clsx(
                "w-10 h-10 rounded-lg border flex items-center justify-center",
                theme === 'normal'
                  ? "border-gray-300 hover:bg-gray-100"
                  : "border-gray-600 hover:bg-gray-700"
              )}
            >
              +
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            보유 매수: {actualTicketCount}장 중 {transferCount}장 선택
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          onClick={onConfirm}
          disabled={transferCount < 1}
          className="w-full"
        >
          다음
        </Button>
      </div>
    </ThemeDiv>
  );
};

export default CountSelectionStep; 