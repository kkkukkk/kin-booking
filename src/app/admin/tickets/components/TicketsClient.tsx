'use client';

import { useState } from 'react';
import { useTicketGroups, useApproveCancelRequest } from '@/hooks/api/useTickets';
import DataTable from '@/components/base/DataTable';

import { TicketGroupDto } from '@/types/dto/ticket';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import SearchBar from '@/components/search/SearchBar';
import ThemeDiv from '@/components/base/ThemeDiv';
import { StatusBadge } from '@/components/status/StatusBadge';
import { TicketStatus } from '@/types/model/ticket';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import RefundInfoModal from './RefundInfoModal';
import ExcelExportModal from './ExcelExportModal';
import useToast from '@/hooks/useToast';
import dayjs from 'dayjs';

const TicketsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  
  // 필터 상태 (검색 제거)
  const [searchParams, setSearchParams] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 페이지 크기 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  // 정렬 상태 (취소신청 우선 정렬)
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'status',
    direction: 'asc'
  });

  const { data: ticketGroups, isLoading, error, refetch } = useTicketGroups({
    sortBy: sortConfig.field,
    sortDirection: sortConfig.direction,
  });
  const approveCancelMutation = useApproveCancelRequest();

  // 환불 정보 모달 상태
  const [refundModalState, setRefundModalState] = useState<{
    isOpen: boolean;
    ticketGroup: TicketGroupDto | null;
  }>({
    isOpen: false,
    ticketGroup: null,
  });

  // 엑셀 내보내기 모달 상태
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  
  // 필터링 및 정렬 (취소신청 우선 정렬)
  const filteredGroups = ticketGroups?.filter((group: TicketGroupDto) => {
    // 상태 필터링
    if (searchParams.status && group.status !== searchParams.status) {
      return false;
    }

    // 날짜 범위 필터링
    if (searchParams.dateFrom || searchParams.dateTo) {
      const groupDate = dayjs(group.createdAt);
      
      if (searchParams.dateFrom && groupDate.isBefore(dayjs(searchParams.dateFrom))) {
        return false;
      }
      
      if (searchParams.dateTo && groupDate.isAfter(dayjs(searchParams.dateTo).endOf('day'))) {
        return false;
      }
    }
    
    return true;
  }).sort((a: TicketGroupDto, b: TicketGroupDto) => {
    // 취소신청 상태 우선 정렬
    if (a.status === 'cancel_requested' && b.status !== 'cancel_requested') {
      return -1; // a가 먼저
    }
    if (a.status !== 'cancel_requested' && b.status === 'cancel_requested') {
      return 1; // b가 먼저
    }
    
    // 같은 상태 그룹 내에서는 생성일 기준 정렬 (최신순)
    return dayjs(b.createdAt).diff(dayjs(a.createdAt));
  }) || [];

  // 페이지네이션 적용
  const totalCount = filteredGroups.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);



  // 상태 필터 핸들러
  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({ ...prev, status }));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  // 날짜 필터 핸들러
  const handleDateFilter = (from: string, to: string) => {
    setSearchParams(prev => ({ ...prev, dateFrom: from, dateTo: to }));
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // 정렬 핸들러
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
    setCurrentPage(1);
  };

  // 환불 정보 모달 핸들러
  const handleRefundModalClose = () => {
    setRefundModalState({
      isOpen: false,
      ticketGroup: null,
    });
  };

  const handleRefundSuccess = async () => {
    if (!refundModalState.ticketGroup) return;

    // 티켓 취소 승인 처리
    approveCancelMutation.mutate({
      eventId: refundModalState.ticketGroup.eventId,
      reservationId: refundModalState.ticketGroup.reservationId,
      ownerId: refundModalState.ticketGroup.ownerId,
    }, {
      onSuccess: () => {
        showToast({ message: '티켓이 취소되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        refetch();
        handleRefundModalClose();
      },
      onError: (error) => {
        showToast({ message: `티켓 취소에 실패했습니다: ${error.message}`, iconType: 'error' });
      },
    });
  };

  // 모바일 카드 섹션 렌더 함수
  const mobileCardSections = (group: TicketGroupDto, index: number) => ({
    firstRow: (
      <>
        <span className="font-semibold text-xs truncate">사용자: {group.userName}</span>
        <span className="text-xs truncate">{group.ticketCount}장</span>
        <StatusBadge status={group.status as TicketStatus} theme={theme} variant="badge" size="sm" statusType="ticket" />
      </>
    ),
    secondRow: (
      <>
        <span className="truncate">{group.eventName}</span>
        <span>{dayjs(group.createdAt).format('YYYY-MM-DD HH:mm')}</span>
      </>
    ),
    actionButton: (
      <>
        {group.status === 'cancel_requested' && (
          <Button
            theme="dark"
            padding="px-3 py-1"
            fontSize="text-xs"
            reverse={theme === 'normal'}
            onClick={() => handleApproveCancelRequest(group)}
            disabled={approveCancelMutation.isPending}
            className="font-semibold"
          >
            {approveCancelMutation.isPending ? '처리 중...' : '취소 승인'}
          </Button>
        )}
      </>
    ),
  });

  // 취소 승인 핸들러
  const handleApproveCancelRequest = async (group: TicketGroupDto) => {
    // 환불 정보 입력 모달 표시
    setRefundModalState({
      isOpen: true,
      ticketGroup: group,
    });
  };

  const columns = [
    {
      key: 'eventName',
      header: '공연명',
      render: (item: TicketGroupDto) => (
        <div className="font-medium">
          {item.eventName}
        </div>
      ),
    },
    {
      key: 'userName',
      header: '사용자',
      render: (item: TicketGroupDto) => (
        <div className="font-medium">
          {item.userName}
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      render: (item: TicketGroupDto) => (
        <StatusBadge
          status={item.status as TicketStatus} 
          theme={theme} 
          variant="badge" 
          size="sm"
          statusType="ticket"
        />
      ),
    },
    {
      key: 'ticketCount',
      header: '티켓 수량',
      render: (item: TicketGroupDto) => (
        <div className="font-medium">{item.ticketCount}장</div>
      ),
    },
    {
      key: 'createdAt',
      header: '생성일',
      render: (item: TicketGroupDto) => (
        <div>
          {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '액션',
      render: (item: TicketGroupDto) => (
        <div className="flex gap-2">
          {item.status === 'cancel_requested' && (
            <Button
              theme="dark"
              padding="px-3 py-1"
              fontSize="text-xs"
              reverse={theme === 'normal'}
              onClick={() => handleApproveCancelRequest(item)}
              disabled={approveCancelMutation.isPending}
              className="font-semibold"
            >
              {approveCancelMutation.isPending ? '처리 중...' : '취소 승인'}
            </Button>
          )}
        </div>
      ),
    },
  ];

  // 로딩 상태는 DataTable의 오버레이로 처리 (전체 화면 스피너 제거)

  // 에러 상태도 DataTable 영역에서 처리 (전체 화면 에러 제거)

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className={`${theme === 'neon' ? 'text-green-400' : ''} flex justify-between items-center`}>
          <h1 className="text-lg md:text-xl font-bold">티켓 관리</h1>
          <Button
            theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'normal'}
            onClick={() => setExcelModalOpen(true)}
            padding="px-3 py-1.5"
            fontSize="text-sm"
            className="font-semibold"
          >
            엑셀 다운로드
          </Button>
        </div>

        {/* 필터 (검색 제거) */}
        <SearchBar
          label="티켓 필터"
          initialOpen={false}
          filters={{
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '전체' },
                { value: 'active', label: '사용 가능' },
                { value: 'cancel_requested', label: '취소 신청' },
                { value: 'cancelled', label: '취소 완료' },
                { value: 'used', label: '사용 완료' },
              ],
            },
            dateRange: {
              from: searchParams.dateFrom,
              to: searchParams.dateTo,
              onChange: handleDateFilter,
            },
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        {/* 총 개수 */}
        <div className="flex-1 md:flex-2/3 flex justify-start mb-2 md:mb-0">
          <span className="text-sm text-gray-400">
            총 {totalCount}개 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}개 표시
          </span>
        </div>
        
        {/* 정렬 및 페이지 크기 선택 */}
        <div className="flex items-center gap-4 flex-1 justify-end shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 md:w-[80%] whitespace-nowrap">페이지당 표시:</span>
            <Select
              theme={theme}
              value={pageSize.toString()}
              onChange={(value) => handlePageSizeChange(Number(value))}
              className="text-sm min-w-20"
              options={pageSizeOptions.map(size => ({
                value: size.toString(),
                label: `${size}개`
              }))}
              fontSize="text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        <div className="flex-1 min-h-fit md:min-h-0">
          {error ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-red-500 mb-4">티켓 데이터를 불러오는 중 오류가 발생했습니다.</p>
              <button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <DataTable
              data={paginatedGroups}
              columns={columns}
              theme={theme}
              isLoading={isLoading}
              emptyMessage="티켓 데이터가 없습니다."
              loadingMessage="로딩 중..."
              className="h-full"
              mobileCardSections={mobileCardSections}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
            />
          )}
        </div>

        {/* 페이지네이션 하단 중앙 */}
        {totalCount > 0 && (
          <div className="w-full flex justify-center mt-4 flex-shrink-0">
            <PaginationButtons
              paginationInfo={{
                page: currentPage,
                totalPages,
                hasPrev: currentPage > 1,
                hasNext: currentPage < totalPages,
                size: pageSize,
              }}
              onPageChange={handlePageChange}
              showFirstLast={false}
            />
          </div>
        )}
      </div>

      {/* 환불 정보 입력 모달 */}
      {refundModalState.ticketGroup && (
        <RefundInfoModal
          isOpen={refundModalState.isOpen}
          onClose={handleRefundModalClose}
          ticketGroup={refundModalState.ticketGroup}
          onSuccess={handleRefundSuccess}
        />
      )}

      {/* 엑셀 내보내기 모달 */}
      <ExcelExportModal
        isOpen={excelModalOpen}
        onClose={() => setExcelModalOpen(false)}
      />
    </ThemeDiv>
  );
};

export default TicketsClient; 