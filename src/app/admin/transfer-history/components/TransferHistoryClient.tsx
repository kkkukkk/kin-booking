'use client';

import React, { useState, useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useAllTransferHistoryGroups } from '@/hooks/api/useTicketTransferHistory';
import useDebounce from '@/hooks/useDebounce';
import { TransferHistoryGroupDto } from '@/types/dto/ticketTransferHistory';
import ThemeDiv from '@/components/base/ThemeDiv';
import DataTable from '@/components/base/DataTable';
import SearchBar from '@/components/search/SearchBar';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// dayjs 플러그인 설정
dayjs.extend(utc);
dayjs.extend(timezone);

const TransferHistoryClient = () => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    // 검색/필터 상태
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        startDate: '',
        endDate: '',
    });

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [10, 20, 50];

    // 정렬 상태
    const [sortConfig, setSortConfig] = useState({
        field: 'groupTime',
        direction: 'desc' as 'asc' | 'desc',
    });

    // 디바운스 적용 (300ms)
    const debouncedKeyword = useDebounce(searchParams.keyword, 300);
    const debouncedStartDate = useDebounce(searchParams.startDate, 300);
    const debouncedEndDate = useDebounce(searchParams.endDate, 300);

    const { data: transferHistoryResponse, isLoading, error } = useAllTransferHistoryGroups({
        page: currentPage,
        size: pageSize,
        startDate: debouncedStartDate,
        endDate: debouncedEndDate,
        keyword: debouncedKeyword
    });

    const transferHistory = React.useMemo(() => transferHistoryResponse?.data || [], [transferHistoryResponse?.data]);
    const totalCount = transferHistoryResponse?.totalCount || 0;

    // 정렬을 위한 데이터 준비
    const sortedHistory = useMemo(() => {
        const historyData = transferHistory || [];

        // 정렬 적용
        const sorted = [...historyData].sort((a, b) => {
            let aValue: unknown = a[sortConfig.field as keyof TransferHistoryGroupDto];
            let bValue: unknown = b[sortConfig.field as keyof TransferHistoryGroupDto];
            
            // 날짜 필드인 경우 dayjs로 변환 (한국 시간대 적용)
            if (sortConfig.field === 'groupTime') {
                aValue = dayjs(aValue as string).tz('Asia/Seoul');
                bValue = dayjs(bValue as string).tz('Asia/Seoul');
            }
            
            if (sortConfig.direction === 'asc') {
                return String(aValue) > String(bValue) ? 1 : -1;
            } else {
                return String(aValue) < String(bValue) ? 1 : -1;
            }
        });

        return sorted;
    }, [transferHistory, sortConfig]);

    // 페이징을 위한 데이터 준비
    const totalPages = Math.ceil(totalCount / pageSize);

    // 검색 처리
    const handleSearch = (keyword: string) => {
        setSearchParams(prev => ({ ...prev, keyword }));
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

    // 테이블 컬럼 정의
    const columns = [
        {
            key: 'groupTime',
            header: '양도 일시',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm">
                    <div className="font-medium">{dayjs(history.groupTime).tz('Asia/Seoul').format('YYYY-MM-DD')}</div>
                    <div className="text-xs opacity-70">{dayjs(history.groupTime).tz('Asia/Seoul').format('HH:mm:ss')}</div>
                </div>
            ),
            width: '15%',
        },
        {
            key: 'fromUserName',
            header: '양도자',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm">
                    <div className="font-medium">{history.fromUserName || '알 수 없음'}</div>
                    <div className="text-xs opacity-70">{history.fromUserEmail || ''}</div>
                </div>
            ),
            width: '18%',
        },
        {
            key: 'toUserName',
            header: '수령자',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm">
                    <div className="font-medium">{history.toUserName || '알 수 없음'}</div>
                    <div className="text-xs opacity-70">{history.toUserEmail || ''}</div>
                </div>
            ),
            width: '18%',
        },
        {
            key: 'ticketCount',
            header: '매수',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm text-center">
                    <div className="font-medium text-blue-600">
                        {history.ticketCount}장
                    </div>
                </div>
            ),
            width: '10%',
        },
        {
            key: 'eventName',
            header: '공연명',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm">
                    <div className="truncate" title={history.eventName}>
                        {history.eventName || '알 수 없음'}
                    </div>
                </div>
            ),
            width: '20%',
        },
        {
            key: 'reason',
            header: '양도 사유',
            render: (history: TransferHistoryGroupDto, index: number) => (
                <div className="text-sm">
                    {!history.reason ? (
                        <span className="text-xs opacity-50">사유 없음</span>
                    ) : (
                        <div className="truncate" title={history.reason}>
                            {history.reason}
                        </div>
                    )}
                </div>
            ),
            width: '27%',
        },
    ];

    // 모바일 카드 섹션
    const mobileCardSections = (history: TransferHistoryGroupDto) => ({
        firstRow: (
            <>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <span className="font-semibold text-sm truncate">{dayjs(history.groupTime).tz('Asia/Seoul').format('YYYY-MM-DD HH:mm')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded">
                                {history.ticketCount}장
                            </span>
                        </div>
                    </div>
                </div>
            </>
        ),
        secondRow: (
            <>
                <div className="w-full flex flex-col gap-1">
                    <div className="text-xs text-gray-600 truncate">
                        <span className="font-medium">양도자:</span> {history.fromUserName || '알 수 없음'}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                        <span className="font-medium">수령자:</span> {history.toUserName || '알 수 없음'}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                        <span className="font-medium">공연:</span> {history.eventName || '알 수 없음'}
                    </div>
                    {history.reason && (
                        <div className="text-xs text-gray-600 truncate">
                            <span className="font-medium">사유:</span> {history.reason}
                        </div>
                    )}
                </div>
            </>
        )
    });



    return (
        <ThemeDiv className="flex flex-col min-h-full">
            {/* 상단 고정 영역 */}
            <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
                <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
                    <h1 className="text-lg md:text-xl font-bold mb-2">양도 이력</h1>
                </div>

                {/* 검색 및 필터 */}
                <SearchBar
                    label="양도 이력 검색 및 필터"
                    initialOpen={false}
                    filters={{
                        keyword: {
                            value: searchParams.keyword,
                            onChange: handleSearch,
                            placeholder: "양도자명, 수령자명, 공연명으로 검색..."
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
                        총 {totalCount}건 중 {transferHistory.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalCount)}건 표시
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
                {/* 양도 이력 테이블 */}
                <div className="flex-1 min-h-fit md:min-h-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <p className="text-red-500 mb-4">양도 이력을 불러오는 중 오류가 발생했습니다.</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : (
                        <DataTable
                            data={sortedHistory}
                            columns={columns}
                            theme={theme}
                            isLoading={isLoading}
                            emptyMessage="양도 이력이 없습니다."
                            loadingMessage="로딩 중..."
                            className="h-full"
                            mobileCardSections={mobileCardSections}
                            sortConfig={sortConfig}
                            onSortChange={handleSortChange}
                        />
                    )}
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
                            showFirstLast={false}
                        />
                    </div>
                )}
            </div>
        </ThemeDiv>
    );
};

export default TransferHistoryClient;
