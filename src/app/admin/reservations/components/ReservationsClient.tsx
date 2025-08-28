'use client';

import { useState } from 'react';
import { useReservations, useApproveReservation, useRejectReservation } from '@/hooks/api/useReservations';
import SearchBar from '@/components/search/SearchBar';
import Button from '@/components/base/Button';
import DataTable, { Column } from '@/components/base/DataTable';
import { StatusBadge } from '@/components/status/StatusBadge';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useSpinner } from '@/hooks/useSpinner';
import dayjs from 'dayjs';
import { ReservationStatus } from '@/types/model/reservation';
import ThemeDiv from '@/components/base/ThemeDiv';
import { Reservation } from '@/types/model/reservation';
import { ReservationWithEventDto } from '@/types/dto/reservation';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import PaymentInfoModal from './PaymentInfoModal';

const ReservationsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const { showSpinner, hideSpinner } = useSpinner();

  // 필터 상태 (검색 제거)
  const [searchParams, setSearchParams] = useState({
    status: '' as ReservationStatus | '',
    dateFrom: '',
    dateTo: '',
  });

  // 정렬 상태
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: 'asc' | 'desc';
  }>({
    field: 'reservedAt',
    direction: 'desc' // 최신순 (최근 예매가 먼저)
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 페이지 크기 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  // API 호출 (서버 사이드 필터링 및 정렬 활용)
  const { data: reservationsResponse, isLoading, refetch } = useReservations({
    page: currentPage,
    size: pageSize,
    status: searchParams.status || undefined,
    reservedFrom: searchParams.dateFrom || undefined,
    reservedTo: searchParams.dateTo || undefined,
    sortBy: sortConfig.field,
    sortDirection: sortConfig.direction,
  });

  // 예매 승인/취소 뮤테이션
  const approveMutation = useApproveReservation();
  const rejectMutation = useRejectReservation();

  // 입금 정보 모달 상태
  const [paymentModalState, setPaymentModalState] = useState<{
    isOpen: boolean;
    reservation: ReservationWithEventDto | null;
  }>({
    isOpen: false,
    reservation: null,
  });



  // API에서 모든 필터링과 정렬을 처리하므로 클라이언트 필터링 제거
  const finalReservations = reservationsResponse?.data || [];
  const finalTotalCount = reservationsResponse?.totalCount || 0;

  // 로딩 상태는 DataTable의 오버레이로 처리 (전체 화면 스피너 제거)

  // 필터 핸들러 (검색 제거)
  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({ ...prev, status: status as ReservationStatus | '' }));
    setCurrentPage(1);
  };

  const handleDateFilter = (from: string, to: string) => {
    setSearchParams(prev => ({ ...prev, dateFrom: from, dateTo: to }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
    setCurrentPage(1);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // 입금 정보 모달 핸들러
  const handlePaymentModalClose = () => {
    setPaymentModalState({
      isOpen: false,
      reservation: null,
    });
  };

  const handlePaymentSuccess = async () => {
    if (!paymentModalState.reservation) return;

    // 예매 상태를 확정으로 변경
    showSpinner();
    approveMutation.mutate(paymentModalState.reservation.id, {
      onSuccess: () => {
        hideSpinner();
        showToast({ message: '예매가 확정되었습니다.', iconType: 'success', autoCloseTime: 3000 });
        refetch();
        handlePaymentModalClose();
      },
      onError: (error) => {
        hideSpinner();
        showToast({ message: `예매 확정에 실패했습니다: ${error.message}`, iconType: 'error'});
      },
    });
  };

  // 예매 확정
  const handleConfirm = async (reservation: ReservationWithEventDto) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '예매 확정',
      message: `다음 예매를 확정하시겠습니까?\n\n사용자: ${reservation.users?.name || '알 수 없음'}\n수량: ${reservation.quantity}매\n티켓 소유자: ${reservation.ticketHolder}`,
    });

    if (confirmed) {
      // 입금 정보 입력 모달 표시
      setPaymentModalState({
        isOpen: true,
        reservation,
      });
    }
  };

  // 예매 취소
  const handleCancel = async (reservation: ReservationWithEventDto) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '예매 취소',
      message: `다음 예매를 취소하시겠습니까?\n\n사용자: ${reservation.users?.name || '알 수 없음'}\n공연: ${reservation.events?.eventName || '알 수 없음'}\n수량: ${reservation.quantity}매\n티켓 소유자: ${reservation.ticketHolder}`,
    });

    if (confirmed) {
      showSpinner();
      rejectMutation.mutate(reservation.id, {
        onSuccess: () => {
          hideSpinner();
          showToast({ message: '예매가 취소되었습니다.', iconType: 'success', autoCloseTime: 3000 });
          refetch();
        },
        onError: (error) => {
          hideSpinner();
          showToast({ message: `예매 취소에 실패했습니다: ${error.message}`, iconType: 'error' });
        },
      });
    }
  };

  // 테이블 컬럼 정의 (JOIN된 데이터 직접 사용)
  const columns: Column<ReservationWithEventDto>[] = [
    {
      key: 'user',
      header: '사용자',
      render: (reservation: ReservationWithEventDto) => reservation.users?.name || '알 수 없음',
      sortable: true,
      width: '12%',
    },
    {
      key: 'event',
      header: '공연명',
      render: (reservation: ReservationWithEventDto) => reservation.events?.eventName || '알 수 없음',
      sortable: true,
      width: '23%',
    },
    {
      key: 'quantity',
      header: '수량',
      render: (reservation: Reservation) => `${reservation.quantity}매`,
      sortable: true,
      width: '8%',
    },
    {
      key: 'status',
      header: '상태',
      render: (reservation: Reservation) => (
        <StatusBadge
          status={reservation.status} 
          theme={theme} 
          variant="badge" 
          size="sm"
          statusType="reservation"
        />
      ),
      sortable: true,
      width: '10%',
    },
    {
      key: 'reservedAt',
      header: '예매일',
      render: (reservation: Reservation) => dayjs(reservation.reservedAt).format('YYYY-MM-DD HH:mm'),
      sortable: true,
      width: '18%',
    },
    {
      key: 'ticketHolder',
      header: '티켓 소유자',
      render: (reservation: Reservation) => reservation.ticketHolder,
      sortable: true,
      width: '12%',
    },
    {
      key: 'actions',
      header: '액션',
      render: (reservation: Reservation) => (
        <div className="flex gap-2">
          {reservation.status === ReservationStatus.Pending && (
            <>
              <Button
                theme="dark"
                padding="px-3 py-1"
                fontSize="text-xs"
                reverse={theme === 'normal'}
                onClick={() => handleConfirm(reservation)}
                disabled={approveMutation.isPending}
              >
                확정
              </Button>
              <Button
                theme="dark"
                padding="px-3 py-1"
                fontSize="text-xs"
                reverse={theme === 'normal'}
                onClick={() => handleCancel(reservation)}
                disabled={rejectMutation.isPending}
              >
                취소
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // 모바일 알림식 카드 섹션 렌더 함수 (JOIN된 데이터 직접 사용)
  const mobileCardSections = (reservation: ReservationWithEventDto, index: number) => ({
    firstRow: (
      <>
        <span className="font-semibold text-xs truncate">예매: {reservation.users?.name || '알 수 없음'}</span>
        <span className="text-xs truncate">티켓 소유: {reservation.ticketHolder}</span>
        <span className="text-xs truncate">{reservation.quantity}매</span>
        <StatusBadge status={reservation.status} theme={theme} variant="badge" size="sm" statusType="reservation" />
      </>
    ),
    secondRow: (
      <>
        <span className="truncate">{reservation.events?.eventName || '알 수 없음'}</span>
        <span>{dayjs(reservation.reservedAt).format('YYYY-MM-DD HH:mm')}</span>
      </>
    ),
    actionButton: (
      <>
        {reservation.status === ReservationStatus.Pending && (
          <>
            <Button
              theme="dark"
              padding="px-3 py-1"
              fontSize="text-xs"
              reverse={theme === 'normal'}
              onClick={() => handleConfirm(reservation)}
              disabled={approveMutation.isPending}
            >
              확정
            </Button>
            <Button
              theme="dark"
              padding="px-3 py-1"
              fontSize="text-xs"
              reverse={theme === 'normal'}
              onClick={() => handleCancel(reservation)}
              disabled={rejectMutation.isPending}
            >
              취소
            </Button>
          </>
        )}
      </>
    ),
  });

  // PaginationInfo 생성
  const paginationInfo = {
    page: currentPage,
    totalPages: Math.ceil(finalTotalCount / pageSize),
    hasPrev: currentPage > 1,
    hasNext: currentPage < Math.ceil(finalTotalCount / pageSize),
    size: pageSize,
  };

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div
          className={`${theme === 'neon' ? 'text-green-400' : ''}`}
        >
          <h1 className="text-lg md:text-xl font-bold mb-2">예매 관리</h1>
        </div>

        {/* 검색 및 필터 */}
        <SearchBar
          label="예매 필터"
          initialOpen={false}
          filters={{
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '전체' },
                { value: ReservationStatus.Pending, label: '입금 대기' },
                { value: ReservationStatus.Confirmed, label: '승인 완료' },
                { value: ReservationStatus.Voided, label: '취소됨' },
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

      {/* 테이블 상단 정보 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        {/* 총 개수 */}
        <div className="flex-1 md:flex-2/3 flex justify-start mb-2 md:mb-0">
          <span className="text-sm text-gray-400">
            총 {finalTotalCount}개 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, finalTotalCount)}개 표시
          </span>
        </div>
        
        {/* 정렬 및 페이지 크기 선택 */}
        <div className="flex items-center gap-4 flex-1 justify-end shrink-0">
          
          {/* 페이지 크기 선택 */}
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
      <div className="px-6 flex-1 flex flex-col min-h-0">
        {/* 예매 목록 테이블 */}
        <div className="flex-1 overflow-hidden">
          <DataTable
            data={finalReservations}
            columns={columns}
            theme={theme}
            isLoading={isLoading}
            emptyMessage="예매 내역이 없습니다."
            loadingMessage="로딩 중..."
            className="h-full"
            mobileCardSections={mobileCardSections}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* 페이지네이션 */}
      {finalTotalCount > 0 && (
        <div className="px-6 py-4 flex-shrink-0">
          <div className="w-full flex justify-center">
            <PaginationButtons
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
              showFirstLast={false}
            />
          </div>
        </div>
      )}

      {/* 입금 정보 입력 모달 */}
      {paymentModalState.reservation && (
        <PaymentInfoModal
          isOpen={paymentModalState.isOpen}
          onClose={handlePaymentModalClose}
          reservation={paymentModalState.reservation}
          onSuccess={handlePaymentSuccess}
          getUserName={(userId: string) => {
            const reservation = finalReservations.find(r => r.userId === userId);
            return reservation?.users?.name || '알 수 없음';
          }}
          getEventName={(eventId: string) => {
            const reservation = finalReservations.find(r => r.eventId === eventId);
            return reservation?.events?.eventName || '알 수 없음';
          }}
          ticketPrice={finalReservations.find(r => r.id === paymentModalState.reservation?.id)?.events?.ticketPrice || 0}
        />
      )}
    </ThemeDiv>
  );
};

export default ReservationsClient; 