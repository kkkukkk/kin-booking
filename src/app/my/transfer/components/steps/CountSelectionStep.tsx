'use client'

import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import UserInfo from '@/components/user/UserInfo';
import Counter from '@/components/base/Counter';
import { FriendWithUser } from '@/types/dto/friends';
import { Theme } from '@/types/ui/theme';
import Textarea from '@/components/base/Textarea';

interface CountSelectionStepProps {
  selectedFriend: FriendWithUser | undefined;
  transferCount: number;
  setTransferCount: (count: number) => void;
  transferReason: string;
  setTransferReason: (reason: string) => void;
  actualTicketCount: number;
  onConfirm: () => void;
  theme: Theme;
}

const CountSelectionStep = ({ 
  selectedFriend, 
  transferCount, 
  setTransferCount, 
  transferReason,
  setTransferReason,
  actualTicketCount, 
  onConfirm, 
  theme 
}: CountSelectionStepProps) => {
  return (
    <ThemeDiv className="p-6 rounded-lg" isChildren>
      <h2 className="text-base md:text-lg font-bold mb-4">양도할 매수를 선택해주세요</h2>
      
      {/* 선택된 친구 정보 */}
      <div className={
        theme === 'normal'
          ? "mb-6 p-3 rounded-lg border border-blue-300 bg-blue-50"
          : theme === 'dark'
            ? "mb-6 p-3 rounded-lg border border-blue-500 bg-blue-900/20"
            : "mb-6 p-3 rounded-lg border border-blue-500 bg-blue-900/20"
      }>
        <UserInfo
          name={selectedFriend?.counterpartName || '이름 없음'}
          email={selectedFriend?.counterpartEmail || ''}
          theme={theme}
          avatarSize="sm"
          className="min-w-0"
        />
      </div>

      {/* 매수 선택 */}
      <div className="space-y-4">
      <div>
          <label className="block text-sm font-medium mb-3">양도할 매수</label>
          <div className="flex justify-center">
            <Counter
              value={transferCount}
              min={1}
              max={actualTicketCount}
              onChange={setTransferCount}
            />
          </div>
          <p className="text-sm opacity-70 mt-3 text-center">
            보유 매수: {actualTicketCount}장 중 {transferCount}장 선택
          </p>
        </div>
      </div>

      {/* 양도 사유 */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold opacity-70">양도 사유 (선택사항)</h3>
        <Textarea
          value={transferReason}
          theme={theme}
          onChange={(e) => setTransferReason(e.target.value)}
          placeholder="양도 사유를 입력해주세요 (예: 일정 변경, 개인 사정 등)"
          className={`w-full border resize-none`}
          rows={3}
          maxLength={200}
        />
        <p className="text-xs text-right opacity-60">
          {transferReason.length}/200
        </p>
      </div>

      <div className="mt-8">
        <Button
          onClick={onConfirm}
          disabled={transferCount < 1}
          theme="dark"
          className="w-full"
          padding="py-3"
        >
          다음
        </Button>
      </div>
    </ThemeDiv>
  );
};

export default CountSelectionStep; 