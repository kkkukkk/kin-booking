import React from 'react';
import clsx from 'clsx';
import UserAvatar from './UserAvatar';
import { Theme } from '@/types/ui/theme';
import { maskEmail } from '@/util/emailMasking';

interface UserInfoProps {
  name: string;
  email: string;
  subtitle?: string;
  theme?: Theme;
  avatarSize?: 'sm' | 'md' | 'lg';
  gradient?: string;
  className?: string;
  rightElement?: React.ReactNode;
  maskEmail?: boolean;
}

const UserInfo = ({
  name,
  email,
  subtitle,
  theme = 'normal',
  avatarSize = 'md',
  gradient,
  className = '',
  rightElement,
  maskEmail: shouldMaskEmail = false
}: UserInfoProps) => {
  // 아바타 크기 조정
  const getResponsiveAvatarSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm': return 'sm';
      case 'md': return 'sm md:md';
      case 'lg': return 'md md:lg';
      default: return 'sm md:md';
    }
  };
  return (
    <div className={`flex items-center gap-3 min-w-0 flex-1 ${className}`}>
      {/* 아바타 */}
      <UserAvatar
        name={name}
        size={getResponsiveAvatarSize(avatarSize)}
        gradient={gradient}
      />

      {/* 사용자 정보 + 오른쪽 엘리먼트 */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm md:text-base truncate">{name}</h4>
          {rightElement && <span className="flex-shrink-0">{rightElement}</span>}
        </div>
        <p className={clsx(
          "text-xs truncate",
          theme === 'normal' ? 'text-gray-600' : 'text-gray-300'
        )}>
          {shouldMaskEmail ? maskEmail(email) : email}
        </p>
        {subtitle && (
          <p className={clsx(
            "text-xs truncate",
            theme === 'normal' ? 'text-gray-500' : 'text-gray-400'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserInfo; 