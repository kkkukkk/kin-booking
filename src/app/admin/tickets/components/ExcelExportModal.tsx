'use client';

import React, { useState } from 'react';
import { useEvents } from '@/hooks/api/useEvents';
import { useTicketExport } from '@/hooks/api/useTickets';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import Select from '@/components/base/Select';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useToast from '@/hooks/useToast';
import { useSpinner } from '@/hooks/useSpinner';
import dayjs from 'dayjs';

interface ExcelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExcelExportModal = ({ isOpen, onClose }: ExcelExportModalProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showSpinner, hideSpinner } = useSpinner();
  
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [exportType, setExportType] = useState<'all' | 'active' | 'cancelled' | 'used'>('active');
  const [separateByEvent, setSeparateByEvent] = useState<boolean>(true);
  
  // 공연 목록 조회
  const { data: events, isLoading: eventsLoading } = useEvents({
    page: 1,
    size: 1000 // 모든 공연 조회
  });
  
  // 티켓 내보내기 뮤테이션
  const exportMutation = useTicketExport();

  // 공연 옵션 생성
  const eventOptions = [
    { value: '', label: '전체 공연' },
    ...(events?.data?.map(event => ({
      value: event.id,
      label: `${event.eventName} (${dayjs(event.eventDate).format('YYYY-MM-DD')})`
    })) || [])
  ];

  // 내보내기 타입 옵션
  const exportTypeOptions = [
    { value: 'all', label: '전체 티켓' },
    { value: 'active', label: '사용 가능 티켓' },
    { value: 'cancelled', label: '취소된 티켓' },
    { value: 'used', label: '사용 완료 티켓' }
  ];

  // 엑셀 다운로드 처리
  const handleExport = async () => {
    showSpinner();

    try {
      const result = await exportMutation.mutateAsync({
        eventId: selectedEventId || undefined,
        status: exportType === 'all' ? undefined : exportType,
        separateByEvent: separateByEvent,
        events: events?.data?.map(event => ({ id: event.id, eventName: event.eventName }))
      });
      
      showToast({ 
        message: '엑셀 파일이 다운로드되었습니다.', 
        iconType: 'success',
        autoCloseTime: 3000
      });
      onClose();
    } catch (error) {
      showToast({ 
        message: `엑셀 다운로드에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, 
        iconType: 'error' 
      });
    } finally {
      hideSpinner();
    }
  };

  // 모달 닫기
  const handleClose = () => {
    if (exportMutation.isPending) return;
    setSelectedEventId('');
    setExportType('active');
    setSeparateByEvent(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={handleClose}>
      <div className="space-y-6 md:min-w-lg">
        {/* 제목 */}
        <div className="text-center mb-6">
          <h2 className={`text-xl font-bold ${theme === 'neon' ? 'text-cyan-400' : theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            티켓 목록 엑셀 다운로드
          </h2>
        </div>

        {/* 공연 선택 */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-cyan-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            공연 선택
          </label>
          <Select
            theme={theme}
            value={selectedEventId}
            onChange={setSelectedEventId}
            options={eventOptions}
            placeholder="공연을 선택하세요"
            className="w-full"
          />
        </div>

        {/* 내보내기 타입 선택 */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-cyan-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            내보내기 타입
          </label>
          <Select
            theme={theme}
            value={exportType}
            onChange={(value) => setExportType(value as 'all' | 'active' | 'cancelled' | 'used')}
            options={exportTypeOptions}
            className="w-full"
          />
        </div>

        {/* 공연별 탭 분리 옵션 */}
        <div className="space-y-2">
          <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-cyan-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            공연별 탭 분리
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="separateByEvent"
              checked={separateByEvent}
              onChange={(e) => setSeparateByEvent(e.target.checked)}
              className={`w-4 h-4 rounded ${theme === 'neon' ? 'text-cyan-400 bg-gray-800 border-cyan-400' : theme === 'dark' ? 'text-gray-400 bg-gray-800 border-gray-400' : 'text-gray-600 bg-white border-gray-300'}`}
            />
            <label htmlFor="separateByEvent" className={`text-sm ${theme === 'neon' ? 'text-cyan-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              공연별로 탭 분리
            </label>
          </div>
          <p className={`text-xs ${theme === 'neon' ? 'text-cyan-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            체크하면 각 공연별로 별도의 워크시트가 생성됩니다.
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className={`${theme === 'neon' ? 'bg-blue-950/20' : theme === 'dark' ? 'bg-blue-950/20' : 'bg-blue-50'} border ${theme === 'neon' ? 'border-blue-400/50' : theme === 'dark' ? 'border-blue-400/50' : 'border-blue-200'} rounded-lg p-4 space-y-2`}>
          <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-blue-200' : theme === 'dark' ? 'text-blue-200' : 'text-blue-800'} mb-2`}>
            다운로드 정보
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className={`${theme === 'neon' ? 'text-blue-300' : theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>포함 정보</span>
              <span className={`font-medium ${theme === 'neon' ? 'text-blue-200' : theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                사용자명, 이메일, 전화번호, 티켓홀더, 티켓수량, 티켓번호
              </span>
            </div>
            <div className="flex justify-between">
              <span className={`${theme === 'neon' ? 'text-blue-300' : theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>파일 형식</span>
              <span className={`font-medium ${theme === 'neon' ? 'text-blue-200' : theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>
                Excel (.xlsx)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${theme === 'neon' ? 'border-gray-700' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Button
          theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'normal'}
          onClick={handleClose}
          disabled={exportMutation.isPending}
          padding="px-3 py-1.5 md:py-1"
        >
          취소
        </Button>
        <Button
          theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'dark'}
          onClick={handleExport}
          disabled={exportMutation.isPending || eventsLoading}
          reverse={theme === 'normal'}
          padding="px-3 py-1.5 md:py-1"
        >
          {exportMutation.isPending ? '다운로드 중...' : '다운로드'}
        </Button>
      </div>
    </Modal>
  );
};

export default ExcelExportModal;
