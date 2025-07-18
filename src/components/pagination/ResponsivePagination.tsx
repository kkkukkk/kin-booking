'use client'

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PaginationInfo } from '@/util/pagination/type';
import PaginationButtons from '@/components/pagination/PaginationButtons';
import LoadMoreButton from '@/components/pagination/LoadMoreButton';

interface ResponsivePaginationProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
  isLoading?: boolean;
  className?: string;
  loadMoreText?: string;
  loadingText?: string;
  noMoreText?: string;
}

const ResponsivePagination = ({
  paginationInfo,
  onPageChange,
  onLoadMore,
  isLoading = false,
  className = '',
  loadMoreText,
  loadingText,
  noMoreText
}: ResponsivePaginationProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md 브레이크포인트
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // 데이터가 없거나 한 페이지에 모든 데이터가 있는 경우 숨김
  if (paginationInfo.totalPages <= 1) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mt-6 ${className}`}
    >
      {isMobile ? (
        <LoadMoreButton
          hasMore={paginationInfo.hasNext}
          onLoadMore={onLoadMore}
          isLoading={isLoading}
          loadMoreText={loadMoreText}
          loadingText={loadingText}
          noMoreText={noMoreText}
        />
      ) : (
        <PaginationButtons
          paginationInfo={paginationInfo}
          onPageChange={onPageChange}
        />
      )}
    </motion.div>
  );
};

export default ResponsivePagination; 