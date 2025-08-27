'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';
import { motion } from 'framer-motion';

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
  // 테마별 카드 스타일 함수 - 은은한 그라데이션 배경
  const getCardStyle = () => {
    switch (theme) {
      case 'normal':
        return 'bg-gradient-to-br from-purple-50/30 to-violet-50/30 hover:from-purple-50/50 hover:to-violet-50/50';
      
      case 'dark':
        return 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50';
      
      case 'neon':
        return 'bg-gradient-to-br from-purple-500/5 to-violet-500/5 hover:from-purple-500/10 hover:to-violet-500/10';
      
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
        예매 현황
      </motion.h2>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {dashboardStats.totalReservations.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>총 예매</div>
          </ThemeDiv>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {dashboardStats.totalCancellations.toLocaleString()}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>총 취소</div>
          </ThemeDiv>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {dashboardStats.totalReservations > 0
                ? ((dashboardStats.totalCancellations / dashboardStats.totalReservations) * 100).toFixed(1)
                : 0}%
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>취소율</div>
          </ThemeDiv>
        </motion.div>
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
