import clsx from "clsx";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { TicketStatus, TicketStatusKo } from "@/types/model/ticket";
import { FriendStatus, FriendStatusKo } from "@/types/model/friends";
import { ReservationStatus, ReservationStatusKo } from "@/types/model/reservation";
import { UserRoleStatus, UserRoleStatusKo } from "@/types/model/userRole";
import { UserStatus, UserStatusKo } from "@/types/model/user";
import { PaymentType, PaymentTypeKo } from "@/types/model/paymentTransaction";
import { StatusBadgeType } from "@/types/ui/statusBadge";

// 지원하는 상태 타입들
type StatusType = EventStatus | TicketStatus | FriendStatus | ReservationStatus | UserRoleStatus | UserStatus | PaymentType;

// 상태별 색상 정의
const getStatusColors = <T extends StatusType>(status: T, theme: string, variant: 'badge' | 'text' | 'info' = 'badge') => {
  const isDarkTheme = theme === 'dark' || theme === 'neon';

  // EventStatus 색상
  if (status === EventStatus.Ongoing) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600 font-semibold' : 'bg-green-100 text-green-800 border border-green-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === EventStatus.Pending) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-600 font-semibold' : 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }

  if (status === EventStatus.Completed) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300 border border-blue-600 font-semibold' : 'bg-blue-100 text-blue-800 border border-blue-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
    }
  }

  if (status === EventStatus.SoldOut) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600 font-semibold' : 'bg-red-100 text-red-800 border border-red-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }

  // TicketStatus 색상
  if (status === TicketStatus.Active) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600 font-semibold' : 'bg-green-100 text-green-800 border border-green-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === TicketStatus.CancelRequested) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-orange-900/30 text-orange-300 border border-orange-600 font-semibold' : 'bg-orange-100 text-orange-800 border border-orange-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-orange-400' : 'text-orange-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-700';
    }
  }

  if (status === TicketStatus.Cancelled) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600 font-semibold' : 'bg-red-100 text-red-800 border border-red-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }

  if (status === TicketStatus.Used) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300 border border-gray-500 font-semibold' : 'bg-gray-100 text-gray-800 border border-gray-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700';
    }
  }

  if (status === TicketStatus.Transferred) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300 border border-blue-600' : 'bg-blue-100 text-blue-800 border border-blue-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
    }
  }

  // FriendStatus 색상
  if (status === FriendStatus.Pending) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-600' : 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }

  if (status === FriendStatus.Accepted) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600' : 'bg-green-100 text-green-800 border border-green-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === FriendStatus.Rejected) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600' : 'bg-red-100 text-red-800 border border-red-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }

  if (status === FriendStatus.Blocked) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300 border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700';
    }
  }

  if (status === FriendStatus.ReceivedForUI) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300 border border-blue-600' : 'bg-blue-100 text-blue-800 border border-blue-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-700';
    }
  }

  // ReservationStatus 색상
  if (status === ReservationStatus.Pending) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-600' : 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-yellow-400' : 'text-yellow-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-50 text-yellow-700';
    }
  }

  if (status === ReservationStatus.Confirmed) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600' : 'bg-green-100 text-green-800 border border-green-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === ReservationStatus.Voided) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600' : 'bg-red-100 text-red-800 border border-red-300';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-700';
    }
  }

  // 사용자 역할 색상
  if (status === UserRoleStatus.Master) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-purple-900/30 text-purple-300 border border-purple-500 font-semibold' : 'bg-purple-500 text-white border border-purple-600 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-purple-400' : 'text-purple-500';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-purple-900/20 text-purple-300' : 'bg-purple-100 text-purple-700';
    }
  }

  if (status === UserRoleStatus.Manager) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-blue-900/30 text-blue-300 border border-blue-500 font-semibold' : 'bg-blue-500 text-white border border-blue-600 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-blue-400' : 'text-blue-500';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-100 text-blue-700';
    }
  }

  if (status === UserRoleStatus.Member) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-400 border border-green-500 font-semibold' : 'bg-green-500 text-white border border-green-600 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-500';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-100 text-green-700';
    }
  }

  if (status === UserRoleStatus.User) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300 border border-gray-400 font-semibold' : 'bg-gray-500 text-white border border-gray-500 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-500';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  }

  // UserStatus 색상
  if (status === UserStatus.Active) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600 font-semibold' : 'bg-green-100 text-green-800 border border-green-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === UserStatus.Inactive) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300 border border-gray-600 font-semibold' : 'bg-gray-100 text-gray-800 border border-gray-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700';
    }
  }

  if (status === UserStatus.Deleted) {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600 font-semibold' : 'bg-red-100 text-red-800 border border-red-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-red-400' : 'text-red-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-700';
    }
  }

  // PaymentType 색상
  if (status === 'payment') {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-green-900/30 text-green-300 border border-green-600 font-semibold' : 'bg-green-100 text-green-800 border border-green-300 font-semibold';
    } else if (variant === 'text') {
      return isDarkTheme ? 'text-green-400' : 'text-green-600';
    } else if (variant === 'info') {
      return isDarkTheme ? 'bg-green-900/20 text-green-300' : 'bg-green-50 text-green-700';
    }
  }

  if (status === 'refund') {
    if (variant === 'badge') {
      return isDarkTheme ? 'bg-red-900/30 text-red-300 border border-red-600 font-semibold' : 'bg-red-100 text-red-800 border border-red-300 font-semibold';
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

// 상태별 텍스트 정의 (제네릭 타입별)
const getStatusTextByType = <T extends StatusType>(status: T, type: StatusBadgeType): string => {
  switch (type) {
    case 'event':
      return EventStatusKo[status as EventStatus];
    case 'ticket':
      return TicketStatusKo[status as TicketStatus];
    case 'friend':
      return FriendStatusKo[status as FriendStatus];
    case 'reservation':
      return ReservationStatusKo[status as ReservationStatus];
    case 'userRole':
      return UserRoleStatusKo[status as UserRoleStatus];
    case 'user':
      return UserStatusKo[status as UserStatus];
    case 'paymentType':
      return PaymentTypeKo[status as PaymentType];
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
  statusType: StatusBadgeType;
}

export function StatusBadge({
  status,
  theme,
  variant = 'badge',
  size = 'md',
  className = "",
  children,
  statusType
}: StatusBadgeProps) {
  const colorClass = getStatusColors(status, theme, variant);

  // statusType에 따른 텍스트 결정
  const getTypedStatusText = (): string => {
    if (children) return children.toString();
    return getStatusTextByType(status, statusType);
  };

  const statusText = getTypedStatusText();

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
export const getStatusTextColors = <T extends StatusType>(status: T, theme: string) => {
  return getStatusColors(status, theme, 'text');
};

export const getStatusBadgeColors = <T extends StatusType>(status: T, theme: string) => {
  return getStatusColors(status, theme, 'badge');
};

export const getStatusInfoColors = <T extends StatusType>(status: T, theme: string) => {
  return getStatusColors(status, theme, 'info');
}; 