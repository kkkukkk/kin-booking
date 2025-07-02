import React from 'react';
import { TicketStatus } from '@/types/model/ticket';

interface TicketCardProps {
  eventName: string;
  ticketCount: number;
  status: TicketStatus;
  latestCreatedAt?: string;
  eventId?: string;
  onCancelRequest?: (eventId: string) => void;
}

const statusTheme: Record<TicketStatus, { bg: string; border: string; text: string; label: string; icon: string }> = {
  [TicketStatus.Active]: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    label: '사용 가능',
    icon: '✅',
  },
  [TicketStatus.CancelRequested]: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    text: 'text-orange-800',
    label: '취소 신청 중',
    icon: '⏳',
  },
  [TicketStatus.Cancelled]: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    label: '취소 완료',
    icon: '❌',
  },
  [TicketStatus.Used]: {
    bg: 'bg-gray-50',
    border: 'border-gray-300',
    text: 'text-gray-800',
    label: '사용됨',
    icon: '✔️',
  },
  [TicketStatus.Transferred]: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-500',
    label: '양도됨',
    icon: '🔄',
  },
};

const stampText: Record<TicketStatus, string> = {
  [TicketStatus.Cancelled]: '취소됨',
  [TicketStatus.Used]: '사용됨',
  [TicketStatus.Transferred]: '양도됨',
  [TicketStatus.Active]: '',
  [TicketStatus.CancelRequested]: '',
};

const TicketCard: React.FC<TicketCardProps> = ({ eventName, ticketCount, status, latestCreatedAt, eventId, onCancelRequest }) => {
  const theme = statusTheme[status] || statusTheme[TicketStatus.Active];
  const ticketNo = '1234-5678';
  const showStamp = status === TicketStatus.Cancelled || status === TicketStatus.Used || status === TicketStatus.Transferred;
  return (
    <div className="relative max-w-md mx-auto my-4">
      <div
        className={
          `relative metallic-coupon-ticket rounded-2xl shadow-xl border-2 border-dashed border-gray-300 overflow-hidden` +
          ` ${theme.bg}`
        }
        style={{
          background: 'linear-gradient(120deg, #e0e0e0 0%, #bdbdbd 40%, #f5f5f5 100%)',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10), 0 1.5px 0 0 #e5e7eb',
        }}
      >
        {/* 쿠폰형 notch */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-transparent rounded-full border-2 border-dashed border-gray-300 z-10 pointer-events-none"></div>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-transparent rounded-full border-2 border-dashed border-gray-300 z-10 pointer-events-none"></div>
        {/* 스탬프(도장) */}
        {showStamp && (
          <div className="absolute right-6 top-4 z-20 px-4 py-1 bg-red-600/90 text-white font-extrabold text-sm rounded-lg rotate-[-12deg] shadow-lg border-2 border-red-700 tracking-widest select-none pointer-events-none" style={{letterSpacing:'0.15em',textShadow:'0 1px 4px #b91c1c'}}>
            {stampText[status]}
          </div>
        )}
        {/* 상단 */}
        <div className="flex items-center px-6 py-4">
          <div className="flex-1 ml-4">
            <h4 className="text-xl font-extrabold tracking-wider text-gray-800 drop-shadow-sm" style={{textShadow:'0 1px 8px #fff, 0 1px 0 #bdbdbd'}}>{eventName}</h4>
            <div className="text-xs text-gray-500 mt-1 font-mono">티켓번호: {ticketNo}</div>
          </div>
          <span className="font-mono text-lg text-gray-600 drop-shadow-sm" style={{textShadow:'0 1px 8px #fff'}}>{ticketCount}장</span>
        </div>
        {/* 하단 */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">{latestCreatedAt ? new Date(latestCreatedAt).toLocaleDateString('ko-KR') : ''}</div>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-semibold ${theme.bg} ${theme.text} border ${theme.border}`}
              style={{boxShadow:'0 1px 4px #fff'}}>
              <span>{theme.icon}</span>
              {theme.label}
            </span>
          </div>
          {status === TicketStatus.Active && onCancelRequest && eventId && (
            <button
              className="ml-4 px-4 py-2 text-sm bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded shadow hover:brightness-110 border border-yellow-700"
              style={{textShadow:'0 1px 4px #fff'}}
              onClick={() => onCancelRequest(eventId)}
            >
              취소 신청
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard; 