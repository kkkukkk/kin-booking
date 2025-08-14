import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Input from '@/components/base/Input';
import { PaymentTransaction } from '@/types/model/paymentTransaction';
import { ChangeEvent } from 'react';

interface RefundFormProps {
    refundInfo: {
        refundAmount: number;
        refundBank: string;
        refundAccount: string;
        refundHolder: string;
        note: string;
    };
    onRefundInfoChange: (field: string, value: string | number) => void;
    paymentInfo: PaymentTransaction | null;
    defaultRefundAmount: number;
    isRefundable: boolean;
}

const RefundForm = ({
    refundInfo,
    onRefundInfoChange,
    paymentInfo,
    defaultRefundAmount,
    isRefundable
}: RefundFormProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    if (!paymentInfo) {
        return (
            <div className={`${theme === 'neon' ? 'bg-red-950/20' : theme === 'dark' ? 'bg-red-950/20' : 'bg-red-50'} border ${theme === 'neon' ? 'border-red-400/50' : theme === 'dark' ? 'border-red-400/50' : 'border-red-200'} rounded-lg p-4`}>
                <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-red-300' : theme === 'dark' ? 'text-red-300' : 'text-red-700'} mb-2`}>입금 정보 없음</h3>
                <p className={`text-sm ${theme === 'neon' ? 'text-red-200' : theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
                    이 예매에 대한 입금 정보가 없습니다. 환불을 위해서는 먼저 입금 정보를 확인해야 합니다.
                </p>
            </div>
        );
    }

    return (
        <div className={`${theme === 'neon' ? 'bg-gray-800' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
            <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                환불 정보 입력
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 환불 은행 */}
                <div>
                    <label className={`block text-xs font-medium ${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        은행
                    </label>
                    <Input
                        type="text"
                        value={refundInfo.refundBank}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onRefundInfoChange('refundBank', e.target.value)}
                        placeholder="환불 은행을 입력하세요"
                        className="w-full"
                    />
                </div>

                {/* 환불 예금주 */}
                <div>
                    <label className={`block text-xs font-medium ${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        이름
                    </label>
                    <Input
                        type="text"
                        value={refundInfo.refundHolder}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onRefundInfoChange('refundHolder', e.target.value)}
                        placeholder="환불 예금주를 입력하세요"
                        className="w-full"
                    />
                </div>

                {/* 환불 계좌번호 */}
                <div>
                    <label className={`block text-xs font-medium ${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        계좌번호
                    </label>
                    <Input
                        type="text"
                        value={refundInfo.refundAccount}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onRefundInfoChange('refundAccount', e.target.value)}
                        placeholder="환불 계좌번호를 입력하세요"
                        className="w-full"
                    />
                </div>

                {/* 환불 금액 */}
                <div>
                    <label className={`block text-xs font-medium ${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        환불 금액
                    </label>
                    <Input
                        type="text"
                        value={refundInfo.refundAmount === 0 ? '' : refundInfo.refundAmount.toString()}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            onRefundInfoChange('refundAmount', value ? Number(value) : 0);
                        }}
                        onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                            // 포커스를 잃었을 때 빈 값이면 0으로 설정
                            if (e.target.value === '') {
                                onRefundInfoChange('refundAmount', 0);
                            }
                        }}
                        placeholder={`환불 정책에 따른 금액: ${defaultRefundAmount.toLocaleString()}원`}
                        className="w-full"
                    />
                    {!isRefundable && (
                        <div className={`mt-1 text-xs ${theme === 'neon' ? 'text-amber-300' : theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                            * 정책상 환불 기간이 지났습니다.
                        </div>
                    )}
                </div>

                {/* 메모 */}
                <div className="md:col-span-2">
                    <label className={`block text-xs font-medium ${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        메모
                    </label>
                    <Input
                        type="text"
                        value={refundInfo.note}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => onRefundInfoChange('note', e.target.value)}
                        placeholder="환불 사유나 기타 메모를 입력하세요"
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default RefundForm;
