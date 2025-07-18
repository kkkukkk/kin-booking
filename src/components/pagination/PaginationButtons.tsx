'use client'

import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { PaginationInfo } from '@/util/pagination/type';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icon/ArrowIcons';
import Button from '@/components/base/Button';
import clsx from 'clsx';

interface PaginationButtonsProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

const PaginationButtons = ({ paginationInfo, onPageChange, className = '' }: PaginationButtonsProps) => {
  const theme = useAppSelector(state => state.theme.current);
  const { page: currentPage, totalPages, hasPrev, hasNext } = paginationInfo;

  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 현재 페이지를 중심으로 좌우 2개씩 표시
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);
      
      // 첫 페이지가 1이 아니면 첫 페이지와 ... 추가
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }
      
      // 현재 페이지 주변 페이지들 추가
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // 마지막 페이지가 totalPages가 아니면 ...과 마지막 페이지 추가
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx('flex items-center justify-center space-x-1', className)}
    >
      {/* 이전 페이지 버튼 */}
      <Button
        theme="dark"
        width="w-8"
        height="h-8"
        padding="p-1"
        reverse={theme === "normal"}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="flex items-center justify-center"
        title="이전 페이지"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </Button>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-2 py-1 text-gray-500 dark:text-gray-400">
              ...
            </span>
          ) : (
            <Button
              theme={currentPage === page ? "neon" : "dark"}
              width="w-8"
              height="h-8"
              padding="p-1"
              reverse={theme === "normal"}
              onClick={() => onPageChange(page as number)}
              className="flex items-center justify-center text-sm font-medium"
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      {/* 다음 페이지 버튼 */}
      <Button
        theme="dark"
        width="w-8"
        height="h-8"
        padding="p-1"
        reverse={theme === "normal"}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="flex items-center justify-center"
        title="다음 페이지"
      >
        <ArrowRightIcon className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default PaginationButtons; 