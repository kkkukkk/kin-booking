'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';
import { EventStatus } from '@/types/model/events';
import { StatusBadge } from '@/components/status/StatusBadge';
import EventStatsChart from '@/components/charts/EventStatsChart';
import { motion } from 'framer-motion';

interface EventStatsSectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
  getLighterTextColor: () => string;
  getMediumTextColor: () => string;
  getInnerBlockBgColor: () => string;
}

const EventStatsSection = ({
  dashboardStats,
  theme,
  getLightTextColor,
  getLighterTextColor,
  getMediumTextColor,
  getInnerBlockBgColor
}: EventStatsSectionProps) => {
  // 테마별 카드 스타일 함수 - 은은한 그라데이션 배경
  const getCardStyle = () => {
    switch (theme) {
      case 'normal':
        return 'bg-gradient-to-br from-blue-50/30 to-indigo-50/30 hover:from-blue-50/50 hover:to-indigo-50/50';
      
      case 'dark':
        return 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:from-gray-800/50 hover:to-gray-900/50';
      
      case 'neon':
        return 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5 hover:from-blue-500/10 hover:to-indigo-500/10';
      
      default:
        return 'bg-white/50 hover:bg-white/70';
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <motion.h2 
        className={`text-lg font-semibold`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        공연 통계
      </motion.h2>

      {/* 공연 현황 요약 - 모바일에서 1열, 데스크톱에서 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-4 rounded-lg text-center ${getCardStyle()}`} isChildren>
            <div className="text-xl sm:text-2xl font-bold text-green-600 mb-1">
              {dashboardStats.events.filter(e => e.status === EventStatus.Ongoing).length}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>진행중</div>
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
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
              {dashboardStats.events.filter(e => e.status === EventStatus.Completed).length}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>완료</div>
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
            <div className="text-xl sm:text-2xl font-bold text-gray-600 mb-1">
              {dashboardStats.events.filter(e => e.status === EventStatus.Pending).length}
            </div>
            <div className={`text-xs ${getLightTextColor()}`}>대기</div>
          </ThemeDiv>
        </motion.div>
      </div>

      {/* 공연별 상세 통계 */}
      <div className="space-y-4">
        <motion.h3 
          className={`text-lg font-semibold mb-3`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          공연별 상세
        </motion.h3>

        {dashboardStats.events
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
          .slice(0, 5)
          .map((event, index) => (
            <motion.div
              key={event.eventId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="transition-all duration-300"
            >
              <ThemeDiv className={`p-3 sm:p-4 mb-4 rounded-lg last:mb-0 ${getCardStyle()}`} isChildren>
              {/* 공연명과 상태 */}
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base truncate flex-1 mr-2">{event.eventName}</span>
                <div className="flex-shrink-0 flex items-center">
                  <StatusBadge
                    status={event.status as EventStatus}
                    statusType="event"
                    variant="badge"
                    theme={theme}
                    size="sm"
                    className="max-w-[80px] truncate"
                  />
                </div>
              </div>

              {/* 날짜 */}
              <div className={`text-xs ${getLighterTextColor()} mb-3`}>
                공연일: {new Date(event.eventDate).toLocaleDateString('ko-KR')}
              </div>

              {/* 상세 정보 그리드 - 모바일에서 2x2, 태블릿에서 4열 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* 좌석 정보 */}
                <div className={`p-3 rounded-lg text-center ${getInnerBlockBgColor()}`}>
                  <div className={`${getMediumTextColor()} mb-1 text-xs font-medium`}>좌석 현황</div>
                  <div className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : theme === 'neon' ? 'text-gray-100' : 'text-gray-900'}`}>
                    {event.reservedQuantity}/{event.seatCapacity}
                  </div>
                  <div className={`${getLightTextColor()} text-xs`}>
                    남은 좌석: {event.remainingSeats}석
                  </div>
                </div>

                {/* 예매 현황 */}
                <div className={`p-3 rounded-lg text-center ${getInnerBlockBgColor()}`}>
                  <div className={`${getMediumTextColor()} mb-1 text-xs font-medium`}>예매 현황</div>
                  <div className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : theme === 'neon' ? 'text-gray-100' : 'text-gray-900'}`}>
                    확정: {event.confirmedQuantity}
                  </div>
                  <div className={`${getLightTextColor()} text-xs`}>
                    대기: {event.pendingQuantity}
                  </div>
                </div>

                {/* 수익 정보 */}
                <div className={`p-3 rounded-lg text-center ${getInnerBlockBgColor()}`}>
                  <div className={`${getMediumTextColor()} mb-1 text-xs font-medium`}>수익 정보</div>
                  <div className={`font-bold text-sm ${event.totalRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {event.totalRevenue.toLocaleString()}원
                  </div>
                  <div className={`${getLightTextColor()} text-xs`}>
                    티켓당: {event.ticketPrice.toLocaleString()}원
                  </div>
                </div>

                {/* 비율 정보 */}
                <div className={`p-3 rounded-lg text-center ${getInnerBlockBgColor()}`}>
                  <div className={`${getMediumTextColor()} mb-1 text-xs font-medium`}>비율</div>
                  <div className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : theme === 'neon' ? 'text-gray-100' : 'text-gray-900'}`}>
                    예매율: {event.reservationRate.toFixed(1)}%
                  </div>
                  <div className={`${getLightTextColor()} text-xs`}>
                    취소율: {event.cancellationRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              </ThemeDiv>
            </motion.div>
          ))}

        {dashboardStats.events.length > 5 && (
          <motion.div 
            className={`text-center text-sm ${getLighterTextColor()} pt-2`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            외 {dashboardStats.events.length - 5}개 공연...
          </motion.div>
        )}
      </div>

      {/* 공연별 성과 차트 - 모바일에서 높이 조정 */}
      <div className="mt-6 sm:mt-8">
        <motion.h3 
          className={`text-lg font-semibold mb-4 ${getMediumTextColor()}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          공연별 비교
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          whileHover={{ scale: 1.01, y: -2 }}
          className="transition-all duration-300"
        >
          <ThemeDiv className={`p-3 sm:p-6 rounded-lg ${getCardStyle()}`} isChildren>
            <div className="h-64 sm:h-80">
              <EventStatsChart
                events={dashboardStats.events
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                }
                theme={theme}
              />
            </div>
          </ThemeDiv>
        </motion.div>
      </div>
    </div>
  );
};

export const EventStatsSectionSkeleton = ({
  getSkeletonBgColor,
  getSkeletonTextColor,
  getMediumTextColor,
  getInnerBlockBgColor
}: {
  getSkeletonBgColor: () => string;
  getSkeletonTextColor: () => string;
  getMediumTextColor: () => string;
  getInnerBlockBgColor: () => string;
}) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h2 className={`text-lg font-semibold ${getMediumTextColor()}`}>
        공연 통계
      </h2>

      {/* 공연 현황 요약 - 모바일에서 1열, 데스크톱에서 3열 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>진행중</div>
        </ThemeDiv>

        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>완료</div>
        </ThemeDiv>

        <ThemeDiv className="p-3 sm:p-4 rounded-lg text-center" isChildren>
          <div className={`h-6 sm:h-8 rounded w-16 mx-auto mb-2 animate-pulse ${getSkeletonBgColor()}`}></div>
          <div className={`text-xs ${getSkeletonTextColor()}`}>대기</div>
        </ThemeDiv>
      </div>

      {/* 공연별 상세 통계 */}
      <div className="space-y-4">
        <h3 className={`text-lg font-semibold mb-3 ${getMediumTextColor()}`}>공연별 상세</h3>

        {[...Array(3)].map((_, index) => (
          <ThemeDiv key={index} className="p-3 sm:p-4 mb-4 rounded-lg" isChildren>
            {/* 공연명과 상태 */}
            <div className="flex items-center justify-between mb-3">
              <div className={`h-5 rounded w-32 animate-pulse flex-1 mr-2 ${getSkeletonBgColor()}`}></div>
              <div className={`h-5 rounded w-20 animate-pulse flex-shrink-0 flex items-center ${getSkeletonBgColor()}`}></div>
            </div>

            {/* 날짜 */}
            <div className={`h-3 rounded w-40 mb-3 animate-pulse ${getSkeletonBgColor()}`}></div>

            {/* 상세 정보 그리드 - 모바일에서 2x2, 태블릿에서 4열 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, subIndex) => (
                <div key={subIndex} className={`p-3 rounded-lg text-center ${getInnerBlockBgColor()}`}>
                  <div className={`h-3 rounded w-16 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-20 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-3 rounded w-24 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
              ))}
            </div>
          </ThemeDiv>
        ))}
      </div>

      {/* 차트 스켈레톤 - 모바일에서 높이 조정 */}
      <div className="mt-6 sm:mt-8">
        <h3 className={`text-lg font-semibold mb-4 ${getMediumTextColor()}`}>공연별 비교</h3>
        <ThemeDiv className="p-3 sm:p-6 rounded-lg" isChildren>
          <div className={`h-64 sm:h-80 rounded animate-pulse ${getSkeletonBgColor()}`}></div>
        </ThemeDiv>
      </div>
    </div>
  );
};

export default EventStatsSection;
