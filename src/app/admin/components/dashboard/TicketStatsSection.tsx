'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';
import { motion } from 'framer-motion';

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
  // 테마별 카드 스타일 함수 - 은은한 그라데이션 배경
  const getCardStyle = () => {
    switch (theme) {
      case 'normal':
        return 'bg-gradient-to-br from-orange-50/30 to-amber-50/30 hover:from-orange-50/50 hover:to-amber-50/50';
      
      case 'dark':
        return 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50';
      
      case 'neon':
        return 'bg-gradient-to-br from-orange-500/5 to-amber-500/5 hover:from-orange-500/10 hover:to-amber-500/10';
      
      default:
        return 'bg-white/50 hover:bg-white/70';
    }
  };

  return (
    <div className="space-y-4">
      <motion.h2 
        className={`text-lg font-semibold`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        티켓 현황
      </motion.h2>

      <div className="space-y-4">
        {/* 총 티켓 수 (상단) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {dashboardStats.totalTickets?.toLocaleString() || 0}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>
              총 티켓
            </div>
          </ThemeDiv>
        </motion.div>

        {/* 상단: 사용가능, 사용완료 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {dashboardStats.availableTickets?.toLocaleString() || 0}
              </div>
              <div className={`text-xs ${getLightTextColor()}`}>사용가능</div>
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
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {dashboardStats.usedTickets?.toLocaleString() || 0}
              </div>
              <div className={`text-xs ${getLightTextColor()}`}>사용완료</div>
            </ThemeDiv>
          </motion.div>
        </div>

        {/* 하단: 취소된 티켓, 취소 요청 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {dashboardStats.cancelledTickets?.toLocaleString() || 0}
              </div>
              <div className={`text-xs ${getLightTextColor()}`}>취소완료</div>
            </ThemeDiv>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {dashboardStats.cancelRequestedTickets?.toLocaleString() || 0}
              </div>
              <div className={`text-xs ${getLightTextColor()}`}>취소신청</div>
            </ThemeDiv>
          </motion.div>
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
