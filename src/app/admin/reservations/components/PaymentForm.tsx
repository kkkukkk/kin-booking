import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Input from '@/components/base/Input';
import { ChangeEvent } from 'react';

interface PaymentFormProps {
    paymentInfo: {
        depositorName: string;
        amount: number;
        note: string;
    };
    onPaymentInfoChange: (field: string, value: string | number) => void;
}

const PaymentForm = ({
    paymentInfo,
    onPaymentInfoChange,
}: PaymentFormProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    return (
        <div className="space-y-3 md:space-y-4">
            <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>입금 받은 정보</h3>
            
            {/* 모바일: 세로 배치, 데스크톱: 2열 배치 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        입금자 *
                    </label>
                    <Input
                        theme={theme}
                        value={paymentInfo.depositorName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onPaymentInfoChange('depositorName', e.target.value)}
                        placeholder="입금자를 입력하세요"
                        className="w-full"
                    />
                </div>
                
                <div>
                    <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                        금액 *
                    </label>
                    <Input
                        theme={theme}
                        type="text"
                        value={paymentInfo.amount === 0 ? '' : paymentInfo.amount.toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            onPaymentInfoChange('amount', value ? Number(value) : 0);
                        }}
                        placeholder="입금 금액을 입력하세요"
                        className="w-full"
                    />
                </div>
            </div>

            <div>
                <label className={`block text-sm font-medium ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                    메모
                </label>
                <Input
                    theme={theme}
                    value={paymentInfo.note}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onPaymentInfoChange('note', e.target.value)}
                    placeholder="입금 관련 추가 메모를 입력하세요 (선택사항)"
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default PaymentForm;
