'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T, index: number) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  theme: string;
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  onRowClick?: (item: T, index: number) => void;
  mobileCardSections?: (item: T, index: number) => {
    firstRow: React.ReactNode;
    secondRow: React.ReactNode;
    actionButton?: React.ReactNode;
  };
}

function DataTable<T>({
  data,
  columns,
  theme,
  isLoading = false,
  emptyMessage = '데이터가 없습니다.',
  loadingMessage = '로딩 중...',
  className = '',
  rowClassName = '',
  headerClassName = '',
  onRowClick,
  mobileCardSections,
}: DataTableProps<T>) {
  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  // 테마별 스타일링
  const getThemeStyles = () => {
    if (theme === 'normal') {
      return {
        container: 'bg-white border border-gray-200 shadow-sm',
        header: headerClassName || 'bg-gray-50',
        row: rowClassName || 'hover:bg-gray-50',
        headerText: 'text-gray-700',
        bodyText: 'text-gray-600',
        divider: 'divide-gray-200',
        card: 'bg-white border border-gray-200 shadow-sm',
        cardHeader: 'text-gray-700',
        cardBody: 'text-gray-600',
      };
    } else if (theme === 'neon') {
      return {
        container: 'bg-black/50 border border-green-500/20 shadow-[0_0_16px_0_rgba(34,197,94,0.25)]',
        header: headerClassName ||'bg-green-500/10',
        row: rowClassName || 'hover:bg-green-500/5',
        headerText: 'text-green-400',
        bodyText: 'text-gray-300',
        divider: 'divide-green-500/10',
        card: 'bg-black/40 border border-green-500/30 backdrop-blur-sm',
        cardHeader: 'text-green-400',
        cardBody: 'text-gray-300',
      };
    } else if (theme === 'dark') {
      return {
        container: 'bg-neutral-900 border border-neutral-700',
        header: headerClassName || 'bg-neutral-800',
        row: rowClassName || 'hover:bg-neutral-800',
        headerText: 'text-white',
        bodyText: 'text-white',
        divider: 'divide-neutral-700',
        card: 'bg-neutral-900 border border-neutral-700',
        cardHeader: 'text-white',
        cardBody: 'text-white/70',
      };
    }
    // fallback
    return {};
  };

  const themeStyles = getThemeStyles();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`rounded-lg overflow-hidden ${themeStyles.container} ${className}`}>
        <div className="px-4 py-8 text-center text-gray-400">
          {loadingMessage}
        </div>
      </div>
    );
  }

  // 빈 상태
  if (data.length === 0) {
    return (
      <div className={`rounded-lg overflow-hidden ${themeStyles.container} ${className}`}>
        <div className="px-4 py-8 text-center text-gray-400">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${themeStyles.container} ${className}`}>
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block h-full overflow-x-auto">
        <div className="h-full overflow-y-auto">
          <div className="h-full">
            <table className="w-full">
              <thead className={themeStyles.header}>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-sm font-medium ${themeStyles.headerText} ${column.className || ''}`}
                      style={{ width: column.width }}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={themeStyles.divider}>
                {data.map((item, index) => (
                  <motion.tr
                    key={index}
                    className={`${themeStyles.row} ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => handleRowClick(item, index)}
                    transition={{ duration: 0.15 }}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm ${themeStyles.bodyText} ${column.className || ''}`}
                      >
                        {column.render(item, index)}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="md:hidden space-y-4 p-4 overflow-y-auto max-h-full">
        {mobileCardSections
          ? data.map((item, index) => {
              const { firstRow, secondRow, actionButton } = mobileCardSections(item, index);
              return (
                <div
                  key={index}
                  className={`${themeStyles.card} rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-200 mb-3 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => handleRowClick(item, index)}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">{firstRow}</div>
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">{secondRow}</div>
                  {actionButton && <div className="flex gap-2 justify-end">{actionButton}</div>}
                </div>
              );
            })
          : data.map((item, index) => (
              <motion.div
                key={index}
                className={`${themeStyles.card} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => handleRowClick(item, index)}
                transition={{ duration: 0.15 }}
              >
                {columns.map((column, colIndex) => (
                  <div key={column.key} className={`flex flex-col ${colIndex < columns.length - 1 ? 'mb-4' : ''}`}>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${themeStyles.cardBody} mb-2 opacity-70`}>
                      {column.header}
                    </div>
                    <div className={`text-sm ${themeStyles.cardBody} ${column.className || ''}`}>
                      {column.render(item, index)}
                    </div>
                  </div>
                ))}
              </motion.div>
            ))}
      </div>
    </div>
  );
}

export default DataTable; 