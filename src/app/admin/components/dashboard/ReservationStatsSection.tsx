'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';

interface ReservationStatsSectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
}

const ReservationStatsSection = ({ 
  dashboardStats, 
  theme, 
  getLightTextColor 
}: ReservationStatsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
        예매 현황
      </h2>
      
      <div className="space-y-4">
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className="text-2xl font-bold text-green-600 mb-1">
            {dashboardStats.totalReservations.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className="text-2xl font-bold text-red-600 mb-1">
            {dashboardStats.totalCancellations.toLocaleString()}
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>총 취소</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {dashboardStats.totalReservations > 0 
              ? ((dashboardStats.totalCancellations / dashboardStats.totalReservations) * 100).toFixed(1)
              : 0}%
          </div>
          <div className={`text-xs ${getLightTextColor()}`}>취소율</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export const ReservationStatsSectionSkeleton = ({
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
        예매 현황
      </h2>
      
      <div className="space-y-4">
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className={`h-8 rounded w-20 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 예매</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className={`h-8 rounded w-20 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>총 취소</div>
        </ThemeDiv>
        
        <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
          <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>취소율</div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export default ReservationStatsSection;
