'use client';

import { useUsers } from '@/hooks/api/useUsers';
import { useEvents } from '@/hooks/api/useEvents';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import { useTicketsByOwnerId } from '@/hooks/api/useTickets';
import { useTicketStats } from '@/hooks/api/useTickets';
import { useSession } from '@/hooks/useSession';
import ThemeDiv from '@/components/base/ThemeDiv';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

const AdminClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { session } = useSession();
  const { data: usersResponse } = useUsers();
  const { data: eventsResponse } = useEvents();
  const { data: reservations } = useReservationsByUserId(session?.user?.id || '');
  const { data: tickets } = useTicketsByOwnerId(session?.user?.id || '');
  const { data: ticketStats, isLoading: statsLoading } = useTicketStats();

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
    <ThemeDiv className="space-y-6 p-4">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'neon' ? 'text-green-400' : ''}`}>
          관리자 대시보드
        </h1>
        <p className="text-gray-400">시스템 현황을 한눈에 확인하세요</p>
      </div>

      {/* 기본 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <ThemeDiv key={index} className="p-6 rounded-lg" isChildren>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`text-3xl ${stat.color} rounded-full p-3`}>
                {stat.icon}
              </div>
            </div>
          </ThemeDiv>
        ))}
      </div>

      {/* 티켓 상세 통계 */}
      <div className="space-y-4">
        <h2 className={`text-xl font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
          티켓 현황
        </h2>
        
        {/* 티켓 기본 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-blue-600 font-bold text-lg dark:text-blue-400">
              {statsLoading ? '-' : ticketStats?.totalGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">총 묶음</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-green-600 font-bold text-lg dark:text-green-400">
              {statsLoading ? '-' : ticketStats?.totalTickets || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">총 티켓</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-emerald-600 font-bold text-lg dark:text-emerald-400">
              {statsLoading ? '-' : ticketStats?.activeGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">활성</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-yellow-600 font-bold text-lg dark:text-yellow-400">
              {statsLoading ? '-' : ticketStats?.cancelRequestedGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">취소 신청</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-red-600 font-bold text-lg dark:text-red-400">
              {statsLoading ? '-' : ticketStats?.cancelledGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">취소됨</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-purple-600 font-bold text-lg dark:text-purple-400">
              {statsLoading ? '-' : ticketStats?.usedGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">사용됨</div>
          </ThemeDiv>
        </div>

        {/* 티켓 상세 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-cyan-600 font-bold text-lg dark:text-cyan-400">
              {statsLoading ? '-' : ticketStats?.transferredGroups || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">양도됨</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-orange-600 font-bold text-lg dark:text-orange-400">
              {statsLoading ? '-' : ticketStats?.cancelRequestedTickets || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">취소 신청 티켓</div>
          </ThemeDiv>
          <ThemeDiv className="p-4 rounded" isChildren>
            <div className="text-indigo-600 font-bold text-lg dark:text-indigo-400">
              {statsLoading ? '-' : ticketStats?.averageTicketsPerGroup || 0}
            </div>
            <div className="text-gray-600 text-sm dark:text-gray-400">평균 티켓/묶음</div>
          </ThemeDiv>
        </div>
      </div>

      {/* 최근 활동 */}
      <div>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'neon' ? 'text-green-400' : ''}`}>
          최근 활동
        </h2>
        <ThemeDiv className="p-6 rounded-lg" isChildren>
          <p className="text-gray-600 dark:text-gray-400">최근 활동 내역이 여기에 표시됩니다.</p>
        </ThemeDiv>
      </div>
    </ThemeDiv>
  );
};

export default AdminClient; 