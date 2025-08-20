'use client';

import React from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import { DashboardStats } from '@/types/dto/admin';

interface TrendStatsSectionProps {
  dashboardStats: DashboardStats;
  theme: string;
  getLightTextColor: () => string;
  getLighterTextColor: () => string;
}

const TrendStatsSection = ({ 
  dashboardStats, 
  theme, 
  getLightTextColor,
  getLighterTextColor
}: TrendStatsSectionProps) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h2 className={`text-lg font-semibold ${theme === 'neon' ? 'text-green-400' : ''}`}>
        시간별 증감 현황
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dashboardStats.trends?.map((trend, index) => (
          <ThemeDiv key={index} className="p-4 rounded-lg" isChildren>
            <div className="text-center mb-4">
              <div className={`text-base font-semibold mb-1 ${theme === 'dark' ? 'text-gray-300' : theme === 'neon' ? 'text-gray-200' : 'text-gray-700'}`}>
                {trend.period}
              </div>
            </div>
            
            {/* 수익 부분과 예매 부분을 2단으로 분리 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* 수익 부분 (왼쪽) */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>수익</div>
                  <div className="text-base font-bold text-blue-600">
                    +{trend.payment.toLocaleString()}원
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>환불</div>
                  <div className="text-base font-bold text-red-600">
                    -{trend.refund.toLocaleString()}원
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>총수익</div>
                  <div className={`text-base font-bold ${trend.netRevenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.netRevenue >= 0 ? '+' : ''}{trend.netRevenue.toLocaleString()}원
                  </div>
                </div>
                
                {/* 수익 증감률 */}
                <div className="text-center pt-2 border-t border-gray-200">
                  <div className={`text-sm font-medium ${
                    trend.changeRate > 0 ? 'text-green-600' : 
                    trend.changeRate < 0 ? 'text-red-600' : getLightTextColor()
                  }`}>
                    {trend.changeRate > 0 ? '+' : ''}{trend.changeRate}%
                  </div>
                  <div className={`text-xs ${getLighterTextColor()}`}>수익 증감률</div>
                </div>
              </div>
              
              {/* 예매 부분 (오른쪽) */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>예매</div>
                  <div className="text-base font-bold text-green-600">
                    +{trend.reservations}건
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>취소</div>
                  <div className="text-base font-bold text-orange-600">
                    -{trend.cancellations}건
                  </div>
                </div>
                
                {/* 빈 줄 추가하여 수익 부분과 높이 맞춤 */}
                <div className="text-center">
                  <div className={`text-sm font-medium mb-1 ${getLightTextColor()}`}>&nbsp;</div>
                  <div className="text-base font-bold text-transparent">
                    &nbsp;
                  </div>
                </div>
                
                {/* 순증가 건수 */}
                <div className="text-center pt-2 border-t border-gray-200">
                  <div className={`text-sm font-medium ${
                    trend.netReservations > 0 ? 'text-green-600' : 
                    trend.netReservations < 0 ? 'text-red-600' : getLightTextColor()
                  }`}>
                    {trend.netReservations > 0 ? '+' : ''}{trend.netReservations}
                  </div>
                  <div className={`text-xs ${getLighterTextColor()}`}>순증가 건수</div>
                </div>
              </div>
            </div>
          </ThemeDiv>
        ))}
      </div>
    </div>
  );
};

// 스켈레톤 UI - 정적 요소는 그대로 표시
export const TrendStatsSectionSkeleton = ({
  getSkeletonBgColor, 
  getSkeletonTextColor, 
  getMediumTextColor 
}: {
  theme: string;
  getSkeletonBgColor: () => string;
  getSkeletonTextColor: () => string;
  getMediumTextColor: () => string;
}) => {
  return (
    <div className="md:col-span-2 space-y-4">
      <h2 className={`text-lg font-semibold ${getMediumTextColor()}`}>
        시간별 증감 현황
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <ThemeDiv key={index} className="p-4 rounded-lg" isChildren>
            <div className="text-center mb-4">
              <div className={`h-5 rounded w-24 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* 수익 부분 */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-20 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-20 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-20 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center pt-2 border-t border-gray-200">
                  <div className={`h-4 rounded w-16 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-3 rounded w-20 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
              </div>
              
              {/* 예매 부분 */}
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-16 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-16 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center">
                  <div className={`h-3 rounded w-12 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-4 rounded w-16 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
                
                <div className="text-center pt-2 border-t border-gray-200">
                  <div className={`h-4 rounded w-16 mx-auto mb-1 animate-pulse ${getSkeletonBgColor()}`}></div>
                  <div className={`h-3 rounded w-20 mx-auto animate-pulse ${getSkeletonBgColor()}`}></div>
                </div>
              </div>
            </div>
          </ThemeDiv>
        ))}
      </div>
    </div>
  );
};

export default TrendStatsSection;
