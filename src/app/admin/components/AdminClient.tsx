'use client';

import React from 'react';
import { useDashboardStats } from '@/hooks/api/useAdmin';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import ThemeDiv from '@/components/base/ThemeDiv';
import UserStatsSection, { UserStatsSectionSkeleton } from './dashboard/UserStatsSection';
import ReservationStatsSection, { ReservationStatsSectionSkeleton } from './dashboard/ReservationStatsSection';
import TicketStatsSection, { TicketStatsSectionSkeleton } from './dashboard/TicketStatsSection';
import EventStatsSection, { EventStatsSectionSkeleton } from './dashboard/EventStatsSection';
import TrendStatsSection, { TrendStatsSectionSkeleton } from './dashboard/TrendStatsSection';
import OverallSummarySection, { OverallSummarySectionSkeleton } from './dashboard/OverallSummarySection';

const AdminClient = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { data: dashboardStats, isLoading, error } = useDashboardStats();

  // 테마별 연한 글씨 색상 클래스
  const getLightTextColor = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-400';
      case 'neon':
        return 'text-gray-300';
      default:
        return 'text-gray-600';
    }
  };

  // 테마별 더 연한 글씨 색상 클래스
  const getLighterTextColor = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-500';
      case 'neon':
        return 'text-gray-400';
      default:
        return 'text-gray-500';
    }
  };

  // 테마별 중간 글씨 색상 클래스
  const getMediumTextColor = () => {
    switch (theme) {
      case 'dark':
        return 'text-gray-300';
      case 'neon':
        return 'text-gray-200';
      default:
        return 'text-gray-700';
    }
  };

  // 테마별 내부 블럭 배경색 클래스
  const getInnerBlockBgColor = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700';
      case 'neon':
        return 'bg-gray-800/50 border-gray-600';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // 테마별 스켈레톤 배경색 클래스
  const getSkeletonBgColor = () => {
    switch (theme) {
      case 'dark': return 'bg-gray-700';
      case 'neon': return 'bg-gray-600';
      default: return 'bg-gray-200';
    }
  };

  // 테마별 스켈레톤 텍스트 색상 클래스
  const getSkeletonTextColor = () => {
    switch (theme) {
      case 'dark': return 'text-gray-400';
      case 'neon': return 'text-gray-300';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <ThemeDiv className="space-y-6 p-6">
        {/* 전체 요약 통계 스켈레톤 - 1x5 레이아웃 */}
        <OverallSummarySectionSkeleton 
          getSkeletonBgColor={getSkeletonBgColor}
          getSkeletonTextColor={getSkeletonTextColor}
          getMediumTextColor={getMediumTextColor}
        />
        
        {/* 하단 섹션들 스켈레톤 - 3열 균등 배치 */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* 사용자 현황 스켈레톤 */}
          <UserStatsSectionSkeleton
            getSkeletonBgColor={getSkeletonBgColor}
            getSkeletonTextColor={getSkeletonTextColor}
            getMediumTextColor={getMediumTextColor}
          />
          
          {/* 예매 현황 스켈레톤 */}
          <ReservationStatsSectionSkeleton 
            getSkeletonBgColor={getSkeletonBgColor}
            getSkeletonTextColor={getSkeletonTextColor}
            getMediumTextColor={getMediumTextColor}
          />
          
          {/* 티켓 현황 스켈레톤 */}
          <TicketStatsSectionSkeleton
            getSkeletonBgColor={getSkeletonBgColor}
            getSkeletonTextColor={getSkeletonTextColor}
            getMediumTextColor={getMediumTextColor}
          />
        </div>
        
        {/* 공연 통계 스켈레톤 */}
        <EventStatsSectionSkeleton
          getSkeletonBgColor={getSkeletonBgColor}
          getSkeletonTextColor={getSkeletonTextColor}
          getMediumTextColor={getMediumTextColor}
          getInnerBlockBgColor={getInnerBlockBgColor}
        />
        
        {/* 시간별 증감 현황 스켈레톤 */}
        <TrendStatsSectionSkeleton 
          theme={theme}
          getSkeletonBgColor={getSkeletonBgColor}
          getSkeletonTextColor={getSkeletonTextColor}
          getMediumTextColor={getMediumTextColor}
        />
      </ThemeDiv>
    );
  }

  if (error) {
    return (
      <ThemeDiv className="h-full p-6">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2 text-red-700">데이터 로딩 실패</h2>
            <p className="text-red-600 mb-4">통계 데이터를 불러올 수 없습니다.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </ThemeDiv>
    );
  }

  if (!dashboardStats) return null;

  return (
    <ThemeDiv className="space-y-6 p-6">
      {/* 전체 요약 통계 - 1x5 레이아웃 (전체 너비) */}
      <OverallSummarySection 
        dashboardStats={dashboardStats}
        theme={theme}
        getLightTextColor={getLightTextColor}
      />

      {/* 하단 섹션들 - 3열 균등 배치 */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* 사용자 현황 */}
        <UserStatsSection 
          dashboardStats={dashboardStats}
          theme={theme}
          getLightTextColor={getLightTextColor}
        />

        {/* 예매 현황 */}
        <ReservationStatsSection 
          dashboardStats={dashboardStats}
          theme={theme}
          getLightTextColor={getLightTextColor}
        />

        {/* 티켓 현황 */}
        <TicketStatsSection 
          dashboardStats={dashboardStats}
          theme={theme}
          getLightTextColor={getLightTextColor}
        />
      </div>

      {/* 공연 통계 차트 */}
      <EventStatsSection 
        dashboardStats={dashboardStats}
        theme={theme}
        getLightTextColor={getLightTextColor}
        getLighterTextColor={getLighterTextColor}
        getMediumTextColor={getMediumTextColor}
        getInnerBlockBgColor={getInnerBlockBgColor}
      />

      {/* 시간별 증감 현황 */}
      <TrendStatsSection 
        dashboardStats={dashboardStats}
        theme={theme}
        getLightTextColor={getLightTextColor}
        getLighterTextColor={getLighterTextColor}
      />
    </ThemeDiv>
  );
};

export default AdminClient; 