'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';
import { motion } from 'framer-motion';

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
  // 테마별 카드 스타일 함수 - 은은한 그라데이션 배경
  const getCardStyle = () => {
    switch (theme) {
      case 'normal':
        return 'bg-gradient-to-br from-green-50/30 to-emerald-50/30 hover:from-green-50/50 hover:to-emerald-50/50';
      
      case 'dark':
        return 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50';
      
      case 'neon':
        return 'bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10';
      
      default:
        return 'bg-white/50 hover:bg-white/70';
    }
  };

  // 테마별 숫자 색상
  const getNumberColor = () => {
    switch (theme) {
      case 'normal':
        return 'text-green-600';
      case 'dark':
        return 'text-green-400';
      case 'neon':
        return 'text-[var(--neon-green)]';
      default:
        return 'text-green-600';
    }
  };

  // 테마별 라벨 색상
  const getLabelColor = () => {
    switch (theme) {
      case 'normal':
        return 'text-green-700';
      case 'dark':
        return 'text-green-300';
      case 'neon':
        return 'text-[var(--neon-green)]/80';
      default:
        return 'text-green-700';
    }
  };

  return (
    <div className="space-y-4">
      <motion.h2 
        className={`text-lg font-semibold ${theme === 'neon' ? 'text-[var(--neon-green)]' : 'text-green-700'}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        사용자 현황
      </motion.h2>
      
      <div className="space-y-4">
        {/* 상단: 전체/활성/비활성/활동 사용자 수 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.totalUsers.toLocaleString()}
              </div>
              <div className={`text-xs ${getLabelColor()}`}>전체</div>
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
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.activeUsers.toLocaleString()}
              </div>
              <div className={`text-xs ${getLabelColor()}`}>활성</div>
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
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.inactiveUsers.toLocaleString()}
              </div>
              <div className={`text-xs ${getLabelColor()}`}>비활성</div>
            </ThemeDiv>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.activityUsers.toLocaleString()}
              </div>
              <div className={`text-xs ${getLabelColor()}`}>활동</div>
            </ThemeDiv>
          </motion.div>
        </div>
        
        {/* 하단: 활성비율/활동비율 */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.activeUserRate.toFixed(1)}%
              </div>
              <div className={`text-xs ${getLabelColor()}`}>활성비율</div>
            </ThemeDiv>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="transition-all duration-300"
          >
            <ThemeDiv className={`p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
              <div className={`text-2xl font-bold mb-1 ${getNumberColor()}`}>
                {dashboardStats.users.activityUserRate.toFixed(1)}%
              </div>
              <div className={`text-xs ${getLabelColor()}`}>활동비율</div>
            </ThemeDiv>
          </motion.div>
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
