'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { EventStats } from '@/types/dto/admin';

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EventStatsChartProps {
  events: EventStats[];
  theme: string;
}

const EventStatsChart: React.FC<EventStatsChartProps> = ({ events, theme }) => {
  // 테마별 색상 설정
  const getThemeColors = () => {
    switch (theme) {
      case 'dark':
        return {
          text: '#e5e7eb',        // text-gray-200
          lightText: '#9ca3af',   // text-gray-400
          grid: 'rgba(156, 163, 175, 0.1)', // rgba-gray-400
          border: '#374151'       // border-gray-700
        };
      case 'neon':
        return {
          text: '#10b981',        // text-green-500
          lightText: '#34d399',   // text-green-400
          grid: 'rgba(16, 185, 129, 0.1)', // rgba-green-500
          border: '#059669'       // border-green-600
        };
      default:
        return {
          text: '#374151',        // text-gray-700
          lightText: '#6b7280',   // text-gray-500
          grid: 'rgba(55, 65, 81, 0.1)', // rgba-gray-700
          border: '#d1d5db'       // border-gray-300
        };
    }
  };

  const colors = getThemeColors();

  // 차트 데이터 준비
  const chartData = {
    labels: events.map(event => event.eventName),
    datasets: [
      {
        label: '판매율 (%)',
        data: events.map(event => event.reservationRate),
        backgroundColor: 'rgba(34, 197, 94, 0.8)', // 초록색
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        yAxisID: 'y',
        order: 1,
      },
      {
        label: '순수익 (만원)',
        data: events.map(event => Math.round(event.totalRevenue / 10000)),
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // 파란색
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
        order: 2,
      },
      {
        label: '판매된 티켓 (장)',
        data: events.map(event => event.reservedQuantity),
        backgroundColor: 'rgba(168, 85, 247, 0.8)', // 보라색
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 1,
        yAxisID: 'y2',
        order: 3,
      },
    ],
  };

  // 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: colors.text,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.border,
        borderWidth: 1,
        callbacks: {
          label: function (context: { dataset: { label?: string }; datasetIndex: number; parsed: { y: number } }) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              // 판매율은 퍼센트
              label += context.parsed.y + '%';
            } else if (context.datasetIndex === 1) {
              // 순수익은 만원 단위
              label += context.parsed.y + '만원';
            } else {
              // 판매된 티켓은 장 단위
              label += context.parsed.y + '장';
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: colors.text,
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          color: colors.grid,
        },
        border: {
          color: colors.border,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '판매율 (%)',
          color: colors.text,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: colors.lightText,
          font: {
            size: 11,
          },
        },
        grid: {
          color: colors.grid,
        },
        border: {
          color: colors.border,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '순수익 (만원)',
          color: colors.text,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: colors.lightText,
          font: {
            size: 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          color: colors.border,
        },
      },
      y2: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '판매된 티켓 (장)',
          color: colors.text,
          font: {
            size: 12,
            weight: 'bold' as const,
          },
        },
        ticks: {
          color: colors.lightText,
          font: {
            size: 11,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
        border: {
          color: colors.border,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  if (!events || events.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${theme === 'dark' ? 'text-gray-400' : theme === 'neon' ? 'text-gray-300' : 'text-gray-500'}`}>
        공연 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default EventStatsChart;
