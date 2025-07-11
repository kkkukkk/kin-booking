'use client'

import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { SortConfig, sortOptions } from '@/types/ui/sort';
import Button from '@/components/base/Button';
import { ArrowUpIcon } from '@/components/icon/ArrowIcons';
import clsx from 'clsx';

interface SortSelectorProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  className?: string;
}

const SortSelector = ({ sortConfig, onSortChange, className = '' }: SortSelectorProps) => {
  const theme = useAppSelector(state => state.theme.current);

  const handleFieldChange = (field: string) => {
    onSortChange({
      ...sortConfig,
      field: field as SortConfig['field']
    });
  };

  const handleDirectionChange = () => {
    onSortChange({
      ...sortConfig,
      direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx('flex items-center space-x-2 justify-end', className)}
    >
      {sortOptions.map(option => (
        <Button
          key={option.value}
          theme={theme}
          on={sortConfig.field === option.value}
          onClick={() => handleFieldChange(option.value)}
          padding={"px-4 py-1"}
          fontSize='text-base md:text-lg'
          reverse={theme === "normal"}
        >
          {option.label}
        </Button>
      ))}
      <Button
        theme="dark"
        width="w-8"
        height="h-8"
        padding="p-1"
        reverse={theme === "normal"}
        onClick={handleDirectionChange}
        className="flex items-center justify-center"
        title={sortConfig.direction === 'asc' ? '오름차순' : '내림차순'}
      >
        <motion.span
          animate={{ rotate: sortConfig.direction === 'asc' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <ArrowUpIcon className="w-4 h-4" />
        </motion.span>
      </Button>
    </motion.div>
  );
};

export default SortSelector; 