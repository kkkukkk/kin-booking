'use client';

import { useState } from 'react';
import { useTicketGroups, useApproveCancelRequest } from '@/hooks/api/useTickets';
import DataTable from '@/components/base/DataTable';
import Spinner from '@/components/spinner/Spinner';
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
import useToast from '@/hooks/useToast';
import dayjs from 'dayjs';

const TicketsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  
  // 검색/필터 상태
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 페이지 크기 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'createdAt',
    direction: 'desc'
  });

  const { data: ticketGroups, isLoading, error, refetch } = useTicketGroups({
    keyword: searchParams.keyword,
    status: searchParams.status,
    dateFrom: searchParams.dateFrom,
    dateTo: searchParams.dateTo,
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
  
  // 검색 필터링
  const filteredGroups = ticketGroups?.filter((group: TicketGroupDto) => {
    // 키워드 검색
    if (searchParams.keyword) {
      const searchLower = searchParams.keyword.toLowerCase();
      if (!group.eventName?.toLowerCase().includes(searchLower) && 
          !group.userName?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
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
  }) || [];

  // 페이지네이션 적용
  const totalCount = filteredGroups.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword }));
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  };

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

  if (isLoading) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">티켓 관리</h1>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </ThemeDiv>
    );
  }

  if (error) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">티켓 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">티켓 데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
          <h1 className="text-lg md:text-xl font-bold mb-2">티켓 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <SearchBar
          label="티켓 검색 및 필터"
          initialOpen={false}
          filters={{
            keyword: {
              value: searchParams.keyword,
              onChange: handleSearch,
              placeholder: '공연명, 사용자명 검색',
            },
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '전체' },
                { value: 'active', label: '활성' },
                { value: 'cancel_requested', label: '취소 신청' },
                { value: 'cancelled', label: '취소됨' },
                { value: 'used', label: '사용됨' },
                { value: 'transferred', label: '양도됨' },
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
              showFirstLast
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
    </ThemeDiv>
  );
};

export default TicketsClient; 