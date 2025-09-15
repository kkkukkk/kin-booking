'use client';

import { useState } from 'react';
import { usePaymentTransactionsWithReservation, usePaymentTransactionStats } from '@/hooks/api/usePaymentTransactions';
import useDebounce from '@/hooks/useDebounce';
import DataTable from '@/components/base/DataTable';
import { PaymentTransactionWithReservationDto } from '@/types/dto/paymentTransaction';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { StatusBadge } from '@/components/status/StatusBadge';
import SearchBar from '@/components/search/SearchBar';
import ThemeDiv from '@/components/base/ThemeDiv';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import Select from '@/components/base/Select';
import dayjs from 'dayjs';

const PaymentHistoryClient = () => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    // 검색/필터 상태
    const [searchParams, setSearchParams] = useState({
        paymentType: '',
        startDate: '',
        endDate: '',
    });

    // 정렬 상태
    const [sortConfig, setSortConfig] = useState<{
        field: string;
        direction: 'asc' | 'desc';
    }>({
        field: 'operatedAt',
        direction: 'desc'
    });

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // 페이지 크기 옵션
    const pageSizeOptions = [20, 50, 100, 200];

    // 디바운스 적용 (300ms)
    const debouncedStartDate = useDebounce(searchParams.startDate, 300);
    const debouncedEndDate = useDebounce(searchParams.endDate, 300);

    // paymentType을 PaymentType으로 변환하는 함수
    const getPaymentType = (type: string): 'payment' | 'refund' | undefined => {
        if (type === 'payment' || type === 'refund') {
            return type;
        }
        return undefined;
    };

    // payment 이력 데이터 (관계 데이터 포함)
    const { data: transactionsResponse, isLoading, error, refetch } = usePaymentTransactionsWithReservation({
        paymentType: getPaymentType(searchParams.paymentType),
        startDate: debouncedStartDate,
        endDate: debouncedEndDate,
        page: currentPage,
        size: pageSize,
        sortBy: sortConfig.field,
        sortDirection: sortConfig.direction,
    });

    // 전체 통계 데이터
    const { data: statsData, isLoading: statsLoading } = usePaymentTransactionStats();

    const transactions = transactionsResponse?.data || [];
    const totalCount = transactionsResponse?.totalCount || 0;

    // 전체 통계 사용 (필터와 무관하게 전체 데이터 기준)
    const totalStats = statsData || { totalPayment: 0, totalRefund: 0, netAmount: 0 };

    // 필터링된 데이터 기준으로 통계 계산
    const filteredStats = transactions.reduce((acc, transaction: PaymentTransactionWithReservationDto) => {
        if (transaction.paymentType === 'payment') {
            acc.totalPayment += transaction.amount;
        } else if (transaction.paymentType === 'refund') {
            acc.totalRefund += transaction.amount;
        }
        return acc;
    }, { totalPayment: 0, totalRefund: 0 });

    const filteredNetAmount = filteredStats.totalPayment - filteredStats.totalRefund;

    // 현재 적용된 필터 정보 생성
    const getFilterInfo = () => {
        const filters = [];
        
        // 거래 유형 필터
        if (searchParams.paymentType) {
            const typeLabel = searchParams.paymentType === 'payment' ? '입금' : '환불';
            filters.push(typeLabel);
        }
        
        // 날짜 필터
        if (searchParams.startDate && searchParams.endDate) {
            filters.push(`${searchParams.startDate} ~ ${searchParams.endDate}`);
        } else if (searchParams.startDate) {
            filters.push(`${searchParams.startDate} 이후`);
        } else if (searchParams.endDate) {
            filters.push(`${searchParams.endDate} 이전`);
        }
        
        // 필터가 없으면 "전체 기간" 표시
        if (filters.length === 0) {
            filters.push('전체 기간');
        }
        
        return filters.join(' • ');
    };

    // 페이징 적용
    const totalPages = Math.ceil(totalCount / pageSize);

    // 거래 유형 필터 핸들러
    const handlePaymentTypeFilter = (paymentType: string) => {
        setSearchParams(prev => ({ ...prev, paymentType }));
        setCurrentPage(1);
    };

    // 시작 날짜 필터 핸들러
    const handleStartDateFilter = (startDate: string) => {
        setSearchParams(prev => ({ ...prev, startDate }));
        setCurrentPage(1);
    };

    // 종료 날짜 필터 핸들러
    const handleEndDateFilter = (endDate: string) => {
        setSearchParams(prev => ({ ...prev, endDate }));
        setCurrentPage(1);
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
        setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
    };

    // 테이블 컬럼 정의
    const columns = [
        {
            key: 'paymentType',
            header: '거래 유형',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <StatusBadge
                    status={transaction.paymentType}
                    theme={theme}
                    className="text-xs"
                    statusType="paymentType"
                    size="sm"
                />
            ),
            width: '10%',
            sortable: true,
        },
        {
            key: 'amount',
            header: '금액',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className={`font-medium ${transaction.paymentType === 'payment' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.paymentType === 'payment' ? '+' : '-'}{transaction.amount.toLocaleString()}원
                </div>
            ),
            width: '12%',
            sortable: true,
        },
        {
            key: 'user',
            header: '사용자',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className="text-sm">
                    <div className="font-medium">{transaction.users?.name || transaction.userId || '-'}</div>
                </div>
            ),
            width: '10%',
            sortable: true,
        },
        {
            key: 'event',
            header: '공연',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className="text-sm">
                    <div className="font-medium truncate">{transaction.events?.eventName || transaction.eventId || '-'}</div>
                </div>
            ),
            width: '25%',
            sortable: true,
        },
        {
            key: 'accountInfo',
            header: '계좌 정보',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className="text-xs">
                    <div className="font-medium">{transaction.bankName || '-'}</div>
                    <div className="text-gray-500">{transaction.accountHolder || '-'}</div>
                    <div className="text-gray-400">{transaction.accountNumber || '-'}</div>
                </div>
            ),
            width: '15%',
        },
        {
            key: 'operatedAt',
            header: '처리일시',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className="text-sm">
                    {dayjs(transaction.operatedAt).format('YYYY-MM-DD HH:mm')}
                </div>
            ),
            width: '15%',
            sortable: true,
        },
        {
            key: 'note',
            header: '메모',
            render: (transaction: PaymentTransactionWithReservationDto) => (
                <div className="text-sm text-gray-600 max-w-32 truncate">
                    {transaction.note || '-'}
                </div>
            ),
            width: '10%',
        },
    ];

    // 모바일 카드 섹션 렌더 함수
    const mobileCardSections = (transaction: PaymentTransactionWithReservationDto, index: number) => ({
        firstRow: (
            <>
                <div className="w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <StatusBadge
                            status={transaction.paymentType}
                            theme={theme}
                            statusType="paymentType"
                            size="sm"
                        />
                        <div className={`font-bold text-sm ${transaction.paymentType === 'payment' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.paymentType === 'payment' ? '+' : '-'}{transaction.amount.toLocaleString()}원
                        </div>
                    </div>
                    <div className="font-medium text-sm truncate">
                        {transaction.events?.eventName || `공연: ${transaction.eventId}`}
                    </div>
                </div>
            </>
        ),
        secondRow: (
            <>
                <div className="w-full flex flex-col gap-1">
                    <div className={`text-sm space-y-2 ${
                        theme === 'normal' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                        <div className="flex justify-between items-start">
                            <span className={`font-medium ${
                                theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
                            }`}>예금주</span>
                            <span className="text-right">{transaction.accountHolder || '-'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className={`font-medium ${
                                theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
                            }`}>은행</span>
                            <span className="text-right">{transaction.bankName || '-'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className={`font-medium ${
                                theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
                            }`}>계좌번호</span>
                            <span className="text-right text-xs">{transaction.accountNumber || '-'}</span>
                        </div>
                        {transaction.note && (
                            <div className="flex justify-between items-start">
                                <span className={`font-medium ${
                                    theme === 'normal' ? 'text-gray-700' : 'text-gray-300'
                                }`}>비고</span>
                                <span className="text-right text-xs max-w-32 truncate">{transaction.note}</span>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                        {dayjs(transaction.operatedAt).format('MM/DD HH:mm')}
                    </div>
                </div>
            </>
        ),
    });



    return (
        <ThemeDiv className="flex flex-col min-h-full">
            {/* 상단 고정 영역 */}
            <div className="px-6 py-4 space-y-4 md:py-6 md:space-y-6 flex-shrink-0">
                <div className={`${theme === 'neon' ? 'text-green-400' : ''}`}>
                    <h1 className="text-lg md:text-xl font-bold mb-2">입/출금 이력 관리</h1>
                </div>

                {/* 전체 통계 */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">전체 통계</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-green-900/20 border-green-500/30 text-green-400' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">총 입금</h4>
                            <p className="text-xl font-bold">
                                {statsLoading ? '로딩 중...' : `${totalStats.totalPayment.toLocaleString()}원`}
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-red-50 border-red-200 text-red-800'
                                : 'bg-red-900/20 border-red-500/30 text-red-400' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">총 환불</h4>
                            <p className="text-xl font-bold">
                                {statsLoading ? '로딩 중...' : `${totalStats.totalRefund.toLocaleString()}원`}
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-blue-50 border-blue-200 text-blue-800'
                                : 'bg-blue-900/20 border-blue-500/30 text-blue-400' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">순액</h4>
                            <p className="text-xl font-bold">
                                {statsLoading ? '로딩 중...' : `${totalStats.netAmount.toLocaleString()}원`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 필터링된 통계 */}
                <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-600">
                            현재 구간 통계
                        </h3>
                        <div className="text-xs text-gray-500">
                            {getFilterInfo()} • {totalCount}건 중 현재 페이지 {transactions.length}건
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-green-50/50 border-green-300 text-green-700'
                                : 'bg-green-900/10 border-green-600/30 text-green-300' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">입금</h4>
                            <p className="text-lg font-bold">
                                {filteredStats.totalPayment.toLocaleString()}원
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-red-50/50 border-red-300 text-red-700'
                                : 'bg-red-900/10 border-red-600/30 text-red-300' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">환불</h4>
                            <p className="text-lg font-bold">
                                {filteredStats.totalRefund.toLocaleString()}원
                            </p>
                        </div>
                        <div className={`p-4 rounded-lg border ${
                            theme === 'normal' 
                                ? 'bg-blue-50/50 border-blue-300 text-blue-700'
                                : 'bg-blue-900/10 border-blue-600/30 text-blue-300' 
                        }`}>
                            <h4 className="text-sm font-medium mb-1">순액</h4>
                            <p className="text-lg font-bold">
                                {filteredNetAmount.toLocaleString()}원
                            </p>
                        </div>
                    </div>
                </div>

                {/* 검색 및 필터 */}
                <SearchBar
                    label="입/출금 이력 필터"
                    initialOpen={false}
                    filters={{
                        status: {
                            value: searchParams.paymentType,
                            onChange: handlePaymentTypeFilter,
                            options: [
                                { value: '', label: '전체' },
                                { value: 'payment', label: '입금' },
                                { value: 'refund', label: '환불' }
                            ]
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
                {/* Payment 이력 테이블 */}
                <div className="flex-1 min-h-fit md:min-h-0">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <p className="text-red-500 mb-4">입/출금 이력을 불러오는 중 오류가 발생했습니다.</p>
                            <button 
                                onClick={() => refetch()} 
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : (
                        <DataTable
                            data={transactions}
                            columns={columns}
                            theme={theme}
                            isLoading={isLoading}
                            emptyMessage="입/출금 이력이 없습니다."
                            loadingMessage="로딩 중..."
                            className="h-full"
                            mobileCardSections={mobileCardSections}
                            sortConfig={sortConfig}
                            onSortChange={handleSortChange}
                        />
                    )}
                </div>

                {/* 페이지네이션 */}
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
            </div>
        </ThemeDiv>
    );
};

export default PaymentHistoryClient;
