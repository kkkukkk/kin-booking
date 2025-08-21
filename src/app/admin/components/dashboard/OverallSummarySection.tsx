'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';

interface OverallSummarySectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
}

const OverallSummarySection: React.FC<OverallSummarySectionProps> = ({
  dashboardStats,
  theme,
  getLightTextColor
}) => {
  // 테마별 색상 연계 함수
  const getBlockColor = (blockType: string) => {
    switch (blockType) {
      case 'events':
        return theme === 'dark' ? 'text-blue-300' : theme === 'neon' ? 'text-blue-200' : 'text-blue-500';
      case 'users':
        return theme === 'dark' ? 'text-green-300' : theme === 'neon' ? 'text-green-200' : 'text-green-500';
      case 'reservations':
        return theme === 'dark' ? 'text-purple-300' : theme === 'neon' ? 'text-purple-200' : 'text-purple-500';
      case 'tickets':
        return theme === 'dark' ? 'text-indigo-300' : theme === 'neon' ? 'text-indigo-200' : 'text-indigo-500';
      case 'revenue':
        return theme === 'dark' ? 'text-orange-300' : theme === 'neon' ? 'text-orange-200' : 'text-orange-500';
      default:
        return theme === 'dark' ? 'text-gray-300' : theme === 'neon' ? 'text-gray-200' : 'text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
        전체 통계
      </h2>
      
      {/* 모바일: 2열, 태블릿: 3열, 태블릿: 6열 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('events')}`}>
            {dashboardStats.events.length}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 공연</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('users')}`}>
            {dashboardStats.users.totalUsers.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 사용자</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('reservations')}`}>
            {dashboardStats.totalReservations.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('tickets')}`}>
            {dashboardStats.totalTickets?.toLocaleString() || 0}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 티켓</div>
        </ThemeDiv>
        
        {/* 모바일에서는 전체 너비, 태블릿에서는 1열 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center col-span-2 sm:col-span-1 md:col-span-2" isChildren>
          <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('revenue')}`}>
            {dashboardStats.totalRevenue.toLocaleString()}원
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 수익</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export const OverallSummarySectionSkeleton = ({ 
  getSkeletonBgColor, 
  getSkeletonTextColor, 
  getMediumTextColor 
}: {
  getSkeletonBgColor: () => string;
  getSkeletonTextColor: () => string;
  getMediumTextColor: () => string;
}) => {
  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${getMediumTextColor()}`}>
        전체 통계
      </h2>
      
      {/* 모바일: 2열, 태블릿: 3열, 태블릿: 6열 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {/* 전체 공연 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-12 sm:w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 공연</div>
        </ThemeDiv>
        
        {/* 전체 사용자 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-12 sm:w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 사용자</div>
        </ThemeDiv>
        
        {/* 총 예매 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-12 sm:w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        {/* 전체 티켓 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-12 sm:w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 티켓</div>
        </ThemeDiv>
        
        {/* 총 수익 - 모바일에서는 전체 너비 */}
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center col-span-2 sm:col-span-1 md:col-span-2" isChildren>
          <div className={`h-6 sm:h-8 rounded w-20 sm:w-24 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 수익</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export default OverallSummarySection;
