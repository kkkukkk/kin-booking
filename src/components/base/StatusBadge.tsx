import clsx from "clsx";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { TicketStatus, TicketStatusKo } from "@/types/model/ticket";
import { FriendStatus, FriendStatusKo } from "@/types/model/friend";

// 지원하는 상태 타입들
type StatusType = EventStatus | TicketStatus | FriendStatus | 'confirmed' | 'pending' | 'cancelled';

// 상태별 색상 정의
const getStatusColors = (status: StatusType, theme: string, variant: 'badge' | 'text' | 'info' = 'badge') => {
  const isDarkTheme = theme === 'dark' || theme === 'neon';
  
  // EventStatus 색상
  if (status === EventStatus.Ongoing) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }
  
  if (status === EventStatus.Pending) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }
  
  if (status === EventStatus.Completed) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
    }
  }
  
  if (status === EventStatus.SoldOut) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }
  
  // TicketStatus 색상
  if (status === TicketStatus.Active) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }
  
  if (status === TicketStatus.CancelRequested) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-orange-900/30 text-orange-300' : 'bg-orange-100 text-orange-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-orange-400' : 'text-orange-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-700';
    }
  }
  
  if (status === TicketStatus.Cancelled) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }
  
  if (status === TicketStatus.Used) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700';
    }
  }
  
  if (status === TicketStatus.Transferred) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
    }
  }
  
  // FriendStatus 색상
  if (status === FriendStatus.Pending) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }
  
  if (status === FriendStatus.Accepted) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }
  
  if (status === FriendStatus.Rejected) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }
  
  if (status === FriendStatus.Blocked) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700';
    }
  }
  
  // 예매 상태 색상
  if (status === 'confirmed') {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }
  
  if (status === 'pending') {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }
  
  if (status === 'cancelled') {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }
  
  // 기본값
  if (variant === 'badge') {
    return isDarkTheme ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700';
  } else if (variant === 'text') {
    return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  } else if (variant === 'info') {
    return isDarkTheme ? 'bg-gray-900/20 text-gray-300' : 'bg-gray-50 text-gray-700';
  }
  
  return '';
};

// 상태별 텍스트 정의
const getStatusText = (status: StatusType): string => {
  // EventStatus
  if (Object.values(EventStatus).includes(status as EventStatus)) {
    return EventStatusKo[status as EventStatus];
  }
  
  // TicketStatus
  if (Object.values(TicketStatus).includes(status as TicketStatus)) {
    return TicketStatusKo[status as TicketStatus];
  }
  
  // FriendStatus
  if (Object.values(FriendStatus).includes(status as FriendStatus)) {
    return FriendStatusKo[status as FriendStatus];
  }
  
  // 예매 상태
  switch (status) {
    case 'confirmed':
      return '확정';
    case 'pending':
      return '대기중';
    case 'cancelled':
      return '취소';
    default:
      return status;
  }
};

interface StatusBadgeProps {
  status: StatusType;
  theme: string;
  variant?: 'badge' | 'text' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ 
  status, 
  theme, 
  variant = 'badge', 
  size = 'md',
  className = "",
  children 
}: StatusBadgeProps) {
  const colorClass = getStatusColors(status, theme, variant);
  const statusText = children || getStatusText(status);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const baseClasses = variant === 'badge' 
    ? 'inline-block rounded-full font-medium'
    : variant === 'info'
    ? 'inline-block rounded-lg font-medium'
    : 'inline-block';
  
  return (
    <span className={clsx(baseClasses, sizeClasses[size], colorClass, className)}>
      {statusText}
    </span>
  );
}

// 편의 함수들
export const getStatusTextColors = (status: StatusType, theme: string) => {
  return getStatusColors(status, theme, 'text');
};

export const getStatusBadgeColors = (status: StatusType, theme: string) => {
  return getStatusColors(status, theme, 'badge');
};

export const getStatusInfoColors = (status: StatusType, theme: string) => {
  return getStatusColors(status, theme, 'info');
}; 