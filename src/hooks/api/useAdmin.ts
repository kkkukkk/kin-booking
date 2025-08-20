import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getEventStats, getUserStats } from '@/api/admin';

// 전체 대시보드 통계 조회
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 공연별 통계 조회
export const useEventStats = () => {
  return useQuery({
    queryKey: ['event_stats'],
    queryFn: getEventStats,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 사용자 통계 조회
export const useUserStats = () => {
  return useQuery({
    queryKey: ['user_stats'],
    queryFn: getUserStats,
    staleTime: 5 * 60 * 1000, // 5분
  });
};
