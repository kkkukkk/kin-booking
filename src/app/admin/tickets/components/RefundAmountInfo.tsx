import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { PaymentTransaction } from '@/types/model/paymentTransaction';

interface RefundAmountInfoProps {
    ticketCount: number;
    ticketPrice: number;
    paymentInfo: PaymentTransaction | null;
    defaultRefundAmount: number;
}

const RefundAmountInfo = ({
    ticketCount,
    ticketPrice,
    paymentInfo,
    defaultRefundAmount
}: RefundAmountInfoProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    return (
        <div className={`${theme === 'neon' ? 'bg-gray-800' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
            <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                금액 정보
            </h3>
            
            {/* 첫 번째 줄: 기준 금액 */}
            <div className="mb-4">
                <div className="flex flex-col gap-2">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mb-1 font-medium`}>
                        기준 금액 (예매 시점)
                    </span>
                    <span className={`${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg font-bold text-right`}>
                        {(ticketCount * ticketPrice).toLocaleString()}원
                    </span>
                </div>
            </div>
            
            {/* 연한 구분선 */}
            <div className={`${theme === 'neon' ? 'border-gray-600' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} border-t mb-4`}></div>
            
            {/* 두 번째 줄: 입금 금액 / 환불해야 할 금액 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 입금 금액 */}
                <div className="flex flex-col gap-2">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs mb-1 font-medium`}>
                        입금 금액
                    </span>
                    <span className={`${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg font-bold text-right`}>
                        {paymentInfo ? paymentInfo.amount.toLocaleString() : '입금 정보 없음'}
                    </span>
                </div>
                
                {/* 환불해야 할 금액 */}
                <div className="flex flex-col gap-2">
                    <span className={`${theme === 'neon' ? 'text-red-300' : theme === 'dark' ? 'text-red-300' : 'text-red-600'} text-xs mb-1 font-medium`}>
                        환불해야 할 금액
                    </span>
                    <span className={`${theme === 'neon' ? 'text-red-200' : theme === 'dark' ? 'text-red-200' : 'text-red-700'} text-lg font-bold text-right`}>
                        {paymentInfo ? defaultRefundAmount.toLocaleString() : '0'}원
                    </span>
                </div>
            </div>
            
            {/* 입금 정보 없음 안내 */}
            {!paymentInfo && (
                <div className={`mt-3 text-xs ${theme === 'neon' ? 'text-red-300' : theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
                    * 입금 정보가 없어 환불 처리가 불가능합니다.
                </div>
            )}
        </div>
    );
};

export default RefundAmountInfo;
