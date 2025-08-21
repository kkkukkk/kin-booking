'use client'

import { Ticket } from '@/types/model/ticket';
import { EventWithCurrentStatus } from '@/types/dto/events';
import ThemeDiv from '@/components/base/ThemeDiv';
import { CalendarIcon } from '@/components/icon/CalendarIcon';
import { TicketIcon } from '@/components/icon/TicketIcon';
import dayjs from 'dayjs';
import { Theme } from '@/types/ui/theme';

interface TransferTicketInfoProps {
    tickets: Ticket[];
    eventInfo?: EventWithCurrentStatus;
    theme: Theme;
}

const TransferTicketInfo = ({ tickets, eventInfo, theme }: TransferTicketInfoProps) => {
    if (!eventInfo || tickets.length === 0) return null;

    const formatEventDate = (dateString: string) => {
        const date = dayjs(dateString);
        return {
            full: date.format('YYYY년 M월 D일 dddd'),
            time: date.format('HH:mm'),
            short: date.format('M월 D일'),
            detailed: date.format('YYYY년 M월 D일'),
            weekday: date.format('ddd')
        };
    };

    const eventDateInfo = formatEventDate(eventInfo.eventDate);

    return (
        <ThemeDiv className="p-4 rounded-lg border" isChildren>
            <h3 className="text-sm font-semibold mb-3 opacity-70">양도할 티켓 정보</h3>

            <div className="space-y-2">
                {/* 공연명 */}
                <h4 className="text-base font-bold line-clamp-2 mr-2">
                    {eventInfo.eventName}
                </h4>

                {/* 공연 정보 */}
                <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-1 opacity-70 flex-shrink-0">
                        <TicketIcon className="w-3 h-3" />
                        <span>{tickets.length}장</span>
                    </div>
                    {/* 날짜 */}
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3 text-gray-400" />
                        <span>{eventDateInfo.detailed}</span>
                        <span className="text-gray-400">({eventDateInfo.weekday})</span>
                        <span className="text-gray-400">{eventDateInfo.time}</span>
                    </div>

                    {/* 가격 */}
                    <div className="flex items-center gap-2">
                        <span className="opacity-70">가격:</span>
                        <span className="font-semibold">
                            {eventInfo.ticketPrice.toLocaleString()}원
                        </span>
                    </div>
                </div>
            </div>
        </ThemeDiv>
    );
};

export default TransferTicketInfo;
