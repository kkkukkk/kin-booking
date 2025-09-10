'use client';

import React, { useState, useEffect } from 'react';
import { useCreatePaymentTransaction, usePaymentTransactionsByReservationId } from '@/hooks/api/usePaymentTransactions';
import { useReservations } from '@/hooks/api/useReservations';
import { useRefundRequestMappingByReservation } from '@/hooks/api/useRefundRequestMapping';
import { useRefundAccountByUserId } from '@/hooks/api/useRefundAccounts';
import { TicketGroupDto } from '@/types/dto/ticket';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useSpinner } from '@/hooks/useSpinner';
import { useSession } from '@/hooks/useSession';
import dayjs from 'dayjs';
import { DEFAULT_REFUND_POLICY } from '@/types/refund';

// 분리된 컴포넌트들
import RefundAmountInfo from './RefundAmountInfo';
import RefundForm from './RefundForm';
import TicketComparisonInfo from './TicketComparisonInfo';

interface RefundInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketGroup: TicketGroupDto;
    onSuccess: () => void;
}

const RefundInfoModal = ({
    isOpen,
    onClose,
    ticketGroup,
    onSuccess,
}: RefundInfoModalProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);
    const { showToast } = useToast();
    const { showAlert } = useAlert();
    const { showSpinner, hideSpinner } = useSpinner();
    const { session } = useSession();

    // 거래 이력 생성 뮤테이션
    const createTransactionMutation = useCreatePaymentTransaction();

    // 입금 이력 조회
    const { data: paymentTransactions } = usePaymentTransactionsByReservationId(ticketGroup.reservationId);

    // 예매 정보 조회 (이벤트 정보와 사용자 정보 포함)
    const { data: reservationData } = useReservations({
        id: ticketGroup.reservationId,
        page: 1,
        size: 1
    });

    const reservationInfo = reservationData?.data?.[0];
    
    // 이벤트 정보 reservationData에서 가져옴 (JOIN된 데이터)
    const eventInfo = reservationInfo?.events;
    const ticketPrice = eventInfo?.ticketPrice || 0;

    // 양도된 티켓의 환불계좌 정보 조회
    const { data: refundRequestMapping } = useRefundRequestMappingByReservation(
        ticketGroup.reservationId,
        ticketGroup.ownerId,
        ticketGroup.eventId
    );
    
    // 환불계좌 정보 조회 (refundRequestMapping이 있으면 양도된 티켓)
    const { data: refundAccounts } = useRefundAccountByUserId(ticketGroup.ownerId);
    const refundAccount = refundAccounts?.find(account => account.id === refundRequestMapping?.refundAccountId);

    // 입금 정보 (가장 최근 payment 타입)
    const paymentInfo = paymentTransactions?.find(t => t.paymentType === 'payment');

    // 양도된 티켓인지 확인 (refundRequestMapping이 있으면 양도된 티켓)
    const isTransferredTicket = !!refundRequestMapping;

    // 환불 정책에 따른 환불 금액 계산 (취소 신청 시점 기준)
    const calculateRefundAmount = () => {
        const eventDate = dayjs(ticketGroup.eventDate);
        // 취소 신청 시점을 기준으로 계산 (ticket.updated_at)
        const cancelRequestDate = dayjs(ticketGroup.updatedAt);
        const daysUntilEvent = eventDate.diff(cancelRequestDate, 'day');
        
        // 공연일이 지났으면 환불 불가
        if (daysUntilEvent < 0) return 0;
        
        // 최소 취소 가능일 이전이면 환불 불가
        if (daysUntilEvent < DEFAULT_REFUND_POLICY.cancelableUntil) return 0;
        
        // 환불 비율 찾기
        const refundRate = DEFAULT_REFUND_POLICY.refundRates.find(rate =>
            daysUntilEvent >= rate.daysBefore
        );
        
        if (!refundRate) return 0;
        
        // 티켓 가격 계산
        let ticketPrice = 0;
        if (isTransferredTicket) {
            // 양도받은 티켓: 공연 데이터에서 티켓 가격 가져오기
            ticketPrice = eventInfo?.ticketPrice || 0;
        } else {
            // 일반 티켓: 입금 정보에서 티켓 가격 계산
            if (!paymentInfo) return 0; // 입금 정보가 없으면 환불 불가
            ticketPrice = paymentInfo.amount / (reservationInfo?.quantity || 1);
        }
        
        // 환불 금액 계산 (현재 보유 티켓 수 * 티켓 가격 * 환불 비율)
        const currentTicketValue = ticketPrice * ticketGroup.ticketCount;
        return Math.floor(currentTicketValue * (refundRate.rate / 100));
    };

    // 기본 환불 금액 (정책 적용)
    const defaultRefundAmount = calculateRefundAmount();

    // 기본값 설정
    const getDefaultValues = React.useCallback(() => {
        if (isTransferredTicket && refundAccount) {
            // 양도된 티켓: 환불계좌 정보 사용 (금액은 환불 정책에 따라 계산)
            return {
                refundAmount: defaultRefundAmount, // 환불 정책에 따라 계산된 금액
                refundBank: refundAccount.bankName,
                refundAccount: refundAccount.accountNumber,
                refundHolder: refundAccount.accountHolder,
                note: '',
            };
        } else {
            // 일반 티켓: 금액은 입금정보 바탕, 계좌정보는 환불계좌 바탕
            const userRefundAccount = refundAccounts?.[0]; // 사용자의 첫 번째 환불계좌
            return {
                refundAmount: defaultRefundAmount, // 입금정보 바탕으로 계산된 금액
                refundBank: userRefundAccount?.bankName || '',
                refundAccount: userRefundAccount?.accountNumber || '',
                refundHolder: userRefundAccount?.accountHolder || '',
                note: '',
            };
        }
    }, [isTransferredTicket, refundAccount, refundAccounts, defaultRefundAmount]);

    // 환불 가능 여부 확인
    const isRefundable = defaultRefundAmount > 0;

    // 환불 정보 상태
    const [refundInfo, setRefundInfo] = useState(getDefaultValues());

    // 기본값 업데이트 (양도된 티켓의 환불계좌 정보나 입금 정보가 변경되면)
    useEffect(() => {
        setRefundInfo(getDefaultValues());
    }, [getDefaultValues]);

    // 입력 핸들러
    const handleInputChange = (field: string, value: string | number) => {
        setRefundInfo(prev => ({ ...prev, [field]: value }));
    };

    // 환불 정보 저장
    const handleSubmit = async () => {
        // 유효성 검사
        if (!refundInfo.refundBank.trim()) {
            showToast({ message: '환불 은행을 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
            return;
        }
        if (!refundInfo.refundAccount.trim()) {
            showToast({ message: '환불 계좌를 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
            return;
        }
        if (!refundInfo.refundHolder.trim()) {
            showToast({ message: '환불 받는 사람을 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
            return;
        }
        if (refundInfo.refundAmount < 0) {
            showToast({ message: '환불 금액은 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
            return;
        }

        // 저장 전 확인 alert
        const confirmed = await showAlert({
            type: 'confirm',
            title: '환불 정보 저장 확인',
            message: `다음 환불 정보를 저장하시겠습니까?\n\n` +
                    `환불 금액: ${refundInfo.refundAmount.toLocaleString()}원\n` +
                    `환불 은행: ${refundInfo.refundBank}\n` +
                    `환불 계좌: ${refundInfo.refundAccount}\n` +
                    `환불 예금주: ${refundInfo.refundHolder}\n` +
                    `${refundInfo.note ? `메모: ${refundInfo.note}\n` : ''}` +
                    `\n* 저장 후에는 수정이 불가능합니다.`,
        });

        if (!confirmed) {
            return;
        }

        showSpinner();

        try {
            if (!session?.user?.id) {
                showToast({ 
                    message: '로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.', 
                    iconType: 'error',
                    autoCloseTime: 3000
                });
                return;
            }

            await createTransactionMutation.mutateAsync({
                reservationId: ticketGroup.reservationId,
                userId: ticketGroup.ownerId,
                eventId: ticketGroup.eventId,
                paymentType: 'refund',
                amount: refundInfo.refundAmount,
                bankName: refundInfo.refundBank,
                accountNumber: refundInfo.refundAccount,
                accountHolder: refundInfo.refundHolder,
                note: refundInfo.note,
                operatorId: session.user.id,
            });

            hideSpinner();

            onSuccess();
            onClose();
        } catch (error) {
            hideSpinner();
            showToast({
                message: `환불 정보 저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
                iconType: 'error'
            });
        }
    };

    // 모달 닫기
    const handleClose = () => {
        if (createTransactionMutation.isPending) return; // 처리 중에는 닫기 방지
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal onClose={handleClose}>
            <div className="space-y-6 md:min-w-lg">
                {/* 제목 */}
                <div className="text-center mb-6">
                    <h2 className={`text-xl font-bold ${theme === 'neon' ? 'text-cyan-400' : theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        환불 정보 입력
                    </h2>
                </div>

                {/* 티켓 정보 비교 표시 */}
                <TicketComparisonInfo
                    reservationInfo={reservationInfo || null}
                    ticketGroup={ticketGroup}
                />

                {/* 금액 정보 표시 */}
                <RefundAmountInfo
                    ticketCount={ticketGroup.ticketCount}
                    ticketPrice={ticketPrice}
                    paymentInfo={paymentInfo || null}
                    defaultRefundAmount={defaultRefundAmount}
                />

                {/* 환불 정책 정보 표시 */}
                <div className={`${theme === 'neon' ? 'bg-amber-950/20' : theme === 'dark' ? 'bg-amber-950/20' : 'bg-amber-50'} border ${theme === 'neon' ? 'border-amber-400/50' : theme === 'dark' ? 'border-amber-400/50' : 'border-amber-200'} rounded-lg p-4 space-y-2`}>
                    <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-800'} mb-2`}>환불 정책 기준</h3>
                    <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span className={`${theme === 'neon' ? 'text-amber-300' : theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>취소 신청 시점 기준</span>
                            <span className={`font-medium ${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}`}>
                                {(() => {
                                    const eventDate = dayjs(ticketGroup.eventDate);
                                    const cancelRequestDate = dayjs(ticketGroup.updatedAt);
                                    const daysUntilEvent = eventDate.diff(cancelRequestDate, 'day');
                                    if (daysUntilEvent < 0) return '공연일 이후 취소 신청';
                                    if (daysUntilEvent === 0) return '공연일 당일 취소 신청';
                                    return `공연일 ${daysUntilEvent}일 전 취소 신청`;
                                })()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className={`${theme === 'neon' ? 'text-amber-300' : theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>적용 환불 비율</span>
                            <span className={`font-medium ${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-700'}`}>
                                {(() => {
                                    const eventDate = dayjs(ticketGroup.eventDate);
                                    const cancelRequestDate = dayjs(ticketGroup.updatedAt);
                                    const daysUntilEvent = eventDate.diff(cancelRequestDate, 'day');
                                    if (daysUntilEvent < DEFAULT_REFUND_POLICY.cancelableUntil) return '환불 불가';
                                    const refundRate = DEFAULT_REFUND_POLICY.refundRates.find(rate => daysUntilEvent >= rate.daysBefore);
                                    return refundRate ? `${refundRate.rate}%` : '환불 불가';
                                })()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 입금 정보 이력 표시 (입금 정보가 있을 때만) */}
                {paymentInfo && paymentInfo.bankName && paymentInfo.accountNumber && (
                    <div className={`${theme === 'neon' ? 'bg-blue-950/20' : theme === 'dark' ? 'bg-blue-950/20' : 'bg-blue-50'} border ${theme === 'neon' ? 'border-blue-400/50' : theme === 'dark' ? 'border-blue-400/50' : 'border-blue-200'} rounded-lg p-4 space-y-2`}>
                        <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-blue-200' : theme === 'dark' ? 'text-blue-200' : 'text-blue-800'} mb-2`}>입금 정보 (참고용)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs mb-1`}>입금자</span>
                                <span className={`font-medium break-words`}>{paymentInfo.accountHolder}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs mb-1`}>입금 은행</span>
                                <span className={`font-medium break-words`}>{paymentInfo.bankName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs mb-1`}>입금 계좌</span>
                                <span className={`font-medium break-words`}>{paymentInfo.accountNumber}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs mb-1`}>입금 금액</span>
                                <span className={`font-medium`}>
                                    {paymentInfo.amount.toLocaleString()}원
                                </span>
                            </div>
                        </div>
                        {paymentInfo.note && (
                            <div className="mt-2 pt-2 border-t border-blue-200">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs`}>메모: {paymentInfo.note}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* 일반 티켓 환불계좌 정보 표시 */}
                {!isTransferredTicket && refundAccounts && refundAccounts.length > 0 && (
                    <div className={`${theme === 'neon' ? 'bg-yellow-950/20' : theme === 'dark' ? 'bg-yellow-950/20' : 'bg-yellow-50'} border ${theme === 'neon' ? 'border-yellow-400/50' : theme === 'dark' ? 'border-yellow-400/50' : 'border-yellow-200'} rounded-lg p-4 space-y-2`}>
                        <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-yellow-200' : theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'} mb-2`}>
                            일반 티켓 환불 계좌
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-yellow-400' : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} text-xs mb-1`}>환불 받는 사람</span>
                                <span className={`font-medium break-words`}>{refundAccounts[0].accountHolder}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-yellow-400' : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} text-xs mb-1`}>환불 은행</span>
                                <span className={`font-medium break-words`}>{refundAccounts[0].bankName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-yellow-400' : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} text-xs mb-1`}>환불 계좌</span>
                                <span className={`font-medium break-words`}>{refundAccounts[0].accountNumber}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-yellow-400' : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} text-xs mb-1`}>입력 일시</span>
                                <span className={`font-medium`}>
                                    {dayjs(refundAccounts[0].createdAt).format('YYYY년 M월 D일 HH:mm')}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-yellow-200">
                            <span className={`${theme === 'neon' ? 'text-yellow-400' : theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} text-xs`}>
                                * 일반 티켓의 환불계좌 정보가 자동으로 입력되었습니다.
                            </span>
                        </div>
                    </div>
                )}

                {/* 환불계좌가 없는 일반 티켓 안내 메시지 */}
                {!isTransferredTicket && (!refundAccounts || refundAccounts.length === 0) && (
                    <div className={`${theme === 'neon' ? 'bg-red-950/20' : theme === 'dark' ? 'bg-red-950/20' : 'bg-red-50'} border ${theme === 'neon' ? 'border-red-400/50' : theme === 'dark' ? 'border-red-400/50' : 'border-red-200'} rounded-lg p-4 space-y-2`}>
                        <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-red-200' : theme === 'dark' ? 'text-red-200' : 'text-red-800'} mb-2`}>
                            환불계좌 정보 없음
                        </h3>
                        <div className="text-sm">
                            <span className={`${theme === 'neon' ? 'text-red-300' : theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                                * 사용자가 환불계좌 정보를 입력하지 않았습니다. 관리자가 직접 입력해주세요.
                            </span>
                        </div>
                    </div>
                )}

                {/* 양도된 티켓 환불계좌 정보 표시 */}
                {isTransferredTicket && refundAccount && (
                    <div className={`${theme === 'neon' ? 'bg-green-950/20' : theme === 'dark' ? 'bg-green-950/20' : 'bg-green-50'} border ${theme === 'neon' ? 'border-green-400/50' : theme === 'dark' ? 'border-green-400/50' : 'border-green-200'} rounded-lg p-4 space-y-2`}>
                        <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-green-200' : theme === 'dark' ? 'text-green-200' : 'text-green-800'} mb-2`}>
                            양도 티켓 환불 계좌
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-green-400' : theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-xs mb-1`}>환불 받는 사람</span>
                                <span className={`font-medium break-words`}>{refundAccount.accountHolder}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-green-400' : theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-xs mb-1`}>환불 은행</span>
                                <span className={`font-medium break-words`}>{refundAccount.bankName}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-green-400' : theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-xs mb-1`}>환불 계좌</span>
                                <span className={`font-medium break-words`}>{refundAccount.accountNumber}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className={`${theme === 'neon' ? 'text-green-400' : theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-xs mb-1`}>입력 일시</span>
                                <span className={`font-medium`}>
                                    {dayjs(refundAccount.createdAt).format('YYYY년 M월 D일 HH:mm')}
                                </span>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-green-200">
                            <span className={`${theme === 'neon' ? 'text-green-400' : theme === 'dark' ? 'text-green-400' : 'text-green-600'} text-xs`}>
                                * 양도된 티켓의 환불계좌 정보가 자동으로 입력되었습니다.
                            </span>
                        </div>
                    </div>
                )}

                {/* 환불 정보 입력 폼 */}
                <RefundForm
                    refundInfo={refundInfo}
                    onRefundInfoChange={handleInputChange}
                    paymentInfo={paymentInfo || null}
                    defaultRefundAmount={defaultRefundAmount}
                    isRefundable={isRefundable}
                />
            </div>

            {/* 액션 버튼 */}
            <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${theme === 'neon' ? 'border-gray-700' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <Button
                    theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'normal'}
                    onClick={handleClose}
                    disabled={createTransactionMutation.isPending}
                    padding="px-3 py-1.5 md:py-1"
                >
                    취소
                </Button>
                {paymentInfo && (
                    <Button
                        theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'dark'}
                        onClick={handleSubmit}
                        disabled={createTransactionMutation.isPending}
                        reverse={theme === 'normal'}
                        padding="px-3 py-1.5 md:py-1"
                    >
                        {createTransactionMutation.isPending ? '저장 중...' : '저장'}
                    </Button>
                )}
            </div>
        </Modal>
    );
};

export default RefundInfoModal;
