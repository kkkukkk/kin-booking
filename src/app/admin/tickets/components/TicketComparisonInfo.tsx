import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import dayjs from 'dayjs';

import { ReservationWithEventDto } from '@/types/dto/reservation';
import { TicketGroupDto } from '@/types/dto/ticket';
import { ReservationStatus, ReservationStatusKo } from '@/types/model/reservation';
import { TicketStatus, TicketStatusKo } from '@/types/model/ticket';

interface TicketComparisonInfoProps {
    reservationInfo: ReservationWithEventDto | null;
    ticketGroup: TicketGroupDto;
}

const TicketComparisonInfo = ({
    reservationInfo,
    ticketGroup
}: TicketComparisonInfoProps) => {
    const theme = useAppSelector((state: RootState) => state.theme.current);

    const hasQuantityDifference = reservationInfo && reservationInfo.quantity !== ticketGroup.ticketCount;

    return (
        <div className={`${theme === 'neon' ? 'bg-gray-800' : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 space-y-3`}>
            <h3 className={`font-semibold text-sm ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>정보 비교</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 예매 시점 정보 */}
                <div className={`${theme === 'neon' ? 'bg-gray-700' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded p-3`}>
                    <h4 className={`text-xs font-medium ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>예매 시점 정보</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>공연명</span>
                            <span className={`font-medium break-words`}>{ticketGroup.eventName}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>예매자</span>
                            <span className={`font-medium break-words`}>{ticketGroup.userName}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>예매 수량</span>
                            <span className={`font-medium`}>{reservationInfo?.quantity || '정보 없음'}장</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>예매 상태</span>
                            <span className={`font-medium`}>{reservationInfo?.status ? ReservationStatusKo[reservationInfo.status as ReservationStatus] || reservationInfo.status : '알 수 없음'}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>예매일</span>
                            <span className={`font-medium`}>
                                {dayjs(ticketGroup.createdAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 현재 보유 티켓 정보 */}
                <div className={`${theme === 'neon' ? 'bg-gray-700' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded p-3`}>
                    <h4 className={`text-xs font-medium ${theme === 'neon' ? 'text-gray-300' : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>현재 보유 티켓</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>현재 소유자</span>
                            <span className={`font-medium break-words`}>{ticketGroup.userName}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>보유 수량</span>
                            <span className={`font-medium`}>{ticketGroup.ticketCount}장</span>
                        </div>
                        <div className="flex flex-col">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>티켓 상태</span>
                            <span className={`font-medium`}>{TicketStatusKo[ticketGroup.status as TicketStatus] || ticketGroup.status}</span>
                        </div>
                        <div className="flex flex-col col-span-2">
                            <span className={`${theme === 'neon' ? 'text-gray-400' : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-xs mb-1`}>취소 신청일</span>
                            <span className={`font-medium`}>
                                {dayjs(ticketGroup.updatedAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* 차이점 안내 */}
            {reservationInfo && hasQuantityDifference && (
                <div className={`${theme === 'neon' ? 'bg-amber-950/20' : theme === 'dark' ? 'bg-amber-950/20' : 'bg-amber-50'} border ${theme === 'neon' ? 'border-amber-400/50' : theme === 'dark' ? 'border-amber-400/50' : 'border-amber-200'} rounded p-3`}>
                    <h4 className={`text-xs font-medium ${theme === 'neon' ? 'text-amber-300' : theme === 'dark' ? 'text-amber-300' : 'text-amber-700'} mb-1`}>티켓 수량 차이 감지</h4>
                    <p className={`text-xs ${theme === 'neon' ? 'text-amber-200' : theme === 'dark' ? 'text-amber-200' : 'text-amber-600'}`}>
                        예매 수량({reservationInfo.quantity}장)과 현재 보유 수량({ticketGroup.ticketCount}장)이 다릅니다.
                        티켓 양도가 발생했을 수 있습니다. 환불 금액 계산 시 주의가 필요합니다.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TicketComparisonInfo;
