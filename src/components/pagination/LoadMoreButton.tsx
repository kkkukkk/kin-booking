'use client'

import { motion } from 'framer-motion';
import Button from '@/components/base/Button';
import { useAppSelector } from '@/redux/hooks';
import Spinner from '@/components/spinner/Spinner';
import clsx from 'clsx';

interface LoadMoreButtonProps {
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
  className?: string;
  loadMoreText?: string;
  loadingText?: string;
  noMoreText?: string;
}

const LoadMoreButton = ({
  hasMore,
  onLoadMore,
  isLoading = false,
  className = '',
  loadMoreText = '더 보기',
  loadingText = '불러오는 중...',
  noMoreText = '모든 항목을 불러왔습니다'
}: LoadMoreButtonProps) => {
  const theme = useAppSelector(state => state.theme.current);

  if (!hasMore) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-4 ${className}`}
      >
        <span className="text-sm text-gray-500">
          {noMoreText}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex justify-center py-4 ${className}`}
    >
      <Button
        theme="dark"
        width="w-full max-w-xs"
        height="h-12"
        padding="px-6 py-3"
        reverse={theme === "normal"}
        onClick={onLoadMore}
        disabled={isLoading}
        className={clsx(
          "flex items-center justify-center space-x-2 font-medium",
          isLoading && "opacity-75"
        )}
      >
        {isLoading ? (
          <>
            <Spinner size={16} />
            <span>{loadingText}</span>
          </>
        ) : (
          <span>{loadMoreText}</span>
        )}
      </Button>
    </motion.div>
  );
};

export default LoadMoreButton; 