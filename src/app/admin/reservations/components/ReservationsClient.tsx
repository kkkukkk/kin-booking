'use client';

import { useState } from 'react';
import { useReservations, useApproveReservation, useRejectReservation } from '@/hooks/api/useReservations';
import { useUsers } from '@/hooks/api/useUsers';
import { useEvents } from '@/hooks/api/useEvents';
import SearchBar from '@/components/search/SearchBar';
import Button from '@/components/base/Button';
import DataTable, { Column } from '@/components/base/DataTable';
import { StatusBadge } from '@/components/status/StatusBadge';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import dayjs from 'dayjs';
import { ReservationStatus } from '@/types/model/reservation';
import ThemeDiv from '@/components/base/ThemeDiv';
import { Reservation } from '@/types/model/reservation';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';

const ReservationsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showAlert } = useAlert();

  // 검색/필터 상태
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '' as ReservationStatus | '',
    dateFrom: '',
    dateTo: '',
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 페이지 크기 옵션
  const pageSizeOptions = [10, 20, 50, 100];

  // API 호출
  const { data: reservationsResponse, isLoading, refetch } = useReservations({
    page: currentPage,
    size: pageSize,
    status: searchParams.status || undefined,
    reservedFrom: searchParams.dateFrom || undefined,
    reservedTo: searchParams.dateTo || undefined,
  });

  const { data: usersResponse } = useUsers();
  const { data: eventsResponse } = useEvents();

  // 예매 승인/취소 뮤테이션
  const approveMutation = useApproveReservation();
  const rejectMutation = useRejectReservation();

  // 사용자 이름 조회
  const getUserName = (userId: string) => {
    // 테스트 데이터 사용
    const testUser = testUsers.find(u => u.id === userId);
    if (testUser) return testUser.name;
    
    // 실제 API 데이터 (백업)
    const user = usersResponse?.data?.find(u => u.id === userId);
    return user?.name || '알 수 없음';
  };

  // 이벤트 이름 조회
  const getEventName = (eventId: string) => {
    // 테스트 데이터 사용
    const testEvent = testEvents.find(e => e.id === eventId);
    if (testEvent) return testEvent.eventName;
    
    // 실제 API 데이터 (백업)
    const event = eventsResponse?.data?.find(e => e.id === eventId);
    return event?.eventName || '알 수 없음';
  };

  const allReservations = reservationsResponse?.data || [];
  const totalCount = reservationsResponse?.totalCount || 0;

  // 테스트용 하드코딩 데이터 (레이아웃 확인용)
  const testReservations: Reservation[] = [
    {
      id: '1',
      userId: 'user1',
      eventId: 'event1',
      reservedAt: '2024-01-15T10:30:00Z',
      quantity: 2,
      status: ReservationStatus.Pending,
      ticketHolder: '김철수'
    },
    {
      id: '2',
      userId: 'user2',
      eventId: 'event2',
      reservedAt: '2024-01-16T14:20:00Z',
      quantity: 1,
      status: ReservationStatus.Confirmed,
      ticketHolder: '이영희'
    },
    {
      id: '3',
      userId: 'user3',
      eventId: 'event1',
      reservedAt: '2024-01-17T09:15:00Z',
      quantity: 3,
      status: ReservationStatus.Cancelled,
      ticketHolder: '박민수'
    },
    {
      id: '4',
      userId: 'user4',
      eventId: 'event3',
      reservedAt: '2024-01-18T16:45:00Z',
      quantity: 1,
      status: ReservationStatus.Pending,
      ticketHolder: '최지영'
    },
    {
      id: '5',
      userId: 'user5',
      eventId: 'event2',
      reservedAt: '2024-01-19T11:30:00Z',
      quantity: 2,
      status: ReservationStatus.Confirmed,
      ticketHolder: '정수민'
    },
    {
      id: '6',
      userId: 'user6',
      eventId: 'event1',
      reservedAt: '2024-01-20T13:20:00Z',
      quantity: 1,
      status: ReservationStatus.Pending,
      ticketHolder: '한동훈'
    },
    {
      id: '7',
      userId: 'user7',
      eventId: 'event3',
      reservedAt: '2024-01-21T15:10:00Z',
      quantity: 4,
      status: ReservationStatus.Confirmed,
      ticketHolder: '송미영'
    },
    {
      id: '8',
      userId: 'user8',
      eventId: 'event2',
      reservedAt: '2024-01-22T08:45:00Z',
      quantity: 2,
      status: ReservationStatus.Cancelled,
      ticketHolder: '임태현'
    },
    {
      id: '9',
      userId: 'user9',
      eventId: 'event1',
      reservedAt: '2024-01-23T12:30:00Z',
      quantity: 1,
      status: ReservationStatus.Pending,
      ticketHolder: '강서연'
    },
    {
      id: '10',
      userId: 'user10',
      eventId: 'event3',
      reservedAt: '2024-01-24T17:20:00Z',
      quantity: 3,
      status: ReservationStatus.Confirmed,
      ticketHolder: '윤도현'
    },
    {
      id: '11',
      userId: 'user11',
      eventId: 'event2',
      reservedAt: '2024-01-25T10:15:00Z',
      quantity: 2,
      status: ReservationStatus.Pending,
      ticketHolder: '조은영'
    },
    {
      id: '12',
      userId: 'user12',
      eventId: 'event1',
      reservedAt: '2024-01-26T14:40:00Z',
      quantity: 1,
      status: ReservationStatus.Confirmed,
      ticketHolder: '백준호'
    },
    {
      id: '13',
      userId: 'user13',
      eventId: 'event3',
      reservedAt: '2024-01-27T09:30:00Z',
      quantity: 2,
      status: ReservationStatus.Cancelled,
      ticketHolder: '신혜진'
    },
    {
      id: '14',
      userId: 'user14',
      eventId: 'event2',
      reservedAt: '2024-01-28T16:20:00Z',
      quantity: 1,
      status: ReservationStatus.Pending,
      ticketHolder: '오승우'
    },
    {
      id: '15',
      userId: 'user15',
      eventId: 'event1',
      reservedAt: '2024-01-29T11:45:00Z',
      quantity: 3,
      status: ReservationStatus.Confirmed,
      ticketHolder: '남지은'
    },
    {
      id: '16',
      userId: 'user16',
      eventId: 'event3',
      reservedAt: '2024-01-30T13:15:00Z',
      quantity: 2,
      status: ReservationStatus.Pending,
      ticketHolder: '류현우'
    },
    {
      id: '17',
      userId: 'user17',
      eventId: 'event2',
      reservedAt: '2024-02-01T15:30:00Z',
      quantity: 1,
      status: ReservationStatus.Confirmed,
      ticketHolder: '김나영'
    },
    {
      id: '18',
      userId: 'user18',
      eventId: 'event1',
      reservedAt: '2024-02-02T08:20:00Z',
      quantity: 4,
      status: ReservationStatus.Cancelled,
      ticketHolder: '이준호'
    },
    {
      id: '19',
      userId: 'user19',
      eventId: 'event3',
      reservedAt: '2024-02-03T12:45:00Z',
      quantity: 2,
      status: ReservationStatus.Pending,
      ticketHolder: '박소영'
    },
    {
      id: '20',
      userId: 'user20',
      eventId: 'event2',
      reservedAt: '2024-02-04T17:10:00Z',
      quantity: 1,
      status: ReservationStatus.Confirmed,
      ticketHolder: '최민재'
    },
    {
      id: '21',
      userId: 'user21',
      eventId: 'event1',
      reservedAt: '2024-02-05T10:25:00Z',
      quantity: 3,
      status: ReservationStatus.Pending,
      ticketHolder: '정유진'
    },
    {
      id: '22',
      userId: 'user22',
      eventId: 'event3',
      reservedAt: '2024-02-06T14:50:00Z',
      quantity: 2,
      status: ReservationStatus.Confirmed,
      ticketHolder: '한승우'
    },
    {
      id: '23',
      userId: 'user23',
      eventId: 'event2',
      reservedAt: '2024-02-07T09:35:00Z',
      quantity: 1,
      status: ReservationStatus.Cancelled,
      ticketHolder: '송지민'
    },
    {
      id: '24',
      userId: 'user24',
      eventId: 'event1',
      reservedAt: '2024-02-08T16:15:00Z',
      quantity: 2,
      status: ReservationStatus.Pending,
      ticketHolder: '임서연'
    },
    {
      id: '25',
      userId: 'user25',
      eventId: 'event3',
      reservedAt: '2024-02-09T11:40:00Z',
      quantity: 1,
      status: ReservationStatus.Confirmed,
      ticketHolder: '강동현'
    }
  ];

  // 테스트용 사용자 데이터
  const testUsers = [
    { id: 'user1', name: '김철수' },
    { id: 'user2', name: '이영희' },
    { id: 'user3', name: '박민수' },
    { id: 'user4', name: '최지영' },
    { id: 'user5', name: '정수민' },
    { id: 'user6', name: '한동훈' },
    { id: 'user7', name: '송미영' },
    { id: 'user8', name: '임태현' },
    { id: 'user9', name: '강서연' },
    { id: 'user10', name: '윤도현' },
    { id: 'user11', name: '조은영' },
    { id: 'user12', name: '백준호' },
    { id: 'user13', name: '신혜진' },
    { id: 'user14', name: '오승우' },
    { id: 'user15', name: '남지은' },
    { id: 'user16', name: '류현우' },
    { id: 'user17', name: '김나영' },
    { id: 'user18', name: '이준호' },
    { id: 'user19', name: '박소영' },
    { id: 'user20', name: '최민재' },
    { id: 'user21', name: '정유진' },
    { id: 'user22', name: '한승우' },
    { id: 'user23', name: '송지민' },
    { id: 'user24', name: '임서연' },
    { id: 'user25', name: '강동현' }
  ];

  // 테스트용 이벤트 데이터
  const testEvents = [
    { id: 'event1', eventName: '2024 봄맞이 콘서트' },
    { id: 'event2', eventName: '여름 페스티벌' },
    { id: 'event3', eventName: '가을 재즈 페스티벌' }
  ];

  // 테스트 데이터 사용 (실제 API 데이터 대신)
  const finalReservations = testReservations;
  const finalTotalCount = testReservations.length;

  // 클라이언트 사이드 필터링
  const filteredReservations = finalReservations.filter(reservation => {
    if (!searchParams.keyword) return true;
    
    const keyword = searchParams.keyword.toLowerCase();
    const userName = getUserName(reservation.userId).toLowerCase();
    const eventName = getEventName(reservation.eventId).toLowerCase();
    
    return userName.includes(keyword) || eventName.includes(keyword);
  });

  // 검색/필터 핸들러
  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({ ...prev, status: status as ReservationStatus | '' }));
    setCurrentPage(1);
  };

  const handleDateFilter = (from: string, to: string) => {
    setSearchParams(prev => ({ ...prev, dateFrom: from, dateTo: to }));
    setCurrentPage(1);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 페이지 크기가 변경되면 첫 페이지로 이동
  };

  // 예매 확정
  const handleConfirm = async (reservationId: string) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '예매 확정',
      message: '이 예매를 확정하시겠습니까?',
    });

    if (confirmed) {
      approveMutation.mutate(reservationId, {
        onSuccess: () => {
          showToast({ message: '예매가 확정되었습니다.', iconType: 'success' });
          refetch();
        },
        onError: () => {
          showToast({ message: '예매 확정에 실패했습니다.', iconType: 'error' });
        },
      });
    }
  };

  // 예매 취소
  const handleCancel = async (reservationId: string) => {
    const confirmed = await showAlert({
      type: 'confirm',
      title: '예매 취소',
      message: '이 예매를 취소하시겠습니까?',
    });

    if (confirmed) {
      rejectMutation.mutate(reservationId, {
        onSuccess: () => {
          showToast({ message: '예매가 취소되었습니다.', iconType: 'success' });
          refetch();
        },
        onError: () => {
          showToast({ message: '예매 취소에 실패했습니다.', iconType: 'error' });
        },
      });
    }
  };

  // 테이블 컬럼 정의
  const columns: Column<Reservation>[] = [
    {
      key: 'user',
      header: '사용자',
      render: (reservation: Reservation) => getUserName(reservation.userId),
    },
    {
      key: 'ticketHolder',
      header: '티켓 소유자',
      render: (reservation: Reservation) => reservation.ticketHolder,
    },
    {
      key: 'event',
      header: '공연명',
      render: (reservation: Reservation) => getEventName(reservation.eventId),
    },
    {
      key: 'quantity',
      header: '수량',
      render: (reservation: Reservation) => `${reservation.quantity}매`,
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
        />
      ),
    },
    {
      key: 'reservedAt',
      header: '예매일',
      render: (reservation: Reservation) => dayjs(reservation.reservedAt).format('YYYY-MM-DD HH:mm'),
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
                onClick={() => handleConfirm(reservation.id)}
                disabled={approveMutation.isPending}
              >
                확정
              </Button>
              <Button
                theme="dark"
                padding="px-3 py-1"
                fontSize="text-xs"
                reverse={theme === 'normal'}
                onClick={() => handleCancel(reservation.id)}
                disabled={rejectMutation.isPending}
              >
                취소
              </Button>
            </>
          )}
          {reservation.status === ReservationStatus.Confirmed && (
            <Button
              theme="dark"
              padding="px-3 py-1"
              fontSize="text-xs"
              onClick={() => handleCancel(reservation.id)}
              disabled={rejectMutation.isPending}
            >
              취소
            </Button>
          )}
        </div>
      ),
    },
  ];

  // 모바일 알림식 카드 섹션 렌더 함수
  const mobileCardSections = (reservation: Reservation, index: number) => ({
    firstRow: (
      <>
        <span className="font-semibold text-xs truncate">예매: {getUserName(reservation.userId)}</span>
        <span className="text-xs truncate">티켓 소유: {reservation.ticketHolder}</span>
        <span className="text-xs truncate">{reservation.quantity}매</span>
        <StatusBadge status={reservation.status} theme={theme} variant="badge" size="sm" />
      </>
    ),
    secondRow: (
      <>
        <span className="truncate">{getEventName(reservation.eventId)}</span>
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
              onClick={() => handleConfirm(reservation.id)}
              disabled={approveMutation.isPending}
            >
              확정
            </Button>
            <Button
              theme="dark"
              padding="px-3 py-1"
              fontSize="text-xs"
              reverse={theme === 'normal'}
              onClick={() => handleCancel(reservation.id)}
              disabled={rejectMutation.isPending}
            >
              취소
            </Button>
          </>
        )}
        {reservation.status === ReservationStatus.Confirmed && (
          <Button
            theme="dark"
            padding="px-3 py-1"
            fontSize="text-xs"
            onClick={() => handleCancel(reservation.id)}
            disabled={rejectMutation.isPending}
          >
            취소
          </Button>
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
          label="예매 검색 및 필터"
          initialOpen={true}
          filters={{
            keyword: {
              value: searchParams.keyword,
              onChange: handleSearch,
              placeholder: '사용자명, 공연명 검색',
            },
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '전체 상태' },
                { value: ReservationStatus.Pending, label: '대기중' },
                { value: ReservationStatus.Confirmed, label: '확정됨' },
                { value: ReservationStatus.Cancelled, label: '취소됨' },
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
        <div className="flex-1 md:flex-2/3 flex justify-center md:justify-start mb-2 md:mb-0">
          <span className="text-sm text-gray-400">
            총 {finalTotalCount}개 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, finalTotalCount)}개 표시
          </span>
        </div>
        {/* 페이지 크기 선택 */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-sm text-gray-400 md:w-[80%]">페이지당 표시:</span>
          <Select
            value={pageSize.toString()}
            onChange={(value) => handlePageSizeChange(Number(value))}
            className="px-2 py-1 text-sm"
            options={pageSizeOptions.map(size => ({
              value: size.toString(),
              label: `${size}개`
            }))}
          />
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        {/* 예매 목록 테이블 */}
        <div className="flex-1 min-h-fit overflow-visible md:min-h-0 md:overflow-hidden">
          <DataTable
            data={filteredReservations}
            columns={columns}
            theme={theme}
            isLoading={isLoading}
            emptyMessage="예매 내역이 없습니다."
            loadingMessage="로딩 중..."
            className="h-full"
            mobileCardSections={mobileCardSections}
          />
        </div>

        {/* 페이지네이션 하단 중앙 */}
        {finalTotalCount > 0 && (
          <div className="w-full flex justify-center mt-4 flex-shrink-0">
            <PaginationButtons
              paginationInfo={paginationInfo}
              onPageChange={setCurrentPage}
              showFirstLast
            />
          </div>
        )}
      </div>
    </ThemeDiv>
  );
};

export default ReservationsClient; 