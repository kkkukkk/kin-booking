'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';
import { motion } from 'framer-motion';

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
  // 섹션별 대표 색상 체계
  const getBlockColor = (blockType: string) => {
    switch (blockType) {
      case 'events':
        return theme === 'dark' ? 'text-blue-400' : theme === 'neon' ? 'text-blue-300' : 'text-blue-600';
      case 'users':
        return theme === 'dark' ? 'text-green-400' : theme === 'neon' ? 'text-green-300' : 'text-green-600';
      case 'reservations':
        return theme === 'dark' ? 'text-purple-400' : theme === 'neon' ? 'text-purple-300' : 'text-purple-600';
      case 'tickets':
        return theme === 'dark' ? 'text-orange-400' : theme === 'neon' ? 'text-orange-300' : 'text-orange-600';
      case 'revenue':
        return theme === 'dark' ? 'text-red-400' : theme === 'neon' ? 'text-red-300' : 'text-red-600';
      default:
        return theme === 'dark' ? 'text-gray-400' : theme === 'neon' ? 'text-gray-300' : 'text-gray-600';
    }
  };

  // 테마별 카드 스타일 함수 - 은은한 그라데이션 배경
  const getCardStyle = () => {
    switch (theme) {
      case 'normal':
        return 'bg-gradient-to-br from-gray-50/30 to-slate-50/30 hover:from-gray-50/50 hover:to-slate-50/50';
      
      case 'dark':
        return 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50';
      
      case 'neon':
        return 'bg-gradient-to-br from-gray-500/5 to-slate-500/5 hover:from-gray-500/10 hover:to-slate-500/10';
      
      default:
        return 'bg-white/50 hover:bg-white/70';
    }
  };

  return (
    <div className="space-y-4">
      <motion.h2 
        className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        전체 통계
      </motion.h2>

      {/* 모바일: 2열, 태블릿: 3열, 태블릿: 6열 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('events')}`}>
              {dashboardStats.events.length}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>전체 공연</div>
          </ThemeDiv>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('users')}`}>
              {dashboardStats.users.totalUsers.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>전체 사용자</div>
          </ThemeDiv>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('reservations')}`}>
              {dashboardStats.totalReservations.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>총 예매</div>
          </ThemeDiv>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('tickets')}`}>
              {dashboardStats.totalTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>전체 티켓</div>
          </ThemeDiv>
        </motion.div>

        {/* 모바일에서는 전체 너비, 태블릿에서는 1열 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300 col-span-2 sm:col-span-1 md:col-span-2"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className={`text-xl sm:text-2xl font-bold mb-1 ${getBlockColor('revenue')}`}>
              {dashboardStats.totalRevenue.toLocaleString()}원
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>총 수익</div>
          </ThemeDiv>
        </motion.div>
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
