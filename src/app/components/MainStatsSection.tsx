'use client';

import { motion } from 'framer-motion';
import { EventStatus } from '@/types/model/events';
import StatsCard from '@/components/StatsCard';

interface MainStatsSectionProps {
  openEventsCount: number;
  waitingEventsCount: number;
  onNavigateToEvents: (status: EventStatus) => void;
}

const MainStatsSection = ({ 
  openEventsCount, 
  waitingEventsCount, 
  onNavigateToEvents 
}: MainStatsSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-16"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-sm">
            공연 현황
          </h2>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <StatsCard
            count={openEventsCount}
            title="예매 진행 중인 공연"
            description="오래 기다렸어요! 이제 함께할 차례예요!"
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/10 before:to-emerald-500/10"
            delay={0.6}
            onClick={() => onNavigateToEvents(EventStatus.Ongoing)}
          />

          <StatsCard
            count={waitingEventsCount}
            title="준비 중인 공연"
            description="곧 만나게 될 특별한 순간을 기다리는 중..."
            className="bg-gradient-to-br from-teal-600/20 to-cyan-600/20 before:absolute before:inset-0 before:bg-gradient-to-br before:from-teal-500/10 before:to-cyan-500/10"
            delay={0.7}
            onClick={() => onNavigateToEvents(EventStatus.Pending)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MainStatsSection; 