'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';

interface TicketStatsSectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
}

const TicketStatsSection = ({ 
  dashboardStats, 
  theme, 
  getLightTextColor 
}: TicketStatsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
        티켓 현황
      </h2>
      
      <div className="space-y-4">
        {/* 총 티켓 수 (상단) */}
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className="text-2xl font-bold text-indigo-600 mb-1">
            {dashboardStats.totalTickets?.toLocaleString() || 0}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>
            총 티켓
          </div>
        </ThemeDiv>
        
        {/* 상단: 사용가능, 사용완료 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {dashboardStats.availableTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>사용가능</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {dashboardStats.usedTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>사용완료</div>
          </ThemeDiv>
        </div>
        
        {/* 하단: 취소된 티켓, 취소 요청 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {dashboardStats.cancelledTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>취소완료</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {dashboardStats.cancelRequestedTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>취소신청</div>
          </ThemeDiv>
        </div>
      </div>
    </div>
  );
};

export const TicketStatsSectionSkeleton = ({
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
        티켓 현황
      </h2>
      
      <div className="space-y-4">
        {/* 총 티켓 수 */}
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className={`h-8 rounded w-20 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 티켓</div>
        </ThemeDiv>
        
        {/* 상단: 사용가능, 사용완료 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>사용가능</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>사용완료</div>
          </ThemeDiv>
        </div>
        
        {/* 하단: 취소된 티켓, 취소 요청 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>취소완료</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>취소신청</div>
          </ThemeDiv>
        </div>
      </div>
    </div>
  );
};

export default TicketStatsSection;
