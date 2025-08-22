'use client';

import { useState } from 'react';
import { useCreatePaymentTransaction } from '@/hooks/api/usePaymentTransactions';
import { useEventById } from '@/hooks/api/useEvents';
import { Reservation } from '@/types/model/reservation';
import Modal from '@/components/Modal';
import Button from '@/components/base/Button';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useToast from '@/hooks/useToast';
import { useSpinner } from '@/hooks/useSpinner';
import { useSession } from '@/hooks/useSession';

// 분리된 컴포넌트들
import ReservationInfo from './ReservationInfo';
import PaymentForm from './PaymentForm';
import ReservationSeatInfo from '@/app/events/[eventId]/components/ReservationSeatInfo';

interface PaymentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  onSuccess: () => void;
  getUserName: (userId: string) => string;
  getEventName: (eventId: string) => string;
  ticketPrice: number;
}

const PaymentInfoModal = ({
  isOpen,
  onClose,
  reservation,
  onSuccess,
  getUserName,
  getEventName,
  ticketPrice,
}: PaymentInfoModalProps) => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { showToast } = useToast();
  const { showSpinner, hideSpinner } = useSpinner();
  const { session } = useSession();

  // 이벤트 정보 조회 (좌석 정보 포함)
  const { data: eventData } = useEventById(reservation.eventId);

  // 입금 받은 정보 상태
  const [paymentInfo, setPaymentInfo] = useState({
    depositorName: '',
    bankName: '',
    accountNumber: '',
    amount: 0, // 기본값: 0원
    note: '',
  });

  // 거래 이력 생성
  const createTransactionMutation = useCreatePaymentTransaction();

  // 입력 핸들러
  const handleInputChange = (field: string, value: string | number) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  // 입금 정보 저장
  const handleSubmit = async () => {
    // 유효성 검사
    if (!paymentInfo.depositorName.trim()) {
      showToast({ message: '입금자명을 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
      return;
    }
    if (!paymentInfo.bankName.trim()) {
      showToast({ message: '은행명을 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
      return;
    }
    if (!paymentInfo.accountNumber.trim()) {
      showToast({ message: '계좌번호를 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
      return;
    }
    if (paymentInfo.amount <= 0) {
      showToast({ message: '입금 금액을 입력해주세요.', iconType: 'error', autoCloseTime: 3000 });
      return;
    }

    showSpinner();
    
    try {
      if (!session?.user?.id) {
        throw new Error('로그인 정보를 찾을 수 없습니다.');
      }

      await createTransactionMutation.mutateAsync({
        reservationId: reservation.id,
        userId: reservation.userId,
        eventId: reservation.eventId,
        paymentType: 'payment',
        amount: paymentInfo.amount,
        bankName: paymentInfo.bankName,
        accountNumber: paymentInfo.accountNumber,
        accountHolder: paymentInfo.depositorName,
        note: paymentInfo.note,
        operatorId: session.user.id,
      });

      hideSpinner();
      
      onSuccess();
      onClose();
    } catch (error) {
      hideSpinner();
      showToast({ 
        message: `입금 받은 정보 저장에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, 
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
      <div className="space-y-6">
        {/* 제목 */}
        <div className="text-center mb-6">
          <h2 className={`text-xl font-bold ${theme === 'neon' ? 'text-cyan-400' : theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            입금 정보 입력
          </h2>
        </div>

        {/* 예매 정보 표시 */}
        <ReservationInfo
            reservation={reservation}
            getUserName={getUserName}
            getEventName={getEventName}
            ticketPrice={ticketPrice}
        />

        {/* 좌석 현황 정보 */}
        {eventData && (
          <div className="space-y-3">
            <ReservationSeatInfo
              seatCapacity={eventData.seatCapacity}
              reservedQuantity={eventData.reservedQuantity}
              remainingQuantity={eventData.remainingQuantity}
              theme={theme}
            />
          </div>
        )}

        {/* 입금 받은 정보 입력 폼 */}
        <PaymentForm
            paymentInfo={paymentInfo}
            onPaymentInfoChange={handleInputChange}
        />
      </div>

      {/* 액션 버튼 */}
      <div className={`flex justify-end gap-3 mt-6 pt-4 border-t ${theme === 'neon' ? 'border-gray-700' : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <Button
          padding="px-3 py-1.5 md:py-1"
          theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'normal'}
          onClick={handleClose}
          disabled={createTransactionMutation.isPending}
          className="font-semibold"
        >
          취소
        </Button>
        <Button
          padding="px-3 py-1.5 md:py-1"
          theme={theme === 'neon' ? 'neon' : theme === 'dark' ? 'dark' : 'dark'}
          onClick={handleSubmit}
          disabled={createTransactionMutation.isPending}
          reverse={theme === 'normal'}
          className="font-semibold"
        >
          {createTransactionMutation.isPending ? '저장 중...' : '저장'}
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentInfoModal;
