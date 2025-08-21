'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';

interface UserStatsSectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
}

const UserStatsSection = ({ 
  dashboardStats, 
  theme, 
  getLightTextColor 
}: UserStatsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
        사용자 현황
      </h2>
      
      <div className="space-y-4">
        {/* 상단: 전체/활성/비활성/활동 사용자 수 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {dashboardStats.users.totalUsers.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>전체</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {dashboardStats.users.activeUsers.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>활성</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-red-600 mb-1">
              {dashboardStats.users.inactiveUsers.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>비활성</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {dashboardStats.users.activityUsers.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>활동</div>
          </ThemeDiv>
        </div>
        
        {/* 하단: 활성비율/활동비율 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {dashboardStats.users.activeUserRate.toFixed(1)}%
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>활성비율</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {dashboardStats.users.activityUserRate.toFixed(1)}%
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>활동비율</div>
          </ThemeDiv>
        </div>
      </div>
    </div>
  );
};

export const UserStatsSectionSkeleton = ({ 
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
        사용자 현황
      </h2>
      
      <div className="space-y-4">
        {/* 상단: 전체/활성/비활성/활동 사용자 수 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>전체</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>활성</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>비활성</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>활동</div>
          </ThemeDiv>
        </div>
        
        {/* 하단: 활성비율/활동비율 */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>활성비율</div>
          </ThemeDiv>
          
          <ThemeDiv className="p-4 rounded-lg text-center" isChildren>
            <div className={`h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
            <div className={`text-xs ${getSkeletonTextColor()}`}>활동비율</div>
          </ThemeDiv>
        </div>
      </div>
    </div>
  );
};

export default UserStatsSection;
