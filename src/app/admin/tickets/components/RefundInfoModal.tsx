'use client';

import { useState, useEffect } from 'react';
import { useCreatePaymentTransaction, usePaymentTransactionsByReservationId } from '@/hooks/api/usePaymentTransactions';
import { useReservations } from '@/hooks/api/useReservations';
import { useEvents } from '@/hooks/api/useEvents';
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

    // 공연 정보 조회 (티켓 가격용)
    const { data: eventsResponse } = useEvents({});
    const eventInfo = eventsResponse?.data?.find(e => e.id === ticketGroup.eventId);
    const ticketPrice = eventInfo?.ticketPrice || 0;

    // 예매 정보 조회
    const { data: reservationData } = useReservations({
        id: ticketGroup.reservationId,
        page: 1,
        size: 1
    });

    const reservationInfo = reservationData?.data?.[0];

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

    // 기본값 설정 (양도된 티켓이면 환불계좌 정보, 아니면 입금 정보)
    const getDefaultValues = () => {
        if (isTransferredTicket && refundAccount) {
            // 양도된 티켓: 환불계좌 정보 사용
            return {
                refundAmount: defaultRefundAmount,
                refundBank: refundAccount.bankName,
                refundAccount: refundAccount.accountNumber,
                refundHolder: refundAccount.accountHolder,
                note: '',
            };
        } else if (paymentInfo) {
            // 일반 티켓: 입금 정보 사용
            return {
                refundAmount: defaultRefundAmount,
                refundBank: paymentInfo.bankName,
                refundAccount: paymentInfo.accountNumber,
                refundHolder: paymentInfo.accountHolder,
                note: '',
            };
        } else {
            return {
                refundAmount: 0,
                refundBank: '',
                refundAccount: '',
                refundHolder: '',
                note: '',
            };
        }
    };

    // 환불 정책에 따른 환불 금액 계산 (취소 신청 시점 기준)
    const calculateRefundAmount = () => {
        if (!paymentInfo) return 0; // 입금 정보가 없으면 환불 불가
        
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
        
        // 환불 금액 계산 (현재 보유 티켓 수 * 티켓 가격 * 환불 비율)
        // 티켓 가격은 paymentInfo.amount / 예매 수량으로 계산
        const originalTicketPrice = paymentInfo.amount / (reservationInfo?.quantity || 1);
        const currentTicketValue = originalTicketPrice * ticketGroup.ticketCount;
        return Math.floor(currentTicketValue * (refundRate.rate / 100));
    };

    // 기본 환불 금액 (정책 적용)
    const defaultRefundAmount = calculateRefundAmount();

    // 환불 가능 여부 확인
    const isRefundable = defaultRefundAmount > 0;

    // 환불 정보 상태
    const [refundInfo, setRefundInfo] = useState(getDefaultValues());

    // 기본값 업데이트 (양도된 티켓의 환불계좌 정보나 입금 정보가 변경되면)
    useEffect(() => {
        setRefundInfo(getDefaultValues());
    }, [refundRequestMapping, refundAccount, paymentInfo, defaultRefundAmount]);

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
                throw new Error('로그인 정보를 찾을 수 없습니다.');
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
                    <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-800'} mb-2`}>환불 정책 안내</h3>
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

                {/* 입금 정보 이력 표시 */}
                {paymentInfo && (
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
                            <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-600">
                                <span className={`${theme === 'neon' ? 'text-blue-400' : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-xs`}>메모: {paymentInfo.note}</span>
                            </div>
                        )}
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
                        <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-600">
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
