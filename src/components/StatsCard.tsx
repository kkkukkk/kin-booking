'use client';

import { motion } from 'framer-motion';

interface StatsCardProps {
  count: number;
  title: string;
  description: string;
  className?: string;
  delay: number;
  onClick: () => void;
}

const StatsCard = ({
  count,
  title,
  description,
  className = '',
  delay,
  onClick
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: delay > 0.6 ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 ${className}`}
      onClick={onClick}
    >
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white drop-shadow-sm mb-2">
              {count}
            </div>
            <div className="text-base font-medium text-white tracking-wide">{title}</div>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <div className="w-8 h-8 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-white/50 text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard; 