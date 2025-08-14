import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { Reservation } from '@/types/model/reservation';
import dayjs from 'dayjs';

interface ReservationInfoProps {
    reservation: Reservation;
    getUserName: (userId: string) => string;
    getEventName: (eventId: string) => string;
    ticketPrice: number;
}

const ReservationInfo = ({
    reservation,
    getUserName,
    getEventName,
    ticketPrice,
}: ReservationInfoProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    return (
        <div className={`${theme === 'neon' ? 'bg-gray-800' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 space-y-2`}>
            <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>예매 정보</h3>
            
            {/* 모바일: 세로 배치, 데스크톱: 2열 배치 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>사용자</span>
                    <span className={`font-medium break-words`}>{getUserName(reservation.userId)}</span>
                </div>
                <div className="flex flex-col">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>공연</span>
                    <span className={`font-medium break-words`}>{getEventName(reservation.eventId)}</span>
                </div>
                <div className="flex flex-col">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>수량</span>
                    <span className={`font-medium`}>{reservation.quantity}매</span>
                </div>
                <div className="flex flex-col">
                    <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>예매일</span>
                    <span className={`font-medium`}>
                        {dayjs(reservation.reservedAt).format('YYYY-MM-DD HH:mm')}
                    </span>
                </div>
            </div>
            
            {/* 받아야 하는 금액 표시 */}
            <div className={`mt-3 pt-3 border-t ${theme === 'neon' ? 'border-gray-600' : theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex flex-col">
                    <span className={`${theme === 'neon' ? 'text-amber-300' : theme === 'dark' ? 'text-amber-300' : 'text-amber-600'} text-xs mb-1 font-medium`}>
                        받아야 하는 금액
                    </span>
                    <span className={`${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-700'} text-lg text-right font-bold`}>
                        {(reservation.quantity * ticketPrice).toLocaleString()}원
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReservationInfo;
