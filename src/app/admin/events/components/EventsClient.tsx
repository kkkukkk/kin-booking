'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents, useCompleteEvent } from '@/hooks/api/useEvents';
import { useEventMediaByType } from '@/hooks/api/useEventMedia';
import { EventStatus, EventStatusKo, Events } from '@/types/model/events';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import SearchBar from '@/components/search/SearchBar';
import EventCard from '@/app/events/components/EventCard';
import Spinner from '@/components/spinner/Spinner';
import DataTable from '@/components/base/DataTable';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import dayjs from 'dayjs';
import { useAlert } from '@/providers/AlertProvider';
import useToast from '@/hooks/useToast';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const EventsClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showAlert } = useAlert();
  const { showToast } = useToast();
  const router = useRouter();
  const { mutate: completeEventMutate } = useCompleteEvent();
  const { canManageEvents } = useAdminAuth();
  
  // 검색/필터 상태
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 50];

  // 정렬 상태
  const [sortConfig, setSortConfig] = useState({
    field: 'eventDate',
    direction: 'desc' as 'asc' | 'desc',
  });

  // 공연 데이터 조회
  const { data: eventsResponse, isLoading, error, refetch } = useEvents({
    page: currentPage,
    size: pageSize,
  });

  const events = eventsResponse?.data || [];
  const totalCount = eventsResponse?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 검색 처리
  const handleSearch = (keyword: string) => {
    setSearchParams(prev => ({ ...prev, keyword }));
    setCurrentPage(1);
  };

  // 상태 필터 처리
  const handleStatusFilter = (status: string) => {
    setSearchParams(prev => ({ ...prev, status }));
    setCurrentPage(1);
  };

  // 날짜 필터 처리
  const handleStartDateFilter = (date: string) => {
    setSearchParams(prev => ({ ...prev, startDate: date }));
    setCurrentPage(1);
  };

  const handleEndDateFilter = (date: string) => {
    setSearchParams(prev => ({ ...prev, endDate: date }));
    setCurrentPage(1);
  };

  // 페이지 크기 변경
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // 정렬 변경
  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({ field, direction });
    setCurrentPage(1);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 공연 상세 페이지로 이동
  const handleEventClick = (event: Events) => {
    router.push(`/admin/events/${event.id}`);
  };

  // 공연 생성 페이지로 이동
  const handleCreateEvent = () => {
    router.push('/admin/events/create');
  };

  // 공연 완료 처리
  const handleEventCompletion = async (event: React.MouseEvent, eventData: Events) => {
    event.preventDefault();
    event.stopPropagation();
    
    const confirmed = await showAlert({
      title: '공연 종료 확인',
      message: `"${eventData.eventName}" 공연을 종료하시겠습니까?\n\n• 대기중인 예매가 모두 취소됩니다\n• 이 작업은 되돌릴 수 없습니다`,
      type: 'confirm'
    });
    
    if (confirmed) {
      completeEventMutate(eventData.id, {
        onSuccess: () => {
          showToast({
            message: `"${eventData.eventName}" 공연이 종료되었습니다.`,
            iconType: 'success',
            autoCloseTime: 3000,
          });
          refetch();
        },
        onError: (error) => {
          showToast({
            message: `공연 종료 중 오류가 발생했습니다: ${error.message}`,
            iconType: 'error',
            autoCloseTime: 3000,
          });
        },
      });
    }
  };

  // 필터링된 공연 목록
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      // 키워드 검색
      if (searchParams.keyword) {
        const searchLower = searchParams.keyword.toLowerCase();
        if (!event.eventName.toLowerCase().includes(searchLower) &&
            !event.description?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // 상태 필터
      if (searchParams.status && event.status !== searchParams.status) {
        return false;
      }

      // 날짜 범위 필터
      if (searchParams.startDate && dayjs(event.eventDate).isBefore(searchParams.startDate)) {
        return false;
      }
      if (searchParams.endDate && dayjs(event.eventDate).isAfter(searchParams.endDate)) {
        return false;
      }

      return true;
    });
  }, [events, searchParams]);

  // 테이블 컬럼 정의
  const columns = [
    {
      key: 'title',
      header: '공연명',
      render: (event: Events) => (
        <div className="text-sm">
          <div 
            className="font-medium truncate cursor-pointer"
            onClick={() => handleEventClick(event)}
          >
            {event.eventName}
          </div>
        </div>
      ),
      width: '20%',
      sortable: true,
    },
    {
      key: 'eventDate',
      header: '공연일',
      render: (event: Events) => (
        <div className="text-sm">
          <div className="font-medium">{dayjs(event.eventDate).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">{dayjs(event.eventDate).format('HH:mm')}</div>
        </div>
      ),
      width: '10%',
      sortable: true,
    },
    {
      key: 'ticketPrice',
      header: '티켓 가격',
      render: (event: Events) => (
        <div className="text-sm font-medium">
          {event.ticketPrice?.toLocaleString() || 0}원
        </div>
      ),
      width: '11%',
      sortable: true,
    },
    {
      key: 'location',
      header: '장소',
      render: (event: Events) => (
        <div className="text-sm truncate">{event.location || '장소 미정'}</div>
      ),
      width: '28%',
    },
    {
      key: 'createdAt',
      header: '생성일',
      render: (event: Events) => (
        <div className="text-sm">
          {dayjs(event.createdAt).format('YYYY-MM-DD')}
        </div>
      ),
      width: '12%',
      sortable: true,
    },
    {
      key: 'status',
      header: '상태',
      render: (event: Events) => (
        <div className="text-sm">
          <div className="font-medium">
            {EventStatusKo[event.status]}
          </div>
        </div>
      ),
      width: '8%',
      sortable: true,
    },
    {
      key: 'actions',
      header: '액션',
      render: (event: Events) => (
        <div>
          {event.status === EventStatus.Ongoing && canManageEvents && (
            <Button
              theme="dark"
              onClick={(e) => handleEventCompletion(e, event)}
              className="bg-green-600 hover:bg-green-700 font-semibold"
              padding="px-2 py-1"
              fontSize='text-sm'
            >
              공연종료
            </Button>
          )}
        </div>
      ),
      width: '11%',
    },
  ];

  // 모바일 카드 섹션 렌더 함수
  const mobileCardSections = (event: Events) => ({
    firstRow: (
      <>
        <div className="w-full flex justify-between items-center">
          <div className="font-semibold text-sm truncate">
            {event.eventName}
          </div>
          <div>
            <div className="font-medium">
              {EventStatusKo[event.status]}
            </div>
          </div>
        </div>
      </>
    ),
    secondRow: (
      <>
        <div className="w-full flex flex-col gap-1 text-sm">
          <div className="flex justify-between">
            <span>공연일</span>
            <span>{dayjs(event.eventDate).format('MM/DD HH:mm')}</span>
          </div>
          <div className="flex justify-between">
            <span>티켓 가격</span>
            <span>{event.ticketPrice?.toLocaleString() || 0}원</span>
          </div>
          <div className="flex justify-between">
            <span>장소</span>
            <span className="truncate">{event.location || '장소 미정'}</span>
          </div>
        </div>
      </>
    ),
  });

  if (isLoading) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">공연 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="flex items-center justify-center h-64">
            <Spinner />
          </div>
        </div>
      </ThemeDiv>
    );
  }

  if (error) {
    return (
      <ThemeDiv className="flex flex-col min-h-full">
        <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">공연 관리</h1>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
          <div className="text-center">
            <p className="text-red-500 mb-4">공연 목록을 불러오는데 실패했습니다.</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              다시 시도
            </button>
          </div>
        </div>
      </ThemeDiv>
    );
  }

  return (
    <ThemeDiv className="flex flex-col min-h-full">
      {/* 상단 고정 영역 */}
      <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
            <h1 className="text-lg md:text-xl font-bold mb-2">공연 관리</h1>
          </div>
          <Button
            theme={theme}
            onClick={handleCreateEvent}
            className="px-3 py-1"
          >
            공연 추가
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <SearchBar
          label="공연 검색 및 필터"
          initialOpen={false}
          filters={{
            keyword: {
              value: searchParams.keyword,
              onChange: handleSearch,
              placeholder: "공연명, 설명 검색..."
            },
            status: {
              value: searchParams.status,
              onChange: handleStatusFilter,
              options: [
                { value: '', label: '전체' },
                { value: EventStatus.Pending, label: EventStatusKo[EventStatus.Pending] },
                { value: EventStatus.Ongoing, label: EventStatusKo[EventStatus.Ongoing] },
                { value: EventStatus.SoldOut, label: EventStatusKo[EventStatus.SoldOut] },
                { value: EventStatus.Completed, label: EventStatusKo[EventStatus.Completed] },
              ],
            },
            dateRange: {
              from: searchParams.startDate,
              to: searchParams.endDate,
              onChange: (from: string, to: string) => {
                handleStartDateFilter(from);
                handleEndDateFilter(to);
              }
            }
          }}
        />
      </div>

      {/* 테이블 상단 정보 영역 */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-2">
        {/* 총 개수 */}
        <div className="flex-1 md:flex-2/3 flex justify-start mb-2 md:mb-0">
          <span className="text-sm text-gray-400">
            총 {totalCount}건 중 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}건 표시
          </span>
        </div>

        {/* 페이지 크기 선택 */}
        <div className="flex items-center gap-4 flex-1 justify-end shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 md:w-[80%] whitespace-nowrap">페이지당 표시:</span>
            <Select
              theme={theme}
              value={pageSize.toString()}
              onChange={(value) => handlePageSizeChange(Number(value))}
              className="min-w-20"
              options={pageSizeOptions.map(size => ({
                value: size.toString(),
                label: `${size}건`
              }))}
              fontSize="text-xs md:text-sm"
            />
          </div>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="px-6 pb-6 flex-1 flex flex-col min-h-fit md:min-h-0">
        {/* 공연 목록 테이블 */}
        <div className="flex-1 min-h-fit md:min-h-0">
          <DataTable
            data={filteredEvents}
            columns={columns}
            theme={theme}
            isLoading={isLoading}
            emptyMessage="공연이 없습니다."
            loadingMessage="로딩 중..."
            className="h-full"
            mobileCardSections={mobileCardSections}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            onRowClick={(event) => router.push(`/admin/events/${event.id}`)}
          />
        </div>

        {/* 페이지네이션 */}
        {totalCount > 0 && (
          <div className="mt-6">
            <PaginationButtons
              paginationInfo={{
                page: currentPage,
                totalPages,
                size: pageSize,
                hasPrev: currentPage > 1,
                hasNext: currentPage < totalPages
              }}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

    </ThemeDiv>
  );
};

export default EventsClient;