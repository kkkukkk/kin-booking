'use client';

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { useSmsTemplates, useSmsHistory, useSmsStats } from '@/hooks/api/useSms';
import { useSpinner } from '@/hooks/useSpinner';
import useToast from '@/hooks/useToast';
import SmsSendModal from './SmsSendModal';
import SmsHistoryTable from './SmsHistoryTable';
import SmsStatsCards from './SmsStatsCards';

const NotificationsClient = () => {
  const theme = useAppSelector((state) => state.theme.current);
  const { showSpinner, hideSpinner } = useSpinner();
  const { showToast } = useToast();
  
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);


  // SMS 관련 데이터 조회
  const { data: templates, isLoading: templatesLoading } = useSmsTemplates();
  const { data: history, isLoading: historyLoading } = useSmsHistory();
  const { data: stats, isLoading: statsLoading } = useSmsStats();

  const handleOpenSmsModal = () => {
    setIsSmsModalOpen(true);
  };

  const handleCloseSmsModal = () => {
    setIsSmsModalOpen(false);
  };

  const handleSmsSent = () => {
    showToast({ 
      message: 'SMS가 성공적으로 발송되었습니다.', 
      iconType: 'success',
      autoCloseTime: 3000
    });
    handleCloseSmsModal();
  };

  if (templatesLoading || historyLoading || statsLoading) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold">알림 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">로딩 중...</div>
          </div>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 헤더 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
          <h1 className="text-lg md:text-xl font-bold">알림 관리</h1>
          <p className="text-sm text-gray-600 mt-1">
            공연 관련 알림을 관리하고 SMS를 발송할 수 있습니다.
          </p>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-wrap gap-3">
          <Button
            theme={theme}
            onClick={() => handleOpenSmsModal()}
            className="px-4 py-2"
          >
            SMS 발송
          </Button>
        </div>
      </div>

      {/* 통계 카드들 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        <div className="space-y-6">
          {stats && <SmsStatsCards stats={stats} theme={theme} />}
          
          {/* SMS 발송 내역 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">SMS 발송 내역</h2>
            {history && <SmsHistoryTable history={history.data} theme={theme} />}
          </div>
        </div>
      </div>

      {/* SMS 발송 모달 */}
      {isSmsModalOpen && (
        <SmsSendModal
          isOpen={isSmsModalOpen}
          onClose={handleCloseSmsModal}
          onSuccess={handleSmsSent}
          templates={templates || []}
          theme={theme}
        />
      )}
    </ThemeDiv>
  );
};

export default NotificationsClient;
