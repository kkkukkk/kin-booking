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
      
      <div className="grid grid-cols-6 gap-4">
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`text-2xl font-bold mb-1 ${getBlockColor('events')}`}>
            {dashboardStats.events.length}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 공연</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`text-2xl font-bold mb-1 ${getBlockColor('users')}`}>
            {dashboardStats.users.totalUsers.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 사용자</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`text-2xl font-bold mb-1 ${getBlockColor('reservations')}`}>
            {dashboardStats.totalReservations.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`text-2xl font-bold mb-1 ${getBlockColor('tickets')}`}>
            {dashboardStats.totalTickets?.toLocaleString() || 0}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>전체 티켓</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center col-span-2" isChildren>
          <div className={`text-2xl font-bold mb-1 ${getBlockColor('revenue')}`}>
            {dashboardStats.totalRevenue.toLocaleString()}원
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 수익</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

// 스켈레톤 UI - 정적 요소는 그대로 표시
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
      
      <div className="grid grid-cols-6 gap-4">
        {/* 전체 공연 - col-span-1 */}
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 공연</div>
        </ThemeDiv>
        
        {/* 전체 사용자 - col-span-1 */}
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 사용자</div>
        </ThemeDiv>
        
        {/* 총 예매 - col-span-1 */}
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        {/* 전체 티켓 - col-span-1 */}
        <ThemeDiv className="p-4 rounded-lg text-center col-span-1" isChildren>
          <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>전체 티켓</div>
        </ThemeDiv>
        
        {/* 총 수익 - col-span-2 (2배 크기) */}
        <ThemeDiv className="p-4 rounded-lg text-center col-span-2" isChildren>
          <div className={`h-8 rounded w-24 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 수익</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export default OverallSummarySection;
