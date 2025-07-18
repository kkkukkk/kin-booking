'use client';

import { useUsers } from '@/hooks/api/useUsers';
import { useEvents } from '@/hooks/api/useEvents';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import { useTicketsByOwnerId } from '@/hooks/api/useTickets';
import { useSession } from '@/hooks/useSession';

const AdminClient = () => {
  const { session } = useSession();
  const { data: usersResponse } = useUsers();
  const { data: eventsResponse } = useEvents();
  const { data: reservations } = useReservationsByUserId(session?.user?.id || '');
  const { data: tickets } = useTicketsByOwnerId(session?.user?.id || '');

  const stats = [
    {
      title: '전체 사용자',
      value: usersResponse?.data?.length || 0,
      color: 'bg-blue-500',
      icon: '👥'
    },
    {
      title: '전체 이벤트',
      value: eventsResponse?.data?.length || 0,
      color: 'bg-green-500',
      icon: '🎭'
    },
    {
      title: '내 예매',
      value: reservations?.data?.length || 0,
      color: 'bg-yellow-500',
      icon: '🎫'
    },
    {
      title: '내 티켓',
      value: tickets?.length || 0,
      color: 'bg-purple-500',
      icon: '🎪'
    }
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">관리자 대시보드</h1>
        <p className="text-gray-400">시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div>
        {'통계 카드'} 
      </div>

      {/* 최근 활동 */}
      <div>
        {'최근 활동'}
      </div>
    </div>
  );
};

export default AdminClient; 